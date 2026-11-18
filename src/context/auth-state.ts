import { createContext, useContext } from "react";
import type { Role, User } from "@/types";

export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

// Where each role lands after signing in
export const homePathFor = (role: Role) => (role === "crew" ? "/crew" : "/live");

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
