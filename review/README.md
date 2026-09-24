# Files awaiting review

Nothing in this folder is an active application source. These files were **preserved, not declared worthless**. They are excluded from Hosting, development builds and local application serving. Relative links inside old pages are historical and are not maintained here.

`manifest.json` records each original path, retained path, reason and SHA-256 checksum. The repository check verifies the retained bytes. Do not modify an archived original to modernize it; record decisions separately, then port useful content deliberately into the current source.

## Decisions for the owner

| Group | Why it is here | Decision needed |
| --- | --- | --- |
| Root/per-story JavaScript datasets and template examples | Current loaders use JSON packages; these are old copies | Retain as historical reference or remove after comparing story content |
| Backup/migration HTML pages | No active route references found; obsolete tools could be mistaken for current screens | Keep history or delete after confirming no manual use |
| Old backlog, technical notes, host script and assignment backup | Some details conflict with current design, but may contain valuable ideas | Which ideas/manuscripts should be carried forward? |
| Historical access-code reference | Retired login reference, not current account provisioning | Confirm whether any manual use remains; do not use it for current credentials |
| First entrance-hall artwork | Current experience uses version 2 | Keep as an art variant or discard |
| Old notification function source | Story-specific service, absent from current Firebase deployment configuration | Confirm its deployment history before deleting |

## Intentionally retained outside this folder

The scan/print/reference compatibility pages still have catalog bindings or caller references. Root media paths remain in current packages. Print props may be needed for physical materials. Coming-soon story packages are explicitly marked placeholders, not disposable duplicates. These remain in place to avoid breaking routes or throwing away authoring work.

To restore a candidate, use Git to move its retained path back to the original path after checking for a newer replacement. Remove or update its manifest entry in the same PR and rerun checks. Do not restore obsolete authentication or migration code to a hosted route without a security review.
