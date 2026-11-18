import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/axios";
import { connectEcho } from "@/lib/echo";
import { useAuth } from "@/context/auth-state";
import type { CrewState } from "@/types";

// State of the crew app: duty, pending offer and active trip. Updates live, polls as backup.
export function useCrew() {
  const { user } = useAuth();
  const ambulanceId = user?.ambulance_id;
  const [state, setState] = useState<CrewState | null>(null);
  const [offsetMs, setOffsetMs] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const apply = useCallback((next: CrewState) => {
    setOffsetMs(new Date(next.server_time).getTime() - Date.now());
    setState(next);
  }, []);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get<CrewState>("/crew/state");
      apply(data);
    } catch (e) {
      setError(errorMessage(e));
    }
  }, [apply]);

  // Run a crew action (accept, decline, duty, advance) and show the new state
  const act = useCallback(async (path: string, body?: object) => {
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post<CrewState>(path, body);
      apply(data);
    } catch (e) {
      setError(errorMessage(e));
      await load();
    } finally {
      setBusy(false);
    }
  }, [apply, load]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    if (!ambulanceId) return;
    const channelName = `ambulance.${ambulanceId}`;
    connectEcho().private(channelName).listen(".crew.state", () => { void load(); });
    const poll = window.setInterval(() => { void load(); }, 6000);
    return () => {
      window.clearInterval(poll);
      connectEcho().leave(channelName);
    };
  }, [ambulanceId, load]);

  return { state, offsetMs, error, busy, act, reload: load };
}
