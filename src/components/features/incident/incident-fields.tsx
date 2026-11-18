import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TextArea } from "@/components/ui/textarea";
import { ChoiceChips } from "@/components/features/incident/choice-chips";
import { LocationPicker } from "@/components/features/map/location-picker";
import { capitalize, emergencyLabel, emergencyTypes, priorities, priorityChip } from "@/lib/format";
import type { Barangay, EmergencyType, Priority } from "@/types";

export type IncidentValues = {
  caller_name: string;
  caller_phone: string;
  barangay_id: number | null;
  address: string;
  lat: number;
  lng: number;
  emergency_type: EmergencyType;
  priority: Priority;
  notes: string;
};

export type IncidentErrors = Partial<Record<"caller_name" | "caller_phone" | "barangay_id", string>>;

type IncidentFieldsProps = {
  values: IncidentValues;
  errors: IncidentErrors;
  barangays: Barangay[];
  onChange: (changes: Partial<IncidentValues>) => void;
};

// The form fields of "New incident"
export function IncidentFields({ values, errors, barangays, onChange }: IncidentFieldsProps) {
  // Moving to another barangay recenters the pin on that barangay
  const handleBarangay = (id: string) => {
    const barangay = barangays.find((b) => b.id === Number(id));
    onChange(barangay ? { barangay_id: barangay.id, lat: barangay.lat, lng: barangay.lng } : { barangay_id: null });
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Caller name">
          <Input value={values.caller_name} error={errors.caller_name} onChange={(e) => onChange({ caller_name: e.target.value })} />
        </Field>
        <Field label="Phone">
          <Input value={values.caller_phone} error={errors.caller_phone} onChange={(e) => onChange({ caller_phone: e.target.value })} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Barangay">
          <Select value={values.barangay_id ?? ""} error={errors.barangay_id} onChange={(e) => handleBarangay(e.target.value)}>
            <option value="">Select barangay</option>
            {barangays.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </Select>
        </Field>
        <Field label="Landmark or address">
          <Input value={values.address} onChange={(e) => onChange({ address: e.target.value })} />
        </Field>
      </div>

      <Field label="Exact location (tap the map or drag the pin)">
        <LocationPicker lat={values.lat} lng={values.lng} onChange={(lat, lng) => onChange({ lat, lng })} />
      </Field>

      <Field label="Emergency type">
        <ChoiceChips
          value={values.emergency_type}
          onChange={(emergency_type) => onChange({ emergency_type })}
          options={emergencyTypes.map((t) => ({ value: t, label: emergencyLabel[t], kind: "critical" as const }))}
        />
      </Field>

      <Field label="Priority">
        <ChoiceChips
          value={values.priority}
          onChange={(priority) => onChange({ priority })}
          options={priorities.map((p) => ({ value: p, label: capitalize(p), kind: priorityChip(p) }))}
        />
      </Field>

      <Field label="Notes">
        <TextArea rows={3} value={values.notes} onChange={(e) => onChange({ notes: e.target.value })} />
      </Field>
    </div>
  )
}
