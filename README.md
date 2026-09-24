# Mystery game platform

A reusable TV-and-phone party game engine with self-contained story packages. Read [AGENTS.md](AGENTS.md) before changing the engine or story content.

## Run locally

Install Node.js 22 and Java 21, then:

```
npm ci
npm run dev
```

Open http://127.0.0.1:5173 for the TV, player switcher, all-player grid, reset and story controls. Each simulated player has a separate identity in local Firebase emulators. No cloud credentials are needed.

## Work together

Read [CONTRIBUTING.md](CONTRIBUTING.md). Make a feature branch, run checks, push and open a pull request. Main is the reviewed integration branch; do not push features directly to it.

- `npm test`: syntax, stories, puzzle/state and development-build checks.
- `npm run test:lab`: real browser/emulator identity and UI checks (install Playwright Chromium first).
- [Shared development site](https://thoreson-estate-dev.web.app): independent development data, team sign-in required.
- [Deployment and access operations](docs/DEVELOPMENT.md): add a teammate, operate environments and release.
- [Player Lab guide](dev-lab/README.md): simulation controls and local state.

Merges update development automatically. Production is a separate manual, owner-approved release. The shared development site does not yet provision photo storage or server functions; test those separately before a production release. Production database authorization remains an explicit hardening task; development is restricted to approved teammates.
