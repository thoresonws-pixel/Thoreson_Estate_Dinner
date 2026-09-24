# Working together

Start with [the collaboration workflow](docs/COLLABORATION.md): it explains our “sync to central” routine, safe checkpoints, overlapping work, conflict recovery and AI handoffs. Both people and their assistants follow it.

Use Node.js 22 and Java 21 (Temurin recommended). Clone into a normal local folder, not a shared/synced folder used by another developer.

```
npm ci
npm run dev
```

Open http://127.0.0.1:5173. No Firebase login or production credentials are needed. `JAVA_HOME` or Java on PATH is supported on Windows, macOS and Linux; the existing portable Java installation is still supported. Stop with Ctrl+C. Ports 5173, 9000 and 9099 must be free. Local saved game data belongs to this checkout in `.player-lab-work/development-0`, ignored by Git. Automated tests use separate ports, a separate demo project, and disposable state. To run two checkouts at once, set `LAB_PORT_OFFSET=20` in the second terminal (PowerShell: `$env:LAB_PORT_OFFSET=20`). Its URL is port 5193 and its state is separate. See [testing](docs/TESTING.md).

## Each piece of work

Testing readiness, accepting a working feature, moving to another task and ending a session trigger a checkpoint automatically: validate, commit, push, update the PR and assess integration. Eligible human-approved PRs may be merged without another routine permission prompt; otherwise the AI must identify what is still needed. See [checkpoint and integration policy](docs/COLLABORATION.md#checkpoint-and-integration-policy). Never push directly to main or bypass review.

1. Inspect `git status --short`, fetch with `git fetch origin`, and run `npm run sync:status`. Check open work and agree on an issue/task owner and affected files or interfaces.
2. With a clean working tree, start independent work from updated main: `git switch main`, `git pull --ff-only origin main`, then `git switch -c feature/your-feature`. Preserve existing work; dependent PRs must declare their prerequisite and base.
3. Make a small, focused change. Run `npm run test:all`; use Player Lab for TV/phone behavior.
4. Commit scoped checkpoints and push your feature branch. Open a draft PR early for coordination; mark ready after validation. Pushing backs up committed work, but does not merge or deploy it.
5. The other developer reviews. CI must pass. Resolve conflicts by preserving both intended behaviors, then rerun checks. Never force-push main or accept an entire side of a conflict without understanding it.
6. Squash-merge approved work. Delete the feature branch. Pull main before starting again.

Main is the integrated development version. Merges deploy to the development site only. Production releases are manual and use the protected production environment. Do not put passwords, service-account keys, production data, or emulator snapshots in Git.

## Testing environments

Local Player Lab is the full multi-identity simulator. The online development site uses its own Firebase project and ordinary authenticated accounts. It must never load production credentials or connect to production data. Use separate development games for individual testing and explicitly agree when sharing a game; resetting one game must not reset everyone else's session.

## Reducing conflicts

Keep puzzle mechanics in their existing modules (`cooperative-maze.js`, `pool-shot.js`, etc.). Keep settings, answers, characters and dialogue inside story packages. Coordinate before editing the large legacy dashboard or shared experience file. Split the specific component you need as a focused PR; do not reformat or rewrite those entire files alongside a feature. Package-format changes must remain compatible or include a documented migration and alternate-story tests.

Use GitHub issues and PR comments to claim work and discuss shared interfaces. Neither AI should assume the other developer's unfinished changes are disposable.
