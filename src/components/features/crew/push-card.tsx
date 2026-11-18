import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorText } from "@/components/common/error-text";
import { disablePush, enablePush, getPushState, type PushState } from "@/lib/push";

// Turns phone notifications on, so the crew is alerted even when the app is closed
export function PushCard() {
  const [state, setState] = useState<PushState>("idle");
  const [error, setError] = useState("");

  useEffect(() => { void getPushState().then(setState); }, []);

  const handleEnable = async () => {
    setError("");
    try {
      await enablePush();
      setState("subscribed");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not turn on phone alerts.");
      setState(await getPushState());
    }
  };

  const handleDisable = async () => {
    await disablePush();
    setState("idle");
  };

  if (state === "unsupported") return null;

  return (
    <Card className="flex flex-col gap-3 p-5">
      <b>Phone alerts</b>
      {state === "subscribed" ? (
        <>
          <p className="text-muted">On. This phone gets a notification when a call needs your answer.</p>
          <Button variant="outline" size="s" onClick={() => void handleDisable()}>Turn off</Button>
        </>
      ) : (
        <>
          <p className="text-muted">Get a notification with sound and vibration when a call comes in, even if this page is closed.</p>
          <Button size="s" onClick={() => void handleEnable()}>Turn on phone alerts</Button>
        </>
      )}
      <ErrorText message={error} />
    </Card>
  )
}
