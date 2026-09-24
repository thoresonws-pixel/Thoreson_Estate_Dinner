# Mystery game platform

A browser-based cooperative party game: a shared TV presents the world, and players use their phones to investigate and act. The engine is reusable; stories supply their own cast, rooms, dialogue, puzzles and progression through JSON packages.

**Status:** active development. The Thoreson story is the working prototype. Other catalog entries are placeholders. The platform is not yet ready for customer secrets or unrestricted public play; remaining security and compatibility work is tracked in the [roadmap](docs/ROADMAP.md).

## Start developing

Use Node.js 22 and Java 21. Clone into your own local directory, then:

```sh
npm ci
npx playwright install chromium
npm run doctor
npm run dev
```

On Linux, install browser dependencies with `npx playwright install --with-deps chromium`.

Open **http://127.0.0.1:5173** for the TV, character switcher, all-player grid, reset and story controls. Each phone panel has a distinct emulator identity. No Firebase login, cloud credentials or paid service is needed for local development. Physical phones cannot reach this loopback-only lab; use the team development site for that testing.

## Daily workflow

For the full human and AI “sync to central” routine, read [Collaboration](docs/COLLABORATION.md). After `git fetch origin`, `npm run sync:status` reports local work and incoming commits without changing files.

1. Claim a task and agree on shared interfaces before overlapping work.
2. Create a feature branch in your own checkout.
3. Run `npm run test:all`, inspect the TV/phone behavior, and open a pull request.
4. Have the other developer review it. Merge only after checks pass.

Main is the integration branch and deploys to the separate development site. Production is a deliberate, reviewed release. Current foundation PRs may be stacked: merge their prerequisites first and retarget dependent PRs to main. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Repository map

| Location | Purpose |
| --- | --- |
| Root HTML/CSS/JS | Shared application pages and engine modules; legacy UI extraction is ongoing |
| `stories/` | Story packages, artwork and authoring guide; edit JSON to change story content |
| `dev-lab/` | Local multi-player simulator and test controls |
| `tests/` | Pure logic checks, browser scenarios and direct database-permission tests |
| `scripts/`, `config/` | Build, diagnostics, operator tools and environment configuration |
| `docs/` | Architecture, testing, deployment and current priorities |
| `props/`, media folders | Retained print materials and compatibility assets; do not remove solely because they are old |
| `review/` | Preserved historical candidates awaiting an owner decision; never published |

## Useful commands

- `npm test` — syntax, packages, logic and build-boundary checks.
- `npm run test:lab` — disposable browser/emulator scenarios; does not borrow your manual game.
- `npm run test:all` — both test layers.
- `npm run doctor` — prerequisite and port diagnostics.
- `npm run print:links -- <storyId>` — current package's print/reference URLs.

## Project references

- [Architecture](docs/ARCHITECTURE.md) and [story package contract](STORY_PACKAGES.md)
- [Testing guide](docs/TESTING.md) and [Player Lab controls](dev-lab/README.md)
- [Development/release operations](docs/DEVELOPMENT.md) and [administrator rollout](docs/ACCOUNT_AUTHORITY.md)
- [Roadmap](docs/ROADMAP.md), [change log](CHANGELOG.md), and [preserved-file review](review/README.md)

Keep passwords, service-account keys, customer data and emulator snapshots out of Git. Administrator provisioning is separate from GitHub collaboration and from game hosting. Existing assets and third-party material retain their own rights; this repository does not introduce a new license grant.
