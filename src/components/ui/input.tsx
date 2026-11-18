import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

// Figma component: Input Field
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <div>
      <input
        className={cn("h-11 w-full rounded-[10px] border-[1.5px] bg-white px-3.5 text-sm", error ? "border-brand-primary" : "border-line-input", className)}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-crit-fg">{error}</p>}
    </div>
  )
}
