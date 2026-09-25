# Development and release operations

## Daily work

Read CONTRIBUTING.md. Use feature branches and pull requests. Main requires passing checks and resolved review conversations; peer approval is optional. Both developers can work independently; coordinate overlapping modules rather than making one large shared branch.

`npm ci` installs pinned dependencies. `npm run dev` runs Player Lab using Node 22 and Java 21. `npm test` validates JavaScript, all story packages, development build isolation and puzzle/state regressions. `npm run test:lab` starts a disposable, isolated Auth/Database emulator lab and runs the browser suite; first install its browser with `npx playwright install chromium`. On Linux use `npx playwright install --with-deps chromium`.

## Shared development

URL: https://thoreson-estate-dev.web.app

Firebase project: `thoreson-estate-dev`, separate Auth and Realtime Database. Billing has not been attached. Photo storage/functions are not provisioned here; the shared development site currently focuses on game state, TV, phones and puzzles. Full 16-account simulation remains local in Player Lab. Hosted users use real Google identities. No emulator tokens or production sessions are uploaded.

The owner can sign in with their verified Google account. Other developers sign in once (they see an access message), then the owner runs:

```
node scripts/dev-access.cjs collaborator@example.com
```

This requires the owner's Firebase CLI login. Remove access by appending `--remove`. Do not share that login or add collaborator credentials to Git. GitHub invitations and Firebase test-site membership are independent.

Create distinct sessions in the development landing page for individual work. To test together, the host explicitly shares/join-enables their session. The current underlying game rules are still prototype rules; do not add real customer data. The development allowlist is server-enforced and cannot be changed by browser clients.

## Deployments

Merging into main runs development checks and deploys the isolated development build. Builds replace Firebase initializers with the development config and exclude local tools. Configuration is under `config/`; content and puzzle definitions stay inside `stories/`.

Production uses the manually dispatched **Release production** workflow on main. The GitHub `production` environment requires approval by the owner and disallows administrative bypass. No production release is part of the collaboration setup.

Both workflows use Workload Identity Federation, bound to this repository's numeric ID, owner ID and main branch. Separate service accounts are limited to their target project, and trust the matching GitHub environment. No long-lived deployment secret is needed. `scripts/setup-deploy-identity.cjs` documents the provisioning, for owner use only.

Development database rules wrap existing rules with a team allowlist; `node scripts/dev-rules.cjs` regenerates them after reviewing base rule changes. Do not deploy base production rules to development by accident. Auth provider configuration lives in firebase.dev.json and is deployed separately by an owner, not by ordinary CI.

Hosting retains a small set of releases. Roll back through Firebase Hosting release history if necessary. Database schema migrations must be compatible or have an explicit migration/rollback plan; rolling back HTML does not roll back data.

## Incremental code organization

Keep new mechanics in standalone shared modules. The dashboard and experience file remain larger legacy integration points. Extract their affected sections in focused PRs when changing them; a wholesale rewrite during workflow setup would create unnecessary merge conflicts. New stories must remain self-contained packages.

## Administrator migration

Platform administrator grants are managed separately from developer-site membership and game hosting. Follow [account authority and rollout](ACCOUNT_AUTHORITY.md) before releasing the new rules. Production deployment checks that a trusted grant exists; profile `role` values and old invite links cannot provision one. Local Player Lab seeds only its host grant.
