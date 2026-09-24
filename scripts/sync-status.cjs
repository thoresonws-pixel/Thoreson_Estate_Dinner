const { execFileSync } = require('node:child_process');

function inspect(cwd = process.cwd()) {
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const optional = (...args) => { try { return git(...args); } catch { return null; } };
  const compare = ref => {
    if (!optional('rev-parse', '--verify', ref)) return null;
    const [ahead, behind] = git('rev-list', '--left-right', '--count', `HEAD...${ref}`).split(/\s+/).map(Number);
    return { ref, ahead, behind };
  };
  git('rev-parse', '--show-toplevel');
  const upstream = optional('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}');
  return {
    branch: optional('symbolic-ref', '--short', 'HEAD'),
    dirty: Boolean(git('status', '--porcelain')),
    conflicts: Boolean(git('diff', '--name-only', '--diff-filter=U')),
    upstream: upstream ? compare(upstream) : null,
    main: compare('origin/main')
  };
}

function format(status) {
  const lines = ['Read-only snapshot; run git fetch origin first for current remote references.',
    `Branch: ${status.branch || 'DETACHED HEAD'}`,
    `Working tree: ${status.dirty ? 'uncommitted or untracked work (not backed up by pushing)' : 'clean'}`];
  if (!status.branch) lines.push('Create a named task branch before continuing.');
  if (status.branch === 'main') lines.push('Main is shared integration: create a task branch before editing.');
  if (status.conflicts) lines.push('Unresolved conflicts: preserve both intended behaviors before committing.');
  if (status.upstream) {
    const { ref, ahead, behind } = status.upstream;
    lines.push(`Tracking ${ref}: ${ahead} local-only commit(s), ${behind} incoming commit(s).`);
    if (ahead && behind) lines.push('Branch has diverged. Coordinate and merge; do not force-push.');
    else if (ahead) lines.push('Review and push your branch to back up these commits.');
    else if (behind) lines.push('Review incoming commits; fast-forward only after the working tree is clean.');
  } else lines.push('No upstream: this branch has no configured remote checkpoint. Review before publishing.');
  if (status.main) lines.push(`Against origin/main: ${status.main.ahead} branch-only commit(s), ${status.main.behind} main-only commit(s).`);
  else lines.push('origin/main is unavailable; fetch or check the repository remote configuration.');
  lines.push('For dependent PRs, also inspect the declared base. See docs/COLLABORATION.md.');
  return lines.join('\n');
}

if (require.main === module) {
  try { console.log(format(inspect())); }
  catch { console.error('Unable to inspect this checkout. Run inside an initialized Git repository with Git installed.'); process.exitCode = 1; }
}
module.exports = { inspect, format };
