# Provisional clue placement

Provisional placements are implemented as evidence interactions in experience.json. Early evidence supports inspection and collection; middle/late evidence remains locked until its access steps are authored. Room assignments can be changed independently of the shared engine. Puzzle design and exact hiding spots remain unassigned.

## Reveal timing

The original revelations divide evidence into business secrets (old Act 1), the secret heir (old Act 2), and the killer (old Act 3). The new experience starts investigation in Act 2 after cocktail hour. Do not copy old act numbers directly into new unlock conditions. Proposed sequence: business evidence in current Act 2, heir evidence in a later phase (possibly Act 3), and decisive murder evidence in the final investigation phase (possibly Act 4). Final step IDs are not assigned.

| Clue | Provisional room | Reveal group |
| --- | --- | --- |
| Bradford patent letter | Toy workshop | Early: business secrets |
| Original company letterhead | Toy workshop | Early: business secrets |
| Newspaper clipping about Robert Hartley's death | Drawing room: inspect the corner desk | Early: business secrets |
| Original incorporation filing | Library | Early: business secrets |
| Company transfer document | Billiard room: concealed table drawer | Early: business secrets; requires the phone pool routine |
| Bank statement | Dining room | Early: business secrets |
| Financial ledger | Toy workshop: toy chest | Original Act II secret-heir clue; requires winding key from sealed study and completed toy sequence |
| Margaret's French letter | Music room | Middle: secret heir |
| Taylor Hartley's birth certificate | Library | Middle: secret heir |
| Margaret Hartley's obituary | Drawing room: drawer revealed by completing the clockwork maze | Middle-story evidence; currently accessible after the maze, with key gating to be decided |
| William's will | William's study | Middle or later: requires study access |
| Coroner's report | Entrance hall | Late: murder evidence; potentially delivered by Donnelly |
| Miranda's travel journal | Conservatory | Late: murder evidence |
| Pinkerton investigation report | Entrance hall | Late: murder evidence; potentially delivered by Donnelly |
| Recording device / William's confession | Music room | Staged: reveal only the appropriate recording portions |
| Office calendar | William's study | Unassigned until calendar contents are defined; requires study access |

## Dependencies and unresolved points

- Required gating rule: earlier phases must not expose later-phase evidence. A room assignment alone is insufficient; every middle/late clue needs an explicit access dependency before implementation.
- Gate evidence through either its location (such as the police-sealed study) or a required puzzle component available only in a gated location. A puzzle may be visible in an open room while its solution requires something in the study.
- Opening the study releases only its associated dependencies, not every remaining clue. Evidence intended for a still-later phase needs an additional gate.
- The room assignments above are provisional destinations. Early clues unlock at act2_investigation; other clues use unlockAtStep: null. Define and check each remaining dependency chain before enabling later discovery.
- The study is currently sealed. Nothing placed there can be required before it opens.
- The original confession has three increasingly revealing transcripts. Discovering the device must not automatically expose the full confession.
- The travel journal, coroner's report, and Pinkerton report collectively support the murder solution and should not all be accessible at the start.
- Some original clue text names a particular murderer/heir. These texts need reconciliation with generated roles before being connected to a playable mystery.
- The original birth certificate names William as father, while the secret-heir summary says the father is unknown. Reconcile this before implementing that reveal.
- Puzzles unlock access to clues; they are not themselves clues. The piano melody and its compartment are excluded from this table. No clue is assigned to that compartment yet.
- The three retired lockboxes and two keys are excluded.

Workshop prototype: study winding key -> shared inventory -> activate desk -> train, bird, yo-yo, soldier, horse, top -> reveal toy chest -> inspect and collect ledger. The prototype hint supplies the order; an authored study riddle and individual phone toy ownership are deferred.

Billiards prototype: select table on TV -> Play billiards on phones -> top-right, middle-left, bottom-right (no bank requirement) -> drawer opens -> inspect and collect transfer document. Scott has the memory; an Actions note supplies it if Scott is an NPC.
