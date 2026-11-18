import type { AmbulanceStatus, EmergencyType, IncidentStatus, Priority } from "@/types";

export type ChipKind = "available" | "busy" | "offline" | "critical";

export const statusLabel: Record<AmbulanceStatus, string> = {
  available: "Available",
  dispatched: "Dispatched",
  en_route: "En route",
  on_scene: "On scene",
  transporting: "Transporting",
  at_hospital: "At hospital",
  out_of_service: "Out of service",
  offline: "Offline",
};

export const incidentLabel: Record<IncidentStatus, string> = {
  awaiting_unit: "Awaiting unit",
  offered: "Waiting to accept",
  en_route: "En route",
  on_scene: "On scene",
  transporting: "Transporting",
  at_hospital: "At hospital",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const emergencyLabel: Record<EmergencyType, string> = {
  cardiac: "Cardiac",
  accident: "Accident",
  childbirth: "Childbirth",
  breathing: "Breathing",
  other: "Other",
};

export const emergencyTypes = Object.keys(emergencyLabel) as EmergencyType[];
export const priorities: Priority[] = ["low", "medium", "high", "critical"];

export function ambulanceChip(status: AmbulanceStatus): ChipKind {
  if (status === "available") return "available";
  if (status === "offline" || status === "out_of_service") return "offline";
  return "busy";
}

export function incidentChip(status: IncidentStatus): ChipKind {
  if (status === "awaiting_unit") return "critical";
  if (status === "completed" || status === "cancelled") return "offline";
  return "busy";
}

export function priorityChip(priority: Priority): ChipKind {
  if (priority === "critical") return "critical";
  return priority === "low" ? "offline" : "busy";
}

export const priorityBar: Record<Priority, string> = {
  critical: "bg-brand-primary",
  high: "bg-brand-amber",
  medium: "bg-brand-amber",
  low: "bg-off-dot",
};

export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function minutes(seconds: number | null | undefined) {
  return seconds == null ? "-" : `${Math.max(1, Math.round(seconds / 60))} min`;
}

export function km(meters: number | null | undefined) {
  return meters == null ? "-" : `${(meters / 1000).toFixed(1)} km`;
}

export function timeAgo(iso: string | null | undefined) {
  if (!iso) return "never";
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
  return `${Math.floor(seconds / 86400)} d ago`;
}
