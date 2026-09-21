/**
 * The console "storylines" behind each Python demo. These are the
 * screen-recording-style sequences from sections 9 — never fabricated data.
 */

export type DemoLine = { text: string; tone: "in" | "out" | "dim" | "ok" | "" };

export const libraryScript: DemoLine[] = [
  { text: "/run library_system.py", tone: "in" },
  { text: "—— Library Management System ——", tone: "dim" },
  { text: "1. View Books   2. Search   3. Issue   4. Return   5. Exit", tone: "" },
  { text: "/1", tone: "in" },
  { text: "ID   TITLE                    AUTHOR        STATUS", tone: "dim" },
  { text: "101  Clean Code               R. Martin     available", tone: "" },
  { text: "202  Automate the Boring      A. Sweigart   available", tone: "" },
  { text: "303  Python Crash Course      E. Matthes    issued", tone: "" },
  { text: "/3", tone: "in" },
  { text: "Enter book ID: 202", tone: "dim" },
  { text: "Enter member name: Abdul", tone: "dim" },
  { text: "✓ Book 202 issued to Abdul", tone: "ok" },
  { text: "/4", tone: "in" },
  { text: "Enter book ID: 202", tone: "dim" },
  { text: "✓ Book 202 returned", tone: "ok" },
  { text: "/1", tone: "in" },
  { text: "202  Automate the Boring      A. Sweigart   available", tone: "" },
  { text: "· record updated — persisted to books.txt", tone: "dim" },
];

export const studentScript: DemoLine[] = [
  { text: "/run student_system.py", tone: "in" },
  { text: "—— Student Management System ——", tone: "dim" },
  { text: "1. Add   2. Search   3. Display All   4. Exit", tone: "" },
  { text: "/1", tone: "in" },
  { text: "Name: Haseeb", tone: "dim" },
  { text: "Roll no: BSCS-042", tone: "dim" },
  { text: "Program: BS Computer Science", tone: "dim" },
  { text: "CGPA: 3.6", tone: "dim" },
  { text: "✓ Record saved", tone: "ok" },
  { text: "/2", tone: "in" },
  { text: "Search roll no: BSCS-042", tone: "dim" },
  { text: "Name: Haseeb   Program: BS Computer Science   CGPA: 3.6", tone: "" },
  { text: "· fetched from students.csv", tone: "dim" },
];

export const bankScript: DemoLine[] = [
  { text: "/run bank_system.py", tone: "in" },
  { text: "—— Bank Management System (fictional demo data) ——", tone: "dim" },
  { text: "1. Create Account   2. Deposit   3. Withdraw   4. Balance   5. Exit", tone: "" },
  { text: "/1", tone: "in" },
  { text: "Name: Sample User", tone: "dim" },
  { text: "Account no: 1004-2024", tone: "dim" },
  { text: "✓ Account created", tone: "ok" },
  { text: "/2", tone: "in" },
  { text: "Deposit into 1004-2024: 5000", tone: "dim" },
  { text: "✓ Deposited. New balance: 5000", tone: "ok" },
  { text: "/3", tone: "in" },
  { text: "Withdraw from 1004-2024: 1200", tone: "dim" },
  { text: "✓ Withdrawn. New balance: 3800", tone: "ok" },
  { text: "/4", tone: "in" },
  { text: "Account 1004-2024 — balance: 3800", tone: "" },
  { text: "· all amounts are fictional demonstration data", tone: "dim" },
];
