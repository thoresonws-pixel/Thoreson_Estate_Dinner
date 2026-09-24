# Private inventory contract and rollout

Personal items are no longer children of the shared game record. Story packages still define the item sets and their contents; the platform assigns and stores them by authenticated player UID.

```
games/<gameId>/privateGeneration                     # reset generation, default 0
games/<gameId>/state/tv/inventory                    # shared discoveries (unchanged)
privateSessions/<gameId>/schemaVersion              # 1
privateSessions/<gameId>/generation                 # matches privateGeneration
privateSessions/<gameId>/assignments/<setId>/<uid>   # assigned item ID
privateSessions/<gameId>/players/<uid>/inventory/<itemId>
```

## Access and ownership

- A signed-in, non-anonymous player can read only their own private player record while they belong to the game. They cannot read its parent, another player, or the assignment map.
- The session host can read and write the game's private aggregate. Personal item allocation is a transaction on this aggregate, preserving earlier assignments and existing item state. Temporarily absent players retain their assignment; a newly joined player needs a remaining item in the story-defined set.
- A verified account with the server-managed `developerAccess/<uid>/inspectAllCharacters` capability can inspect all private inventories, but cannot assign or edit them unless it is also the host. Being a platform administrator or setting a profile role is not sufficient.
- Player Lab's selected player is a distinct emulator identity. It does not inherit the host's or developer's inventory permissions. Changing players detaches the previous subscription and clears its displayed inventory.

`private-inventory.js` owns permission-scoped subscriptions. `phone-actions.js` renders the result, including the explicit developer view, and uses the selected player's private items for the existing billiards eligibility check. There is no fallback to the retired public fields.

`player-item-sets.js` accepts any package's `playerItemSets`. Concurrent host requests allocate through a single transaction, with speculative local events disabled. The generation prevents an assignment requested before a lab reset from restoring the previous inventory afterward. The lab resets shared and private state atomically using a compare-and-set against its local database; unrelated games remain unchanged.

## Existing saves and deployment

This is a data migration, not just a UI change. New rules reject writes containing `games/<id>/players/<uid>/inventory` or `games/<id>/state/itemAssignments`. Installing those rules before migrating old data can prevent whole-game writes. Old clients must be closed during the maintenance window and refreshed after deployment.

For local Player Lab saves, startup migrates these fields before loading the emulator and retains a `before-private-inventory-*.json` backup in that checkout's ignored state directory. The old external lab directory is never modified. Automated tests always start fresh.

For a hosted environment, an authorized operator runs:

```
node scripts/migrate-private-inventory.cjs --project <project-id>
node scripts/migrate-private-inventory.cjs --project <project-id> --apply
node scripts/migrate-private-inventory.cjs --project <project-id> --check
```

The first command is a dry run. The tool resolves the database through the selected Firebase project, requires exactly one active instance, preserves personal items and assignment IDs, and rejects conflicting existing private data or unsupported versions. Applying saves a private backup under `.player-lab-work/migrations/`, then performs a conditional root write using the database ETag. Concurrent database changes reject the write; rerun the dry run and apply rather than forcing an overwrite. This is an offline maintenance tool, not an operation to run while parties are playing. Item contents are omitted from tool output and request/response body logs.

Both hosted deployment workflows run the read-only migration check and stop if legacy inventories remain. They never apply migrations automatically. Deploy rules and updated clients in the maintenance window after migration. This PR does not migrate or deploy either hosted project.

For rollback, prefer a forward fix. Restoring the previous client/rules requires coordinating the entire save format. A full backup restore is a deliberate database rollback that can discard later activity; do not upload one casually. Keep local backups out of Git, Hosting, CI artifacts and shared messages.

## Verified scope and remaining work

The suite exercises production and development rules with owner, peer, outsider, host and developer identities; denied parent reads and forged writes; developer revocation; legacy-field rejection including ancestor writes; concurrent allocation; migration preservation/conflicts; and reset generation. Browser checks retain the selected tab, isolate displayed inventories across actual logins, and preserve another game's data during reset.

This establishes the personal-inventory boundary. Shared game reads and non-progression writes remain broad, and character backstories/answers still exist in downloadable story packages. Memory payload privacy, membership enforcement and authoritative puzzle commands remain separate release gates. In particular, billiards eligibility remains a client-side rule and does not yet prevent a modified client from directly writing a puzzle win. Do not describe the whole game as cheat-proof or production-secure.
