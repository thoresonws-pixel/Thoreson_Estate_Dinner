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

var skillsDatabase = {

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


    "French": {
        title: "Margaret's Letter (Translated)",
        password: "open",
        lockedTitle: "French Correspondence",
        lockedSubtitle: "This letter is written entirely in French",
        errorMsg: "Incorrect password. Find someone who speaks French.",
        badge: "French Translation",
        header: "Letter from Margaret Hartley to William Thoreson",
        summary: "A letter from Margaret Hartley to Will, written in French. She confronts him over the secrets he kept and the people he abandoned. She mentions a safe in the study with a combination that meant something to him.",
        expert: `
            <p>This letter was written in French — likely deliberately, so that only someone educated abroad would be able to read it. The tone is deeply personal, angry, and accusatory. Here is the full translation:</p>
            
            <div class="letter-text">
                "June 4th, 1914<br><br>
                William,<br><br>
                You always kept your secrets locked away. Just like that safe in your hallway closet. I know you have a heart in there somewhere. Even though you showed no heart when you sent me away.<br><br>
                I wonder — does the combination reveal how you truly felt? Our son turned three this past March and you were not there. You locked his birthday behind steel and numbers because you could not bring yourself to forget it, and you could not bring yourself to claim it.<br><br>
                Our son deserved a father. You gave him money and a name on a trust document and nothing else. He will grow up not knowing who he is because you decided your reputation mattered more than his life.<br><br>
                I have given everything to keep him safe. You have given nothing but silence and a monthly check.<br><br>
                I have kept your secret all these years. But secrets have a way of rising to the surface, William. Especially yours.<br><br>
                — Margaret"
            </div>

            <p>Margaret is furious — and grief-stricken. She confronts Will directly over their child — a son he funded privately but refused to acknowledge. Will chose secrecy over fatherhood.</p>
            
            <div class="reveal-highlight">
                Margaret references a <strong>safe in the hallway closet</strong>. The letter is dated June 1914. She says their son <strong>turned three this past March</strong>. Three years old in March 1914 means the child was born in <strong>March 1911</strong>. The combination is his birthday — we just need the exact day.
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
            
            <p>The timing is deeply suspicious. The document is dated <strong>March 13, 1910</strong> — two days before Robert Hartley's death. A man transferring his entire stake in a profitable company two days before he dies, with no apparent consideration or payment recorded? That defies all standard business practice.</p>

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

    "Banking": {
        title: "Bank Statement Analysis — Kessler & Braun Investment",
        password: "open",
        lockedTitle: "Bank Records",
        lockedSubtitle: "These financial records require banking expertise to interpret",
        errorMsg: "Incorrect password. Find someone with banking experience.",
        badge: "Banking Analysis",
        header: "Thoreson Toys — Capital Account Review, 1934",
        summary: "An $8,000 wire transfer was sent to Kessler & Braun European Distributors in Hamburg for an overseas expansion deal. The company dissolved within six weeks — total loss. Two outside investors had money in Thoreson Toys when it happened.",
        expert: `
            <p>I've been looking over the Thoreson Toys bank statements. Most of this is what you'd expect — weekly sales deposits, payroll, vendor payments. The company's been running steady for years. But a few things caught my eye.</p>
            
            <div class="reveal-highlight">
                First — right at the top of the statement, January 2nd. Two outside investors deposited money into the company account. <strong>Investor Account 7714-A put in $3,000</strong> and <strong>Investor Account 7722-B put in $2,500</strong>. That's $5,500 of other people's money that Will was managing.
            </div>
            
            <p>Then in March, there's a wire transfer for <strong>$8,000</strong> sent to a company called <strong>Kessler & Braun European Distributors</strong> out of Hamburg, Germany. Looks like Will was trying to break into overseas markets — European toy distribution. That's a big swing for a company this size. The account dropped from $22,000 down to about $14,000 overnight.</p>
            
            <p>Six weeks later, Kessler & Braun's account was dissolved. There's a write-down on the books for the full $8,000 — total loss. No recovered funds, nothing coming back. Just gone.</p>
            
            <div class="reveal-danger">
                Now here's where it gets interesting. After the loss hit the books, both of those investor accounts went quiet. No additional deposits. No withdrawals. Just silence. Somebody lost real money because of Will's decision, and Will never made it right. He just kept running the company as if nothing happened.
            </div>
            
            <p><strong>The question is — who are these two investors, and are they here tonight?</strong></p>
        `
    },

    "Bartender": {
        title: "Cocktail Recipes",
        password: null,
        badge: "Bartender",
        header: "Evening Cocktail Menu",
        summary: "<strong>Old Fashioned</strong> — 2 oz whiskey, 1 sugar cube, 2 dashes Angostura bitters, orange peel. Muddle sugar and bitters, add whiskey and ice, stir, garnish with orange peel.<br><br><strong>Gin Rickey</strong> — 2 oz gin, 0.75 oz fresh lime juice, soda water. Build over ice, top with soda, garnish with lime.<br><br><strong>Bee's Knees</strong> — 2 oz gin, 0.75 oz fresh lemon juice, 0.75 oz honey syrup. Shake with ice, strain.<br><br><strong>Cuba Libre</strong> — 2 oz rum, cola, fresh lime juice. Build over ice, top with cola, squeeze of lime.<br><br><strong>Temperance Options</strong> — Shirley Temple (ginger ale, grenadine, cherry) &nbsp;·&nbsp; Virgin Cuba Libre (cola, lime) &nbsp;·&nbsp; Sparkling mineral water with lemon or lime.",
        expert: null
    },

    "Botany": {
        title: "Botanical Analysis — Wolfsbane",
        password: "open",
        lockedTitle: "Plant Specimen",
        lockedSubtitle: "This requires botanical expertise to identify",
        errorMsg: "Incorrect password.",
        badge: "Botanical Analysis",
        header: "Field Notes — Aconitum (Wolfsbane / Monkshood)",
        summary: "The poison is <strong>Aconitine</strong>, derived from <strong>Wolfsbane</strong> — <em>Aconitum napellus</em>. This plant does not grow in Texas or anywhere in North America. It is native to the Alpine regions of Europe. Whoever used this poison <strong>traveled to obtain it deliberately</strong>.",
        expert: `
            <div class="reveal-danger">
                Genus: <strong>Aconitum</strong> — Family Ranunculaceae. Common names: Wolfsbane, Monkshood, Devil's Helmet. Every part of this plant is lethally toxic. The roots contain the highest concentration of aconitine, but the flowers, leaves, and stems are equally dangerous if handled carelessly or ingested.
            </div>

            <p>I have known this plant since childhood. My grandmother kept a botanical encyclopedia and made me memorize the most dangerous specimens before I was allowed in the garden unsupervised. Aconitum was at the top of the list — she called it the queen of poisons, a name it has carried since antiquity. The ancient Romans used it for executions. Medieval assassins favored it. It has been killing people, accidentally and deliberately, for two thousand years.</p>

            <p>The active compound, <strong>aconitine</strong>, works by binding irreversibly to sodium channels in nerve and cardiac tissue. It does not announce itself. The initial symptoms — numbness at the lips and tongue, a metallic taste, mild warmth — are easily mistaken for indigestion or anxiety. Within thirty minutes to an hour, the numbness spreads. The victim's hands and face begin to feel detached. Breathing becomes labored. The heart, which relies on those same sodium channels to regulate its rhythm, begins to fail. Death typically follows within two to six hours of ingestion, and it looks, to the untrained eye, like a heart attack.</p>

            <div class="reveal-highlight">
                This is not a plant you stumble upon in a Dallas garden. <strong>Aconitum does not grow in Texas. It does not grow anywhere in North America.</strong> It is native to mountain meadows at high elevation — the Swiss Alps, the Austrian highlands, the Pyrenees. The flowers are distinctive: deep violet-blue, hooded, unmistakably beautiful. A person would have to travel to those regions, recognize the plant, harvest it deliberately, and transport the extract home. This was not opportunistic. This required planning months in advance.
            </div>

            <p>The method of administration almost certainly involved the extract dissolved into food or drink — something with a strong enough flavor to mask the initial bitterness. A cocktail. A rich sauce. Something with sweetness or acid. The victim would have noticed nothing unusual until the symptoms were already well underway.</p>

            <p>One final note: aconitine is notoriously difficult to detect in a standard post-mortem examination. Without a toxicologist specifically looking for alkaloid poisoning, this death would have been recorded as cardiac failure. Whoever chose this poison knew that. This was chosen by someone with patience, knowledge, and access to Alpine Europe.</p>
        `
    },

    "Journalism": {
        title: "Newspaper Article — Hartley Death",
        password: "open",
        lockedTitle: "Newspaper Clipping",
        lockedSubtitle: "A trained journalist might notice things others would miss",
        errorMsg: "Incorrect password. Find someone with journalism experience.",
        badge: "Journalism Analysis",
        header: "Editorial Review — Dallas Herald, March 22, 1910",
        summary: "This article has problems. The investigation was closed in under 24 hours despite a <strong>suspicious business transfer the day before</strong>. The sourcing is thin and Thoreson's quote sounds rehearsed. Someone with influence shaped this story.",
        expert: `
            <p>I've read a lot of newspaper copy in my career. This article is wrong in ways that only a journalist would notice.</p>

            <div class="reveal-highlight">
                First — the timeline. Robert Hartley was found dead on March 15th, 1910. The investigation was opened and closed by March 22nd. That's seven days to investigate the death of a prominent businessman with an active partnership dispute. No coroner's inquest mentioned. No witness testimony cited. No follow-up promised. That is not thorough reporting — that is a story someone wanted finished.
            </div>

            <p>Second — the sourcing. The only named source in this article is William Thoreson himself. His quote reads like it was prepared in advance: measured, sympathetic, careful. There's no quote from the police investigator, no comment from Hartley's family, no statement from anyone at the company. A real reporter would have talked to at least three people. This reporter talked to one — the man who stood to benefit most from Hartley's death.</p>

            <div class="reveal-danger">
                Third — and this is the part that should trouble everyone in this room — the article makes no mention of the ownership transfer document filed two days before Robert died. March 13th: Robert's entire stake in the company is signed over to Thoreson. March 15th: Robert is dead. Any competent journalist would have connected those two facts. This one didn't. Either they weren't told, or they were told not to ask.
            </div>

            <p>Finally — the framing. The headline says "Thoreson Cleared." Not "Hartley Death Ruled Suicide." Not "Investigation Closed." The story is framed around Thoreson's innocence, not around what happened to Robert Hartley. That tells you who this article was written for.</p>

            <p><strong>Someone with influence shaped this coverage. The question is whether it was Thoreson himself or someone acting on his behalf.</strong></p>
        `
    }
};
