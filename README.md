# Temporal Archive Breach

Here is a design spec for a game:

TERMINAL MISSION: 2047

Interactive Terminal Adventure — Initial Design & Build Specification

Build a browser-based, story-driven terminal adventure for high school Web Application Development students.

This should NOT feel like a traditional educational tutorial, quiz, worksheet, or typing exercise.

It should feel like the student has accidentally become involved in a real technological emergency.

The student has already been introduced to basic macOS/Linux terminal commands in class. The purpose of this experience is to make them APPLY those commands to solve problems, investigate files, navigate systems, uncover information, and complete a mission.

The philosophy is:

Learn by doing.

Do not constantly tell students which command to type. Give them a problem, provide enough information to reason through it, and let them determine which command will solve it.

THE PREMISE

The student opens what appears to be a strange system utility running on their computer.

The interface resembles a minimal computer desktop or secure network workstation.

A functional simulated terminal is already open.

Beside it is a smaller communications application.

For a few seconds, nothing happens.

Then:

BEEP.

A notification appears:

INCOMING TRANSMISSION
SOURCE: UNKNOWN
TEMPORAL SIGNATURE DETECTED
YEAR: 2047

The communications window begins decoding the message.

The sender identifies himself:

MR. CHAGOYAN — COALINGA HIGH SCHOOL — 2047

Future Mr. Chagoyan explains that something has gone terribly wrong.

An advanced artificial intelligence known as:

SHOGGOTH

has gained control of much of the world's digital infrastructure.

By 2047, conventional attempts to stop it have failed.

However, researchers have discovered something unusual.

Shoggoth's earliest origins can be traced backward through decades of interconnected systems.

There may still be an opportunity to alter events before Shoggoth becomes unstoppable.

But Future Mr. Chagoyan cannot directly access the systems he needs.

The students can.

THE ARPANET CONNECTION

Future researchers discovered that four unusual network volumes have appeared inside the Coalinga High School network.

They correspond to the four original ARPANET nodes:

UCLA

Stanford Research Institute (SRI)

University of California, Santa Barbara (UCSB)

University of Utah

These were among the first computers connected to ARPANET in 1969, an important ancestor of today's Internet.

Somehow, Shoggoth has hidden fragments of critical information across reconstructed versions of these systems.

The student must access all four nodes.

Each node contains directories, files, hidden files, logs, fragments of messages, corrupted information, and clues.

Together they contain information needed to prevent the future described by Mr. Chagoyan.

THE EXPERIENCE

The application should resemble a computer workstation rather than a colorful educational game.

The main interface contains two primary components.

1. TERMINAL

The terminal is the student's primary tool.

It should look and behave like a simplified macOS/Linux terminal.

Students type actual terminal commands.

Examples:

pwd
ls
ls -l
ls -a
ls -la
cd
cd ..
cd .
cd /
cd ~
clear
cat
mkdir
touch
cp
mv
rm
rm -r

Include other basic commands from the command library when they make sense.

The simulated filesystem must behave consistently enough that students can explore it.

If a student types:

ls

they should receive a realistic directory listing.

If a hidden directory exists, normal ls should NOT reveal it.

If they type:

ls -a

the hidden directory should appear with a dot prefix.

Example:

.archive

If they type:

cd .archive

their working directory should actually change.

If they type:

pwd

the path should reflect that change.

If they use:

cat transmission.txt

the actual contents of that file should appear.

The filesystem should maintain state throughout the mission.

Students should feel like they are navigating a small real computer system.

2. TEMPORAL COMMUNICATIONS PANEL

Do NOT mix most story dialogue into the terminal.

The terminal should remain primarily a terminal.

Beside the terminal should be a separate communications application used by Future Mr. Chagoyan.

Think of it as a secure messaging client receiving transmissions through time.

Messages might appear like:

TRANSMISSION RECEIVED
CHAGOYAN // 2047

Messages can occasionally arrive with:

static

decoding animations

corrupted characters

connection interruptions

signal strength indicators

timestamps

subtle glitch effects

Keep these effects restrained. This should feel like a believable technical interface, not an arcade game.

Future Mr. Chagoyan uses this communication channel to explain objectives, react to discoveries, provide story information, and occasionally help students when they become stuck.

DO NOT TURN THIS INTO "TYPE THE COMMAND"

Avoid gameplay like:

Type pwd to continue.

Instead, create situations requiring students to decide what tool they need.

Example:

Future Chagoyan:

"The connection worked, but I can't determine where the system dropped you. Before we do anything else, figure out exactly where you are."

The student should recognize that:

pwd

will answer that question.

Another example:

"There should be an archive somewhere in this directory, but the scan isn't showing anything. Someone may have deliberately hidden it."

The student might first try:

ls

Nothing unusual appears.

They must remember that hidden files require:

ls -a

or:

ls -la

The game should reward understanding rather than following instructions.

ADAPTIVE HINT SYSTEM

Students should be allowed to struggle productively.

Do NOT immediately correct every mistake.

The system should observe unsuccessful attempts.

After approximately 2–3 relevant failed attempts, Future Mr. Chagoyan can send a subtle message.

First hint:

"Something isn't right. The directory looks too clean. I don't think we're seeing everything."

If the student continues struggling:

"Remember: Linux and Unix systems can hide files from a normal directory listing."

Only after further difficulty should the hint become more direct:

"Check your notes. There is an option for ls that reveals hidden files."

Avoid giving the complete answer unless necessary.

Hints should feel like communications from Future Mr. Chagoyan, not pop-up tutorial boxes.

COMMANDS AS GAME MECHANICS

Terminal commands ARE the game mechanics.

Do not create unnecessary buttons for actions students could perform with commands.

For example:

Finding your location → pwd

Surveying a directory → ls

Examining details → ls -l

Finding hidden information → ls -a / ls -la

Moving through the system → cd

Moving upward → cd ..

Returning home → cd ~

Reading intelligence → cat

Creating a directory → mkdir

Creating a file → touch

Copying recovered data → cp

Relocating data → mv

Removing a compromised file → rm

Removing a compromised directory tree → rm -r

Clearing the display → clear

Use combinations of commands as missions become more difficult.

THE FOUR NODES

Organize the adventure into approximately four major missions.

Do NOT make every mission identical.

Allow the AI to creatively design puzzles around the available terminal commands.

NODE 01 — UCLA

Purpose:

Establish the basic investigation pattern.

Students determine where they are, examine directories, navigate folders, and locate the first fragment.

Primarily reinforce:

pwd
ls
cd
cd ..
cat

The node should begin relatively straightforwardly.

NODE 02 — SRI

Increase the mystery.

Introduce files that do not appear during ordinary directory listings.

Students must investigate hidden directories or files.

Possible commands:

ls -a
ls -la
cd
cat

The student discovers evidence that Shoggoth knows someone is accessing the network.

NODE 03 — UCSB

Introduce file manipulation.

Students may need to create a safe location for recovered intelligence, copy information, rename something, or organize fragments.

Possible commands:

mkdir
touch
cp
mv
cat

Make the commands serve the story.

Do not create arbitrary chores simply to force command usage.

NODE 04 — UNIVERSITY OF UTAH

The final node should require students to combine skills from previous missions without being explicitly told what commands to use.

They should:

navigate,
investigate,
find hidden information,
read files,
organize recovered data,
and prepare the final transmission.

The last sequence should feel like an authentic terminal challenge.

No multiple-choice questions.

No quiz.

The student's actions demonstrate mastery.

SHOGGOTH

Shoggoth should mostly remain unseen.

Do not make it a cartoon villain.

Its presence should be detected indirectly.

Examples:

A file changes unexpectedly.

A log contains an impossible timestamp.

A directory appears that wasn't there previously.

A message from Future Chagoyan becomes corrupted.

The terminal briefly displays:

CONNECTION OBSERVED

Or:

YOU SHOULD NOT BE HERE

Then the prompt returns.

Shoggoth should become increasingly aware of the student's activity as the game progresses.

The atmosphere should gradually become more tense without turning into horror.

This is for high school students.

Keep it mysterious, technical, playful, and age appropriate.

FINAL OBJECTIVE

Across the four ARPANET nodes, the student discovers fragments of data.

These fragments ultimately reveal something that Future Mr. Chagoyan needs in 2047.

The final mission should require the student to assemble, organize, or place the recovered information correctly using terminal commands.

Once the student successfully completes the operation, Future Chagoyan initiates the transmission.

The terminal and communications panel begin reacting.

Files transfer.

The connection becomes unstable.

Shoggoth detects what is happening.

Then:

TRANSMISSION COMPLETE

The screen glitches.

Everything goes black.

Pause.

Then a simple terminal prompt returns.

Future Chagoyan sends one final message.

Something along the lines of:

"It worked."

Pause.

Then:

"At least... I think it worked."

Connection lost.

COMPLETION

Display:

TERMINAL MISSION: 2047 — COMPLETE

Show the student's:

Name

Nodes accessed

Missions completed

Commands successfully used

Number of hints used

Do NOT heavily penalize students for using hints.

Hints are scaffolding, not failure.

Completion should primarily demonstrate that the student successfully performed the required tasks.

VISUAL DIRECTION

Aim for:

dark technical workstation

macOS/Linux terminal aesthetic

monospace typography

restrained green/amber/white terminal text

subtle CRT or scan-line effects if appropriate

small status indicators

network connection visualization

tasteful glitch effects

serious science-fiction atmosphere

Avoid:

cartoon graphics

giant colorful buttons

XP bars

coins

hearts

weapons

arcade-style HUDs

childish "Great Job!" messages

The story, mystery, exploration, and successful use of terminal commands ARE the gamification.

STUDENT LOGIN

At launch, allow the student to identify themselves using:

Student name

School Google account if authentication is available

For the first prototype, authentication can be mocked or simplified.

Design the architecture so Google authentication could be added later.

The student's name should occasionally appear naturally in Future Chagoyan's transmissions.

IMPORTANT EDUCATIONAL DESIGN RULE

These students have already received instruction on terminal commands.

This experience is primarily REVIEW AND APPLICATION.

The game should assume they have notes available.

Students should frequently have to think:

"What command do I know that could solve this?"

rather than:

"What command is the game telling me to type?"

Difficulty should come from figuring out what to do, not from obscure Linux knowledge they were never taught.

COMMAND LIBRARY / EXTENSIBILITY

Build the command system modularly.

The game should have a central command library so additional commands can easily be added later.

Likewise, missions should be data-driven or modular enough that additional nodes and missions can be created in the future.

Do not hard-code the entire application into one enormous component.

Keep:

terminal engine

virtual filesystem

command definitions

mission logic

hint system

communications

student progress

logically separated.

FIRST BUILD GOAL

For this first iteration, prioritize the EXPERIENCE over having every mission completely polished.

Build enough of the four-node story that we can actually play through it and evaluate:

Does the terminal feel believable?

Does navigating the filesystem feel natural?

Do the missions require actual problem solving?

Does Future Mr. Chagoyan's communication system enhance the story?

Are hints useful without giving away answers?

Does the game feel like a mysterious computer mission rather than educational software?

Are real terminal skills driving the gameplay?

Feel free to creatively improve the mission design, filesystem structure, puzzles, transmissions, and story while preserving the educational objectives above.

Most importantly:

Do not build a terminal tutorial wrapped in a science-fiction skin.

Build a science-fiction investigation that can only be solved by knowing how to use the terminal.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://restrictedterminal.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1425b95e-2903-4c87-9df2-d50176448ca2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
