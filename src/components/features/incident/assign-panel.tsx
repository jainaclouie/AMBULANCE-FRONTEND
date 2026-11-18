import { useState } from "react";
import api, { errorMessage } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { ErrorText } from "@/components/common/error-text";
import { CandidateCard } from "@/components/features/incident/candidate-card";
import { useRecommendations } from "@/hooks/use-recommendations";
import { minutes } from "@/lib/format";
import type { Incident } from "@/types";

type AssignPanelProps = {
  incident: Incident;
  onChanged: () => void;
};

// Details of the selected incident, with Assign unit and Cancel incident
export function AssignPanel({ incident, onChanged }: AssignPanelProps) {
  const needsUnit = incident.status === "awaiting_unit";
  const canReassign = ["awaiting_unit", "offered", "en_route"].includes(incident.status);
  const [showUnits, setShowUnits] = useState(needsUnit);
  const [error, setError] = useState("");
  const { data } = useRecommendations(showUnits ? { lat: incident.lat, lng: incident.lng, barangayId: incident.barangay_id } : null);

  const run = async (path: string, body?: object) => {
    setError("");
    try {
      await api.post(path, body);
      setShowUnits(false);
      onChanged();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  const handleCancel = () => {
    if (confirm(`Cancel incident #${incident.id}?`)) void run(`/incidents/${incident.id}/cancel`);
  };

  return (
    <div className="space-y-3 border-t border-line p-4 text-[13px]">
      <p>Caller: <b>{incident.caller_name}</b> | {incident.caller_phone}</p>
      {incident.notes && <p className="text-muted">{incident.notes}</p>}
      {incident.dispatch && <p className="text-muted">ETA {minutes(incident.dispatch.route_eta_seconds ?? incident.dispatch.eta_seconds)}</p>}
      <ErrorText message={error} />

      {showUnits && (
        <div className="space-y-2">
          {data?.candidates.length === 0 && <p className="font-semibold text-crit-fg">No ambulance is available right now.</p>}
          {data?.candidates.map((candidate) => (
            <CandidateCard key={candidate.ambulance.id} candidate={candidate} onSelect={(c) => void run(`/incidents/${incident.id}/assign`, { ambulance_id: c.ambulance.id })} />
          ))}
        </div>
      )}

      <div className="flex gap-2">
        {canReassign && <Button size="s" variant="outline" onClick={() => setShowUnits(!showUnits)}>{needsUnit ? "Choose unit" : "Reassign"}</Button>}
        <Button size="s" variant="outline" className="text-brand-primary" onClick={handleCancel}>Cancel incident</Button>
      </div>
    </div>
  )
}
