import { AmbulanceChip } from "@/components/features/ambulance/ambulance-chip";
import type { Ambulance } from "@/types";

type CrewHeaderProps = {
  ambulance: Ambulance;
  subtitle: string;
};

export function CrewHeader({ ambulance, subtitle }: CrewHeaderProps) {
  return (
    <header className="flex items-center justify-between bg-surface-dark px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-[18px] text-white">
      <div>
        <b className="text-[17px]">{ambulance.name}</b>
        <span className="block text-xs text-on-dark-muted">{subtitle}</span>
      </div>
      <AmbulanceChip status={ambulance.display_status} />
    </header>
  )
}
