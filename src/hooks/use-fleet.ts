import { useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";
import { connectEcho } from "@/lib/echo";
import type { Ambulance, Incident } from "@/types";

const CLOSED = ["completed", "cancelled"];

function upsert<T extends { id: number }>(list: T[], item: T): T[] {
  const exists = list.some((entry) => entry.id === item.id);
  return exists ? list.map((entry) => (entry.id === item.id ? item : entry)) : [item, ...list];
}

// Live map data: first load by REST, then updates through WebSocket (polling every 15 s as backup)
export function useFleet() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await api.get<{ ambulances: Ambulance[]; incidents: Incident[] }>("/fleet");
    setAmbulances(data.ambulances);
    setIncidents(data.incidents);
    setLoading(false);
  }, []);

  // The WebSocket message has no route line (too big), so fetch the full incident when a trip is active
  const refreshIncident = useCallback(async (id: number) => {
    const { data } = await api.get<Incident>(`/incidents/${id}`);
    setIncidents((prev) => (CLOSED.includes(data.status) ? prev.filter((i) => i.id !== id) : upsert(prev, data)));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load().catch(() => setLoading(false));
    const channel = connectEcho().private("fleet");

    channel.listen(".ambulance.updated", (event: { ambulance: Ambulance }) => {
      setAmbulances((prev) => upsert(prev, event.ambulance));
    });
    channel.listen(".incident.updated", (event: { incident: Incident }) => {
      const incident = event.incident;
      setIncidents((prev) => (CLOSED.includes(incident.status) ? prev.filter((i) => i.id !== incident.id) : upsert(prev, incident)));
      if (incident.dispatch?.status === "accepted") void refreshIncident(incident.id).catch(() => undefined);
    });

    const poll = window.setInterval(() => { void load().catch(() => undefined); }, 15000);
    return () => {
      window.clearInterval(poll);
      connectEcho().leave("fleet");
    };
  }, [load, refreshIncident]);

  return { ambulances, incidents, loading, reload: load };
}
