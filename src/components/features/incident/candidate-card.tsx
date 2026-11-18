import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/cn";
import { km, minutes } from "@/lib/format";
import type { Candidate } from "@/types";

type CandidateCardProps = {
  candidate: Candidate;
  selected?: boolean;
  actionLabel?: string;
  onSelect: (candidate: Candidate) => void;
};

// One recommended ambulance: rank, name, last GPS and road travel time
export function CandidateCard({ candidate, selected, onSelect }: CandidateCardProps) {
  const { ambulance } = candidate;

  return (
    <button className="w-full text-left" onClick={() => onSelect(candidate)}>
      <Card className={cn("flex items-center gap-4 p-4", selected && "border-2 border-brand-teal p-[15px]")}>
        <div className={cn("grid size-10 shrink-0 place-items-center rounded-full font-bold text-white", selected ? "bg-brand-teal" : "bg-off-dot")}>
          {candidate.rank}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <b>{ambulance.name}</b>
            {candidate.is_home_unit && <Chip kind="available" dot={false}>Home unit</Chip>}
          </div>
          <span className="text-muted">Brgy. {ambulance.home_barangay} | {ambulance.crew.filter((c) => c.on_duty).length} crew | GPS live</span>
        </div>

        <div className="text-right">
          <div className="text-xl font-bold">{minutes(candidate.eta_seconds)}</div>
          <div className="text-[11px] text-muted">{km(candidate.distance_m)}{candidate.source === "estimate" ? " (estimate)" : ""}</div>
        </div>
      </Card>
    </button>
  )
}
