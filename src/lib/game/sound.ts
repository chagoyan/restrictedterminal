// WebAudio cues for the workstation. Audio contexts often begin suspended in
// browsers, so every cue waits for a successful resume before it is scheduled.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx || ctx.state === "closed") {
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.65;
    master.connect(ctx.destination);
  }
  return ctx;
}

async function tone(freq: number, duration: number, gain: number, type: OscillatorType) {
  const ac = audio();
  if (!ac || !master) return;
  if (ac.state === "suspended") {
    try {
      await ac.resume();
    } catch {
      return;
    }
  }
  if (ac.state !== "running") return;

  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  vol.gain.setValueAtTime(gain, now);
  vol.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(vol).connect(master);
  osc.start(now);
  osc.stop(now + duration);
}

/** Mechanical-ish keystroke tick. */
export function playKey() {
  void tone(1450, 0.045, 0.16, "square");
}

/** Soft incoming-transmission ping — distinct from keyboard sounds. */
export function playIncoming() {
  void tone(880, 0.14, 0.18, "sine");
  setTimeout(() => void tone(1175, 0.2, 0.16, "sine"), 120);
}

/** Short warning alarm when SHOGGOTH detects the connection. */
export function playAlarm() {
  [0, 150, 300].forEach((delay, index) => {
    setTimeout(
      () => void tone(index % 2 === 0 ? 620 : 430, 0.16, 0.24, "sawtooth"),
      delay,
    );
  });
}

/** Heavier thunk for Enter. */
export function playEnter() {
  void tone(680, 0.07, 0.18, "square");
}

/** Error beep. */
export function playError() {
  void tone(220, 0.18, 0.22, "sawtooth");
  setTimeout(() => void tone(165, 0.22, 0.22, "sawtooth"), 130);
}
