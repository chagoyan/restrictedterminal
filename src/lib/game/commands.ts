import {
  addChild,
  clone,
  displayPath,
  getNode,
  getParent,
  isDir,
  pathString,
  removeChild,
  resolvePath,
  type VDir,
  type VNode,
} from "./fs";

export type CmdResult = {
  lines: string[];
  ok: boolean;
  clear?: boolean;
};

export type CmdContext = {
  root: VDir;
  cwd: string[];
  home: string[];
  unlocked: Set<string>;
  setCwd: (p: string[]) => void;
  markRead: (absPath: string) => void;
};

export type Command = {
  name: string;
  summary: string;
  run: (ctx: CmdContext, args: string[]) => CmdResult;
};

const ok = (lines: string[] = []): CmdResult => ({ lines, ok: true });
const err = (line: string): CmdResult => ({ lines: [line], ok: false });

/** Nodes under /net that have not been linked yet are unreachable. */
function linkDown(ctx: CmdContext, segments: string[]): boolean {
  if (segments[0] !== "net" || segments.length < 2) return false;
  return !ctx.unlocked.has(segments[1]);
}

const LINK_MSG = "link down: remote volume is not responding";

function parseFlags(args: string[]) {
  const flags = new Set<string>();
  const rest: string[] = [];
  for (const a of args) {
    if (a.startsWith("-") && a.length > 1) {
      for (const ch of a.slice(1)) flags.add(ch);
    } else rest.push(a);
  }
  return { flags, rest };
}

function listing(node: VNode, all: boolean): VNode[] {
  if (!isDir(node)) return [node];
  return node.children
    .filter((c) => all || !c.name.startsWith("."))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function longLine(n: VNode): string {
  const perms = isDir(n) ? "drwxr-xr-x" : "-rw-r--r--";
  const size = isDir(n) ? 4096 : n.content.length;
  return `${perms}  1 student  staff  ${String(size).padStart(5)}  Oct 29  1969  ${n.name}${
    isDir(n) ? "/" : ""
  }`;
}

export const commands: Record<string, Command> = {
  pwd: {
    name: "pwd",
    summary: "print working directory",
    run: (ctx) => ok([pathString(ctx.cwd) === "/" ? "/" : pathString(ctx.cwd)]),
  },

  ls: {
    name: "ls",
    summary: "list directory contents",
    run: (ctx, args) => {
      const { flags, rest } = parseFlags(args);
      const target = rest[0] ?? ".";
      const segs = resolvePath(ctx.cwd, target, ctx.home);
      if (linkDown(ctx, segs)) return err(`ls: ${target}: ${LINK_MSG}`);
      const node = getNode(ctx.root, segs);
      if (!node) return err(`ls: ${target}: No such file or directory`);
      const all = flags.has("a");
      let items = listing(node, all);
      if (all && isDir(node)) {
        items = [
          { type: "dir", name: ".", children: [] },
          { type: "dir", name: "..", children: [] },
          ...items,
        ];
      }
      if (flags.has("l")) {
        return ok([`total ${items.length}`, ...items.map(longLine)]);
      }
      if (items.length === 0) return ok([]);
      return ok([items.map((n) => (isDir(n) ? n.name + "/" : n.name)).join("   ")]);
    },
  },

  cd: {
    name: "cd",
    summary: "change directory",
    run: (ctx, args) => {
      const target = args[0] ?? "~";
      const segs = resolvePath(ctx.cwd, target, ctx.home);
      if (linkDown(ctx, segs)) return err(`cd: ${target}: ${LINK_MSG}`);
      const node = getNode(ctx.root, segs);
      if (!node) return err(`cd: ${target}: No such file or directory`);
      if (!isDir(node)) return err(`cd: ${target}: Not a directory`);
      ctx.setCwd(segs);
      return ok();
    },
  },

  cat: {
    name: "cat",
    summary: "print file contents",
    run: (ctx, args) => {
      if (args.length === 0) return err("cat: missing operand");
      const out: string[] = [];
      let good = true;
      for (const target of args) {
        const segs = resolvePath(ctx.cwd, target, ctx.home);
        if (linkDown(ctx, segs)) {
          out.push(`cat: ${target}: ${LINK_MSG}`);
          good = false;
          continue;
        }
        const node = getNode(ctx.root, segs);
        if (!node) {
          out.push(`cat: ${target}: No such file or directory`);
          good = false;
        } else if (isDir(node)) {
          out.push(`cat: ${target}: Is a directory`);
          good = false;
        } else {
          ctx.markRead(pathString(segs));
          out.push(...node.content.split("\n"));
        }
      }
      return { lines: out, ok: good };
    },
  },

  mkdir: {
    name: "mkdir",
    summary: "create a directory",
    run: (ctx, args) => {
      if (args.length === 0) return err("mkdir: missing operand");
      for (const target of args) {
        const segs = resolvePath(ctx.cwd, target, ctx.home);
        if (getNode(ctx.root, segs)) return err(`mkdir: ${target}: File exists`);
        const parent = getParent(ctx.root, segs);
        if (!parent) return err(`mkdir: ${target}: No such file or directory`);
        addChild(parent, {
          type: "dir",
          name: segs[segs.length - 1],
          children: [],
          hidden: segs[segs.length - 1].startsWith("."),
        });
      }
      return ok();
    },
  },

  touch: {
    name: "touch",
    summary: "create an empty file",
    run: (ctx, args) => {
      if (args.length === 0) return err("touch: missing file operand");
      for (const target of args) {
        const segs = resolvePath(ctx.cwd, target, ctx.home);
        if (getNode(ctx.root, segs)) continue;
        const parent = getParent(ctx.root, segs);
        if (!parent) return err(`touch: ${target}: No such file or directory`);
        addChild(parent, { type: "file", name: segs[segs.length - 1], content: "" });
      }
      return ok();
    },
  },

  cp: {
    name: "cp",
    summary: "copy files and directories",
    run: (ctx, args) => {
      const { flags, rest } = parseFlags(args);
      if (rest.length < 2) return err("cp: missing destination file operand");
      const dest = rest[rest.length - 1];
      const sources = rest.slice(0, -1);
      const destSegs = resolvePath(ctx.cwd, dest, ctx.home);
      const destNode = getNode(ctx.root, destSegs);

      for (const src of sources) {
        const srcSegs = resolvePath(ctx.cwd, src, ctx.home);
        if (linkDown(ctx, srcSegs)) return err(`cp: ${src}: ${LINK_MSG}`);
        const srcNode = getNode(ctx.root, srcSegs);
        if (!srcNode) return err(`cp: ${src}: No such file or directory`);
        if (isDir(srcNode) && !flags.has("r") && !flags.has("R"))
          return err(`cp: ${src} is a directory (not copied)`);

        if (destNode && isDir(destNode)) {
          addChild(destNode, { ...clone(srcNode), name: srcNode.name });
        } else {
          const parent = getParent(ctx.root, destSegs);
          if (!parent) return err(`cp: ${dest}: No such file or directory`);
          addChild(parent, { ...clone(srcNode), name: destSegs[destSegs.length - 1] });
        }
      }
      return ok();
    },
  },

  mv: {
    name: "mv",
    summary: "move or rename files",
    run: (ctx, args) => {
      if (args.length < 2) return err("mv: missing destination file operand");
      const dest = args[args.length - 1];
      const sources = args.slice(0, -1);
      const destSegs = resolvePath(ctx.cwd, dest, ctx.home);
      const destNode = getNode(ctx.root, destSegs);

      for (const src of sources) {
        const srcSegs = resolvePath(ctx.cwd, src, ctx.home);
        if (linkDown(ctx, srcSegs)) return err(`mv: ${src}: ${LINK_MSG}`);
        const srcNode = getNode(ctx.root, srcSegs);
        if (!srcNode) return err(`mv: ${src}: No such file or directory`);
        const srcParent = getParent(ctx.root, srcSegs);
        if (!srcParent) return err(`mv: ${src}: Operation not permitted`);
        const copy = clone(srcNode);
        removeChild(srcParent, srcNode.name);
        if (destNode && isDir(destNode)) {
          addChild(destNode, copy);
        } else {
          const parent = getParent(ctx.root, destSegs);
          if (!parent) return err(`mv: ${dest}: No such file or directory`);
          copy.name = destSegs[destSegs.length - 1];
          addChild(parent, copy);
        }
      }
      return ok();
    },
  },

  rm: {
    name: "rm",
    summary: "remove files or directories",
    run: (ctx, args) => {
      const { flags, rest } = parseFlags(args);
      if (rest.length === 0) return err("rm: missing operand");
      for (const target of rest) {
        const segs = resolvePath(ctx.cwd, target, ctx.home);
        if (linkDown(ctx, segs)) return err(`rm: ${target}: ${LINK_MSG}`);
        const node = getNode(ctx.root, segs);
        if (!node) return err(`rm: ${target}: No such file or directory`);
        if (isDir(node) && !(flags.has("r") || flags.has("R")))
          return err(`rm: ${target}: is a directory`);
        const parent = getParent(ctx.root, segs);
        if (!parent) return err(`rm: ${target}: Operation not permitted`);
        removeChild(parent, node.name);
      }
      return ok();
    },
  },

  clear: {
    name: "clear",
    summary: "clear the screen",
    run: () => ({ lines: [], ok: true, clear: true }),
  },

  echo: {
    name: "echo",
    summary: "print text",
    run: (_ctx, args) => ok([args.join(" ")]),
  },

  whoami: {
    name: "whoami",
    summary: "print current user",
    run: () => ok(["student"]),
  },

  help: {
    name: "help",
    summary: "list available commands",
    run: () =>
      ok([
        "This shell is a reconstruction. Available programs:",
        "",
        ...Object.values(commands).map((c) => `  ${c.name.padEnd(8)} ${c.summary}`),
        "",
        "Options are not documented here. Check your notes.",
      ]),
  },
};

export function runCommand(ctx: CmdContext, input: string): CmdResult & { name: string } {
  const parts = input.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { name: "", lines: [], ok: true };
  const [name, ...args] = parts;
  const cmd = commands[name];
  if (!cmd) return { name, lines: [`${name}: command not found`], ok: false };
  return { name, ...cmd.run(ctx, args) };
}

export const promptPath = (cwd: string[], home: string[]) => displayPath(cwd, home);
