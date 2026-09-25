# Local player lab

Use **Open player windows** for one switchable player window or a separate named window for every player in the loaded story. Separate windows keep their assigned identity across refreshes. Browsers may block multiple pop-ups; the lab lists blocked players so you can open them individually or allow pop-ups for localhost and retry. Reopening reuses the named windows. Window-versus-tab presentation is ultimately controlled by your browser.

Run the actual TV and player pages with independent Firebase Auth identities against local Auth and Realtime Database emulators. No live accounts, game data, or Hosting deployments are involved.

On this computer, start with:

```powershell
powershell -ExecutionPolicy Bypass -File dev-lab/Start-PlayerLab.ps1
```

Open http://127.0.0.1:5173. The TV stays signed in as the test host. The player dropdown loads a normal player identity for each character in the selected story. **Open TV separately** and **Open player window** support a two-monitor workspace. **Reload screens** loads the latest local code. A code edit does not create a Firebase Hosting release.

`launch.json` chooses the story package; the engine and lab do not assume a cast or act count. Pass `-StoryId` when starting a different story after stopping the existing lab. A fresh local game starts at that story's first exploration step, or first step if it has no exploration.

Each character has a distinct emulator UID, ordinary player role, separate browser storage namespace, and memory-only Auth session. Switching does not rewrite a character on your real account. All action handlers see the selected player's actual test UID. The host session remains independent. No developer capability is granted to test players. Character-specific puzzle mechanics still need their own implementation; this switcher does not itself implement toy placement.

Progress is saved every five seconds to `../.player-lab-work/development-0/database.json` (relative to this guide; inside this checkout) and restored on restart. Auth emulator identities are recreated with the same UIDs as needed. These are deliberately local development identities, not production credentials. The server only binds to loopback, rejects foreign Host headers, and uses a browser connection policy that blocks production Firebase endpoints. It does not support access from a physical phone yet; remote phone access needs a separate secured connection. Auth rules load from the repository's current `database.rules.json`; the existing broad game permissions are unchanged and remain a separate production-hardening concern.

Stop gracefully with:

```powershell
Invoke-WebRequest -Method Post http://127.0.0.1:5173/__lab/stop
```

Prerequisites: Node.js 22 and Java 21. Run `npm ci` once, then `npm run dev` on Windows, macOS or Linux. Firebase CLI is installed from the lockfile. Java is found through JAVA_HOME or PATH; this computer's existing portable runtime is also supported. Emulator and server logs are in the local state directory. `dev-lab/**` is excluded from Firebase Hosting.

Automated validation uses real emulated authentication to check per-player inventory display, tab persistence, and the all-player Actions grid. Runtime tests cover two-client transitions and pause/reconnect behavior. Memory delivery and puzzle-win attribution still need additional end-to-end regression coverage. It is a testing workspace, not a claim that production authorization is fully hardened.

### Drawing-room maze and cooperative billiards prototype

- In the workshop, inspect the separate Workshop cabinet and collect the Brass key. In the drawing room, inspect the Clockwork Maze Cabinet and explicitly try the key.
- Select participants on the TV and start the maze. Use the lab's player dropdown to see guides and controllers as distinct authenticated players. Pause on the TV while inspecting multiple players alone. The default three-minute countdown, one midpoint shuffle and seven-second shuffle pause are story configuration.
- The TV shows completion status, never the playable maze routes. Ask for help once for coordination instructions, twice for short route hints. The newly opened reward drawer contains Margaret Hartley’s obituary; inspect it and take the document separately.
- Inspecting the billiards table assigns a personal toy to each player once. Find the Bird owner in Personal inventory. Everyone can open Play billiards or View puzzle board. Only the Bird owner's successful four-letter routine unlocks the drawer. Toys remain attached to their test accounts when switching.

These changes run locally; they have not been published to the public website.

### Toolbar controls

Reset game clears local game/player progress (including discoveries, inventory and puzzles), keeps test identities, and starts at the story package's first step after confirmation. Progress story follows the current step's next transition immediately, bypassing timers. Jump to / Go selects any defined story step while retaining discoveries. These controls only write to the local emulator. Reload any separately opened TV/player pages after reset to clear their temporary UI state.


All players collapses the embedded TV and opens one independent phone panel per story character in a scrollable grid, initially on Actions. The TV stays connected; use Open TV separately on another monitor. Show Actions on all returns every panel to Actions. TV + selected player closes the extra phone sessions. Single-player switching keeps the most recently selected tab. During non-investigation story phases, normal story screens still take priority.


Automated tests never reuse this server. See [testing guide](../docs/TESTING.md) for isolated runs, traces, multiple checkouts and migrating your old local snapshot.
