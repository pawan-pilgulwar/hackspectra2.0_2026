// ─── EVENT CONFIGURATION ────────────────────────────────────────────────────
// Change this single variable to update the countdown timer across the site
export const EVENT_DATE = "2026-04-04T09:00:00";

export const EVENT_NAME = "HackSpectra 2.0";
export const EVENT_TAGLINE = "Metaverse: Code Beyond Reality";
export const EVENT_DURATION = "24-Hour Hackathon";
export const EVENT_DATE_DISPLAY = "4–5 April 2026";
export const TEAM_SIZE = "2–4 Members";
export const TOTAL_TEAMS = "50+ Teams";

// derived values
export const EVENT_YEAR = new Date(EVENT_DATE).getFullYear();

// Problem statement selection opens 10 days before event
export const PROBLEM_SELECTION_DAYS_BEFORE = 10;

// Calculate problem selection start date (10 days before event)
export const getProblemSelectionStartDate = () => {
  const eventDate = new Date(EVENT_DATE);
  const selectionDate = new Date(eventDate);
  selectionDate.setDate(eventDate.getDate() - PROBLEM_SELECTION_DAYS_BEFORE);
  return selectionDate;
};

// Check if problem selection is open
export const isProblemSelectionOpen = () => {
  const now = new Date();
  const selectionStart = getProblemSelectionStartDate();
  const eventDate = new Date(EVENT_DATE);

  // Open from 10 days before until event starts
  return now >= selectionStart && now < eventDate;
};

// Check if event has started or passed
export const hasEventStarted = () => {
  const now = new Date();
  const eventDate = new Date(EVENT_DATE);
  return now >= eventDate;
};

// ─── REGISTRATION LINKS ─────────────────────────────────────────────────────
export const STUDENT_REG_URL =
  "https://unstop.com/p/hackspectra-20-2026-mgms-college-of-engineering-nanded-1649253?lb=Z8t5GW62&utm_medium=Share&utm_source=WhatsApp";

// ─── NAVIGATION ─────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Tracks", href: "#tracks" },
  { label: "Timeline", href: "#timeline" },
  { label: "Rules", href: "#rules" },
  { label: "Prizes", href: "#prizes" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

// ─── STATS ───────────────────────────────────────────────────────────────────
export const STATS = [
  { value: "50+", label: "Teams" },
  { value: "2–4", label: "Members / Team" },
  { value: "24H", label: "Hackathon" },
  { value: "₹1 Lakh+", label: "Prize Pool" },
];

// ─── WHY JOIN ────────────────────────────────────────────────────────────────
export const WHY_JOIN = [
  { icon: "💡", title: "Real-World Challenges", desc: "Work on cutting-edge tech problems that matter" },
  { icon: "🏆", title: "Amazing Prizes", desc: "Win cash prizes, swags, and certificates" },
  { icon: "📄", title: "Boost Your Resume", desc: "Gain hands-on hackathon experience" },
  { icon: "🎉", title: "Fun & Entertainment", desc: "Cultural night, midnight games & free goodies" },
  { icon: "📜", title: "Certificate", desc: "Participation certificates for all teams" },
  { icon: "🎭", title: "Cultural Night", desc: "Fun-filled cultural night experience" },
  { icon: "🎮", title: "Midnight Games", desc: "Engaging midnight games & activities" },
  { icon: "🎁", title: "Free Goodies", desc: "Exciting goodies for participants" },
];

// ─── TRACKS ─────────────────────────────────────────────────────────────────
export const TRACKS = [
  {
    icon: "🌾",
    title: "Agriculture",
    description: "Innovative tech solutions for agriculture.",
    color: "from-metaverse-green to-metaverse-beige",
    glow: "shadow-meta-green",
  },
  {
    icon: "🏥",
    title: "Healthcare",
    description: "Smart healthcare & medical innovations.",
    color: "from-metaverse-plum to-metaverse-navy",
    glow: "shadow-meta",
  },
  {
    icon: "🎓",
    title: "Education",
    description: "Next-gen education & learning platforms.",
    color: "from-metaverse-pink to-metaverse-beige",
    glow: "shadow-meta-pink",
  },
  {
    icon: "🏙️",
    title: "Smart City",
    description: "Technology-driven smart city solutions.",
    color: "from-metaverse-slate to-metaverse-dark-blue",
    glow: "shadow-meta-slate",
  },
  {
    icon: "🌪️",
    title: "Disaster Management",
    description: "Disaster prediction & response systems.",
    color: "from-metaverse-navy to-metaverse-plum",
    glow: "shadow-meta",
  },
  {
    icon: "🔐",
    title: "Cybersecurity",
    description: "Security, privacy & cyber defense solutions.",
    color: "from-metaverse-dark-blue to-metaverse-slate",
    glow: "shadow-meta-slate",
  },
  {
    icon: "🚗",
    title: "Transportation & Tourism",
    description: "Smart mobility & tourism tech.",
    color: "from-metaverse-beige to-metaverse-pink",
    glow: "shadow-meta-pink",
  },
  {
    icon: "👩‍👧",
    title: "Women & Child Development",
    description: "Empowerment-focused innovations.",
    color: "from-metaverse-pink to-metaverse-plum",
    glow: "shadow-meta-pink",
  },
  {
    icon: "💡",
    title: "Student Innovation",
    description: "Open innovation for creative student ideas.",
    color: "from-metaverse-plum to-metaverse-pink",
    glow: "shadow-meta",
  },
];

// ─── TIMELINE ────────────────────────────────────────────────────────────────
export const TIMELINE = [
  {
    step: "01",
    title: "Registration",
    description: "Open registration for participants to form teams and choose their track.",
    icon: "📝",
  },
  {
    step: "02",
    title: "Problem Statement Selection",
    description: "Teams select their preferred problem statement from available tracks before the event.",
    icon: "📋",
  },
  {
    step: "03",
    title: "Inauguration",
    description: "Opening ceremony and official kickoff of the 24-hour hackathon.",
    icon: "🎤",
  },
  {
    step: "04",
    title: "Implementation",
    description: "24-hour coding sprint with dedicated mentor support and technical guidance.",
    icon: "💻",
  },
  {
    step: "05",
    title: "Judging Round 1",
    description: "Initial evaluation of project progress, concept clarity, and approach.",
    icon: "⚖️",
  },
  {
    step: "06",
    title: "Cultural Night",
    description: "Networking, relaxation activities, midnight games & unforgettable memories.",
    icon: "🎭",
  },
  {
    step: "07",
    title: "Judging Round 2",
    description: "In-depth technical implementation review and progress assessment.",
    icon: "🔍",
  },
  {
    step: "08",
    title: "Final Presentation",
    description: "Demo day — present your project to expert judges in round 3.",
    icon: "🚀",
  },
  {
    step: "09",
    title: "Valedictory",
    description: "Results announcement, prize distribution, and closing ceremony.",
    icon: "🏆",
  },
];

// ─── RULES ───────────────────────────────────────────────────────────────────
export const RULES = [
  "Teams can have 2 to 4 members.",
  "Bring your own laptops and chargers.",
  "Pre-built solutions allowed; submissions must be original.",
  "24-hour hackathon with scheduled checkpoints.",
  "Internet access is provided, but no external human help.",
  "Projects will be judged on innovation, execution, and impact.",
  "Submissions must be made before the deadline.",
  "Registration fee: ₹600 without accomodation, ₹800 with accomodation.",
  "Problem statements will be displayed on website before the 10 days of event.",
  "Violations of rules may lead to immediate disqualification.",
];

// ─── PRIZES ──────────────────────────────────────────────────────────────────
export const PRIZES = [
  {
    rank: "1st",
    label: "Grand Champion",
    amount: "₹25,000+",
    icon: "🥇",
    perks: ["Cash Prize", "Goodies", "Certificates", "Mentorship Opportunity"],
    gradient: "from-metaverse-pink via-metaverse-plum to-metaverse-navy",
    glow: "shadow-meta-pink",
    border: "border-metaverse-pink/50",
  },
  {
    rank: "2nd",
    label: "First Runner-Up",
    amount: "₹15,000+",
    icon: "🥈",
    perks: ["Cash Prize", "Goodies", "Certificates", "Industry Connect"],
    gradient: "from-metaverse-slate via-metaverse-dark-blue to-metaverse-navy",
    glow: "shadow-meta-slate",
    border: "border-metaverse-slate/50",
  },
  {
    rank: "3rd",
    label: "Second Runner-Up",
    amount: "₹10,000+",
    icon: "🥉",
    perks: ["Cash Prize", "Goodies", "Certificates"],
    gradient: "from-metaverse-plum via-metaverse-navy to-metaverse-dark-blue",
    glow: "shadow-meta",
    border: "border-metaverse-plum/50",
  },
  {
    rank: "Special",
    label: "Track Winners",
    amount: "Goodies + Swag",
    icon: "🎁",
    perks: ["Domain Certificates", "Goodies", "Recognition"],
    gradient: "from-metaverse-pink via-metaverse-beige to-metaverse-slate",
    glow: "shadow-meta-pink",
    border: "border-metaverse-beige/50",
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
export const FAQ_ITEMS = [
  {
    question: `Who can participate in ${EVENT_NAME}?`,
    answer:
      `${EVENT_NAME} is open to all college students with a passion for technology and innovation. Whether you're a coder, designer, or just have a great idea, this hackathon is for you!`,
  },
  {
    question: "What is the team size requirement?",
    answer:
      "Teams must have a minimum of 2 and a maximum of 4 members. Solo participation is not allowed.",
  },
  {
    question: "Do we need to have a project idea before registering?",
    answer:
      "No! Problem statements will be provided before 1days of the event, and you can selecct one that interests you. You can also brainstorm and come up with your own innovative idea during the hackathon.",
  },
  {
    question: "What should we bring to the hackathon?",
    answer:
      "Bring your own laptops, chargers, and any required peripherals. Accommodation and internet access will be provided at the venue.",
  },
  {
    question: "Is accommodation provided?",
    answer:
      "Yes, accommodation is provided for outstation participants at the venue — MGM's College of Engineering, Nanded.",
  },
  {
    question: "How will projects be judged?",
    answer:
      "Projects will be evaluated across three judging rounds based on innovation, technical execution, and real-world impact. Final demos are presented to expert judges.",
  },
  {
    question: "Can we use open-source libraries and APIs?",
    answer:
      "Yes, you can use open-source libraries, APIs, and cloud services. However, the core project must be built during the hackathon. No pre-built solutions allowed.",
  },
  {
    question: "What are the fun activities during the hackathon?",
    answer:
      "Besides hacking, enjoy midnight games, a cultural night, free goodies, and networking sessions with peers and mentors. It's 24 hours of creation and fun!",
  },
];

// ─── SPONSORS ────────────────────────────────────────────────────────────────
export const SPONSORS = [
  { name: "MGM's College of Engineering, Nanded", tier: "Host" },
  { name: "Department of CSE", tier: "Host" },
  { name: "Institution of Engineers (India) – IEI Student Chapter, MGMCOE", tier: "Organizer" },
  { name: "Google Developer Groups – On Campus MGMCOE", tier: "Organizer" },
  { name: "LIC Life Insurance", tier: "Past Sponsor" },
  { name: "State Bank of India", tier: "Past Sponsor" },
  { name: "Shree Cement", tier: "Past Sponsor" },
  { name: "Bank of Maharashtra", tier: "Past Sponsor" },
  { name: "Deshmukh Gym", tier: "Past Sponsor" },
];

// ─── CONTACT ─────────────────────────────────────────────────────────────────
export const CONTACT = {
  venue:
    "Department of Computer Science & Engineering (CSE), MGM's College of Engineering, Nanded",
  phones: [
    "+91-9527184594  -->  Nagarjun Tumma",  // Nagarjun Tumma
    "+91-9359546458  -->  Pranjal Shahane", // Pranjal Shahane
  ],
  email: "hackspectra@mgmcen.ac.in",
  facultyCoordinators: [
    "Dr. B. S. Kapre",
    "Mr. H. U. Joshi",
  ],
  socials: {
    instagram: "https://instagram.com/hackspectra_mgm",
  },
};
