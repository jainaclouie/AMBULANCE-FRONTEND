import { useEffect, useState } from "react";
import api from "@/lib/axios";

export type GpsStatus = "idle" | "waiting" | "sharing" | "denied" | "unavailable";
export type GpsState = { status: GpsStatus; accuracy: number | null; lastSentAt: number | null };

// The GPS tracker: reads the phone's position and sends it to the server every 10 seconds.
export function useGpsSharing(enabled: boolean): GpsState {
  const [state, setState] = useState<GpsState>({ status: "idle", accuracy: null, lastSentAt: null });

  useEffect(() => {
    if (!enabled || !("geolocation" in navigator)) return;

    let latest: GeolocationPosition | null = null;
    let wakeLock: WakeLockSentinel | null = null;

    // Send the newest position to the server
    const send = async () => {
      if (!latest) return;
      const { latitude, longitude, accuracy, speed } = latest.coords;
      try {
        await api.post("/crew/location", { lat: latitude, lng: longitude, accuracy, speed });
        setState((prev) => ({ ...prev, status: "sharing", lastSentAt: Date.now() }));
      } catch {
        // keep trying on the next tick
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const first = latest === null;
        latest = position;
        setState((prev) => ({ ...prev, accuracy: Math.round(position.coords.accuracy) }));
        if (first) void send();
      },
      (error) => setState((prev) => ({ ...prev, status: error.code === error.PERMISSION_DENIED ? "denied" : "waiting" })),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    );
    const timer = window.setInterval(send, 10000);

    // Keep the screen awake so the phone does not stop sending its position
    navigator.wakeLock?.request("screen").then((lock) => { wakeLock = lock; }).catch(() => undefined);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      window.clearInterval(timer);
      void wakeLock?.release().catch(() => undefined);
    };
  }, [enabled]);

  if (!enabled) return { status: "idle", accuracy: null, lastSentAt: null };
  if (!("geolocation" in navigator)) return { status: "unavailable", accuracy: null, lastSentAt: null };
  return { ...state, status: state.status === "idle" ? "waiting" : state.status };
}
