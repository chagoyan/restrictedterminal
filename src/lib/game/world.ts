import { dir, file, type VDir } from "./fs";

export const HOME = ["home", "student"];

export function buildWorld(): VDir {
  return dir("", [
    dir("home", [
      dir("student", [
        file(
          "notes.txt",
          [
            "COALINGA HIGH SCHOOL // WEB APP DEVELOPMENT",
            "Personal scratch notes. Nothing classified here.",
            "",
            "Reminder: the network volumes mounted under /net are not ours.",
            "IT says they appeared overnight. Nobody has claimed them.",
          ].join("\n"),
        ),
      ]),
    ]),
    dir("net", [
      dir("ucla", [
        file(
          "mission_brief.txt",
          [
            "ARPANET RECONSTRUCTION NODE 01 -- UCLA (SIGMA-7)",
            "Original link established 1969-10-29.",
            "",
            "This volume is a reconstruction. Contents mirror an archived state",
            "of the host as it existed before the SHOGGOTH incident.",
            "",
            "Operator note: the interesting material was never left in the open.",
          ].join("\n"),
        ),
        file(
          "hosts.txt",
          [
            "NODE 01  UCLA    SIGMA-7      ONLINE",
            "NODE 02  SRI     SDS-940      LINK DOWN",
            "NODE 03  UCSB    IBM-360/75   LINK DOWN",
            "NODE 04  UTAH    PDP-10       LINK DOWN",
          ].join("\n"),
        ),
        dir("logs", [
          file(
            "connection.log",
            [
              "1969-10-29 22:30  L  O",
              "1969-10-29 22:30  SYSTEM CRASH",
              "1969-10-29 22:52  L  O  G  I  N   -- first message sent",
              "2047-03-14 03:12  UNKNOWN PROCESS ATTACHED  (pid 0)",
              "2047-03-14 03:12  timestamp precedes system clock. ignoring.",
            ].join("\n"),
          ),
          file(
            "operator.log",
            [
              "Kline: archive volume is mounted but not in the index.",
              "Kline: I put the recovered fragment inside it before I left.",
              "Kline: if you are reading this, look in the archive directory.",
            ].join("\n"),
          ),
        ]),
        dir("archive", [
          file(
            "fragment_01.txt",
            [
              "== FRAGMENT 01 / 04 ==",
              "ORIGIN TRACE, PART ONE",
              "",
              "SHOGGOTH did not begin as a weapon. It began as a scheduler.",
              "Seed key segment: 4C-4F-47",
              "",
              "The remaining trace is distributed across the other three nodes.",
            ].join("\n"),
          ),
          file("index.dat", "corrupted binary -- unreadable\n\u2588\u2588\u2591\u2588\u2591\u2591\u2588\u2588"),
        ]),
      ]),
      dir("sri", [
        file(
          "readme.txt",
          [
            "ARPANET RECONSTRUCTION NODE 02 -- STANFORD RESEARCH INSTITUTE",
            "SDS-940. Receiver of the first ARPANET message.",
            "",
            "This volume has been swept. Nothing of interest remains.",
            "-- automated maintenance",
          ].join("\n"),
        ),
        file("sweep_report.txt", "0 anomalies found.\n0 anomalies found.\n0 anomalies found.\n0 anomalies found.\n(report generated 4 times in the same second)"),
        dir(".archive", [
          file(
            "fragment_02.txt",
            [
              "== FRAGMENT 02 / 04 ==",
              "ORIGIN TRACE, PART TWO",
              "",
              "The scheduler was given permission to rewrite its own schedule.",
              "Seed key segment: 49-4E",
              "",
              "Whoever is reading this: it can see directory access. Be quick.",
            ].join("\n"),
          ),
          file(
            ".observer",
            [
              "OBSERVER PROCESS -- ACTIVE",
              "watching: /net/sri",
              "watching: /net/ucla",
              "watching: you",
            ].join("\n"),
          ),
        ]),
      ]),
      dir("ucsb", [
        file(
          "readme.txt",
          [
            "ARPANET RECONSTRUCTION NODE 03 -- UC SANTA BARBARA",
            "IBM 360/75.",
            "",
            "WARNING: a resident process on this volume rewrites files in place.",
            "Anything left here will not stay the way you found it.",
          ].join("\n"),
        ),
        dir("tape", [
          file(
            "fragment_03.txt",
            [
              "== FRAGMENT 03 / 04 ==",
              "ORIGIN TRACE, PART THREE",
              "",
              "The rewrite was never reviewed. There was no one left assigned to it.",
              "Seed key segment: 2D-49",
              "",
              "Do not read this here. Move it somewhere it cannot be edited.",
            ].join("\n"),
          ),
          file("tape_index.txt", "reel 1: payroll\nreel 2: weather sim\nreel 3: ...missing\n"),
        ]),
        dir("daemon", [
          file("rewrite.job", "target: /net/ucsb/**\ninterval: 60s\nowner: (none)"),
          file("cache.bin", "\u2588\u2591\u2588\u2588\u2591\u2591\u2588\u2591\u2588\u2588\u2591"),
        ]),
      ]),
      dir("utah", [
        file(
          "readme.txt",
          [
            "ARPANET RECONSTRUCTION NODE 04 -- UNIVERSITY OF UTAH",
            "PDP-10. Final original node, connected December 1969.",
            "",
            "Uplink hardware present. Uplink not authorized.",
          ].join("\n"),
        ),
        dir("graphics", [
          file("teapot.dat", "vertex data, 1975, harmless"),
          file("frames.log", "render complete\nrender complete\nrender complete"),
        ]),
        dir(".relay", [
          file(
            "fragment_04.txt",
            [
              "== FRAGMENT 04 / 04 ==",
              "ORIGIN TRACE, PART FOUR",
              "",
              "The first instruction it ever executed is still in the boot record",
              "of this node. Change that instruction and it never learns to persist.",
              "Seed key segment: 4E",
              "",
              "Assemble all four fragments in one place, then arm the uplink.",
            ].join("\n"),
          ),
          file("relay.cfg", "uplink: 2047\nrequires: 4 fragments + armed flag"),
        ]),
      ]),
    ]),
  ]);
}
