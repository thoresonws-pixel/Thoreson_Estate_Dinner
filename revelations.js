// REVELATIONS DATABASE — Thoreson Estate Murder Mystery
// Everything Scott pushes from Master Controls
// Each item has:
//   id: unique identifier (used by Firebase sync)
//   type: "revelation" (evidence-based) or "story" (narrative beat)
//   title: Display title
//   summary: What shows on everyone's Discoveries page when activated

const revelationsDatabase = {

    "act1": {
        label: "Act 1 — The Gathering",
        items: [
            {
                id: "willsDeath",
                type: "story",
                title: "Will's Death",
                summary: "William Thoreson Sr. was found dead this evening. The family has gathered to learn the truth about what happened."
            },
            {
                id: "ledger",
                type: "revelation",
                title: "Suspicious Ledger",
                summary: "A financial ledger shows secret monthly payments of $50 to someone identified only as <strong>'T.H.'</strong> — going back over 24 years. Will authorized them personally."
            },
            {
                id: "forgedDocs",
                type: "revelation",
                title: "Forged Transfer Documents",
                summary: "The company ownership transfer from Robert Hartley to Will Thoreson is <strong>fraudulent</strong>. The signature is forged, dated one day before Robert's death, and the notary doesn't exist."
            },
            {
                id: "stolenCompany",
                type: "story",
                title: "The Stolen Company",
                summary: "Thoreson Toys was originally <strong>Thoreson & Hartley Toys</strong>. Will used forged documents to seize full ownership after his partner Robert Hartley's death in 1910."
            }
        ]
    },

    "act2": {
        label: "Act 2 — The Secret Heir",
        items: [
            {
                id: "affair",
                type: "revelation",
                title: "The Affair Revealed",
                summary: "Will had a long-standing affair with <strong>Margaret Hartley</strong> — the wife of his business partner Robert. Margaret had two children: one Robert's, one Will's."
            },
            {
                id: "secretHeir",
                type: "story",
                title: "The Secret Heir",
                summary: "The mysterious <strong>'T.H.'</strong> in the ledger is <strong>Taylor Hartley</strong> — Will's illegitimate child with Margaret. Will set up a secret trust fund but abandoned Margaret's other child entirely."
            },
            {
                id: "margaretsLetter",
                type: "revelation",
                title: "Margaret's Letter",
                summary: "A letter from Margaret Hartley, written in French, pleads with Will to support <strong>both children</strong>. She references a <strong>safe in the study closet</strong> with a meaningful combination."
            }
        ]
    },

    "act3": {
        label: "Act 3 — The Killer",
        items: [
            {
                id: "poisoning",
                type: "revelation",
                title: "Murder by Poison",
                summary: "Will was killed by <strong>Aconitine</strong>, a toxin from Wolfsbane. It was slipped into his food or drink. This was not natural causes — <strong>this was murder</strong>."
            },
            {
                id: "poisonTrail",
                type: "revelation",
                title: "The Poison Trail",
                summary: "Wolfsbane only grows in the <strong>Swiss Alps</strong>. It cannot be purchased — someone had to travel to Europe and harvest it. Has anyone here been to Switzerland recently?"
            },
            {
                id: "mirandasIdentity",
                type: "story",
                title: "Miranda Unmasked",
                summary: "Miranda Longfellow is really <strong>Miranda Hartley</strong> — Robert's abandoned daughter. She changed her name, became Scott's assistant, and has been hiding inside the family for <strong>ten years</strong>."
            }
        ]
    }
};
