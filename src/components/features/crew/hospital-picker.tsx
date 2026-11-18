import { cn } from "@/lib/cn";
import type { Hospital } from "@/types";

type HospitalPickerProps = {
  hospitals: Hospital[];
  value: number | null;
  onChange: (id: number) => void;
};

export function HospitalPicker({ hospitals, value, onChange }: HospitalPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <b>Destination hospital</b>
      {hospitals.map((hospital) => (
        <button
          key={hospital.id}
          onClick={() => onChange(hospital.id)}
          className={cn("rounded-[10px] border-[1.5px] bg-white p-3.5 text-left", value === hospital.id ? "border-brand-teal bg-ok-bg" : "border-line-input")}
        >
          {hospital.name}
        </button>
      ))}
    </div>
  )
}
