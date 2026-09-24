// ============================================================
// THOR'S MURDER MYSTERIES — COCKTAIL HOUR QUESTS
// Story: The Thoreson Estate Dinner
// ============================================================
//
// Each player gets exactly 3 targeted quests.
// Each character is targeted by exactly 3 other players.
// The web is perfectly balanced — everyone asks 3, gets asked 3.
//
// Quest design:
//   - One specific person to find
//   - One vague icebreaker question — opens a conversation
//   - The conversation is the point, not the answer
//   - Written in second person, present tense, 1935
//
// Assignment map (asker → targets):
//   miranda        → scott, patricia, raymond
//   scott          → walter, dorothy, charles
//   walter         → david, vivienne, marcus
//   david          → patricia, raymond, victoria
//   patricia       → dorothy, charles, elizabeth
//   dorothy        → vivienne, marcus, miranda
//   vivienne       → raymond, victoria, scott
//   raymond        → charles, elizabeth, walter
//   charles        → marcus, miranda, david
//   marcus         → victoria, scott, patricia
//   victoria       → elizabeth, walter, dorothy
//   elizabeth      → miranda, david, vivienne
//
// ============================================================

const questsDatabase = {

    cocktail: [

        // ── MIRANDA asks SCOTT, PATRICIA, RAYMOND ────────────────
        {
            id:       "miranda_asks_scott",
            type:     "targeted",
            requires: ["scott_thoreson"],
            giveTo:   ["miranda_longfellow"],
            exclude:  [],
            text:     "Find {{scott_thoreson}} and ask how he ended up in law.",
            complete: "You had the conversation."
        },
        {
            id:       "miranda_asks_patricia",
            type:     "targeted",
            requires: ["patricia_chamberlain"],
            giveTo:   ["miranda_longfellow"],
            exclude:  [],
            text:     "Find {{patricia_chamberlain}} and ask how long they have known the Thoreson family.",
            complete: "You had the conversation."
        },
        {
            id:       "miranda_asks_raymond",
            type:     "targeted",
            requires: ["raymond_hammond"],
            giveTo:   ["miranda_longfellow"],
            exclude:  [],
            text:     "Find {{raymond_hammond}} and ask what brought them to Thoreson Toys.",
            complete: "You had the conversation."
        },

        // ── SCOTT asks WALTER, DOROTHY, CHARLES ──────────────────
        {
            id:       "scott_asks_walter",
            type:     "targeted",
            requires: ["walter_lippman"],
            giveTo:   ["scott_thoreson"],
            exclude:  [],
            text:     "Find {{walter_lippman}} and ask what kind of stories they usually cover.",
            complete: "You had the conversation."
        },
        {
            id:       "scott_asks_dorothy",
            type:     "targeted",
            requires: ["dorothy_wells"],
            giveTo:   ["scott_thoreson"],
            exclude:  [],
            text:     "Find {{dorothy_wells}} and ask how they first came to know your father.",
            complete: "You had the conversation."
        },
        {
            id:       "scott_asks_charles",
            type:     "targeted",
            requires: ["charles_sterling"],
            giveTo:   ["scott_thoreson"],
            exclude:  [],
            text:     "Find {{charles_sterling}} and ask what they did before they retired.",
            complete: "You had the conversation."
        },

        // ── WALTER asks DAVID, VIVIENNE, MARCUS ──────────────────
        {
            id:       "walter_asks_david",
            type:     "targeted",
            requires: ["david_richardson"],
            giveTo:   ["walter_lippman"],
            exclude:  [],
            text:     "Find {{david_richardson}} and ask what they do for a living.",
            complete: "You had the conversation."
        },
        {
            id:       "walter_asks_vivienne",
            type:     "targeted",
            requires: ["vivienne_ashford"],
            giveTo:   ["walter_lippman"],
            exclude:  [],
            text:     "Find {{vivienne_ashford}} and ask where they have been living.",
            complete: "You had the conversation."
        },
        {
            id:       "walter_asks_marcus",
            type:     "targeted",
            requires: ["marcus_brennan"],
            giveTo:   ["walter_lippman"],
            exclude:  [],
            text:     "Find {{marcus_brennan}} and ask how they got involved with Thoreson Toys.",
            complete: "You had the conversation."
        },

        // ── DAVID asks PATRICIA, RAYMOND, VICTORIA ───────────────
        {
            id:       "david_asks_patricia",
            type:     "targeted",
            requires: ["patricia_chamberlain"],
            giveTo:   ["david_richardson"],
            exclude:  [],
            text:     "Find {{patricia_chamberlain}} and ask what brought them to Dallas originally.",
            complete: "You had the conversation."
        },
        {
            id:       "david_asks_raymond",
            type:     "targeted",
            requires: ["raymond_hammond"],
            giveTo:   ["david_richardson"],
            exclude:  [],
            text:     "Find {{raymond_hammond}} and ask what their role at the company involves.",
            complete: "You had the conversation."
        },
        {
            id:       "david_asks_victoria",
            type:     "targeted",
            requires: ["victoria_ashworth"],
            giveTo:   ["david_richardson"],
            exclude:  [],
            text:     "Find {{victoria_ashworth}} and ask what line of work they are in.",
            complete: "You had the conversation."
        },

        // ── PATRICIA asks DOROTHY, CHARLES, ELIZABETH ────────────
        {
            id:       "patricia_asks_dorothy",
            type:     "targeted",
            requires: ["dorothy_wells"],
            giveTo:   ["patricia_chamberlain"],
            exclude:  [],
            text:     "Find {{dorothy_wells}} and ask how long they have called Dallas home.",
            complete: "You had the conversation."
        },
        {
            id:       "patricia_asks_charles",
            type:     "targeted",
            requires: ["charles_sterling"],
            giveTo:   ["patricia_chamberlain"],
            exclude:  [],
            text:     "Find {{charles_sterling}} and ask what they studied.",
            complete: "You had the conversation."
        },
        {
            id:       "patricia_asks_elizabeth",
            type:     "targeted",
            requires: ["elizabeth_monroe"],
            giveTo:   ["patricia_chamberlain"],
            exclude:  [],
            text:     "Find {{elizabeth_monroe}} and ask how they know the Thoresons.",
            complete: "You had the conversation."
        },

        // ── DOROTHY asks VIVIENNE, MARCUS, MIRANDA ───────────────
        {
            id:       "dorothy_asks_vivienne",
            type:     "targeted",
            requires: ["vivienne_ashford"],
            giveTo:   ["dorothy_wells"],
            exclude:  [],
            text:     "Find {{vivienne_ashford}} and ask what brought them back to Dallas.",
            complete: "You had the conversation."
        },
        {
            id:       "dorothy_asks_marcus",
            type:     "targeted",
            requires: ["marcus_brennan"],
            giveTo:   ["dorothy_wells"],
            exclude:  [],
            text:     "Find {{marcus_brennan}} and ask what they make of tonight's gathering.",
            complete: "You had the conversation."
        },
        {
            id:       "dorothy_asks_miranda",
            type:     "targeted",
            requires: ["miranda_longfellow"],
            giveTo:   ["dorothy_wells"],
            exclude:  [],
            text:     "Find {{miranda_longfellow}} and ask how long they have worked for the family.",
            complete: "You had the conversation."
        },

        // ── VIVIENNE asks RAYMOND, VICTORIA, SCOTT ───────────────
        {
            id:       "vivienne_asks_raymond",
            type:     "targeted",
            requires: ["raymond_hammond"],
            giveTo:   ["vivienne_ashford"],
            exclude:  [],
            text:     "Find {{raymond_hammond}} and ask what the company has been like to work for.",
            complete: "You had the conversation."
        },
        {
            id:       "vivienne_asks_victoria",
            type:     "targeted",
            requires: ["victoria_ashworth"],
            giveTo:   ["vivienne_ashford"],
            exclude:  [],
            text:     "Find {{victoria_ashworth}} and ask how they know William.",
            complete: "You had the conversation."
        },
        {
            id:       "vivienne_asks_scott",
            type:     "targeted",
            requires: ["scott_thoreson"],
            giveTo:   ["vivienne_ashford"],
            exclude:  [],
            text:     "Find {{scott_thoreson}} and ask what your uncle was like lately.",
            complete: "You had the conversation."
        },

        // ── RAYMOND asks CHARLES, ELIZABETH, WALTER ──────────────
        {
            id:       "raymond_asks_charles",
            type:     "targeted",
            requires: ["charles_sterling"],
            giveTo:   ["raymond_hammond"],
            exclude:  [],
            text:     "Find {{charles_sterling}} and ask what William was like when the company was young.",
            complete: "You had the conversation."
        },
        {
            id:       "raymond_asks_elizabeth",
            type:     "targeted",
            requires: ["elizabeth_monroe"],
            giveTo:   ["raymond_hammond"],
            exclude:  [],
            text:     "Find {{elizabeth_monroe}} and ask what brought them here tonight.",
            complete: "You had the conversation."
        },
        {
            id:       "raymond_asks_walter",
            type:     "targeted",
            requires: ["walter_lippman"],
            giveTo:   ["raymond_hammond"],
            exclude:  [],
            text:     "Find {{walter_lippman}} and ask what angle they are covering for the Herald.",
            complete: "You had the conversation."
        },

        // ── CHARLES asks MARCUS, MIRANDA, DAVID ──────────────────
        {
            id:       "charles_asks_marcus",
            type:     "targeted",
            requires: ["marcus_brennan"],
            giveTo:   ["charles_sterling"],
            exclude:  [],
            text:     "Find {{marcus_brennan}} and ask how long they have been invested in the company.",
            complete: "You had the conversation."
        },
        {
            id:       "charles_asks_miranda",
            type:     "targeted",
            requires: ["miranda_longfellow"],
            giveTo:   ["charles_sterling"],
            exclude:  [],
            text:     "Find {{miranda_longfellow}} and ask what their work for the family involves.",
            complete: "You had the conversation."
        },
        {
            id:       "charles_asks_david",
            type:     "targeted",
            requires: ["david_richardson"],
            giveTo:   ["charles_sterling"],
            exclude:  [],
            text:     "Find {{david_richardson}} and ask how they are connected to the Thoresons.",
            complete: "You had the conversation."
        },

        // ── MARCUS asks VICTORIA, SCOTT, PATRICIA ────────────────
        {
            id:       "marcus_asks_victoria",
            type:     "targeted",
            requires: ["victoria_ashworth"],
            giveTo:   ["marcus_brennan"],
            exclude:  [],
            text:     "Find {{victoria_ashworth}} and ask what they thought of the European deal.",
            complete: "You had the conversation."
        },
        {
            id:       "marcus_asks_scott",
            type:     "targeted",
            requires: ["scott_thoreson"],
            giveTo:   ["marcus_brennan"],
            exclude:  [],
            text:     "Find {{scott_thoreson}} and ask what tonight's announcement was supposed to be.",
            complete: "You had the conversation."
        },
        {
            id:       "marcus_asks_patricia",
            type:     "targeted",
            requires: ["patricia_chamberlain"],
            giveTo:   ["marcus_brennan"],
            exclude:  [],
            text:     "Find {{patricia_chamberlain}} and ask how they came to be invited tonight.",
            complete: "You had the conversation."
        },

        // ── VICTORIA asks ELIZABETH, WALTER, DOROTHY ─────────────
        {
            id:       "victoria_asks_elizabeth",
            type:     "targeted",
            requires: ["elizabeth_monroe"],
            giveTo:   ["victoria_ashworth"],
            exclude:  [],
            text:     "Find {{elizabeth_monroe}} and ask how well they knew William.",
            complete: "You had the conversation."
        },
        {
            id:       "victoria_asks_walter",
            type:     "targeted",
            requires: ["walter_lippman"],
            giveTo:   ["victoria_ashworth"],
            exclude:  [],
            text:     "Find {{walter_lippman}} and ask what story brought a journalist to a private dinner.",
            complete: "You had the conversation."
        },
        {
            id:       "victoria_asks_dorothy",
            type:     "targeted",
            requires: ["dorothy_wells"],
            giveTo:   ["victoria_ashworth"],
            exclude:  [],
            text:     "Find {{dorothy_wells}} and ask what they remember about how Thoreson Toys got started.",
            complete: "You had the conversation."
        },

        // ── ELIZABETH asks MIRANDA, DAVID, VIVIENNE ──────────────
        {
            id:       "elizabeth_asks_miranda",
            type:     "targeted",
            requires: ["miranda_longfellow"],
            giveTo:   ["elizabeth_monroe"],
            exclude:  [],
            text:     "Find {{miranda_longfellow}} and ask what it has been like working for the family.",
            complete: "You had the conversation."
        },
        {
            id:       "elizabeth_asks_david",
            type:     "targeted",
            requires: ["david_richardson"],
            giveTo:   ["elizabeth_monroe"],
            exclude:  [],
            text:     "Find {{david_richardson}} and ask why a private investigator was invited to dinner.",
            complete: "You had the conversation."
        },
        {
            id:       "elizabeth_asks_vivienne",
            type:     "targeted",
            requires: ["vivienne_ashford"],
            giveTo:   ["elizabeth_monroe"],
            exclude:  [],
            text:     "Find {{vivienne_ashford}} and ask what it was like living abroad for so long.",
            complete: "You had the conversation."
        },

    ]

};
