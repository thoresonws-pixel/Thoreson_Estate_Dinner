// ============================================================
// THOR'S MURDER MYSTERIES — REVELATIONS DATABASE TEMPLATE
// ============================================================
// HOW TO USE THIS TEMPLATE:
//   Revelations are the GM-controlled story beats.
//   Each revelation is a toggle in the GM panel.
//   When toggled ON, it becomes visible in every player's
//   Discoveries tab AND triggers any memories/knowledge
//   on characters that reference its ID with unlockedBy.
//
// STRUCTURE:
//   Three acts, each with an array of items.
//   Each item has:
//     id:    Unique string key — used in unlockedBy fields
//            in characters.js. Must be camelCase, no spaces.
//     title: Short name shown in GM panel toggle button
//     type:  'story' (narrative beat) or 'clue' (physical evidence)
//     summary: Full text shown in player Discoveries tab
//              Use plain text — no HTML. Paragraphs separated by \n\n.
//
// EVIDENCE PIPELINE (David Richardson / equivalent):
//   Three special revelation IDs trigger text-message style
//   popups on the pipeline character's device.
//   Name them however fits your story — just match the IDs
//   used in that character's memories array in characters.js.
//   Convention: pipeline_act1, pipeline_act2, pipeline_act3
//
// TYPES:
//   'story' → appears in the Story tab of Discoveries
//   'clue'  → appears in the Clues tab of Discoveries
//
// STORY: STORY_NAME
// SETTING: CITY, YEAR
// ============================================================

const revelationsDatabase = {

    act1: {
        label: "Act One — [Short Act Title]",  // e.g. "Act One — The Body"
        items: [

            // ── GAME START ────────────────────────────────────────
            // willsDeath (or your equivalent) is the game start trigger.
            // This revelation MUST be the first one — it unlocks the
            // investigation. The dashboard uses it to gate QR scanning.
            {
                id:      "gameStart",           // RENAME to match your story
                title:   "The Discovery",       // e.g. "Will's Death Announced"
                type:    "story",
                summary: "Full text shown in player Discoveries tab when this is revealed.\n\nWrite in third person, past tense. This is the shared record of what happened — what every guest now knows.\n\nBreak into paragraphs with \\n\\n."
            },

            // ── EVIDENCE PIPELINE — ACT 1 ────────────────────────
            // Triggers a text-message popup on the pipeline character's device
            // AND a memory popup on any character with unlockedBy: "pipeline_act1"
            {
                id:      "pipeline_act1",
                title:   "Pipeline Report — Act 1",  // e.g. "County Clerk Report"
                type:    "clue",
                summary: "Summary of what was discovered and shared with the group."
            },

            // ── REGULAR REVELATIONS ───────────────────────────────
            {
                id:      "first_clue",
                title:   "First Clue Title",
                type:    "clue",
                summary: "Description of the clue and what it reveals."
            },
            {
                id:      "first_story_beat",
                title:   "First Story Beat Title",
                type:    "story",
                summary: "Narrative beat — what the group now knows about the story."
            },
            {
                id:      "financial_records",
                title:   "Financial Records",
                type:    "clue",
                summary: "What the financial records show and why it matters."
            },
            {
                id:      "key_document",
                title:   "Key Document",
                type:    "clue",
                summary: "Description of the document and its significance."
            }

        ]
    },

    act2: {
        label: "Act Two — [Short Act Title]",  // e.g. "Act Two — The Motive"
        items: [

            // ── EVIDENCE PIPELINE — ACT 2 ────────────────────────
            {
                id:      "pipeline_act2",
                title:   "Pipeline Report — Act 2",  // e.g. "Coroner's Report"
                type:    "clue",
                summary: "Summary of the second pipeline report."
            },

            {
                id:      "major_revelation",
                title:   "Major Revelation Title",
                type:    "story",
                summary: "The big mid-game reveal that recontextualizes everything."
            },
            {
                id:      "secret_connection",
                title:   "Secret Connection",
                type:    "story",
                summary: "A hidden relationship or secret comes to light."
            },
            {
                id:      "love_letter",
                title:   "Personal Letters",
                type:    "clue",
                summary: "What the letters reveal about relationships and motives."
            },
            {
                id:      "birth_record",
                title:   "Birth Record",
                type:    "clue",
                summary: "What the birth record reveals."
            }

        ]
    },

    act3: {
        label: "Act Three — [Short Act Title]",  // e.g. "Act Three — The Truth"
        items: [

            // ── EVIDENCE PIPELINE — ACT 3 ────────────────────────
            {
                id:      "pipeline_act3",
                title:   "Pipeline Report — Act 3",  // e.g. "Pinkerton Report"
                type:    "clue",
                summary: "Final pipeline report — typically reveals name changes, true identities, or connections."
            },

            // ── MURDER METHOD ─────────────────────────────────────
            // This revelation triggers the Botany / Medical skill auto-unlock
            // if your story uses those skills. Update autoSkillUnlocks in
            // authenticated-dashboard.html if you change the method.
            {
                id:      "murder_method",
                title:   "Cause of Death Identified",  // e.g. "Wolfsbane"
                type:    "clue",
                summary: "The cause of death is identified. What it is, how it was obtained, and why it points to a specific person."
            },

            // ── KILLER IDENTITY ───────────────────────────────────
            {
                id:      "killer_identity",
                title:   "Killer's True Identity",
                type:    "story",
                summary: "The killer's real identity is revealed — who they actually are and why they had motive."
            },

            // ── FINAL CONFESSION ─────────────────────────────────
            {
                id:      "final_confession",
                title:   "Final Confession",
                type:    "story",
                summary: "The killer's full confession — the complete truth of what happened and why."
            }

        ]
    }

};

// ── REVELATION ID REFERENCE ───────────────────────────────────
// Copy this list into characters.js at the top as a reference
// so writers know which IDs to use in unlockedBy fields:
//
// Act 1: gameStart, pipeline_act1, first_clue, first_story_beat,
//         financial_records, key_document
// Act 2: pipeline_act2, major_revelation, secret_connection,
//         love_letter, birth_record
// Act 3: pipeline_act3, murder_method, killer_identity, final_confession
