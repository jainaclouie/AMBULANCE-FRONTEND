import { Card } from "@/components/ui/card";
import { AmbulanceChip } from "@/components/features/ambulance/ambulance-chip";
import type { Ambulance } from "@/types";

// Floating list on the live map: every ambulance and its status
export function AmbulanceList({ ambulances }: { ambulances: Ambulance[] }) {
  return (
    <Card className="absolute top-5 right-5 z-[500] flex max-h-[calc(100%-2.5rem)] w-[280px] max-w-[60%] flex-col gap-3 overflow-auto p-4 shadow-lg">
      <b>Ambulances</b>
      {ambulances.map((ambulance) => (
        <div key={ambulance.id} className="flex items-center justify-between gap-2">
          <span>{ambulance.name}</span>
          <AmbulanceChip status={ambulance.display_status} />
        </div>
      ))}
    </Card>
  )
}
