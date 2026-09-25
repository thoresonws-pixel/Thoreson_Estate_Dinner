# Memory delivery and validated action results

This pass establishes a private text delivery boundary and server checks for two existing phone actions. It uses the existing RTDB service and TV host; it introduces no paid backend service.

## Story content and builds

Authors continue editing self-contained story packages. `scripts/story-boundaries.cjs` projects two derived datasets:

- Public packages retain memory IDs and conditions, but omit text from character `memories`, gated `knowledge`/`canShare`, and interaction memories.
- `storyMemoryText/<storyId>/<entryId>` stores those texts behind database rules. `actionPolicies/<storyId>/<interactionId>` stores story-derived room, phase, required item, answer and sheet-selection constraints; clients cannot edit either dataset.

Both development and production builds use the projection. Production now serves `dist/production`, not the authoring repository. Player Lab projects the same packages and seeds the same protected datasets into its emulator. Directly serving the repository is no longer a supported test or release path.

This is **memory text privacy**, not complete spoiler removal. Ungated backstories, other character fields, public story assets and client puzzle configurations still require further classification. The GitHub repository contains authoring sources; repository collaborators can read them. There is no claim of confidentiality from someone with source access.

## Memory lifecycle

1. A phone establishes a persistent `characterClaims/<gameId>/<uid>` claim matching its selected character. Players cannot rewrite or delete that claim. They cannot change their claimed character by deleting/recreating their player record. A host may deliberately reassign both the claim and player record.
2. `MemoryAuthority` on the TV evaluates story-defined triggers. Only the host can issue `memoryGrants/<gameId>/<entryId>`, tagged with the current reset generation. New discovery and inspection records that can trigger memories are host-controlled.
3. The phone observes grants, fetches only eligible private text, and refreshes its reader. Rules independently require the matching story, active membership, character claim and current grant. Verified developer inspection can read other characters' **released** memories. The host can read the story's complete memory dataset to run the session.
4. Reset clears grants and claims and advances the generation. A delayed grant from the previous game state is rejected. No private text is copied into shared game state.

New grants require the TV/host to be connected. The TV re-evaluates current progress when it reconnects, so a missed event does not need to be replayed. Old clients should refresh together after release. Revocation prevents future reads; it cannot erase information someone already received.

## Action boundaries

**Billiards:** `GameActions.completePool` submits the actual completed pocket sequence to `actionReceipts/<gameId>/<interactionId>`. Rules enforce the authenticated player, required personal item, active room/object, allowed story step, unpaused state, reset generation, story revision and expected sequence. The receipt is created once per generation. Subsequent retries reuse it, including when the receipt saved but showing the shared result failed. A shared pool win must match the validated receipt. Offline saving fails visibly instead of intentionally queueing a completion.

This validates the submitted result, not physical mouse/touch movement or shot animation. A modified client can submit the correct answer if its player is eligible. Per-shot strikes, pool simulation and other puzzle reducers remain client-side. This is not an anti-cheat service.

**Piano:** rules validate the first song reservation against story-defined pages, discovered sheet inventory, the selected player, active room/object, phase, revision and generation. Other players cannot replace or clear it while it is reserved. The host releases it when an attempt ends or a different song is requested. This pass does not make note-by-note piano performance or every other puzzle authoritative.

## Publishing and compatibility

The projected database datasets must match the client release. During a maintenance window with old clients closed:

```
node scripts/publish-story-boundaries.cjs --project <project-id>
node scripts/publish-story-boundaries.cjs --project <project-id> --apply
node scripts/publish-story-boundaries.cjs --project <project-id> --check
npm run build:production
```

The first command is read-only. Applying replaces changed story sections without logging private text; it does not alter games or grants. Deployment workflows only check, never publish the datasets automatically. Complete the earlier private-inventory migration, publish reviewed definitions, then deploy rules and projected clients together. Changes here have not been applied to either hosted project.

Legacy pool wins remain displayed; only future non-host result writes need receipts. Legacy discovery mutation paths now reject new player-authored triggers. Old QR/scanner progress writers need migration to explicit host-approved commands before being used in the new flow. Rollback requires the matching rules, client build and story datasets; do not roll back only one component during a party.

Memory IDs currently derive from story/character/field/index for legacy entries. Do not reorder them in a running game. Stable authored entry IDs, story revision pinning and whole-session migration remain required before customer use.

## Verification and next work

Tests cover private text removal from builds, unrelated story conditions, host grant/owner/developer access, forged discoveries, claim replacement, pool proofs and duplicate receipts, stale reset generations, offline retries, and piano reservation ownership. Real browser tests exercise live private-memory delivery and pool result retries through the actual client adapter.

Remaining work includes private backstories and other story fields, membership/invitation enforcement, authoritative maze/workshop/piano-performance commands, per-action reconnect coverage, photo rules, versioned stories, and real-device playtests. Shared-game reads and parts of legacy state remain broad. These are explicit release gates, not completed features.
