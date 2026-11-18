import { Marker, Polyline } from "react-leaflet";
import { pinIcon } from "@/components/features/map/map-icons";
import type { Incident } from "@/types";

type IncidentLayerProps = {
  incident: Incident;
  showLabel?: boolean;
};

// Patient pin, hospital pin (while transporting) and the route line of one incident
export function IncidentLayer({ incident, showLabel = true }: IncidentLayerProps) {
  const dispatch = incident.dispatch;
  const route = dispatch?.route?.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);

  return (
    <>
      <Marker position={[incident.lat, incident.lng]} icon={pinIcon("patient", "!", showLabel ? "Patient" : undefined)} zIndexOffset={500} />

      {dispatch?.hospital && dispatch.stage === "transporting" && (
        <Marker position={[dispatch.hospital.lat, dispatch.hospital.lng]} icon={pinIcon("hospital", "H", dispatch.hospital.name)} />
      )}

      {route && route.length > 1 && (
        <Polyline positions={route} pathOptions={{ color: "#1d8a8a", weight: 4, dashArray: "8 8" }} />
      )}
    </>
  )
}
