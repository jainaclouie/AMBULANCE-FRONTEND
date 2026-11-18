import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { DispatchStage } from "@/types";

const steps: { key: DispatchStage | "dispatched"; label: string }[] = [
  { key: "dispatched", label: "Dispatched" },
  { key: "en_route", label: "En route" },
  { key: "on_scene", label: "On scene" },
  { key: "transporting", label: "Transporting" },
  { key: "at_hospital", label: "At hospital" },
];

// Where the trip is now: done steps are teal, the current step is amber
export function TripSteps({ stage }: { stage: DispatchStage | null }) {
  const current = steps.findIndex((s) => s.key === stage);

  return (
    <Card className="flex flex-col gap-3 p-4">
      {steps.map((step, index) => (
        <div key={step.key} className={cn("flex items-center gap-2.5", index > current ? "text-muted" : "text-ink", index === current && "font-bold")}>
          <span className={cn("size-3 rounded-full", index < current ? "bg-brand-teal" : index === current ? "bg-brand-amber" : "bg-line-strong")} />
          {step.label}
        </div>
      ))}
    </Card>
  )
}
