# Story packages (v1)

The active opening engine loads `stories/<storyId>/package.json` through `StoryPackage.load()`. A session must supply its story ID. `stories/catalog.json` contains creation-page metadata and explicit historical aliases. Missing or invalid stories produce an error; they never fall back to Thoreson.

## Authoring

A package has `schemaVersion: 1`, a stable `id` matching its folder, and `metadata.name`. Put all story-owned content in that folder. The existing packages reference older media in root `assets/` and `audio/` as documented compatibility asset locations; new packages should keep their media in their own folder and provide site-relative URLs.

`content` contains `characters`, `skillBackstories`, `skills`, `revelations`, `items`, `roles`, `flow`, `facts`, `quests`, and `menu`. The retained legacy renderers consume those collections through `StoryPackage.legacy()`, an explicit global adapter that replaces absent collections as well as present ones. Theme properties are cleared before applying the next package.

`experience` defines the active TV/phone flow, or `experienceFile` points to a JSON filename within the package. Its format is:

- `version: 1`, optional `title`.
- `steps`: an ordered nonempty array of unique stable IDs. The first entry is the initial step; `next` names the next step, and an absent `next` ends the current authored flow.
- Supported `type` values: `title`, `questionnaire`, `placeholder`, `exploration`, `dialogue`. Other mechanics require an explicit reusable capability before being authored.
- Presentation: `label`, `text`, `phoneText`, `button`, `expiredText`.
- Optional positive `durationSeconds`: blocks advancing until the shared deadline. By default the host advances after expiry. A configured `autoAdvance: true` step is advanced by the connected host UI. An initial timed step is persisted by the TV host.
- `questionnaire`: `intro`, `savedText`, and `fields`. Each field has a unique `id`, `label`, optional `valueType: "number"`, and `options` of `{value,label}`. Answers are stored under that participant's questionnaire record. `completedAt` is reserved.
- Optional `map`: site-relative `image`, original `width`/`height`, and `rooms` of `[id,label,x,y,width,height]` in percentages. IDs must be unique and rectangles must remain within the map. Room names and board notes are session state, not changes to package content.

Runtime progress lives at `games/<gameId>/state/experience` as `{schemaVersion, revision, stepId, startedAt, pausedAt?}`; legacy records without version/revision remain readable. Firebase server timestamps and server clock offset keep clients aligned. Transactions protect against repeated/stale advancement, and listeners have scoped cleanup. The phone interface does not offer progression controls. Runtime checks are paired with host-only progression rules; other game actions still need further authorization work. See docs/ACCOUNT_AUTHORITY.md.

## Roles and preserved behavior

`RoleEngine.generate(roster, roles, policy)` accepts UID-keyed participants with `characterId` and `score`, returning role/skill assignments. Role definitions supply labels, eligible character IDs or `assignTo`, count (default one), minimum score, excluded skills, and score weights. Each participant receives at most one role and one skill. Order defines priority; exhausted pools leave roles unassigned. The host validates `compatibility.requiredRoles` before saving.

The two historical Thoreson assignment paths differed. Their policies are explicit under `compatibility.rolePolicies.host` and `.admin`, and regression tests preserve both: host prefers the configured minimum score then falls back, with a guaranteed eligible backup for skills; admin probability-filters role candidates and has no guaranteed skill backup. New packages can select `minimumScore: "strict"`. This refactor does not implement the later proposed 5/4 cutoffs, NPC murderer eligibility, or a new character count.

## Scanner, print, and historical addresses

`content.scans.skillPrefixes` preserves printed skill prefixes. The canonical format `STORY:<storyId>:<skillId>` also works. Item codes use `clue.html?story=<id>&item=<itemId>` or `scan.html?story=<id>&id=<itemId>`. `StoryContent.decodeScan` resolves codes against the current package and rejects other stories and unknown items/skills.

`content.scans.routes` maps an exact page basename and query ID to a reusable capability: `photo` (image, optional caption/counter), `page` (a key in presentation.pages), `skill`, or `item`. Historical Thoreson photo and side-quest addresses remain explicit mappings. New packages can author different IDs and content. Optional printSkills and printExtras configure supplemental printable codes; normal item cards derive from content.items. Both print routes render the same JSON data. The CLI now reports the print/reference URLs for an installed package; it no longer regenerates competing static item lists.

`StoryPackage.fromContext` selects the story from an explicit query, the player session/game, or a named historical route binding in catalog. The catalog's `legacyRoutes` is an intentional compatibility registry for old printed addresses without a story parameter. Unknown addresses do not load Thoreson. New codes carry their story ID (and game ID when available).

The historical clue discovery tracker retains its Firestore collection through `compatibility.foundItemsCollection`. New story-only tracking uses `stories/<id>/foundItems`; game-specific print links use `games/<gameId>/foundItems`. Existing Firestore/Realtime Database permissions have not been expanded. Browser tests mock these writes; deployment checks do not assert real-party write authorization.

## Preparation and legacy presentation

`content.preparation` supplies suggested drinks, selected menu IDs, welcome text, attire text and attire presets. Hosts can still override the saved packet and menu. `presentation.invitation` supplies invitation body HTML, host name, attire and optional display title. Authenticated welcome/menu sections are trusted authored HTML under `presentation.pages`, cleared between story loads. `presentation.screens` supplies optional named legacy TV screen bodies. This HTML must come from trusted installed packages; it is not a public user-content execution mechanism.

Legacy reference ordering, labels, historical login-code reference data, and optional exclusions live under `content.reference`. Legacy skill auto-triggers, text-message presentation and storage-key aliases are package configuration. Role choices and private overlays derive from role definitions; the manual admin override now reads and saves the same priority field used by its generator. New role labels need no engine edits.

## Social phases and optional challenges

Any `content.flow.phases` entry may be social. `onStart.distributeFacts` and `distributeQuests` enable distribution. `phase.social.questSet` selects the quest collection (defaults to phase ID); optional `facts` selects content.factSets, otherwise content.facts is used. Facts follow preferred/fallback recipients then a free participant. Quests honor requires and giveTo. Names resolve from the cast and participant gender choices. Storage-field aliases under `compatibility.social` preserve historical records; new stories default to socialFacts/socialQuests/socialQuiz/socialProfile.

`phase.social.screen` selects an initial legacy TV screen. `schedule` entries define afterSeconds and quiz/reveal actions, optional item/screen, and optional returnAfterSeconds/returnScreen. SocialEngine rebuilds timers from saved phase start time, disposes stale timers, checks that the phase is still current, and claims each scheduled event transactionally. These remain browser-driven controls: at least one host page must be open; no background server scheduler was added.

Optional `content.challenges[challengeId]` supplies prompt, accepted answers, and revealed IDs. The legacy challenge callbacks were absent before migration; a phase with no authored challenge now displays an explicit unavailable message instead of throwing. No Thoreson Act 2 challenge or answer has been invented. Legacy social quiz activation opens the existing assignments/question prompts. The newer experience opening and its own questionnaire are unchanged.

## Authoritative sources and boundary

Active loaders and renderers consume JSON packages through the adapters. Retired root and per-story JavaScript datasets, template examples, and backup pages are retained under `review/legacy/`; see `review/manifest.json` for original paths. They are not runtime authoring sources and are excluded from publishing. Do not copy the historical scripts back into a live story.
The three coming-soon catalog entries retain their existing copied content and are explicitly marked as such; they are not newly authored playable stories. No extra cast, NPC policy, payment flow, new act, backend scheduler or security model was added. The legacy platform still has different visual styles and database mechanisms, but story content and configured behavior for the migrated capabilities come from packages. Root media remains an explicit legacy asset location.

## Verification

The supported checks live in `tests/` and run with `npm run test:all`. See docs/TESTING.md for exact coverage and known gaps. Historical tests outside the repository are not required onboarding steps or evidence that current changes pass.

## Interior room artwork

An experience may define `map.roomViews` keyed by an existing map room ID. Each entry supplies a site-relative `image` path and descriptive `alt` text. Selecting that room displays the full interior artwork in the focus column; rooms without artwork retain the map crop. The overview and minimap always retain the map image. Assets belong to the story package. An illustration may include an NPC visually; this alone does not implement NPC dialogue, movement, or interaction.


## Room interactions

`experience.interactions` lists story-authored objects by `id`, `roomId`, `name`, `description`, and reusable `type`. The initial `noteSequence` capability supplies ordered `keys` (`id`, `label`, MIDI pitch `midi`, optional `black`), `solution` note IDs, optional `hint`, and `reward` (`id`, `name`, `text`). The host sees objects only in their room; playing the sequence persists `state/tv/puzzles/<interactionId>` and `state/tv/discoveries/<rewardId>` together. Discovery text is snapshotted at unlock and displayed when reopening. Existing host state permissions apply; these prototype client-side solutions are not a secure hidden-answer service. Audio uses synthesized tones, not sampled piano recordings. Story packages without interactions show an empty object panel.


## Room access interactions

`experience.map.access[roomId]` defines `tapeLabel`, `title`, `speaker`, `text`, and `unlockAtStep`. Null keeps the room sealed until the author chooses a release step. A valid step ID opens it from that step onward in the authored sequence. Restricted map clicks show a text interaction without changing the current room; a previously selected restricted room is not rendered or exposed in the object shelf. These are presentation/gameplay gates in the current host client, not a server-side secrecy mechanism. No story-specific room or act names are embedded in the engine.


## Character interaction presentation

`experience.speakers[speakerId]` defines a reusable speaker name, portrait asset, descriptive alt text, and background (`map` or a site-relative image). An access interaction references `speakerId` to use a sliding portrait and dialogue box over the dimmed halftone backdrop, contained within the focus column. Other notices remain text-only. Speaker artwork and presentation selection belong to the story; animation and rendering are shared. This is text dialogue, without recorded voice playback yet.


Speaking-character presentation is a shared platform convention: portraits enter from the bottom right, a speech bubble occupies the bottom of the focus region, and the backdrop is gently dimmed/blurred. Reduced-motion preferences disable the entrance animation. Story authors supply character art, words and the scene/background, not a separate dialogue layout for each character.


## Paced dialogue steps

A `dialogue` step references `speakerId` and `roomId`, supplies short `text`, `durationSeconds`, and `next`. Optional `autoAdvance` advances only after its shared deadline. A final timed bubble omits autoAdvance and waits for its authored button. This uses the same portrait entrance, bottom speech bubble, and softened backdrop as interactions; room artwork overrides the speaker default background. Consecutive lines retain the portrait. Pause/resume stores `pausedAt` and adjusts `startedAt` in the shared experience state, preserving progress across refreshes. Opening a map or board pauses the active speech; Resume continues it. Room entry is saved on dialogue entry. Audio is not yet implemented.

## Evidence versus puzzles (authoring rule)

A **clue** is evidence that helps players understand the story or solve the mystery: a document, recording, object, or its meaningful contents. Physical versus digital presentation does not determine whether something is a clue.

A **puzzle or riddle** is a challenge that gates discovery of a clue. A **container or hiding place** holds that clue; a **key or tool** enables access. Do not count puzzles, containers, keys, or tools in the story's clue inventory unless they independently contain story evidence.

Author the relationship explicitly: solve puzzle -> reveal accessible hiding place -> inspect it -> discover evidence. Puzzle completion and evidence discovery are distinct events. Shared mechanics execute these relationships; the story package supplies the puzzle, location, clue, and links.

For the current estate prototype, the piano melody is a puzzle and its compartment is a hiding place. Neither is itself story evidence. The evidence to place inside is not assigned yet. The existing piano completion reward is a prototype access notification, not a completed evidence-discovery implementation. Three old lockboxes and two keys have been removed from the active estate item inventory; historical source files are not the active inventory.

## Shared inventory and object-sequence prototype

`inventory` interactions collect `reward` into `state/tv/inventory/<reward.id>`, displayed in Group inventory on the detective board. This is shared host-controlled inventory; personal player inventory is not implemented yet.

`objectSequence` interactions define `objects: [{id,label}]`, a `solution` containing each object exactly once, optional `requiresInventory`, `missingItemText`, `activateLabel`, and a prototype `hint`. Activation and completion persist under `state/tv/puzzles/<interaction.id>`. Current input is on the TV; phone-owned object placement is deferred. Partial attempts reset when the object closes. A completed sequence unlocks access, not evidence automatically.

An interaction can require `requiresPuzzle: <interaction.id>` and set `hiddenUntilReady: true` to become discoverable only after puzzle completion. The story supplies dependencies; the shared engine contains no toy or room identifiers. Existing `unlockAtStep` gates still apply. These remain client gameplay gates, not server-side protection against inspecting package contents.

Host testing: `?puzzleTest=1` (or `&puzzleTest=1` on a game URL) exposes an explicitly labeled button on a mechanism missing its required inventory item. This grants that configured item to the current game's shared inventory and persists it. Ordinary game URLs do not expose the button. Use a test party; the flag does not undo items or completed puzzles on exit.

## Phone pool challenge

`poolShot` interactions expose an `actionLabel` on player phones while the TV selects the object (`state/tv/activeInteraction`) in its room during an exploration step. `shots` supplies each starting coordinate and required pocket; optional `cushions` constrains bank shots. Omit `cushions` for the current pocket-order puzzle. `maxStrikes` sets failures per attempt. Three prototype shots use one ball at a time. Local attempts reset on close or after an exhausted attempt; a completed challenge persists under the shared puzzle ID.

`memory: {characterId,title,text,fallbackTitle}` adds the routine to that character's Character tab. If that character has no player, an expandable note in Actions supplies the information. This avoids requiring a particular human-selected character. Text and answer order belong to the story package.

The phone computes trajectory and animates locally. Winning uses a game transaction that rechecks membership, active object, room, and exploration state before recording completion. The existing project rules are unchanged; this prototype is not hardened against a modified client reporting a false win. Another clue interaction with `requiresPuzzle` and `hiddenUntilReady` appears on the TV after completion. Collection remains separate from puzzle completion. No push-notification permission is required for these Actions updates.

## Unified collected-item inventory

All newly collected documents, recordings, evidence, keys, and tools now write to `state/tv/inventory/<reward.id>`. Story interactions use `type: inventory`, an `itemKind` such as `document`, `recording`, or `tool`, and `isEvidence: true` where relevant. Evidence is an item property, not a separate collection path.

`shared-inventory.js` supplies the common read model and expandable reader for TV Group inventory, the phone Inventory tab, and the phone Case File's Collected evidence section. It merges historical evidence from `state/tv/discoveries` without deleting saved data; canonical inventory entries take precedence. Legacy puzzle completion notices are excluded. Uncollected definitions do not appear. Personal items are read through a permission-scoped subscription at `privateSessions/<gameId>/players/<uid>/inventory`; group items remain in `state/tv/inventory`. See [private inventory](docs/PRIVATE_INVENTORY.md) for access rules and migration of older saves.

## Developer character access

`developerAccess/<auth.uid>/inspectAllCharacters: true` grants the authenticated developer a named, all-character viewer on the phone Character tab. Memories remain subject to the same progress triggers as their owning character. Provisioning is an administrator operation; client writes to this capability branch are denied, and reads require the matching verified Firebase user. Do not infer this capability from a writable player profile, game ownership, or a client email comparison.

`characterIds` optionally restricts a phone action to a set of story character IDs. The verified developer capability bypasses that character restriction for testing; game membership, current room/object, and story-phase requirements still apply. The actual signed-in user and selected player character do not change. Only currently implemented action types execute; individual toy ownership and its phone actions remain future work. Revoking the capability removes the developer UI and closes an action that is no longer available.


## Personal inventory and progress-triggered memories

Private memory text is now projected into a protected story dataset rather than delivered in the public package. The TV issues generation-bound grants when conditions are met; phones retrieve only authorized entries. See [memory and action boundaries](docs/MEMORY_AND_ACTIONS.md), including story publication requirements and current legacy-ID limitations.

The phone Inventory tab contains Personal items (the signed-in player’s inventory) and Group discoveries (shared inventory plus compatible historical evidence). Developer accounts can inspect other players’ existing personal inventories, labeled by character. Rendering this inventory does not issue toys or transfer ownership: future bequests must award items into the intended player inventory at the authored story moment.

Inspecting an available TV object records state/tv/inspected/<interactionId>. Interaction memories use whenInspected (defaulting to their own interaction ID) and remain readable after leaving the room. Existing character memories use unlockedBy against shared activeItems/revealedItems/memoryTriggers and collected-item identifiers. Developer access changes whose memories are visible, never whether their trigger has fired. game-memories.js selects available memories; realtime game updates notify the owner and developer observer. Existing memories load into the reader without replaying all popups; newly available interaction memories and other-character developer memories produce a named popup, queued while a phone minigame is running. Legacy own-character memory popups remain handled by the existing dashboard.

Phone action focus: inspecting a `poolShot` interaction publishes a fresh `state.tv.phoneActionRequest` (`id`, `interactionId`) alongside `activeInteraction`. Eligible phones navigate to Actions once per request; the consumed ID is remembered per game/account in session storage. This opens the action list, not the minigame. Normal state updates do not repeat navigation.

## Musical collections and nested discoveries

Interactions may specify parentInteraction pointing to a root object in the same room. Root room lists show only top-level objects; inspecting a parent reveals its children, while normal step/puzzle gates still apply. Parents must be inspected before children can be collected. Existing placements in other rooms still need authoring into this hierarchy.

Experience collections contain id, reward {id,name,text}, optional itemKind, pages [{id,title,text,requiresInventory}], and optional playInteraction pointing to a noteSequence. A collection appears in group inventory when any of its individual inventory sheets has been collected. Only collected pages are shown; the individual sheets remain saved independently. Collection definitions never grant inventory.

Note keys may define keyboard A–G; black keys use Shift plus that letter. Shortcuts are unique and scoped to an open instrument; typing in fields and held-key repeat are ignored. No rhythm requirement.

Inspecting a phone-enabled instrument publishes phoneActionRequest once; phones open Actions with the discovered booklet. A game transaction claims state.tv.songSelection {id,bookletId,pageId,interactionId,selectedBy}. A second claimant cannot replace an active selection. TV receives the selected page and instrument. Completing an attempt, Play different song, or returning from the instrument clears the selection; there is no automatic expiry. This follows the existing client-owned game state access model; it is not a hardened anti-cheat service.

The inspection interaction type displays descriptive content without collecting an item. It can be a root container with requiresPuzzle and lockedText; child inventory objects use parentInteraction and their own gates. Its reward metadata describes the opened interior, not an inventory grant.
## Inspectable locks and artwork

An `inspection` interaction may specify `requiresInventory`, `missingItemText`, and `wrongItemText`. It remains inspectable while locked and lists collected non-evidence inventory items for explicit attempts. Wrong items do not change state; the matching item persists `tv.puzzles[interactionId].activated = true`, without consuming the item or marking a puzzle solved. Its `reward.text` supplies the successful inspection description. Merely possessing an item never activates the mechanism.

Interactions may specify `image` (site-relative asset path) and `imageAlt` for static inspection artwork, including while locked. Placement, required item IDs, artwork and all story descriptions belong in the story package.

## Cooperative maze capability

An `inspection` interaction may include `maze`. It keeps the same inspectable key gate (`requiresInventory`), then becomes a host-started cooperative challenge. Include `cooperative-maze.js` on TV/player surfaces. `maze` defines `durationSeconds`, `shufflePauseSeconds`, `shuffleText`, `helpText`, and up to eight `mazes`. Each maze supplies a stable `id`, accessible `label` and `symbol`, six-digit hex `color`, rectangular `grid` (`#` wall, `.` passage), and `[x,y]` `start`/`goal`. Both endpoints must be passages with a reachable, distinct goal. All layouts and story wording remain in the story package.

The host chooses 2–16 real session participants (limited to twice the configured maze count). This prototype allows small groups for testing; it does not change the story's advertised player range. Half, rounded up, become guides; the rest become controllers. Guides retain their maze between the single timed role shuffle. Each move rotates unique controller assignments across unfinished mazes; an unassigned maze is visibly dimmed. Completed mazes stay complete. With an odd group, one guide remains a guide at the shuffle but receives a different maze.

State persists under `state.tv.puzzles[interactionId]`: activation, attempt ID, revision, participant/role assignments, token positions, shared deadline, shuffle timing and completion. Transactions reject stale attempt/revision input and non-controller moves. The TV shows progress rather than routes. Help is requested explicitly: coordination instructions, then the next three route directions for guides. Pause/resume is a host testing/accessibility control. Timeout permits retry without removing the key; no difficulty modes are introduced.

The midpoint shuffle preserves positions, grants a short reading pause and plays a small synthesized mechanical cue (recorded laughter is not yet supplied). Deadlines use the Firebase server time offset. Transition checks run while the TV challenge is open and on player moves; reopening catches up after a closed view. The phones render role-specific information, but existing broad RTDB game-read permissions still expose session data to authorized clients; this prototype does not claim server-enforced secrecy. Production permission hardening remains separate work.

Completion sets `solved` for normal `requiresPuzzle` discoveries. The drawing-room maze drawer contains Margaret Hartley’s obituary, collected separately after solving. The brass key remains in the unlocked workshop cabinet; later story gating is not yet configured. Overall party pacing warnings remain deferred to playtesting.

## Personal item sets and letter-to-pocket challenges

`playerItemSets` contains story-defined sets `{id, items:[{id,name,text,kind,isEvidence}]}`. An interaction's `personalItemSet` causes the host to assign one unused item to each actual session player when that object is inspected. The transaction persists assignments separately from inventory, preserves existing assignments and personal items, and rejects an undersized set. This is the current prototype delivery trigger; a later story step can call the same capability when the will is read. It does not assign items to absent NPCs or silently impersonate another player.

A `poolShot` may specify `letterPuzzle: {itemId, word, prompt, pockets}`. `pockets` maps the six pocket IDs to space-separated uppercase letters, covering A–Z exactly once. The reusable pool engine derives the shot order from `word`, while phones expose separate Play and Puzzle board views. All players may practice; a win transaction only unlocks the drawer when the authenticated player's personal inventory contains `itemId`. The board is deliberately available to everyone as requested; this mechanic encourages talking rather than enforcing two-device participation.

The estate prototype assigns sixteen distinct toys when the billiards table is first inspected. The Bird owner completes B–I–R–D: middle-right, top-left, bottom-left, top-right. Three strikes and the existing aiming controls remain. The old character-memory answer is removed from this interaction; the company transfer document remains a separately collected drawer item.

## Puzzle inventory, Case Board and requested guidance

Collected objects remain in a single persisted inventory. `isEvidence: true` includes an item on the Case Board. Puzzle Inventory shows non-evidence objects plus any evidence explicitly marked `isPuzzleItem: true`, allowing one collected item to serve both purposes. Neither view exposes undiscovered definitions; collection booklets still contain only acquired pages. Personal inventory remains separate.

`CaseBoard.render` supports rereading and selecting up to two collected documents for comparison. It does not generate theories, expose the solution, or classify suspects. TV observations continue to persist under `state.tv.notes`; phones read the same notes. `caseBoard: {inventoryOnly:true}` opts a story into this view and hides its older phone case-file panels without deleting old data. Existing legacy panels remain unchanged for stories that do not opt in.

An `inspection` with `view:'caseBoard'` provides an in-world entry to the shared board. The estate places it beside Officer Donnelly in the entrance hall; the TV's top-right shortcut opens Puzzle Inventory instead. Both dialogs stay inside the existing main focus region with the sidebar map visible.

Requested character guidance uses `speakerId`, an optional `actionLabel`, and ordered `guidance` rules. Each rule has `text` and optional `stepId`, `requiresInventory`, `missingInventory`, `requiresInspected`, `uninspected`, and `unsolvedPuzzle` conditions (all supplied conditions must match). The first matching rule is spoken through the existing portrait/dialogue presentation only after a deliberate button press. `reward.text` is the fallback conversation text. No inactivity nudges, pacing warnings, automatic hints or new puzzle unlocks are introduced.
