import L from "leaflet";

export type PinKind = "available" | "busy" | "offline" | "patient" | "hospital";

const colors: Record<PinKind, string> = {
  available: "bg-brand-teal",
  busy: "bg-brand-amber",
  offline: "bg-off-dot",
  patient: "bg-brand-primary",
  hospital: "bg-[#3b6fb6]",
};

const escape = (text: string) => text.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

// Figma component: Map Pin (Status = Available | Busy | Offline | Patient), with an optional name label
export function pinIcon(kind: PinKind, letter: string, label?: string) {
  const size = kind === "patient" ? 36 : 30;
  const name = label
    ? `<span class="absolute top-1 whitespace-nowrap rounded-md bg-white px-2 py-0.5 text-xs font-semibold shadow" style="left:${size + 6}px">${escape(label)}</span>`
    : "";

  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div class="relative"><div class="grid place-items-center rounded-full border-[3px] border-white text-xs font-bold text-white shadow-md ${colors[kind]}" style="width:${size}px;height:${size}px">${letter}</div>${name}</div>`,
  });
}
