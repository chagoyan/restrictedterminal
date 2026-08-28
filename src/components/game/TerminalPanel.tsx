import { useEffect, useRef, useState } from "react";
import type { Line } from "@/lib/game/engine";
import { pathString } from "@/lib/game/fs";
import { playEnter, playError, playKey } from "@/lib/game/sound";

const kindClass: Record<Line["kind"], string> = {
  input: "text-foreground",
  output: "text-primary/90",
  error: "text-destructive",
  system: "text-accent",
};

export function TerminalPanel({
  lines,
  cwd,
  onSubmit,
  disabled,
}: {
  lines: Line[];
  cwd: string[];
  onSubmit: (input: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastErrorId = useRef(0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
    const errs = lines.filter((l) => l.kind === "error");
    const last = errs[errs.length - 1];
    if (last && last.id > lastErrorId.current) {
      lastErrorId.current = last.id;
      playError();
    }
  }, [lines]);

  const prompt = `student@chs:${pathString(cwd) || "/"}$`;

  return (
    <section
      className="panel-frame relative flex min-h-0 flex-1 flex-col rounded-md crt-flicker"
      onClick={() => inputRef.current?.focus()}
    >
      <header className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-destructive/70" />
        <span className="h-2 w-2 rounded-full bg-accent/70" />
        <span className="h-2 w-2 rounded-full bg-primary/70" />
        <span className="ml-2 text-[11px] tracking-widest text-muted-foreground">
          chs-shell — student@chs
        </span>
      </header>

      <div className="relative min-h-0 flex-1 overflow-y-auto px-4 py-3 text-[13px] leading-[1.55]">
        <div className="pointer-events-none absolute inset-0 scanlines-overlay" aria-hidden="true" />
        {lines.map((l) => (
          <pre key={l.id} className={`whitespace-pre-wrap break-words ${kindClass[l.kind]}`}>
            {l.text || " "}
          </pre>
        ))}

        <form
          className="flex items-baseline gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (disabled) return;
            onSubmit(value);
            if (value.trim()) setHistory((h) => [value.trim(), ...h]);
            setHistIdx(-1);
            setValue("");
          }}
        >
          <span className="shrink-0 text-primary glow-text">{prompt}</span>
          <input
            ref={inputRef}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            disabled={disabled}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") playEnter();
              else if (e.key.length === 1 || e.key === "Backspace" || e.key === "Tab") playKey();
              if (e.key === "ArrowUp") {
                e.preventDefault();
                const i = Math.min(histIdx + 1, history.length - 1);
                if (i >= 0) {
                  setHistIdx(i);
                  setValue(history[i] ?? "");
                }
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const i = histIdx - 1;
                setHistIdx(i);
                setValue(i >= 0 ? (history[i] ?? "") : "");
              }
            }}
            className="w-full bg-transparent text-foreground outline-none"
          />
        </form>

        <div ref={endRef} />
      </div>
    </section>
  );
}
