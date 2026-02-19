# Thoreson Estate — Technical Reference

## Hosting & Repository

| Item | Value |
|------|-------|
| GitHub Repo | `thoresonws-pixel/Thoreson_Estate_Dinner` |
| Live Site | `https://thoresonws-pixel.github.io/Thoreson_Estate_Dinner/` |
| Deploy | Push to `main` → GitHub Pages auto-deploys |

## Firebase Realtime Database

| Item | Value |
|------|-------|
| Project | `thoreson-estate` |
| Database URL | `https://thoreson-estate-default-rtdb.firebaseio.com` |
| API Key | `AIzaSyApHrYubqWrR4m0ihdpq6Ym40jv4HTQ5i0` |
| Auth Domain | `thoreson-estate.firebaseapp.com` |
| Messaging Sender | `182924616892` |
| App ID | `1:182924616892:web:8153e1c69895cee665dcb9` |
| Measurement ID | `G-MXHFH3FL00` |

**Database paths:**
- `activeItems` — array of revelation IDs currently visible to guests (e.g. `["willsDeath", "ledger"]`)
- `discoveredSkills` — array of discovered skill keys (e.g. `["accountingDiscovered", "legalDiscovered"]`)

## Google Form (RSVP)

```
https://docs.google.com/forms/d/e/1FAIpQLSezQ99Orc5dvvlxnPLi3Jw_dkn8kNPwVu0GnxbRd0nTM61-Xg/formResponse
```

Entry IDs: `242898703` (name), `986368937` (attending), `409646` (phone), `775321918` (email), `196909869` (role), `404572778` (notes)

## CDN Libraries

- Firebase 10.7.0 (app-compat + database-compat)
- html5-qrcode 2.3.8 (in-dashboard QR scanner)
- Google Fonts: Playfair Display, Cormorant Garamond

---

## File Structure

### Core Pages

| File | Purpose |
|------|---------|
| `index.html` | Public landing page (invitation, RSVP form) |
| `login.html` | Authentication — name + 5-digit code |
| `authenticated-dashboard.html` | Main app — all game functionality |

### Data Files (single source of truth)

| File | Exports | Purpose |
|------|---------|---------|
| `characters.js` | `characterDatabase` | Character backstories, skills, knowledge, goals, relationships, howToPlay |
| `skills.js` | `skillsDatabase` | Expert analysis content for each skill (what QR scans reveal) |
| `revelations.js` | `revelationsDatabase` | Story beats and evidence items organized by act |

### Legacy / Auxiliary

| File | Status |
|------|--------|
| `character.html` | Old standalone character page (pre-dashboard) |
| `guests.html` | Old standalone guest list (pre-dashboard) |
| `characters/index.html` | Old character display page |
| `characters/data.js` | Old character data (superseded by `characters.js`) |
| `clues/index.html` | Redirect message — tells users to use dashboard scanner |
| `clues/accounting1.html` etc. | Old standalone QR pages (6 files, now unused) |
| `manifest.json` | PWA manifest |
| `service-worker.js` | Service worker (disabled) |
| `ACCESS_CODES.md` | Login codes reference |
| `UPDATES_SUMMARY.md` | Version history |

---

## Authentication

**Login flow:** `login.html` → enter name + code → stores `userSession` in `localStorage` → redirects to `authenticated-dashboard.html`

**Session stored in `localStorage`:**
```json
{
  "username": "Scott",
  "role": "master",
  "loginTime": "2026-02-19T...",
  "activeItems": [],
  "discoveredSkills": []
}
```

- `username` and `role` set at login
- `activeItems` and `discoveredSkills` arrays initialized by dashboard, synced from Firebase
- **Skills are NOT stored in session** — read live from `characterDatabase[username].skills`

**Roles:** `master` (Scott only — sees Master Controls) and `guest` (everyone else)

## Login Codes

| Name | Code | Role |
|------|------|------|
| Scott | 61493 | master |
| BrianT | 42851 | guest |
| Clara | 56374 | guest |
| Leanna | 31429 | guest |
| Marc | 68915 | guest |
| Maisy | 25837 | guest |
| Hannah | 84126 | guest |
| DJ | 91564 | guest |
| Peter | 17382 | guest |
| Arash | 73649 | guest |
| Becky | 45928 | guest |
| BrianS | 52847 | guest |
| Katie | 29175 | guest |
| Michelle | 63841 | guest |
| Jeff | 34759 | guest |
| Casey | 85214 | guest |
| Krystal | 72938 | guest |
| Lindsey | 41876 | guest |
| Bradey | 96523 | guest |
| Alexander | 51783 | guest |
| Jesse | 28764 | guest |
| TestUser | 99999 | guest |
| TestUser2 | 88888 | guest |

---

## Dashboard Sections

The dashboard is a single-page app. Nav links show/hide `<section>` elements.

| Section ID | Nav Label | Visible To | Content |
|------------|-----------|------------|---------|
| `character` | Character | All | Backstory, knowledge, goals, relationships from `characterDatabase` |
| `guests` | Guests | All | Public character descriptions |
| `discoveries` | Discoveries | All | Active revelations + discovered skill summaries |
| `masterclues` | Master Controls | Scott only | Toggle buttons for all revelations and skill discoveries |
| `invitation` | — | Pre-login only | Landing/RSVP (hidden after auth) |
| `cocktails` | — | Hidden | Cocktail menu |

**Scan button** appears in nav for characters who have skills (excluding Bartender-only).

---

## Data Flow: How Discoveries Work

### Revelations (story items)
1. Scott toggles an item in **Master Controls** (e.g. "Will's Death")
2. Item ID added to `userSession.activeItems` → written to Firebase `activeItems`
3. Firebase `on('value')` listener fires on all connected devices
4. Each device updates local `userSession.activeItems` and re-renders Discoveries page
5. All guests see the revelation's title + summary

### Skill Discoveries (two paths)

**Path A — QR Scanner (guest-initiated):**
1. Guest with skills taps **Scan** in nav → camera opens via `html5-qrcode`
2. Scans QR code containing plain text `THORESON:Accounting`
3. Dashboard parses skill name, checks `characterDatabase[username].skills`
4. **Has skill:** Shows expert content in modal + writes `accountingDiscovered` to Firebase `discoveredSkills`
5. **No skill:** Shows denial message ("requires accounting expertise")
6. Firebase listener updates all devices

**Path B — Master Controls (Scott-initiated):**
1. Scott toggles a skill in Master Controls
2. `accountingDiscovered` added to Firebase `discoveredSkills`
3. Same listener/update flow as above

**Display logic:** Guest sees a skill summary on Discoveries page only when BOTH conditions are true:
- `characterDatabase[username].skills` includes the skill name (e.g. "Accounting")
- `discoveredSkills` array includes the discovery key (e.g. "accountingDiscovered")

### QR Code Format

QR codes encode **plain text**, not URLs:
```
THORESON:Accounting
THORESON:Botany
THORESON:French
THORESON:Investigation
THORESON:Legal
THORESON:Medical
```

Camera apps see meaningless text. Only the in-dashboard scanner processes them.

---

## Real-Time Sync

### Firebase Listeners
Dashboard sets up `on('value')` listeners on both `activeItems` and `discoveredSkills`. Any write from any device triggers all connected devices to update.

### BroadcastChannel
`BroadcastChannel('thoreson-estate-sync')` syncs tabs on the same browser/device:
- `{ type: 'itemUpdate', activeItems: [...] }` — revelation toggle
- `{ type: 'skillUpdate', discoveredSkills: [...] }` — skill discovery

### Sync Flow
```
Scott toggles item → localStorage + Firebase.set() + BroadcastChannel
                      ↓                    ↓
                  Same device tabs     Firebase listener on all devices
                      ↓                    ↓
                  loadDiscoveriesData()   loadDiscoveriesData()
```

---

## Key Functions (authenticated-dashboard.html)

| Function | Purpose |
|----------|---------|
| `getMySkills()` | Reads `characterDatabase[username].skills` — live from characters.js |
| `loadCharacterData()` | Renders character section from `characterDatabase` |
| `loadDiscoveriesData()` | Renders discoveries: active revelations + discovered skills |
| `loadMasterClues()` | Renders Master Controls toggle buttons |
| `toggleItem(itemId)` | Toggle revelation → localStorage + Firebase + broadcast |
| `toggleSkill(skillName)` | Toggle skill discovery → localStorage + Firebase + broadcast |
| `syncToFirebase()` | Writes `activeItems` and `discoveredSkills` to Firebase |
| `loadFirebaseData()` | One-time pull of both arrays from Firebase |
| `listenForFirebaseUpdates()` | Sets up `on('value')` listeners |
| `openScanner()` | Opens camera modal via html5-qrcode |
| `closeScanner()` | Stops camera and hides modal |
| `onScanSuccess(text)` | Parses `THORESON:X`, checks skill, shows modal, writes Firebase |
| `showSkillContent(name, data)` | Renders expert analysis in modal |
| `showSkillDenied(title, msg)` | Renders denial message in modal |
| `markSkillDiscovered(name)` | Writes discovery key to Firebase `discoveredSkills` |

---

## Skills

Each skill in `skillsDatabase` has:

| Field | Purpose |
|-------|---------|
| `title` | Display name |
| `password` | QR page password (legacy — currently "open") |
| `lockedTitle` | Pre-unlock heading (legacy) |
| `lockedSubtitle` | Pre-unlock hint (legacy) |
| `errorMsg` | Wrong password text (legacy) |
| `badge` | Skill badge label shown in modal |
| `header` | Expert content heading |
| `summary` | Short text for Discoveries page (all skill-holders see after discovery) |
| `expert` | Full HTML — detailed analysis shown in scanner modal (read aloud by expert) |

Skills: **Accounting**, **Botany**, **French**, **Investigation**, **Legal**, **Medical**, **Bartender**

Bartender is special — always visible on Discoveries page (no discovery flag needed), contains cocktail recipes.

---

## Revelations

Organized by act in `revelationsDatabase`:

| Act | Items |
|-----|-------|
| `act1` | willsDeath, ledger, forgedDocs, stolenCompany |
| `act2` | affair, secretHeir, margaretsLetter |
| `act3` | poisoning, mirandaIdentity, finalConfession |

Each item has: `id`, `type` (story/revelation), `title`, `summary`

---

## Version History (abbreviated)

| Version | Key Change |
|---------|------------|
| v17 | Firebase integration, real-time sync |
| v18 | Rich QR expert page content |
| v19 | Full character profiles with backstory/knowledge/goals |
| v20 | Split data into characters.js, skills.js, revelations.js |
| v21 | discoveredSkills naming, skills read from characters.js, dead code cleanup |
| v22 | In-dashboard QR scanner, plain-text QR codes, skill-gated modal |
