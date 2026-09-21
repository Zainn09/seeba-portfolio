/**
 * Homepage content data. All copy is grounded in the factual background
 * supplied for Abdul — nothing here invents employment, metrics, or expertise.
 */

export type JourneyStage = {
  id: string;
  index: string;
  title: string;
  sub: string;
  body: string;
  points: string[];
  chips: string[];
};

export const journeyStages: JourneyStage[] = [
  {
    id: "stage-01",
    index: "STAGE 01",
    title: "HTML + CSS",
    sub: "The first real pages",
    body: "The journey started with the web — layout, structure, and the small thrill of making a page respond to a screen.",
    points: ["Responsive web design", "UI development", "Layout thinking", "Frontend fundamentals"],
    chips: ["HTML5", "CSS3"],
  },
  {
    id: "stage-02",
    index: "STAGE 02",
    title: "Python",
    sub: "Console programs, real logic",
    body: "Moved into Python and built console-based applications that pushed past single-file scripts into genuine program structure.",
    points: ["Programming logic", "Data structures", "Functions", "File handling", "Object-oriented programming"],
    chips: ["Python", "OOP"],
  },
  {
    id: "stage-03",
    index: "STAGE 03",
    title: "Android Development",
    sub: "A full app, end to end",
    body: "Explored Android with Java and built SneakerStore — a modern e-commerce shoe shopping application.",
    points: ["User authentication", "Product browsing", "Shopping cart", "Address management", "Material Design UI"],
    chips: ["Java", "XML", "Firebase", "SQLite", "Android Studio"],
  },
  {
    id: "stage-04",
    index: "STAGE 04",
    title: "The Next Direction",
    sub: "Toward AI & ML",
    body: "Currently focused on strengthening Python, problem solving, and real-world project development — building a foundation toward Artificial Intelligence and Machine Learning.",
    points: ["Python", "Problem solving", "Coding challenges", "Real-world projects", "Git / GitHub", "AI/ML foundations"],
    chips: ["Python → AI → ML"],
  },
];

export type Project = {
  id: string;
  slug: string;
  group: string;
  index: string;
  name: string;
  tagline: string;
  description: string;
  chips: string[];
  demo: "web" | "cafe" | "calculator" | "library" | "student" | "bank" | "sneaker";
  note?: string;
};

export const projects: Project[] = [
  {
    id: "chai-dosti",
    slug: "chai-dosti-cafe",
    group: "WEB FOUNDATIONS",
    index: "PROJECT / 01",
    name: "Chai Dosti Café",
    tagline: "An actual café site, built by hand",
    description:
      "The first real website — a café page designed around warm typography and responsive layouts. It's where responsive web design, UI development, and layout thinking started to make sense.",
    chips: ["HTML5", "CSS3", "Responsive"],
    demo: "cafe",
    note: "BUILT TO UNDERSTAND",
  },
  {
    id: "calculator",
    slug: "responsive-calculator",
    group: "WEB FOUNDATIONS",
    index: "PROJECT / 02",
    name: "Responsive Calculator",
    tagline: "Layout that adapts to the hand holding it",
    description:
      "A calculator designed to stay usable from a phone to a desktop. It taught me that responsive isn't about sweeping grids — it's about thinking for the smallest screen first.",
    chips: ["HTML5", "CSS3", "Grid", "Responsive"],
    demo: "calculator",
    note: "MADE WHILE LEARNING",
  },
  {
    id: "library",
    slug: "library-management-system",
    group: "PYTHON · CONSOLE",
    index: "PROJECT / 03",
    name: "Library Management System",
    tagline: "Books in, books out, records kept",
    description:
      "A console application that manages the full life of a book record — search, issue, return, and updated state — persisted through file handling.",
    chips: ["Python", "File Handling", "OOP", "Console"],
    demo: "library",
    note: "REAL PROJECT. REAL PRACTICE.",
  },
  {
    id: "student",
    slug: "student-management-system",
    group: "PYTHON · CONSOLE",
    index: "PROJECT / 04",
    name: "Student Management System",
    tagline: "Student records with somewhere to live",
    description:
      "Add, save, search, and display student records. This is where functions, data structures, and file handling stopped being concepts and became a working system.",
    chips: ["Python", "File Handling", "Data Structures", "Console"],
    demo: "student",
    note: "WHAT I LEARNED",
  },
  {
    id: "bank",
    slug: "bank-management-system",
    group: "PYTHON · CONSOLE",
    index: "PROJECT / 05",
    name: "Bank Management System",
    tagline: "Accounts, deposits, withdrawals — all fictional",
    description:
      "A conceptual banking interface: create an account, deposit, withdraw, check balance. Demonstrates transaction logic and state with clearly fictional data.",
    chips: ["Python", "OOP", "State", "Console"],
    demo: "bank",
    note: "THE BUILD",
  },
  {
    id: "sneakerstore",
    slug: "sneakerstore",
    group: "ANDROID · HERO PROJECT",
    index: "PROJECT / 06",
    name: "SneakerStore",
    tagline: "An e-commerce app, from login to checkout",
    description:
      "A modern e-commerce shoe shopping application. The most feature-rich build so far — authentication, browsing, cart, address management, and a clean Material Design interface.",
    chips: ["Java", "XML", "Firebase", "SQLite", "Android Studio"],
    demo: "sneaker",
    note: "HERO PROJECT",
  },
];

export type ThinkingStage = {
  id: string;
  label: string;
  clue: string;
  detail: string;
};

export const thinkingStages: ThinkingStage[] = [
  { id: "problem", label: "PROBLEM", clue: "What's actually being asked?", detail: "Read it twice. Most wrong solutions start with a misunderstood question — not a bug." },
  { id: "understand", label: "UNDERSTAND", clue: "Inputs · outputs · constraints", detail: "Pin down exactly what goes in, what must come out, and what the edges are before touching a key." },
  { id: "breakdown", label: "BREAK DOWN", clue: "One big problem → small parts", detail: "Split it into pieces small enough to hold in my head. Big problems are just sequences of small steps." },
  { id: "design", label: "DESIGN LOGIC", clue: "Steps before syntax", detail: "Sketch the flow on paper. The code goes down faster — and cleaner — when the logic already exists." },
  { id: "build", label: "BUILD", clue: "Turning the plan into code", detail: "Write in small, testable chunks. Commit working pieces instead of one giant uncertain change." },
  { id: "test", label: "TEST", clue: "Try to break it", detail: "Run the obvious cases, then the weird ones. A program isn't done when it works once — it's done when it holds up." },
  { id: "improve", label: "IMPROVE", clue: "Read, refactor, repeat", detail: "Look back at what's clumsy. Rename, restructure, remove. Every pass is practice for the next build." },
];

export type AipathNode = {
  id: string;
  label: string;
  status: string;
  detail: string;
  tech: string[];
};

export const aiPathNodes: AipathNode[] = [
  {
    id: "python",
    label: "Python",
    status: "Current foundation",
    detail: "The language I'm strengthening every week through challenges, mini-projects, and cleaner structure.",
    tech: ["Functions", "OOP", "File handling", "Data structures"],
  },
  {
    id: "problem-solving",
    label: "Problem Solving",
    status: "Every day",
    detail: "Logic and algorithms — mostly through coding challenges and by dissecting problems before writing code.",
    tech: ["Logic", "Algorithms", "Debugging"],
  },
  {
    id: "data",
    label: "Data",
    status: "Working toward",
    detail: "Learning to think data-first: how programs read, shape, and learn from structured information.",
    tech: ["Data structures", "Files", "Datasets"],
  },
  {
    id: "algorithms",
    label: "Algorithms",
    status: "Growing",
    detail: "Moving from 'it works' to 'it works well' — complexity, trade-offs, and choosing the right approach.",
    tech: ["Complexity", "Trade-offs", "Practice"],
  },
  {
    id: "ml",
    label: "Machine Learning",
    status: "Future specialization",
    detail: "The direction: models that learn from data. I'm building the Python and math foundation to get here honestly.",
    tech: ["Python for ML", "Math foundations", "Models"],
  },
  {
    id: "ai",
    label: "Artificial Intelligence",
    status: "Long-term direction",
    detail: "Where the whole path points — contribution-level work in AI. Not claimed yet. Being built toward, on purpose.",
    tech: ["AI systems", "Research", "Ethics"],
  },
];

export type Skill = {
  name: string;
  group:
    | "Programmin"
    | "Frontend"
    | "Mobile"
    | "Database/Cloud"
    | "Tools";
  weight: number; // 1 = standard emphasis, 1.5+ = stronger (Python)
  links: string[];
};

export const skills: Skill[] = [
  { name: "Python", group: "Programmin", weight: 1.6, links: ["Java", "HTML5", "Git", "SQLite"] },
  { name: "Java", group: "Programmin", weight: 1, links: ["Python", "Android Studio", "Firebase Authentication"] },
  { name: "HTML5", group: "Frontend", weight: 1, links: ["CSS3", "XML", "Python"] },
  { name: "CSS3", group: "Frontend", weight: 1, links: ["HTML5", "Responsive"] },
  { name: "XML", group: "Frontend", weight: 1, links: ["Android Studio", "HTML5"] },
  { name: "Android Studio", group: "Mobile", weight: 1, links: ["Java", "XML", "Firebase Authentication", "SQLite"] },
  { name: "SQLite", group: "Database/Cloud", weight: 1, links: ["Android Studio", "Python"] },
  { name: "Firebase Authentication", group: "Database/Cloud", weight: 1, links: ["Cloud Firestore", "Android Studio"] },
  { name: "Cloud Firestore", group: "Database/Cloud", weight: 1, links: ["Firebase Authentication", "Android Studio"] },
  { name: "Git", group: "Tools", weight: 1.1, links: ["GitHub", "Python"] },
  { name: "GitHub", group: "Tools", weight: 1.1, links: ["Git", "Java"] },
  { name: "Responsive", group: "Frontend", weight: 1, links: ["CSS3", "HTML5"] },
];

export const githubPlaceholder = {
  note: "The repositories link here when a GitHub handle is added.",
  cta: "View my repositories",
};

export const navLinks = [
  { id: "01", label: "About", href: "#about" },
  { id: "02", label: "Journey", href: "#journey" },
  { id: "03", label: "Projects", href: "#projects" },
  { id: "04", label: "Thinking", href: "#thinking" },
  { id: "05", label: "Notebook", href: "#blog-hub" },
  { id: "06", label: "Contact", href: "#contact" },
];
