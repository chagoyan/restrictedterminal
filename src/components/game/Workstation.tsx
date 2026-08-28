import { useEffect, useState } from "react";
import { useGame } from "@/lib/game/engine";
import { TerminalPanel } from "./TerminalPanel";
import { CommsPanel } from "./CommsPanel";
import { StatusBar } from "./StatusBar";
import { CompletionScreen } from "./CompletionScreen";

export function Workstation({
  studentName,
  onRestart,
}: {
  studentName: string;
  onRestart: () => void;
}) {
  const game = useGame(studentName);
  const [commsOnline, setCommsOnline] = useState(false);
  useEffect(() => {
    if (game.messages.length > 0 && !commsOnline) setCommsOnline(true);
  }, [game.messages.length, commsOnline]);

  if (game.finished) {
    return <CompletionScreen studentName={studentName} stats={game.stats} onRestart={onRestart} />;
  }

  const signal = Math.max(1, 4 - Math.floor(game.beatIndex / 3));

  return (
    <main className="relative flex h-screen flex-col gap-3 p-3">
      <StatusBar
        studentName={studentName}
        unlocked={game.unlocked}
        objective={game.beat?.objective}
        nodeLabel={game.beat?.nodeLabel}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
        <TerminalPanel lines={game.lines} cwd={game.cwd} onSubmit={game.submit} />
        {commsOnline && (
          <div className="glitch-in flex min-h-0 w-full lg:w-[380px]">
            <CommsPanel messages={game.messages} signal={signal} />
          </div>
        )}
      </div>

      {game.blackout && (
        <div className="fixed inset-0 z-50 bg-black transition-opacity duration-500" />
      )}
    </main>
  );
}
