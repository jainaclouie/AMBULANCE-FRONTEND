import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type StatCardProps = {
  label: string;
  value: number;
  className?: string;
};

export function StatCard({ label, value, className }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-1 p-4">
      <span className="text-muted">{label}</span>
      <b className={cn("text-3xl", className)}>{value}</b>
    </Card>
  )
}
