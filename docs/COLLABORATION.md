# Collaborating without overwriting each other

GitHub `main` is our accepted, shared development version. Each contributor has a separate clone and a branch for each task. Git does not reserve objects like Revit element borrowing: coordination, small changes, tests and review protect the combined result.

| Revit / ACC idea | Our workflow |
| --- | --- |
| Local model | Your own clone, with your own local test data |
| Central model | GitHub `main` |
| See central updates | `git fetch origin` updates remote references without editing your files |
| Bring central changes into your work | Merge `origin/main` into your task branch after saving your work |
| Save a checkpoint | Commit locally; push the branch to back up committed work on GitHub |
| Contribute to central | A reviewed pull request is squash-merged into `main` |

**Pushing a branch does not update main or deploy the game.** Merging into main publishes the integrated development site. Production remains a separate deliberate release. Uncommitted files are not backed up by pushing.

## Claim a task before editing

Use a GitHub issue and an early draft PR as the shared work board. Record the owner, intended outcome, likely files, shared interfaces, tests and any prerequisite PR. Check open issues and PRs for overlap first. One person owns a task branch; another person reviews it. AI assistants work under the same ownership rules.

Good parallel work might be one person changing a puzzle module while another edits story content. Both editing the dashboard, a package schema, Firebase rules or the same story JSON needs agreement first. Agree on IDs, data shapes and responsibilities in the issue; land a small shared contract change first when practical. Claims are coordination, not enforced file locks.

Use separate local clones on separate computers, preferably outside OneDrive or other folder-sync services. Never share a working directory. Simultaneous tasks on one computer need separate branches **and worktrees**, not two assistants switching one directory's branch. Give each lab a distinct `LAB_PORT_OFFSET`; see [testing](TESTING.md). Do not move an existing checkout or discard its local data as routine cleanup.

## Start a session

Read `AGENTS.md`, the task and its PR handoff. First inspect:

```sh
git status --short
git fetch origin
npm run sync:status
```

The status helper is read-only and uses the last fetched references. It does not fetch, pull, stash, reset or push. If fetch fails, remote information may be stale. It cannot see another person's unpushed work; check their task notes too.

For a **new independent task**, with a clean working tree:

```sh
git switch main
git pull --ff-only origin main
git switch -c feature/short-task-name
```

If local main has diverged, stop and inspect its commits; do not reset it to make this command succeed. For existing work, return to its branch rather than starting again from main.

## Save and incorporate changes

Review `git diff` and `git status`; stage only intended files. Commit useful checkpoints and push before ending a session, then update the draft PR with what works and what remains. Never stage secrets, local game data or unrelated work. A draft PR may be unfinished; say which checks have not passed.

Before syncing a task branch, commit your owned changes or leave them untouched and use another worktree. Do not automatically stash someone else's work. With a clean tree, fetch again and inspect `npm run sync:status`. If your published branch has incoming changes, review those commits and fast-forward with `git merge --ff-only @{upstream}` (quote `"@{upstream}"` in PowerShell). If it has diverged, coordinate with its owner and merge deliberately; do not overwrite the remote branch.

Then integrate accepted work while staying on your task branch:

```sh
git merge origin/main
```

Resolve conflicts by understanding both intended behaviors. Never choose “ours” or “theirs” for whole files just to silence conflicts. Ask the other owner when intent is unclear. `git merge --abort` cancels an in-progress merge; starting clean makes this safer. Avoid rebasing or force-pushing published branches: another contributor may already depend on those commits.

Test the combined result even when Git merges cleanly. Two individually correct edits can still disagree about an interface or game behavior.

## Review and integrate

Run `npm run test:all` for a ready PR, with focused manual Player Lab checks for affected TV/phone interactions. Shared engine changes also need meaningful alternate-story coverage. Review the final diff for unrelated edits, migrations, privacy and story independence. CI must pass and another human must approve; an AI review is useful preparation, not a substitute.

After squash merge, start new work from updated main. Do not continue using the old feature branch: its original commits differ from the squash commit. Confirm work was merged or backed up before deleting branches or worktrees. Keep local game snapshots outside Git.

### Dependent changes and the current foundation stack

Default to independent PRs into main. If a task genuinely needs an unmerged change, branch from that prerequisite and target its branch. Label the dependency and merge order in the PR. This is an exception, not the normal collaboration path.

The existing foundation work is stacked in PR order **#2 → #3 → #4 → #5 → #6**, followed by the collaboration workflow change. These are not all available on main until reviewed and merged. After a prerequisite is squash-merged, its dependent PR needs deliberate reconciliation and retargeting: compare the diff against main, preserve its unique commits, and rerun checks. Do not blindly change bases, rebase or force-push another person's branch. Avoid starting unrelated work on top of this stack.

## AI handoff requirements

Every assistant must inspect the current branch, status, diff and task context before editing. Never assume a clean directory or infer that unfamiliar files are garbage. No `reset --hard`, `clean`, forced checkout, force push, bulk conflict acceptance or deleting unowned work as a shortcut. If a conflict needs a design decision, preserve both versions and ask a specific question.

End each session with a draft PR update or handoff containing:

- Branch, base, owner and prerequisite PRs.
- What changed, including any shared contracts or state migrations.
- Tests run, results, and untested behaviors.
- Remaining work, overlap and the next safe step.
- Whether work is local only, pushed, merged, or deployed.

Keep handoffs in the issue/PR rather than a shared file everyone must edit. Update durable architecture and setup documentation when behavior changes. Edit source story packages and modules, not generated `dist` files. A new story must remain addable without rewriting the engine.
