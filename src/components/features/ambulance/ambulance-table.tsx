import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AmbulanceChip } from "@/components/features/ambulance/ambulance-chip";
import { timeAgo } from "@/lib/format";
import type { Ambulance } from "@/types";

type AmbulanceTableProps = {
  ambulances: Ambulance[];
  onEdit: (ambulance: Ambulance) => void;
  onToggleService: (ambulance: Ambulance) => void;
  onDelete: (ambulance: Ambulance) => void;
};

const headers = ["Unit", "Plate no.", "Home barangay", "Crew on duty", "Status", "Last seen", ""];

export function AmbulanceTable({ ambulances, onEdit, onToggleService, onDelete }: AmbulanceTableProps) {
  return (
    <Card className="overflow-auto">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead className="bg-surface-subtle text-xs text-muted">
          <tr>{headers.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody>
          {ambulances.map((a) => (
            <tr key={a.id} className="border-t border-line">
              <td className="px-4 py-3.5 font-bold">{a.name}</td>
              <td className="px-4 py-3.5">{a.plate_no}</td>
              <td className="px-4 py-3.5">{a.home_barangay ?? "-"}</td>
              <td className="px-4 py-3.5">{a.crew.filter((c) => c.on_duty).map((c) => c.name).join(", ") || "No crew logged in"}</td>
              <td className="px-4 py-3.5"><AmbulanceChip status={a.display_status} /></td>
              <td className="px-4 py-3.5">{timeAgo(a.last_seen_at)}</td>
              <td className="px-4 py-3.5">
                <div className="flex justify-end gap-1">
                  <Button variant="tertiary" size="s" className="px-2" onClick={() => onEdit(a)}>Edit</Button>
                  <Button variant="tertiary" size="s" className="px-2" onClick={() => onToggleService(a)}>
                    {a.status === "out_of_service" ? "Return to service" : "Out of service"}
                  </Button>
                  <Button variant="tertiary" size="s" className="px-2 text-brand-primary" onClick={() => onDelete(a)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
