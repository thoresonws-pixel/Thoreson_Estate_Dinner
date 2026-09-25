// ============================================================
// items.js — Master Game Item Registry
// The Thoreson Estate · Dallas, 1935
// ============================================================
// Every physical prop, clue, container, key, and red herring
// that exists in the game gets an entry here.
//
// To add a new item:
//   1. Add an entry to the array below
//   2. Run generate-qr.js to regenerate the QR sheet
//   3. Push to GitHub
//
// FIELDS:
//   id         — unique string, used in the QR URL (?item=ID)
//   label      — short display name shown on the landing page
//   category   — "clue" | "container" | "key" | "redherring"
//   act        — 1 | 2 | 3 | null (null = present all night)
// ============================================================

// ── NOTE ON SKILL-CHECK DOCUMENTS ──────────────────────────
// The following props already have THORESON:SkillName QR codes
// printed on them. Those codes serve as their game-item signal.
// Do NOT add them here — that would create two codes per prop.
//
//   • Financial Ledger          (THORESON:Accounting)
//   • Forged Transfer Document  (THORESON:Legal)
//   • Dallas Herald Clipping    (THORESON:Journalism)
//   • Margaret's French Letter  (THORESON:French)
// ─────────────────────────────────────────────────────────────

var itemDatabase = [

  // ── CLUES ──────────────────────────────────────────────────
  // Only props that do NOT already have a skill-check QR code

  {
    id: "bradford_letter",
    label: "Legal Correspondence",
    category: "clue",
    act: 1,
  },
  {
    id: "letterhead",
    label: "Company Letterhead",
    category: "clue",
    act: 1,
  },
  {
    id: "phonograph",
    label: "Recording Device",
    category: "clue",
    act: 1,
  },
  {
    id: "calendar",
    label: "Office Calendar",
    category: "clue",
    act: 1,
  },
  {
    id: "incorporation",
    label: "Company Incorporation Filing",
    category: "clue",
    act: 1,
  },
  {
    id: "birth_certificate",
    label: "Birth Record",
    category: "clue",
    act: 2,
  },
  {
    id: "coroner_report",
    label: "Coroner's Report",
    category: "clue",
    act: 2,
  },
  {
    id: "margaret_obituary",
    label: "Newspaper Obituary",
    category: "clue",
    act: 2,
  },
  {
    id: "last_will",
    label: "Last Will & Testament",
    category: "clue",
    act: 2,
  },
  {
    id: "travel_journal",
    label: "Personal Travel Journal",
    category: "clue",
    act: 3,
  },
  {
    id: "pinkerton_report",
    label: "Investigative Report",
    category: "clue",
    act: 3,
  },

  // ── CONTAINERS ─────────────────────────────────────────────

  {
    id: "lockbox_1",
    label: "Locked Box — One",
    category: "container",
    act: null,
  },
  {
    id: "lockbox_2",
    label: "Locked Box — Two",
    category: "container",
    act: null,
  },
  {
    id: "lockbox_3",
    label: "Locked Box — Three",
    category: "container",
    act: null,
  },

  // ── KEYS ───────────────────────────────────────────────────

  {
    id: "key_1",
    label: "Key — One",
    category: "key",
    act: null,
  },
  {
    id: "key_2",
    label: "Key — Two",
    category: "key",
    act: null,
  },

  // ── RED HERRINGS ───────────────────────────────────────────
  // Add items that look like clues but aren't
  // {
  //   id: "dinner_invitation",
  //   label: "Dinner Invitation",
  //   category: "redherring",
  //   act: null,
  // },

];

// ── Computed totals (used by clue.html and dashboard) ────────

const itemTotals = {
  total: itemDatabase.length,
  clues: itemDatabase.filter(i => i.category === "clue").length,
  containers: itemDatabase.filter(i => i.category === "container").length,
  keys: itemDatabase.filter(i => i.category === "key").length,
  redherrings: itemDatabase.filter(i => i.category === "redherring").length,
};

// Number each item within its category for display (e.g. "Clue 3 of 12")
let categoryCounts = {};
itemDatabase.forEach(item => {
  if (!categoryCounts[item.category]) categoryCounts[item.category] = 0;
  categoryCounts[item.category]++;
  item._number = categoryCounts[item.category];
});

if (typeof module !== "undefined") module.exports = { itemDatabase, itemTotals };
