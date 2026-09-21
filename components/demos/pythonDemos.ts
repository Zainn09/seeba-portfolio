/**
 * The console "storylines" behind each Python demo. These are the
 * screen-recording-style sequences from sections 9 — never fabricated data.
 */

export const libraryScript = [
  { text: "/run library_system.py", tone: "in" as const },
  { text: "—— Library Management System ——", tone: "dim" as const },
  { text: "1. View Books   2. Search   3. Issue   4. Return   5. Exit", tone: "" },
  { text: "/1", tone: "in" as const },
  { text: "ID   TITLE                    AUTHOR        STATUS", tone: "dim" as const },
  { text: "101  Clean Code               R. Martin     available", tone: "" },
  { text: "202  Automate the Boring      A. Sweigart   available", tone: "" },
  { text: "303  Python Crash Course      E. Matthes    issued", tone: "" },
  { text: "/3", tone: "in" as const },
  { text: "Enter book ID: 202", tone: "dim" as const },
  { text: "Enter member name: Abdul", tone: "dim" as const },
  { text: "✓ Book 202 issued to Abdul", tone: "ok" as const },
  { text: "/4", tone: "in" as const },
  { text: "Enter book ID: 202", tone: "dim" as const },
  { text: "✓ Book 202 returned", tone: "ok" as const },
  { text: "/1", tone: "in" as const },
  { text: "202  Automate the Boring      A. Sweigart   available", tone: "" },
  { text: "· record updated — persisted to books.txt", tone: "dim" as const },
];

export const studentScript = [
  { text: "/run student_system.py", tone: "in" as const },
  { text: "—— Student Management System ——", tone: "dim" as const },
  { text: "1. Add   2. Search   3. Display All   4. Exit", tone: "" },
  { text: "/1", tone: "in" as const },
  { text: "Name: Haseeb", tone: "dim" as const },
  { text: "Roll no: BSCS-042", tone: "dim" as const },
  { text: "Program: BS Computer Science", tone: "dim" as const },
  { text: "CGPA: 3.6", tone: "dim" as const },
  { text: "✓ Record saved", tone: "ok" as const },
  { text: "/2", tone: "in" as const },
  { text: "Search roll no: BSCS-042", tone: "dim" as const },
  { text: "Name: Haseeb   Program: BS Computer Science   CGPA: 3.6", tone: "" },
  { text: "· fetched from students.csv", tone: "dim" as const },
];

export const bankScript = [
  { text: "/run bank_system.py", tone: "in" as const },
  { text: "—— Bank Management System (fictional demo data) ——", tone: "dim" as const },
  { text: "1. Create Account   2. Deposit   3. Withdraw   4. Balance   5. Exit", tone: "" },
  { text: "/1", tone: "in" as const },
  { text: "Name: Sample User", tone: "dim" as const },
  { text: "Account no: 1004-2024", tone: "dim" as const },
  { text: "✓ Account created", tone: "ok" as const },
  { text: "/2", tone: "in" as const },
  { text: "Deposit into 1004-2024: 5000", tone: "dim" as const },
  { text: "✓ Deposited. New balance: 5000", tone: "ok" as const },
  { text: "/3", tone: "in" as const },
  { text: "Withdraw from 1004-2024: 1200", tone: "dim" as const },
  { text: "✓ Withdrawn. New balance: 3800", tone: "ok" as const },
  { text: "/4", tone: "in" as const },
  { text: "Account 1004-2024 — balance: 3800", tone: "" },
  { text: "· all amounts are fictional demonstration data", tone: "dim" as const },
];
