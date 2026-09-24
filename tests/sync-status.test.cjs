const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { inspect, format } = require('../scripts/sync-status.cjs');

test('sync status distinguishes local work, remote divergence and detached HEAD without mutation', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'estate-sync-test-'));
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  try {
    git('init', '-b', 'main');
    git('config', 'user.name', 'Workflow test');
    git('config', 'user.email', 'workflow@example.invalid');
    git('config', 'commit.gpgsign', 'false');
    git('commit', '--allow-empty', '-m', 'base');
    const base = git('rev-parse', 'HEAD');
    assert.equal(inspect(root).main, null);
    git('update-ref', 'refs/remotes/origin/main', base);
    git('switch', '-c', 'feature/test');
    git('remote', 'add', 'origin', 'https://example.invalid/test.git');
    git('update-ref', 'refs/remotes/origin/feature/test', base);
    git('branch', '--set-upstream-to=origin/feature/test');
    git('commit', '--allow-empty', '-m', 'local checkpoint');
    let state = inspect(root);
    assert.deepEqual(state.upstream, { ref: 'origin/feature/test', ahead: 1, behind: 0 });
    assert.match(format(state), /back up these commits/);
    const local = git('rev-parse', 'HEAD');
    git('switch', '--detach', base);
    git('commit', '--allow-empty', '-m', 'remote checkpoint');
    git('update-ref', 'refs/remotes/origin/feature/test', git('rev-parse', 'HEAD'));
    assert.match(format(inspect(root)), /DETACHED HEAD/);
    git('switch', 'feature/test');
    fs.writeFileSync(path.join(root, 'unfinished.txt'), 'Do not discard');
    const before = git('status', '--porcelain');
    state = inspect(root);
    assert.equal(state.dirty, true);
    assert.deepEqual(state.upstream, { ref: 'origin/feature/test', ahead: 1, behind: 1 });
    assert.match(format(state), /do not force-push/);
    assert.equal(git('status', '--porcelain'), before);
    assert.equal(git('rev-parse', 'HEAD'), local);
    assert.equal(fs.readFileSync(path.join(root, 'unfinished.txt'), 'utf8'), 'Do not discard');
    git('update-ref', 'refs/remotes/origin/feature/test', local);
    assert.equal(inspect(root).upstream.ahead, 0);
  } finally {
    // Only remove the unique directory created by this test beneath the OS temp directory.
    assert.equal(path.dirname(root), path.resolve(os.tmpdir()));
    assert.ok(path.basename(root).startsWith('estate-sync-test-'));
    fs.rmSync(root, { recursive: true, force: true });
  }
});
