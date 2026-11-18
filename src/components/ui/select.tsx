import type { ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
  error?: string;
};

export function Select({ className, error, children, ...props }: SelectProps) {
  return (
    <div>
      <select
        className={cn("h-11 w-full rounded-[10px] border-[1.5px] bg-white px-3 text-sm", error ? "border-brand-primary" : "border-line-input", className)}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-crit-fg">{error}</p>}
    </div>
  )
}
