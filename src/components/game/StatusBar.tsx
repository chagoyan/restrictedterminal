const NODES = [
  { key: "ucla", label: "01 UCLA" },
  { key: "sri", label: "02 SRI" },
  { key: "ucsb", label: "03 UCSB" },
  { key: "utah", label: "04 UTAH" },
];

export function StatusBar({
  studentName,
  unlocked,
  objective,
  nodeLabel,
}: {
  studentName: string;
  unlocked: Set<string>;
  objective?: string | undefined;
  nodeLabel?: string | undefined;
}) {
  return (
    <header className="panel-frame flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md px-4 py-2 text-[11px] tracking-wider">
      <span className="text-primary glow-text">TERMINAL MISSION: 2047</span>
      <span className="text-muted-foreground">OPERATOR: {studentName.toUpperCase()}</span>

      <div className="flex items-center gap-3">
        {NODES.map((n) => {
          const on = unlocked.has(n.key);
          return (
            <span key={n.key} className={on ? "text-primary" : "text-muted-foreground/50"}>
              <span
                className={`mr-1 inline-block h-[6px] w-[6px] rounded-full align-middle ${
                  on ? "bg-primary" : "bg-muted-foreground/40"
                }`}
              />
              {n.label}
            </span>
          );
        })}
      </div>

      {objective && (
        <span className="ml-auto max-w-full truncate text-accent">
          {nodeLabel} · {objective}
        </span>
      )}
    </header>
  );
}
