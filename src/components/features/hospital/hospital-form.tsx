import { useState, type SubmitEvent } from "react";
import api, { errorMessage } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ErrorText } from "@/components/common/error-text";
import { LocationPicker } from "@/components/features/map/location-picker";
import type { Hospital } from "@/types";

type HospitalFormProps = {
  hospital?: Hospital;
  onSuccess: () => void;
};

// Add a hospital, or edit one. The location is set by tapping the map.
export function HospitalForm({ hospital, onSuccess }: HospitalFormProps) {
  const [name, setName] = useState(hospital?.name ?? "");
  const [contact, setContact] = useState(hospital?.contact ?? "");
  const [position, setPosition] = useState({ lat: hospital?.lat ?? 10.2555, lng: hospital?.lng ?? 123.948 });
  const [error, setError] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = { name, contact: contact || null, ...position };

    try {
      if (hospital) await api.put(`/admin/hospitals/${hospital.id}`, body);
      else await api.post("/admin/hospitals", body);
      onSuccess();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Field label="Hospital name"><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
      <Field label="Contact number"><Input value={contact} onChange={(e) => setContact(e.target.value)} /></Field>
      <Field label="Location (tap the map or drag the pin)">
        <LocationPicker lat={position.lat} lng={position.lng} onChange={(lat, lng) => setPosition({ lat, lng })} />
      </Field>
      <ErrorText message={error} />
      <Button type="submit">{hospital ? "Save changes" : "Add hospital"}</Button>
    </form>
  )
}
