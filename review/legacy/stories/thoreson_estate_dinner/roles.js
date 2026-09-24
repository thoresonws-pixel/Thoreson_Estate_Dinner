// ============================================================
// THOR'S MURDER MYSTERIES — ROLES CONFIGURATION
// Story: The Thoreson Estate Dinner
// ============================================================
//
// PLATFORM-AGNOSTIC DESIGN:
//   The platform does not know what "killer" or "heir" means.
//   It only knows Priority 1, Priority 2, Priority 3 etc.
//   Each story defines its own priority roles here.
//   The generation algorithm assigns them in order.
//
// PRIORITY ROLES:
//   label          — story-specific name (internal only, never shown to players)
//   count          — how many players get this priority
//   minScore       — minimum involvement score to be eligible
//   eligibleChars  — character slugs that can receive this priority
//                    Must have enough eligible chars to guarantee
//                    at least 2 are picked in any minimum-size game
//   assignTo       — if set, always assign to this character (skip random)
//   excludeFrom    — if true, character assigned this priority is removed
//                    from the pool for all subsequent priorities
//   ineligibleSkills — skills that cannot go to this priority holder
//
// SKILLS:
//   Each skill has a primary holder and an ordered backup list.
//   Generation checks if primary is in the game first.
//   If not, walks backup list until finding someone who is.
//   Backup order matters — most natural fits first.
//   Investigation: pipeline only — no backups ever.
//
// SCORE WEIGHTS:
//   Probability tables (0.0-1.0) keyed by involvement score (1-10).
//
// ============================================================

var rolesConfig = {

    // ── PRIORITY ROLES ─────────────────────────────────────────
    priorities: {

        priority1: {
            label:            "killer",
            count:            1,
            minScore:         6,
            // 6 eligible — guarantees at least 2 present in any 8-person game
            eligibleChars: [
                "miranda_longfellow",
                "walter_lippman",
                "vivienne_ashford",
                "raymond_hammond",
                "elizabeth_monroe",
                "marcus_brennan"
            ],
            excludeFrom:      true,
            ineligibleSkills: ["Botany", "Medical", "Investigation"]
        },

        priority2: {
            label:            "heir",
            count:            1,
            minScore:         5,
            // Same pool — killer excluded before heir assigned
            eligibleChars: [
                "miranda_longfellow",
                "walter_lippman",
                "vivienne_ashford",
                "raymond_hammond",
                "elizabeth_monroe",
                "marcus_brennan"
            ],
            excludeFrom:      true,
            ineligibleSkills: []
        },

        priority3: {
            label:            "pipeline",
            count:            1,
            minScore:         6,
            assignTo:         "david_richardson",
            excludeFrom:      true,
            ineligibleSkills: ["Botany", "Medical", "Legal", "Accounting",
                               "Banking", "French", "Journalism", "Bartender"]
        }

    },

    // ── SKILL ASSIGNMENTS ──────────────────────────────────────
    skills: {

        Legal: {
            primary: "miranda_longfellow",
            backups: ["scott_thoreson", "victoria_ashworth", "marcus_brennan", "elizabeth_monroe"]
        },

        Journalism: {
            primary: "walter_lippman",
            backups: ["scott_thoreson", "victoria_ashworth", "marcus_brennan", "elizabeth_monroe"]
        },

        Medical: {
            primary: "patricia_chamberlain",
            backups: ["scott_thoreson", "victoria_ashworth", "marcus_brennan", "elizabeth_monroe"]
        },

        Botany: {
            primary: "dorothy_wells",
            backups: ["elizabeth_monroe", "victoria_ashworth", "scott_thoreson", "marcus_brennan"]
        },

        French: {
            primary: "vivienne_ashford",
            backups: ["elizabeth_monroe", "victoria_ashworth", "scott_thoreson", "marcus_brennan"]
        },

        Accounting: {
            primary: "raymond_hammond",
            backups: ["marcus_brennan", "scott_thoreson", "victoria_ashworth", "elizabeth_monroe"]
        },

        Banking: {
            primary: "charles_sterling",
            backups: ["marcus_brennan", "victoria_ashworth", "scott_thoreson", "elizabeth_monroe"]
        },

        Investigation: {
            primary: "david_richardson",
            backups: []
        }

    },

    // ── SCORE WEIGHT TABLES ────────────────────────────────────
    scoreWeights: {

        priority: {
            1: 0.00, 2: 0.00, 3: 0.00, 4: 0.00,
            5: 0.25, 6: 0.50, 7: 0.78, 8: 0.88,
            9: 0.95, 10: 1.00
        },

        skill: {
            1: 0.00, 2: 0.00, 3: 0.03, 4: 0.05,
            5: 0.35, 6: 0.50, 7: 0.70, 8: 0.82,
            9: 0.92, 10: 0.97
        }

    },

    // ── PRIORITY OVERLAY CONTENT ───────────────────────────────
    // Injected into character sheet when a priority role is assigned.
    // base   — core secret, same emotional truth for all holders
    // access — character-specific: how THIS character got into position
    // Written in second person. {{slug}} tokens. No pronouns.

    overlays: {

        priority1: {

            base: "You are the killer.\n\nYour connection to the Hartley family runs deeper than anyone in this room knows. Robert Hartley's story — the stolen company, the forged documents, the death that was ruled a suicide — is not abstract history to you. It is personal. You have spent years getting close enough to confirm what you always suspected, and planning what you would do when the moment came.\n\nLast summer you traveled to Switzerland. Wolfsbane grows wild in the Alps — purple flowers along the mountain trails, beautiful and poisonous down to the root. You brought some home. You dried it. You ground it.\n\nTonight, before the guests arrived, you put it in his drink.\n\nWilliam is dead. You are at peace with that. You are not a villain. You are someone who was owed a debt that was never going to be paid any other way.\n\nYou are good at stillness. Let the investigation find you. Help where you can. The slower the truth comes out, the better the story.",

            access: {
                miranda_longfellow: "Ten years as legal manager of the Thoreson estate gave you access to every document William thought was safely hidden. You read everything. You filed everything. You knew exactly where the forged transfer was kept, where the ledger lived, where the love letters were locked. Your access was total and completely unremarkable — you were just the help.",

                walter_lippman:     "You spent years covering Dallas business, circling the Thoreson story from the outside, never able to confirm what you suspected. Then William invited you personally. You came because you thought you were finally going to get the story. Instead you decided to end it. You had already obtained the wolfsbane before the invitation arrived. The invitation just gave you the room.",

                vivienne_ashford:   "You grew up in and out of this house. You know which doors lock, which drawers stick, where things are kept. Coming back from abroad gave you distance — and distance gave you clarity about what this family had done and who had paid for it. You had time in Europe to confirm what you suspected and to find what you needed in the Swiss Alps. Coming home was always going to end like this.",

                raymond_hammond:    "Fifteen years as business manager gave you access to every part of this company except the books. But you knew the building. You knew the schedules. You knew when William was alone and when he wasn't. You knew which drinks William preferred and who prepared them. Proximity is its own kind of access — and you had been proximate for fifteen years.",

                elizabeth_monroe:   "You have been inside Dallas society for forty years. You knew the Hartley family before the scandal. You were there when Robert died. You watched William walk away clean and build an empire on what he took. You have been patient for a very long time. Nobody watches the most fun person in the room.",

                marcus_brennan:     "You did not invest in Thoreson Toys for the returns. You invested to get close. Four years inside the company gave you everything you needed — access to William, to the building, to the drinks service at company events. The European deal collapsing was an inconvenience. What you came here to do tonight was always the plan."
            }
        },

        priority2: {

            base: "You are the secret heir.\n\nYou may not know this yet — or you have suspected it without being able to confirm it. There was always something unexplained. A trust fund with no clear origin. A family connection that was never fully spelled out. A feeling that the story of where you came from had a chapter nobody would show you.\n\nWilliam Thoreson invited you tonight specifically. He said he had an announcement — something that concerned you personally. You came because some part of you has always known this night was coming.\n\nYou are connected to William Thoreson in a way that is about to become very public. Let the investigation find this. Do not lead it there. Your reaction when it surfaces should feel genuine — because in many ways, it is.",

            access: {
                miranda_longfellow: "You grew up knowing you were Robert Hartley's daughter. What you discovered after years working inside the Thoreson files was that Margaret's second child — the one William funded secretly — was your half-sibling. The heir story is more complicated for you than for anyone else in this room.",

                walter_lippman:     "You were born Taylor Hartley on March 5th, 1911. Your mother was Margaret. You were raised by distant relatives after Margaret died, told very little about where you came from, only that there was a trust fund in your name. You built a career. You never stopped looking for the story. Tonight you are going to find it.",

                vivienne_ashford:   "The Ashford family connection to the Thoresons goes back further than anyone has said. You were raised knowing less than you should about your own family history. Coming back from abroad, you started asking questions that nobody wanted to answer. Tonight some of them will be answered whether anyone wants them to be or not.",

                raymond_hammond:    "You grew up with a trust fund that nobody could fully explain. You changed your name when you were young — the name you were born with carried something uncomfortable that nobody would talk about. You applied for the business manager position at Thoreson Toys without knowing the connection. You have been inside this company for fifteen years without understanding why it always felt personal.",

                elizabeth_monroe:   "You have spent forty years in Dallas society carefully curating who you are and where you came from. The truth is considerably more complicated. Your family's connection to the Hartleys predates the scandal — and what William did in 1910 had consequences for your family that you have never spoken about publicly.",

                marcus_brennan:     "You know exactly who you are and what you are doing here. When you discovered the truth about your origins — the Hartley connection, the trust fund, what William had done — you made a plan. You invested the trust money back into Thoreson Toys deliberately. Four years inside the company. Four years watching. Tonight William was going to make his announcement. You wanted to be in the room when it happened."
            }
        }

        // priority3 (pipeline) has no overlay —
        // David Richardson's PI identity is his public role, not a secret

    }

};
