import axios, { isAxiosError } from "axios";

export const TOKEN_KEY = "dispatch_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach the login token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is no longer valid, sign the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event("auth:expired"));
    }
    return Promise.reject(error);
  },
);

// Turn any error into one readable sentence for the screen
export function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) return "Cannot reach the server. Check your connection.";
    const data = error.response.data;
    const first = data?.errors ? (Object.values(data.errors)[0] as string[])[0] : null;
    return first ?? data?.message ?? `Request failed (${error.response.status})`;
  }
  return error instanceof Error ? error.message : "Something went wrong.";
}

export default api;
