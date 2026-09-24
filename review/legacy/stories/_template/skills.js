// ============================================================
// THOR'S MURDER MYSTERIES — SKILLS DATABASE TEMPLATE
// ============================================================
// HOW TO USE THIS TEMPLATE:
//   Skills gate QR code content. When a player scans a QR code,
//   the app checks if their character has the required skill.
//   If yes → they see the expert content.
//   If no  → they see "this document requires [skill] expertise."
//
// ASSIGNING SKILLS TO CHARACTERS:
//   Add the skill name to hiddenSkills[] in characters.js.
//   Use the exact same string as the key here.
//   Skills are NEVER shown to players — they're invisible gates.
//
// QR CODE FORMAT:
//   QR codes are plain text: THORESON:SkillName
//   (Replace THORESON with your story's prefix if desired,
//    but keep it consistent with onScanSuccess in the dashboard)
//
// SKILL CONTENT STRUCTURE:
//   badge:   Short label shown in the skill modal header
//   header:  Title of the modal
//   expert:  Full expert analysis — HTML allowed
//            This is what the skilled player sees after scanning.
//            Write as if the character is using their professional
//            knowledge to analyze the document.
//
// AUTO-TRIGGER SKILLS:
//   Some skills can fire automatically when a revelation is toggled,
//   without requiring a QR scan. This is configured in
//   authenticated-dashboard.html → checkForNewMemories() →
//   skillAutoTriggers object.
//   Example: when 'wolfsbane' revelation fires → Botany auto-triggers
//   Update that object to match your story's skills and revelations.
//
// STORY: STORY_NAME
// SETTING: CITY, YEAR
// ============================================================

const skillsDatabase = {

    // ── MEDICAL ────────────────────────────────────────────────
    // Triggered by: autopsy report QR code (THORESON:Medical)
    // Assigned to: the character with medical training
    "Medical": {
        badge:  "Medical Analysis",
        header: "Autopsy Report — Expert Interpretation",
        expert: `
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">Cause of Death:</strong>
                [Describe the cause of death as a medical professional would interpret it
                from an autopsy report. Be specific — time of death, symptoms, what the
                toxicology suggests even before the full results are back.]
            </p>
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">Significant Findings:</strong>
                [What does the medical expert notice that a layperson wouldn't?
                Lividity, temperature, specific indicators of the method used.]
            </p>
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">Professional Assessment:</strong>
                [The expert's conclusion. What can they say with confidence?
                What remains uncertain pending full toxicology?]
            </p>
            <p style="margin-bottom:0; font-size:13px; color:#8b8b8b; font-style:italic;">
                Time of death and cause require further confirmation, but the evidence
                strongly suggests [summary conclusion].
            </p>
        `
    },

    // ── BOTANY ─────────────────────────────────────────────────
    // Triggered by: plant/poison evidence QR code (THORESON:Botany)
    // OR auto-triggered when the murder_method revelation fires
    // Assigned to: the character with botanical expertise
    "Botany": {
        badge:  "Botanical Analysis",
        header: "Plant Identification — Expert Analysis",
        expert: `
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">Identification:</strong>
                [Name and description of the plant/substance. Scientific name,
                common name, physical characteristics.]
            </p>
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">Toxicology:</strong>
                [How it works as a poison. Onset time, symptoms, lethality.
                How it would appear in an autopsy.]
            </p>
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">Geographic Origin:</strong>
                [Where this plant grows. This should narrow the geography significantly
                and point toward wherever the killer traveled.]
            </p>
            <p style="margin-bottom:0; font-size:13px; color:#c9a227; font-style:italic;">
                This plant does not grow locally. Its presence here is not an accident.
            </p>
        `
    },

    // ── ACCOUNTING ─────────────────────────────────────────────
    // Triggered by: financial ledger QR code (THORESON:Accounting)
    // Assigned to: the character with accounting expertise
    "Accounting": {
        badge:  "Financial Analysis",
        header: "Ledger — Expert Interpretation",
        expert: `
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">What the Numbers Show:</strong>
                [What does the accountant see in the ledger that others would miss?
                Irregularities, patterns, the story the numbers are telling.]
            </p>
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">The Hidden Pattern:</strong>
                [The specific entry, date range, or account that reveals the secret.
                Be concrete — amounts, dates, initials if applicable.]
            </p>
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">Professional Conclusion:</strong>
                [What this means. Who has been paying whom, for how long, and why
                someone would want to hide this.]
            </p>
            <p style="margin-bottom:0; font-size:13px; color:#c9a227; font-style:italic;">
                These books were kept to conceal. Now they reveal.
            </p>
        `
    },

    // ── BANKING ────────────────────────────────────────────────
    // Triggered by: bank statement / financial document QR (THORESON:Banking)
    // Assigned to: the character with banking expertise
    "Banking": {
        badge:  "Banking Analysis",
        header: "Bank Statement — Expert Interpretation",
        expert: `
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">Account Structure:</strong>
                [How were these accounts set up? What does a banker see that
                suggests concealment or irregular structure?]
            </p>
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">Transaction History:</strong>
                [What do the transactions reveal? Patterns, timing, recipients.]
            </p>
            <p style="margin-bottom:0; font-size:13px; color:#c9a227; font-style:italic;">
                Forty years in banking. This is not how clean money moves.
            </p>
        `
    },

    // ── LEGAL ──────────────────────────────────────────────────
    // Triggered by: legal documents QR code (THORESON:Legal)
    // Assigned to: the character with legal expertise
    // NOTE: In Thoreson Estate Dinner, this is the KILLER's skill —
    // giving them a reason to handle documents without suspicion.
    "Legal": {
        badge:  "Legal Analysis",
        header: "Legal Document — Expert Interpretation",
        expert: `
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">Document Assessment:</strong>
                [What does the legal expert see? Is it properly executed?
                What are the implications if authentic — or forged?]
            </p>
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">Legal Significance:</strong>
                [What does this document mean in legal terms? Rights, claims,
                liabilities, implications for the estate or company.]
            </p>
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">What This Changes:</strong>
                [The practical consequence of this document's existence.
                Who benefits. Who is harmed. What it proves.]
            </p>
        `
    },

    // ── BARTENDER ──────────────────────────────────────────────
    // Triggered by: drink / bar area QR code (THORESON:Bartender)
    // Assigned to: the character tending bar / handling drinks
    // This skill is uniquely positioned to discover how poison was delivered
    "Bartender": {
        badge:  "Bartender's Observation",
        header: "The Bar — What You Noticed",
        expert: `
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">What You Observed:</strong>
                [The bartender notices things others don't — who ordered what,
                who lingered near the bar, anything unusual about a drink or
                a glass that was prepared.]
            </p>
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">The Detail That Matters:</strong>
                [One specific observation — a taste, a smell, a person who
                was near the drinks at the wrong time — that narrows things down.]
            </p>
            <p style="margin-bottom:0; font-size:13px; color:#c9a227; font-style:italic;">
                [Closing observation that points toward the killer or method
                without being explicit.]
            </p>
        `
    },

    // ── FRENCH ─────────────────────────────────────────────────
    // Triggered by: French-language document QR code (THORESON:French)
    // Assigned to: the character fluent in French
    "French": {
        badge:  "French Translation",
        header: "French Document — Translation",
        expert: `
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">Translation:</strong>
                [Full translation of the French document. Written as if the
                character is reading and translating in real time.]
            </p>
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">Context:</strong>
                [What this document is, where it came from, and why the
                fact that it was written in French is significant.]
            </p>
            <p style="margin-bottom:0; font-size:13px; color:#c9a227; font-style:italic;">
                [What the translation reveals — and what it implies about
                who wrote it and why.]
            </p>
        `
    },

    // ── JOURNALISM ─────────────────────────────────────────────
    // Triggered by: press credentials / newspaper archive QR (THORESON:Journalism)
    // Assigned to: the journalist character(s)
    "Journalism": {
        badge:  "Journalist's Analysis",
        header: "Press Archive — Expert Reading",
        expert: `
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">What the Record Shows:</strong>
                [What does the journalist find in the public record that
                others wouldn't know to look for? News archives, court
                records, published announcements.]
            </p>
            <p style="margin-bottom:14px; font-size:15px; line-height:1.8;">
                <strong style="color:#c9a227;">What Was Missing:</strong>
                [The story that should have been covered but wasn't.
                The silence in the public record that itself tells a story.]
            </p>
            <p style="margin-bottom:0; font-size:13px; color:#c9a227; font-style:italic;">
                [The journalist's professional conclusion about what
                someone worked to keep out of the newspapers — and why.]
            </p>
        `
    }

    // ── ADD MORE SKILLS AS NEEDED ─────────────────────────────
    // Copy any block above and modify.
    // Remember to:
    //   1. Add the skill name to hiddenSkills[] in characters.js
    //   2. Create a QR code: plain text "THORESON:SkillName"
    //   3. If it should auto-trigger, add to skillAutoTriggers
    //      in authenticated-dashboard.html

};
