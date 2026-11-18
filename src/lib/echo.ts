import Echo from "laravel-echo";
import Pusher from "pusher-js";
import api, { TOKEN_KEY } from "@/lib/axios";

(window as unknown as { Pusher: typeof Pusher }).Pusher = Pusher;

let echo: Echo<"reverb"> | null = null;

// Live connection to Laravel Reverb. Private channels use the login token.
export function connectEcho(): Echo<"reverb"> {
  if (echo) return echo;
  const port = Number(import.meta.env.VITE_REVERB_PORT ?? 8080);

  echo = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY ?? "cordova-key",
    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
    wsPort: port,
    wssPort: port,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "http") === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${api.defaults.baseURL}/broadcasting/auth`,
    auth: { headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`, Accept: "application/json" } },
  });
  return echo;
}

export function disconnectEcho() {
  echo?.disconnect();
  echo = null;
}
