# Optional maze winding

Story maze configuration may include `winding`: `gearImage`, `turnsToRepair` (1–8), `cooldownSeconds`, `breakdownChance` (0–1), `graceSeconds`, and `warning` (`speakerName`, `portrait`, `text`). Asset paths are package PNG paths. Other stories can omit the mechanic. Existing saves require no migration; winding state is initialized on first use.

At most one maze spring is stopped at once. A successful submitted controller command can trigger a fault after the grace period. The next maze guide sees the repair callout; the affected guide sees only their gear. Disconnected movement silently drops but still rotates controls. Two-player rounds do not generate faults because there is no separate guide to relay them.

Whole turns are transacted at the puzzle path. Repair progress, cooldowns, and fault state survive reconnects. Partial turns survive pointer release within the mounted view; changing roles/reloading clears partial turns. A healthy full turn creates a warning for the acting guide and starts the same cooldown. No extra time or story-progress penalty is imposed. Pointer rotation and keyboard Right Arrow share the same turn callback. Reduced motion suppresses sparks and entrance animation.

These transitions use the existing client-authoritative maze contract; this is not an anti-cheat boundary. Optional story configuration does not broaden database rules. Audio for the warning is not implemented.

The Thoreson gear and William portrait were created with the built-in image-generation tool and copied into the story's assets. They are prototype artwork, independent of game logic. The warning portrait depicts an older 1930s toy inventor mock-scolding with a raised finger; the gear is a brass wheel with an off-center wooden handle.
