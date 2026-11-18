import { cn } from "@/lib/cn";
import { useNotifications } from "@/context/notification-state";

const borders = {
  info: "border-l-brand-teal",
  success: "border-l-brand-teal",
  warning: "border-l-brand-amber",
  critical: "border-l-brand-primary",
};

// Pop-up messages for new incidents, accepted calls and warnings
export function Toasts() {
  const { toasts, dismissToast } = useNotifications();

  return (
    <div className="fixed right-4 bottom-4 z-[3000] flex w-[340px] max-w-[calc(100vw-2rem)] flex-col gap-2.5" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          onClick={() => dismissToast(toast.id)}
          className={cn("flex flex-col gap-0.5 rounded-[14px] border-l-[5px] bg-surface-dark px-4 py-3.5 text-left text-white shadow-2xl", borders[toast.level])}
        >
          <b>{toast.title}</b>
          <span className="text-on-dark-muted">{toast.body}</span>
        </button>
      ))}
    </div>
  )
}
