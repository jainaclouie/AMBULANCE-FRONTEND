import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/common/empty-state";
import { capitalize, emergencyLabel, incidentChip, incidentLabel, priorityChip } from "@/lib/format";
import type { Report } from "@/types";

const headers = ["#", "When", "Type", "Priority", "Barangay", "Ambulance", "Response", "Status"];

export function RecentIncidentsTable({ rows }: { rows: Report["recent"] }) {
  return (
    <Card className="overflow-auto">
      <h2 className="px-5 pt-5 text-base font-bold">Recent incidents</h2>
      <table className="mt-3 w-full min-w-[800px] border-collapse text-left">
        <thead className="bg-surface-subtle text-xs text-muted">
          <tr>{headers.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-line">
              <td className="px-4 py-3">{row.id}</td>
              <td className="px-4 py-3">{new Date(row.created_at).toLocaleString()}</td>
              <td className="px-4 py-3">{emergencyLabel[row.emergency_type]}</td>
              <td className="px-4 py-3"><Chip kind={priorityChip(row.priority)} dot={false}>{capitalize(row.priority)}</Chip></td>
              <td className="px-4 py-3">{row.barangay ?? "-"}</td>
              <td className="px-4 py-3">{row.ambulance_name ?? "-"}</td>
              <td className="px-4 py-3">{row.response_minutes === null ? "-" : `${row.response_minutes} min`}</td>
              <td className="px-4 py-3"><Chip kind={incidentChip(row.status)}>{incidentLabel[row.status]}</Chip></td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <EmptyState>No incidents in this period.</EmptyState>}
    </Card>
  )
}
