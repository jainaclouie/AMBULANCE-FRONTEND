import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import api, { errorMessage } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorText } from "@/components/common/error-text";
import { TopBar } from "@/components/common/top-bar";
import { CandidateCard } from "@/components/features/incident/candidate-card";
import { IncidentFields, type IncidentErrors, type IncidentValues } from "@/components/features/incident/incident-fields";
import { useRecommendations } from "@/hooks/use-recommendations";
import type { Barangay } from "@/types";

const emptyForm: IncidentValues = {
  caller_name: "", caller_phone: "", barangay_id: null, address: "",
  lat: 10.2555, lng: 123.948, emergency_type: "cardiac", priority: "high", notes: "",
};

export default function NewIncidentPage() {
  const navigate = useNavigate();
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [form, setForm] = useState<IncidentValues>(emptyForm);
  const [errors, setErrors] = useState<IncidentErrors>({});
  const [pick, setPick] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<Barangay[]>("/barangays").then((response) => setBarangays(response.data)).catch(() => undefined);
  }, []);

  // Ranked ambulances for the chosen barangay and pin
  const { data } = useRecommendations(form.barangay_id ? { lat: form.lat, lng: form.lng, barangayId: form.barangay_id } : null);
  const candidates = data?.candidates ?? [];
  const selected = candidates[Math.min(pick, candidates.length - 1)];

  // Handle Incident Submission
  const handleCreate = async () => {
    const newErrors: IncidentErrors = {};
    if (!form.caller_name.trim()) newErrors.caller_name = "Caller name is required";
    if (!form.caller_phone.trim()) newErrors.caller_phone = "Phone is required";
    if (!form.barangay_id) newErrors.barangay_id = "Barangay is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaving(true);
    setError("");
    try {
      await api.post("/incidents", { ...form, ambulance_id: selected?.ambulance.id ?? null });
      navigate("/live");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <TopBar title="New incident">
        <Link to="/live"><Button variant="outline" size="s">Cancel</Button></Link>
      </TopBar>

      <div className="flex-1 overflow-auto">
        <div className="flex flex-col items-start gap-7 p-4 lg:flex-row lg:p-8">
          {/* Caller and location */}
          <Card className="w-full p-6 lg:w-[620px] lg:shrink-0">
            <h2 className="mb-4 text-lg font-bold">Caller and location</h2>
            <IncidentFields values={form} errors={errors} barangays={barangays} onChange={(changes) => setForm({ ...form, ...changes })} />
          </Card>

          {/* Recommended ambulances */}
          <div className="flex w-full flex-1 flex-col gap-4">
            {data && data.unavailable_home_units.length > 0 && (
              <div className="rounded-[14px] border border-[#f0d98a] bg-busy-bg p-5 text-[#6b5200]">
                <b className="text-busy-fg">Home unit unavailable</b>
                <p>{data.unavailable_home_units.map((u) => `${u.name} (${u.status.replace("_", " ")})`).join(", ")}. Showing the nearest available units by road travel time.</p>
              </div>
            )}

            <h2 className="text-lg font-bold">Recommended ambulances</h2>
            {!form.barangay_id && <p className="text-muted">Choose a barangay to see the nearest available ambulances.</p>}

            {form.barangay_id && candidates.length === 0 && (
              <div className="rounded-[14px] border border-[#edb0b5] bg-crit-bg p-5 text-crit-fg">
                <b>No ambulance is available</b>
                <p>You can still create the incident. Every dispatcher is alerted to assign a unit or ask a neighboring LGU for help.</p>
              </div>
            )}

            {candidates.map((candidate, index) => (
              <CandidateCard key={candidate.ambulance.id} candidate={candidate} selected={index === Math.min(pick, candidates.length - 1)} onSelect={() => setPick(index)} />
            ))}

            <ErrorText message={error} />
            <div className="flex gap-3">
              {candidates.length > 1 && <Button variant="outline" className="flex-1" onClick={() => setPick((pick + 1) % candidates.length)}>Choose another unit</Button>}
              <Button className="flex-[2]" disabled={saving} onClick={() => void handleCreate()}>
                {selected ? `Assign ${selected.ambulance.name}` : "Create incident"}
              </Button>
            </div>
            <p className="text-[11px] text-muted">The crew has 60 seconds to accept. If they decline or do not answer, the next unit is offered automatically.</p>
          </div>
        </div>
      </div>
    </>
  )
}
