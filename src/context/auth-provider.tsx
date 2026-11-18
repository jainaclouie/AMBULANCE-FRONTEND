import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import api, { TOKEN_KEY } from "@/lib/axios";
import { connectEcho, disconnectEcho } from "@/lib/echo";
import { registerServiceWorker } from "@/lib/push";
import { unlockAudio } from "@/lib/sound";
import { AuthContext } from "@/context/auth-state";
import type { User } from "@/types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!localStorage.getItem(TOKEN_KEY));

  // Restore the session if a token is saved
  useEffect(() => {
    void registerServiceWorker();
    const onExpired = () => { setUser(null); disconnectEcho(); };
    window.addEventListener("auth:expired", onExpired);

    if (localStorage.getItem(TOKEN_KEY)) {
      api.get<{ user: User }>("/me")
        .then((response) => setUser(response.data.user))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }
    return () => window.removeEventListener("auth:expired", onExpired);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    unlockAudio();
    const { data } = await api.post<{ token: string; user: User }>("/login", { email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    disconnectEcho();
    connectEcho();
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await api.post("/logout").catch(() => undefined);
    localStorage.removeItem(TOKEN_KEY);
    disconnectEcho();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

