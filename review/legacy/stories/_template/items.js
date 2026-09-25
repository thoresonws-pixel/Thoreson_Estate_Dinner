// ============================================================
// THOR'S MURDER MYSTERIES — ITEMS DATABASE TEMPLATE
// ============================================================
// HOW TO USE THIS TEMPLATE:
//   Items are the physical props used in the game.
//   Each item has a QR code that players scan to "find" it.
//   Some items require a skill to fully analyze (gated).
//   Some items are standalone clues with no skill gate.
//
// QR CODE TYPES:
//   1. Skill-gated:   THORESON:SkillName
//      → Only the character with that skill sees expert content
//      → Others see "this requires [skill] expertise"
//
//   2. Standalone:    scan.html?id=item_id  (or clue.html?id=item_id)
//      → Anyone can scan and gets a "Clue Found" confirmation
//      → The actual content comes from the GM revealing it
//         in the Discoveries tab
//
//   3. Special:       netsuke.html, photo.html?id=XX
//      → Side quests, easter eggs, photo reveals
//
// PHYSICAL PROP REQUIREMENTS:
//   Each item needs:
//   - The actual physical prop (printed document, envelope, etc.)
//   - A QR code printed and attached or placed with the prop
//   - A location planned for Act placement
//
// PROP PLACEMENT:
//   Act 1: Available from the start
//   Act 2: Revealed mid-game (keep physically hidden, or in lockbox)
//   Act 3: Final reveals (safe combination, locked items, etc.)
//
// STORY: STORY_NAME
// SETTING: CITY, YEAR
// ============================================================

const itemDatabase = [

    // ── ACT 1 ITEMS ───────────────────────────────────────────
    // Available from the start of the investigation

    {
        id:    "autopsy_report",
        label: "Autopsy Report",
        act:   1,
        qr:    "THORESON:Medical",         // Skill-gated — Medical skill required
        notes: "Physical prop: Printed on letterhead. Place on side table or give to the evidence pipeline character to distribute."
    },

    {
        id:    "company_letterhead",
        label: "Original Company Letterhead",
        act:   1,
        qr:    "scan.html?id=company_letterhead",  // Standalone scan
        notes: "Physical prop: Old letterhead showing original company name with both founders. Place in study or documents area."
    },

    {
        id:    "financial_ledger",
        label: "Financial Ledger",
        act:   1,
        qr:    "THORESON:Accounting",      // Skill-gated — Accounting skill required
        notes: "Physical prop: A ledger book or printed pages. The accounting skill holder interprets the suspicious entries."
    },

    {
        id:    "bank_statement",
        label: "Bank Statement",
        act:   1,
        qr:    "THORESON:Banking",         // Skill-gated — Banking skill required
        notes: "Physical prop: Printed bank statement with highlighted unusual transactions."
    },

    // ── ACT 2 ITEMS ───────────────────────────────────────────
    // Revealed mid-game — keep physically hidden or locked until Act 2

    {
        id:    "forged_document",
        label: "Transfer Document — [Date]",
        act:   2,
        qr:    "THORESON:Legal",           // Skill-gated — Legal skill required
        notes: "Physical prop: Printed document with forged signature. High impact item — display prominently when revealed. Legal skill holder can identify the forgery."
    },

    {
        id:    "personal_letters",
        label: "Personal Letters",
        act:   2,
        qr:    "scan.html?id=personal_letters",
        notes: "Physical prop: Letters in an envelope, sealed with wax if possible. Place in a locked box revealed at Act 2."
    },

    {
        id:    "french_document",
        label: "French Letter",
        act:   2,
        qr:    "THORESON:French",          // Skill-gated — French skill required
        notes: "Physical prop: A letter written entirely in French. Only the French skill holder can read it."
    },

    // ── ACT 3 ITEMS ───────────────────────────────────────────
    // Final reveals — often behind a combination lock or sealed

    {
        id:    "last_will",
        label: "Last Will and Testament",
        act:   3,
        qr:    "scan.html?id=last_will",
        notes: "Physical prop: Formal will document. Place in lockbox. Combination revealed at Act 3 transition. Naming the secret heir triggers major reveal."
    },

    {
        id:    "birth_certificate",
        label: "Birth Certificate",
        act:   3,
        qr:    "scan.html?id=birth_certificate",
        notes: "Physical prop: Official-looking birth certificate establishing the secret heir's identity. In same lockbox as the will."
    },

    {
        id:    "killer_evidence",
        label: "[Evidence of Murder Method]",
        act:   3,
        qr:    "THORESON:Botany",          // or Medical, or whatever skill applies
        notes: "Physical prop: Whatever physical evidence confirms the murder method. Travel journal, poison residue report, etc. Found on or near the killer character."
    },

    // ── EASTER EGGS / SIDE QUESTS ─────────────────────────────
    // Optional fun items that don't affect the main mystery

    {
        id:    "wedding_photo",
        label: "Wedding Photo",
        act:   1,
        qr:    "photo.html?id=wedding",    // Displays a photo
        notes: "Easter egg: A wedding photo hidden somewhere unexpected. Scan reveals the image. Optional fun moment."
    },

    {
        id:    "newspaper_clipping",
        label: "Newspaper Clipping",
        act:   1,
        qr:    "scan.html?id=newspaper_clipping",
        notes: "Historical newspaper clipping about an event from years ago. Sets backstory context. Can be framed on a wall."
    }

    // ── PROP CHECKLIST ─────────────────────────────────────────
    // Before the event, ensure you have:
    // □ Every item above printed and prepared
    // □ QR codes printed and attached to each prop
    // □ Act 1 items placed/accessible from the start
    // □ Act 2 items locked away or physically hidden
    // □ Act 3 items behind combination lock
    //   (Combination = a number derivable from the story,
    //    e.g. a birthdate that surfaces during Act 2)
    // □ Standalone QR codes printed for items not embedded in props
    //   (letterhead, obituary etc. that need their own scannable code)

];

// ── LOCKBOX COMBINATION ────────────────────────────────────────
// Store the combination here for reference.
// The combination should be derivable from the story —
// something players can figure out from clues gathered during Act 2.
//
// COMBINATION: [NUMBER]
// DERIVED FROM: [EXPLAIN — e.g. "The birthdate that appears in the ledger entries"]
