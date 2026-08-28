type Stats = {
  nodesAccessed: number;
  missionsCompleted: number;
  totalMissions: number;
  commands: string[];
  hintsUsed: number;
};

export function CompletionScreen({
  studentName,
  stats,
  onRestart,
}: {
  studentName: string;
  stats: Stats;
  onRestart: () => void;
}) {
  const rows = [
    ["OPERATOR", studentName],
    ["NODES ACCESSED", `${stats.nodesAccessed} / 4`],
    ["MISSIONS COMPLETED", `${stats.missionsCompleted} / ${stats.totalMissions}`],
    ["COMMANDS USED", stats.commands.join("  ") || "—"],
    ["ASSISTS RECEIVED", String(stats.hintsUsed)],
  ];

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-10 crt-flicker">
      <div className="pointer-events-none absolute inset-0 scanlines-overlay" aria-hidden="true" />
      <div className="panel-frame w-full max-w-2xl rounded-md p-8">
        <h1 className="text-xl font-bold tracking-widest text-primary glow-text">
          TERMINAL MISSION: 2047 — COMPLETE
        </h1>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          The origin trace reached 2047 intact. What happens next is no longer recorded on this
          side of the link.
        </p>

        <dl className="mt-8 divide-y divide-border border-y border-border">
          {rows.map(([k, v]) => (
            <div key={k} className="flex flex-wrap gap-4 py-3 text-[12.5px]">
              <dt className="w-48 shrink-0 tracking-widest text-muted-foreground">{k}</dt>
              <dd className="flex-1 text-foreground">{v}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-[11px] leading-relaxed text-accent">
          Assists are scaffolding, not failure. What counts is that the operations were performed.
        </p>

        <button
          onClick={onRestart}
          className="mt-8 border border-primary/60 bg-primary/10 px-4 py-2 text-xs tracking-widest text-primary transition-colors hover:bg-primary/20"
        >
          RUN SESSION AGAIN
        </button>
      </div>
    </main>
  );
}
