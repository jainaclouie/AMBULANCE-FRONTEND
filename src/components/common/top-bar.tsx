import type { ReactNode } from "react";
import { NotificationBell } from "@/components/features/notification/notification-bell";

type TopBarProps = {
  title: string;
  children?: ReactNode;
};

export function TopBar({ title, children }: TopBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-line bg-white px-4 lg:px-7">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex items-center gap-3">
        {children}
        <NotificationBell />
      </div>
    </header>
  )
}
