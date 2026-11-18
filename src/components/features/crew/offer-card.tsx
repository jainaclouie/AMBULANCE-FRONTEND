import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { useCountdown } from "@/hooks/use-countdown";
import { emergencyLabel, km, minutes } from "@/lib/format";
import { startAlarm, stopAlarm } from "@/lib/sound";
import type { CrewState } from "@/types";

type OfferCardProps = {
  offer: NonNullable<CrewState["offer"]>;
  offsetMs: number;
  busy: boolean;
  onAccept: () => void;
  onDecline: () => void;
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col gap-0.5 rounded-[10px] bg-surface-page p-3">
      <small className="text-xs text-muted">{label}</small>
      <b className="text-xl">{value}</b>
    </div>
  )
}

// The emergency waiting for an answer. Rings and vibrates until the crew responds.
export function OfferCard({ offer, offsetMs, busy, onAccept, onDecline }: OfferCardProps) {
  const seconds = useCountdown(offer.expires_at, offsetMs);
  const { incident } = offer;

  useEffect(() => {
    startAlarm();
    return () => stopAlarm();
  }, []);

  return (
    <>
      <Card className="flex flex-col gap-3.5 border-2 border-brand-primary p-5">
        <div className="flex items-center justify-between">
          <Chip kind="critical" dot={false}>New emergency</Chip>
          <span className="text-base font-bold text-brand-primary tabular-nums">0:{String(seconds).padStart(2, "0")}</span>
        </div>

        <h2 className="text-[26px] leading-8 font-bold">{emergencyLabel[incident.emergency_type]}</h2>
        <div>
          <small className="block text-xs text-muted">Location</small>
          <b>Brgy. {incident.barangay}{incident.address ? `, ${incident.address}` : ""}</b>
        </div>
        <div className="flex gap-3">
          <Stat label="Distance" value={km(offer.distance_m)} />
          <Stat label="Estimated time" value={minutes(offer.eta_seconds)} />
        </div>
        <div>
          <small className="block text-xs text-muted">Caller</small>
          <b>{incident.caller_name} | {incident.caller_phone}</b>
        </div>
      </Card>

      <Button variant="teal" size="l" disabled={busy || seconds === 0} onClick={onAccept}>Accept</Button>
      <Button variant="outline" disabled={busy} onClick={onDecline} className="h-[52px]">Decline</Button>
      <p className="text-center text-[11px] text-muted">No response in 60 seconds sends this call to the next unit.</p>
    </>
  )
}
