/**
 * Project case studies — the long-form, server-only content behind
 * /projects/<slug>. Every claim here matches what the project actually is:
 * console programs, static sites and one Android app. No invented metrics,
 * users, downloads, clients or outcomes.
 *
 * `lib/content.ts` keeps the short homepage teaser copy; this file holds the
 * detail that only the case-study pages need (so it never reaches the
 * homepage client bundle).
 */
import type { Project } from "@/lib/content";

export type ProjectCaseStudy = {
  slug: string;
  name: string;
  tagline: string;
  group: string;
  index: string;
  /** Used in metadata description, cards and schema. */
  summary: string;
  purpose: string;
  problem: string;
  role: string;
  platform: string;
  tech: string[];
  features: { title: string; detail: string }[];
  process: { title: string; detail: string }[];
  learned: string[];
  challenges: { title: string; detail: string }[];
  /** Article slugs in the notebook that go deeper on this project's skills. */
  relatedArticles: string[];
  /** Other case studies worth reading next. */
  relatedProjects: string[];
  demo: Project["demo"];
  repoUrl: string | null;
  liveUrl: string | null;
  keywords: string[];
  /** Honest note about the boundaries of the build. */
  note: string;
};

export const projectCaseStudies: ProjectCaseStudy[] = [
  {
    slug: "sneakerstore",
    name: "SneakerStore",
    tagline: "An Android e-commerce app, from login to cart",
    group: "Android",
    index: "PROJECT / 06",
    summary:
      "SneakerStore is an Android e-commerce application built in Java with XML layouts in Android Studio — it covers account creation and login with Firebase Authentication, product browsing, a shopping cart, address management and a Material Design interface.",
    purpose:
      "SneakerStore was built to answer one question honestly: can I take an app past a tutorial and ship a complete flow — account, browse, choose, cart, address — as one connected product? It's the largest build in my portfolio and the one that taught me the most about how Android applications are actually structured.",
    problem:
      "Most beginner Android projects stop at a single screen that reads from a hard-coded list. A shopping app can't: it needs identity (who is this user), state that survives navigation (what's in their cart), structured data (products, addresses) and an interface that stays usable on a small screen. Each of those is a separate problem that has to work together.",
    role:
      "Solo build — I designed the screens, wrote the Java, laid out the XML, wired up authentication and data storage, and debugged it on emulators and a physical device. No team, no template project and no generated codebase.",
    platform: "Android (Java + XML layouts, Android Studio)",
    tech: ["Java", "XML", "Firebase Authentication", "Cloud Firestore", "SQLite", "Android Studio", "Material Design"],
    features: [
      {
        title: "Account creation and login",
        detail:
          "Email-based sign-up and sign-in handled with Firebase Authentication, including the error states that actually matter — wrong password, unregistered email, empty fields.",
      },
      {
        title: "Product browsing",
        detail:
          "A product list with imagery, names and prices, plus a detail screen for a single shoe so the user can move from browsing to a purchase decision.",
      },
      {
        title: "Shopping cart",
        detail:
          "Add and remove items, adjust quantity, and see a running total — with the cart state held so it survives moving between screens instead of resetting on every navigation.",
      },
      {
        title: "Address management",
        detail:
          "A dedicated step to capture and store the delivery address, so checkout is a flow rather than a single form bolted onto the cart.",
      },
      {
        title: "Material Design interface",
        detail:
          "Cards, elevation, spacing, typography and touch targets built to Material Design conventions rather than default Android widgets.",
      },
      {
        title: "Two data layers",
        detail:
          "A cloud layer for accounts and shared product data, and a local SQLite layer for app data that should be fast and available on the device.",
      },
    ],
    process: [
      {
        title: "Screens before code",
        detail:
          "I sketched the flow first — splash → auth → home → product → cart → address → confirmation — so each Activity had one job before I wrote a line of Java.",
      },
      {
        title: "Data model next",
        detail:
          "Products, cart items and addresses were defined as models before the UI that displayed them, which is what made the cart logic manageable later.",
      },
      {
        title: "Auth, then everything else",
        detail:
          "Authentication came early because every other screen depends on knowing who the user is. Getting it working first removed a whole class of blocked work.",
      },
      {
        title: "Build the boring path, then break it",
        detail:
          "Each feature got built for the happy path first, then tested against empty carts, missing addresses, duplicate taps and slow network responses.",
      },
      {
        title: "Polish last, on purpose",
        detail:
          "Material Design styling, spacing and transitions came after the logic worked — so I never spent time making a broken screen look good.",
      },
    ],
    learned: [
      "How an Activity-based Android app is structured, and where shared state belongs",
      "Wiring Firebase Authentication into a real user flow, including failure states",
      "Designing cart logic that stays consistent across screens",
      "Choosing between cloud and local storage instead of defaulting to one",
      "Applying Material Design as a system, not as decoration",
      "Debugging on an emulator and a physical device — where the differences show up",
    ],
    challenges: [
      {
        title: "Keeping the cart honest",
        detail:
          "The first cart implementation recalculated totals in each screen that displayed them, so quantity changes could disagree with the total. Centralising the cart as one state source fixed it and taught me why single-source-of-truth matters.",
      },
      {
        title: "Authentication edge cases",
        detail:
          "Rainy-day paths — no network, cancelled sign-in, an account that doesn't exist yet — took longer than the happy path, and were the part that made the app feel finished.",
      },
      {
        title: "Layouts that survive small screens",
        detail:
          "Screens that fit one emulator broke on a smaller device. Switching to responsive XML layouts with correct weight and scroll behaviour was the fix.",
      },
      {
        title: "Where data lives",
        detail:
          "Deciding what belongs in the cloud versus the device forced me to think about offline behaviour and speed, not just what was convenient to code.",
      },
    ],
    relatedArticles: [
      "sneakerstore-ecommerce-app",
      "java-android-development",
      "firebase-auth-android",
      "shopping-cart-logic-android",
      "material-design-android",
      "android-app-architecture-beginners",
      "cloud-firestore-basics",
    ],
    relatedProjects: ["library-management-system", "student-management-system"],
    demo: "sneaker",
    repoUrl: null,
    liveUrl: null,
    keywords: [
      "Android e-commerce app",
      "Java Android app",
      "Firebase Android app",
      "SQLite Android app",
      "shopping cart Android app",
      "student software project",
      "Material Design Android",
    ],
    note:
      "This is a learning build with fictional product data and no real payment integration — the goal was the application flow and the Android architecture behind it, not a live store.",
  },
  {
    slug: "library-management-system",
    name: "Library Management System",
    tagline: "Books in, books out, records kept",
    group: "Python · Console",
    index: "PROJECT / 03",
    summary:
      "A Python console application that manages the full life of a book record — adding books, searching the catalogue, issuing and returning copies — with data persisted to a file so the library survives between runs.",
    purpose:
      "Built to take Python past single-file scripts. The library application was my first program where one part of the code had to be responsible for another part: records, search, issue and return all share state, and that state has to survive the program closing.",
    problem:
      "A book record changes over time — it gets issued, returned, searched for and sometimes removed. In memory, that data vanishes the moment the program exits. The real problem wasn't printing a menu, it was making the records persistent and keeping them consistent while several operations read and write the same data.",
    role:
      "Solo build — designed the record structure, wrote the menu and functions, implemented file persistence, and tested the issue/return cycle against edge cases like issuing an already-issued book.",
    platform: "Console application (Python 3)",
    tech: ["Python", "File handling", "Functions", "Data structures", "OOP"],
    features: [
      {
        title: "Add and list books",
        detail: "Register a new book with its details, then view the full catalogue in a readable console listing.",
      },
      {
        title: "Search the catalogue",
        detail: "Find a book by title or identifier without scanning the printed list by eye.",
      },
      {
        title: "Issue and return",
        detail:
          "Change a book's availability, and prevent the obvious mistake of issuing something that is already out.",
      },
      {
        title: "Persistent records",
        detail:
          "Everything is written to a file, so the catalogue is still there the next time the program starts.",
      },
      {
        title: "Menu-driven flow",
        detail: "A numbered menu keeps the whole system usable without remembering a syntax.",
      },
    ],
    process: [
      { title: "Define one record", detail: "I decided what a 'book' is on paper first — identifier, title, availability — before writing any storage code." },
      { title: "Functions per action", detail: "Add, search, issue and return each became their own function so the menu stayed thin and readable." },
      { title: "Persist early", detail: "File handling went in before extra features, so every later feature was tested against real saved data." },
      { title: "Break the issue/return cycle", detail: "I deliberately tried to issue an already-issued book, return a non-existent one and search an empty catalogue, then handled each result properly." },
      { title: "Refactor the menu", detail: "Once everything worked, I pulled repeated input handling out of the branches to remove duplication." },
    ],
    learned: [
      "Reading and writing files safely instead of keeping everything in memory",
      "Splitting a program into functions with one responsibility each",
      "Choosing a data structure that matches how the records are searched",
      "Validating input before it reaches the logic",
      "Testing state transitions, not just single actions",
    ],
    challenges: [
      {
        title: "Consistency across operations",
        detail: "Search, issue and return all touch the same records. Keeping one representation of the catalogue in memory — saved back to the file after each change — stopped the operations from disagreeing.",
      },
      {
        title: "Bad input at the menu",
        detail: "A console menu accepts anything the user types. Handling letters, empty input and out-of-range choices everywhere took more code than the features themselves.",
      },
      {
        title: "File formats that stay readable",
        detail: "The first storage format was hard to inspect by hand. Restructuring what got written made debugging far easier when records looked wrong.",
      },
    ],
    relatedArticles: [
      "library-management-system-python",
      "python-file-handling",
      "python-oop-concepts",
      "console-app-design",
      "python-project-structure",
    ],
    relatedProjects: ["student-management-system", "bank-management-system"],
    demo: "library",
    repoUrl: null,
    liveUrl: null,
    keywords: [
      "library management system Python",
      "Python console application",
      "file handling project",
      "Python beginner project",
    ],
    note: "Console project — no database server or web interface; records live in a local file by design.",
  },
  {
    slug: "student-management-system",
    name: "Student Management System",
    tagline: "Student records with somewhere to live",
    group: "Python · Console",
    index: "PROJECT / 04",
    summary:
      "A Python console application for managing student records — adding students, saving them, searching the list and displaying results — built to practise functions, data structures and file handling in one connected program.",
    purpose:
      "The next step after the library project: same ideas, different records. It was built to prove the pattern generalises — one program that stores many records, finds them again quickly and keeps them after it exits.",
    problem:
      "Student data arrives in an order that doesn't match how you need to read it back. You enter records one at a time but search them by name or roll number later. The task was to store records in a shape that makes retrieval fast and display readable.",
    role: "Solo build — record design, add/search/display features, persistence and input validation.",
    platform: "Console application (Python 3)",
    tech: ["Python", "Data structures", "File handling", "Functions", "Console"],
    features: [
      { title: "Add student records", detail: "Capture name, roll number and marks, with validation before anything is saved." },
      { title: "Save and load", detail: "Records are written to a file and loaded back on start, so the system has memory between sessions." },
      { title: "Search by roll number", detail: "A dictionary-style lookup makes finding one student quick instead of scanning the whole list." },
      { title: "Display all records", detail: "A formatted view of every stored student for reviewing the dataset at a glance." },
      { title: "Duplicate protection", detail: "The same roll number can't be registered twice." },
    ],
    process: [
      { title: "Shape of a record", detail: "Fields were fixed first so both saving and searching agreed on the structure." },
      { title: "Structure over speed", detail: "Switching the in-memory store to a keyed structure made lookup behaviour obvious." },
      { title: "Save on change", detail: "Any operation that modified the data wrote it back immediately — no 'remember to save' step." },
      { title: "Test with messy data", detail: "Long names, missing marks and duplicates were deliberately entered to find formatting and validation bugs." },
    ],
    learned: [
      "Picking a data structure based on how data will be read, not written",
      "Keeping validation and storage logic separate",
      "Formatting console output so records stay legible",
      "Handling duplicate and missing keys without crashing",
    ],
    challenges: [
      { title: "Formatting that survives real names", detail: "Fixed-width console columns looked fine in tests and broke on longer values — solved with consistent padding rules." },
      { title: "Numbers that aren't numbers", detail: "Marks entered as text, or left blank, needed converting and validating before they could be stored or averaged." },
    ],
    relatedArticles: [
      "student-management-system-python",
      "python-data-structures",
      "python-file-handling",
      "console-app-design",
    ],
    relatedProjects: ["library-management-system", "bank-management-system"],
    demo: "student",
    repoUrl: null,
    liveUrl: null,
    keywords: [
      "student management system Python",
      "Python data structures project",
      "Python file handling project",
    ],
    note: "Console project with local file storage; no database server or web interface.",
  },
  {
    slug: "bank-management-system",
    name: "Bank Management System",
    tagline: "Accounts, deposits, withdrawals — all fictional",
    group: "Python · Console",
    index: "PROJECT / 05",
    summary:
      "A Python console application that models simple banking: create an account, deposit, withdraw and check a balance, with transaction rules enforced in code and every record clearly fictional.",
    purpose:
      "Built to practise one specific idea: rules. Banking logic is unforgiving about state — a withdrawal must not take an account below zero, and a deposit must be recorded. It was the clearest way I could think of to learn object-oriented structure and guarded state.",
    problem:
      "Money logic has to be correct at every step. If a balance can be changed from anywhere, invalid states appear — negative balances, missing accounts, transactions that vanish. The problem was enforcing every rule in one place instead of trusting the menu to be sensible.",
    role: "Solo build — account model, transaction rules, persistence and console interface.",
    platform: "Console application (Python 3)",
    tech: ["Python", "OOP", "State management", "Functions", "File handling"],
    features: [
      { title: "Create an account", detail: "Register an account with an initial balance and a unique identifier." },
      { title: "Deposit", detail: "Add funds and update the stored balance immediately." },
      { title: "Withdraw with guardrails", detail: "Withdrawals are refused if funds are insufficient — the rule lives in the logic, not the interface." },
      { title: "Balance enquiry", detail: "Read the current state of an account cleanly." },
      { title: "Fictional data only", detail: "The system is explicitly conceptual: no real banking data, no external services." },
    ],
    process: [
      { title: "Model the account first", detail: "Balance and history became properties of the account, so no operation could change state from outside it." },
      { title: "Rules in one place", detail: "Validation for deposits and withdrawals was centralised so every path went through the same checks." },
      { title: "Trace every path", detail: "I walked through deposit → withdraw → enquiry in order to confirm state was what the display claimed." },
      { title: "Guard the display", detail: "Messages for failed operations were made as explicit as successful ones, so a refused withdrawal is obvious." },
    ],
    learned: [
      "Why state should be changed through methods rather than directly",
      "Writing rules that cannot be bypassed by a different menu path",
      "Keeping a clear separation between interface and logic",
      "Reasoning about a program as a sequence of state changes",
    ],
    challenges: [
      { title: "Making invalid states impossible", detail: "The early version allowed a direct balance assignment, which made negative balances possible. Moving the change behind a method removed the class of bug entirely." },
      { title: "Failure messages that help", detail: "An unclear refusal looks like a bug. Explicit messages for insufficient funds and unknown accounts made the system feel reliable." },
    ],
    relatedArticles: [
      "bank-management-system-python",
      "python-oop-concepts",
      "python-error-handling",
      "console-app-design",
    ],
    relatedProjects: ["library-management-system", "student-management-system"],
    demo: "bank",
    repoUrl: null,
    liveUrl: null,
    keywords: [
      "bank management system Python",
      "Python OOP project",
      "Python console banking project",
    ],
    note: "Purely conceptual — all accounts, names and balances are fictional and no real financial service is involved.",
  },
  {
    slug: "chai-dosti-cafe",
    name: "Chai Dosti Café",
    tagline: "An actual café site, built by hand",
    group: "Web Foundations",
    index: "PROJECT / 01",
    summary:
      "Chai Dosti Café is a hand-built responsive website for a café — layout, typography and section structure written in plain HTML and CSS, and the project where responsive web design started making sense.",
    purpose:
      "The first real website I built. The goal was to understand what a page is made of — structure, spacing, type and images — without a framework hiding any of it.",
    problem:
      "A café site is not a document; it's a presentation. It has to look welcoming and stay readable on a phone, a laptop and a projector. Laying it out by hand meant solving that with structure and CSS rather than a page builder.",
    role: "Solo build — layout, HTML structure and all CSS written by hand.",
    platform: "Static website (HTML5 + CSS3)",
    tech: ["HTML5", "CSS3", "Responsive layout"],
    features: [
      { title: "Sectioned single page", detail: "Hero, menu, story and contact sections in one continuous, readable page." },
      { title: "Responsive from the smallest screen", detail: "Layouts were written mobile-first, then expanded with media queries." },
      { title: "Typography-led design", detail: "Type scale and spacing carry the warmth of the brand rather than heavy graphics." },
      { title: "Hand-written CSS", detail: "Flexbox and grid used directly — no framework, no utility classes to hide what was happening." },
    ],
    process: [
      { title: "Structure first", detail: "Semantic HTML sections were written before any styling, so the page made sense unstyled." },
      { title: "Mobile-first CSS", detail: "Base styles targeted small screens; media queries added layout as space appeared." },
      { title: "Iterate in the browser", detail: "Spacing and hierarchy were adjusted live in dev tools until the page felt right at every width." },
    ],
    learned: [
      "Semantic HTML structure and why it matters before styling",
      "Flexbox and grid for real layouts, not just demos",
      "Mobile-first responsive thinking",
      "Reading a design as spacing, scale and hierarchy",
    ],
    challenges: [
      { title: "Layouts that held but didn't breathe", detail: "The first grid was responsive but cramped on tablets; adjusting the type scale and gutters fixed the middle range that media queries often miss." },
      { title: "Sizing images sensibly", detail: "Oversized images broke the layout and slowed the page — constraining them in CSS was the first lesson in performance." },
    ],
    relatedArticles: ["learn-programming-as-student", "building-projects-while-studying", "tutorial-to-project"],
    relatedProjects: ["responsive-calculator"],
    demo: "cafe",
    repoUrl: null,
    liveUrl: null,
    keywords: ["café website HTML CSS", "responsive website project", "HTML CSS beginner project"],
    note: "A static front-end build — the interactive demo on this page is a lightweight recreation of it running in the browser.",
  },
  {
    slug: "responsive-calculator",
    name: "Responsive Calculator",
    tagline: "Layout that adapts to the hand holding it",
    group: "Web Foundations",
    index: "PROJECT / 02",
    summary:
      "A responsive calculator built with HTML, CSS and a little JavaScript — the same controls stay comfortable and tappable whether the page is open on a phone or a desktop monitor.",
    purpose:
      "Built to test whether the responsive habits from the café site held up in an interface rather than a page. Buttons are layout problems too.",
    problem:
      "A calculator's controls have to be large enough to tap and close enough to scan. That balance changes completely between a phone and a wide monitor — and the layout has to hold at every width in between.",
    role: "Solo build — grid layout, styling and the calculator's interaction logic.",
    platform: "Static website (HTML5 + CSS3 + JavaScript)",
    tech: ["HTML5", "CSS3", "CSS Grid", "Responsive layout"],
    features: [
      { title: "Touch-friendly keys", detail: "Button sizing follows the smallest screen first, then scales up with the viewport." },
      { title: "CSS grid keypad", detail: "The keypad is a grid, so rows and columns stay aligned at every width instead of drifting." },
      { title: "Readable display", detail: "The display scales with the layout so long expressions stay legible." },
      { title: "Keyboard and pointer", detail: "Works through clicking, tapping and keyboard input rather than touch only." },
    ],
    process: [
      { title: "Draw the grid", detail: "Keypad rows and columns were decided as a grid before styling anything." },
      { title: "Small screen first", detail: "Sizing started at phone width, then grew — the reverse of what looked easiest." },
      { title: "Test the extremes", detail: "Checked the layout at very narrow and very wide viewports, plus zoomed text, to find where it broke." },
    ],
    learned: [
      "Using CSS grid for a controls-based interface",
      "Sizing interactive elements for real fingers, not just pixels",
      "Letting content dictate breakpoints instead of guessing device widths",
      "Keeping an interface usable with keyboard as well as pointer",
    ],
    challenges: [
      { title: "Buttons that drift on wide screens", detail: "Fixed widths left gaps at large viewports; switching to grid fractions kept the keypad proportional everywhere." },
      { title: "Keyboard support", detail: "Making the calculator respond to typed input meant handling focus and key events, which was new territory at the time." },
    ],
    relatedArticles: ["programming-logic", "thinking-before-coding", "debugging-strategies"],
    relatedProjects: ["chai-dosti-cafe"],
    demo: "calculator",
    repoUrl: null,
    liveUrl: null,
    keywords: ["responsive calculator HTML CSS", "CSS grid calculator", "frontend beginner project"],
    note: "Front-end only — no backend, and the demo on this page is a live re-creation of the interface.",
  },
];

/** Search-intent titles for the case-study pages — one unique title each. */
export const projectSeoTitle: Record<string, string> = {
  sneakerstore: "SneakerStore — Android E-Commerce App Case Study",
  "library-management-system": "Library Management System in Python — Case Study",
  "student-management-system": "Student Management System in Python — Case Study",
  "bank-management-system": "Bank Management System in Python — Case Study",
  "chai-dosti-cafe": "Chai Dosti Café — Responsive HTML & CSS Website",
  "responsive-calculator": "Responsive Calculator — HTML, CSS Grid & JavaScript",
};

export const projectBySlug: Record<string, ProjectCaseStudy> = Object.fromEntries(
  projectCaseStudies.map((project) => [project.slug, project])
);

export function relatedProjectsFor(project: ProjectCaseStudy): ProjectCaseStudy[] {
  return project.relatedProjects
    .map((slug) => projectBySlug[slug])
    .filter((value): value is ProjectCaseStudy => Boolean(value));
}
