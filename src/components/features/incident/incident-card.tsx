import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/cn";
import { capitalize, emergencyLabel, incidentChip, incidentLabel, priorityBar, priorityChip, timeAgo } from "@/lib/format";
import type { Incident } from "@/types";

type IncidentCardProps = {
  incident: Incident;
  selected?: boolean;
  onSelect: (id: number) => void;
  children?: ReactNode;
};

export function IncidentCard({ incident, selected, onSelect, children }: IncidentCardProps) {
  const status = incidentLabel[incident.status] + (incident.ambulance_name ? `: ${incident.ambulance_name}` : "");

  return (
    <Card className={cn("flex overflow-hidden", selected && "border-brand-teal ring-2 ring-brand-teal/30")}>
      {/* Priority color bar */}
      <div className={cn("w-1 shrink-0", priorityBar[incident.priority])} />

      <div className="min-w-0 flex-1">
        <button className="flex w-full flex-col gap-2 p-4 text-left" onClick={() => onSelect(incident.id)}>
          <div className="flex items-center justify-between gap-2">
            <b>{emergencyLabel[incident.emergency_type]}</b>
            <Chip kind={priorityChip(incident.priority)} dot={false}>{capitalize(incident.priority)}</Chip>
          </div>
          <span className="text-muted">Brgy. {incident.barangay}{incident.address ? `, ${incident.address}` : ""}</span>
          <div className="flex items-center justify-between gap-2">
            <Chip kind={incidentChip(incident.status)}>{status}</Chip>
            <span className="text-[11px] text-muted">{timeAgo(incident.created_at)}</span>
          </div>
        </button>
        {children}
      </div>
    </Card>
  )
}
