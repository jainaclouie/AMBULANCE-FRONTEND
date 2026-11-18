import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { useNotifications } from "@/context/notification-state";
import { cn } from "@/lib/cn";
import { timeAgo } from "@/lib/format";

export function NotificationBell() {
  const { items, unread, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="relative grid size-10 place-items-center rounded-full border border-line bg-white"
        aria-label={`Notifications, ${unread} unread`}
        onClick={() => setOpen(!open)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand-primary px-1 text-[11px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <Card className="absolute top-12 right-0 z-[1500] max-h-[70vh] w-[340px] max-w-[90vw] overflow-auto p-2 shadow-xl">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="font-bold">Notifications</span>
            {unread > 0 && <Button variant="tertiary" className="h-auto px-0 text-[13px] text-brand-primary" onClick={() => void markAllRead()}>Mark all read</Button>}
          </div>

          {items.length === 0 && <EmptyState>No notifications yet.</EmptyState>}

          {items.map((item) => (
            <div key={item.id} className={cn("flex flex-col gap-0.5 rounded-[10px] p-3", !item.read && "bg-surface-subtle")}>
              <span className="font-bold">{item.title}</span>
              <span className="text-muted">{item.body}</span>
              <span className="text-[11px] text-muted">{timeAgo(item.created_at)}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
