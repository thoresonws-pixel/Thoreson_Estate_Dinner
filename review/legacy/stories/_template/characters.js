// ============================================================
// THOR'S MURDER MYSTERIES — CHARACTER DATABASE TEMPLATE
// ============================================================
// HOW TO USE THIS TEMPLATE:
//   1. Copy this folder to stories/your_story_name/
//   2. Replace STORY_NAME and STORY_YEAR at the top
//   3. Add/remove characters as needed (min 8, max 24 recommended)
//   4. Fill in nameVariants, publicDesc, backstory etc for each character
//   5. Set picker.involvement and picker.isKiller
//   6. Add the story to admin.html STORIES object
//
// RULES — read before writing any content:
//
// ── TOKEN SYSTEM ──────────────────────────────────────────────
//   NEVER write a character's name directly in backstory,
//   memories, canShare, or relationships text.
//   ALWAYS use {{slug}} tokens instead.
//   e.g. "{{character_one}} handed over the ledger"
//   renderText() resolves tokens to the correct gender variant at runtime.
//
// ── NO PRONOUNS ───────────────────────────────────────────────
//   NEVER write he/she/him/her/his/hers in any story content.
//   Rewrite sentences to use the character's name token instead.
//   BAD:  "She knew what had happened."
//   GOOD: "{{character_one}} knew what had happened."
//
// ── NAME VARIANTS ─────────────────────────────────────────────
//   Every character needs female AND male name variants.
//   These are resolved at runtime based on the player's gender
//   preference set during the questionnaire.
//   Default (unresolved) = female.
//
// ── PROGRESSIVE REVEAL ────────────────────────────────────────
//   unlockedBy: null        → Always visible to this character
//   unlockedBy: "revelationId" → Only visible after GM reveals it
//   tier: 1                 → Urgent popup (red styling, share immediately)
//   tier: 2                 → Flavor popup (standard styling)
//
// ── PICKER METADATA ───────────────────────────────────────────
//   picker.involvement:
//     'heavy'    — All-In. Central to the mystery. High drama.
//     'moderate' — Plays a meaningful role, some key moments.
//     'light'    — Lower-key. Good for guests who want to participate
//                  without carrying heavy story weight.
//   picker.isKiller: true on exactly ONE character per story.
//
// ── SKILLS ────────────────────────────────────────────────────
//   Skills gate QR code content — only players with the matching
//   skill can read certain documents. List in hiddenSkills[].
//   Skills are never shown on character pages — hidden from players.
//   Available skills are defined in skills.js for this story.
//
// ── OPTIONAL CHARACTERS ───────────────────────────────────────
//   If a character is optional (cut first when guest count is low),
//   start their note field with "OPTIONAL CHARACTER — "
//   The picker will handle showing/hiding them automatically.
//
// ── REVELATION IDS ────────────────────────────────────────────
//   These come from revelations.js for this story.
//   Replace the example IDs below with your story's actual IDs.
//
// STORY: STORY_NAME
// SETTING: CITY, YEAR
// ============================================================

const characterDatabase = {

    // ============================================================
    // CHARACTER ONE — The Killer
    // Slug format: firstname_lastname (lowercase, underscores)
    // ============================================================
    "character_one": {
        name: "Character One",                          // Display name (fallback)
        nameVariants: {
            female: "Character One Female Name",        // e.g. "Miranda Longfellow"
            male:   "Character One Male Name"           // e.g. "Milo Longfellow"
        },
        picker: {
            role:        "Role Title",                  // Short role shown on picker card
            involvement: "heavy",                       // heavy | moderate | light
            isKiller:    true                           // true on exactly ONE character
        },
        publicDesc: "Short public description shown on the character picker card and to other players. Should be intriguing but not revealing. Use {{slug}} tokens for any character name references. 2-3 sentences max.",
        hiddenSkills: ["SkillName"],                    // Skills for QR gating. Never shown to player.
        note: "GM/author note — internal guidance on how to play this character. Not shown to players.",
        backstory: "Full private backstory shown only to the player who picks this character.\n\nWrite in second person ('You are...'). Use {{slug}} tokens for ALL character name references. No pronouns.\n\nBreak into paragraphs with \\n\\n. Each paragraph should reveal character voice and motivation.\n\nThis is the most important piece of writing for each character. Take your time.",
        memories: [
            // Memories are private popup notifications triggered when a revelation is unlocked
            // They appear on the player's device as a popup
            // tier 1 = red/urgent (share immediately), tier 2 = standard flavor
            { text: "Memory text triggered when a revelation fires. Written in second person. Use {{slug}} tokens.", unlockedBy: "revelation_id", tier: 2 },
            { text: "Urgent memory — something critical the player must share with the group.", unlockedBy: "another_revelation_id", tier: 1 },
            // Always-visible memory (fires immediately on game start, not tied to a revelation):
            // { text: "Something you always knew.", unlockedBy: null }
        ],
        knowledge: [
            // Knowledge items appear in the character's Knowledge section (not as popups)
            // Usually used for expert skill content tied to a revelation
            { text: "Something this character knows because of their expertise.", unlockedBy: "revelation_id" }
        ],
        canShare: [
            // Lines the player can use in conversation — shown in their character sheet
            // unlockedBy: null = always available
            // unlockedBy: "id" = only available after that revelation fires
            { text: "A line this character can say out loud during the investigation.", unlockedBy: null },
            { text: "Something revealed mid-game that becomes shareable.", unlockedBy: "revelation_id" }
        ],
        relationships: [
            // Shown in the character sheet. Use {{slug}} for names.
            { name: "{{character_two}}", relation: "Description of the relationship" },
            { name: "{{character_three}}", relation: "Description of the relationship" },
            { name: "Deceased Character Name", relation: "Their relationship to the deceased (not a player)" }
        ],
        items: [
            // Physical items this character carries. Shown in character sheet.
            // Use sparingly — only items relevant to the mystery.
            "Item description (e.g. 'A sealed envelope — do not open until Act 2')"
        ],
        // ── KILLER ONLY FIELDS ────────────────────────────────
        // Only include secret and finalEntry on the killer character
        secret: {
            trueIdentity: "Their real name / real role",
            carryingItems: "Hidden item description — shown in their secret section"
        },
        finalEntry: {
            context: "Instructions for how to deliver the confession monologue. Not shown to audience — just to the player.",
            text: "The full confession monologue text.\n\nUse {{slug}} tokens for character names.\nNo pronouns.\nWrite in first person — this is spoken aloud.\n\nFormat with \\n\\n between paragraphs."
        }
    },

    // ============================================================
    // CHARACTER TWO — Evidence Pipeline
    // (The character who receives external reports / intel)
    // ============================================================
    "character_two": {
        name: "Character Two",
        nameVariants: {
            female: "Character Two Female Name",
            male:   "Character Two Male Name"
        },
        picker: {
            role:        "Role Title",
            involvement: "heavy",
            isKiller:    false
        },
        publicDesc: "Public description for the picker card.",
        hiddenSkills: [],
        note: "This character is the evidence pipeline. Reports arrive as memory popups tied to djCountyClerk / djCoroner / djPinkerton revelation IDs (or your story's equivalent). Make it dramatic — have them step away to 'take a call' each time.",
        backstory: "Backstory text...",
        memories: [
            // Evidence pipeline memories use special revelation IDs
            // that also trigger text-message styled popups
            { text: "REPORT HEADER\n─────────────────────\nReport content formatted like an official document.\n\nSigned,\n— Source Name", unlockedBy: "pipeline_act1" },
            { text: "Second report content.", unlockedBy: "pipeline_act2" },
            { text: "Third report content.", unlockedBy: "pipeline_act3" }
        ],
        canShare: [
            { text: "A line hinting at their connections and role.", unlockedBy: null }
        ],
        relationships: [
            { name: "{{character_one}}", relation: "Relationship description" }
        ],
        items: []
    },

    // ============================================================
    // CHARACTER THREE — Skill Holder (Medical / Botany / etc.)
    // ============================================================
    "character_three": {
        name: "Character Three",
        nameVariants: {
            female: "Character Three Female Name",
            male:   "Character Three Male Name"
        },
        picker: {
            role:        "Role Title",
            involvement: "moderate",
            isKiller:    false
        },
        publicDesc: "Public description.",
        hiddenSkills: ["SkillName"],        // This skill gates specific QR codes
        backstory: "Backstory text...",
        memories: [
            { text: "A memory triggered by a revelation relevant to their expertise.", unlockedBy: "revelation_id" }
        ],
        knowledge: [
            // For skill holders — their expert interpretation fires when the relevant
            // revelation is unlocked, in addition to any QR scanning
            { text: "What this character knows due to their expertise — triggered when the revelation fires.", unlockedBy: "revelation_id" }
        ],
        canShare: [
            { text: "Something they can contribute from their expertise.", unlockedBy: null }
        ],
        relationships: [
            { name: "{{character_one}}", relation: "Relationship" }
        ],
        items: []
    },

    // ============================================================
    // CHARACTER FOUR — Moderate Role
    // ============================================================
    "character_four": {
        name: "Character Four",
        nameVariants: {
            female: "Character Four Female Name",
            male:   "Character Four Male Name"
        },
        picker: {
            role:        "Role Title",
            involvement: "moderate",
            isKiller:    false
        },
        publicDesc: "Public description.",
        hiddenSkills: [],
        backstory: "Backstory text...",
        memories: [],
        canShare: [
            { text: "Something this character can say.", unlockedBy: null }
        ],
        relationships: [],
        items: []
    },

    // ============================================================
    // CHARACTER FIVE — Optional (cut first if needed)
    // ============================================================
    "character_five": {
        name: "Character Five",
        nameVariants: {
            female: "Character Five Female Name",
            male:   "Character Five Male Name"
        },
        picker: {
            role:        "Role Title",
            involvement: "light",
            isKiller:    false
        },
        publicDesc: "Public description.",
        hiddenSkills: [],
        // The note MUST start with "OPTIONAL CHARACTER — " for auto-hide logic
        note: "OPTIONAL CHARACTER — cut first if guest count is low. Mystery works without this role.",
        backstory: "Backstory text...",
        memories: [],
        canShare: [
            { text: "Something this character can say.", unlockedBy: null }
        ],
        relationships: [],
        items: []
    }

    // ── ADD MORE CHARACTERS FOLLOWING THE SAME PATTERN ──────────
    // Copy one of the blocks above, change the slug key and fill in content
    // Minimum recommended: 8 characters
    // Maximum recommended: 24 characters
    // Remember: exactly ONE character gets isKiller: true

};
