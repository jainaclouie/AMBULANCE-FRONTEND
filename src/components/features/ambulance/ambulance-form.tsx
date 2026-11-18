import { useState, type SubmitEvent } from "react";
import api, { errorMessage } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ErrorText } from "@/components/common/error-text";
import type { Ambulance, Barangay } from "@/types";

type AmbulanceFormProps = {
  ambulance?: Ambulance;
  barangays: Barangay[];
  onSuccess: () => void;
};

// Add a new ambulance, or edit an existing one
export function AmbulanceForm({ ambulance, barangays, onSuccess }: AmbulanceFormProps) {
  const [name, setName] = useState(ambulance?.name ?? "");
  const [plateNo, setPlateNo] = useState(ambulance?.plate_no ?? "");
  const [homeBarangay, setHomeBarangay] = useState(String(ambulance?.home_barangay_id ?? ""));
  const [error, setError] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = { name, plate_no: plateNo, home_barangay_id: homeBarangay ? Number(homeBarangay) : null };

    try {
      if (ambulance) await api.put(`/admin/ambulances/${ambulance.id}`, body);
      else await api.post("/admin/ambulances", body);
      onSuccess();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Field label="Unit name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Gabi-01" required /></Field>
      <Field label="Plate no."><Input value={plateNo} onChange={(e) => setPlateNo(e.target.value)} placeholder="ABC 1234" required /></Field>
      <Field label="Home barangay">
        <Select value={homeBarangay} onChange={(e) => setHomeBarangay(e.target.value)}>
          <option value="">No home barangay</option>
          {barangays.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </Select>
      </Field>
      <ErrorText message={error} />
      <Button type="submit">{ambulance ? "Save changes" : "Add ambulance"}</Button>
    </form>
  )
}
