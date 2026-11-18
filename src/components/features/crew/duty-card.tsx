import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { GpsState } from "@/hooks/use-gps-sharing";
import { timeAgo } from "@/lib/format";

type DutyCardProps = {
  onDuty: boolean;
  gps: GpsState;
  busy: boolean;
  onToggle: (onDuty: boolean) => void;
};

const gpsText = {
  idle: "GPS is off while you are off duty.",
  waiting: "Looking for a GPS signal...",
  sharing: "GPS is live. The dispatcher can see where you are.",
  denied: "Location is blocked. Allow location for this site in the browser settings.",
  unavailable: "This phone has no GPS available.",
};

// Go on or off duty, and see if the GPS tracker is working
export function DutyCard({ onDuty, gps, busy, onToggle }: DutyCardProps) {
  return (
    <Card className="flex flex-col gap-3.5 p-5">
      <b className="text-lg">{onDuty ? "Waiting for emergency calls" : "You are off duty"}</b>
      <p className="text-muted">{onDuty ? gpsText[gps.status] : "Go on duty to share your GPS location and receive emergency calls."}</p>

      {onDuty && gps.status === "sharing" && (
        <p className="text-xs text-muted">Last sent {timeAgo(gps.lastSentAt ? new Date(gps.lastSentAt).toISOString() : null)}{gps.accuracy ? ` | accuracy ${gps.accuracy} m` : ""}</p>
      )}

      {onDuty
        ? <Button variant="outline" disabled={busy} onClick={() => onToggle(false)}>Go off duty</Button>
        : <Button variant="teal" size="l" disabled={busy} onClick={() => onToggle(true)}>Go on duty</Button>}
    </Card>
  )
}
