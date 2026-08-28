import { useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/game/engine";
import { playIncoming } from "@/lib/game/sound";

const GLITCH_CHARS = "!@#$%&*<>/\\|=+~";

/** Decodes text character-by-character, as if arriving over a noisy channel. */
function useDecoded(text: string, active: boolean) {
  const [out, setOut] = useState(active ? "" : text);
  useEffect(() => {
    if (!active) {
      setOut(text);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += Math.max(1, Math.round(text.length / 60));
      if (i >= text.length) {
        setOut(text);
        clearInterval(id);
        return;
      }
      const noise = Array.from({ length: Math.min(4, text.length - i) })
        .map(() => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)])
        .join("");
      setOut(text.slice(0, i) + noise);
    }, 24);
    return () => clearInterval(id);
  }, [text, active]);
  return out;
}

function Bubble({ msg, isLatest }: { msg: Message; isLatest: boolean }) {
  const decoded = useDecoded(msg.text, isLatest);
  const ref = useRef<HTMLElement>(null);

  // Keep the newest message fully in view while it decodes, without slamming
  // the scroll position to the very bottom of the panel.
  useEffect(() => {
    if (!isLatest) return;
    const el = ref.current;
    const scroller = el?.closest("[data-comms-scroll]");
    if (!el || !scroller) return;
    const over =
      el.getBoundingClientRect().bottom - scroller.getBoundingClientRect().bottom;
    if (over > -12) {
      scroller.scrollTop += over + 12;
    }
  }, [decoded, isLatest]);

  const label =
    msg.from === "CHAGOYAN"
      ? "CHAGOYAN // 2047"
      : msg.from === "SYSTEM"
        ? "RELAY SYSTEM"
        : "UNIDENTIFIED SOURCE";

  const tone =
    msg.from === "SYSTEM"
      ? "border-accent/40 text-accent"
      : msg.from === "UNKNOWN"
        ? "border-destructive/50 text-destructive"
        : msg.hint
          ? "border-accent/30 text-accent/90"
          : "border-primary/30 text-foreground";

  return (
    <article ref={ref} className={`border-l-2 pl-3 ${tone} ${msg.glitch ? "glitch" : ""}`}>
      <header className="flex items-baseline justify-between text-[10px] tracking-widest text-muted-foreground">
        <span>
          {msg.hint ? "ASSIST // " : "TRANSMISSION // "}
          {label}
        </span>
        <span>{msg.time}</span>
      </header>
      <p className="mt-1 whitespace-pre-wrap text-[12.5px] leading-relaxed">{decoded}</p>
    </article>
  );
}

export function CommsPanel({ messages, signal }: { messages: Message[]; signal: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastCount = useRef(0);

  useEffect(() => {
    if (messages.length > lastCount.current) playIncoming();
    lastCount.current = messages.length;
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <aside className="panel-frame flex min-h-0 w-full flex-col rounded-md lg:w-[380px]">
      <header className="border-b border-border px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] tracking-widest text-primary glow-text">
            TEMPORAL COMMS
          </span>
          <span className="flex items-end gap-[2px]" title="signal strength">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                style={{ height: 3 + i * 2 }}
                className={`w-[3px] ${i <= signal ? "bg-primary" : "bg-border"}`}
              />
            ))}
          </span>
        </div>
        <p className="mt-1 text-[10px] tracking-wider text-muted-foreground">
          CHANNEL: 2026 &lt;-&gt; 2047 · ENCRYPTED · UNSTABLE
        </p>
      </header>

      <div
        ref={scrollRef}
        data-comms-scroll
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-4"
      >
        {messages.length === 0 && (
          <p className="text-[11px] text-muted-foreground">Listening for carrier...</p>
        )}
        {messages.map((m, i) => (
          <Bubble key={m.id} msg={m} isLatest={i === messages.length - 1} />
        ))}
      </div>
    </aside>
  );
}
