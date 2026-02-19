// SKILLS DATABASE — Thoreson Estate Murder Mystery
// Each skill has:
//   title: Display name
//   password: QR page password (currently "open" for testing)
//   lockedTitle: What the QR page shows before unlocking
//   lockedSubtitle: Hint text on the locked page
//   errorMsg: Wrong password message
//   badge: Skill badge label
//   summary: Short text for dashboard Discoveries page (everyone sees this after QR unlock)
//   expert: Full HTML analysis shown on QR page after password entry (expert reads aloud)

const skillsDatabase = {

    "Accounting": {
        title: "Financial Ledger Analysis",
        password: "open",
        lockedTitle: "Financial Records",
        lockedSubtitle: "This ledger requires expert examination",
        errorMsg: "Incorrect password. Find someone with the proper expertise.",
        badge: "Financial Analysis",
        header: "Thoreson Toys Ledger — Expert Findings",
        summary: "The ledger contains secret monthly payments of $50 to someone listed only as <strong>'T.H.'</strong> — going back to 1911. The payments were authorized personally by Will, bypassing normal accounting. Over 24 years of hidden disbursements to an unknown recipient.",
        expert: `
            <p>I've conducted a thorough review of the 1934 financial ledger for Thoreson Toys. On the surface, the books appear orderly — routine vendor payments, service fees, equipment maintenance, and quarterly sales revenue deposits. The company appears profitable, with a healthy year-end balance.</p>
            
            <p>However, buried among the legitimate entries is a recurring anomaly that would be invisible to an untrained eye:</p>
            
            <div class="reveal-highlight">
                On the 5th of every month, there is a payment of exactly $50.00 listed as "Monthly Disbursement — T.H." This payment has no corresponding invoice, no vendor record, and no business justification anywhere in these books. It appears in every single month without exception.
            </div>
            
            <p>This is deeply irregular. In proper bookkeeping, every disbursement must be tied to a payee, a purchase order, or an account. Using only initials — "T.H." — is a deliberate attempt to obscure the identity of the recipient. Furthermore, these payments are authorized personally by W. Thoreson himself, bypassing the normal approval chain entirely.</p>

            <p>Cross-referencing with the ledger's date entries, these payments appear to have been ongoing since at least 1911 — over twenty-four years of secret monthly payments to someone William Thoreson did not want anyone to know about.</p>
            
            <div class="reveal-highlight">
                This is not a business expense. Fifty dollars a month, paid without fail for over two decades, personally authorized and deliberately hidden — this is a private obligation. Whoever "T.H." is, William Thoreson has been supporting them in secret for a very long time.
            </div>
            
            <p><strong>Recommendation:</strong> Determine the identity of "T.H." — the initials may refer to a person, possibly someone connected to the Thoreson family. The consistency and secrecy of these payments suggest a deeply personal matter — a debt, an obligation, or someone he felt responsible for.</p>
        `
    },

    "Botany": {
        title: "Wolfsbane Identified",
        password: "open",
        lockedTitle: "Botanical Inquiry",
        lockedSubtitle: "This requires knowledge of plants and herbology",
        errorMsg: "Incorrect password. Find someone with botanical knowledge.",
        badge: "Botanical Analysis",
        header: "Regarding Wolfsbane (Aconitum) — Expert Report",
        summary: "Wolfsbane (Aconitum) is one of the deadliest plants in the world. It does <strong>not grow in Texas</strong> — it requires the cool mountain climates of the <strong>Swiss Alps</strong>. Someone would have had to travel to Europe to obtain it.",
        expert: `
            <p>If the toxicology report indicates Aconitine as the cause of death, then we are dealing with one of the most dangerous plants known to science. Wolfsbane — also called Monkshood or Aconitum — has been used as a poison for centuries, dating back to ancient Greece and Rome.</p>
            
            <div class="reveal-highlight">
                The plant produces Aconitine, an extraordinarily potent alkaloid toxin. All parts of the plant are poisonous, but the roots contain the highest concentration. Even handling the plant with bare hands can cause tingling and numbness. A lethal dose can be extracted by drying and grinding the root into a fine powder — easily dissolved into food or drink without detection.
            </div>
            
            <p>Here is the critical detail: Wolfsbane does <strong>not grow in Texas</strong>, nor anywhere in the American South or Southwest. It requires cool, moist, mountainous climates with rich soil — conditions found at higher elevations in temperate Europe.</p>
            
            <div class="reveal-highlight">
                The primary natural habitat for Wolfsbane is the <strong>European Alps</strong> — specifically the mountain regions of <strong>Switzerland, Austria, and Northern Italy</strong>. It grows wild along hiking trails, in alpine meadows, and near mountain streams. It is distinctive, with tall purple hooded flowers, and anyone with botanical knowledge would recognize it immediately.
            </div>
            
            <p>This poison cannot be purchased commercially and is not found in any apothecary. Someone would need to physically travel to the Alpine regions of Europe, identify the plant in the wild, and harvest the roots themselves — or have a knowledgeable contact willing to do so.</p>

            <p><strong>The question is clear:</strong> Has anyone in this household recently traveled to the Swiss Alps, or had reason to be in that part of Europe?</p>
        `
    },

    "French": {
        title: "Margaret's Letter (Translated)",
        password: "open",
        lockedTitle: "French Correspondence",
        lockedSubtitle: "This letter is written entirely in French",
        errorMsg: "Incorrect password. Find someone who speaks French.",
        badge: "French Translation",
        header: "Letter from Margaret Hartley to William Thoreson",
        summary: "A letter from Margaret Hartley to Will, written in French. She pleads with him to support <strong>both children</strong> — not just his own. She mentions a safe in the study with combination <strong>9-12-11</strong>, containing documents about the children's true parentage.",
        expert: `
            <p>This letter was written in French — likely deliberately, so that only someone educated abroad would be able to read it. The tone is deeply personal, angry, and accusatory. Here is the full translation:</p>
            
            <div class="letter-text">
                "William,<br><br>
                You always kept your secrets locked away. Just like that safe in your study closet. I know you have a heart in there somewhere. Even though you showed no heart when you sent me away.<br><br>
                I wonder — does the combination reveal how you truly felt?<br><br>
                I had two children to raise. TWO. One was Robert's. One was yours. You knew this. You saw them both.<br><br>
                But you only helped one of them. You set up a trust for YOUR child and left Robert's daughter with nothing. She was fourteen years old when her father died. She needed you. WE needed you.<br><br>
                I have kept your secret all these years. But secrets have a way of coming out.<br><br>
                — Margaret"
            </div>

            <p>Several critical details emerge from this letter. First, Margaret confirms that she had <strong>two children</strong> — one fathered by her husband Robert Hartley, and one fathered by William Thoreson during their affair. Will set up a trust fund for his own child but completely abandoned Robert's daughter, who was only fourteen when her father died.</p>
            
            <div class="reveal-highlight">
                Margaret also references a <strong>safe in the study closet</strong>. She hints that the combination is emotionally significant to Will — possibly a date or number tied to the children. This safe may contain documents about the children's true identities.
            </div>
        `
    },

    "Investigation": {
        title: "Background Check — Miranda",
        password: "open",
        lockedTitle: "Background Report",
        lockedSubtitle: "This document requires investigative expertise to interpret",
        errorMsg: "Incorrect password. Find someone with investigative skills.",
        badge: "Background Investigation",
        header: "Subject: Miranda Longfellow — Background Report",
        summary: "Miranda Longfellow's identity is fabricated. Her real name is <strong>Miranda Hartley</strong> — daughter of Robert Hartley, Will's original business partner. She changed her name and has been working as Scott's legal assistant for nearly <strong>ten years</strong>.",
        expert: `
            <p>I ran a thorough background check on Miranda Longfellow, currently employed as legal assistant to Scott Thoreson Jr. The results are alarming — her entire identity appears to be fabricated.</p>
            
            <div class="reveal-danger">
                There is no record of a "Miranda Longfellow" existing prior to 1920. No birth certificate, no school enrollment records, no family connections, no employment history. The identity was created from whole cloth — someone deliberately constructed a new name and background to conceal who they really are.
            </div>
            
            <p>I cross-referenced physical descriptions, approximate age, and known associates against Dallas County records from the relevant period. One match came back with near certainty:</p>
            
            <div class="reveal-highlight">
                A "Miranda Hartley" was born June 3, 1896, in Dallas, Texas. Father: <strong>Robert Hartley</strong>. Mother: <strong>Margaret Hartley</strong>. Robert Hartley was William Thoreson's original business partner — the same man whose company was allegedly stolen through forged documents.
            </div>
            
            <p>The timeline is damning. Miranda Hartley was fourteen years old when her father died and the company was taken. At some point in 1920, she assumed the name "Longfellow" and began building a new identity. She applied for a position with Scott Thoreson's law practice and has been working as his legal assistant for nearly <strong>ten years</strong> — with direct access to family documents, financial records, and the inner workings of the Thoreson household.</p>
            
            <div class="reveal-danger">
                Miranda Hartley is the daughter of the man whose company was stolen and whose death was never properly investigated. She has been hiding in plain sight inside the Thoreson family for a decade. The question is: why?
            </div>
        `
    },

    "Legal": {
        title: "Forged Transfer Documents",
        password: "open",
        lockedTitle: "Legal Document",
        lockedSubtitle: "This document requires legal expertise to examine",
        errorMsg: "Incorrect password. Find someone with legal knowledge.",
        badge: "Legal Analysis",
        header: "Certificate of Transfer — Expert Findings",
        summary: "The company ownership transfer from Robert Hartley to Will Thoreson is <strong>fraudulent</strong>. Robert's signature doesn't match known samples, the document is dated one day before Robert's death, and the notary 'James Crawford' has no record in Dallas County.",
        expert: `
            <p>I've examined this ownership transfer document purporting to convey Robert Hartley's fifty-percent stake in the company to William Thoreson. At first glance it appears to be a standard business transfer, but upon closer inspection, there are multiple red flags that call its legitimacy into serious question.</p>
            
            <div class="reveal-highlight">
                The signature attributed to Robert Hartley is forged. The pen strokes are hesitant and show signs of tracing — inconsistent with someone's natural handwriting. The ink also appears slightly different in color and weight from the body of the document, suggesting it was added at a different time, possibly after the document was drafted.
            </div>
            
            <p>The timing is deeply suspicious. The document is dated <strong>March 14, 1910</strong> — exactly one day before Robert Hartley's death. A man transferring his entire stake in a profitable company the day before he dies, with no apparent consideration or payment recorded? That defies all standard business practice.</p>

            <p>I also attempted to verify the witness. The document bears the signature of "James Crawford, Notary Public." However, there is no record of any James Crawford serving as a licensed notary in Dallas County during this period. The notary seal, upon close examination, appears hand-stamped rather than embossed — another indication of fabrication.</p>
            
            <div class="reveal-highlight">
                In my professional opinion, this document is fraudulent. Robert Hartley did not willingly sign over his company. Someone — almost certainly William Thoreson — forged this transfer to seize full ownership of what was originally a shared business. This was theft.
            </div>
        `
    },

    "Medical": {
        title: "Autopsy — Cause of Death",
        password: "open",
        lockedTitle: "Medical Report",
        lockedSubtitle: "This document requires medical expertise to interpret",
        errorMsg: "Incorrect password. Find someone with medical knowledge.",
        badge: "Medical Analysis",
        header: "Preliminary Autopsy Report — William Thoreson Sr.",
        summary: "Will died of acute <strong>Aconitine poisoning</strong> — a toxin from Wolfsbane. It was administered orally, likely in food or drink. Symptoms include numbness, weakness, and cardiac arrest within 2-6 hours. <strong>This was murder.</strong>",
        expert: `
            <p>I've reviewed the preliminary autopsy findings in detail. The external examination showed no signs of trauma, struggle, or forced ingestion — which initially supported the assumption of natural causes. However, the toxicology results tell a very different story.</p>
            
            <div class="reveal-danger">
                Cause of Death: Acute poisoning. Toxicology indicates the presence of <strong>Aconitine</strong> — a lethal alkaloid derived from the plant Aconitum, commonly known as <strong>Wolfsbane</strong> or <strong>Monkshood</strong>. Concentration levels in the blood are consistent with a single, deliberate oral dose.
            </div>
            
            <p>Aconitine is extraordinarily dangerous — among the most potent plant-based poisons known to medicine. It disrupts sodium channels in nerve and heart tissue, causing progressive paralysis of the cardiac muscle. Based on the concentration found, the victim would have experienced initial tingling or numbness in the mouth and throat within minutes of ingestion, followed by increasing weakness, nausea, and a sense of dread. Within two to six hours, complete cardiac arrest.</p>
            
            <div class="reveal-highlight">
                This was not natural causes. This was not an accident. The dose was precise and deliberate — someone with knowledge of the poison administered it orally, almost certainly dissolved into food or drink. William Thoreson was murdered.
            </div>
            
            <p>One additional note of medical significance: Aconitine leaves very little trace and is easily missed in a standard examination. Had this autopsy not included a full toxicology panel, the death would likely have been ruled cardiac failure. Whoever chose this poison knew exactly what they were doing.</p>
            
            <p><strong>Note:</strong> Aconitine is derived from Wolfsbane, a plant that grows wild in the mountainous regions of Europe — particularly the Alps of Switzerland, Austria, and Northern Italy.</p>
        `
    },

    "Bartender": {
        title: "Cocktail Recipes",
        password: null,
        badge: "Bartender",
        header: "Evening Cocktail Menu",
        summary: "<strong>The Manhattan</strong> — 2 oz whiskey, 1 oz sweet vermouth, 2 dashes Angostura. Stir with ice, strain, garnish cherry.<br><br><strong>The Martini</strong> — 2.5 oz gin, 0.5 oz dry vermouth. Stir with ice, strain, garnish olive or twist.<br><br><strong>The Daiquiri</strong> — 2 oz rum, 1 oz fresh lime juice, 0.75 oz simple syrup. Shake with ice, strain.<br><br><strong>The Sidecar</strong> — 1.5 oz cognac, 1 oz Cointreau, 0.75 oz fresh lemon juice. Shake with ice, strain, garnish twist.<br><br><strong>Champagne</strong> — Serve chilled.",
        expert: null
    }
};
