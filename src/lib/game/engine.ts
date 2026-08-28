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
export type Message = Transmission & { id: number; time: string; pending?: boolean };

const clock = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(
    d.getSeconds(),
  ).padStart(2, "0")}`;
};

let uid = 0;
const nextId = () => ++uid;

export function useGame(studentName: string) {
  const rootRef = useRef<VDir>(buildWorld());
  const [, forceRender] = useState(0);
  const [cwd, setCwd] = useState<string[]>(["net", "ucla"]);
  const [lines, setLines] = useState<Line[]>([
    { id: nextId(), text: "Coalinga Unified // Restricted Network Workstation", kind: "system" },
    { id: nextId(), text: "chs-shell 1.4  (reconstruction layer active)", kind: "system" },
    { id: nextId(), text: "type 'help' for available programs", kind: "system" },
    { id: nextId(), text: "", kind: "system" },
  ]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [beatIndex, setBeatIndex] = useState(0);
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set(["ucla"]));
  const [read] = useState<Set<string>>(() => new Set());
  const usedSinceBeat = useRef<Set<string>>(new Set());
  const rawSinceBeat = useRef<string[]>([]);
  const failuresSinceHint = useRef(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [commandsUsed] = useState<Set<string>>(() => new Set());
  const [finished, setFinished] = useState(false);
  const [blackout, setBlackout] = useState(false);
  const enteredBeats = useRef<Set<string>>(new Set());

  const pushLines = useCallback((texts: string[], kind: Line["kind"] = "output") => {
    setLines((prev) => [...prev, ...texts.map((t) => ({ id: nextId(), text: t, kind }))]);
  }, []);

  const pushMessages = useCallback((items: Transmission[], baseDelay = 500) => {
    items.forEach((t, i) => {
      setTimeout(
        () =>
          setMessages((prev) => [
            ...prev,
            { ...t, id: nextId(), time: clock(), text: t.text.replaceAll("{name}", studentName) },
          ]),
        baseDelay + i * 1400,
      );
    });
  }, [studentName]);

  const beat = beats[beatIndex];

  // Deliver the current beat's briefing once.
  useEffect(() => {
    if (!beat || finished) return;
    if (enteredBeats.current.has(beat.id)) return;
    enteredBeats.current.add(beat.id);
    pushMessages(beat.onEnter, beatIndex === 0 ? 2200 : 900);
    usedSinceBeat.current = new Set();
    rawSinceBeat.current = [];
    failuresSinceHint.current = 0;
    setHintLevel(0);
  }, [beat, beatIndex, finished, pushMessages]);

  const runEndgame = useCallback(() => {
    endgameTerminal.forEach((l, i) =>
      setTimeout(() => pushLines([l], "system"), 400 + i * 420),
    );
    const total = 400 + endgameTerminal.length * 420;
    setTimeout(() => setBlackout(true), total + 600);
    setTimeout(() => {
      setBlackout(false);
      setLines([{ id: nextId(), text: "chs-shell 1.4  (link severed)", kind: "system" }]);
      pushMessages(endgameMessages, 1200);
    }, total + 3400);
    setTimeout(() => setFinished(true), total + 3400 + endgameMessages.length * 1400 + 2000);
  }, [pushLines, pushMessages]);

  const evaluate = useCallback(() => {
    const state: BeatState = {
      root: rootRef.current,
      cwd,
      read,
      usedSinceBeat: usedSinceBeat.current,
      rawSinceBeat: rawSinceBeat.current,
    };
    const current = beats[beatIndex];
    if (!current) return;
    if (current.check(state)) {
      if (current.unlocks) {
        setUnlocked((prev) => new Set([...prev, current.unlocks!]));
      }
      if (current.terminalOnComplete) pushLines(current.terminalOnComplete, "system");
      if (beatIndex === beats.length - 1) {
        runEndgame();
        setBeatIndex(beats.length);
      } else {
        setBeatIndex(beatIndex + 1);
      }
      return;
    }
    // Adaptive hints: escalate only after repeated unproductive attempts.
    if (failuresSinceHint.current >= 3 && hintLevel < current.hints.length) {
      failuresSinceHint.current = 0;
      pushMessages([{ from: "CHAGOYAN", text: current.hints[hintLevel], hint: true }], 900);
      setHintLevel((l) => l + 1);
      setHintsUsed((h) => h + 1);
    }
  }, [beatIndex, cwd, hintLevel, pushLines, pushMessages, read, runEndgame]);

  const submit = useCallback(
    (input: string) => {
      const prompt = `student@chs:${pathString(cwd) === "/" ? "/" : pathString(cwd)}$ `;
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
        markRead: (p) => read.add(p),
      };
      const result = runCommand(ctx, input);
      if (result.clear) setLines([]);
      else if (result.lines.length) pushLines(result.lines, result.ok ? "output" : "error");

      if (result.ok && result.name) {
        usedSinceBeat.current.add(result.name);
        commandsUsed.add(result.name);
      }
      rawSinceBeat.current.push(input.trim());
      if (!result.ok) failuresSinceHint.current += 1;
      else failuresSinceHint.current += 0.5;

      if (nextCwd !== cwd) setCwd(nextCwd);
      forceRender((n) => n + 1);
      // evaluate on next tick so cwd state is current
      setTimeout(() => evaluateRef.current(nextCwd), 0);
    },
    [commandsUsed, cwd, evaluate, pushLines, read, unlocked],
  );

  // Keep an up-to-date evaluator that can accept the freshest cwd.
  const evaluateRef = useRef<(cwd: string[]) => void>(() => {});
  evaluateRef.current = (freshCwd: string[]) => {
    const state: BeatState = {
      root: rootRef.current,
      cwd: freshCwd,
      read,
      usedSinceBeat: usedSinceBeat.current,
      rawSinceBeat: rawSinceBeat.current,
    };
    const current = beats[beatIndex];
    if (!current || finished) return;
    if (current.check(state)) {
      if (current.unlocks) setUnlocked((prev) => new Set([...prev, current.unlocks!]));
      if (current.terminalOnComplete) pushLines(current.terminalOnComplete, "system");
      if (beatIndex === beats.length - 1) {
        setBeatIndex(beats.length);
        runEndgame();
      } else setBeatIndex(beatIndex + 1);
      return;
    }
    if (failuresSinceHint.current >= 3 && hintLevel < current.hints.length) {
      failuresSinceHint.current = 0;
      pushMessages([{ from: "CHAGOYAN", text: current.hints[hintLevel], hint: true }], 700);
      setHintLevel((l) => l + 1);
      setHintsUsed((h) => h + 1);
    }
  };

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

  return {
    lines,
    messages,
    cwd,
    submit,
    beat: beats[beatIndex],
    beatIndex,
    unlocked,
    finished,
    blackout,
    stats,
    evaluate,
  };
}
