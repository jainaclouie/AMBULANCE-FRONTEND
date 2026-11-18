import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { ErrorText } from "@/components/common/error-text";
import { PageLoading } from "@/components/common/page-loading";
import { CrewHeader } from "@/components/features/crew/crew-header";
import { DutyCard } from "@/components/features/crew/duty-card";
import { OfferCard } from "@/components/features/crew/offer-card";
import { PushCard } from "@/components/features/crew/push-card";
import { TripActions } from "@/components/features/crew/trip-actions";
import { TripInfo } from "@/components/features/crew/trip-info";
import { TripSteps } from "@/components/features/crew/trip-steps";
import { FleetMap } from "@/components/features/map/fleet-map";
import { useAuth } from "@/context/auth-state";
import { useCrew } from "@/hooks/use-crew";
import { useGpsSharing } from "@/hooks/use-gps-sharing";
import { unlockAudio } from "@/lib/sound";
import type { Hospital } from "@/types";

export default function CrewHomePage() {
  const { logout } = useAuth();
  const { state, offsetMs, error, busy, act } = useCrew();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  // GPS tracker: runs only while the crew is on duty
  const gps = useGpsSharing(!!state?.user.on_duty);

  useEffect(() => {
    api.get<Hospital[]>("/hospitals").then((response) => setHospitals(response.data)).catch(() => undefined);
  }, []);

  if (!state) {
    return <PageLoading />;
  }

  const { ambulance, offer, trip } = state;
  const onDuty = state.user.on_duty;
  const subtitle = onDuty ? `On duty | GPS ${gps.status === "sharing" ? "sharing on" : "starting"}` : "Off duty";

  return (
    <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col bg-surface-page">
      <CrewHeader ambulance={ambulance} subtitle={subtitle} />

      {/* Route map while on a trip */}
      {trip && (
        <div className="h-[230px] shrink-0">
          <FleetMap ambulances={[ambulance]} incidents={[{ ...trip.incident, dispatch: trip }]} showLabels={false} />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3.5 p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
        <ErrorText message={error} />

        {offer && (
          <OfferCard
            offer={offer}
            offsetMs={offsetMs}
            busy={busy}
            onAccept={() => void act(`/crew/dispatches/${offer.id}/accept`)}
            onDecline={() => void act(`/crew/dispatches/${offer.id}/decline`)}
          />
        )}

        {trip && (
          <>
            <TripInfo trip={trip} />
            <TripSteps stage={trip.stage} />
            <TripActions key={trip.stage} trip={trip} hospitals={hospitals} busy={busy} onAdvance={(to, hospitalId) => void act(`/crew/dispatches/${trip.id}/advance`, { to, hospital_id: hospitalId })} />
          </>
        )}

        {!offer && !trip && (
          <>
            <DutyCard onDuty={onDuty} gps={gps} busy={busy} onToggle={(on) => { unlockAudio(); void act("/crew/duty", { on_duty: on }); }} />
            <PushCard />
            <Button variant="tertiary" onClick={() => void logout()}>Sign out</Button>
          </>
        )}
      </div>
    </div>
  )
}
