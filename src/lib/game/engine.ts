import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { pathString, type VDir } from "./fs";
import { buildWorld, HOME } from "./world";
import { runCommand, type CmdContext } from "./commands";
import {
  beats,
  endgameMessages,
  endgameTerminal,
  type BeatState,
  type Transmission,
} from "./story";

export type Line = { id: number; text: string; kind: "input" | "output" | "error" | "system" };
export type Message = Transmission & { id: number; time: string };

const clock = () => {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
};

let uid = 0;
const nextId = () => ++uid;

export function useGame(studentName: string) {
  const rootRef = useRef<VDir>(buildWorld());
  const [cwd, setCwd] = useState<string[]>(["net", "ucla"]);
  const [lines, setLines] = useState<Line[]>([
    { id: nextId(), text: "Coalinga Unified // Restricted Network Workstation", kind: "system" },
    { id: nextId(), text: "chs-shell 1.4  (reconstruction layer active)", kind: "system" },
    { id: nextId(), text: "type 'help' for available programs", kind: "system" },
    { id: nextId(), text: "", kind: "system" },
  ]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [beatIndex, setBeatIndex] = useState(0);
  const [unlocked, setUnlocked] = useState<Set<string>>(() => new Set(["ucla"]));
  const [hintsUsed, setHintsUsed] = useState(0);
  const [commandsUsed, setCommandsUsed] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [blackout, setBlackout] = useState(false);

  const readRef = useRef<Set<string>>(new Set());
  const usedSinceBeat = useRef<Set<string>>(new Set());
  const rawSinceBeat = useRef<string[]>([]);
  const failureScore = useRef(0);
  const hintLevel = useRef(0);
  const enteredBeats = useRef<Set<string>>(new Set());

  const pushLines = useCallback((texts: string[], kind: Line["kind"] = "output") => {
    setLines((prev) => [...prev, ...texts.map((t) => ({ id: nextId(), text: t, kind }))]);
  }, []);

  const pushMessages = useCallback(
    (items: Transmission[], baseDelay = 700) => {
      items.forEach((t, i) => {
        setTimeout(
          () =>
            setMessages((prev) => [
              ...prev,
              {
                ...t,
                id: nextId(),
                time: clock(),
                text: t.text.replaceAll("{name}", studentName),
              },
            ]),
          baseDelay + i * 1600,
        );
      });
    },
    [studentName],
  );

  const beat = beats[beatIndex];

  useEffect(() => {
    if (!beat || finished) return;
    if (enteredBeats.current.has(beat.id)) return;
    enteredBeats.current.add(beat.id);
    usedSinceBeat.current = new Set();
    rawSinceBeat.current = [];
    failureScore.current = 0;
    hintLevel.current = 0;
    pushMessages(beat.onEnter, beatIndex === 0 ? 2000 : 1000);
  }, [beat, beatIndex, finished, pushMessages]);

  const runEndgame = useCallback(() => {
    endgameTerminal.forEach((l, i) => setTimeout(() => pushLines([l], "system"), 400 + i * 430));
    const total = 400 + endgameTerminal.length * 430;
    setTimeout(() => setBlackout(true), total + 700);
    setTimeout(() => {
      setBlackout(false);
      setLines([{ id: nextId(), text: "chs-shell 1.4  (link severed)", kind: "system" }]);
      pushMessages(endgameMessages, 1200);
    }, total + 3600);
    setTimeout(
      () => setFinished(true),
      total + 3600 + endgameMessages.length * 1600 + 2500,
    );
  }, [pushLines, pushMessages]);

  const evaluateRef = useRef<(freshCwd: string[]) => void>(() => {});
  evaluateRef.current = (freshCwd: string[]) => {
    const current = beats[beatIndex];
    if (!current || finished) return;
    const state: BeatState = {
      root: rootRef.current,
      cwd: freshCwd,
      read: readRef.current,
      usedSinceBeat: usedSinceBeat.current,
      rawSinceBeat: rawSinceBeat.current,
    };
    if (current.check(state)) {
      if (current.unlocks) setUnlocked((prev) => new Set([...prev, current.unlocks!]));
      if (current.terminalOnComplete) pushLines(current.terminalOnComplete, "system");
      if (beatIndex === beats.length - 1) {
        setBeatIndex(beats.length);
        runEndgame();
      } else {
        setBeatIndex(beatIndex + 1);
      }
      return;
    }
    if (failureScore.current >= 3 && hintLevel.current < current.hints.length) {
      failureScore.current = 0;
      pushMessages([{ from: "CHAGOYAN", text: current.hints[hintLevel.current], hint: true }], 900);
      hintLevel.current += 1;
      setHintsUsed((h) => h + 1);
    }
  };

  const submit = useCallback(
    (input: string) => {
      const prompt = `student@chs:${pathString(cwd) || "/"}$ `;
      setLines((prev) => [...prev, { id: nextId(), text: prompt + input, kind: "input" }]);
      if (!input.trim()) return;

      let nextCwd = cwd;
      const ctx: CmdContext = {
        root: rootRef.current,
        cwd,
        home: HOME,
        unlocked,
        setCwd: (p) => {
          nextCwd = p;
        },
        markRead: (p) => readRef.current.add(p),
      };
      const result = runCommand(ctx, input);
      if (result.clear) setLines([]);
      else if (result.lines.length) pushLines(result.lines, result.ok ? "output" : "error");

      if (result.ok && result.name) {
        usedSinceBeat.current.add(result.name);
        setCommandsUsed((prev) => (prev.includes(result.name) ? prev : [...prev, result.name]));
      }
      rawSinceBeat.current.push(input.trim());
      failureScore.current += result.ok ? 0.5 : 1;

      if (nextCwd !== cwd) setCwd(nextCwd);
      setTimeout(() => evaluateRef.current(nextCwd), 0);
    },
    [cwd, pushLines, unlocked],
  );

  const stats = useMemo(
    () => ({
      nodesAccessed: unlocked.size,
      missionsCompleted: Math.min(beatIndex, beats.length),
      totalMissions: beats.length,
      commands: [...commandsUsed].sort(),
      hintsUsed,
    }),
    [beatIndex, commandsUsed, hintsUsed, unlocked],
  );

  return { lines, messages, cwd, submit, beat, beatIndex, unlocked, finished, blackout, stats };
}
