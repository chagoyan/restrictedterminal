import { useEffect, useState } from "react";

export function LoginScreen({
  onLogin,
  farewell,
}: {
  onLogin: (name: string) => void;
  farewell?: boolean;
}) {
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<"hidden" | "in" | "out" | "gone">(
    farewell ? "hidden" : "gone",
  );

  useEffect(() => {
    if (!farewell) return;
    const t1 = setTimeout(() => setPhase("in"), 1200);
    const t2 = setTimeout(() => setPhase("out"), 5200);
    const t3 = setTimeout(() => setPhase("gone"), 6200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [farewell]);

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 crt-flicker">
      <div className="pointer-events-none absolute inset-0 scanlines-overlay" aria-hidden="true" />
      <div className="w-full max-w-md">
        {phase !== "gone" && phase !== "hidden" && (
          <div
            className={`panel-frame mb-4 rounded-md border-l-2 border-primary/40 p-4 ${
              phase === "out" ? "glitch-out" : "glitch-in"
            }`}
          >
            <p className="text-[10px] tracking-widest text-muted-foreground">
              TRANSMISSION // CHAGOYAN — 2047
            </p>
            <p className="mt-1 text-[12.5px] text-foreground">Wish me luck.</p>
          </div>
        )}

        <div className="panel-frame rounded-md p-8">
          <p className="text-xs tracking-[0.3em] text-muted-foreground">COALINGA UNIFIED</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Restricted network workstation. Identify yourself before the session is opened. All
            keystrokes are recorded for security review.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) onLogin(name.trim());
            }}
          >
            <label
              className="block text-xs tracking-widest text-muted-foreground"
              htmlFor="student"
            >
              STUDENT NAME
            </label>
            <div className="flex items-center gap-2 border border-border bg-input/40 px-3 py-2">
              <span className="text-primary">&gt;</span>
              <input
                id="student"
                autoFocus
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="enter name"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
              />
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full border border-primary/60 bg-primary/10 px-4 py-2 text-sm tracking-widest text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              OPEN SESSION
            </button>

            <button
              type="button"
              disabled
              className="w-full border border-border px-4 py-2 text-xs tracking-widest text-muted-foreground/60"
              title="School account sign-in is not enabled on this workstation yet"
            >
              SIGN IN WITH SCHOOL ACCOUNT — UNAVAILABLE
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
