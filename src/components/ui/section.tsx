import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionProps = {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
};

export function Section({ children, className, fullWidth }: SectionProps) {
  return (
    <section className={cn("mx-auto px-4 py-8", fullWidth ? "w-full" : "max-w-7xl", className)}>
      {children}
    </section>
  )
}
