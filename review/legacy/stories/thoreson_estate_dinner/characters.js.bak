// ============================================================
// THOR'S MURDER MYSTERIES — CHARACTER DATABASE
// Story: The Thoreson Estate Dinner (thoreson)
// Version: 2.0 — gender-fluid, token-based name system
// ============================================================
//
// KEY FORMAT: character name slug — no IRL player names anywhere
//
// NAME VARIANTS:
//   nameVariants: { female: "Miranda Longfellow", male: "Milo Longfellow" }
//   Resolved at runtime via getCharacterName(slug)
//   Default gender = 'female' if unresolved
//
// TOKEN SYSTEM:
//   Reference other characters in text as {{slug}}
//   e.g. "{{raymond_hammond}} handed over the ledger"
//   renderText() replaces all tokens before display
//   NEVER write character names directly in backstory/memory/canShare text
//   NEVER write he/she/him/her — rewrite using the name token
//
// PROGRESSIVE REVEAL:
//   unlockedBy: null       → Always visible
//   unlockedBy: "ledger"   → Visible only after revelation toggled ON
//
// REVELATION IDS:
//   Act 1: willsDeath, ledger, forgedDocs, stolenCompany, bankStatement
//   Act 2: affair, secretHeir, margaretsLetter, birthCertificate
//   Act 3: wolfsbane, mirandaIdentity, finalConfession
//   David pipeline: djCountyClerk, djCoroner, djPinkerton
//
// CHARACTER ROSTER:
//   miranda_longfellow   — The Killer (Legal skill)
//   scott_thoreson       — Red Herring (no skill)
//   walter_lippman       — Secret Heir (Journalism skill)
//   david_richardson     — Evidence Pipeline
//   charlotte_waverly    — Bartender skill
//   patricia_chamberlain — Medical skill
//   dorothy_wells        — Botany skill
//   vivienne_ashford     — French skill
//   eleanor_thoreson     — The Widow (no skill)
//   raymond_hammond      — Accounting skill
//   marcus_brennan       — Banking skill
//   victoria_ashworth    — no skill
//   elizabeth_monroe     — OPTIONAL, cut first if needed
// ============================================================

const characterDatabase = {

    // ============================================================
    // MIRANDA LONGFELLOW — The Killer
    // ============================================================
    "miranda_longfellow": {
        name: "Miranda Longfellow",
        nameVariants: { female: "Miranda Longfellow", male: "Milo Longfellow" },
        publicDesc: "{{scott_thoreson}}'s legal assistant for nearly ten years. Professional, precise, and discreet. Has been present for every significant family moment — and most of the significant paperwork.",
        hiddenSkills: ["Legal"],
        note: "You know everything. You are not in a hurry. Let the investigation find you — don't chase it. Your Legal skill gives you a natural reason to handle documents and weigh in on findings. Use it. The slower the truth comes out, the better the story.",
        backstory: "Your name is Miranda Hartley. You have not used that name in fifteen years.\n\nYour father was Robert Hartley. In 1902, Robert and William Thoreson co-founded what would become one of Dallas's most successful toy companies — Thoreson and Hartley Toys. They were partners and close friends. Robert was an honest man. Hardworking. Devoted to your mother Margaret and to you.\n\nWilliam Thoreson began an affair with your mother sometime before 1910. Robert discovered it — along with something worse. On March 13th, 1910, a document was filed transferring Robert's full ownership stake in the company to William Thoreson. Robert's signature was on it. It was not Robert's signature. Two days later, Robert Hartley was found dead. The investigation lasted a week. It was ruled a suicide. William Thoreson was cleared on March 22nd. The company became Thoreson Toys. Robert's name was erased from everything.\n\nYou were fourteen years old.\n\nYour mother went to William afterward. Margaret was carrying William's child and begged him to help both of her children — you, Robert's daughter, and the baby. William refused you entirely. He established a private trust for his own child — born March 5th, 1911, named Taylor — and sent your mother away. Abandoned and heartbroken, Margaret turned to whatever comfort she could find. Margaret died in 1914. You were eighteen, alone, trying to care for a three-year-old half-sibling. The state decided you were unfit. They separated you. Taylor went to distant relatives with a trust fund. You got nothing.\n\nTaylor grew up with the trust money, changed names to {{walter_lippman}}, and built a life as a journalist. You found the name in William's files years ago. {{walter_lippman}} is here tonight — sitting in this room — with no idea who you are.\n\nYou put yourself through college and law school without help from anyone. In 1920 you changed your name to Miranda Longfellow. In 1925 you got yourself hired as {{scott_thoreson}}'s legal assistant. You spent ten years inside this house, inside these files, reading every document William Thoreson thought was safely hidden. The forged transfer. The ledger with its monthly payments to T.H. The love letters from your mother. The trust fund documents. You watched William grow old and respected and unbothered.\n\nLast summer you traveled to Switzerland. Wolfsbane grows wild in the Alps — purple flowers along the mountain trails, beautiful and poisonous down to the root. You brought some home. You dried it. You ground it.\n\nTonight, before the guests arrived, you put it in his drink.\n\nWilliam is dead. You are at peace with that. You are not a villain. You are a daughter.\n\nYou are good at stillness. Over ten years inside this household you have become fluent in the Thoreson family's rhythms, their particular silences. You have been consequential the entire time. They just didn't know it.",
        memories: [],
        canShare: [
            { text: "Will told me he was planning something important tonight. He seemed almost nervous about it.", unlockedBy: null },
            { text: "Yes, I traveled to Switzerland last summer. It was a lovely trip — the mountains were beautiful.", unlockedBy: null }
        ],
        secret: {
            trueIdentity: "Miranda Hartley — Robert Hartley's daughter",
            carryingItems: "Your travel journal. Always on you. Will be found if someone searches you in Act 3."
        },
        relationships: [
            { name: "{{scott_thoreson}}", relation: "Your employer for 10 years" },
            { name: "William Thoreson Sr.", relation: "The man who destroyed your family (deceased)" },
            { name: "Robert Hartley", relation: "Your father (died 1910)" },
            { name: "Margaret Hartley", relation: "Your mother (died 1914)" },
            { name: "{{walter_lippman}}", relation: "Your half-sibling — in this room, no idea who you are" }
        ],
        items: ["Travel journal (always on you — searchable Act 3)"],
        finalEntry: {
            context: "This is your final monologue. Read it aloud to the room after you are confronted. You are not defending yourself — you are explaining yourself. Take your time. The room will be quiet.",
            text: "March 21st, 1935.\n\nMy name is Miranda Hartley. Robert's daughter.\n\nI have sat in this parlor tonight and watched all of you slowly piece together my father's story. The letterhead. The ledger. The forged documents. I watched {{scott_thoreson}}'s face change as a father became a stranger. I watched every layer of the lie come off — the stolen company, the affair, the child William refused to claim, the child William secretly funded. Lies built on top of lies built on top of destroyed lives.\n\nMy father was Robert Hartley. Robert built this company alongside William Thoreson in 1902. They were partners. Friends. And William forged Robert's name on a transfer document, took everything Robert had built, and Robert was dead within twenty-four hours. I was fourteen years old.\n\nMy mother went to William afterward. Margaret was carrying his child. Margaret begged William to help both of us. William set up a trust fund for his own child and sent my mother away with nothing. Margaret died four years later. I was eighteen years old, alone, trying to care for a three-year-old half-sibling. The state decided I was unfit. They split us up. Taylor went to distant relatives with a trust fund. I got nothing.\n\nI put myself through law school. I changed my name. And in 1925 I walked into {{scott_thoreson}}'s office and got myself hired. I spent ten years inside these walls. I found the forged documents. I found the ledger. I found my mother's letters in a locked safe. I found the birth certificate that told me the child I once tried to raise was William Thoreson's son.\n\nLast summer I went to Switzerland. Wolfsbane grows wild in the Alps — beautiful purple flowers. I brought some home. I knew what I was going to do with it.\n\nI am not asking for your forgiveness. But I needed you to know — all of you — that the Thoreson fortune was built on a stolen company, a forged signature, and a man who chose to let a partner die rather than face what had been done.\n\nMy father deserved better. My mother deserved better.\n\nI am Miranda Hartley.\n\nAnd now the truth has been set free."
        }
    },

    // ============================================================
    // SCOTT THORESON JR. — Red Herring
    // ============================================================
    "scott_thoreson": {
        name: "Scott Thoreson Jr.",
        nameVariants: { female: "Scottie Thoreson Jr.", male: "Scott Thoreson Jr." },
        publicDesc: "Eldest child of William Thoreson Sr. and the family's attorney of record. A person of integrity who has dedicated a career to managing the family's legal affairs.",
        hiddenSkills: [],
        backstory: "You are the eldest child of William and {{eleanor_thoreson}}, and the family's attorney of record. You studied law at SMU on a partial scholarship — your father wasn't the type to hand things to children when those children could earn them. You built your practice from the ground up, handling wills, property disputes, and contract work for several prominent Dallas families before the Thoreson business became your primary focus. You are methodical by nature. You keep notes. You remember things.\n\nYour father has seemed different lately. Anxious. Emotional in ways he wasn't before. Three weeks ago William called to say planning was underway to make something right — something from a long time ago. William wouldn't say more. You assumed it was the will. You drafted the new language yourself. The updated will explicitly names Taylor Hartley as an acknowledged heir.\n\nYou did not know who Taylor Hartley was when you drafted that document. You do now.\n\nTonight was supposed to be the announcement. Instead, your father is dead.\n\nHere is what makes your position uncomfortable: you drafted the will. You are the family attorney with access to every document in this house. You stood to see your inheritance complicated by the introduction of a new heir. Every person in this room has reason to look at you. You are aware of this. You are also genuinely grieving, genuinely confused, and genuinely determined to find out what happened.\n\n{{miranda_longfellow}} has worked alongside you for nearly ten years. You trust {{miranda_longfellow}} completely. That trust is not going to serve you well tonight.",
        memories: [
            { text: "Your father called three weeks ago. Not about business — something personal. William said there was a wrong from a long time ago that needed to be made right. You assumed it was financial. You did not push for details. You wish now that you had.", unlockedBy: "willsDeath" },
            { text: "You drafted the updated will yourself. The language naming Taylor Hartley as an acknowledged heir came from your father directly. You notarized it. You filed it. At the time you had no idea who Taylor Hartley was. You are beginning to understand.", unlockedBy: "secretHeir", tier: 1 },
            { text: "{{miranda_longfellow}} has been your most trusted colleague for ten years. Every important document in this house has passed through those hands. You are only now considering what that access actually means.", unlockedBy: "mirandaIdentity", tier: 1 }
        ],
        canShare: [
            { text: "Yes, I drafted the updated will. That is my job as family attorney. If I wanted to stop someone from inheriting, I would not need to kill anyone — I would just lose the paperwork.", unlockedBy: null },
            { text: "My father told me three weeks ago he was planning to make something right. He wouldn't say what. I assumed it was financial. I was wrong.", unlockedBy: null }
        ],
        relationships: [
            { name: "William Thoreson Sr.", relation: "Your father (deceased)" },
            { name: "{{eleanor_thoreson}}", relation: "Your mother" },
            { name: "{{miranda_longfellow}}", relation: "Your trusted legal assistant for 10 years" },
            { name: "{{charlotte_waverly}}", relation: "Your spouse" },
            { name: "{{vivienne_ashford}}", relation: "Your cousin on your mother's side" }
        ],
        items: ["Copy of the updated will (in your jacket pocket)"]
    },

    // ============================================================
    // WALTER LIPPMAN — Secret Heir
    // ============================================================
    "walter_lippman": {
        name: "Walter Lippman",
        nameVariants: { female: "Winifred Lippman", male: "Walter Lippman" },
        publicDesc: "A journalist for the Dallas Herald covering business and society. Known for thorough, honest reporting. Personally invited by William Thoreson Sr.",
        hiddenSkills: ["Journalism"],
        note: "You came tonight knowing Will wanted to tell you something personal. You don't fully understand yet what you are to this family. Let that discovery happen in the room — don't get ahead of it.",
        backstory: "Your byline is {{walter_lippman}}. You have been writing under that name for years and it has become who you are.\n\nYou were born Taylor Hartley on March 5th, 1911, in Dallas, Texas. Your mother was Margaret Hartley. Your biological father was William Thoreson, though you didn't learn that until you were nearly an adult. Your mother died when you were very young. You were raised by distant relatives and told very little about where you came from — only that your mother was gone and that there was a trust fund in your name.\n\nYou asked questions when you were old enough. The answers were always thin. There was a man named Hartley — your mother's husband, not your father. Hartley died. There was a scandal. Beyond that, nothing.\n\nWhen you were eighteen a lawyer looked into the trust. The originating signature was William Thoreson's. That was the first time you heard that name attached to your life. You began writing under the name {{walter_lippman}} — a pen name that became a professional identity, then simply the name everyone knows.\n\nYou became a journalist. You are good at it. Six months ago William Thoreson personally reached out and invited you to tonight's dinner. William said there was an announcement — something important, something that concerned you specifically. You came because you have spent your entire life not knowing the full story.\n\nYou are a better journalist than most people realize because you have always been motivated by something more personal than ambition. Every story you've chased has been, in some way, a version of the same story — who gets to decide what is true, whose name ends up attached to things they built.",
        memories: [
            { text: "In years covering Dallas business you heard whispers more than once that Thoreson Toys hadn't started the way Will told it — that there had been another name on the original company. You could never find anything on the record to confirm it. You are finding it now.", unlockedBy: "stolenCompany" },
            { text: "Your legal name is Taylor James Hartley. Born March 5th, 1911. That birth date is circled on the calendar in the study. The ledger entries marked T.H. with monthly payments spanning twenty-four years — that money came to you. William Thoreson was your father. The person who destroyed the Hartley family was your father.", unlockedBy: "birthCertificate", tier: 1 }
        ],
        canShare: [
            { text: "Will personally invited me. Said he had an announcement that would be the story of the year. That is unusual for someone so private.", unlockedBy: null },
            { text: "The early history of Thoreson Toys was always unusually difficult to trace. I tried more than once. Now I understand why.", unlockedBy: "stolenCompany" }
        ],
        relationships: [
            { name: "William Thoreson Sr.", relation: "Invited you personally — now deceased. You are beginning to understand why." },
            { name: "{{scott_thoreson}}", relation: "The family attorney" },
            { name: "{{miranda_longfellow}}", relation: "The legal assistant — met briefly tonight" }
        ],
        items: ["Notepad and pen"]
    },

    // ============================================================
    // DAVID RICHARDSON — Evidence Pipeline
    // ============================================================
    "david_richardson": {
        name: "David Richardson",
        nameVariants: { female: "Diana Richardson", male: "David Richardson" },
        publicDesc: "A cousin on the Thoreson side and a licensed private investigator. Using connections to help the family get answers.",
        hiddenSkills: [],
        note: "You are the evidence pipeline — documents and reports come through you at each act transition, not all at once. Make it a moment each time — step away, take the call, react before you share. The timing matters as much as the content.",
        backstory: "You are a cousin on the Thoreson side — close enough to be at every family gathering, far enough removed to have made your own way outside the toy business. You became a licensed private investigator eight years ago after a stint working insurance adjustments convinced you that finding things out suited you better than selling policies. You work cases around Dallas — missing persons, insurance fraud, the occasional domestic matter. You are methodical, patient, and good at asking questions that don't sound like questions.\n\nYou were invited tonight like everyone else. William said it was going to be a special evening. Then William died, and everything changed.\n\nThe moment it happened you started making calls. You have a contact at the county clerk's office who can pull original business filings on short notice. You have someone at the coroner's office who owes you a favor. You have a Pinkerton agent who runs background checks for a reasonable fee. While everyone else is still absorbing the shock, you are already working.\n\nYou became a private investigator because you are constitutionally incapable of leaving a question unanswered. You don't stop. You follow the thread even when following it is inconvenient.",
        memories: [
            { text: "DALLAS COUNTY CLERK'S OFFICE\n─────────────────────\nPer your request, we have pulled the original business registration filed March 3rd, 1902.\n\nThe entity was registered as THORESON & HARTLEY TOYS, a partnership between William A. Thoreson and Robert J. Hartley, equal shares. No dissolution paperwork was ever filed with this office. No record of partnership buyout or transfer exists in our index.\n\n— J. Fowler, Dallas County Clerk", unlockedBy: "djCountyClerk" },
            { text: "DALLAS COUNTY CORONER'S OFFICE\n─────────────────────\nDave —\n\nPreliminary autopsy on the Thoreson matter is complete. Toxicology is out of town until Thursday so no full chemical breakdown tonight.\n\nFull report faxed to the Thoreson residence. Someone with medical training should interpret it.\n\nAlso — small brass key found in the deceased's left jacket pocket. No corresponding lock on the person. Sending it back with you.\n\n— F. Garrett, Dallas County Coroner", unlockedBy: "djCoroner" },
            { text: "PINKERTON NATIONAL DETECTIVE AGENCY\n─────────────────────\nBackground checks complete. Mostly clean. Two items of note.\n\nSUBJECT 1: {{walter_lippman}}, journalist. Pen name only — legal name is Taylor James Hartley, born March 5th 1911, Dallas TX.\n\nSUBJECT 2: {{miranda_longfellow}}, legal assistant. Legal name change filed 1920. Born Miranda Elaine Hartley, 1896, Dallas TX.\n\n— Pinkerton National Detective Agency, Dallas Office", unlockedBy: "djPinkerton" }
        ],
        canShare: [
            { text: "I've got contacts at the coroner's office and at Pinkerton. I've been making calls since this started. Paperwork is coming.", unlockedBy: null }
        ],
        relationships: [
            { name: "{{scott_thoreson}}", relation: "Your cousin" },
            { name: "{{eleanor_thoreson}}", relation: "Your aunt" },
            { name: "William Thoreson Sr.", relation: "Your uncle (deceased)" }
        ],
        items: []
    },

    // ============================================================
    // CHARLOTTE WAVERLY — Bartender Skill
    // ============================================================
    "charlotte_waverly": {
        name: "Charlotte Waverly",
        nameVariants: { female: "Charlotte Waverly", male: "Charles Waverly" },
        publicDesc: "{{scott_thoreson}}'s spouse. Warm, practical, and the one keeping things running tonight.",
        hiddenSkills: ["Bartender"],
        backstory: "You grew up in Fort Worth — your father ran a dry goods store and your mother kept the books, which is where you learned that the people who actually run things are rarely the ones with their names on the door. You met {{scott_thoreson}} at a mutual friend's dinner party in 1927 and married two years later. You are practical, composed, and quietly sharp.\n\nYou have always been the kind of person other people lean on without realizing they're doing it. At family gatherings you are the one who remembers where the extra chairs are, who is getting along with whom, and when someone has had enough to drink. A room is a system, and you have always been good at understanding systems.\n\nYou trained briefly as a nurse before the marriage, and you still carry that instinct — the calm that comes from having seen people at their worst and knowing that most situations are survivable. You think clearly under pressure. You do not panic. You are possibly the most useful person in this room right now, and almost no one has thought to ask you anything yet.\n\nYou have learned, over years of marriage into this family, that the Thoresons communicate more in what they don't say than in what they do. Tonight the silences are different. Tonight they mean something new. You are paying very close attention.",
        memories: [
            { text: "William asked you once, privately, whether {{scott_thoreson}} ever talked about the business at home. You said not much. William nodded slowly, like that was either a relief or a disappointment — you couldn't tell which.", unlockedBy: "ledger" },
            { text: "You have served drinks to {{miranda_longfellow}} at a dozen family events over the years. {{miranda_longfellow}} always said thank you. Never made small talk. Most people when nervous fill silence. {{miranda_longfellow}} never did.", unlockedBy: "mirandaIdentity" }
        ],
        canShare: [
            { text: "I notice things. It comes with being the one keeping everything running.", unlockedBy: null }
        ],
        relationships: [
            { name: "{{scott_thoreson}}", relation: "Your spouse" },
            { name: "William Thoreson Sr.", relation: "Your father-in-law (deceased)" },
            { name: "{{eleanor_thoreson}}", relation: "Your mother-in-law" },
            { name: "{{miranda_longfellow}}", relation: "{{scott_thoreson}}'s assistant — always around" }
        ],
        items: []
    },

    // ============================================================
    // PATRICIA CHAMBERLAIN — Medical Skill
    // ============================================================
    "patricia_chamberlain": {
        name: "Patricia Chamberlain",
        nameVariants: { female: "Patricia Chamberlain", male: "Patrick Chamberlain" },
        publicDesc: "An independent person of means and strong will. Protective, perceptive, and doesn't suffer fools.",
        hiddenSkills: ["Medical"],
        backstory: "You spent seventeen years as a registered nurse — first at Baylor University Hospital in Dallas, then as a private duty nurse for several of the city's wealthier families. You have seen the inside of more sick rooms than most people would care to imagine, and you have sat with enough dying people to understand that the body rarely lies, even when the people around it do.\n\nYou left nursing eight years ago when a sibling and a sibling's spouse died within a year of each other, leaving behind two boys. You took them in without hesitation. Not out of obligation, exactly. Out of something closer to recognition. You understood what it was to be the person in the room who does what needs doing.\n\nYour nursing background is not something you advertise in social settings. People do not know what to do with someone who can tell them what's wrong before the doctor arrives. But the knowledge is there, intact, and it does not go away.\n\nYou are at this dinner because you have known the Thoreson family for years through charitable connections, and because William specifically asked you to come. You did not think much of it at the time. You are thinking more of it now.",
        memories: [
            { text: "You remember a conversation with William, years ago, at a charity dinner. William had been drinking more than usual and said something odd — that a person could do something they knew was wrong and still believe they were the best person to have done it. You asked what was meant. William laughed it off. You never forgot it.", unlockedBy: "stolenCompany" },
            { text: "You worked as a private duty nurse for the Ashford family for two years in the early twenties. You know {{eleanor_thoreson}} — née Ashford — well enough to have seen the worst and the best. {{eleanor_thoreson}} was not a person who frightened easily.", unlockedBy: null }
        ],
        canShare: [
            { text: "Don't let sentimentality cloud judgment. If William wronged people, the truth serves everyone — including this family.", unlockedBy: null }
        ],
        relationships: [
            { name: "William Thoreson Sr.", relation: "Family acquaintance (deceased)" },
            { name: "{{eleanor_thoreson}}", relation: "Acquaintance — you nursed the Ashford family" },
            { name: "{{dorothy_wells}}", relation: "Mutual friend through charitable circles" }
        ],
        items: []
    },

    // ============================================================
    // DOROTHY WELLS — Botany Skill
    // ============================================================
    "dorothy_wells": {
        name: "Dorothy Wells",
        nameVariants: { female: "Dorothy Wells", male: "Douglas Wells" },
        publicDesc: "One of the most well-connected people in Dallas society. Has been watching this city for longer than most guests have been alive.",
        hiddenSkills: ["Botany"],
        backstory: "You are eighty-one years old and you have outlived most of the people you loved, which gives you a perspective that is sometimes melancholy and sometimes useful. You remember Dallas when it was a smaller city, when the Thoreson family was just beginning, when William was a young man with ambition and a partner named Hartley that nobody talks about anymore.\n\nYou were born in 1854 in Savannah, Georgia. You came to Texas in 1881 with a spouse who built a modest law practice in Dallas and died in 1919, leaving you comfortable, independent, and extremely clear-eyed about the nature of people.\n\nYou have watched three generations of Dallas families rise and fall. In your experience, the ones that came apart were almost always undone not by misfortune but by a secret kept too long. The weight of it eventually becomes structural. The house starts to lean.\n\nYou are {{eleanor_thoreson}}'s great-aunt, which makes you peripheral enough to the family to have seen it without being entirely inside it. You have always believed that the truth, however painful, is better than comfortable silence.\n\nYou are a person who has always known more than those around you assumed. Men tell you things at dinner parties they would never tell another man, because they have decided you are harmless. You have been gathering intelligence about this city for decades with the same methodical patience you bring to botanical classification. Observe carefully. Label accurately. Never mistake a pretty flower for an innocuous one.",
        knowledge: [
            { text: "Wolfsbane. You know that plant. Your grandmother made you memorize it when you were nine years old. Aconitum — she called it the queen of poisons. Every part of it is lethal. And it does not grow in Texas. It does not grow anywhere in America. Check your Expert Notes — you know exactly what this means.", unlockedBy: "wolfsbane" }
        ],
        memories: [
            { text: "You were there in 1902 when William Thoreson and Robert Hartley announced their partnership. You remember shaking Robert's hand at the reception. A serious man. Careful with words. Proud of what was being built. You never saw Robert again after 1910, and nobody in this city had the decency to ask why.", unlockedBy: "letterhead", tier: 1 },
            { text: "You remember the original incorporation. Thoreson and Hartley, equal shares. Within a year the Hartley name had quietly disappeared from everything. William said the partnership had been dissolved by mutual agreement. You did not believe that then. You certainly do not believe it now.", unlockedBy: "stolenCompany", tier: 2 }
        ],
        canShare: [
            { text: "In my circles, there were always whispers about a woman named Margaret connected to the Thoresons. Nobody ever knew the details.", unlockedBy: null },
            { text: "I have lived long enough to stop being frightened by difficult truths. The thing is what it is. You look at it. You decide what to do.", unlockedBy: null }
        ],
        relationships: [
            { name: "{{eleanor_thoreson}}", relation: "Your great-niece" },
            { name: "{{victoria_ashworth}}", relation: "Friend from society circles" },
            { name: "{{elizabeth_monroe}}", relation: "Friend and fellow long-time Dallas resident" },
            { name: "William Thoreson Sr.", relation: "Social acquaintance of forty years (deceased)" }
        ],
        items: []
    },

    // ============================================================
    // VIVIENNE ASHFORD — French Skill
    // ============================================================
    "vivienne_ashford": {
        name: "Vivienne Ashford",
        nameVariants: { female: "Vivienne Ashford", male: "Vincent Ashford" },
        publicDesc: "{{scott_thoreson}}'s cousin on the mother's side. Recently returned from years living in Paris. Cultured, worldly, and fluent in French.",
        hiddenSkills: ["French"],
        backstory: "You are {{scott_thoreson}}'s cousin on the mother's side — {{eleanor_thoreson}}'s niece. You spent the better part of six years living in Paris, studying at the Ecole des Beaux-Arts and immersing yourself in French language and culture more thoroughly than you ever intended to. You speak French fluently, think in it sometimes, and read it without effort. You came home to Dallas eight months ago, partly because money was running thin and partly because your mother wrote that Uncle Will was planning something important.\n\nParis changed you in ways that are difficult to explain to people who haven't been. Not the art exactly — though you loved the art — but the particular freedom of being nobody. Of walking down a street where no one knew your family or what was expected of you. You became someone slightly different there. Looser. More willing to disagree, to take up space in a conversation.\n\nComing back to Dallas has required a certain amount of reassembly. You are fond of your family and you love your cousins, but you see all of it now with the slight detachment of someone who has lived somewhere else — which means you see it more clearly, and sometimes more critically.\n\nThe Thoresons have always been a family defined by what they don't say. Uncle Will in particular carried something heavy — you noticed it as a child and it was still there when you returned.\n\nYou are better at reading people than you let on. In Paris you spent enough time in rooms where everyone was performing something to develop a very good eye for the gap between what people present and what they actually are.",
        memories: [
            { text: "You remember your mother and {{eleanor_thoreson}} speaking in low voices once when you were small. Your mother said something about a woman Will had known before {{eleanor_thoreson}}. {{eleanor_thoreson}} said the name Margaret and then changed the subject immediately. You had forgotten that completely until just now.", unlockedBy: "margaretsLetter" }
        ],
        canShare: [
            { text: "Uncle Will always seemed like he was carrying something heavy. I assumed it was just the pressure of running a company.", unlockedBy: null },
            { text: "I've been away for six years. I see this family more clearly for it, I think.", unlockedBy: null }
        ],
        relationships: [
            { name: "{{scott_thoreson}}", relation: "Your cousin" },
            { name: "{{eleanor_thoreson}}", relation: "Your aunt" },
            { name: "William Thoreson Sr.", relation: "Your uncle (deceased)" },
            { name: "{{charlotte_waverly}}", relation: "Your cousin's spouse" }
        ],
        items: []
    },

    // ============================================================
    // ELEANOR THORESON — The Widow
    // ============================================================
    "eleanor_thoreson": {
        name: "Eleanor Thoreson",
        nameVariants: { female: "Eleanor Thoreson", male: "Elliott Thoreson" },
        publicDesc: "William Thoreson's spouse of forty years. Dignified in grief, as always dignified in everything.",
        hiddenSkills: [],
        backstory: "You have been Eleanor Thoreson for forty years. Before that you were Eleanor Ashford — a name from a good family, modest money, and a particular kind of Dallas upbringing that taught you to be gracious, composed, and careful about what you said in rooms where it might be repeated.\n\nYou met William when you were twenty-two. Charming, ambitious, absolutely certain of himself in a way you found first attractive and then, over forty years, occasionally exhausting. You built a life together. You raised a family. You chaired committees, hosted dinners, and learned to be fluent in the particular silence that a long marriage produces — the silence that means everything is fine, the silence that means something is wrong but we are not discussing it, and the silence that means there are things you have chosen not to know.\n\nThat last silence is the one that has defined your marriage more than you have ever admitted to anyone.\n\nYou have known, in the way that spouses know things without being told, that William carried something from the early years of the company. Something that happened before {{scott_thoreson}} was born. You asked once, early in the marriage. William told you it was handled. You accepted that. You chose to accept it. You told yourself the company was real, the life was real, the family was real, and that whatever came before was past.\n\nTonight you are sitting in your own parlor watching the past walk through the door and introduce itself.\n\nYou are a person who has spent forty years being strong for this family. Tonight you are going to need to decide how much of what you know — and what you have always suspected — you are willing to say out loud.",
        memories: [
            { text: "William told you once, years ago, that there had been a partner in the early days. That the partner had left under difficult circumstances. That it was handled. You asked what difficult meant. William said it was a long time ago. You never asked again. You have been sitting with that answer for thirty years.", unlockedBy: "stolenCompany", tier: 1 },
            { text: "You knew about Margaret. Not everything — not the child, not the depth of it. But you knew the name. You heard it once in an argument and you chose to bury it. Whatever happened between William and Margaret Hartley, you decided it was over. You are reconsidering that decision.", unlockedBy: "affair", tier: 1 },
            { text: "{{miranda_longfellow}} has been in this house for ten years. You always thought something was slightly off — not wrong, just a quality of attention that seemed like more than a legal assistant ought to have. You said nothing because {{scott_thoreson}} trusted {{miranda_longfellow}} completely. You are thinking about that now.", unlockedBy: "mirandaIdentity", tier: 1 }
        ],
        canShare: [
            { text: "William was a good man in many ways. But good people can do terrible things and spend the rest of their lives trying to outrun them.", unlockedBy: null },
            { text: "I have known something was wrong since long before tonight. I chose not to look directly at it. That was my mistake.", unlockedBy: "stolenCompany" }
        ],
        relationships: [
            { name: "William Thoreson Sr.", relation: "Your spouse of forty years (deceased)" },
            { name: "{{scott_thoreson}}", relation: "Your child" },
            { name: "{{charlotte_waverly}}", relation: "Your child's spouse" },
            { name: "{{vivienne_ashford}}", relation: "Your niece" },
            { name: "{{dorothy_wells}}", relation: "Your great-aunt" },
            { name: "{{miranda_longfellow}}", relation: "{{scott_thoreson}}'s assistant — in your home for ten years" }
        ],
        items: []
    },

    // ============================================================
    // RAYMOND HAMMOND — Accounting Skill
    // ============================================================
    "raymond_hammond": {
        name: "Raymond Hammond",
        nameVariants: { female: "Rachel Hammond", male: "Raymond Hammond" },
        publicDesc: "Business Manager at Thoreson Toys for fifteen years. Handles operations, vendor relationships, and day-to-day management.",
        hiddenSkills: ["Accounting"],
        note: "You know about the European deal and the investor losses. Don't lead with it — let it come out when the financial records surface. You're not hiding anything. You just work there.",
        backstory: "You have been the business manager at Thoreson Toys for fifteen years. You handle the practical side of the company — vendor relationships, shipping logistics, staffing, facilities, the ten thousand details that keep an operation running. You are organized, reliable, and proud of the fact that in fifteen years you have never missed a deadline or lost a shipment.\n\nYou studied accounting before moving into the management role — numbers are your native language. You can read a balance sheet the way other people read a newspaper, and you know what it looks like when figures have been arranged to obscure something rather than illuminate it.\n\nWilliam Thoreson hired you personally and you have always respected William. Demanding but fair, and trusting with the daily operation — with one conspicuous exception. William kept the financial ledgers personally. Locked in an office. In fifteen years you have never had full access to the company's accounting records. You assumed it was how William operated. You never pushed it.\n\nSix months ago something changed. A European distribution deal collapsed and the company took a significant loss. William became quieter, more private. Two investors began sending demand letters. Tonight was supposed to be a resolution of some kind. Now William is dead and you are realizing there may be quite a lot about this company you were deliberately kept away from.\n\nWhen the ledger surfaces tonight, you will be able to read it properly. What you find there is going to reframe fifteen years of your professional life.",
        memories: [
            { text: "William asked you once to retrieve a box of old contracts from storage — early company documents, pre-1910. William went through them alone and had you return them the same day. William seemed shaken afterward in a way you had never seen. That was three weeks ago. You have been wondering about it since.", unlockedBy: "forgedDocs", tier: 2 },
            { text: "Fifteen years working for this company, and William never once let you near the books. You thought it was a control thing. Looking at what's in that ledger now — the payments, the dates, the initials — you understand it was something else entirely. Someone did not want an accountant looking too closely.", unlockedBy: "ledger", tier: 1 }
        ],
        canShare: [
            { text: "I've worked at Thoreson Toys for fifteen years, but Will always did the books personally. Kept the ledgers locked away. I never had access — and now I'm wondering why.", unlockedBy: null },
            { text: "Something happened about six months ago — a European deal fell apart. William got very quiet after that.", unlockedBy: null }
        ],
        relationships: [
            { name: "William Thoreson Sr.", relation: "Your employer of fifteen years (deceased)" },
            { name: "{{scott_thoreson}}", relation: "Family attorney — worked together on company matters" },
            { name: "{{marcus_brennan}}", relation: "Investor — seen at company functions, now asking hard questions" },
            { name: "{{victoria_ashworth}}", relation: "Investor — seen at company functions, now asking hard questions" }
        ],
        items: []
    },

    // ============================================================
    // MARCUS BRENNAN — Banking Skill
    // ============================================================
    "marcus_brennan": {
        name: "Marcus Brennan",
        nameVariants: { female: "Margaret Brennan", male: "Marcus Brennan" },
        publicDesc: "A successful Dallas businessperson with a significant stake in Thoreson Toys. Analytical, measured, and protective of invested money.",
        hiddenSkills: ["Banking"],
        backstory: "You inherited a modest sum and turned it into a considerably larger one through careful investments and a talent for reading people that has served you well in rooms where most people are too busy talking to listen. You have been invested in Thoreson Toys for four years. The returns were excellent until they weren't.\n\nYou understand how money moves, how accounts can be structured to show one thing while concealing another, and what it looks like when a company's books have been managed to protect secrets rather than communicate truth. That expertise is about to become very relevant.\n\nSix months ago William Thoreson made a reckless decision with company capital and the European deal evaporated. You and {{victoria_ashworth}} lost real money. You are not a person who loses money quietly. You have been pursuing answers for months through proper channels. William kept putting you off.\n\nYou came tonight expecting a confrontation. Instead you walked into a murder. You are annoyed, you are composed, and you are paying very close attention to everything happening in this room.",
        memories: [
            { text: "William called you personally about a month before tonight to apologize for delays. William sounded genuinely tired — not defensive, the way people usually sound when they owe money, but something older than that. Like a person settling accounts that had been avoided for a long time.", unlockedBy: "ledger" },
            { text: "You know what a fraudulent transfer looks like. Looking at the 1910 filing now — the signature, the notarization, the dates — you can see the construction of it. Someone very careful did this. But not careful enough.", unlockedBy: "forgedDocs", tier: 1 }
        ],
        canShare: [
            { text: "Yes, the European deal lost money. Yes, I was angry. But I'm a businessperson — dead people don't write checks.", unlockedBy: null },
            { text: "I know what it looks like when a company's books have been kept to hide something. I've been looking at these numbers for four years. I missed it.", unlockedBy: "ledger" }
        ],
        relationships: [
            { name: "{{victoria_ashworth}}", relation: "Fellow investor — coordinated on Thoreson matters for years" },
            { name: "{{raymond_hammond}}", relation: "The business manager" },
            { name: "William Thoreson Sr.", relation: "Company founder (deceased)" },
            { name: "{{scott_thoreson}}", relation: "The family attorney" }
        ],
        items: []
    },

    // ============================================================
    // VICTORIA ASHWORTH — no skill
    // ============================================================
    "victoria_ashworth": {
        name: "Victoria Ashworth",
        nameVariants: { female: "Victoria Ashworth", male: "Victor Ashworth" },
        publicDesc: "A sharp businessperson and Thoreson Toys investor. Active in Dallas society with a keen eye for detail.",
        hiddenSkills: [],
        backstory: "You come from old Dallas money — not a fortune, but enough to open the right doors and enough sense to know which ones to walk through. You married well and invested wisely ever since. You have been a shareholder in Thoreson Toys for six years and an active presence in Dallas business circles for longer than that. You know how companies work. You know how the people who run companies work. You have made a career of understanding the difference between the two.\n\nYou and {{marcus_brennan}} have coordinated on Thoreson investments for years. {{marcus_brennan}} handles the numbers. You handle the people. Between the two of you, very little gets past unnoticed — or so you believed until six months ago, when the European deal collapsed and eight thousand dollars of investor capital evaporated overnight. You have been asking questions since then. William kept putting you off. Tonight was supposed to be the night you finally got answers.\n\nYou came expecting a confrontation with a living person. Instead you are sitting in a room with a dead one.\n\nYou have been accused, more than once, of being cold. You prefer the word precise. You do not make decisions based on what you wish were true. You do not extend trust because someone seems trustworthy — you extend it because they have demonstrated it, incrementally, over time. The people who have called you cold are usually the ones who wanted you to skip that last step.",
        memories: [
            { text: "You have invested in twelve companies over the past fifteen years. Thorough due diligence every time. You never found anything irregular in the Thoreson books. That is either because William was very careful or because you didn't look in the right places. You are not sure which possibility bothers you more.", unlockedBy: "stolenCompany", tier: 2 },
            { text: "{{miranda_longfellow}} was always present at company functions. Always professional. Always slightly at the edge of the room, watching. You remarked on it once to {{marcus_brennan}} — said there was something unusual about the quality of attention. {{marcus_brennan}} said you were being uncharitable. You were not being uncharitable.", unlockedBy: "mirandaIdentity" }
        ],
        canShare: [
            { text: "Yes, we lost money. Yes, we wanted answers. But killing someone over a business deal? I take people to court. I don't take their lives.", unlockedBy: null },
            { text: "I have spent years in rooms full of people performing confidence they don't have. I know what it looks like. Several people in this room tonight are performing something.", unlockedBy: null }
        ],
        relationships: [
            { name: "{{marcus_brennan}}", relation: "Fellow investor and business ally" },
            { name: "{{raymond_hammond}}", relation: "The business manager" },
            { name: "William Thoreson Sr.", relation: "Company founder (deceased)" },
            { name: "{{dorothy_wells}}", relation: "Friend from society circles" }
        ],
        items: []
    },

    // ============================================================
    // ELIZABETH MONROE — Optional character (cut first if needed)
    // ============================================================
    "elizabeth_monroe": {
        name: "Elizabeth Monroe",
        nameVariants: { female: "Elizabeth Monroe", male: "Elliot Monroe" },
        publicDesc: "A fixture of Dallas society and the life of every gathering. Knows everyone, remembers everything, and makes it all look effortless.",
        hiddenSkills: [],
        note: "OPTIONAL CHARACTER — cut first if the guest count is below 12. The mystery functions without this role.",
        backstory: "You are the most fun person in the room and you have been the most fun person in the room for approximately three decades running. This is not an accident. It is a skill you have cultivated with the same discipline others put into piano or needlepoint, and you are considerably better at it.\n\nYou grew up in Dallas with enough money to get into the right rooms and enough charm to stay in them. You have known the Thoresons for twenty years — William and {{eleanor_thoreson}} through charity boards and dinner parties and the general overlap of people who run in the same circles in a city this size. You are not family. You are something more useful: a friend of the family who is invited to everything and expected to keep nothing serious for longer than it takes to find the next drink.\n\nThat reputation is mostly deserved. You do love a party. What people tend to underestimate is that you are also paying very close attention. You have spent twenty years at Dallas dinner parties — you know which marriages are in trouble, which business deals went sideways, which families are living past their means. You know these things not because you went looking for them but because people tell you things. You are easy to talk to. You do not seem like someone who files information away.\n\nYou have heard the name Hartley before, a long time ago, at a party where someone had too much to drink and said something they clearly regretted. You did not think much of it at the time. You are thinking about it now.\n\nYour goal tonight, as always, is to have a good time. You are flexible about what that looks like.",
        memories: [
            { text: "You remember when the newspaper ran the story about Robert Hartley's death in 1910. A short piece — barely two inches of column. The investigation had closed in under a day. At the time you thought nothing of it. You are thinking quite a lot about it now.", unlockedBy: "stolenCompany", tier: 2 },
            { text: "You have watched {{eleanor_thoreson}} tonight with the particular attention of someone who has known a person for twenty years. {{eleanor_thoreson}} is not surprised by what is being revealed. Shocked, yes — but not surprised. There is a difference. You know that difference.", unlockedBy: "affair", tier: 2 }
        ],
        canShare: [
            { text: "I know everyone in this city and I remember everything I've ever heard. Tonight is testing the limits of that considerably.", unlockedBy: null },
            { text: "I heard the name Hartley once, years ago, at a party. Someone said it and immediately wished they hadn't. I filed it away. I always file things away.", unlockedBy: "stolenCompany" }
        ],
        relationships: [
            { name: "{{eleanor_thoreson}}", relation: "Friend of twenty years" },
            { name: "{{dorothy_wells}}", relation: "Fellow long-time Dallas resident" },
            { name: "William Thoreson Sr.", relation: "Social acquaintance of twenty years (deceased)" },
            { name: "{{scott_thoreson}}", relation: "Watched this one grow up" }
        ],
        items: []
    }

};
