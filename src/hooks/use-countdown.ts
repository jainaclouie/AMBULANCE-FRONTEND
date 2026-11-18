import { useEffect, useState } from "react";

// Seconds left until a server time. serverOffsetMs corrects for a phone clock that is wrong.
export function useCountdown(expiresAt: string | null | undefined, serverOffsetMs = 0) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, [expiresAt]);

  if (!expiresAt) return 0;
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - (now + serverOffsetMs)) / 1000));
}
