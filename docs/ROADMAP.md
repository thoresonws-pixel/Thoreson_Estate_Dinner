# Current roadmap

This is the current priority list. Historical ideas are preserved in `review/legacy/BACKLOG.md`; they are not automatically approved work.

## Platform first

1. Separate private player payloads from shared game records; migrate readers/writers and prove denied access in emulator tests.
2. Apply explicit, idempotent command validation to puzzle actions, item collection and rewards. Cover duplicate, delayed and competing inputs.
3. Finish game membership/join boundaries, party-code ownership and photo-storage access.
4. Extract session, inventory, memory and navigation responsibilities from large legacy UI pages, keeping behavior covered by browser tests.
5. Pin story revisions and provide whole-session migrations. Run a complete unrelated fixture story through the same engine.
6. Test real phones, background/resume behavior, party pacing, accessibility and Firebase traffic before customer play.

Testing isolation, versioned story progression and trusted administrator grants are implemented in the foundation PRs. Their review/deployment status is tracked by those PRs, not inferred from this list.

## Story and game design

The Thoreson investigation, room art, dialogue, piano, billiards and cooperative maze are prototypes we can keep revising. The workshop's individual toy placement, banquet concept, clue placement and remaining rooms need further design/implementation. Pacing warnings wait for party playtests. New mechanics belong in the shared engine; names, solutions, rewards and timing belong in the story package.

## Collaboration

Use GitHub issues for active tasks and acceptance criteria; link the implementing PR. Keep one owner for an overlapping module at a time. For a package-contract change, agree on the data shape before separate implementations diverge. Update the change log when behavior or setup changes, and keep unresolved historical decisions in the review manifest rather than mixing them into current requirements.
