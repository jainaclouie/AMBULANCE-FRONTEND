import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HospitalPicker } from "@/components/features/crew/hospital-picker";
import type { CrewState, Hospital } from "@/types";

type TripActionsProps = {
  trip: NonNullable<CrewState["trip"]>;
  hospitals: Hospital[];
  busy: boolean;
  onAdvance: (to: string, hospitalId?: number) => void;
};

// The one big button for the current stage, plus Call and Navigate
export function TripActions({ trip, hospitals, busy, onAdvance }: TripActionsProps) {
  const [hospitalId, setHospitalId] = useState<number | null>(null);
  const { incident } = trip;
  const destination = trip.stage === "transporting" && trip.hospital ? trip.hospital : incident;

  return (
    <>
      {trip.stage === "on_scene" && <HospitalPicker hospitals={hospitals} value={hospitalId} onChange={setHospitalId} />}

      {trip.stage === "en_route" && <Button size="l" disabled={busy} onClick={() => onAdvance("on_scene")}>Arrived on scene</Button>}
      {trip.stage === "on_scene" && (
        <>
          <Button size="l" disabled={busy || !hospitalId} onClick={() => onAdvance("transporting", hospitalId ?? undefined)}>Start transport</Button>
          <Button variant="outline" disabled={busy} onClick={() => onAdvance("completed")}>Complete here, no transport</Button>
        </>
      )}
      {trip.stage === "transporting" && <Button size="l" disabled={busy} onClick={() => onAdvance("at_hospital")}>Arrived at hospital</Button>}
      {trip.stage === "at_hospital" && <Button variant="teal" size="l" disabled={busy} onClick={() => onAdvance("completed")}>Complete incident</Button>}

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => { window.location.href = `tel:${incident.caller_phone}`; }}>Call caller</Button>
        <Button variant="outline" className="flex-1" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`, "_blank")}>Navigate</Button>
      </div>
    </>
  )
}
