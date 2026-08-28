// Virtual filesystem: pure data + pure helpers.

export type VFile = {
  type: "file";
  name: string;
  content: string;
  hidden?: boolean;
  locked?: boolean;
};

export type VDir = {
  type: "dir";
  name: string;
  hidden?: boolean;
  locked?: boolean;
  children: VNode[];
};

export type VNode = VFile | VDir;

export const isDir = (n: VNode): n is VDir => n.type === "dir";

export const dir = (name: string, children: VNode[], opts: Partial<VDir> = {}): VDir => ({
  type: "dir",
  name,
  children,
  ...opts,
});

export const file = (name: string, content: string, opts: Partial<VFile> = {}): VFile => ({
  type: "file",
  name,
  content,
  ...opts,
});

export const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

/** Normalize a path string into an absolute segment array. */
export function resolvePath(cwd: string[], input: string, home: string[]): string[] {
  let base: string[];
  let rest = input;

  if (input === "~" || input.startsWith("~/")) {
    base = [...home];
    rest = input.slice(1).replace(/^\//, "");
  } else if (input.startsWith("/")) {
    base = [];
    rest = input.slice(1);
  } else {
    base = [...cwd];
  }

  for (const seg of rest.split("/")) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") base.pop();
    else base.push(seg);
  }
  return base;
}

export function pathString(segments: string[]): string {
  return "/" + segments.join("/");
}

export function displayPath(segments: string[], home: string[]): string {
  const full = pathString(segments);
  const h = pathString(home);
  if (full === h) return "~";
  if (full.startsWith(h + "/")) return "~" + full.slice(h.length);
  return full;
}

export function getNode(root: VDir, segments: string[]): VNode | null {
  let cur: VNode = root;
  for (const seg of segments) {
    if (!isDir(cur)) return null;
    const next = cur.children.find((c) => c.name === seg);
    if (!next) return null;
    cur = next;
  }
  return cur;
}

export function getParent(root: VDir, segments: string[]): VDir | null {
  if (segments.length === 0) return null;
  const p = getNode(root, segments.slice(0, -1));
  return p && isDir(p) ? p : null;
}

export function removeChild(parent: VDir, name: string) {
  parent.children = parent.children.filter((c) => c.name !== name);
}

export function addChild(parent: VDir, node: VNode) {
  removeChild(parent, node.name);
  parent.children.push(node);
}

export function exists(root: VDir, path: string): boolean {
  return getNode(root, path.split("/").filter(Boolean)) !== null;
}
