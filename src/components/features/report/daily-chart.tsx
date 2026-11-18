import { Card } from "@/components/ui/card";

type DailyChartProps = {
  rows: { date: string; count: number }[];
};

// Calls per day as columns. Hover a column to see the date.
export function DailyChart({ rows }: DailyChartProps) {
  const max = Math.max(1, ...rows.map((row) => row.count));

  return (
    <Card className="p-5">
      <h2 className="mb-3 text-base font-bold">Calls per day</h2>
      <div className="flex h-36 items-end gap-1">
        {rows.map((row) => (
          <div key={row.date} className="flex h-full flex-1 flex-col justify-end" title={`${row.date}: ${row.count} call(s)`}>
            <div className="w-full rounded-t bg-brand-primary" style={{ height: `${(row.count / max) * 100}%`, minHeight: row.count ? 4 : 0 }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted">
        <span>{rows[0]?.date}</span>
        <span>{rows[rows.length - 1]?.date}</span>
      </div>
    </Card>
  )
}
