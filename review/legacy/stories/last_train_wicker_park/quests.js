// ============================================================
// THOR'S MURDER MYSTERIES — COCKTAIL HOUR QUESTS
// Story: The Thoreson Estate Dinner
// ============================================================
//
// Quests are social missions assigned to players at cocktail
// hour start. They get people talking, in character, and
// suspicious of each other before the murder even happens.
//
// QUEST TYPES:
//   "targeted"  — Directed at a specific character. Only fires
//                 if that character is in the game.
//   "generic"   — No character dependency. Always available.
//   "discovery" — Ask any guest something specific. Always available.
//
// ASSIGNMENT:
//   Each player receives 2-3 quests. The system:
//   1. Assigns one targeted quest if a match is available
//   2. Fills remaining slots with generic/discovery quests
//   3. Never assigns a quest back at the player themselves
//   4. Avoids duplicate quests across players where possible
//
// REWARD:
//   Completing a quest (player taps Complete) earns bonus scan
//   points and unlocks a flavor memory on their device.
//
// WRITING RULES:
//   - Written in second person
//   - In character — it's 1935, you are your character
//   - Short and actionable — one clear mission per quest
//   - Do not reveal plot. Seed suspicion, not answers.
//   - Use {{slug}} tokens for character names
//
// ============================================================

const questsDatabase = {

    cocktail: [

        // ── TARGETED — requires specific character in game ────────

        {
            id:       "find_pi",
            type:     "targeted",
            requires: ["david_richardson"],
            giveTo:   "any",
            exclude:  ["david_richardson"],
            text:     "Find {{david_richardson}} before the evening begins. Rumor has it there is a private investigator at the party tonight. Find out why.",
            complete: "You introduced yourself to {{david_richardson}}. Something about the way {{david_richardson}} looked at you suggested this would not be your last conversation tonight."
        },

        {
            id:       "find_journalist",
            type:     "targeted",
            requires: ["walter_lippman"],
            giveTo:   "any",
            exclude:  ["walter_lippman"],
            text:     "Introduce yourself to {{walter_lippman}} and find out what story brought a journalist to a private dinner party. William did not invite people without reason.",
            complete: "{{walter_lippman}} was cagey about the invitation. Said William had reached out personally. That is worth remembering."
        },

        {
            id:       "find_legal_manager",
            type:     "targeted",
            requires: ["miranda_longfellow"],
            giveTo:   "any",
            exclude:  ["miranda_longfellow"],
            text:     "Find {{miranda_longfellow}} — the person who manages all the Thoreson legal affairs. Ask what William has been working on lately. Legal managers always know more than they say.",
            complete: "{{miranda_longfellow}} said everything was routine. Said it with a perfectly straight face. You are not sure you believed it."
        },

        {
            id:       "find_banker",
            type:     "targeted",
            requires: ["charles_sterling"],
            giveTo:   "any",
            exclude:  ["charles_sterling"],
            text:     "Seek out {{charles_sterling}}. An old friend of William's with decades in Dallas banking. Ask what he knows about the company's recent financial troubles.",
            complete: "{{charles_sterling}} chose words carefully. Said the European situation was complicated. Said William had been under unusual pressure. Did not say more."
        },

        {
            id:       "find_cousin",
            type:     "targeted",
            requires: ["vivienne_ashford"],
            giveTo:   "any",
            exclude:  ["vivienne_ashford"],
            text:     "Find {{vivienne_ashford}} — just returned from years abroad. Ask what brought someone home after so long. People who leave and come back always have a reason.",
            complete: "{{vivienne_ashford}} said something about family obligation. Then changed the subject. The way {{vivienne_ashford}} looked at the house suggested more than that."
        },

        {
            id:       "find_investor",
            type:     "targeted",
            requires: ["marcus_brennan"],
            giveTo:   "any",
            exclude:  ["marcus_brennan"],
            text:     "Find {{marcus_brennan}} and ask about the investment in Thoreson Toys. The European deal collapse cost people real money. Find out how angry they actually are.",
            complete: "{{marcus_brennan}} said losing money was one thing. Said being lied to was another. Said tonight was supposed to be about answers."
        },

        {
            id:       "find_elder",
            type:     "targeted",
            requires: ["dorothy_wells"],
            giveTo:   "any",
            exclude:  ["dorothy_wells"],
            text:     "Introduce yourself to {{dorothy_wells}}. The most senior person in the room, with the longest memory in Dallas. Ask what {{dorothy_wells}} remembers about the early days of Thoreson Toys.",
            complete: "{{dorothy_wells}} smiled and said the early days were interesting ones. Said there had been another name involved, once. Did not say which."
        },

        {
            id:       "find_victoria",
            type:     "targeted",
            requires: ["victoria_ashworth"],
            giveTo:   "any",
            exclude:  ["victoria_ashworth"],
            text:     "Find {{victoria_ashworth}} and take the measure of the room's most analytical mind. Ask what {{victoria_ashworth}} makes of tonight's gathering. Investors notice things other people miss.",
            complete: "{{victoria_ashworth}} said William had been evasive for months. Said that was unusual for a man who prided himself on directness. Said something felt off about tonight before anything happened."
        },

        // ── GENERIC — no character dependency ─────────────────────

        {
            id:       "introduce_character",
            type:     "generic",
            requires: [],
            giveTo:   "any",
            text:     "Introduce yourself to three people you have not spoken to yet — in character. You are not yourself tonight. Tell them who you are, how you know William, and why you are here.",
            complete: "Three conversations. Three new faces. The evening is beginning to take shape."
        },

        {
            id:       "william_impression",
            type:     "generic",
            requires: [],
            giveTo:   "any",
            text:     "Ask two different guests what they think of William Thoreson. Not the official version — the honest one. People tell you things at parties they would not say anywhere else.",
            complete: "Two perspectives. Neither of them simple. William Thoreson was clearly not a simple man."
        },

        {
            id:       "announcement_rumor",
            type:     "generic",
            requires: [],
            giveTo:   "any",
            text:     "William told several people he had an important announcement tonight. Find someone who knows what it was. Start asking questions — carefully.",
            complete: "Nobody seems to know exactly what the announcement was. But everyone seems to have a theory."
        },

        {
            id:       "european_deal",
            type:     "generic",
            requires: [],
            giveTo:   "any",
            text:     "The European distribution deal collapse has been the talk of Dallas business circles for months. Find out who in this room was affected — and how angry they still are.",
            complete: "More people than you expected had skin in that deal. The money was one thing. The silence from William afterward was another."
        },

        // ── DISCOVERY — open-ended social missions ─────────────────

        {
            id:       "find_secret",
            type:     "discovery",
            requires: [],
            giveTo:   "any",
            text:     "By the end of cocktail hour, find out one thing about another guest that they probably did not intend to reveal. Every party has loose lips if you know how to listen.",
            complete: "You found something. File it away. Tonight is young."
        },

        {
            id:       "find_ally",
            type:     "discovery",
            requires: [],
            giveTo:   "any",
            text:     "Identify one person in this room you think you can trust. You may need allies before the night is over. Choose carefully.",
            complete: "You have a candidate. Whether that trust is earned remains to be seen."
        },

        {
            id:       "find_suspect",
            type:     "discovery",
            requires: [],
            giveTo:   "any",
            text:     "By the end of cocktail hour, identify one person in this room who makes you uneasy. You cannot explain it yet. Trust the instinct.",
            complete: "You have someone in mind. Whether you are right is a different question entirely."
        },

        {
            id:       "william_last_seen",
            type:     "discovery",
            requires: [],
            giveTo:   "any",
            text:     "Try to establish where William was in the last hour before dinner was to be served. Who spoke to him? Who saw him? When was he last seen alive?",
            complete: "A picture is beginning to form. Imperfect. But a beginning."
        }

    ]

};
