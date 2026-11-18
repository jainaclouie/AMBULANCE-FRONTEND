import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import api from "@/lib/axios";
import { connectEcho } from "@/lib/echo";
import { playChime, playUrgent, vibrate } from "@/lib/sound";
import { useAuth } from "@/context/auth-state";
import { NotificationContext, type Toast } from "@/context/notification-state";
import type { NotificationItem } from "@/types";

// What the server pushes through the WebSocket
type BroadcastPayload = {
  id: string; title: string; body: string; level?: NotificationItem["level"]; urgent?: boolean; incident_id?: number | null;
}

// Bell list + pop-up toasts + sound. Live through WebSocket, with a 20 s poll as the safety net.
export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seen = useRef(new Set<string>());
  const primed = useRef(false);

  const announce = useCallback((toast: Toast, urgent?: boolean) => {
    setToasts((prev) => [...prev.slice(-3), toast]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== toast.id)), 8000);
    if (urgent) { playUrgent(); vibrate([300, 150, 300]); }
    else if (toast.level === "critical" || toast.level === "warning") playUrgent();
    else playChime();
  }, []);

  const load = useCallback(async (announceNew: boolean) => {
    const { data } = await api.get<{ unread: number; items: NotificationItem[] }>("/notifications");
    for (const item of data.items) {
      if (announceNew && primed.current && !item.read && !seen.current.has(item.id)) {
        announce({ id: item.id, title: item.title, body: item.body, level: item.level });
      }
      seen.current.add(item.id);
    }
    primed.current = true;
    setItems(data.items);
    setUnread(data.unread);
  }, [announce]);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(false);

    // Live: a notification arrives on the user's private channel
    const channelName = `App.Models.User.${user.id}`;
    connectEcho().private(channelName).notification((raw: unknown) => {
      const n = raw as BroadcastPayload;
      if (seen.current.has(n.id)) return;
      seen.current.add(n.id);
      const level = n.level ?? (n.urgent ? "critical" : "info");
      setItems((prev) => [{ id: n.id, title: n.title, body: n.body, level, incident_id: n.incident_id ?? null, read: false, created_at: new Date().toISOString() }, ...prev].slice(0, 30));
      setUnread((count) => count + 1);
      announce({ id: n.id, title: n.title, body: n.body, level }, n.urgent);
    });

    const poll = window.setInterval(() => { void load(true).catch(() => undefined); }, 20000);
    return () => {
      window.clearInterval(poll);
      connectEcho().leave(channelName);
    };
  }, [user, load, announce]);

  const markAllRead = useCallback(async () => {
    await api.post("/notifications/read-all");
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
    setUnread(0);
  }, []);

  const dismissToast = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  const value = useMemo(() => ({ items, unread, toasts, dismissToast, markAllRead }), [items, unread, toasts, dismissToast, markAllRead]);
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

