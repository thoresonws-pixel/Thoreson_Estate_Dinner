# NON-NEGOTIABLE ARCHITECTURE RULE — APPLIES TO EVERY CHANGE

**THE GAME IS A REUSABLE SHELL. STORIES ARE PLUGGABLE CONTENT. We must be able to write a different story and its flow, install its story package, and play it using the same platform without rewriting the shared engine.**

This is an explicit user requirement, including prototypes and placeholders. It governs every change.

## Separate platform behavior from story content

- Shared platform: authentication, entitlements, invitations, player sessions, host/TV/phone interfaces, synchronization, timers, navigation, generic questionnaires, role-assignment mechanics, map rendering, inspection, puzzle execution, evidence boards, and media playback.
- Story package: title, setting, cast, character backstories, role definitions and eligibility configuration, room/map assets and hotspots, puzzles and answers, clues, dialogue, media, questionnaire content, act/scene sequence, durations, transitions, availability conditions, and presentation choices.
- Store story-owned material under `stories/<storyId>/` (or a documented package asset location). Resolve it from the session's story ID through a common loader/contract. Do not assume Thoreson is the only story.
- Shared code must not hardcode a story's character IDs, room list, map image, dialogue, act names, puzzle answers, timing, or sequence. Do not copy the engine or create another set of platform pages for each story.
- Model flows as story-defined steps using reusable platform capabilities, such as a title screen, dialogue screen, media playback, timed wait, questionnaire, exploration, or puzzle. A story selects and configures these steps; the engine executes them.
- There is no fixed number of acts. Each story defines its own acts/phases, labels, ordering, and transitions. Never assume exactly three acts or require universal act names.
- Cocktail hour is an optional story-defined phase for a party-style mystery, not a required platform phase or separate universal prerequisite. Other stories may begin with a briefing, arrival scene, immediate investigation, or another configured opening. The shared engine must work without cocktail hour.
- Placeholder content follows exactly the same boundary as finished content. For example, “Music here,” the countdown duration, and the next questionnaire step belong in the story flow. Replacing that placeholder with music must not require a new hardcoded screen flow.
- Keep shared session/progress state separate from story definitions; persist stable story/step/content identifiers. Shared deadlines and transitions must remain consistent across TV, host, phones, refreshes, and reconnects.
- When a story needs a new mechanic, add a reusable engine capability and expose it through the package contract. Avoid story-name checks and ad hoc branches in platform code.
- Validate required story data and show useful errors for invalid packages. Never silently substitute another story's content. Document the package contract as it evolves.

## Review gate for every change

Before considering work complete, ask: **Could another story use this feature by supplying its own package, assets, configuration, and flow, without editing platform code?** If not, revise the implementation.

Test story independence meaningfully when changing loaders or shared flow behavior, using a small alternate fixture story where appropriate. Tests must not assume a particular estate, character, room count, or act order is universal.

## Existing implementation

## Collaboration requirements

- Read CONTRIBUTING.md. Work on a scoped feature branch, not directly on main.
- Preserve uncommitted work. Do not reset, clean, force-push, or overwrite another contributor's changes.
- Coordinate overlapping modules and package contract changes through an issue or PR. Avoid unrelated formatting/refactors.
- Run `npm test` and relevant Player Lab checks. Add regression coverage for consequential multiplayer/state changes.
- Submit a PR; main requires CI and human review. Do not bypass protections for routine feature work.
- Main deploys to development only. Production changes require a deliberate release. Never copy local emulator identities, snapshots, or unsigned tokens to a hosted environment.
- Story content stays in packages. Extract affected legacy components incrementally rather than creating parallel engines.

Some existing code predates this rule and hardcodes Thoreson content, including the initial estate TV prototype. Do not describe that code as already compliant. When modifying an affected area, move its story-specific dependencies behind the package boundary as part of the change. Avoid unrelated wholesale rewrites; document remaining legacy coupling explicitly.
