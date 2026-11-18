import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";

type BarRow = { label: string; value: number; note?: string };

type BarListProps = {
  title: string;
  rows: BarRow[];
};

// A simple horizontal bar chart: label, bar, number
export function BarList({ title, rows }: BarListProps) {
  const max = Math.max(1, ...rows.map((row) => row.value));

  return (
    <Card className="flex flex-col gap-3 p-5">
      <h2 className="text-base font-bold">{title}</h2>
      {rows.length === 0 && <EmptyState>No data for this period.</EmptyState>}

      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate">{row.label}</span>
          <div className="h-2.5 flex-1 rounded-full bg-surface-page">
            <div className="h-full rounded-full bg-brand-teal" style={{ width: `${(row.value / max) * 100}%` }} />
          </div>
          <span className="w-24 shrink-0 text-right font-bold">{row.value}{row.note && <span className="ml-1 text-xs font-normal text-muted">{row.note}</span>}</span>
        </div>
      ))}
    </Card>
  )
}
