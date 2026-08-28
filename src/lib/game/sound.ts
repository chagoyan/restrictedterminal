// Tiny WebAudio blips for the workstation: key clicks and error beeps.

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, duration: number, gain: number, type: OscillatorType) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  vol.gain.setValueAtTime(gain, ac.currentTime);
  vol.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
  osc.connect(vol).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + duration);
}

/** Mechanical-ish keystroke tick. */
export function playKey() {
  tone(1400 + Math.random() * 500, 0.03, 0.05, "square");
}

/** Heavier thunk for Enter. */
export function playEnter() {
  tone(680, 0.06, 0.06, "square");
}

/** Error beep. */
export function playError() {
  tone(220, 0.16, 0.09, "sawtooth");
  setTimeout(() => tone(165, 0.2, 0.09, "sawtooth"), 120);
}
