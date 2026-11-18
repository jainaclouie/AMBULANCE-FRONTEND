import { useEffect, useState } from "react";
import api from "@/lib/axios";
import type { Recommendations } from "@/types";

type Point = { lat: number; lng: number; barangayId: number | null };

// Ranked list of ambulances for a location. Refreshes every 15 s because ambulances keep moving.
export function useRecommendations(point: Point | null) {
  const [data, setData] = useState<Recommendations | null>(null);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 15000);
    return () => window.clearInterval(timer);
  }, []);

  const lat = point?.lat;
  const lng = point?.lng;
  const barangayId = point?.barangayId ?? null;

  useEffect(() => {
    if (lat === undefined || lng === undefined) return;
    let cancelled = false;

    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.post<Recommendations>("/recommendations", { lat, lng, barangay_id: barangayId });
        if (!cancelled) setData(response.data);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 400);

    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [lat, lng, barangayId, tick]);

  return { data, loading };
}
