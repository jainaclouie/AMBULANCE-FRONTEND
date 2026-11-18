import api from "@/lib/axios";

export type PushState = "unsupported" | "denied" | "subscribed" | "idle";

export const pushSupported = () => "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register("/sw.js");
  } catch {
    // needs https or localhost
  }
}

function toUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
}

export async function getPushState(): Promise<PushState> {
  if (!pushSupported()) return "unsupported";
  if (Notification.permission === "denied") return "denied";
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  return subscription ? "subscribed" : "idle";
}

// Ask permission, subscribe this phone and save the subscription on the server
export async function enablePush() {
  if (!pushSupported()) {
    throw new Error("This browser cannot show phone notifications. Use Chrome on Android, or install the app on iPhone (iOS 16.4 or newer).");
  }
  const { data: key } = await api.get<{ public_key: string | null; enabled: boolean }>("/push/public-key");
  if (!key.enabled || !key.public_key) {
    throw new Error("Phone notifications are not set up on the server yet (missing VAPID keys).");
  }
  if ((await Notification.requestPermission()) !== "granted") {
    throw new Error("Notifications are blocked. Allow them in the browser settings for this site.");
  }

  await registerServiceWorker();
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: toUint8Array(key.public_key) as BufferSource,
  });
  const json = subscription.toJSON();
  const encodings = (PushManager as unknown as { supportedContentEncodings?: string[] }).supportedContentEncodings ?? [];

  await api.post("/push/subscribe", {
    endpoint: json.endpoint,
    keys: json.keys,
    contentEncoding: encodings.includes("aes128gcm") ? "aes128gcm" : "aesgcm",
  });
}

export async function disablePush() {
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return;
  await api.post("/push/unsubscribe", { endpoint: subscription.endpoint }).catch(() => undefined);
  await subscription.unsubscribe();
}
