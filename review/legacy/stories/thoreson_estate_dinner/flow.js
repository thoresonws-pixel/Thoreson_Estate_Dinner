// ============================================================
// THOR'S MURDER MYSTERIES — GAME FLOW
// Story: The Thoreson Estate Dinner
// ============================================================
//
// PHASES:
//   Each phase has a type that determines what the platform does:
//
//   "social"       — Cocktail hour / pre-game. No revelations.
//                    Story facts and quests get distributed to players.
//                    Character missions fire as popups.
//
//   "investigation" — Active investigation act. Revelations can be
//                     toggled. QR scanning is active.
//
//   "resolution"   — Final phase. Confession, accusation round,
//                    killer reveal. Special mechanics fire here.
//
// ADVANCEMENT:
//   "manual"  — GM taps Next Phase in the monitor
//   "timed"   — Advances automatically after minMinutes
//   "trigger" — Advances when a specific revelation is toggled
//
// MINMINUTES:
//   Hard floor — phase cannot advance before this time even if
//   GM tries. Prevents the story resolving too fast.
//
// REVELATIONS:
//   Maps to a key in revelationsDatabase. Only revelations in
//   this act's pool are available during this phase.
//   null = no revelations (social phases)
//
// ============================================================

const gameFlow = {

    phases: [

        {
            id:          "cocktail",
            label:       "Cocktail Hour",
            type:        "social",
            icon:        "🥂",
            description: "Guests arrive, get in character, complete social missions. William is alive.",
            advance:     "manual",
            minMinutes:  60,
            maxMinutes:  75,
            revelations: null,
            // What fires automatically when this phase starts
            onStart: {
                distributeFacts:  true,   // assign story facts to characters
                distributeQuests: true,   // assign cocktail quests to players
                unlockScanning:   false   // QR scanning not active yet
            }
        },

        {
            id:          "act1",
            label:       "Act One — The Gathering",
            type:        "investigation",
            icon:        "🕯",
            description: "William is found dead. The investigation begins. Business records and company history surface.",
            advance:     "manual",
            minMinutes:  30,
            maxMinutes:  60,
            revelations: "act1",
            onStart: {
                distributeFacts:  false,
                distributeQuests: false,
                unlockScanning:   true,
                autoReveal:       ["willsDeath"]   // fires automatically on act start
            }
        },

        {
            id:          "act2",
            label:       "Act Two — The Secret",
            type:        "investigation",
            icon:        "🔍",
            description: "The affair, the secret heir, and Margaret's story come to light.",
            advance:     "manual",
            minMinutes:  25,
            maxMinutes:  50,
            revelations: "act2",
            onStart: {
                distributeFacts:  false,
                distributeQuests: false,
                unlockScanning:   true,
                autoReveal:       []
            }
        },

        {
            id:          "act3",
            label:       "Act Three — The Truth",
            type:        "investigation",
            icon:        "⚖",
            description: "The poison is identified. True identities surface. The killer is cornered.",
            advance:     "manual",
            minMinutes:  20,
            maxMinutes:  40,
            revelations: "act3",
            onStart: {
                distributeFacts:  false,
                distributeQuests: false,
                unlockScanning:   true,
                autoReveal:       []
            }
        },

        {
            id:          "resolution",
            label:       "Resolution",
            type:        "resolution",
            icon:        "🎭",
            description: "Accusation round, final confession, killer reveal.",
            advance:     "manual",
            minMinutes:  15,
            maxMinutes:  30,
            revelations: null,
            onStart: {
                distributeFacts:  false,
                distributeQuests: false,
                unlockScanning:   false,
                // Trigger accusation round prompt on all player devices
                triggerAccusation: true
            }
        }

    ]

};
