import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

// Figma component: Button (Kind = Primary | Teal | Outline, Size = S | M | L)
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "teal" | "outline" | "tertiary";
  size?: "s" | "m" | "l";
  children: ReactNode;
}

const variants = {
  primary: "bg-brand-primary text-white hover:brightness-95",
  teal: "bg-brand-teal text-white hover:brightness-95",
  outline: "border-[1.5px] border-line-strong bg-white text-ink hover:bg-surface-subtle",
  tertiary: "text-muted hover:text-ink",
}

const sizes = {
  s: "h-[38px]",
  m: "h-11",
  l: "h-14 text-[17px]",
}

export function Button({ variant = "primary", size = "m", className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[10px] px-5 text-[15px] font-semibold whitespace-nowrap transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
