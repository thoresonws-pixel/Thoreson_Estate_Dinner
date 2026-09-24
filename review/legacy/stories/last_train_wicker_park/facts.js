// ============================================================
// THOR'S MURDER MYSTERIES — STORY FACTS
// Story: The Thoreson Estate Dinner
// ============================================================
//
// Story facts are ambient world knowledge that need to exist
// in the room before the investigation starts. They are
// distributed to characters at cocktail hour start.
//
// Each fact has a preferred character who carries it most
// naturally, and an ordered fallback list for when that
// character isn't in the game.
//
// Facts are delivered as a "You know this — share it naturally
// in conversation" popup during cocktail hour. They are NOT
// clues. They are background context that seeds the room.
//
// CATEGORIES:
//   "company"   — Thoreson Toys business history
//   "family"    — Thoreson family background
//   "social"    — Dallas society context
//   "financial" — Money, investment, deals
//   "personal"  — William's personality and habits
//
// PRIORITY:
//   1 = Must get into the room. Walk fallbacks until assigned.
//   2 = Important but not critical.
//   3 = Flavor. Only assign if characters are available.
//
// ============================================================

const storyFacts = [

    // ── COMPANY HISTORY ────────────────────────────────────────

    {
        id:            "thoreson_company_founding",
        category:      "company",
        priority:      1,
        phase:         "cocktail",
        text:          "William Thoreson founded Thoreson Toys in 1902. It is now one of the largest toy companies in Texas, employing over two hundred people across three facilities.",
        preferredChar: "charles_sterling",
        fallbacks:     ["raymond_hammond", "scott_thoreson", "marcus_brennan", "victoria_ashworth"]
    },

    {
        id:            "thoreson_company_reputation",
        category:      "company",
        priority:      1,
        phase:         "cocktail",
        text:          "Thoreson Toys is known for quality wooden toys and games. William built the company's reputation personally — he knew every buyer, every supplier, and every employee by name.",
        preferredChar: "raymond_hammond",
        fallbacks:     ["charles_sterling", "scott_thoreson", "victoria_ashworth"]
    },

    {
        id:            "european_deal_collapse",
        category:      "financial",
        priority:      1,
        phase:         "cocktail",
        text:          "Six months ago, a major European distribution deal collapsed. The company took a significant financial loss. William became quieter and more private afterward. Two investors began sending demand letters.",
        preferredChar: "marcus_brennan",
        fallbacks:     ["victoria_ashworth", "raymond_hammond", "charles_sterling"]
    },

    {
        id:            "company_books_locked",
        category:      "financial",
        priority:      2,
        phase:         "cocktail",
        text:          "William always kept the company's financial ledgers personally. Even the business manager never had full access to the books. Nobody ever thought much of it until now.",
        preferredChar: "raymond_hammond",
        fallbacks:     ["scott_thoreson", "charles_sterling", "marcus_brennan"]
    },

    // ── FAMILY BACKGROUND ──────────────────────────────────────

    {
        id:            "william_character",
        category:      "family",
        priority:      1,
        phase:         "cocktail",
        text:          "William Thoreson was a commanding presence — generous in public, demanding in private. He expected excellence from everyone around him, including his children. He was not a man who apologized easily.",
        preferredChar: "charles_sterling",
        fallbacks:     ["dorothy_wells", "elizabeth_monroe", "victoria_ashworth"]
    },

    {
        id:            "william_announcement",
        category:      "family",
        priority:      1,
        phase:         "cocktail",
        text:          "William told several people that tonight was going to be a special evening — that he had an important announcement to make. He said he was finally going to make something right. He did not say what.",
        preferredChar: "scott_thoreson",
        fallbacks:     ["charles_sterling", "miranda_longfellow", "raymond_hammond"]
    },

    {
        id:            "scott_family_role",
        category:      "family",
        priority:      2,
        phase:         "cocktail",
        text:          "{{scott_thoreson}} has been managing the day-to-day operations of Thoreson Toys for the past two years. William was stepping back — some said by choice, others said by necessity.",
        preferredChar: "miranda_longfellow",
        fallbacks:     ["raymond_hammond", "charles_sterling", "dorothy_wells"]
    },

    // ── SOCIAL CONTEXT ─────────────────────────────────────────

    {
        id:            "dallas_society",
        category:      "social",
        priority:      2,
        phase:         "cocktail",
        text:          "The Thoresons are one of Dallas's most prominent families. William has been a fixture of the city's business and charity circles for thirty years. An invitation to the estate is considered a mark of distinction.",
        preferredChar: "elizabeth_monroe",
        fallbacks:     ["dorothy_wells", "victoria_ashworth", "charles_sterling"]
    },

    {
        id:            "dorothy_history",
        category:      "social",
        priority:      2,
        phase:         "cocktail",
        text:          "{{dorothy_wells}} has lived in Dallas longer than almost anyone here. If something happened in this city in the last fifty years, there is a reasonable chance {{dorothy_wells}} was in the room.",
        preferredChar: "elizabeth_monroe",
        fallbacks:     ["victoria_ashworth", "charles_sterling", "marcus_brennan"]
    },

    {
        id:            "miranda_role",
        category:      "company",
        priority:      2,
        phase:         "cocktail",
        text:          "{{miranda_longfellow}} has managed the legal affairs of the Thoreson estate for nearly ten years. Every significant document, contract, and filing has passed through those hands.",
        preferredChar: "scott_thoreson",
        fallbacks:     ["raymond_hammond", "charles_sterling", "marcus_brennan"]
    },

    {
        id:            "david_pi",
        category:      "social",
        priority:      2,
        phase:         "cocktail",
        text:          "{{david_richardson}} is a licensed private investigator and a Thoreson cousin. The moment something goes wrong at a family gathering, {{david_richardson}} starts making calls. It is a reflex at this point.",
        preferredChar: "scott_thoreson",
        fallbacks:     ["charles_sterling", "elizabeth_monroe", "dorothy_wells"]
    },

    // ── WILLIAM'S HABITS ───────────────────────────────────────

    {
        id:            "william_drink",
        category:      "personal",
        priority:      1,
        phase:         "cocktail",
        text:          "William always drank the same thing at his own gatherings — a specific bourbon, neat, prepared by the household before guests arrived. He rarely varied from it.",
        preferredChar: "charles_sterling",
        fallbacks:     ["dorothy_wells", "scott_thoreson", "elizabeth_monroe"]
    },

    {
        id:            "william_health",
        category:      "personal",
        priority:      2,
        phase:         "cocktail",
        text:          "William had been in good health for a man his age. No serious illness, no medications that anyone knew of. His death tonight is not a natural event.",
        preferredChar: "patricia_chamberlain",
        fallbacks:     ["charles_sterling", "dorothy_wells", "scott_thoreson"]
    }

];
