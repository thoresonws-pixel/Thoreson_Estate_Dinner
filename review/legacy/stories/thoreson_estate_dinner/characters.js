// ============================================================
// THOR'S MURDER MYSTERIES — CHARACTER DATABASE
// Story: The Thoreson Estate Dinner (thoreson)
// Version: 4.0
// ============================================================
//
// ROSTER (12 characters, elizabeth_monroe optional):
//   miranda_longfellow   — Legal Manager         PRIMARY: Legal
//   scott_thoreson       — Eldest Son            BACKUP: any
//   walter_lippman       — Journalist            PRIMARY: Journalism
//   david_richardson     — Private Investigator  PRIMARY: Investigation (pipeline)
//   patricia_chamberlain — Family Friend         PRIMARY: Medical
//   dorothy_wells        — Dallas Elder          PRIMARY: Botany
//   vivienne_ashford     — The Cousin            PRIMARY: French
//   raymond_hammond      — Business Manager      PRIMARY: Accounting
//   charles_sterling     — Old Friend            PRIMARY: Banking
//   marcus_brennan       — Investor              BACKUP: any
//   victoria_ashworth    — Investor              BACKUP: any
//   elizabeth_monroe     — Socialite             BACKUP: any (optional)
//
// KILLER/HEIR ELIGIBLE (pool of 6):
//   miranda_longfellow, walter_lippman, vivienne_ashford,
//   raymond_hammond, elizabeth_monroe, marcus_brennan
//
// TOKEN SYSTEM: Use {{slug}} for all character name references.
// NO pronouns anywhere. NO skill references in base backstories.
// ============================================================

var characterDatabase = {

    // ============================================================
    // MIRANDA LONGFELLOW — Legal Manager
    // ============================================================
    "miranda_longfellow": {
        name: "Miranda Longfellow",
        nameVariants: { female: "Miranda Longfellow", male: "Milo Longfellow" },
        picker: { role: "Legal Manager, Thoreson Estate", involvement: "heavy", isKiller: false },
        cocktailProfile: {
            from:         "Galveston, Texas. Moved to Dallas in 1920 when she changed her name.",
            career:       "Legal manager for the Thoreson estate. Handles all filings, contracts, and correspondence.",
            hobby:        "Reads extensively — history and law, mostly. Has a small but carefully chosen library.",
            family:       "Unmarried. No children. No family she mentions.",
            knowsWilliam: "Has worked for the Thoreson family for nearly ten years. William trusted her with everything.",
            quiz: {
                question: "What does Miranda do for the Thoreson family?",
                correct:  "Manages all their legal affairs",
                options:  ["Manages all their legal affairs", "Handles their investments", "Runs the household staff", "Works as their personal accountant"]
            },
        },
        publicDesc: "The Thoreson estate's legal manager for nearly ten years. Professional, precise, and discreet. Has been present for every significant family moment — and most of the significant paperwork.",
        hiddenSkills: [],
        backstory: "You have managed the legal affairs of the Thoreson estate for nearly ten years. You know where every document is kept, every filing, every secret William thought was safely locked away. You are good at stillness. At watching. At being present without being noticed.",
        memories: [],
        canShare: [
            { text: "Will told me he was planning something important tonight. He seemed almost nervous about it.", unlockedBy: null },
            { text: "Yes, I traveled to Switzerland last summer. It was a lovely trip — the mountains were beautiful.", unlockedBy: null }
        ],
        relationships: [
            { name: "{{scott_thoreson}}", relation: "The eldest son — you have worked alongside the family for ten years" },
            { name: "William Thoreson Sr.", relation: "Your employer for ten years (deceased)" }
        ],
        items: ["Travel journal (always on you — searchable Act 3)"]
    },

    // ============================================================
    // SCOTT THORESON JR. — Eldest Son
    // ============================================================
    "scott_thoreson": {
        name: "Scott Thoreson Jr.",
        nameVariants: { female: "Sylvia Thoreson Jr.", male: "Scott Thoreson Jr." },
        picker: { role: "Eldest Son, Managing the Family Business", involvement: "heavy", isKiller: false },
        cocktailProfile: {
            from:         "Born and raised in Dallas.",
            career:       "Attorney. Studied law at SMU, built his own practice, now focuses almost entirely on Thoreson family matters.",
            hobby:        "Woodworking. Keeps a small workshop behind the house.",
            family:       "Married to Clara for six years. No children yet.",
            knowsWilliam: "His father. Closest thing to a business partner William ever had.",
            quiz: {
                question: "What is Scott's profession?",
                correct:  "Attorney",
                options:  ["Army officer", "Attorney", "Journalist", "Banker"]
            },
        },
        publicDesc: "William Thoreson's eldest child. Has spent years learning the family business from the inside — operations, relationships, the day-to-day of keeping Thoreson Toys running.",
        hiddenSkills: [],
        backstory: "You are William's eldest child and have spent years managing the family business under your father's guidance. You know the company, the investors, the employees. Three weeks ago your father called to say he was planning to make something right — something from a long time ago. You did not push for details. You wish now that you had.",
        memories: [
            { text: "Your father called three weeks ago — not about business. William said there was a wrong from a long time ago that needed to be made right. You did not push for details. You wish now that you had.", unlockedBy: "willsDeath" },
            { text: "{{miranda_longfellow}} has been the most trusted person in this household for ten years. Every important document has passed through those hands. You are only now considering what that access actually means.", unlockedBy: "mirandasIdentity", tier: 1 }
        ],
        canShare: [
            { text: "My father told me three weeks ago he was planning to make something right. He wouldn't say what.", unlockedBy: null },
            { text: "I have run this business alongside my father for years. I thought I knew everything about it.", unlockedBy: null }
        ],
        relationships: [
            { name: "William Thoreson Sr.", relation: "Your father (deceased)" },
            { name: "{{miranda_longfellow}}", relation: "The estate's legal manager — trusted for ten years" },
            { name: "{{vivienne_ashford}}", relation: "Your cousin on your mother's side" },
            { name: "{{raymond_hammond}}", relation: "Your business manager for fifteen years" }
        ],
        items: []
    },

    // ============================================================
    // WALTER LIPPMAN — Journalist
    // ============================================================
    "walter_lippman": {
        name: "Walter Lippman",
        nameVariants: { female: "Winifred Lippman", male: "Walter Lippman" },
        picker: { role: "Journalist, Dallas Herald", involvement: "heavy", isKiller: false },
        cocktailProfile: {
            from:         "Dallas, Texas. Has lived here his entire life under a name that is not his birth name.",
            career:       "Journalist at the Dallas Herald. Covers business and society.",
            hobby:        "Photography. Has a good eye for things other people overlook.",
            family:       "Unmarried.",
            knowsWilliam: "William personally invited him tonight. Said the evening concerned him specifically.",
            quiz: {
                question: "What does Walter cover at the Dallas Herald?",
                correct:  "Business and society",
                options:  ["International affairs", "Crime and politics", "Business and society", "Sports"]
            },
        },
        publicDesc: "A journalist for the Dallas Herald covering business and society. Known for thorough, honest reporting. Personally invited by William Thoreson Sr.",
        hiddenSkills: [],
        note: "You came tonight knowing Will wanted to tell you something personal. Let that discovery happen in the room.",
        backstory: "You write for the Dallas Herald under a name that has become simply who you are. William Thoreson personally invited you tonight — said he had an announcement that concerned you specifically. You have spent your entire career chasing the truth. Tonight the truth may find you first.",
        memories: [
            { text: "In years covering Dallas business you heard whispers that Thoreson Toys hadn't started the way Will told it. You could never confirm it. You are finding it now.", unlockedBy: "stolenCompany" },
            { text: "Your legal name is Taylor James Hartley. Born March 5th, 1911. That birth date is circled on the calendar in the study. The ledger entries marked T.H. — that money came to you. William Thoreson was your father.", unlockedBy: "birthCertificate", tier: 1 }
        ],
        canShare: [
            { text: "Will personally invited me. Said he had an announcement that would be the story of the year.", unlockedBy: null },
            { text: "The early history of Thoreson Toys was always unusually difficult to trace. Now I understand why.", unlockedBy: "stolenCompany" }
        ],
        relationships: [
            { name: "William Thoreson Sr.", relation: "Invited you personally — now deceased" },
            { name: "{{scott_thoreson}}", relation: "The eldest son" },
            { name: "{{miranda_longfellow}}", relation: "The legal manager — met briefly tonight" }
        ],
        items: ["Notepad and pen"]
    },

    // ============================================================
    // DAVID RICHARDSON — Private Investigator
    // ============================================================
    "david_richardson": {
        name: "David Richardson",
        nameVariants: { female: "Diana Richardson", male: "David Richardson" },
        picker: { role: "Private Investigator", involvement: "heavy", isKiller: false },
        cocktailProfile: {
            from:         "Fort Worth originally. Settled in Dallas twelve years ago.",
            career:       "Licensed private investigator. Takes cases across Dallas — missing persons, fraud, the occasional domestic matter.",
            hobby:        "Jazz. Goes to the clubs on Commerce Street most weekends.",
            family:       "Divorced. One daughter, lives with her mother.",
            knowsWilliam: "A cousin on the Thoreson side. Saw William at family gatherings over the years.",
            quiz: {
                question: "What does David do for a living?",
                correct:  "Private investigator",
                options:  ["Police detective", "Lawyer", "Insurance adjuster", "Private investigator"]
            },
        },
        publicDesc: "A licensed private investigator and a cousin on the Thoreson side. The moment William died, the calls started.",
        hiddenSkills: [],
        note: "You are the evidence pipeline. Make each report a moment — step away, take the call, react before you share.",
        backstory: "You are a Thoreson cousin and a licensed private investigator. You work cases across Dallas — missing persons, insurance fraud, the occasional domestic matter. The moment William died you started making calls. You have contacts at the county clerk's office, the coroner's office, and a Pinkerton agent who owes you a favor. While everyone else is absorbing the shock, you are already working.",
        memories: [
            { text: "DALLAS COUNTY CLERK'S OFFICE\n─────────────────────\nOriginal business registration, March 3rd, 1902.\n\nEntity registered as THORESON & HARTLEY TOYS — equal partnership between William A. Thoreson and Robert J. Hartley. No dissolution paperwork ever filed. No record of any buyout or transfer.\n\n— J. Fowler, Dallas County Clerk", unlockedBy: "djCountyClerk" },
            { text: "DALLAS COUNTY CORONER'S OFFICE\n─────────────────────\nPreliminary autopsy on Thoreson complete. Toxicology out until Thursday.\n\nFull report faxed to the residence. Someone with medical training should interpret it.\n\nAlso — small brass key found in the deceased's left jacket pocket. Sending it back with you.\n\n— F. Garrett, Dallas County Coroner", unlockedBy: "djCoroner" },
            { text: "PINKERTON NATIONAL DETECTIVE AGENCY\n─────────────────────\nBackground checks complete. Two items of note.\n\nSUBJECT 1: {{walter_lippman}} — pen name only. Legal name Taylor James Hartley, born March 5th 1911, Dallas TX.\n\nSUBJECT 2: {{miranda_longfellow}} — legal name change filed 1920. Born Miranda Elaine Hartley, 1896, Dallas TX.\n\n— Pinkerton National Detective Agency, Dallas Office", unlockedBy: "djPinkerton" }
        ],
        canShare: [
            { text: "I've got contacts at the coroner's office and at Pinkerton. Paperwork is coming tonight.", unlockedBy: null }
        ],
        relationships: [
            { name: "{{scott_thoreson}}", relation: "Your cousin" },
            { name: "William Thoreson Sr.", relation: "Your uncle (deceased)" }
        ],
        items: []
    },

    // ============================================================
    // PATRICIA CHAMBERLAIN — Family Friend
    // ============================================================
    "patricia_chamberlain": {
        name: "Patricia Chamberlain",
        nameVariants: { female: "Patricia Chamberlain", male: "Patrick Chamberlain" },
        picker: { role: "Family Friend", involvement: "moderate", isKiller: false },
        cocktailProfile: {
            from:         "Memphis, Tennessee. Moved to Dallas after her marriage in 1908.",
            career:       "No formal occupation. Significant family money from Memphis. Active in Dallas charitable circles.",
            hobby:        "Gardening. Has a well-known rose garden.",
            family:       "Widowed. Husband Edward passed in 1929. Two adult children in Memphis.",
            knowsWilliam: "Met through charity work in the early 1910s. A family acquaintance of twenty-odd years.",
            quiz: {
                question: "How does Patricia spend most of her time?",
                correct:  "Charitable work and Dallas society",
                options:  ["Teaching at a school", "Charitable work and Dallas society", "Managing her late husband's estate", "Running a business"]
            },
        },
        publicDesc: "A longtime family friend and person of means. Perceptive, composed, and doesn't suffer fools. William specifically asked her to come tonight.",
        hiddenSkills: [],
        backstory: "You have known the Thoreson family for years through charitable connections. William specifically asked you to come tonight — which you thought was simply a kind gesture until William turned up dead. Now you are wondering why he wanted you here.",
        memories: [
            { text: "You remember a conversation with William at a charity dinner years ago. William said a person could do something they knew was wrong and still believe they were the best person to have done it. You asked what was meant. William laughed it off. You never forgot it.", unlockedBy: "stolenCompany" }
        ],
        canShare: [
            { text: "William specifically asked me to come tonight. I didn't think much of it at the time.", unlockedBy: null },
            { text: "Don't let sentimentality cloud judgment. If William wronged people, the truth serves everyone.", unlockedBy: null }
        ],
        relationships: [
            { name: "William Thoreson Sr.", relation: "Family acquaintance of many years (deceased)" },
            { name: "{{dorothy_wells}}", relation: "Mutual friend through charitable circles" }
        ],
        items: []
    },

    // ============================================================
    // DOROTHY WELLS — Dallas Elder
    // ============================================================
    "dorothy_wells": {
        name: "Dorothy Wells",
        nameVariants: { female: "Dorothy Wells", male: "Douglas Wells" },
        picker: { role: "Dallas Society Elder", involvement: "moderate", isKiller: false },
        cocktailProfile: {
            from:         "Born in Dallas in 1854. Has never lived anywhere else.",
            career:       "Retired schoolteacher. Taught at Dallas public schools for over thirty years.",
            hobby:        "Correspondence. Writes letters to people all over the country, every week.",
            family:       "Widowed. Husband George passed in 1921. Three children, seven grandchildren.",
            knowsWilliam: "Has known William Thoreson since he was a young man with ambition and a partner nobody talks about anymore.",
            quiz: {
                question: "What did Dorothy do for most of her working life?",
                correct:  "Taught at Dallas public schools",
                options:  ["Ran a boarding house", "Managed a dress shop", "Taught at Dallas public schools", "Worked in banking"]
            },
        },
        publicDesc: "One of the most well-connected people in Dallas. Has been watching this city for longer than most guests have been alive.",
        hiddenSkills: [],
        backstory: "You are eighty-one years old and you have outlived most of the people you loved. You remember Dallas when it was a smaller city — when William Thoreson was a young man with ambition and a partner named Hartley that nobody talks about anymore. You have always believed the truth is better than comfortable silence.",
        knowledge: [
            { text: "You recognize what killed William Thoreson. Check your Expert Notes — you know exactly what this means and where it comes from.", unlockedBy: "wolfsbane" }
        ],
        memories: [
            { text: "You were there in 1902 when William Thoreson and Robert Hartley announced their partnership. You remember shaking Robert's hand. A serious man. You never saw Robert again after 1910, and nobody in this city had the decency to ask why.", unlockedBy: "letterhead", tier: 1 },
            { text: "You remember the original incorporation — Thoreson and Hartley, equal shares. Within a year the Hartley name had quietly disappeared. William said the partnership dissolved by mutual agreement. You did not believe that then.", unlockedBy: "stolenCompany", tier: 2 }
        ],
        canShare: [
            { text: "In my circles, there were always whispers about a woman named Margaret connected to the Thoresons. Nobody ever knew the details.", unlockedBy: null },
            { text: "I have lived long enough to stop being frightened by difficult truths.", unlockedBy: null }
        ],
        relationships: [
            { name: "{{victoria_ashworth}}", relation: "Friend from society circles" },
            { name: "{{elizabeth_monroe}}", relation: "Friend and fellow long-time Dallas resident" },
            { name: "William Thoreson Sr.", relation: "Social acquaintance of forty years (deceased)" }
        ],
        items: []
    },

    // ============================================================
    // VIVIENNE ASHFORD — The Cousin
    // ============================================================
    "vivienne_ashford": {
        name: "Vivienne Ashford",
        nameVariants: { female: "Vivienne Ashford", male: "Vincent Ashford" },
        picker: { role: "The Cousin, Just Back from Abroad", involvement: "moderate", isKiller: false },
        cocktailProfile: {
            from:         "Born in Dallas. Spent her thirties and early forties living in Paris and London. Returned eight months ago.",
            career:       "Translator and language tutor. Fluent in French, Italian, and some German.",
            hobby:        "Painting. Has a small collection of her own work she calls embarrassing and refuses to show anyone.",
            family:       "Unmarried. No children.",
            knowsWilliam: "Her uncle on her mother's side. Grew up spending holidays at the Thoreson home.",
            quiz: {
                question: "Where has Vivienne been living until recently?",
                correct:  "Abroad — Paris and London",
                options:  ["New Orleans", "San Francisco", "Abroad \u2014 Paris and London", "New York City"]
            },
        },
        publicDesc: "{{scott_thoreson}}'s cousin on the mother's side. Recently returned from years living abroad. Sees this family with the slight detachment of someone who has lived somewhere else.",
        hiddenSkills: [],
        backstory: "You are {{scott_thoreson}}'s cousin — spent years living abroad and came home eight months ago. You see this family with the slight detachment of someone who has lived somewhere else, which means you see it more clearly. The Thoresons have always been a family defined by what they don't say. Uncle Will in particular carried something heavy.",
        memories: [
            { text: "You remember your mother speaking in low voices once when you were small — something about a woman Will had known. Your mother said the name Margaret and changed the subject immediately. You had forgotten that completely until just now.", unlockedBy: "margaretsLetter" }
        ],
        canShare: [
            { text: "Uncle Will always seemed like he was carrying something heavy. I assumed it was just the pressure of running a company.", unlockedBy: null },
            { text: "I've been away for years. I see this family more clearly for it.", unlockedBy: null }
        ],
        relationships: [
            { name: "{{scott_thoreson}}", relation: "Your cousin" },
            { name: "William Thoreson Sr.", relation: "Your uncle (deceased)" }
        ],
        items: []
    },

    // ============================================================
    // RAYMOND HAMMOND — Business Manager
    // ============================================================
    "raymond_hammond": {
        name: "Raymond Hammond",
        nameVariants: { female: "Rachel Hammond", male: "Raymond Hammond" },
        picker: { role: "Business Manager, Thoreson Toys", involvement: "moderate", isKiller: false },
        cocktailProfile: {
            from:         "Shreveport, Louisiana. Moved to Dallas in 1918.",
            career:       "Business Manager at Thoreson Toys for fifteen years. Handles operations, staffing, suppliers — everything except the financial ledgers, which William kept personally.",
            hobby:        "Chess. Plays in a weekly club on Elm Street.",
            family:       "Married to Helen for twelve years. Two children, ages ten and seven.",
            knowsWilliam: "Hired by William in 1920. Worked closely with him for fifteen years — or thought he did.",
            quiz: {
                question: "What is Raymond's role at Thoreson Toys?",
                correct:  "Business Manager — operations and staffing",
                options:  ["Business Manager \u2014 operations and staffing", "Company accountant", "Factory floor supervisor", "Head of sales"]
            },
        },
        publicDesc: "Business Manager at Thoreson Toys for fifteen years. Handles the operational side of the company. Knows where every body is buried — figuratively speaking.",
        hiddenSkills: [],
        backstory: "You have run the operational side of Thoreson Toys for fifteen years. You know the company better than almost anyone. William kept the financial ledgers personally — locked away — and in fifteen years you were never given full access. You assumed it was how William operated. Now you are not so sure.",
        memories: [
            { text: "William asked you three weeks ago to retrieve a box of old contracts from storage — pre-1910 documents. William went through them alone and returned them the same day. William seemed shaken in a way you had never seen.", unlockedBy: "forgedDocs", tier: 2 },
            { text: "Fifteen years at this company and William never once let you near the books. Looking at what's in that ledger now — the payments, the dates, the initials — you understand it was something else entirely. Someone did not want an accountant looking too closely.", unlockedBy: "ledger", tier: 1 }
        ],
        canShare: [
            { text: "Will always did the books personally. Kept the ledgers locked away. I never had access — and now I'm wondering why.", unlockedBy: null },
            { text: "A European deal fell apart six months ago. William got very quiet after that.", unlockedBy: null }
        ],
        relationships: [
            { name: "{{scott_thoreson}}", relation: "The eldest son — worked together on company matters" },
            { name: "William Thoreson Sr.", relation: "Your employer of fifteen years (deceased)" },
            { name: "{{marcus_brennan}}", relation: "Investor — now asking hard questions" },
            { name: "{{victoria_ashworth}}", relation: "Investor — now asking hard questions" }
        ],
        items: []
    },


    // ============================================================
    // CHARLES STERLING — Old Friend, Retired Banker
    // ============================================================
    "charles_sterling": {
        name: "Charles Sterling",
        nameVariants: { female: "Charlotte Sterling", male: "Charles Sterling" },
        picker: { role: "Retired Banker", involvement: "moderate", isKiller: false },
        cocktailProfile: {
            from:         "Richmond, Virginia. Moved to Dallas in 1898.",
            career:       "Retired banker. Forty years at First National Bank of Dallas. Ended his career as Vice President of Commercial Lending.",
            hobby:        "Amateur photography. Has a darkroom at home.",
            family:       "Widowed. Spouse passed in 1928. One child who lives in Houston.",
            knowsWilliam: "Met when William walked into the bank in 1902 looking for a business loan. Closest friend of over thirty years.",
            quiz: {
                question: "What did Charles do before retiring?",
                correct:  "Banker — VP of Commercial Lending at First National",
                options:  ["Railroad company executive", "Lawyer specializing in business law", "Banker \u2014 VP of Commercial Lending at First National", "Cotton merchant"]
            },
        },
        publicDesc: "An old friend of William's and a retired Dallas banker. Known, trusted, and one of the few people William ever truly confided in.",
        hiddenSkills: [],
        backstory: "You and William Thoreson have been friends for over thirty years. You were there in the early days of the company — not as an investor, just as a friend who watched William build something remarkable. You retired from banking five years ago after a long career at one of Dallas's oldest institutions. William specifically asked you to come tonight. He said it was important. That was unusual enough that you cleared your calendar immediately.",
        memories: [
            { text: "William told you something once, years ago, after several drinks — that the company had not started the way people thought. That there had been a wrong done at the beginning that he had never made right. You assumed it was the usual guilt of a successful man. You are no longer sure of that.", unlockedBy: "stolenCompany" },
            { text: "You handled the Thoreson estate banking for fifteen years before you retired. The ledger entries marked T.H. — monthly payments going back to 1911 — those went through your bank. You processed them without asking questions. You are asking them now.", unlockedBy: "ledger", tier: 1 }
        ],
        canShare: [
            { text: "William and I have been friends for thirty years. He asked me here tonight specifically. I have been trying to understand why ever since he died.", unlockedBy: null },
            { text: "I handled the Thoreson estate banking for years. There were entries in the books I never fully understood. I am beginning to understand them now.", unlockedBy: "ledger" }
        ],
        relationships: [
            { name: "William Thoreson Sr.", relation: "Your closest friend of thirty years (deceased)" },
            { name: "{{scott_thoreson}}", relation: "Watched this one grow up" },
            { name: "{{raymond_hammond}}", relation: "The business manager — your paths crossed through the company" },
            { name: "{{marcus_brennan}}", relation: "Fellow investor circle — know each other through Dallas business" }
        ],
        items: []
    },

    // ============================================================
    // MARCUS BRENNAN — Investor
    // ============================================================
    "marcus_brennan": {
        name: "Marcus Brennan",
        nameVariants: { female: "Margaret Brennan", male: "Marcus Brennan" },
        picker: { role: "Investor", involvement: "moderate", isKiller: false },
        cocktailProfile: {
            from:         "Dallas, born and raised.",
            career:       "Businessman and investor. Interests in real estate, manufacturing, and — until recently — Thoreson Toys.",
            hobby:        "Golf. Plays at Dallas Country Club most Saturday mornings.",
            family:       "Married to Ruth for fourteen years. Three children.",
            knowsWilliam: "Became an investor in Thoreson Toys four years ago after William made a personal pitch. The returns were excellent until they weren't.",
            quiz: {
                question: "How does Marcus know William Thoreson?",
                correct:  "He invested in Thoreson Toys four years ago",
                options:  ["They grew up together in Dallas", "He was William's attorney", "They served together in the war", "He invested in Thoreson Toys four years ago"]
            },
        },
        publicDesc: "A Dallas businessman with a significant stake in Thoreson Toys. Analytical, measured, and not someone who loses money quietly.",
        hiddenSkills: [],
        backstory: "You have been invested in Thoreson Toys for four years. The returns were excellent until six months ago when a European deal collapsed and real money disappeared. You have been pursuing answers ever since. William kept putting you off. You came tonight expecting a confrontation. Instead you walked into a murder.",
        memories: [
            { text: "William called you about a month before tonight to apologize for the delays. William sounded genuinely tired — not defensive, but something older than that. Like a person settling accounts that had been avoided for a long time.", unlockedBy: "ledger" },
            { text: "You know what a fraudulent transfer looks like. Looking at the 1910 filing now — the signature, the notarization, the dates — you can see the construction of it. Someone very careful did this. But not careful enough.", unlockedBy: "forgedDocs", tier: 1 }
        ],
        canShare: [
            { text: "Yes, the European deal lost money. Yes, I was angry. But dead people don't write checks.", unlockedBy: null },
            { text: "I know what it looks like when a company's books have been kept to hide something. I missed it for four years.", unlockedBy: "ledger" }
        ],
        relationships: [
            { name: "{{victoria_ashworth}}", relation: "Fellow investor — coordinated on Thoreson matters" },
            { name: "{{raymond_hammond}}", relation: "The business manager" },
            { name: "William Thoreson Sr.", relation: "Company founder (deceased)" }
        ],
        items: []
    },

    // ============================================================
    // VICTORIA ASHWORTH — Investor
    // ============================================================
    "victoria_ashworth": {
        name: "Victoria Ashworth",
        nameVariants: { female: "Victoria Ashworth", male: "Victor Ashworth" },
        picker: { role: "Investor", involvement: "moderate", isKiller: false },
        cocktailProfile: {
            from:         "Born in Austin. Moved to Dallas in 1919.",
            career:       "Independent businessperson. Manages her own investment portfolio across several Dallas companies.",
            hobby:        "Bridge. Hosts a weekly game and considers it serious business.",
            family:       "Unmarried.",
            knowsWilliam: "Has been a Thoreson Toys shareholder for six years. Knew William through the investor circle.",
            quiz: {
                question: "How long has Victoria been a Thoreson Toys shareholder?",
                correct:  "Six years",
                options:  ["Two years", "Fifteen years", "Six years", "Since the company started"]
            },
        },
        publicDesc: "A sharp businessperson and Thoreson Toys investor. Active in Dallas society with a keen eye for detail.",
        hiddenSkills: [],
        backstory: "You have been a Thoreson Toys shareholder for six years. You and {{marcus_brennan}} have coordinated on investments for years — {{marcus_brennan}} handles the numbers, you handle the people. Between the two of you very little gets past unnoticed. Or so you believed until six months ago.",
        memories: [
            { text: "You did thorough due diligence on every investment. You never found anything irregular in the Thoreson books. That is either because William was very careful or because you didn't look in the right places. You are not sure which possibility bothers you more.", unlockedBy: "stolenCompany", tier: 2 },
            { text: "{{miranda_longfellow}} was always present at company functions. Always at the edge of the room, watching. You remarked on it once to {{marcus_brennan}}. {{marcus_brennan}} said you were being uncharitable. You were not being uncharitable.", unlockedBy: "mirandasIdentity" }
        ],
        canShare: [
            { text: "Yes, we lost money. Yes, we wanted answers. I take people to court. I don't take their lives.", unlockedBy: null },
            { text: "Several people in this room are performing something. I know what that looks like.", unlockedBy: null }
        ],
        relationships: [
            { name: "{{marcus_brennan}}", relation: "Fellow investor and business ally" },
            { name: "{{raymond_hammond}}", relation: "The business manager" },
            { name: "{{dorothy_wells}}", relation: "Friend from society circles" },
            { name: "William Thoreson Sr.", relation: "Company founder (deceased)" }
        ],
        items: []
    },

    // ============================================================
    // ELIZABETH MONROE — Socialite (optional)
    // ============================================================
    "elizabeth_monroe": {
        name: "Elizabeth Monroe",
        nameVariants: { female: "Elizabeth Monroe", male: "Elliot Monroe" },
        picker: { role: "Dallas Socialite", involvement: "light", isKiller: false },
        cocktailProfile: {
            from:         "Born in New Orleans. Has lived in Dallas for thirty years.",
            career:       "No formal occupation. Old money from New Orleans. Active presence in Dallas society.",
            hobby:        "Hosting. Considers the dinner party an art form.",
            family:       "Married to Harold for twenty-eight years. No children.",
            knowsWilliam: "Social acquaintance of many years. Moved in the same circles as the Thoresons throughout Dallas society.",
            quiz: {
                question: "Where is Elizabeth originally from?",
                correct:  "New Orleans",
                options:  ["Atlanta", "Houston", "Memphis", "New Orleans"]
            },
        },
        publicDesc: "A fixture of Dallas society. Knows everyone, remembers everything, and makes it all look effortless.",
        hiddenSkills: [],
        note: "OPTIONAL CHARACTER — cut first if guest count is low. Mystery functions without this role.",
        backstory: "You are the most well-connected person in Dallas and have been for thirty years. You knew William and Margaret Hartley personally before the scandal — you were at the same parties, moved in the same circles. You have heard the name Hartley said once at a dinner party by someone who immediately wished they hadn't. You filed it away. You always file things away.",
        memories: [
            { text: "You remember the newspaper piece about Robert Hartley's death in 1910. Two inches of column. Investigation closed in under a day. At the time you thought nothing of it.", unlockedBy: "stolenCompany", tier: 2 },
            { text: "You knew Margaret Hartley. Not well — but enough. You were at the same charity events in 1908 and 1909. Margaret was quiet, devoted to Robert, clearly in love. And then she simply disappeared from those circles. Nobody talked about why.", unlockedBy: "affair", tier: 1 }
        ],
        canShare: [
            { text: "I knew Margaret Hartley. Not well — but I remember her. And I remember when she stopped appearing in the circles we both moved in.", unlockedBy: null },
            { text: "I know everyone in this city and I remember everything. Tonight is testing the limits of that considerably.", unlockedBy: null }
        ],
        relationships: [
            { name: "{{dorothy_wells}}", relation: "Fellow long-time Dallas resident" },
            { name: "{{victoria_ashworth}}", relation: "Social acquaintance" },
            { name: "William Thoreson Sr.", relation: "Social acquaintance of many years (deceased)" }
        ],
        items: []
    }

};

// ============================================================
// SKILL BACKSTORIES — Generic snippets injected at game time
// Same text regardless of which character receives the skill
// ============================================================
var SKILL_BACKSTORIES = {
    Legal:         "You have a background in law and understand documents, contracts, and what makes a signature valid — or forged.",
    Medical:       "You have medical training. You know what the body reveals and how to read what others miss.",
    Botany:        "You have spent years studying plants — including ones most people have never encountered and would not recognize.",
    Accounting:    "Numbers are your native language. You can read a ledger the way other people read a newspaper.",
    Banking:       "You understand how money moves, how accounts are structured, and what it looks like when the books are hiding something.",
    French:        "You spent time in France and speak the language fluently — written and spoken.",
    Journalism:    "You have a journalist's instincts. You know how to find what's been buried and what questions to ask.",
    Investigation: "You are a trained investigator. You know how to read a scene, find connections, and get information that others can't."
};
