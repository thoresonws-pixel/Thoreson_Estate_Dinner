// REVELATIONS DATABASE — Thoreson Estate Murder Mystery

var revelationsDatabase = {

    "act1": {
        label: "Act 1 — The Gathering",
        items: [
            {
                id: "newspaper",
                type: "clue",
                title: "Dallas Herald — Thoreson Cleared",
                summary: "A clipping dated March 22, 1910. Reports that William Thoreson was questioned following the death of his business partner Robert Hartley, ruled a suicide. Thoreson was cleared. The company was renamed from Thoreson & Hartley Toys to Thoreson Toys. Robert Hartley's family could not be reached for comment.",
                detail: null
            },
            {
                id: "letterhead",
                type: "clue",
                title: "Company Letterhead — Thoreson & Hartley Toys",
                summary: "A piece of company letterhead bearing the name Thoreson & Hartley Toys. The current company is called Thoreson Toys — no mention of Hartley anywhere.",
                detail: null
            },
            {
                id: "bradfordLetter",
                type: "clue",
                title: "Bradford Patent Letter",
                summary: "A letter dated January 1935 from Bradford & Sons Toy Company. Thomas Bradford claims a spring-loaded mechanism in Thoreson Toys' newest line was patented by his company in 1931 and demands compensation. Will's handwritten margin note reads: 'Frivolous. Have Scott handle.'",
                detail: null
            },
            {
                id: "incorporation",
                type: "clue",
                title: "Original Incorporation Filing",
                summary: "Dallas County filing dated April 3, 1902. Lists William Thoreson and Robert Hartley as equal 50/50 partners under the name Thoreson & Hartley Toys. Both signatures present and notarized.",
                detail: null
            },
            {
                id: "forgedDocs",
                type: "clue",
                title: "Company Transfer Document",
                summary: "A transfer document dated March 13, 1910 signing Robert Hartley's full ownership over to William Thoreson. Notarized by one James Crawford. Requires a Legal expert to examine.",
                detail: null
            },
            {
                id: "bankStatement",
                type: "clue",
                title: "Bank Statement — Thoreson Toys Capital Account",
                summary: "A 1934 bank statement for the Thoreson Toys company account. Shows two investor deposits totaling $5,500 in January, followed by an $8,000 wire transfer to Kessler & Braun European Distributors in Hamburg in March. The account dropped from $22,000 to $14,000 overnight. Requires Banking expertise to fully analyze.",
                detail: null
            },
            {
                id: "transcriptAct1",
                type: "story",
                title: "Confession Recording — Transcript",
                summary: `I need to confess something. Before it's too late. I don't know how much time I have left. So I'm recording this. For my family. For the truth. Robert Hartley was my partner. He was my closest friend. We built that company together. Thoreson & Hartley Toys. And I betrayed him.\n\n[static]\n\nI am not a good man. Robert found out.\n\n[static]\n\nHe was furious. Rightfully so. He came to me and said he would pull every dollar he had out of the company. That he'd burn it to the ground before he'd let me profit from it. He said I'd taken everything from him. And he was right. So I acted first. I forged his signature on a transfer document. I took the company. Everything Robert had built — I put it in my name before he could destroy it. I told myself I was protecting the business. That was a lie. I was protecting myself. Robert died the next day. I took his company.\n\n[static]\n\nIt broke him. They ruled it a suicide. But I know what really killed Robert Hartley. It was me.\n\n[static]\n\nAfter Robert died,\n\n[static]\n\nI didn't want anyone to know what I'd done.\n\n[static]\n\nThat was my doing. I've carried this guilt for twenty-five years. But tonight,\n\n[static]\n\nThough God knows I don't deserve it.\n\n[static]\n\nIt's time to tell the truth. I only pray it isn't too late.`,
                detail: null,
                transcriptSlot: true
            },
            {
                id: "stolenCompany",
                type: "story",
                title: "The Stolen Company",
                summary: "The transfer document has been examined. The signature is forged — Robert Hartley never signed it. The notary James Crawford does not appear in Dallas County records.",
                detail: null
            },
        ]
    },

    "act2": {
        label: "Act 2 — The Secret Heir",
        items: [
            {
                id: "ledger",
                type: "clue",
                title: "Financial Ledger",
                summary: "Company financial ledger going back to 1911. Contains a recurring monthly entry of $50 listed as 'Monthly Disbursement — T.H.' — appearing every month for over 24 years. Requires an Accounting expert to examine.",
                detail: null
            },
            {
                id: "margaretsLetter",
                type: "clue",
                title: "Margaret's Letter",
                summary: "A letter written entirely in French, addressed to William Thoreson and signed by Margaret. Requires a French speaker to translate.",
                detail: null
            },
            {
                id: "birthCertificate",
                type: "clue",
                title: "Birth Certificate — Taylor Hartley",
                summary: "Dallas County birth certificate. Name: Taylor Hartley. Date of birth: March 5, 1911. Mother: Margaret Hartley. Father: William S. Thoreson. Registered March 11, 1911. County Clerk: Edgar T. Calloway.",
                detail: null
            },
            {
                id: "margaretDeath",
                type: "clue",
                title: "Newspaper — Margaret Hartley Obituary",
                summary: "A brief obituary from a Dallas newspaper, dated October 14, 1914. Margaret Hartley, formerly of Dallas, passed away leaving behind two children. Cause of death listed as accidental overdose of laudanum. No mention of surviving family beyond the children.",
                detail: null
            },
            {
                id: "transcriptAct2",
                type: "story",
                title: "Confession Recording — Transcript",
                summary: `I need to confess something. Before it's too late. I don't know how much time I have left. So I'm recording this. For my family. For the truth. Robert Hartley was my partner. He was my closest friend. We built that company together. Thoreson & Hartley Toys. And I betrayed him. It started with Margaret. Robert's wife. I had an affair with her. Behind Robert's back. While he was still my partner, still my friend — I was going behind his back with the woman he loved.\n\nI am not a good man. Robert found out. About Margaret and me.\n\nHe was furious. Rightfully so. He came to me and said he would pull every dollar he had out of the company. That he'd burn it to the ground before he'd let me profit from it. He said I'd taken everything from him. And he was right. So I acted first. I forged his signature on a transfer document. I took the company. Everything Robert had built — I put it in my name before he could destroy it. I told myself I was protecting the business. That was a lie. I was protecting myself. Robert died the next day. When he realized what I'd done — that I'd outsmarted him — he had nothing left. I took his company. I took his wife. The grief of losing everything — his company, Margaret, all of it — it broke him. They ruled it a suicide. But I know what really killed Robert Hartley. It was me.\n\nMargaret had a child. My child. I never claimed the child publicly. I was too much of a coward for that. Instead I set up a trust. Monthly payments. Fifty dollars, listed as T.H. in the ledger so nobody would ask questions. That was all I gave. Money. In secret. For twenty-five years.\n\nAfter Robert died,\n\nI didn't want anyone to know what I'd done.\n\n[static]\n\nThat was my doing. I've carried this guilt for twenty-five years. But tonight, I'm going to start making it right. I've invited Taylor here. My child. I'm going to welcome them into this family. Publicly. Finally. No more hiding. No more secret payments. No more lies.\n\n[static]\n\nThough God knows I don't deserve it.\n\n[static]\n\nIt's time to tell the truth. I only pray it isn't too late.`,
                detail: null,
                transcriptSlot: true
            },
            {
                id: "will",
                type: "clue",
                title: "Will Thoreson's Last Will & Testament",
                summary: "A will dated January 14, 1935, dividing the estate equally into three shares — one each to William Scott Thoreson Jr., Frederick Daniel Thoreson, and Taylor Hartley. Taylor Hartley is described as a recognized heir whose claim upon the estate Will acknowledges 'fully and without reservation.'",
                detail: null
            },
            {
                id: "secretHeir",
                type: "story",
                title: "The Secret Heir",
                summary: "The ledger entries, bank statement, and birth certificate have been cross-referenced. 'T.H.' refers to Taylor Hartley — a child born to Margaret Hartley in 1911, with the father listed as unknown. Will has been making private payments to an account in Taylor Hartley's name since that year.",
                detail: null
            },
        ]
    },

    "act3": {
        label: "Act 3 — The Killer",
        items: [
            {
                id: "coroner",
                type: "clue",
                title: "Coroner's Report",
                summary: "Preliminary autopsy report on William Thoreson. Notes unusual cardiac presentation. Requires a Medical expert to interpret.",
                detail: null
            },
            {
                id: "wolfsbane",
                type: "story",
                title: "The Poison Identified",
                summary: "Aconitine was found in the body of William Thoreson — confirmed by the coroner's report. Our botanist has determined that Aconitine is derived from Wolfsbane, a rare flower that grows exclusively in the Swiss Alps. It cannot be purchased or sourced in North America. Someone had to travel there to obtain it.",
                detail: null
            },
            {
                id: "travelJournal",
                type: "clue",
                title: "Miranda's Travel Journal",
                summary: "A personal journal belonging to Miranda Longfellow, covering her trip to Switzerland in summer 1934. One entry dated August 14 reads: 'The flowers in the Alps are remarkable — one of which definitely caught my eye.'",
                detail: null
            },
            {
                id: "backgroundCheck",
                type: "clue",
                title: "Pinkerton Background Check Results",
                summary: "Pinkerton report on all party guests. Two name changes flagged: Walter Lippman — legal name Taylor James Hartley, born 1911, name changed 1930. Miranda Longfellow — legal name Miranda Elaine Hartley, born 1896, name changed 1920.",
                detail: null
            },
            {
                id: "transcriptAct3",
                type: "story",
                title: "Confession Recording — Transcript",
                summary: `I need to confess something. Before it's too late. I don't know how much time I have left. So I'm recording this. For my family. For the truth. Robert Hartley was my partner. He was my closest friend. We built that company together. Thoreson & Hartley Toys. And I betrayed him. It started with Margaret. Robert's wife. I had an affair with her. Behind Robert's back. While he was still my partner, still my friend — I was going behind his back with the woman he loved.\n\nI am not a good man. Robert found out. About Margaret and me.\n\nHe was furious. Rightfully so. He came to me and said he would pull every dollar he had out of the company. That he'd burn it to the ground before he'd let me profit from it. He said I'd taken everything from him. And he was right. So I acted first. I forged his signature on a transfer document. I took the company. Everything Robert had built — I put it in my name before he could destroy it. I told myself I was protecting the business. That was a lie. I was protecting myself. Robert died the next day. When he realized what I'd done — that I'd outsmarted him — he had nothing left. I took his company. I took his wife. The grief of losing everything — his company, Margaret, all of it — it broke him. They ruled it a suicide. But I know what really killed Robert Hartley. It was me.\n\nMargaret had a child. My child. I never claimed the child publicly. I was too much of a coward for that. Instead I set up a trust. Monthly payments. Fifty dollars, listed as T.H. in the ledger so nobody would ask questions. That was all I gave. Money. In secret. For twenty-five years.\n\nAfter Robert died, Margaret came to me. She was desperate. She begged me to take care of them. She said they had no one else. I sent her — I sent them all — away. I didn't want the scandal. I didn't want anyone to know what I'd done.\n\nBut what I haven't said yet… is that Margaret didn't just have my child. She had Robert's daughter too. Miranda. Miranda was fourteen when her father died. And I could have helped her. I should have helped her. Instead I told Margaret that Miranda wasn't my responsibility. She wasn't my child. I owed her nothing.\n\nI abandoned them.\n\nMargaret died a few years later. The drink took her. And those children were left with nothing. No parents. No family. No one.\n\nThat was my doing. I've carried this guilt for twenty-five years.\n\nBut tonight, I'm going to start making it right. I've invited Taylor here. My child. I'm going to welcome them into this family. Publicly. Finally. No more hiding. No more secret payments. No more lies.\n\nAnd Miranda… if she's out there somewhere… I hope one day she can forgive me. Though God knows I don't deserve it.\n\nI destroyed that family.\n\nIt's time to tell the truth. I only pray it isn't too late.`,
                detail: null,
                transcriptSlot: true
            },
            {
                id: "mirandasIdentity",
                type: "story",
                title: "Miranda Unmasked",
                summary: "Miranda Longfellow's legal name is Miranda Hartley. She is the daughter of Robert Hartley — Will's former business partner. She changed her name in 1920 and has worked as Scott's legal assistant for the past ten years.",
                detail: null
            },

        ]
    }
};
