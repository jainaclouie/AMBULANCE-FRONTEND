import { createContext, useContext } from "react";
import type { NotificationItem } from "@/types";

export type Toast = { id: string; title: string; body: string; level: NotificationItem["level"] };

export type NotificationContextValue = {
  items: NotificationItem[];
  unread: number;
  toasts: Toast[];
  dismissToast: (id: string) => void;
  markAllRead: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used inside NotificationProvider");
  return context;
}
