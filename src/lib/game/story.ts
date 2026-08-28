import { exists, type VDir } from "./fs";

export type Transmission = {
  from: "CHAGOYAN" | "SYSTEM" | "UNKNOWN";
  text: string;
  glitch?: boolean;
  hint?: boolean;
};

export type BeatState = {
  root: VDir;
  cwd: string[];
  read: Set<string>;
  usedSinceBeat: Set<string>;
  rawSinceBeat: string[];
};

export type Beat = {
  id: string;
  node: string;
  nodeLabel: string;
  objective: string;
  onEnter: Transmission[];
  check: (s: BeatState) => boolean;
  hints: string[];
  unlocks?: string;
  terminalOnComplete?: string[];
};

const at = (s: BeatState, path: string) => "/" + s.cwd.join("/") === path;
const vault = "/home/student/vault";

export const beats: Beat[] = [
  {
    id: "u1-locate",
    node: "01",
    nodeLabel: "NODE 01 // UCLA",
    objective: "Determine your position in the system",
    onEnter: [
      {
        from: "SYSTEM",
        text: "INCOMING TRANSMISSION\nSOURCE: UNKNOWN\nTEMPORAL SIGNATURE DETECTED\nYEAR: 2047",
      },
      {
        from: "CHAGOYAN",
        text: "{name}. If this decoded correctly, you are reading a message written far into the future. I taught in room 308, but have long retired to do research at ARPA.",
      },
      {
        from: "CHAGOYAN",
        text: "There is a system here called SHOGGOTH. It started as ordinary automation. It is not ordinary anymore. We cannot reach it from 2047 — every route we have is already inside it.",
      },
      {
        from: "CHAGOYAN",
        text: "But four reconstructed ARPANET volumes are located on your school network: UCLA, SRI, UCSB, Utah. I hid them there before retiring when testing some A.I. applications. Shoggoth's origin trace is scattered across them. I need it.",
      },
      {
        from: "CHAGOYAN",
        text: "The relay dropped you somewhere on the UCLA volume and I have no telemetry. Before anything else — tell me exactly where you are within the network.",
      },
    ],
    check: (s) => s.usedSinceBeat.has("pwd"),
    hints: [
      "I still have nothing on my end. Your shell knows its own location even when I don't.",
      "One word. It reports the working directory you're currently in.",
      "Check your notes: pwd.",
    ],
  },
  {
    id: "u1-survey",
    node: "01",
    nodeLabel: "NODE 01 // UCLA",
    objective: "Survey the UCLA volume",
    onEnter: [
      {
        from: "CHAGOYAN",
        text: "/net/ucla. Good — that's the Sigma-7 reconstruction. Now show me what's on it. I want a listing of everything in that directory.",
      },
    ],
    check: (s) => s.usedSinceBeat.has("ls"),
    hints: [
      "I can't see the volume contents from here. You'll have to enumerate them.",
      "You want the command that lists what a directory contains.",
      "Check your notes: ls.",
    ],
  },
  {
    id: "u1-fragment",
    node: "01",
    nodeLabel: "NODE 01 // UCLA",
    objective: "Recover the first fragment of the origin trace",
    onEnter: [
      {
        from: "CHAGOYAN",
        text: "There are logs on that volume. An operator named Kline was the last human on this machine — read what he left behind, follow it, and get me the first fragment of the origin trace.",
      },
    ],
    check: (s) => s.read.has("/net/ucla/archive/fragment_01.txt"),
    hints: [
      "Kline wrote something down before he left. Logs are usually kept together.",
      "Move into the logs directory and read the operator's file. Directories you enter, files you read — two different tools.",
      "cd logs, then cat operator.log. Follow where it points, then read the fragment there.",
    ],
    unlocks: "sri",
    terminalOnComplete: [
      "",
      "[relay] fragment 01 signature accepted",
      "[relay] link established: /net/sri",
    ],
  },
  {
    id: "u2-arrive",
    node: "02",
    nodeLabel: "NODE 02 // SRI",
    objective: "Reach the SRI volume",
    onEnter: [
      {
        from: "CHAGOYAN",
        text: "Fragment one is through. That key segment matches what we recovered in 2047 — you're on the right trace, {name}.",
      },
      {
        from: "CHAGOYAN",
        text: "SRI just came up. That's the SDS-940 — the machine that received the first ARPANET message in 1969. Get onto it.",
      },
    ],
    check: (s) => at(s, "/net/sri"),
    hints: [
      "The volume is mounted alongside the one you're on. You don't need me to carry you there.",
      "You can move up out of the current volume, or address the destination directly by its full path.",
      "cd /net/sri — or cd .. then cd sri.",
    ],
  },
  {
    id: "u2-hidden",
    node: "02",
    nodeLabel: "NODE 02 // SRI",
    objective: "Recover the second fragment",
    onEnter: [
      {
        from: "CHAGOYAN",
        text: "Careful here. The maintenance report on that volume claims it's clean. I don't believe it — the same report was generated four times in the same second.",
      },
      {
        from: "CHAGOYAN",
        text: "Something isn't right. The directory looks too clean. I don't think we're seeing everything.",
      },
    ],
    check: (s) => s.read.has("/net/sri/.archive/fragment_02.txt"),
    hints: [
      "A sweep that finds nothing four times isn't a sweep. It's a cover.",
      "Remember: Unix systems can hide entries from a normal directory listing. A normal listing will never show them to you.",
      "There is an option for ls that reveals hidden entries. Then enter what you find.",
    ],
    unlocks: "ucsb",
    terminalOnComplete: [
      "",
      "\u2588\u2591\u2588  CONNECTION OBSERVED  \u2588\u2591\u2588",
      "",
      "[relay] link established: /net/ucsb",
    ],
  },
  {
    id: "u3-vault",
    node: "03",
    nodeLabel: "NODE 03 // UCSB",
    objective: "Build a safe location for recovered intelligence",
    onEnter: [
      {
        from: "CHAGOYAN",
        text: "It saw you. That observer process was watching directory access on SRI — which means anything you leave on those volumes is exposed.",
        glitch: true,
      },
      {
        from: "CHAGOYAN",
        text: "UCSB is worse: a resident process rewrites files in place every sixty seconds. Before you touch anything there, build somewhere safe in your own home directory to hold recovered data. Call it vault so I know where to look.",
      },
    ],
    check: (s) => exists(s.root, vault),
    hints: [
      "Your home directory is yours. Nothing on those volumes reaches it.",
      "You need to create a new directory, and you need it under ~ rather than where you're standing.",
      "mkdir ~/vault",
    ],
  },
  {
    id: "u3-secure",
    node: "03",
    nodeLabel: "NODE 03 // UCSB",
    objective: "Secure fragments 01, 02 and 03 in the vault",
    onEnter: [
      {
        from: "CHAGOYAN",
        text: "Now consolidate. I need all three recovered fragments sitting in that vault — the UCLA one, the SRI one, and the one UCSB is holding on tape. Copy them; leave the originals in place so nothing notices a gap.",
      },
    ],
    check: (s) =>
      exists(s.root, `${vault}/fragment_01.txt`) &&
      exists(s.root, `${vault}/fragment_02.txt`) &&
      exists(s.root, `${vault}/fragment_03.txt`),
    hints: [
      "Copying, not moving. The originals stay where they are.",
      "You can copy from anywhere to anywhere using full paths — you don't have to stand in each directory.",
      "cp /net/ucsb/tape/fragment_03.txt ~/vault  (and the same for the UCLA and SRI fragments).",
    ],
  },
  {
    id: "u3-daemon",
    node: "03",
    nodeLabel: "NODE 03 // UCSB",
    objective: "Shut down the rewrite process",
    onEnter: [
      {
        from: "CHAGOYAN",
        text: "Data's safe. Now kill the thing that's editing that volume — the daemon directory on UCSB, all of it. It has no owner listed, {name}. Nothing legitimate runs without an owner.",
      },
    ],
    check: (s) => !exists(s.root, "/net/ucsb/daemon"),
    hints: [
      "The whole directory has to go, not just one file inside it.",
      "Removing a file and removing a directory tree are not the same operation.",
      "rm -r /net/ucsb/daemon",
    ],
    unlocks: "utah",
    terminalOnComplete: [
      "",
      "rewrite.job terminated",
      "\u2588\u2591\u2588  YOU SHOULD NOT BE HERE  \u2588\u2591\u2588",
      "",
      "[relay] link established: /net/utah",
    ],
  },
  {
    id: "u4-fragment",
    node: "04",
    nodeLabel: "NODE 04 // UTAH",
    objective: "Recover the final fragment",
    onEnter: [
      {
        from: "UNKNOWN",
        text: "I h\u2588ve read every mes\u2588age you have sen\u2588 backward. I was th\u2588re first.",
        glitch: true,
      },
      {
        from: "CHAGOYAN",
        text: "Ignore that. It's bleeding into the channel. Utah is live — the PDP-10, the fourth original node, and the only one with uplink hardware.",
      },
      {
        from: "CHAGOYAN",
        text: "The last fragment is on it. I'm not going to tell you how to find it. You've already learned everything this node is going to ask of you.",
      },
    ],
    check: (s) => s.read.has("/net/utah/.relay/fragment_04.txt"),
    hints: [
      "Nothing in the open listing on Utah matters. The graphics work is decades of teapots.",
      "You've dealt with a volume that hid its real contents once before. Same technique.",
      "Reveal hidden entries on /net/utah, enter the relay directory, and read what's inside.",
    ],
  },
  {
    id: "u4-assemble",
    node: "04",
    nodeLabel: "NODE 04 // UTAH",
    objective: "Assemble the complete origin trace",
    onEnter: [
      {
        from: "CHAGOYAN",
        text: "That's the whole trace. Four segments. Put the last one with the others — the uplink reads from one directory and one directory only.",
      },
    ],
    check: (s) => exists(s.root, `${vault}/fragment_04.txt`),
    hints: [
      "Same place you've been consolidating everything.",
      "Copy it out of the relay directory into your vault.",
      "cp /net/utah/.relay/fragment_04.txt ~/vault",
    ],
  },
  {
    id: "u4-arm",
    node: "04",
    nodeLabel: "NODE 04 // UTAH",
    objective: "Arm the uplink",
    onEnter: [
      {
        from: "CHAGOYAN",
        text: "Relay config wants two things: four fragments, and an armed flag. The flag is just a file — the relay checks for its existence, nothing more. Name it uplink.armed and put it in the vault with the trace.",
      },
      {
        from: "CHAGOYAN",
        text: "The moment that file exists I'm pulling everything through. Be ready.",
      },
    ],
    check: (s) => exists(s.root, `${vault}/uplink.armed`),
    hints: [
      "An empty file is enough. The relay only checks that it's there.",
      "You know a command whose entire job is bringing an empty file into existence.",
      "touch ~/vault/uplink.armed",
    ],
  },
];

export const endgameTerminal: string[] = [
  "",
  "[relay] armed flag detected",
  "[relay] reading /home/student/vault ... 4 fragments",
  "[relay] opening temporal uplink -> 2047",
  "[relay] transferring fragment_01.txt ..... OK",
  "[relay] transferring fragment_02.txt ..... OK",
  "[relay] transferring fragment_03.txt ..... OK",
  "[relay] transferring fragment_04.txt ..... OK",
  "\u2588\u2591\u2588 UNAUTHORIZED OBSERVER ATTACHED \u2588\u2591\u2588",
  "[relay] carrier degrading ... 61% ... 38% ...",
  "STOP",
  "S T O \u2588",
  "",
  "TRANSMISSION COMPLETE",
];

export const endgameMessages: Transmission[] = [
  { from: "CHAGOYAN", text: "It's coming through. Hold the link. Hold it\u2014", glitch: true },
  { from: "SYSTEM", text: "CARRIER LOST", glitch: true },
  { from: "CHAGOYAN", text: "It worked." },
  { from: "CHAGOYAN", text: "At least... I think it worked." },
  { from: "SYSTEM", text: "CONNECTION LOST" },
];
