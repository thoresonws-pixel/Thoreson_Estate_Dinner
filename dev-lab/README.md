# Local player lab

Run the actual TV and player pages with independent Firebase Auth identities against local Auth and Realtime Database emulators. No live accounts, game data, or Hosting deployments are involved.

On this computer, start with:

```powershell
powershell -ExecutionPolicy Bypass -File dev-lab/Start-PlayerLab.ps1
```

Open http://127.0.0.1:5173. The TV stays signed in as the test host. The player dropdown loads a normal player identity for each character in the selected story. **Open TV separately** and **Open player window** support a two-monitor workspace. **Reload screens** loads the latest local code. A code edit does not create a Firebase Hosting release.

`launch.json` chooses the story package; the engine and lab do not assume a cast or act count. Pass `-StoryId` when starting a different story after stopping the existing lab. A fresh local game starts at that story's first exploration step, or first step if it has no exploration.

Each character has a distinct emulator UID, ordinary player role, separate browser storage namespace, and memory-only Auth session. Switching does not rewrite a character on your real account. All action handlers see the selected player's actual test UID. The host session remains independent. No developer capability is granted to test players. Character-specific puzzle mechanics still need their own implementation; this switcher does not itself implement toy placement.

Progress is saved every five seconds to `../../.player-lab-work/state/database.json` and restored on restart. Auth emulator identities are recreated with the same UIDs as needed. These are deliberately local development identities, not production credentials. The server only binds to loopback, rejects foreign Host headers, and uses a browser connection policy that blocks production Firebase endpoints. It does not support access from a physical phone yet; remote phone access needs a separate secured connection. Auth rules load from the repository's current `database.rules.json`; the existing broad game permissions are unchanged and remain a separate production-hardening concern.

Stop gracefully with:

```powershell
Invoke-WebRequest -Method Post http://127.0.0.1:5173/__lab/stop
```

Prerequisites: Node.js, Firebase CLI, and the portable Java 21 runtime installed in `../../.player-lab-work/runtime`. The runtime was downloaded from Adoptium and SHA-256 checked against its published package metadata. Emulator and server logs are in the local state directory. `dev-lab/**` is excluded from Firebase Hosting.

Validation uses real emulated authentication and the shared phone action code: private inventory isolation and persistence across switches, character-only memory delivery, selected-UID puzzle-win attribution, and independent host identity. It is a testing workspace, not a claim that production authorization is fully hardened.

### Drawing-room maze and cooperative billiards prototype

- In the workshop, inspect the separate Workshop cabinet and collect the Brass key. In the drawing room, inspect the Clockwork Maze Cabinet and explicitly try the key.
- Select participants on the TV and start the maze. Use the lab's player dropdown to see guides and controllers as distinct authenticated players. Pause on the TV while inspecting multiple players alone. The default three-minute countdown, one midpoint shuffle and seven-second shuffle pause are story configuration.
- The TV shows completion status, never the playable maze routes. Ask for help once for coordination instructions, twice for short route hints. The newly opened reward drawer contains Margaret Hartley’s obituary; inspect it and take the document separately.
- Inspecting the billiards table assigns a personal toy to each player once. Find the Bird owner in Personal inventory. Everyone can open Play billiards or View puzzle board. Only the Bird owner's successful four-letter routine unlocks the drawer. Toys remain attached to their test accounts when switching.

These changes run locally; they have not been published to the public website.
