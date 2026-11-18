import { useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { ambulanceChip } from "@/lib/format";
import { pinIcon } from "@/components/features/map/map-icons";
import { IncidentLayer } from "@/components/features/map/incident-layer";
import type { Ambulance, Incident } from "@/types";

type FleetMapProps = {
  ambulances: Ambulance[];
  incidents: Incident[];
  selectedId?: number | null;
  showLabels?: boolean;
};

const CORDOVA: [number, number] = [10.2555, 123.948];
const letters = { available: "A", busy: "B", offline: "O", critical: "O" };

// Zooms to fit all pins once, then flies to the incident the dispatcher selects
function ViewController({ ambulances, incidents, selectedId }: FleetMapProps) {
  const map = useMap();
  const fitted = useRef(false);
  const latest = useRef({ ambulances, incidents });

  useEffect(() => {
    latest.current = { ambulances, incidents };
    if (fitted.current) return;
    const points: [number, number][] = [
      ...ambulances.filter((a) => a.lat !== null && a.lng !== null).map((a) => [a.lat!, a.lng!] as [number, number]),
      ...incidents.map((i) => [i.lat, i.lng] as [number, number]),
    ];
    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [60, 60], maxZoom: 15 });
      fitted.current = true;
    }
  }, [map, ambulances, incidents]);

  // Only when the selection changes (not on every GPS update)
  useEffect(() => {
    const selected = latest.current.incidents.find((i) => i.id === selectedId);
    if (selected) map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 14));
  }, [map, selectedId]);

  return null;
}

// Live map: ambulances colored by status, patient pins and the route of every active trip
export function FleetMap({ ambulances, incidents, selectedId, showLabels = true }: FleetMapProps) {
  return (
    <MapContainer center={CORDOVA} zoom={13} className="h-full w-full" zoomControl={false}>
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ViewController ambulances={ambulances} incidents={incidents} selectedId={selectedId} />

      {ambulances.filter((a) => a.lat !== null && a.lng !== null).map((a) => {
        const kind = ambulanceChip(a.display_status);
        return <Marker key={a.id} position={[a.lat!, a.lng!]} icon={pinIcon(kind === "critical" ? "offline" : kind, letters[kind], showLabels ? a.name : undefined)} />
      })}

      {incidents.map((incident) => (
        <IncidentLayer key={incident.id} incident={incident} showLabel={showLabels} />
      ))}
    </MapContainer>
  )
}
