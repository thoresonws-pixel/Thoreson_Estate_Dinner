# Testing without disrupting another developer

Run `npm ci`, install Java 21 and Node 22, then `npx playwright install chromium` (on Linux add `--with-deps`). `npm run doctor` diagnoses prerequisites and occupied ports before starting anything. An already running manual lab is reported as occupying its ports; that is expected, not a broken installation.

| Command | Purpose | State |
| --- | --- | --- |
| `npm run dev` | Inspect TV, switch players, show every phone, reset or skip story | Saved per checkout |
| `npm test` | Syntax, story validation, build isolation, pure puzzle and story transitions | No running game required |
| `npm run test:lab` | Chromium with real Auth and RTDB emulators | Fresh disposable test game |
| `npm run test:all` | Both automated layers, in order | Safe alongside the manual lab |

Manual lab defaults: web 5173, database 9000, auth 9099, hub 4400, logging 4500. Test lab adds 1000 to each port and uses `demo-mystery-test`, never the manual `demo-mystery-lab` project. Playwright refuses an existing server rather than borrowing a developer's session. Test mode never loads or writes saved database snapshots. No cloud credentials or paid services are required.

Two developers use independent clones and their own games. For simultaneous worktrees on one computer, set `LAB_PORT_OFFSET=20` in the second terminal; all five ports move together. In PowerShell use `$env:LAB_PORT_OFFSET=20`; in a POSIX shell use `LAB_PORT_OFFSET=20 npm run dev`. Keep the same offset for the life of that manual session. State lives in `.player-lab-work/development-<offset>/database.json` inside the checkout. Local state is ignored by Git and excluded from releases.

## Existing local saves

The former lab stored saves outside the repo at `../.player-lab-work/state/database.json`. That file is left untouched. To retain it, stop the old lab, make a backup, and copy that file to this checkout's `.player-lab-work/development-0/database.json` **before starting the new manual lab**. Do not overwrite a newer destination save. Otherwise the new lab starts fresh. This is local test data only; never import customer data or upload snapshots.

## Failure diagnosis

Playwright retains a screenshot and trace for failures. Open the report with `npx playwright show-report`; inspect a trace with `npx playwright show-trace <path-to-trace.zip>`. CI uploads browser diagnostics and emulator logs for seven days on failure. Those artifacts use disposable identities; do not add real credentials or customer fixtures. Neither reports nor traces ship to Hosting.

Start errors identify occupied ports instead of attaching to an existing emulator. Inspect `.player-lab-work/test-<offset-plus-1000>/emulators.log` for emulator failures. Fix the failure and rerun the affected test; do not delete another developer's saves or kill unrelated processes.

## Coverage and limits

The committed suite covers story/package validation, an alternate maze configuration, maze role allocation for 2–16 participants, stale moves, pause and shuffle logic, lab reset/jump behavior, separate checkout/test configuration, browser identity and inventory display, retained phone tabs, and the all-player Actions grid.

Story progression additionally checks versioned and legacy saves, duplicate/stale commands, timed gates, pause/resume, malformed saves, and an unrelated story flow. Real browser clients test simultaneous transitions, disconnect without queued host commands, paused state after refresh, and initialization before the first database snapshot arrives.

The production and development rules also run direct denied-request tests for forged profile roles, server-managed grants, revocation, unauthorized story changes/deletion and the development allowlist. These are not equivalent to a complete multiplayer security test or a complete second story playthrough. Required follow-up coverage: cross-game access, private memory payloads, reconnects during each puzzle, every puzzle reward exactly once, delayed/out-of-order commands, and iOS Safari/backgrounded phones. Browser views hiding information is not proof that the database prevents access.

Every new mechanic needs pure transition tests using alternate story data plus a browser test for its TV/phone contract. A manual party rehearsal still validates usability, accessibility, and timing before release.

Personal inventory tests now exercise both rulesets directly, including denied peer/parent reads, unauthorized writes, developer access revocation, concurrent assignment, and stale requests after reset. Migration tests preserve old items and reject conflicting data. The lab browser suite verifies separate authenticated inventory views and an atomic reset that leaves another game untouched. See [private inventory](PRIVATE_INVENTORY.md); memory privacy and server-authoritative puzzle wins remain follow-up work.
