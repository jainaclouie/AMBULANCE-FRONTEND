import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import type { Hospital } from "@/types";

type HospitalTableProps = {
  hospitals: Hospital[];
  canEdit: boolean;
  onEdit: (hospital: Hospital) => void;
  onDelete: (hospital: Hospital) => void;
};

export function HospitalTable({ hospitals, canEdit, onEdit, onDelete }: HospitalTableProps) {
  const headers = ["Hospital", "Contact", "Location", canEdit ? "" : null].filter((h) => h !== null);

  return (
    <Card className="overflow-auto">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead className="bg-surface-subtle text-xs text-muted">
          <tr>{headers.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody>
          {hospitals.map((h) => (
            <tr key={h.id} className="border-t border-line">
              <td className="px-4 py-3.5 font-bold">{h.name}</td>
              <td className="px-4 py-3.5">{h.contact ?? "-"}</td>
              <td className="px-4 py-3.5">
                <a className="text-brand-teal underline" target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${h.lat},${h.lng}`}>
                  {h.lat.toFixed(4)}, {h.lng.toFixed(4)}
                </a>
              </td>
              {canEdit && (
                <td className="px-4 py-3.5">
                  <div className="flex justify-end gap-1">
                    <Button variant="tertiary" size="s" className="px-2" onClick={() => onEdit(h)}>Edit</Button>
                    <Button variant="tertiary" size="s" className="px-2 text-brand-primary" onClick={() => onDelete(h)}>Delete</Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {hospitals.length === 0 && <EmptyState>No hospitals yet.</EmptyState>}
    </Card>
  )
}
