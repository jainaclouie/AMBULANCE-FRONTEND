import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/cn";
import type { ChipKind } from "@/lib/format";

type Option<T extends string> = { value: T; label: string; kind: ChipKind };

type ChoiceChipsProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

// Pick one option by tapping a chip (emergency type, priority)
export function ChoiceChips<T extends string>({ options, value, onChange }: ChoiceChipsProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button key={option.value} type="button" onClick={() => onChange(option.value)}>
            <Chip dot={false} kind={selected ? option.kind : "offline"} className={cn("px-3.5 py-2 text-[13px]", selected && "outline-2 -outline-offset-2 outline-brand-primary")}>
              {option.label}
            </Chip>
          </button>
        )
      })}
    </div>
  )
}
