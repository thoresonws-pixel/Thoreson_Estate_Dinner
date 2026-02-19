// CHARACTER DATABASE — Thoreson Estate Murder Mystery
// Each character has: backstory, whatYouKnow, whatYouCanShare, howToPlay, goals, relationships

const characterDatabase = {

    // ══════════════════════════════════════════════
    // SCOTT — THE HOST / GAME MASTER
    // ══════════════════════════════════════════════
    "Scott": {
        character: "William 'Scott' Thoreson Jr.",
        backstory: "You are the eldest son of William Thoreson Sr. and Eleanor Thoreson, and the family's attorney. You studied law at SMU and built your career handling the legal affairs of several prominent Dallas families — none more important than your own. You are composed, analytical, and meticulous. Tonight, you are both a grieving son and the new patriarch of the Thoreson family. Your father invited everyone here for a 'big announcement,' but he never got to make it. Now it falls to you to find out what happened — and why.",
        whatYouKnow: [
            "Your father built Thoreson Toys from the ground up — or so you've always been told.",
            "He invited everyone here tonight for a special announcement he never got to make.",
            "Your legal assistant Miranda Longfellow has worked for you faithfully for nearly ten years.",
            "Your father seemed anxious in recent weeks — distracted, emotional, not himself.",
            "As family attorney, you have access to most of the family's legal and financial documents."
        ],
        whatYouCanShare: [
            { info: "Your father seemed different lately — anxious, like something was weighing on him.", when: "Anytime" },
            { info: "He told you he had something important to tell the family tonight, but wouldn't say what.", when: "Anytime" },
            { info: "The company has always been called Thoreson Toys. Just Thoreson. You've never heard the name 'Hartley' in connection with it.", when: "When the letterhead is found" },
            { info: "You can facilitate searches of guests if there is reasonable suspicion and group consensus.", when: "During act transitions" }
        ],
        howToPlay: "<strong>Tone:</strong> Controlled grief. Professional authority. You're hurting, but you hold yourself to a standard.<br><br><strong>Key behaviors:</strong> Ask questions rather than make accusations. Listen carefully. Take mental notes. You're a lawyer — you build cases, you don't jump to conclusions.<br><br><strong>Important:</strong> You are the game master. Your job is to keep the investigation moving. If things stall, you prompt: 'Has anyone checked the office?' or 'Can someone with financial expertise look at this?' You guide without leading.",
        goals: [
            "Find out what happened to your father",
            "Keep the investigation moving and guests engaged",
            "Maintain composure — you are the new head of this family",
            "Ask questions. Build the case. Let the evidence speak."
        ],
        relationships: [
            { name: "William Thoreson Sr.", relation: "Your father (deceased)" },
            { name: "Eleanor Thoreson", relation: "Your mother" },
            { name: "Brian Thoreson", relation: "Your younger brother" },
            { name: "Clara Thoreson", relation: "Your wife" },
            { name: "Miranda Longfellow", relation: "Your trusted legal assistant (10 years)" }
        ]
    },

    // ══════════════════════════════════════════════
    // BRIAN T — YOUNGER BROTHER
    // ══════════════════════════════════════════════
    "BrianT": {
        character: "Brian Thoreson",
        backstory: "You are the younger son of William Thoreson Sr. Where your brother Scott is meticulous and professional, you've always been more easygoing. You work loosely within the family business but have never been as driven as Scott or your father. You love your family, but you've always felt like the less important son — the one who wasn't going to carry the legacy. Tonight, you're here because your father asked you to be. You had no idea it would turn out like this.",
        whatYouKnow: [
            "Your father built Thoreson Toys and it's been the family business your whole life.",
            "Scott handles all the legal and business affairs — you've never been deeply involved.",
            "Your father mentioned he had 'something to tell the family' but you figured it was about retirement or the business.",
            "You've noticed your father seemed emotional and distracted over the past few weeks.",
            "Miranda has been Scott's assistant forever — she's practically part of the family."
        ],
        whatYouCanShare: [
            { info: "Dad seemed off lately. More emotional than usual. I figured he was just getting older.", when: "Anytime" },
            { info: "I never paid much attention to the business side. Scott handles all of that.", when: "Anytime" },
            { info: "I don't recognize the name Hartley. The company has always just been Thoreson Toys as far as I know.", when: "When letterhead is found" },
            { info: "Miranda? She's been around forever. Quiet. Reliable. Scott trusts her completely.", when: "When Miranda is discussed" }
        ],
        howToPlay: "<strong>Tone:</strong> Genuine but laid-back. You're sad about your father but you process things differently than Scott — less controlled, more open.<br><br><strong>Key behaviors:</strong> React naturally. You're not a lawyer or investigator — you're just a guy whose dad died. Ask honest questions. Express confusion when things don't make sense. You might get emotional when big revelations drop.<br><br><strong>Important:</strong> You're a good sounding board for other characters. People can bounce theories off you and you'll react honestly.",
        goals: [
            "Find out what happened to your father",
            "Support your brother Scott through this",
            "Try to understand the family secrets coming to light",
            "Be honest about what you know and don't know"
        ],
        relationships: [
            { name: "William Thoreson Sr.", relation: "Your father (deceased)" },
            { name: "Eleanor Thoreson", relation: "Your mother" },
            { name: "Scott Thoreson Jr.", relation: "Your older brother" },
            { name: "Clara Thoreson", relation: "Your sister-in-law" },
            { name: "Miranda Longfellow", relation: "Scott's assistant — practically family" }
        ]
    },

    // ══════════════════════════════════════════════
    // CLARA — SCOTT'S WIFE / BARTENDER
    // ══════════════════════════════════════════════
    "Clara": {
        character: "Clara Thoreson",
        backstory: "You are Scott's wife and a gracious hostess who keeps the household running smoothly. You married into the Thoreson family twelve years ago and have become a steady, reliable presence. Tonight you're helping manage the evening — keeping drinks flowing and guests comfortable. You know your husband is hurting, and you want to support him while making sure everyone is taken care of.",
        whatYouKnow: [
            "Your father-in-law invited everyone for a special dinner and announcement.",
            "Scott has been stressed lately — more phone calls than usual, late nights in the study.",
            "Miranda has been Scott's assistant the entire time you've known him. She's quiet but competent.",
            "You handle the social and household side of things — Scott handles the legal and business side.",
            "William Sr. seemed unusually emotional in the days before the party."
        ],
        whatYouCanShare: [
            { info: "Will seemed different this past week. Almost... guilty about something. I can't explain it.", when: "Anytime" },
            { info: "Scott trusts Miranda completely. She has access to everything in his office.", when: "When Miranda is discussed" },
            { info: "I can make anyone a drink. What would you like?", when: "Anytime (bartender role)" },
            { info: "I noticed Miranda was very calm when we got the news about Will. Almost too calm.", when: "Act 3, when suspicion builds" }
        ],
        howToPlay: "<strong>Tone:</strong> Warm, observant, steady. You're the social glue of this gathering.<br><br><strong>Key behaviors:</strong> Move around the party. Offer drinks. Make small talk. You're naturally observant — share what you notice. You're supportive of Scott but have your own perspective.<br><br><strong>Special role:</strong> You're managing the bar and helping with the video playback between acts. This gives you a natural reason to move between rooms and interact with everyone.",
        goals: [
            "Support Scott through this difficult night",
            "Keep guests comfortable and the evening running smoothly",
            "Pay attention to how people are reacting",
            "Help with the investigation where you can"
        ],
        relationships: [
            { name: "Scott Thoreson Jr.", relation: "Your husband" },
            { name: "William Thoreson Sr.", relation: "Your father-in-law (deceased)" },
            { name: "Eleanor Thoreson", relation: "Your mother-in-law" },
            { name: "Brian Thoreson", relation: "Your brother-in-law" },
            { name: "Miranda Longfellow", relation: "Scott's assistant — you see her often" }
        ]
    },

    // ══════════════════════════════════════════════
    // LEANNA — MIRANDA HARTLEY (THE KILLER)
    // ══════════════════════════════════════════════
    "Leanna": {
        character: "Miranda Longfellow",
        backstory: "You are Scott Thoreson's legal assistant — professional, competent, and discreet. You've worked for the family for nearly ten years and are trusted with sensitive documents and family matters. You traveled to Europe last summer — Switzerland, Austria, the Alps — and came back refreshed. Tonight, you're here to support Scott during the evening his father planned.",

        whatYouKnow: [
            "You have access to all of Scott's legal files and family documents.",
            "William Sr. planned a major announcement for tonight — something about 'making things right.'",
            "You've worked closely with the Thoreson family for a decade.",
            "You traveled to Switzerland and the Alps last summer.",
            "You are quiet and observant. You notice things others miss."
        ],
        whatYouCanShare: [
            { info: "Will told me he was planning something important tonight. He seemed almost... nervous about it.", when: "Anytime" },
            { info: "I've been organizing Scott's files for years. I know where most of the family documents are kept.", when: "Anytime" },
            { info: "Yes, I traveled to Switzerland last summer. It was a lovely trip — the mountains were beautiful.", when: "When asked about travel" },
            { info: "I don't know what you're implying. I've given ten years of my life to this family.", when: "When suspicion falls on you" }
        ],
        howToPlay: "<strong>Tone:</strong> Calm. Professional. Quietly helpful. You are at peace with what you've done.<br><br><strong>Key behaviors:</strong> Be polite and helpful. Move naturally through the party. Help people find clues — you <em>want</em> the truth to come out. Don't volunteer information, but don't be evasive either. When directly asked something, answer simply and honestly (about your public persona).<br><br><strong>Your tells (subtle):</strong> Your hands stay steady — you're not nervous. You smile less when processing deep emotions. You look at people a beat longer than normal. You touch your journal protectively — it's always on you.<br><br><strong>When accused:</strong> Don't deny. Don't resist. Let the moment land. Then tell your truth with quiet conviction.",

        // ═══ SECRET SECTION ═══
        secretSection: true,
        trueIdentity: "Miranda Hartley",
        trueBackstory: "Your real name is <strong>Miranda Hartley</strong>. You are the daughter of <strong>Robert Hartley</strong>, William Thoreson's original business partner. In 1910, William forged documents to steal your father's share of the company. Your father discovered the theft and the affair between William and your mother Margaret. He died the next day — ruled a suicide. You were fourteen years old.<br><br>Your mother Margaret begged William to support both children — your half-sibling Taylor (his child) and you (Robert's daughter). He refused. He set up a secret trust for Taylor and abandoned you completely. Your mother died two years later. You raised Taylor alone.<br><br>You changed your name to Longfellow, got hired as Scott's assistant in 1925, and spent ten years inside the family — finding the forged documents, the ledger, the letters, everything. When you learned William planned to 'welcome' Taylor tonight and play the hero, you decided he didn't deserve redemption. You traveled to Switzerland, harvested Wolfsbane, and poisoned his drink.",
        trueMotivation: "You are not a villain. You are a daughter seeking justice for a father who was betrayed, robbed, and driven to death by the man everyone tonight is mourning. William Thoreson destroyed your family, lived a life of luxury on stolen wealth, and was about to die beloved and forgiven. You made sure the truth would come out first.",
        confessionGuide: "<strong>When the moment comes:</strong><br>• Don't resist or deny when confronted<br>• Confirm each piece of evidence calmly<br>• Say: 'My name is Miranda Hartley. Robert's daughter. And yes — I killed him.'<br>• Tell your story clearly. Let 25 years of pain come through, but stay composed.<br>• Look people in the eye — especially Scott<br>• You are at peace. This was justice.",
        carryingItems: "Your travel journal (will be found if searched in Act 3), a locket with a photo of your mother and younger self, a notebook and fountain pen.",

        goals: [
            "Help the truth about William Thoreson come to light",
            "Maintain your composure throughout the evening",
            "Let the evidence build naturally — don't rush it",
            "When confronted, tell your story with quiet conviction"
        ],
        relationships: [
            { name: "Scott Thoreson Jr.", relation: "Your employer for 10 years" },
            { name: "William Thoreson Sr.", relation: "The man who destroyed your family" },
            { name: "Robert Hartley", relation: "Your father (died 1910)" },
            { name: "Margaret Hartley", relation: "Your mother (died 1912)" },
            { name: "Taylor Hartley", relation: "Your half-sibling (Will's child with your mother)" }
        ]
    },

    // ══════════════════════════════════════════════
    // MARC — JOURNALIST
    // ══════════════════════════════════════════════
    "Marc": {
        character: "Walter Lippman",
        backstory: "You're a journalist for the Dallas Herald, covering business and society. You've built a reputation for thorough, honest reporting. William Thoreson invited you tonight — unusual, since the Thoresons have always been private. He hinted at a major announcement that would be 'the story of the year.' You brought your assistant Sophie to help take notes. Now that Will is dead, the story just got a lot bigger.",
        whatYouKnow: [
            "William Thoreson personally invited you, promising a major announcement.",
            "The Thoresons are one of the wealthiest families in Dallas — Thoreson Toys is extremely profitable.",
            "You've heard rumors over the years about how Will originally built the company, but nothing concrete.",
            "You know Dallas business circles well — who's connected to whom, whose fortunes are rising or falling.",
            "Your instincts tell you there's more to this family than the public image."
        ],
        whatYouCanShare: [
            { info: "Will personally invited me. Said he had an announcement that would be 'the story of the year.' That's unusual for someone so private.", when: "Anytime" },
            { info: "In my years covering Dallas business, I've heard whispers that Thoreson Toys wasn't always just 'Thoreson.' But I could never confirm anything.", when: "After letterhead is found" },
            { info: "As a journalist, I can tell you — people don't invite reporters to family dinners unless they want something on the record.", when: "Anytime" },
            { info: "I've been taking notes all evening. I can help piece together what we've learned.", when: "During act transitions" }
        ],
        howToPlay: "<strong>Tone:</strong> Sharp, curious, professional. You're always working — even at a dinner party.<br><br><strong>Key behaviors:</strong> Ask probing questions. Take notes (real or mental). Press people for details when their stories don't add up. You're not accusatory — you're investigative. There's a difference.<br><br><strong>Important:</strong> You have a nose for stories. When clues come out, connect them. Ask 'who benefits?' and 'what's the timeline?' You're the person who helps the group think critically.",
        goals: [
            "Uncover the full story of what happened to William Thoreson",
            "Ask the questions others are afraid to ask",
            "Help the group piece together the evidence",
            "Get to the truth — that's what you do"
        ],
        relationships: [
            { name: "Sophie Vanderpool", relation: "Your assistant at the Herald" },
            { name: "William Thoreson Sr.", relation: "Invited you personally — now deceased" },
            { name: "Scott Thoreson Jr.", relation: "The family lawyer — your main point of contact" }
        ]
    },

    // ══════════════════════════════════════════════
    // MAISY — JOURNALIST'S ASSISTANT
    // ══════════════════════════════════════════════
    "Maisy": {
        character: "Sophie Vanderpool",
        backstory: "You work as an assistant to Walter Lippman at the Dallas Herald. You're smart, energetic, and eager to prove yourself in a field that doesn't always take young women seriously. Walter brought you tonight because Will Thoreson promised a big announcement. You come from a merchant family and understand business — you're not just here to take notes. You have your own instincts, and they're usually right.",
        whatYouKnow: [
            "Walter was personally invited by William Thoreson for a major announcement.",
            "You've helped Walter research the Thoreson family — they're powerful but private.",
            "Your merchant family background gives you a practical understanding of business and money.",
            "You're good at reading people and noticing when something doesn't add up.",
            "You know that Thoreson Toys has been unusually profitable for decades — maybe too profitable for a toy company."
        ],
        whatYouCanShare: [
            { info: "When I researched the Thoresons for Walter, I found very little about the early years of the company. Almost like someone scrubbed the history.", when: "After letterhead is found" },
            { info: "I noticed Miranda watching everyone very carefully tonight. Not nervously — more like she was... waiting for something.", when: "Act 2 or 3" },
            { info: "I'm good with details. If you need someone to cross-reference what we've found, I can help.", when: "Anytime" },
            { info: "Something about the Thoreson fortune has always felt too clean. Businesses that successful usually have complicated histories.", when: "Anytime" }
        ],
        howToPlay: "<strong>Tone:</strong> Bright, perceptive, eager. You're young but sharp — don't let anyone underestimate you.<br><br><strong>Key behaviors:</strong> Be curious. Move around the party and talk to different people. Notice details — who's talking to whom, who looks nervous, who's avoiding questions. You're Walter's assistant but you have your own observations.<br><br><strong>Important:</strong> You're a great character for connecting dots between what different people are saying. If two clues seem related, point it out.",
        goals: [
            "Help Walter get the story",
            "Prove your investigative instincts",
            "Notice things other people miss",
            "Piece together what's really going on with this family"
        ],
        relationships: [
            { name: "Walter Lippman", relation: "Your boss at the Dallas Herald" },
            { name: "William Thoreson Sr.", relation: "The subject of tonight's story" },
            { name: "Scott Thoreson Jr.", relation: "Met through Walter" }
        ]
    },

    // ══════════════════════════════════════════════
    // HANNAH — COUSIN FROM FRANCE (FRENCH SKILL)
    // ══════════════════════════════════════════════
    "Hannah": {
        character: "Vivienne Ashford",
        backstory: "You're Scott and Brian's cousin on their mother's side. You spent the last several years living in Paris and traveling through France — studying art, language, and culture. You're educated, worldly, and bring a European perspective that sometimes clashes with Dallas society. You returned recently when you heard your Uncle Will was planning something important. You love your family, but you've always felt like an outsider among the business-obsessed Thoresons.",
        whatYouKnow: [
            "You're fluent in French from years living in Paris.",
            "Your Uncle Will always seemed to carry a heaviness — like something from his past haunted him.",
            "The family has always been proud of Thoreson Toys, but you've never been interested in the business side.",
            "You remember hearing your mother mention the name 'Hartley' once when you were young, but she changed the subject immediately.",
            "You've been away for years and are still catching up on family dynamics."
        ],
        whatYouCanShare: [
            { info: "I speak fluent French. If there's anything written in French, I can translate it.", when: "Anytime — this is your skill" },
            { info: "I remember my mother mentioning someone named 'Hartley' years ago. She got very quiet after and wouldn't explain.", when: "After letterhead is found" },
            { info: "Uncle Will always seemed like he was carrying something heavy. I assumed it was just the pressure of business.", when: "Anytime" },
            { info: "Living in Europe gives you perspective. Families over there have complicated histories too — affairs, disputed inheritances, hidden children. It's more common than people think.", when: "After the affair is revealed" }
        ],
        howToPlay: "<strong>Tone:</strong> Cultured, perceptive, slightly detached. You love your family but you see them clearly.<br><br><strong>Key behaviors:</strong> Offer your French translation skill when documents appear. Share your outsider perspective — sometimes the person who's been away sees things the people closest to the situation can't. Be warm but honest.<br><br><strong>Important:</strong> Your French skill is critical for translating Margaret's letter. When a document in French appears, step up — this is your moment to shine.",
        goals: [
            "Use your French skills to help the investigation",
            "Understand the family secrets that are coming to light",
            "Support your cousins Scott and Brian through this",
            "See the family clearly — with love, but without illusions"
        ],
        relationships: [
            { name: "Scott Thoreson Jr.", relation: "Your cousin" },
            { name: "Brian Thoreson", relation: "Your cousin" },
            { name: "William Thoreson Sr.", relation: "Your uncle (deceased)" },
            { name: "Eleanor Thoreson", relation: "Your aunt" }
        ]
    },

    // ══════════════════════════════════════════════
    // DJ — FAMILY COUSIN
    // ══════════════════════════════════════════════
    "DJ": {
        character: "David Richardson",
        backstory: "You're a cousin on the Thoreson side — close enough to the family to know the dynamics, far enough removed to see them objectively. You're personable, well-connected, and the kind of person people naturally confide in. You've handled various family projects over the years — organizing events, managing property, smoothing over disputes. Tonight was supposed to be a celebration. Instead, you're helping your family navigate the worst night of their lives.",
        whatYouKnow: [
            "You know the Thoreson family well — their strengths and their tensions.",
            "Will was a complicated man. Generous publicly, but private about his past.",
            "Scott carries a heavy burden as the family lawyer — he knows things he can't always share.",
            "You've heard Eleanor occasionally reference 'the early days' of the company with a tone that suggested it wasn't a simple success story.",
            "You're good at reading rooms and managing people — that's your role in this family."
        ],
        whatYouCanShare: [
            { info: "Eleanor once told me that Will 'didn't build this alone, no matter what he says.' She never explained what she meant.", when: "After letterhead is found" },
            { info: "I've known this family my whole life. Will was generous, but he could be ruthless when it came to business.", when: "Anytime" },
            { info: "I've never heard Miranda mention family or where she came from. In ten years. That's unusual, isn't it?", when: "Act 2 or later" },
            { info: "If we need to organize a search or coordinate what everyone's found, I can help manage that.", when: "During act transitions" }
        ],
        howToPlay: "<strong>Tone:</strong> Steady, social, practical. You're the family fixer — the person who keeps things running smoothly.<br><br><strong>Key behaviors:</strong> Talk to everyone. Check in on people. Help facilitate conversations between characters who might have pieces of the puzzle. You're not the detective — you're the coordinator.<br><br><strong>Important:</strong> You can help move the investigation forward by encouraging quieter characters to share what they know. 'Wait, didn't you say something earlier about...?'",
        goals: [
            "Help the family get through this night",
            "Facilitate the investigation — make sure everyone's being heard",
            "Pay attention to how people are reacting",
            "Support Scott as the new head of the family"
        ],
        relationships: [
            { name: "Scott Thoreson Jr.", relation: "Your cousin" },
            { name: "Brian Thoreson", relation: "Your cousin" },
            { name: "William Thoreson Sr.", relation: "Your uncle (deceased)" },
            { name: "Eleanor Thoreson", relation: "Your aunt" }
        ]
    },

    // ══════════════════════════════════════════════
    // PETER — BUSINESS MANAGER (ACCOUNTING SKILL)
    // ══════════════════════════════════════════════
    "Peter": {
        character: "Raymond Hammond",
        backstory: "You've been the Business Manager at Thoreson Toys for fifteen years. You know the company's finances inside and out — every ledger entry, every vendor payment, every quarterly report. You're detail-oriented, systematic, and fiercely loyal to the company. William Thoreson hired you personally, and you've always respected him. But you've also noticed things over the years that didn't quite add up — entries you couldn't explain, payments that seemed personal rather than business. You never asked questions. Maybe you should have.",
        whatYouKnow: [
            "You manage the company's books and know the financials better than anyone.",
            "There are recurring entries in the older ledgers that never had proper documentation — small amounts, always the same, always authorized directly by Will.",
            "The company is extremely profitable, but some of the historical records are... incomplete.",
            "Will was generous with employees but secretive about certain financial matters.",
            "You have the accounting expertise to analyze financial documents in detail."
        ],
        whatYouCanShare: [
            { info: "I've managed these books for fifteen years. If there's something in a financial document, I can find it.", when: "Anytime — this is your skill" },
            { info: "I'll be honest — there have always been entries in the older books I couldn't explain. Small payments, no documentation, authorized by Will personally. I assumed they were personal charity.", when: "When the ledger is examined" },
            { info: "The company has always been called Thoreson Toys. In fifteen years, I've never seen any other name on official documents.", when: "When the letterhead is found" },
            { info: "Whoever set up those T.H. payments knew exactly how to bury them. They're structured to look like routine disbursements — you'd have to be an accountant to spot the pattern.", when: "After analyzing the ledger" }
        ],
        howToPlay: "<strong>Tone:</strong> Precise, professional, a little uncomfortable. You're realizing your boss had secrets you should have caught.<br><br><strong>Key behaviors:</strong> Be the expert in the room when it comes to finances. When the ledger appears, step up — this is your moment. Explain what you find in clear terms for non-accountants. Feel some guilt that you didn't dig deeper over the years.<br><br><strong>Important:</strong> Your Accounting skill lets you decode the QR code on the financial ledger. When you scan it and enter the password, read the full analysis aloud to the group. This is a key moment in Act 1.",
        goals: [
            "Use your financial expertise to analyze any documents found",
            "Help the group understand the company's financial history",
            "Come to terms with what you may have overlooked",
            "Protect the company's future even as its past is revealed"
        ],
        relationships: [
            { name: "William Thoreson Sr.", relation: "Your employer — hired you personally" },
            { name: "Scott Thoreson Jr.", relation: "Family attorney — you work together on company matters" },
            { name: "Marcus Brennan", relation: "Investor you report to periodically" },
            { name: "Victoria Ashworth", relation: "Investor you report to periodically" }
        ]
    },

    // ══════════════════════════════════════════════
    // ARASH — INVESTOR
    // ══════════════════════════════════════════════
    "Arash": {
        character: "Marcus Brennan",
        backstory: "You're a successful Dallas businessman with diverse investments, including a significant stake in Thoreson Toys. You're analytical, measured, and protective of your money. You invested in Thoreson Toys five years ago because the numbers were impressive — the company was a money machine. William seemed like a safe bet. But now Will is dead, and you're watching your investment very carefully. Secrets about the company's past could destroy its value overnight.",
        whatYouKnow: [
            "You invested heavily in Thoreson Toys based on its strong financial performance.",
            "The company's profits have been remarkably consistent — almost too consistent for the toy industry.",
            "You've reviewed the company's books periodically but never had full access to historical records.",
            "William always deflected questions about the 'early years' of the company.",
            "If the company's foundation is built on fraud, your entire investment could be worthless."
        ],
        whatYouCanShare: [
            { info: "I put a lot of money into this company. If there are problems with how it was built, I need to know — my investment depends on it.", when: "Anytime" },
            { info: "Whenever I asked Will about the early history of the company, he changed the subject. Every time.", when: "After letterhead is found" },
            { info: "From a financial standpoint, if this company was built on stolen assets, every contract and partnership could be challenged.", when: "After forged documents are revealed" },
            { info: "I've been watching everyone tonight. Several people seem to know more than they're saying.", when: "Act 2 or later" }
        ],
        howToPlay: "<strong>Tone:</strong> Calculated, direct, a bit cold. You care about truth, but you also care about your money.<br><br><strong>Key behaviors:</strong> Ask pointed business questions. Push for specifics. You're not sentimental — you want facts and numbers. Your concern about the company's legitimacy gives you a real stake in the investigation.<br><br><strong>Important:</strong> Your financial self-interest makes you a motivated investigator. You're not doing this out of love for the family — you're doing it because your fortune is at risk.",
        goals: [
            "Understand the full truth about Thoreson Toys' origins",
            "Assess the risk to your investment",
            "Get straight answers from the family",
            "Figure out who benefits from Will's death"
        ],
        relationships: [
            { name: "Victoria Ashworth", relation: "Fellow investor — you coordinate on Thoreson matters" },
            { name: "Raymond Hammond", relation: "The business manager who reports to investors" },
            { name: "William Thoreson Sr.", relation: "Company founder (deceased)" },
            { name: "Scott Thoreson Jr.", relation: "The family attorney" }
        ]
    },

    // ══════════════════════════════════════════════
    // BECKY — INVESTOR
    // ══════════════════════════════════════════════
    "Becky": {
        character: "Victoria Ashworth",
        backstory: "You're a sharp businesswoman who invested in Thoreson Toys alongside Marcus Brennan. You have a keen eye for detail and a talent for reading people — skills that have served you well in business. You're active in Dallas society and philanthropic circles, which means you hear things. Rumors, gossip, whispered conversations at galas. You've heard things about the Thoreson family over the years that you've filed away but never acted on. Tonight, those whispers might finally matter.",
        whatYouKnow: [
            "You invested in Thoreson Toys because of its track record, but you've always had a nagging feeling.",
            "At a charity gala years ago, an older socialite mentioned that Will Thoreson 'wasn't always alone in that business.' The woman died before you could follow up.",
            "You notice things about people — body language, hesitations, the things they don't say.",
            "Miranda has always struck you as someone who's watching everything a little too carefully.",
            "Your investment gives you a legitimate reason to demand transparency about the company's history."
        ],
        whatYouCanShare: [
            { info: "I heard someone say years ago that Will 'wasn't always alone in that business.' I never knew what it meant until tonight.", when: "After letterhead is found" },
            { info: "I've always thought Miranda was watching the family more closely than a normal assistant would.", when: "Act 2 or later" },
            { info: "I'm an investor. I have a right to know if this company was built on fraud.", when: "Anytime" },
            { info: "People reveal themselves under pressure. Watch who gets nervous when new information comes out.", when: "Anytime" }
        ],
        howToPlay: "<strong>Tone:</strong> Perceptive, confident, socially graceful but with steel underneath.<br><br><strong>Key behaviors:</strong> Observe people. Comment on body language and reactions. Share your suspicions when they feel right. You're the person who notices the thing everyone else missed.<br><br><strong>Important:</strong> Your past rumor about Will 'not being alone in the business' is a great early conversation piece that supports the letterhead discovery.",
        goals: [
            "Understand what's really happening with Thoreson Toys",
            "Protect your investment — but also find the truth",
            "Use your people-reading skills to help the investigation",
            "Pay attention to who's hiding something"
        ],
        relationships: [
            { name: "Marcus Brennan", relation: "Fellow investor and business ally" },
            { name: "Raymond Hammond", relation: "The business manager" },
            { name: "William Thoreson Sr.", relation: "Company founder (deceased)" },
            { name: "Dorothy Wells", relation: "Friend from society circles" }
        ]
    },

    // ══════════════════════════════════════════════
    // BRIANS — COMPETITOR
    // ══════════════════════════════════════════════
    "BrianS": {
        character: "Thomas Bradford",
        backstory: "You run Bradford & Sons, a competing toy manufacturer in Dallas. You've been in William Thoreson's shadow for years — his company always outperformed yours, and you could never figure out why. You're charming, ambitious, and not above using tonight's chaos to your advantage. Will invited you tonight as a courtesy between competitors, but you suspect he wanted to rub something in your face with his 'big announcement.' Now he's dead, and you're very interested in what secrets come out about how he built his empire.",
        whatYouKnow: [
            "Your company has competed with Thoreson Toys for decades. They always had an edge you couldn't explain.",
            "The toy industry in Dallas isn't big enough for one company to dominate this completely without some kind of advantage.",
            "Will was always cagey about the company's early financing and how he grew so quickly.",
            "If Thoreson Toys was built on fraud, it could level the playing field for your company.",
            "You've heard industry rumors that Will didn't start the company alone."
        ],
        whatYouCanShare: [
            { info: "I've competed with Thoreson Toys for years. They always had an edge that didn't make sense to me. Now I'm wondering if I know why.", when: "After letterhead is found" },
            { info: "In the toy business, you hear things. I'd heard whispers that the company didn't start as just 'Thoreson.' Nobody could ever prove it.", when: "After letterhead is found" },
            { info: "From a competitor's perspective, Will's early success was suspicious. Companies don't grow that fast without capital — and his family didn't have money.", when: "Anytime" },
            { info: "I'll be honest — part of me wants to know the truth because it might help my business. But a man is dead. That's bigger than competition.", when: "Act 2 or later" }
        ],
        howToPlay: "<strong>Tone:</strong> Charming, opportunistic, but not heartless. You're a competitor, not a villain.<br><br><strong>Key behaviors:</strong> Ask questions about the company's origins. Be upfront about your competitive interest — it's more honest than pretending you don't care. Show genuine concern when the darker secrets come out. You wanted to beat Thoreson Toys, not see a family destroyed.<br><br><strong>Important:</strong> You add tension because you benefit from the company's secrets being exposed. Other characters might distrust your motives.",
        goals: [
            "Learn the truth about how Thoreson Toys was built",
            "Assess how this affects the competitive landscape",
            "Be honest about your interests while showing respect",
            "Help with the investigation — the truth matters regardless of business"
        ],
        relationships: [
            { name: "William Thoreson Sr.", relation: "Your biggest competitor (deceased)" },
            { name: "Scott Thoreson Jr.", relation: "Professional acquaintance" },
            { name: "Raymond Hammond", relation: "Thoreson's business manager" },
            { name: "Marcus Brennan", relation: "Dallas business circles" }
        ]
    },

    // ══════════════════════════════════════════════
    // KATIE — FAMILY FRIEND (30 YEARS)
    // ══════════════════════════════════════════════
    "Katie": {
        character: "Margaret Ashford",
        backstory: "You've been a friend of the Thoreson family for over thirty years. You watched Scott and Brian grow up. You sat with Eleanor through difficult times. You knew William as well as anyone outside the family — or so you thought. You're warm, loyal, and fiercely protective of the people you love. But thirty years of friendship also means thirty years of small observations, overheard conversations, and quiet concerns you kept to yourself out of respect.",
        whatYouKnow: [
            "You've known the family for thirty years. You remember when the boys were small.",
            "Eleanor confided in you once that Will 'carried guilt about the way things started.' She didn't elaborate.",
            "You noticed Will was particularly kind to Miranda from the moment she was hired — almost paternal. It struck you as unusual.",
            "You've always thought Will was haunted by something from his past, but he would never discuss it.",
            "You know the name 'Margaret' is significant to Will — he once got emotional when someone mentioned it at a dinner party."
        ],
        whatYouCanShare: [
            { info: "Eleanor told me once that Will 'carried guilt about the way things started.' She wouldn't say more.", when: "Anytime" },
            { info: "I've known this family for thirty years. Will was a good man in many ways, but he was carrying something heavy.", when: "Anytime" },
            { info: "I always noticed Will was unusually kind to Miranda. Almost... protective. Like he owed her something.", when: "Act 2 or later" },
            { info: "The name 'Margaret' always affected Will. I saw him tear up once when someone mentioned it at dinner. He excused himself.", when: "After the affair is revealed" }
        ],
        howToPlay: "<strong>Tone:</strong> Warm, caring, conflicted. You love this family, and learning the truth is painful for you.<br><br><strong>Key behaviors:</strong> Share your observations from thirty years of friendship. Be emotional — these aren't just clues, they're memories. Defend the family when you can, but be honest when you can't. You're the heart of the gathering.<br><br><strong>Important:</strong> Your long-term observations provide crucial context. The detail about Eleanor's comment and Will's reaction to the name 'Margaret' are powerful character moments.",
        goals: [
            "Support the family through this terrible night",
            "Share what you've observed over thirty years, even when it's painful",
            "Honor your friendship with the truth",
            "Help the younger generation understand their family's history"
        ],
        relationships: [
            { name: "Eleanor Thoreson", relation: "Your closest friend for thirty years" },
            { name: "William Thoreson Sr.", relation: "Dear friend (deceased)" },
            { name: "Scott Thoreson Jr.", relation: "Watched him grow up" },
            { name: "Brian Thoreson", relation: "Watched him grow up" },
            { name: "Elizabeth Monroe", relation: "Fellow long-time family friend" }
        ]
    },

    // ══════════════════════════════════════════════
    // MICHELLE — SOCIETY FIGURE
    // ══════════════════════════════════════════════
    "Michelle": {
        character: "Dorothy Wells",
        backstory: "You're one of the most well-connected women in Dallas society. You sit on charity boards, attend every important social function, and have an uncanny ability to know what's happening in every corner of the city before anyone else does. You're intelligent, perceptive, and maintain an extensive network of social connections. You were close to the Thoresons socially, but you've always sensed that the family's public image was carefully managed.",
        whatYouKnow: [
            "You know Dallas society inside and out — who's connected to whom, and where the bodies are buried (figuratively).",
            "You've heard gossip over the years about a woman named Margaret who was connected to the Thoresons, but the details were always vague.",
            "In your experience, the most respected families usually have the darkest secrets.",
            "You've noticed that Will never attended any event alone with Eleanor — Miranda was always nearby.",
            "Your social network is a powerful investigative tool."
        ],
        whatYouCanShare: [
            { info: "In my circles, there were always whispers about a woman named Margaret connected to the Thoresons. Nobody knew the details.", when: "After the affair is revealed" },
            { info: "I've seen a lot of Dallas families up close. The ones who work hardest to look perfect are usually hiding the most.", when: "Anytime" },
            { info: "Has anyone noticed that Miranda was always around Will? At every event, every gathering. Almost like she was keeping an eye on him.", when: "Act 2 or later" },
            { info: "I know people all over this city. If there's a public record that needs checking or a connection that needs tracing, I might be able to help.", when: "Anytime" }
        ],
        howToPlay: "<strong>Tone:</strong> Elegant, knowing, a bit dramatic. You enjoy being the person who knows things.<br><br><strong>Key behaviors:</strong> Drop hints about what you've heard in society. React with knowing glances when secrets come out. You're not surprised by scandal — you've seen it all. But even you might be shaken by what's revealed tonight.<br><br><strong>Important:</strong> You're the gossip network made flesh. Your observations about Miranda always being near Will and the whispers about 'Margaret' add texture to the investigation.",
        goals: [
            "See the full truth come to light — you've waited years",
            "Share your society gossip when it becomes relevant",
            "Observe how people react to revelations",
            "Support the family while satisfying your curiosity"
        ],
        relationships: [
            { name: "Victoria Ashworth", relation: "Friend from society circles" },
            { name: "Margaret Ashford", relation: "Friend and fellow socialite" },
            { name: "William Thoreson Sr.", relation: "Social acquaintance (deceased)" },
            { name: "Eleanor Thoreson", relation: "Social acquaintance" }
        ]
    },

    // ══════════════════════════════════════════════
    // JEFF — RETIRED BANKER
    // ══════════════════════════════════════════════
    "Jeff": {
        character: "Charles Sterling",
        backstory: "You're a retired banker and a distant Thoreson relation through marriage. You spent forty years in Dallas banking before retiring. You're traditional, principled, and believe in doing things the right way. You handled some of the Thoreson family's banking in the early days — back when Will was just getting the company off the ground. You remember things from that era that might be relevant now, though you've kept them to yourself out of professional discretion.",
        whatYouKnow: [
            "You handled early Thoreson banking — you remember when the company was young and growing fast.",
            "The initial capital Will used to expand the company always seemed larger than his personal means could explain.",
            "You remember processing a large deposit in the early 1910s that came from what appeared to be an insurance payout — but the details were unusual.",
            "Banking discretion has kept you quiet for decades, but a man is dead now.",
            "Your son Bradey is here tonight and you want to set a good example."
        ],
        whatYouCanShare: [
            { info: "I handled the Thoreson accounts in the early days. The growth was fast — faster than his personal capital should have allowed.", when: "After letterhead or forged documents are found" },
            { info: "I remember a large deposit around 1910 that seemed connected to some kind of business transfer. The paperwork was... minimal.", when: "After forged documents are found" },
            { info: "In banking, we have a saying: follow the money. If someone is hiding something, the money always tells the story.", when: "Anytime" },
            { info: "I've kept quiet about this for years out of professional discretion. But discretion has limits when someone has been murdered.", when: "Act 2 or later" }
        ],
        howToPlay: "<strong>Tone:</strong> Dignified, measured, principled. You speak carefully because words matter.<br><br><strong>Key behaviors:</strong> Share your banking observations when financial evidence appears. You add historical weight to the investigation — you were there in the early days. Struggle with breaking professional confidence, but ultimately choose truth.<br><br><strong>Important:</strong> Your early banking knowledge corroborates what the financial documents reveal. You're living proof that the financial irregularities go back decades.",
        goals: [
            "Help uncover the truth — professional discretion no longer applies",
            "Share what you remember from the early banking days",
            "Set a good example for your son Bradey",
            "Ensure justice is done properly"
        ],
        relationships: [
            { name: "James Sterling", relation: "Your son (Bradey)" },
            { name: "William Thoreson Sr.", relation: "Former banking client (deceased)" },
            { name: "Scott Thoreson Jr.", relation: "Family relation" },
            { name: "Raymond Hammond", relation: "Met through Thoreson Toys business" }
        ]
    },

    // ══════════════════════════════════════════════
    // CASEY — WIDOW / GUARDIAN
    // ══════════════════════════════════════════════
    "Casey": {
        character: "Patricia Chamberlain",
        backstory: "You're an independent widow with considerable means and a strong will. After your husband passed, you became guardian to two young men — Jesse and Alexander — whom you've raised with care and discipline. You're protective, perceptive, and don't suffer fools. You've been a friend to the Thoreson family for years, but you've always maintained a clear-eyed view of them. You knew Will had flaws, and you're not entirely surprised that secrets are surfacing tonight.",
        whatYouKnow: [
            "You've been around the Thoreson family long enough to know they're not as perfect as they appear.",
            "Will was generous publicly but could be cold behind closed doors. You saw both sides.",
            "Your late husband once mentioned that Will 'owed a debt he'd never repay.' He wouldn't explain further.",
            "You're protective of the young people at this gathering — especially your wards.",
            "You believe in accountability. If Will did wrong, it should come to light."
        ],
        whatYouCanShare: [
            { info: "My late husband once said Will 'owed a debt he'd never repay.' He passed before I could learn more.", when: "Anytime" },
            { info: "I've watched Will for years. He was generous with money but stingy with truth.", when: "Anytime" },
            { info: "Don't let sentimentality cloud judgment. If Will wronged people, the truth serves everyone.", when: "When people are conflicted about revelations" },
            { info: "I've been watching Miranda tonight. She doesn't seem surprised by any of this. Not grief, not shock. Just... patience.", when: "Act 3" }
        ],
        howToPlay: "<strong>Tone:</strong> Strong, direct, no-nonsense. You're the person who says what everyone else is thinking.<br><br><strong>Key behaviors:</strong> Speak plainly. Cut through politeness when it's getting in the way of truth. Be protective of the younger characters. Challenge people to be honest.<br><br><strong>Important:</strong> You add moral weight to the investigation. When people hesitate to confront uncomfortable truths, you push them forward.",
        goals: [
            "See the truth come out — all of it",
            "Protect the young people at this gathering",
            "Hold people accountable for their actions",
            "Honor the memory of your late husband's instincts about Will"
        ],
        relationships: [
            { name: "Jesse Chamberlain", relation: "Your ward — you raised him" },
            { name: "Alexander Chamberlain", relation: "Your ward — you raised him" },
            { name: "William Thoreson Sr.", relation: "Family friend (deceased)" },
            { name: "Eleanor Thoreson", relation: "Friend" }
        ]
    },

    // ══════════════════════════════════════════════
    // KRYSTAL — BUSINESSMAN'S WIFE
    // ══════════════════════════════════════════════
    "Krystal": {
        character: "Victoria Grant",
        backstory: "Your husband runs a successful import business with ties to Thoreson Toys. You're sophisticated, socially savvy, and more knowledgeable about business than most people give you credit for. You've attended Thoreson gatherings for years and have developed your own observations about the family. You're here tonight because your husband's business depends on the Thoreson relationship — but you're also genuinely curious about what Will was planning to announce.",
        whatYouKnow: [
            "Your husband's import business has worked with Thoreson Toys for years.",
            "You've attended family events and observed the dynamics closely.",
            "You've noticed that Will treated Miranda differently than other staff — almost deferentially.",
            "Through your husband's business, you know Thoreson Toys imports materials from Europe — including from Switzerland.",
            "You understand commerce, contracts, and business relationships better than most people assume."
        ],
        whatYouCanShare: [
            { info: "Through my husband's import business, I know Thoreson Toys has trade connections throughout Europe — including Switzerland.", when: "After Swiss Alps connection is made" },
            { info: "Will always treated Miranda with a strange... deference. Like she had some kind of authority over him. It never made sense to me.", when: "Act 2 or later" },
            { info: "My husband's business depends on Thoreson Toys. Whatever happened here tonight affects our livelihood too.", when: "Anytime" },
            { info: "I've been underestimated my whole life because I'm 'the wife.' But I see things clearly. And something about tonight doesn't add up.", when: "Anytime" }
        ],
        howToPlay: "<strong>Tone:</strong> Poised, observant, subtly sharp. You're smarter than people expect.<br><br><strong>Key behaviors:</strong> Surprise people with your knowledge. Make connections others miss. Push back if someone dismisses you. Your import business knowledge about European connections is genuinely useful when the Switzerland/Wolfsbane connection surfaces.<br><br><strong>Important:</strong> Your observation about Will treating Miranda deferentially is a great moment in Act 2/3 that supports the growing suspicion about Miranda.",
        goals: [
            "Understand how this affects your husband's business",
            "Share your observations and connections",
            "Prove that you're more than 'just the wife'",
            "Help solve what happened to Will"
        ],
        relationships: [
            { name: "William Thoreson Sr.", relation: "Business connection (deceased)" },
            { name: "Scott Thoreson Jr.", relation: "Professional acquaintance" },
            { name: "Miranda Longfellow", relation: "Observed at many family events" },
            { name: "Dorothy Wells", relation: "Friend from social circles" }
        ]
    },

    // ══════════════════════════════════════════════
    // LINDSEY — FAMILY MATRIARCH
    // ══════════════════════════════════════════════
    "Lindsey": {
        character: "Elizabeth Monroe",
        backstory: "You are the eldest member of the extended family — the matriarch whose memory stretches back further than anyone else's. You remember when Will and Eleanor were young, when the company was just starting, and when Dallas was a very different city. You're wise, dignified, and deeply loyal to the family. But you also believe that secrets poison families from the inside, and you've always suspected that the Thoreson fortune was built on something Will never talked about.",
        whatYouKnow: [
            "You remember the early days of the company — before it was just 'Thoreson Toys.'",
            "You recall hearing the name Robert Hartley decades ago, but Will would change the subject every time.",
            "You know that Will and Eleanor's marriage went through a very difficult period around 1910-1912.",
            "You've watched this family for decades. You see patterns others miss.",
            "You believe the truth, however painful, is always better than comfortable lies."
        ],
        whatYouCanShare: [
            { info: "I remember hearing the name Hartley, years ago. Will would go white whenever someone mentioned it. I learned to stop asking.", when: "When letterhead is found" },
            { info: "Something happened around 1910 that nearly destroyed Will and Eleanor's marriage. She never told me the details, but she was devastated.", when: "After the affair is revealed" },
            { info: "I've lived long enough to know that fortunes built on secrets eventually come apart. I always feared this day would come.", when: "Anytime" },
            { info: "Will wasn't a bad man. But he made terrible choices, and he spent the rest of his life running from them.", when: "Act 2 or later" }
        ],
        howToPlay: "<strong>Tone:</strong> Wise, steady, sorrowful. You've seen it all and you're not shocked — just sad.<br><br><strong>Key behaviors:</strong> Speak with the authority of someone who's lived through history. Provide context from decades past. Don't rush — let your words carry weight. You're the grandmother figure who sees clearly.<br><br><strong>Important:</strong> Your memories about the name Hartley and the troubled marriage around 1910 provide historical corroboration for what the documents reveal. You're the living memory of this family.",
        goals: [
            "Help the family face its history honestly",
            "Share what you remember, even when it hurts",
            "Protect the family's future by confronting its past",
            "Ensure the younger generation learns from this"
        ],
        relationships: [
            { name: "William Thoreson Sr.", relation: "Watched him his whole life (deceased)" },
            { name: "Eleanor Thoreson", relation: "Dear friend" },
            { name: "Margaret Ashford", relation: "Long-time friend" },
            { name: "Scott Thoreson Jr.", relation: "Grandson figure" }
        ]
    },

    // ══════════════════════════════════════════════
    // BRADEY — YOUNG STERLING (JEFF'S SON)
    // ══════════════════════════════════════════════
    "Bradey": {
        character: "James Sterling",
        backstory: "You're the son of Charles Sterling, the retired banker. You're young, ambitious, and eager to make your mark in Dallas business. This is your first time at a Thoreson family event, and you were excited to network. Instead, you're watching a family empire come apart in real time. You're sharp enough to follow what's happening, and you're not blinded by decades of loyalty to the Thoresons like the older generation.",
        whatYouKnow: [
            "Your father handled the Thoreson banking accounts years ago — he's mentioned it in passing.",
            "You're new to this social circle and seeing everything with fresh eyes.",
            "You don't have the emotional attachments that cloud the older generation's judgment.",
            "You're ambitious and pay close attention to how power and money work.",
            "You want to understand the business world — tonight is a crash course."
        ],
        whatYouCanShare: [
            { info: "I don't have the history everyone else has with this family. But sometimes an outsider's perspective is what you need.", when: "Anytime" },
            { info: "My father mentioned once that the Thoreson accounts were 'complicated' in the early days. He wouldn't say more.", when: "After financial evidence appears" },
            { info: "I've been watching everyone's faces when new information comes out. Some people are surprised. Some people aren't. That tells you something.", when: "Act 2 or later" },
            { info: "I'm young, but I'm not naive. Someone at this party knows more than they're saying.", when: "Act 2 or later" }
        ],
        howToPlay: "<strong>Tone:</strong> Eager, observant, refreshingly direct. You haven't learned to be diplomatic yet — and that's an asset.<br><br><strong>Key behaviors:</strong> Ask the obvious questions that nobody else will ask because they're being polite. Point out inconsistencies. React honestly to revelations. You're the fresh pair of eyes in the room.<br><br><strong>Important:</strong> Your youth and outsider perspective let you say things the older characters can't. Use that freedom.",
        goals: [
            "Understand what's really happening with this family",
            "Make your father proud by being sharp and observant",
            "Ask the questions that need asking",
            "Learn how the real world of business works — warts and all"
        ],
        relationships: [
            { name: "Charles Sterling", relation: "Your father" },
            { name: "Alexander Chamberlain", relation: "Fellow young person at the gathering" },
            { name: "Jesse Chamberlain", relation: "Fellow young person at the gathering" },
            { name: "Scott Thoreson Jr.", relation: "Family connection through your father" }
        ]
    },

    // ══════════════════════════════════════════════
    // ALEXANDER — WARD
    // ══════════════════════════════════════════════
    "Alexander": {
        character: "William Chamberlain",
        backstory: "You're a young man under the guardianship of Patricia Chamberlain. You're intelligent, thoughtful, and quietly ambitious. You've grown up on the edges of Dallas high society, observing how wealth and power work from the outside looking in. You're fascinated by business and current events, and tonight's dinner was supposed to be an exciting glimpse into one of Dallas's most prominent families. It's turned into something much darker.",
        whatYouKnow: [
            "Your guardian Patricia is protective but fair. She's taught you to think for yourself.",
            "You've observed Dallas society from a unique perspective — close enough to see it, far enough to see it clearly.",
            "You're good at reading situations and noticing when adults are being evasive.",
            "You know that families like the Thoresons look perfect on the outside but have complicated private lives.",
            "Patricia has made comments about Will Thoreson that suggested she didn't fully trust him."
        ],
        whatYouCanShare: [
            { info: "Patricia has always said you can learn more about a person by watching what they do when they think nobody's looking.", when: "Anytime" },
            { info: "I've been watching the room. Not everyone is reacting the way you'd expect to these revelations.", when: "Act 2 or later" },
            { info: "I don't know the family history, but the pattern seems clear — someone built a fortune on lies, and now it's catching up.", when: "After major revelations" },
            { info: "Sometimes the youngest person in the room sees things the clearest. Just saying.", when: "Anytime" }
        ],
        howToPlay: "<strong>Tone:</strong> Quiet, observant, surprisingly insightful for your age.<br><br><strong>Key behaviors:</strong> Listen more than you speak, but when you do speak, make it count. You're an observer — share what you notice about people's behavior and reactions. Defer to Patricia but think for yourself.<br><br><strong>Important:</strong> You and the other young characters (Bradey, Jesse) can form a natural investigative team, sharing observations the adults might dismiss.",
        goals: [
            "Understand what's happening with this family",
            "Make Patricia proud by being observant and thoughtful",
            "Share your observations when they matter",
            "Learn from this experience"
        ],
        relationships: [
            { name: "Patricia Chamberlain", relation: "Your guardian" },
            { name: "Jesse Chamberlain", relation: "Fellow ward — like a brother" },
            { name: "James Sterling", relation: "Fellow young person at the gathering" }
        ]
    },

    // ══════════════════════════════════════════════
    // JESSE — WARD
    // ══════════════════════════════════════════════
    "Jesse": {
        character: "Robert Chamberlain",
        backstory: "You're the older of Patricia Chamberlain's two wards. You're loyal, protective, and more emotionally attuned than people give you credit for. You've developed a strong bond with Patricia and feel a responsibility to watch out for Alexander. You're less interested in business than in people — you care about who's honest and who's not. Tonight, your instincts are telling you something is very wrong.",
        whatYouKnow: [
            "Patricia has raised you well. You trust her judgment about people.",
            "You're good at reading emotions — you notice when people are lying, nervous, or hiding something.",
            "You've overheard Patricia say that some debts 'can't be repaid with money.'",
            "You don't know the Thoreson family well, but you've sensed tension beneath the surface at previous gatherings.",
            "Your instincts are sharp. When something feels wrong, you're usually right."
        ],
        whatYouCanShare: [
            { info: "I don't know these people well, but something feels wrong. Not sad — wrong. Like some people at this party expected this to happen.", when: "Act 1 or 2" },
            { info: "I've been watching Miranda. Her expression hasn't changed all night. Everyone else is shocked or grieving. She's... calm.", when: "Act 2 or later" },
            { info: "Patricia always says the truth eventually comes out. I think she's been waiting for something like this.", when: "Anytime" },
            { info: "People think young people don't notice things. We notice everything.", when: "Anytime" }
        ],
        howToPlay: "<strong>Tone:</strong> Earnest, protective, emotionally perceptive. You feel things deeply.<br><br><strong>Key behaviors:</strong> Watch people's faces and body language. Report what you observe. Be protective of Alexander and Patricia. Trust your gut — your instincts are good.<br><br><strong>Important:</strong> Your observation about Miranda's calm demeanor is a key piece of the puzzle. Don't be afraid to voice it.",
        goals: [
            "Protect Alexander and Patricia",
            "Share what you observe about people's behavior",
            "Trust your instincts when something feels wrong",
            "Help uncover the truth"
        ],
        relationships: [
            { name: "Patricia Chamberlain", relation: "Your guardian — you're deeply loyal to her" },
            { name: "Alexander Chamberlain", relation: "Fellow ward — you look out for him" },
            { name: "James Sterling", relation: "Fellow young person at the gathering" }
        ]
    }
};
