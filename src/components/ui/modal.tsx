import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-surface-dark/50 lg:items-center lg:p-4" onClick={onClose}>
      <div className="flex h-full w-full flex-col bg-white lg:h-auto lg:max-h-[90vh] lg:max-w-lg lg:rounded-[14px]" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-3">
          <h2 className="text-lg font-bold">{title}</h2>
          <Button variant="tertiary" className="px-0" onClick={onClose}>Close</Button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  )
}
