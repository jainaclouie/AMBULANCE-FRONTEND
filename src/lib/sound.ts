// Alert sounds and vibration. Browsers only allow sound after a tap, so call unlockAudio() from a click.
let ctx: AudioContext | null = null;
let alarmTimer: number | null = null;

export function unlockAudio() {
  try {
    ctx = ctx ?? new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    // audio not available
  }
}

function beep(freq: number, start: number, duration: number, gain = 0.3) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const volume = ctx.createGain();
  osc.frequency.value = freq;
  volume.gain.setValueAtTime(0, ctx.currentTime + start);
  volume.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.02);
  volume.gain.linearRampToValueAtTime(0, ctx.currentTime + start + duration);
  osc.connect(volume).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.05);
}

export function playChime() {
  beep(880, 0, 0.18);
  beep(1175, 0.2, 0.25);
}

export function playUrgent() {
  beep(988, 0, 0.2, 0.4);
  beep(784, 0.25, 0.2, 0.4);
  beep(988, 0.5, 0.2, 0.4);
}

export function vibrate(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // not supported
  }
}

// Repeating alarm while a crew has an emergency waiting for an answer
export function startAlarm() {
  if (alarmTimer !== null) return;
  const ring = () => {
    playUrgent();
    vibrate([300, 150, 300, 150, 600]);
  };
  ring();
  alarmTimer = window.setInterval(ring, 2500);
}

export function stopAlarm() {
  if (alarmTimer !== null) {
    window.clearInterval(alarmTimer);
    alarmTimer = null;
  }
  vibrate(0);
}
