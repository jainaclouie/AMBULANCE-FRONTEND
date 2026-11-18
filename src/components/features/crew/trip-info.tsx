import { Card } from "@/components/ui/card";
import { emergencyLabel, minutes, capitalize } from "@/lib/format";
import type { CrewState } from "@/types";

export function TripInfo({ trip }: { trip: NonNullable<CrewState["trip"]> }) {
  const { incident } = trip;
  const target = trip.stage === "transporting" && trip.hospital ? trip.hospital.name : `Brgy. ${incident.barangay}${incident.address ? `, ${incident.address}` : ""}`;

  return (
    <Card className="flex flex-col gap-1.5 p-4">
      <b className="text-lg">{emergencyLabel[incident.emergency_type]} | {capitalize(incident.priority)}</b>
      <span className="text-muted">{target}</span>
      {trip.route_eta_seconds !== null && <span className="text-muted">ETA {minutes(trip.route_eta_seconds)}</span>}
      {incident.notes && <span className="text-muted">Note: {incident.notes}</span>}
    </Card>
  )
}
