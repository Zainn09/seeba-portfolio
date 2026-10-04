/**
 * Hub (topic cluster) content — the crawlable landing page for each notebook
 * pillar. Server-only: this copy is longer than the homepage teasers and should
 * never reach a client bundle.
 */
import type { HubSlug } from "./types";

export type HubContent = {
  slug: HubSlug;
  name: string;
  tagline: string;
  /** Search-intent sentence used in the page description. */
  summary: string;
  intro: string[];
  covers: string[];
  /** Case studies that put this hub's topics into practice. */
  projectLinks: { name: string; slug: string }[];
  accent: string;
};

export const hubContent: HubContent[] = [
  {
    slug: "python",
    name: "Python",
    tagline: "The language I'm building the whole plan on top of.",
    summary:
      "Notes on Python fundamentals — functions, OOP, file handling, data structures and project structure — written while learning them, not after.",
    intro: [
      "Python is the language the rest of my plan sits on. These notes track the parts I actually use: functions, data structures, file handling, error handling and object-oriented structure — each explained with small, runnable examples rather than abstract definitions.",
      "The articles here are written the way I wish they'd been explained to me: what problem does this solve, when do you reach for it, and what breaks if you don't understand it. Several of them come directly out of console projects in my portfolio.",
    ],
    covers: [
      "Language fundamentals and the order to learn them",
      "Functions, scope, parameters and return values",
      "Data structures and how to choose between them",
      "File handling and persistence in real programs",
      "Object-oriented structure and error handling",
      "Setting up projects and virtual environments",
    ],
    projectLinks: [
      { name: "Library Management System", slug: "library-management-system" },
      { name: "Student Management System", slug: "student-management-system" },
      { name: "Bank Management System", slug: "bank-management-system" },
    ],
    accent: "#6D9D2D",
  },
  {
    slug: "ai-ml",
    name: "AI & Machine Learning",
    tagline: "Concepts explained for someone building toward them.",
    summary:
      "Machine learning and AI concepts explained from the foundation up — datasets, supervised learning, regression and the Python tooling behind them.",
    intro: [
      "AI and machine learning are the direction I'm working toward, and these notes are how I'm building the foundation honestly: what a dataset actually is, how supervised learning differs from unsupervised, what a model is doing when it 'learns', and which Python tools people use along the way.",
      "Nothing here claims expertise. These are explanations written by someone learning the material, with the goal of making the concepts less intimidating for the next student who arrives at the same starting point.",
    ],
    covers: [
      "What artificial intelligence and machine learning actually mean",
      "Datasets: how data is collected, cleaned and structured",
      "Supervised versus unsupervised learning",
      "Linear regression explained from the intuition up",
      "Python libraries used for machine learning work",
      "Common beginner mistakes and a realistic learning path",
    ],
    projectLinks: [
      { name: "Library Management System", slug: "library-management-system" },
      { name: "Student Management System", slug: "student-management-system" },
    ],
    accent: "#147A70",
  },
  {
    slug: "projects",
    name: "Projects",
    tagline: "Real builds, broken down into what was actually learned.",
    summary:
      "Walkthroughs of the projects I've built — what they do, how they're structured, and what each one taught me about software.",
    intro: [
      "Every project in my portfolio exists because I wanted to understand something specific. These articles break those builds down: the structure, the decisions, the bugs, and the parts that only made sense after the program was already working.",
      "If you're looking at the case studies under Projects and want the technical detail behind them, this hub is where the two meet.",
    ],
    covers: [
      "Console application design in Python",
      "Project structure and file organisation",
      "Writing a README that explains the build",
      "Moving from tutorial code to your own project",
      "Choosing an idea worth building",
    ],
    projectLinks: [
      { name: "SneakerStore", slug: "sneakerstore" },
      { name: "Library Management System", slug: "library-management-system" },
      { name: "Chai Dosti Café", slug: "chai-dosti-cafe" },
    ],
    accent: "#B8F56A",
  },
  {
    slug: "problem-solving",
    name: "Problem Solving",
    tagline: "The thinking that happens before, during and after the code.",
    summary:
      "How I approach problems before writing code: decomposition, logic, debugging strategies and the value of deliberate practice.",
    intro: [
      "Most of the difficulty in programming is not syntax — it's deciding what the problem actually is. These notes are about that: reading a problem twice, pinning down inputs and outputs, breaking something large into pieces small enough to hold in your head, and only then writing code.",
      "There's also the other half: what to do when it doesn't work. Debugging is a skill with its own method, and it can be practised.",
    ],
    covers: [
      "Turning a problem statement into a plan",
      "Decomposition and stepwise thinking",
      "Debugging strategies that find real causes",
      "Programming logic and control flow",
      "Coding challenges and what they're actually for",
    ],
    projectLinks: [
      { name: "Responsive Calculator", slug: "responsive-calculator" },
      { name: "Bank Management System", slug: "bank-management-system" },
    ],
    accent: "#6672C7",
  },
  {
    slug: "software-development",
    name: "Software Development",
    tagline: "The craft of turning an idea into working software.",
    summary:
      "The practices around the code — version control with Git and GitHub, project structure, documentation and debugging — explained for students.",
    intro: [
      "Writing code is one part of software development. The rest is tooling and habits: version control so you can undo mistakes, structure so a project stays navigable, and documentation so someone else can run what you built.",
      "These articles cover the practices I use on every project, explained without assuming prior experience with a team or a production codebase.",
    ],
    covers: [
      "Git basics and the commands you actually use",
      "Git versus GitHub — what each one is for",
      "Project structure that scales past a single file",
      "Writing a README that works",
      "Debugging as part of the development loop",
    ],
    projectLinks: [
      { name: "SneakerStore", slug: "sneakerstore" },
      { name: "Library Management System", slug: "library-management-system" },
    ],
    accent: "#7DE2D1",
  },
  {
    slug: "android",
    name: "Android Development",
    tagline: "The Java / XML / Firebase chapter.",
    summary:
      "Android development with Java and XML — app architecture, Firebase authentication, Firestore, SQLite, shopping cart logic and Material Design.",
    intro: [
      "Android is where my learning got its first genuinely complex project. Java and XML layouts, activities and navigation, authentication, local and cloud data storage, and an interface built on Material Design conventions — all inside one application.",
      "These articles cover the concepts behind that build: how an Android app is structured, how authentication works, when to use SQLite versus a cloud database, and how cart-style state is kept consistent across screens.",
    ],
    covers: [
      "App architecture for beginners (Activities, layouts, navigation)",
      "Java and XML in Android Studio",
      "Firebase Authentication in a real user flow",
      "Cloud Firestore versus SQLite",
      "Shopping cart and quantity logic",
      "Material Design as a system",
    ],
    projectLinks: [
      { name: "SneakerStore", slug: "sneakerstore" },
      { name: "Responsive Calculator", slug: "responsive-calculator" },
    ],
    accent: "#F59E0B",
  },
  {
    slug: "student-journey",
    name: "Student Developer",
    tagline: "Notes from inside a BSCS degree.",
    summary:
      "Notes from a BSCS degree — learning programming, building projects alongside coursework, using GitHub as a student and preparing for internships.",
    intro: [
      "I'm a BSCS student, and this hub is about that context: learning to program while also carrying a degree, finding time to build real projects, and figuring out which habits actually compound.",
      "It includes the honest parts — tutorial dependency, comparing yourself to people further along, and what a student portfolio should and shouldn't claim.",
    ],
    covers: [
      "What a BSCS degree covers — and what it doesn't",
      "Learning to program as a student",
      "Choosing a first programming language",
      "Building projects while studying",
      "GitHub for students and preparing for internships",
      "What a developer portfolio should actually show",
    ],
    projectLinks: [
      { name: "Chai Dosti Café", slug: "chai-dosti-cafe" },
      { name: "SneakerStore", slug: "sneakerstore" },
    ],
    accent: "#A7B5FF",
  },
];

export const hubContentBySlug: Record<string, HubContent> = Object.fromEntries(
  hubContent.map((hub) => [hub.slug, hub])
);
