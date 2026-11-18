import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ChipKind } from "@/lib/format";

// Figma component: Status Chip (Status = Available | Busy | Offline | Critical, Dot = Yes | No)
type ChipProps = {
  kind: ChipKind;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

const kinds = {
  available: { box: "bg-ok-bg text-ok-fg", dot: "bg-brand-teal" },
  busy: { box: "bg-busy-bg text-busy-fg", dot: "bg-brand-amber" },
  offline: { box: "bg-off-bg text-off-fg", dot: "bg-off-dot" },
  critical: { box: "bg-crit-bg text-crit-fg", dot: "bg-brand-primary" },
}

export function Chip({ kind, dot = true, children, className }: ChipProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap", kinds[kind].box, className)}>
      {dot && <span className={cn("size-2 rounded-full", kinds[kind].dot)} />}
      {children}
    </span>
  )
}
