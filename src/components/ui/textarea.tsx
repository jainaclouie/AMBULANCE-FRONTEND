import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

export function TextArea({ className, error, ...props }: TextAreaProps) {
  return (
    <div>
      <textarea
        className={cn("w-full rounded-[10px] border-[1.5px] bg-white px-3.5 py-3 text-sm", error ? "border-brand-primary" : "border-line-input", className)}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-crit-fg">{error}</p>}
    </div>
  )
}
