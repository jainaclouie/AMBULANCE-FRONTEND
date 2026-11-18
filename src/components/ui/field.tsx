import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

type FieldProps = {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

// A label above any input, select or textarea
export function Field({ label, error, className, children }: FieldProps) {
  return (
    <div className={className}>
      <Label error={error}>{label}</Label>
      {children}
    </div>
  )
}
