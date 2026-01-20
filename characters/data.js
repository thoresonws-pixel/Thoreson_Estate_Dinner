// CHARACTER DATA
// Add characters here - the page will automatically display them
// 
// INSTRUCTIONS:
// 1. Copy a character template below
// 2. Fill in the details
// 3. Save the file
// 4. The website updates automatically
//
// FIELDS:
// - id: unique identifier (lowercase, hyphens, no spaces)
// - code: the secret code you give to the player (e.g., "VASH-7K2X")
// - name: character's full name
// - publicDesc: what everyone can see (1-2 sentences)
// - portrait: optional image URL (or leave empty "")
// - backstory: full character backstory (private)
// - secret: what they're hiding
// - knowledge: what they know about events/others
// - goals: what they want to achieve tonight
// - relationships: key relationships with other characters
// - skill: special skill if any (or "None")
// - skillPassword: password for QR code clues (if they have a skill)
// - items: array of items on their person

const characters = [
    
    // ============================================
    // WILLIAM "WILL" THORESON SR. - THE VICTIM
    // ============================================
    {
        id: "william-thoreson-sr",
        code: "",
        name: "William \"Will\" Thoreson Sr.",
        publicDesc: "Patriarch of the Thoreson family and host of this evening's dinner party. A successful businessman who built his fortune in Dallas over the past three decades.",
        portrait: "",
        backstory: "",
        secret: "",
        knowledge: "",
        goals: [],
        relationships: [
            { name: "Eleanor Thoreson", relation: "His wife of many years" },
            { name: "William \"Scott\" Thoreson Jr.", relation: "His eldest son" }
        ],
        skill: "None",
        skillDesc: "",
        skillPassword: "",
        items: []
    },

    // ============================================
    // WILLIAM "SCOTT" THORESON JR. - THE HOST (YOU)
    // ============================================
    {
        id: "william-scott-thoreson",
        code: "",
        name: "William \"Scott\" Thoreson Jr.",
        publicDesc: "Eldest son of William Thoreson Sr. and the family's attorney. A man of integrity who has dedicated his career to managing the family's legal affairs.",
        portrait: "",
        backstory: "",
        secret: "",
        knowledge: "",
        goals: [],
        relationships: [
            { name: "William Thoreson Sr.", relation: "Your father, now deceased" },
            { name: "Eleanor Thoreson", relation: "Your mother" },
            { name: "Miranda Longfellow", relation: "Your legal assistant for nearly 10 years" }
        ],
        skill: "None",
        skillDesc: "",
        skillPassword: "",
        items: []
    },

    // ============================================
    // CHARACTER TEMPLATE - COPY THIS
    // ============================================
    /*
    {
        id: "firstname-lastname",
        code: "XXXX-XXXX",
        name: "Full Name",
        publicDesc: "Brief public description visible to all.",
        portrait: "",
        backstory: "Full backstory here...",
        secret: "What they're hiding...",
        knowledge: "What they know about the events...",
        goals: [
            "Goal 1",
            "Goal 2",
            "Goal 3"
        ],
        relationships: [
            { name: "Character Name", relation: "How they know them" },
            { name: "Character Name", relation: "How they know them" }
        ],
        skill: "Skill Name or None",
        skillDesc: "Description of their skill",
        skillPassword: "PASSWORD",
        items: [
            "Item 1",
            "Item 2"
        ]
    },
    */

];
