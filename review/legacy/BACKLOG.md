# Thor's Murder Mysteries — Platform Backlog

## HIGH PRIORITY

1. **Cocktail hour side quests** — Icebreaker tasks, character scavenger hunt, relationship missions, gossip round. Players need to be in character BEFORE the murder happens.

2. **Time-gated revelations** — Add `minMinutes` field to each revelation in `revelations.js`. GM panel shows countdown "Available in 23 min" and greys the button until timer clears. Prevents the story resolving too fast regardless of player skill. Design targets for Thoreson: Act 2 floor at 45 min, wolfsbane at 90 min, Pinkerton at 100 min, confession at 110 min.

3. **Merge Game Health + Run Game into one GM monitoring view** — GM is watching cameras, not operating a control board. 90-95% automated. Single screen shows: live revelation status, player activity, story progress, and the rare manual intervention controls (hold/release a revelation, send a nudge). Replace two tabs with one.

4. **Formal accusation round** — Structured moment at end of Act 2 where a timed prompt fires on every player's phone: "Name your suspect and one reason." Forces the social dynamic. Killer gets a chance to deflect publicly. Currently players solve it like a puzzle instead of interrogating each other — this fixes that.

5. **Detective board on TV** — Cork board on the big screen. Clues auto-pin as polaroid cards when revelations fire. Red string connects related evidence. The room's shared brain — replaces manual note-taking.

6. **Cocktail hour character interaction tasks** — Specific missions during cocktail hour: find out X's secret, confirm Y's alibi, trade information with Z. Players arrive at Act 1 already suspicious of each other instead of still reading their backstories.

## FEATURES

7. **Photo captions** — Let players annotate photos when taking them. Show on slideshow and gallery. Was one of the funniest parts of game night and happened outside the app.

8. **Leaderboard 2.0**
   - First scanner bonus
   - Puzzle solver QR code inside safe/lockbox
   - Leaderboard rotates into TV slideshow or GM triggers it
   - Point categories: clues found, puzzles solved, first discoveries

9. **Pace clock on TV** — Visible countdown per act. Creates urgency and rhythm. GM controls it.

10. **Detective board on phones** — Redesign Discoveries page to match TV board aesthetic. Phone is secondary view, TV is primary.

11. **Native app** — React Native or Flutter. Push notifications, offline support, smoother QR scanning. Target for commercial launch.

12. **GM intercom/nudge system** — From the GM monitoring screen, send a message to a specific player or group: "Check the study" / "Talk to Miranda about Switzerland." Appears as a subtle notification. GM stays invisible but can unstick a group without breaking immersion.

13. **PWA upgrade** — Add to home screen, offline caching of character data, background sync. Bridges gap before native app.

## GAME DESIGN

14. **Rework memory delivery** — Players read memories verbatim from phones, kills immersion.
    - Bullet points not paragraphs — 2-3 key facts, force paraphrasing
    - "Share in your own words" instruction on every popup
    - Timed popups — visible 45-60 seconds then fades
    - GM announcement at start: "It's 1935, you don't have a phone"

15. **Rework confession delivery** — Three audio recordings was repetitive by Act 3.
    - Mix formats: Act 1 audio, Act 2 written letter, Act 3 Pinkerton report
    - Or: one full recording split into unlockable segments

16. **Pacing structure** — Tie acts to dinner service (cocktails → appetizers → main → dessert). Natural time anchors regardless of how fast players are solving.
    - Target: cocktails 60 min, Act 1 40 min, Act 2 35 min, Act 3 + confession 30 min
    - Gated acts — Act 2 QR codes don't work until GM opens Act 2

17. **More red herrings in Act 1** — Bradford patent letter was supposed to slow things down but got solved too fast. More parallel tracks = more time spent, more accusations.

18. **Skill backstory depth** — Currently one generic line per skill. Write 2-3 sentence versions for each skill × character combination where the character background makes the skill feel earned.

19. **Role overlay content** — killer/heir access stories currently written for miranda and walter only. Need raymond, charlotte, vivienne entries.

## PLATFORM

20. **SendGrid integration** — Wire ✉ Send Invite Email button to SendGrid API. Template already built in `buildInviteMessage()`.

21. **Twilio integration** — Wire 💬 Send Invite Text button to Twilio API.

22. **Firebase rules** — Add `/cancelledGames` and `/adminInvites` to Realtime Database rules. Currently blocking cancel game flow.

23. **Story architecture migration** — Move characters/skills/revelations to Firebase under `/stories/{storyId}/` rather than flat JS files. Load dynamically per game. Prerequisite for story #2 launch.

24. **Payment integration** — Stripe for ticket sales. Currently manual toggle per player in Guest List tab.

25. **Custom domain** — Register thorsmurdermysteries.com (or chosen brand name). Point at GitHub Pages free, migrate to Firebase Hosting when server-side code needed.

## STORIES

26. **The Devereaux Masquerade** — New Orleans, 1924. Write actual content (currently running Thoreson placeholder).

27. **Last Train to Wicker Park** — Chicago, 1947. "Our take on murder on the Orient Express." Write actual content.

28. **Thor's Asgard** — Asgard, age of the gods. Norse mythology murder mystery. Write actual content.

29. **Story #2 design principle** — Write from scratch with flexible role/skill assignment in mind. No character identity tied to a specific skill. Killer/heir overlays written for all eligible characters from day one.

## BUSINESS

30. **Brand name decision** — Thor's Murder Mysteries is the frontrunner. Register domain once decided.

31. **Kickstarter** — Strong fit. Working prototype, proof of concept, demo video of March 21 event. File trademark first. Consider launching with 2 stories live and a 3rd in development.

32. **Commercial launch plan** — Venue model, pricing ($50-100/ticket), staffing. Shark Tank pitch angle: platform licensing to other GMs = scalability story.

33. **Apple Sign-In** — Requires Apple Developer account ($99/yr). Worth adding before commercial launch for iOS users.

## KNOWN BUGS / FIXES

34. **Firebase rules** — `/cancelledGames` and `/adminInvites` paths return PERMISSION_DENIED. Update rules in Firebase Console.

35. **Legacy game storyId** — Existing games with `storyId: 'thoreson'` need updating to `'thoreson_estate_dinner'` in Firebase, or use the normalizer already in game.html.

36. **characters.js.bak** — Backup file committed to repo. Remove before commercial launch.

## PROP IDEAS
- **Period phone as PI delivery mechanism** — Replace the DJ/PI player role and text message delivery with a physical vintage rotary or candlestick phone mounted on the wall. When the GM hits the trigger on the dashboard, the phone rings mid-investigation. A player answers it and hears a pre-recorded Pinkerton agent delivering the act's clue hint and the code challenge prompt. This is dramatically superior to a text popup and removes the awkward information asymmetry of the PI role. Implementation: wireless doorbell module hidden inside the phone body, triggered by a Firebase flag; three short recorded "Hargrove, Pinkerton Agency" calls, one per act; `ringPhone` button on GM dashboard activates both the bell and the code challenge overlay on all player phones simultaneously. The PI character becomes the voice on the phone rather than a player at the table.

## WRITER FEEDBACK — Toy & Riddle System (from Scott's writer friend)

### Toys as Character Identity
- Each guest arrives to find a toy left for them by William Thoreson, specific to their character and history
- The toy IS their character introduction — they hold it, talk about it, use it to start conversations during cocktail hour
- Each toy encodes a theme: e.g. unbalanceable scales = justice vs revenge, hourglass = time running out on comfortable lies, music box missing a piece = incomplete truth
- Toys double as puzzle pieces — the group combines clues from multiple toys to unlock something (e.g. start the opening video/confession)
- Toys become a cipher system running through the whole game — riddles reference "the one who never stops spinning" or "what the old woman counts" rather than character names directly

### Two-Person Scan Gate
- QR codes display a riddle referencing toys/characters before unlocking
- Clue only unlocks when TWO specific characters scan the same QR code within a 10-second window
- Flow: scan → read riddle → find the right partner → first person scans + taps "Wait for Partner" → 10-second window opens → partner scans → clue unlocks
- Wrong person scans during window → timer resets, message: "This evidence requires a different witness"
- No scan within 10 seconds → resets completely
- Creates a visible theatrical moment — room watches the countdown, right person runs over
- Riddle language should be solvable if you met the right people at cocktail hour, harder if you didn't — rewards cocktail hour engagement

### Cellar Key Cold Open (rejected but noted)
- Bartender can't find cellar key, group works together to open the bar
- Scott rejected the drink-gating aspect but liked the shared group task idea
- Could repurpose: toys unlock the opening video instead of the bar

### Design work needed before building
- Full toy list: one per character, each mapped to theme + riddle role + potential skill
- Riddle writing: obscure enough to be satisfying, obvious enough to be solvable
- This ripples through props, QR codes, skill gating, and bigscreen detective board
