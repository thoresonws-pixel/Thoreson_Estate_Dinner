# Change log

Record meaningful behavior, compatibility and operational changes here. Entries under Unreleased describe reviewed work in progress; they do not imply a production deployment. Add an actual release date/version only when a release is made.

## Unreleased

### Platform foundation

- Isolated automated browser tests from manual Player Lab sessions, including ports, Firebase demo projects and saved state. Added setup diagnostics and retained failure traces. PR #2.
- Added versioned story progression with stale-command rejection and pause/reconnect regression coverage. Existing saved states remain readable. PR #2.
- Replaced profile-based administrator authority with trusted grants; protected host story progression and added direct rules tests. Administrator provisioning is required before production release. PR #3.
- Separated personal inventories and item assignments from shared game data. Added scoped phone subscriptions, host-only assignment, explicit developer inspection, reset generations and a guarded save migration. Hosted deployments require migration checks; no migration runs automatically.

### Repository maintenance

- Moved retired story scripts, backup pages and historical documents to `review/legacy`, preserving original paths and SHA-256 checksums in the review manifest.
- Updated onboarding and current priorities; removed stale claims that external, untracked tests form the supported suite.
- Excluded the review area from publishing and local application serving. Included referenced legacy audio/photo/clue thumbnails in the development build.
- Moved the print-link CLI into `scripts/` and exposed `npm run print:links`.

## Collaboration baseline — 2026-09-24

- Added reproducible dependency installation, pull-request checks, protected-main collaboration and a separate Firebase development target. PR #1.
- Removed tracked dependency installs. Production deployment remains a separate manual workflow.

Earlier prototype changes were not maintained as formal releases. Git history and the preserved historical documents remain the record; this log does not invent release versions retrospectively.
