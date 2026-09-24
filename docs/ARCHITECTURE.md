# Platform foundation and component boundaries

The platform executes story packages. Stories define cast, rooms, dialogue, puzzle settings and answers, rewards, phase order and durations. Platform code must not branch on a particular story or character name. See AGENTS.md and STORY_PACKAGES.md for the mandatory contract.

## Current boundaries

| Responsibility | Owner | Contract |
| --- | --- | --- |
| Load and validate story definitions | `story-package.js` | Stable package/content identifiers; invalid packages fail visibly |
| Story progression | `story-runtime.js` | Pure state transitions; Firebase adapter owns subscriptions, clock offset and transactions |
| TV presentation | `estate-tv.js`, `flow-tv.js`, `room-interactions.js` | Render shared state; use configured rooms, steps and interactions |
| Phone presentation and actions | dashboard, `phone-actions.js` | Selected authenticated identity; UI visibility is not authorization |
| Personal inventory | `private-inventory.js`, `player-item-sets.js` | Permission-scoped reads; host transaction assigns story-defined items; see PRIVATE_INVENTORY.md |
| Puzzle behavior | mechanic modules such as `cooperative-maze.js`, `pool-shot.js` | Story-supplied configuration; no estate-specific answers in engine |
| Development simulation | `dev-lab/` | Actual emulator identities, local-only controls, no production connection |
| Verification and deployment | `tests/`, `scripts/`, `.github/workflows/` | Reproducible checks, reviewed branches, separate development and production |

The dashboard and some adapters still mix responsibilities. The table defines ownership for collaboration; it does not claim every legacy call already follows the desired separation.

## Story-state contract (implemented)

`games/<id>/state/experience` now writes `schemaVersion: 1`, an increasing `revision`, `stepId`, `startedAt`, and optional `pausedAt`. Legacy states without schema/revision remain readable and are upgraded on the next accepted runtime command. Unsupported versions and invalid saved steps/timestamps fail explicitly; the engine never silently substitutes a different story or resets progress.

`StoryRuntime.state.transition(flow, state, command, now)` is pure and returns a new state or `undefined` for a rejected/no-op command. Commands are `start`, `advance`, `pause`, and `resume`. Except idempotent initialization, each carries the snapshot it was based on. A transaction retry must still match that snapshot, including revision and timestamps. This prevents a delayed command from acting on a later visit to the same step. Lab reset/jump operations also increment the revision.

The Firebase adapter transacts only the experience subtree, uses server timestamps for new steps and server clock offset for deadlines, disables speculative local transaction events, refuses host commands while disconnected, and removes all listeners on disposal. Timer pause/resume survives reload. `view.connected` lets the TV disable progression while offline. This connection policy applies to story progression; other action adapters still need the same treatment.

Schema compatibility is additive: no bulk database migration is required for these fields. Older clients ignoring additive fields can still read saves, but all participants should refresh together when a new engine release is introduced. Full story-revision pinning and migrations for the entire session are not implemented yet.

## Next foundation gates before public/customer play

1. **Authorization and privacy:** server-managed administrator grants, host-only story progression and separately protected personal inventories are implemented and tested (see ACCOUNT_AUTHORITY.md and PRIVATE_INVENTORY.md). Production RTDB rules still allow signed-in users broad shared-game reads and non-progression writes. Enforce membership boundaries and move remaining private memory payloads out of shared records/packages. Update every legacy whole-game reader before tightening reads; rules cannot hide a child after granting a parent read. This is a release blocker, not a cosmetic task.
2. **All game commands:** migrate inventory, puzzle rewards, song reservation and individual actions to explicit shared command contracts. Each command needs identity, game, expected attempt/revision, input validation and idempotency. Avoid whole-game transactions where a smaller aggregate suffices. Client validation alone is not security. Choose an enforceable RTDB-rules design or trusted service before claiming server authority; do not introduce paid infrastructure silently.
3. **UI composition:** extract session access, subscriptions, inventory, memories and navigation from the legacy dashboard behind those contracts. Preserve actual rendered behavior through browser tests. Avoid a framework rewrite or large formatting-only edits alongside mechanic changes.
4. **Session compatibility:** pin story content revision, define migrations and rollback behavior, preserve stable IDs, and run a complete unrelated fixture story from setup through completion.
5. **Release evidence:** add command races, cross-game isolation, private-data denial, per-mechanic reconnection and real mobile-device checks. Measure Firebase traffic with realistic 6–16-player sessions before scaling recommendations.

These gates are intentionally explicit so a future developer can continue incrementally. Existing art, story packages, pure puzzle logic and TV/phone behavior remain useful; none of these changes requires throwing them away.

## Collaborating on these boundaries

Use one scoped branch per change and reviewed PRs. Claim shared module/interface changes in the PR description before another contributor starts there. Keep story edits separate from engine contract changes where practical. Each contract change includes fixtures, compatibility notes and regression tests. Main integrates reviewed work and deploys development; production remains an explicit release. No contributor should need production credentials to develop or run the automated suite.
