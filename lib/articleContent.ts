import { articlesBySlug, allArticles, relatedArticles } from "@/lib/articles";
import { additions } from "@/content/sections/index";
import type { ArticleMeta } from "@/content/types";
import { SITE } from "@/lib/site";

/**
 * Article content engine. Each entry composes a full 900–1,500 word markdown
 * piece from its structured metadata using category-authored templates. The
 * prose is written to read like a developer explaining something — natural
 * rhythm, specific examples, no filler clichés.
 */

const EXTERNAL = {
  pythonDocs: "the official [Python documentation](https://docs.python.org/3/)",
  pep8: "[PEP 8](https://peps.python.org/pep-0008/) style guide",
  gitDocs: "the official [Git documentation](https://git-scm.com/doc)",
  firebaseAuth: "the [Firebase Authentication docs](https://firebase.google.com/docs/auth)",
  firestore: "the [Cloud Firestore documentation](https://firebase.google.com/docs/firestore)",
  android: "the [Android developer documentation](https://developer.android.com/guide)",
  material: "[Material Design's official guidelines](https://m3.material.io/)",
  sqlite: "the [SQLite documentation](https://www.sqlite.org/docs.html)",
  pandas: "the official [pandas user guide](https://pandas.pydata.org/docs/)",
  scikit: "the [scikit-learn user guide](https://scikit-learn.org/stable/user_guide.html)",
  w3c: "the [W3C's HTML specification](https://html.spec.whatwg.org/)",
  githubDocs: "the [GitHub documentation](https://docs.github.com/)",
};

function slug(article: ArticleMeta | undefined): string {
  return article ? article.slug : "";
}

function relatedLinks(article: ArticleMeta, n = 4): string {
  const rel = relatedArticles(article, n);
  return rel
    .map((r) => `- [${r.title}](/blog/${r.slug})`)
    .join("\n");
}

function faqBlock(faqs: [string, string][]): string {
  if (faqs.length === 0) return "";
  return (
    "\n\n## Frequently asked questions\n\n" +
    faqs.map(([q, a]) => `### ${q}\n\n${a}\n`).join("\n")
  );
}

function outro(article: ArticleMeta): string {
  const rel = relatedArticles(article, 1)[0];
  return `\n\n## Keep building\n\nThat's the whole shape of it. If one idea stuck, go make a tiny version of it today — the smallest program that proves the point — and commit it before you fall asleep.\n\nThis article is part of a connected notebook written while learning, not from a finished summit. It links out to documentation I actually used, and points to other pieces that go deeper.\n\nNext worth reading: [${rel.title}](/blog/${rel.slug}).\n`;
}

/* ================================================================== */
/* Python templates                                                    */
/* ================================================================== */

function pythonRoadmap(a: ArticleMeta): string {
  return `# ${a.title}

Most "learn Python" roadmaps fail for one boring reason: they're written for infinite free time. A student has lectures, assignments, and about four focused hours a week. This roadmap assumes that reality.

Here's the honest structure I settled on after trying the other kind. It's organized in phases, each one ending with something you built, not something you watched.

## Before you start: pick the goal

Decide what the language is for. If it's web development, your path leans toward frameworks later. If it's data and AI/ML — my direction — the path pushes toward data structures, file handling, and math-friendly habits early. The roadmap below is written for the second goal, but the first four phases are identical for everyone.

## Table of contents

- Phase 1: syntax that sticks
- Phase 2: functions and scope
- Phase 3: data structures
- Phase 4: files and real programs
- Phase 5: object-oriented Python
- Phase 6: the AI/ML on-ramp
- How many weeks this actually takes

## Phase 1: syntax that sticks

Learn the basics until you can write them from memory without looking anything up: variables, numbers and strings, lists, if/elif/else, for and while loops, and basic input/output.

The trap is spending three weeks on this. Don't. About 10–14 days of short daily sessions is enough. Your exit test is a working number-guessing game with a loop and a condition, run entirely in the terminal.

\`\`\`python
import random

secret = random.randint(1, 20)
guess = None
while guess != secret:
    guess = int(input("Guess a number 1–20: "))
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")
print(f"Correct! It was {secret}.")
\`\`\`

## Phase 2: functions and scope

Functions are where the language stops being a script and starts being a program. Learn parameters, return values, local vs global scope, and default arguments. This phase is short on time but important on meaning — almost everything later is organized around functions.

A common mistake is treating \`print()\` as a result. It isn't. \`return\` is the result. Train that habit now.

## Phase 3: data structures

Lists, dictionaries, tuples, and sets — in that order of importance. Dictionaries deserve the most time because almost every real program is a pile of lookup tables. Practice until converting a list of records into a dictionary keyed by ID feels automatic.

| Structure | Ordered | Mutable | Duplicates | Use when |
|---|---|---|---|---|
| list | yes | yes | yes | sequence matters |
| tuple | yes | no | yes | fixed group |
| dict | yes | yes | keys unique | lookups by key |
| set | no | yes | no | uniqueness |

## Phase 4: files and real programs

This is the phase where projects stop resetting when the terminal closes. Learn \`open()\`, the \`with\` statement, reading/writing text, and CSV handling. Then prove it: build a console app that saves records to a file and loads them back.

That single skill — persistence — is the difference between a toy and a tool. (If you want a worked example, I wrote up how I structured mine in [${a.title}] continuing below — the Library Management System walkthrough.)

## Phase 5: object-oriented Python

Classes, \`__init__\`, self, methods, and inheritance. Learn the mechanics, but don't drink the ceremony. OOP in Python is a tool for grouping state and behavior, not a religion. Build one small class-based program and move on.

## Phase 6: the AI/ML on-ramp

Only after the foundation is comfortable: NumPy for arrays, pandas for tables, and the mathematics you'll need — linear algebra, basic probability, and what a derivative means. Then a first model with scikit-learn. This is where my own path is currently pointing, and the key is not to rush into it before phases 1–5 are boring.

> Remember: this article describes a plan and direction — a learning path, not claimed expertise.

## How many weeks this actually takes

At four focused hours a week: phases 1–2 about 4 weeks, phase 3 about 3 weeks, phase 4 about 3 weeks, phase 5 about 2 weeks. Roughly three months to a solid base, then a lifetime of going deeper. ${EXTERNAL.pythonDocs} is the reference you should keep open the whole way.

## Keep building

A roadmap only works if it ends in output. Each phase's exit test is a project, not a quiz — because the goal was never to finish a roadmap. It was to build things that make the next thing easier.

Related reading:\n\n${relatedLinks(a)}\n`;
}

function pythonFunctions(a: ArticleMeta): string {
  return `# ${a.title}

Ask someone what they use most in Python and the honest answer is usually "def." Functions are the unit every other idea gets built from, and yet most tutorials race past the three details that actually matter: what a function returns, what it can see (scope), and the difference between \`return\` and \`print\`.

Let's slow those three down.

## Table of contents

- The point of a function
- Def, parameters, return
- Return vs print
- Scope in plain words
- Defaults and keyword arguments
- Common mistakes
- Frequently asked questions

## The point of a function

A function is a named block of code you can reuse. That's the whole pitch. You use one because the alternative — copying the same six lines everywhere — means changing it in six places every time the logic changes.

\`\`\`python
def total_with_tax(price):
    return price * 1.17
\`\`\`

## Def, parameters, return

\`def\` names it. Parameters are the inputs listed in parentheses. \`return\` is the value the function hands back to whoever called it.

\`\`\`python
def add(a, b):
    result = a + b
    return result

print(add(2, 3))  # 5
\`\`\`

What's easy to miss: without \`return\`, a function always gives back \`None\`. It runs fine, lets you down silently later.

## Return vs print

\`print\` writes text to the screen. \`return\` produces a value your code can use. A function that prints is useful for humans at that moment; a function that returns is useful forever.

\`\`\`python
def double(n):
    return n * 2

x = double(4)      # x is 8 — you can use it
print(x + 1)       # 9
\`\`\`

If \`double\` had used \`print\` instead of \`return\`, the line \`x = double(4)\` would leave \`x\` as \`None\`, and \`x + 1\` would crash.

## Scope in plain words

Where a variable is visible is its scope. A variable created inside a function lives and dies inside that function. Code outside can't see it, and the function can't accidentally change an outer variable of the same name.

Global variables work, but every experienced developer reads them with suspicion — they let one part of a program reach into another without asking. Prefer passing values in as parameters and taking results out with \`return\`.

## Defaults and keyword arguments

Two conveniences that make functions comfortable to call:

\`\`\`python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}"

greet("Abdul")                    # "Hello, Abdul"
greet("Abdul", greeting="Hi")     # "Hi, Abdul"
\`\`\`

Defaults let callers skip arguments they don't care about. Keyword arguments (\`greeting="Hi"\`) make long argument lists readable at the call site.

## Common mistakes

- **Forgetting return.** The function works in a demo and returns \`None\` in real code.
- **Confusing print and return.** Prints for feedback, return for data.
- **Mutating a default list.** A default \`kwargs=[]\` is created once and shared across every call — a classic hidden bug. Use \`None\` and create the list inside.

The guidance in ${EXTERNAL.pep8} keeps function style consistent, but the rules above are about behavior, which is what breaks things.

${faqBlock([
  ["What is the difference between return and print in Python?",
   "`print()` writes text to the console for a person to read; `return` produces a value your program can store and pass around. A function with no `return` statement returns `None`."],
  ["Can a Python function return multiple values?",
   "Yes — `return a, b` is valid. It actually returns a single tuple that Python lets you unpack into two variables."],
  ["What are *args and **kwargs?",
   "`*args` accepts extra positional arguments as a tuple; `**kwargs` accepts extra keyword arguments as a dictionary. Both let you write functions that handle a variable number of inputs."],
])}

Next logical step: ${relatedLinks(a, 1)}`;
}

function pythonOop(a: ArticleMeta): string {
  return `# ${a.title}

Object-oriented programming gets a reputation for being abstract. In practice it's one idea: group the data a thing has together with the actions that thing can do. A student record has a name and a CGPA, and you can update its CGPA. Grouping those is a class.

That's it. Everything else — inheritance, encapsulation, dunder methods — is refinement on top.

## Table of contents

- Why OOP exists
- Classes and objects
- \\__init__ and self
- Methods vs functions
- Inheritance in one picture
- Encapsulation, Python-style
- Frequently asked questions

## Why OOP exists

When a program has ten students, three lists (names, IDs, grades) work because you keep them lined up by index. When it has a thousand, "keep them lined up" breaks. A class puts each student's fields in one place, so a record can't get out of sync.

## Classes and objects

A class is a blueprint. An object is an actual instance built from it.

\`\`\`python
class Student:
    def __init__(self, name, roll_no):
        self.name = name
        self.roll_no = roll_no
        self.courses = []

s = Student("Haseeb", "BSCS-042")
print(s.name)  # Haseeb
\`\`\`

## \\__init__ and self

\`__init__\` runs when an object is created. Its job is to set the object's starting state. \`self\` is the object itself — the way a method knows *which* instance it's talking about when there are hundreds.

Every method's first parameter is \`self\`. You never pass it explicitly; Python does it for you.

## Methods vs functions

A method is just a function that belongs to a class and receives \`self\`.

\`\`\`python
class Student:
    def __init__(self, name, cgpa):
        self.name = name
        self.cgpa = cgpa

    def improve(self, delta):
        self.cgpa += delta

s = Student("Haseeb", 3.4)
s.improve(0.2)
print(s.cgpa)  # 3.6
\`\`\`

## Inheritance in one picture

Inheritance lets a class reuse another class's behavior. A \`Teacher\` and a \`Student\` are both \`Person\`s: shared fields like name and age live in the parent, and each child adds what makes it different.

\`\`\`python
class Person:
    def __init__(self, name):
        self.name = name

class Student(Person):
    def __init__(self, name, roll_no):
        super().__init__(name)
        self.roll_no = roll_no
\`\`\`

\`super().__init__(name)\` calls the parent's setup so you don't rewrite it. Don't use inheritance until two classes genuinely share behavior — a chain of inheritance "for flexibility" usually adds complexity without adding clarity.

## Encapsulation, Python-style

Encapsulation means keeping the inside of an object from being fiddled with directly. Python's version is convention, not enforcement: a single leading underscore (\`_balance\`) means "treat this as internal."

\`\`\`python
class Account:
    def __init__(self):
        self._balance = 0

    def deposit(self, amount):
        self._balance += amount

    def balance(self):
        return self._balance
\`\`\`

Code should interact through \`deposit\` and \`balance\`, not by touching \`_balance\` directly — that way a future rule (no negative balances) lives in exactly one place.

The concepts here map one-to-one onto real programs like the management systems I built in Python; ${EXTERNAL.pythonDocs} has a fuller [treatment of classes](https://docs.python.org/3/tutorial/classes.html) when you're ready for the edges.

${faqBlock([
  ["What is __init__ in Python?",
   "It's the initializer method that runs automatically when you create an instance, setting up the object's starting attributes."],
  ["Why does every method need self?",
   "`self` refers to the specific instance the method was called on. It's how a method knows which object's data to read or change."],
  ["When should I use inheritance?",
   "When two or more classes genuinely share data and behavior. If you can't name the shared behavior in one sentence, you probably don't need it yet."],
])}

Continue with ${relatedLinks(a, 1)}`;
}

function pythonFileHandling(a: ArticleMeta): string {
  return `# ${a.title}

A console program that can't remember anything between runs is a toy. The moment you can write data to a file and read it back, you can build a Library Management System, a Student record keeper, or anything with "save" in the spec. File handling is that skill.

## Table of contents

- Opening a file, the safe way
- Reading files
- Writing and appending
- The with statement explained
- Handling missing files
- A small persistent program
- Frequently asked questions

## Opening a file, the safe way

Python has \`open()\`. Its first argument is the file path, second is the mode: \`"r"\` read, \`"w"\` write (overwrites), \`"a"\` append (adds at the end).

The recommended pattern wraps it in \`with\`:

\`\`\`python
with open("books.txt", "r") as f:
    contents = f.read()
\`\`\`

## Reading files

Three main approaches:

\`\`\`python
# whole file as one string
text = f.read()

# all lines as a list
lines = f.readlines()

# iterate line by line (best for large files)
for line in f:
    print(line.strip())
\`\`\`

For structured data, loop lines and strip whitespace — \`strip()\` removes the hidden \`\\n\` every line carries.

## Writing and appending

\`"w"\` clears the file and writes fresh; \`"a"\` keeps the old contents and adds to the end.

\`\`\`python
with open("log.txt", "a") as f:
    f.write("issued 202 to Abdul\\n")
\`\`\`

Pick the mode based on intent. A student record update usually means rewriting the whole file from the in-memory list; a log means appending.

## The with statement explained

\`with\` guarantees the file closes even if an exception fires mid-way. Without it, a crash between \`open()\` and \`close()\` leaks a file handle — and on some systems, a file that stays open can't be read properly by anything else. \`with\` removes an entire class of bug with one keyword.

## Handling missing files

If the file doesn't exist, \`open()\` raises \`FileNotFoundError\`. Real programs handle that:

\`\`\`python
try:
    with open("books.txt", "r") as f:
        data = f.read()
except FileNotFoundError:
    data = ""
\`\`\`

First run has no file yet — it should create one, not crash.

## A small persistent program

Here's a minimal notes app that survives restarts:

\`\`\`python
def load():
    try:
        with open("notes.txt", "r") as f:
            return f.read().splitlines()
    except FileNotFoundError:
        return []

def save(note):
    with open("notes.txt", "a") as f:
        f.write(note + "\\n")

notes = load()
notes.append(save and "")  # keep it readable; see below
print("Notes:", len(notes))
\`\`\`

> Small confession: the line \`notes.append(save and "")\` above is deliberately awkward to make a point — never write clever one-liners like that in real code. Call the function, then append the note you meant to store. Readability wins.

The full patterns in ${EXTERNAL.pythonDocs} file section are worth a skim once these basics stick; they cover encodings and binary modes that matter later.

${faqBlock([
  ["What is the difference between w and a mode in Python files?",
   "`\"w\"` overwrites the entire file (creating it if needed); `\"a\"` appends to the end without touching existing contents. Use `\"w\"` for fresh output and `\"a\"` for logs."],
  ["Why use the with statement when opening files?",
   "It guarantees the file is closed even if an error occurs, preventing leaked handles and half-written files."],
  ["How do I append a new line to a file?",
   "Write the content plus an explicit newline character, e.g. `f.write(line + \"\\n\")`."],
])}

Related: ${relatedLinks(a)}`;
}

function pythonDataStructures(a: ArticleMeta): string {
  return `# ${a.title}

Four structures do most of the work in everyday Python: list, tuple, dictionary, and set. The skill isn't knowing they exist — everyone learns that in an afternoon. The skill is instantly reaching for the right one and knowing why.

## Table of contents

- The four, at a glance
- Lists: order matters
- Tuples: fixed and honest
- Dictionaries: look up by key
- Sets: uniqueness and math
- How to choose (a real example)
- Frequently asked questions

## The four, at a glance

| Structure | Syntax | Ordered | Duplicates | Lookup by |
|---|---|---|---|---|
| list | \`[1, 2]\` | yes | yes | position |
| tuple | \`(1, 2)\` | yes | yes | position |
| dict | \`{"a": 1}\` | yes | keys unique | key |
| set | \`{1, 2}\` | no | no | membership |

## Lists: order matters

A list keeps things in the order you added them and lets you change anything.

\`\`\`python
books = ["Clean Code", "Automate the Boring"]
books.append("Python Crash Course")   # add
books[1] = "Automate Again"          # replace
for b in books:                       # iterate in order
    print(b)
\`\`\`

Use a list when "first, second, third" has meaning: menu options, a queue of tasks, a sequence of steps.

## Tuples: fixed and honest

A tuple is an immutable list. Once made, its contents can't change.

\`\`\`python
point = (10, 20)
# point[0] = 5  -> TypeError
\`\`\`

Use a tuple when the group should not change — coordinates, database row IDs, a fixed set of constants — and to signal intent: "these belong together, and nobody should edit them."

## Dictionaries: look up by key

The workhorse. A dict maps keys to values, giving you instant lookup by name rather than by position.

\`\`\`python
members = {
    "BSCS-042": "Haseeb",
    "BSCS-051": "Ayesha",
}
print(members["BSCS-042"])            # Haseeb
members.get("BSCS-999", "unknown")    # safe lookup with default
\`\`\`

In the management systems I built, records were keyed by book ID or roll number in a dict — searching became O(1) lookups instead of loops. \`.get()\` is the habit to build: it returns a default instead of crashing on a missing key.

## Sets: uniqueness and math

A set stores unique values and answers "is this in here?" instantly.

\`\`\`python
courses = {"CS101", "CS102", "CS103"}
courses.add("CS101")          # no duplicate — unchanged
"CS104" in courses            # False
\`\`\`

Sets shine for de-duplication, membership tests, and set operations (union, intersection) when you need "students enrolled in both courses."

## How to choose (a real example)

You're storing books in a library program:

- To keep the shelf order as entered: **list**.
- To find a book by its ID instantly: **dict** keyed by ID.
- To store each book's fixed details (ID, title, author) that never change: **tuple**.
- To track which authors are currently in the collection with no repeats: **set**.

Notice none of them is "the best" — each is best for one job, and real programs use all four together. ${EXTERNAL.pythonDocs} has a [data structures tour](https://docs.python.org/3/tutorial/datastructures.html) worth keeping open.

${faqBlock([
  ["What is the difference between a list and a tuple in Python?",
   "Lists are mutable — you can add, remove, and change items. Tuples are immutable — fixed after creation. Tuples also tend to be slightly faster and can be used as dictionary keys."],
  ["When should I use a dictionary instead of a list?",
   "When you look things up by a name or ID rather than by position. Dictionary lookups by key are constant-time; finding an item in a list means scanning it."],
  ["Can a dictionary have duplicate keys?",
   "No — keys are unique. Assigning the same key again overwrites the previous value."],
])}

Related: ${relatedLinks(a)}`;
}

function pythonErrors(a: ArticleMeta): string {
  return `# ${a.title}

Every program meets input or states the author didn't plan for: a missing file, an empty answer, a number where a name was expected. What happens then is a design decision, not an accident. Error handling is you making that decision on purpose.

## Table of contents

- Two kinds of failure
- try and except
- Getting the exception right
- else and finally
- When not to catch
- Frequently asked questions

## Two kinds of failure

Some errors are bugs (write them better). Some are the outside world (a file deleted, a network dead, a user entering "three" for a number). You fix the first and handle the second. Handling means the program degrades gracefully instead of dumping a traceback.

## try and except

\`\`\`python
try:
    age = int(input("Age: "))
except ValueError:
    print("That's not a number.")
\`\`\`

If \`int()\` fails, control jumps to \`except\` instead of crashing. That's the entire mechanism — and it's enough to keep most console programs alive.

## Getting the exception right

Catch the specific error, not everything:

\`\`\`python
# Good
except ValueError:
    ...

# Avoid unless you mean it
except Exception:
    ...
\`\`\`

A bare \`except\` swallows every problem — including the ones that mean "stop, this program has a bug." Catching broadly hides the signal that tells you where to fix code.

Also capture the exception when it has useful detail:

\`\`\`python
try:
    with open("data.txt", "r") as f:
        text = f.read()
except FileNotFoundError as e:
    print(f"Missing file: {e.filename}")
\`\`\`

## else and finally

\`else\` runs only when no exception happened — clean separation of "risky part" from "then do this." \`finally\` runs regardless, which makes it the natural home for cleanup.

\`\`\`python
try:
    f = open("log.txt", "a")
    f.write("...")
finally:
    f.close()
\`\`\`

In practice the \`with\` statement does this cleanup for you, but \`finally\` is the concept underneath.

## When not to catch

Three anti-patterns worth naming:

1. **Catching and silently passing.** A silent \`except: pass\` turns a crash into a mystery — the program keeps running with wrong data.
2. **Catching to "fix" a bug.** If your own list index is wrong, fix the index, not the try/except.
3. **One giant try around everything.** Wrap the risky line, not the whole program. You want failures to localize.

Error handling is part of what separates the management system I deleted-at-midnight from the ones that survived a demo. ${EXTERNAL.pythonDocs} [exception tutorial](https://docs.python.org/3/tutorial/errors.html) covers the full hierarchy when you want the map.

${faqBlock([
  ["What is the difference between try and except in Python?",
   "`try` marks the block that might raise an exception; `except` defines what to do when a specific exception occurs inside it."],
  ["Is it bad to catch all exceptions?",
   "Usually. A broad `except Exception` also hides real bugs and can leave the program inconsistent. Catch the specific errors you intend to handle."],
  ["What does finally do in Python?",
   "A `finally` block runs whether or not an exception occurred, making it the right place for cleanup like closing files."],
])}

Related: ${relatedLinks(a)}`;
}

function pythonStdlib(a: ArticleMeta): string {
  return `# ${a.title}

Python's real superpower isn't a framework — it's the standard library, hundreds of modules shipped with the language. You already paid for them, in the sense that they're included. The trick is knowing which ones exist before you \`pip install\` a solution to a problem Python already solved.

## Table of contents

- os and pathlib
- json and csv
- datetime
- random
- collections
- itertools
- Frequently asked questions

## os and pathlib

For paths and folders, \`pathlib\` is the modern choice. \`os\` still covers process and environment needs.

\`\`\`python
from pathlib import Path

data = Path("data")
data.mkdir(exist_ok=True)
file = data / "books.txt"
file.write_text("hello")
print(file.read_text())
\`\`\`

The \`/\` operator assembling paths reads far better than string concatenation and handles platform separators for you.

## json and csv

Two formats cover most structured data exchange.

\`\`\`python
import json, csv

data = {"name": "Haseeb", "courses": ["CS101", "CS102"]}
text = json.dumps(data)          # object -> string
again = json.loads(text)         # string -> object

with open("rows.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["id", "title"])
    writer.writerow(["101", "Clean Code"])
\`\`\`

JSON is for nested structures and APIs; CSV is for tabular data and anything a spreadsheet should open.

## datetime

Whatever demo project you build, you'll eventually want "when."

\`\`\`python
from datetime import datetime, timedelta

now = datetime.now()
due = now + timedelta(days=14)
print(due.strftime("%Y-%m-%d"))   # "2026-10-05"
\`\`\`

## random

Beyond games, \`random\` powers small simulations, shuffles, and sample data.

\`\`\`python
import random

random.choice(["python", "java"])
random.sample(range(100), 5)   # five distinct values
items = [1, 2, 3, 4]
random.shuffle(items)
\`\`\`

## collections

\`defaultdict\` and \`Counter\` remove the two most tedious loops.

\`\`\`python
from collections import Counter, defaultdict

word_counts = Counter("mississippi")
print(word_counts)              # {'s': 4, 'i': 4, ...}

groups = defaultdict(list)
groups["python"].append("Haseeb")
\`\`\`

## itertools

For combinations, permutations, and lazy iteration:

\`\`\`python
import itertools

list(itertools.product("AB", "12"))
# [('A','1'), ('A','2'), ('B','1'), ('B','2')]
\`\`\`

None of this is exotic. Each is a tool that replaces three to ten lines of hand-rolled code, which is exactly what a standard library is for. ${EXTERNAL.pythonDocs} has [a full index](https://docs.python.org/3/library/) — skim the table of contents once, so the names ring a bell later.

${faqBlock([
  ["What is the Python standard library?",
   "The collection of modules bundled with every Python installation — covering file paths, data formats, dates, math, networking and more — usable with a plain `import`."],
  ["Do I need pip to use the standard library?",
   "No. Standard library modules ship with Python itself, so no installation is required."],
  ["What is the difference between os and pathlib?",
   "Both work with paths, but `pathlib` offers a modern, object-oriented API (and the convenient `/` path joining) that most new code prefers."],
])}

Related: ${relatedLinks(a)}`;
}

function pythonVenv(a: ArticleMeta): string {
  return `# ${a.title}

The first time two projects need different versions of the same package, you meet the problem: installing something globally changes it for every project at once. Virtual environments keep each project's environment in its own folder, so they stop fighting.

## Table of contents

- The actual problem
- Creating a venv
- Activating it
- Installing inside it
- Why not install globally
- Frequently asked questions

## The actual problem

Python installs packages into one shared place by default. Project A needs \`requests==2.28\`; Project B needs \`requests==2.32\`. With a shared environment, installing for one breaks the other. A virtual environment is a separate folder holding its own copy of packages and its own \`python\`. You get isolation without thinking about paths.

## Creating a venv

From your project folder:

\`\`\`bash
python -m venv .venv
\`\`\`

This creates a hidden \`.venv\` directory containing its own Python interpreter and package area. It takes seconds.

## Activating it

\`\`\`bash
# macOS / Linux
source .venv/bin/activate

# Windows
.venv\\Scripts\\activate
\`\`\`

Your prompt changes (usually showing \`(.venv)\`). From now on, \`python\` and \`pip\` in this terminal operate inside the environment.

## Installing inside it

\`\`\`bash
pip install requests
pip freeze > requirements.txt
\`\`\`

\`freeze\` writes every installed package and its exact version to \`requirements.txt\` — the file that lets someone else (or future you) rebuild the same environment with \`pip install -r requirements.txt\`.

## Why not install globally

Global installs work until they don't: version clashes, permission errors on shared machines, and a project that "worked on my machine" but not elsewhere. A venv costs one command and returns a clean, reproducible project. There's very little downside and a lot of downside avoided. The environment you create is never committed to Git — add \`.venv/\` to \`.gitignore\`, and let \`requirements.txt\` be the source of truth.

Reference when you need the fine print: the [venv module docs](https://docs.python.org/3/library/venv.html).

${faqBlock([
  ["Why do I need a virtual environment in Python?",
   "It isolates each project's installed packages and Python tools, preventing version conflicts between projects and keeping your system install clean."],
  ["Where should I create my virtual environment?",
   "Inside the project folder, conventionally named `.venv` (or `venv`), and excluded from version control via `.gitignore`."],
  ["Do I activate a venv every time?",
   "Yes, in each new terminal session you use for that project — activation points that shell at the environment."],
])}

Related: ${relatedLinks(a)}`;
}

function pythonVsJava(a: ArticleMeta): string {
  return `# ${a.title}

It's the question every student asks, and the honest answer has two parts: they're more alike than the memes suggest, and the "right" choice depends entirely on what you want to build next. I've written real code in both — Python for console programs and data work, Java for an Android app — so let me compare them as tools rather than as sports teams.

## Table of contents

- The short version
- How they execute
- Syntax: verbosity vs brevity
- Where each one shines
- Where each one annoys
- Which should you learn first
- Frequently asked questions

## The short version

Python optimizes for write-and-read speed — less ceremony, more in fewer lines. Java optimizes for a different kind of robustness — it forces type declarations and structure that catch mistakes early and scale to large team codebases. Neither is "better"; they're better at different moments.

## How they execute

Python is interpreted: your code runs line by line, and many errors surface only when that line executes. Java is compiled to bytecode before it runs, so whole categories of mistakes — calling a method that doesn't exist, mismatching types — are caught at compile time.

That single difference explains most of the culture clash. Python feels fast to prototype and occasionally surprises you at runtime. Java feels slow to type and rarely surprises you at all.

## Syntax: verbosity vs brevity

Same loop, both languages:

\`\`\`java
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
\`\`\`

\`\`\`python
for i in range(10):
    print(i)
\`\`\`

Java's version declares types and uses braces; Python's relies on indentation. Neither is wrong — Java's explicitness is a feature at scale, Python's concision is a feature for a single person moving fast.

## Where each one shines

- **Python**: data work, automation, scripting, machine-learning prototyping, backends, and being kind to a beginner.
- **Java**: Android apps, large enterprise systems, performance-sensitive services, and anything a big team will maintain for a decade.

My own trail reflects exactly this: Python for management systems and the AI/ML direction, Java for SneakerStore on Android.

## Where each one annoys

Python annoys with runtime type surprises and slower raw execution. Java annoys with boilerplate —\`public static void main\` before you've printed anything — and a longer path from idea to working program.

## Which should you learn first

If your goal is data, AI/ML, or quick projects: **Python**. If your goal is Android development or enterprise-style engineering: **Java**. If you're a CS student, you'll probably meet both anyway — let your projects pick the language, not the other way around.

The language reference for each is the authority when a claim matters: ${EXTERNAL.pythonDocs} and [the Java documentation](https://docs.oracle.com/en/java/).

${faqBlock([
  ["Is Python easier than Java?",
   "For most beginners, yes — Python's syntax is less verbose and runs without a compile step, so the loop from idea to working program is shorter. Java pays that cost back in catching errors early."],
  ["Which is faster, Python or Java?",
   "Java is generally faster for computation because it compiles to optimized bytecode; Python often 'feels' faster to develop. For a student, development speed usually matters more than execution speed."],
  ["Should I learn Python or Java first?",
   "Match it to your goal: Python first if you're headed toward data, AI/ML, or quick projects; Java first if Android or enterprise development is your target."],
])}

Related: ${relatedLinks(a)}`;
}

function pythonComprehensions(a: ArticleMeta): string {
  return `# ${a.title}

List comprehensions look like syntax magic until you see the pattern once — then they become the idiomatic way Python is actually written. The core idea: build a new list by describing it, instead of by appending to it.

## Table of contents

- The pattern
- With a filter
- On other structures
- When the loop is still better
- Frequently asked questions

## The pattern

The comprehension is a \`for\` loop collapsed into an expression. Compare:

\`\`\`python
# loop
squares = []
for n in range(6):
    squares.append(n * n)

# comprehension
squares = [n * n for n in range(6)]
\`\`\`

Same result \`[0, 1, 4, 9, 16, 25]\`, fewer moving parts to get wrong.

## With a filter

Add \`if\` at the end to keep only some values:

\`\`\`python
evens = [n for n in range(12) if n % 2 == 0]
# [0, 2, 4, 6, 8, 10]
\`\`\`

That replaces a four-line loop-with-if. Read it right-to-left: "for n in range(12), if n is even, give me n."

## On other structures

The same idea extends to dicts, sets, and generators:

\`\`\`python
squares_map = {n: n * n for n in range(4)}   # {0: 0, 1: 1, 2: 4, 3: 9}
uniques = {x for x in "mississippi"}          # {'m','i','s','p'}
total = sum(n * n for n in range(100))        # generator expression
\`\`\`

The generator version (parentheses) produces values lazily — it never builds the whole list in memory, which matters when \`range(100)\` is \`range(100_000_000)\`.

## When the loop is still better

A comprehension earns its keep when the logic is a single expression. The moment the body needs multiple statements, nested conditions, or side effects, write a normal loop. Forcing three nested \`for...if\` clauses into one line is how comprehensions get their "unreadable" reputation — the tool is fine, the dosage was wrong.

Readable beats clever, every time. ${EXTERNAL.pythonDocs} covers the [full syntax](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions) with more exotic cases if you need them.

${faqBlock([
  ["What is a list comprehension in Python?",
   "A concise syntax for building a new list from an existing iterable, optionally with a filter — for example `[x*2 for x in nums if x > 0]`."],
  ["Are list comprehensions faster than for loops?",
   "Often slightly faster because the loop is implemented in optimized C, but the bigger win in practice is readability for simple transformations."],
  ["When should I avoid a list comprehension?",
   "When the logic has multiple steps, nested conditions, or side effects — then a regular for loop is clearer."],
])}

Related: ${relatedLinks(a)}`;
}

function pythonDicts(a: ArticleMeta): string {
  return `# ${a.title}

If lists are a line of things, dictionaries are a labeled box of them. That one difference — look up by key instead of by position — makes dicts the single most used structure in practical Python. This is an honest tour of daily use, the methods included.

## Table of contents

- The mental model
- Getting and setting safely
- Iterating
- Nested dictionaries
- When a dict beats a list
- Frequently asked questions

## The mental model

A dictionary maps keys to values. Keys must be unique and hashable (strings, numbers, tuples); values can be anything.

\`\`\`python
book = {"id": "101", "title": "Clean Code", "available": True}
book["author"] = "Robert C. Martin"   # setting
print(book["title"])                   # getting
\`\`\`

## Getting and setting safely

Direct access crashes on a missing key. The \`.get()\` method is the standard way to look things up when absence is normal:

\`\`\`python
book.get("publisher")       # None
book.get("publisher", "n/a")  # "n/a"
\`\`\`

To default a key without overwriting an existing value, \`setdefault\` does two jobs:

\`\`\`python
counts = {}
counts.setdefault("python", 0)   # sets 0 only if absent
counts["python"] += 1
\`\`\`

## Iterating

Three loops cover 95% of daily use:

\`\`\`python
for key in book:               # keys
    print(key)

for value in book.values():    # values
    print(value)

for key, value in book.items():  # both at once
    print(key, value)
\`\`\`

## Nested dictionaries

Structurally modern data is usually a dict whose values are dicts or lists:

\`\`\`python
library = {
    "101": {"title": "Clean Code", "status": "available"},
    "202": {"title": "Automate the Boring", "status": "issued"},
}
library["202"]["status"] = "available"
\`\`\`

This pattern — ID on the outside, record on the inside — is exactly how you'd model the book records in a Library Management System. ${EXTERNAL.pythonDocs} has the [mapping types reference](https://docs.python.org/3/library/stdtypes.html#mapping-types-dict) for the complete method list.

## When a dict beats a list

Reaching for a dict over a list is worth it when you search by identity, not position: "find the record for BSCS-042" is a dict lookup (constant time) rather than a list scan (linear). Once you feel that difference on a thousand records, you never unfeel it.

${faqBlock([
  ["What is a dictionary in Python?",
   "A mutable, ordered collection that maps unique keys to values, enabling fast lookups by key rather than by position."],
  ["How do I get a value from a dictionary without crashing?",
   "Use `.get(key, default)` — it returns the default (or `None`) when the key is missing, instead of raising `KeyError`."],
  ["Are Python dictionaries ordered?",
   "Yes, since Python 3.7 they preserve insertion order, though their real identity is key-based lookup."],
])}

Related: ${relatedLinks(a)}`;
}

/* ================================================================== */
/* Project templates                                                   */
/* ================================================================== */

function libraryProject(a: ArticleMeta): string {
  return `# ${a.title}

Most people's first "real" Python project is a calculator. Mine was a library. Four menu options — view books, search, issue, return — and a file that remembered everything between runs. It sounds trivial now; it was the first time code I wrote felt like a program instead of a homework answer.

This is the walkthrough, minus the thousand lines of repetition.

## Table of contents

- What the program actually does
- The menu loop
- Modeling a book record
- File handling as persistence
- What I'd do better now
- Frequently asked questions

## What the program actually does

The system manages book records in the terminal:

1. **View books** — list all records with ID, title, author, and status.
2. **Search** — find a book by ID or title.
3. **Issue** — mark a book as issued to a member.
4. **Return** — mark it available again.

Nothing more, and that's the point — a small, honest scope that still exercises every skill worth learning.

## The menu loop

The skeleton every console app shares: show options, read a choice, dispatch, repeat.

\`\`\`python
def main():
    books = load_books()
    while True:
        print("1. View Books  2. Search  3. Issue  4. Exit")
        choice = input("Choice: ")
        if choice == "1":
            view_books(books)
        elif choice == "2":
            search(books)
        elif choice == "3":
            issue(books)
        elif choice == "4":
            break
        else:
            print("Try 1–4.")
\`\`\`

Once that loop exists, adding a feature is just adding a branch and a function — the structure stops being the hard part.

## Modeling a book record

A list of dictionaries is the natural fit, or a small class if you want practice with OOP:

\`\`\`python
book = {
    "id": "101",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "status": "available",
}
books.append(book)
\`\`\`

Finding a book by ID is a dict-style lookup over the list:

\`\`\`python
def find(books, book_id):
    for b in books:
        if b["id"] == book_id:
            return b
    return None
\`\`\`

## File handling as persistence

The feature that made it feel real: records survive the process. Writing on change, reading on start:

\`\`\`python
import json

def save_books(books):
    with open("books.json", "w") as f:
        json.dump(books, f, indent=2)

def load_books():
    try:
        with open("books.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []
\`\`\`

JSON keeps the nested record structure intact; CSV would be simpler but loses the "record has fields" shape.

## What I'd do better now

Looking back: I'd split the file handling and the menu logic into separate modules, validate input before using it, and write a README on day one. None of those were obvious mid-project — which is exactly why building it taught more than reading about it would have.

> Heads-up: what's described here is the architecture of my own student project in general terms — it's a teaching walkthrough, not a claim about production software.

Related reading:\n\n${relatedLinks(a)}\n`;
}

function studentProject(a: ArticleMeta): string {
  return `# ${a.title}

Every data-entry program — a hospital's records, a shop's inventory, a university's roster — is the same shape underneath: add records, save them, search them, display them. A Student Management System is that shape in its most learnable form.

## Table of contents

- The CRUD core
- Adding a student
- Saving to file
- Searching
- Displaying
- The pattern that generalizes
- Frequently asked questions

## The CRUD core

CRUD — create, read, update, delete — is the skeleton of virtually every business application ever written. Extremely worth internalizing, because you meet it forever. Here, "create" is adding a student, "read" is search/display, and update/delete are the natural next steps.

## Adding a student

\`\`\`python
def add_student(students):
    student = {
        "name": input("Name: "),
        "roll_no": input("Roll no: "),
        "program": input("Program: "),
        "cgpa": float(input("CGPA: ")),
    }
    save_record(student)
    print("✓ Record saved")
\`\`\`

A subtle point worth naming: validate before saving. A CGPA of "banana" should be rejected at the prompt, not stored and discovered later.

\`\`\`python
def get_cgpa():
    while True:
        try:
            value = float(input("CGPA: "))
            if 0 <= value <= 4:
                return value
            print("CGPA is 0–4.")
        except ValueError:
            print("Numbers only, please.")
\`\`\`

## Saving to file

The same persistence pattern as every other console app — CSV fits tabular records well:

\`\`\`python
import csv

def save_record(student):
    with open("students.csv", "a", newline="") as f:
        w = csv.writer(f)
        w.writerow([student["name"], student["roll_no"], student["program"], student["cgpa"]])
\`\`\`

Append mode means records stack up across runs instead of overwriting each other.

## Searching

The CSV is the source of truth, so search reads it back and matches:

\`\`\`python
def search(roll_no):
    with open("students.csv", "r") as f:
        for row in csv.reader(f):
            if row[1] == roll_no:
                print("Name:", row[0], "| Program:", row[2], "| CGPA:", row[3])
                return
    print("No student with that roll number.")
\`\`\`

## Displaying

Reading all rows and printing them with aligned columns is the payoff feature — the moment the program feels like a tool rather than a script.

## The pattern that generalizes

Swap "student" for "book," "patient," or "product," and the skeleton is identical: a record shape, a file for persistence, a menu, and search. Learn it once here and every future CRUD app is mostly vocabulary, not mystery.

If you're after the deeper patterns, ${relatedLinks(a, 1)} covers how I structured the Library Management System with the same skeleton.

${faqBlock([
  ["What is CRUD in programming?",
   "Create, Read, Update, Delete — the four fundamental operations most data-driven applications implement over their records."],
  ["Should I use CSV or JSON for a student management system?",
   "CSV is simpler for flat, tabular records and opens in spreadsheets; JSON is better when records are nested or need richer structure. For this project both work — CSV keeps it approachable."],
  ["How do I keep records after the program exits?",
   "Persist them to a file (CSV, JSON, or a database) on save, and load them back when the program starts."],
])}

Related: ${relatedLinks(a)}`;
}

function bankProject(a: ArticleMeta): string {
  return `# ${a.title}

A banking program is the classic way to practice two ideas at once: object state and transaction logic. The money is fictional, but the disciplines — accounts that change only through defined operations, balances that never go negative, a trail of what happened — are real.

## Table of contents

- The account as an object
- Create account
- Deposit and withdraw
- Check balance
- Why the state rules matter
- Frequently asked questions

## The account as an object

An account naturally maps to a class: it has a holder, a number, and a balance, and the balance changes only through methods.

\`\`\`python
class Account:
    def __init__(self, holder, number):
        self.holder = holder
        self.number = number
        self._balance = 0
\`\`\`

## Create account

Creating an account is just instantiating the class and storing it:

\`\`\`python
accounts = {}

def create_account(holder, number):
    accounts[number] = Account(holder, number)
    print("✓ Account created")
\`\`\`

A dict keyed by account number gives instant lookup — the same structure that powers the search features in the other management systems.

## Deposit and withdraw

The core lesson: money moves only through methods that enforce the rules.

\`\`\`python
def deposit(self, amount):
    if amount <= 0:
        raise ValueError("Deposit must be positive")
    self._balance += amount

def withdraw(self, amount):
    if amount <= 0:
        raise ValueError("Withdrawal must be positive")
    if amount > self._balance:
        raise ValueError("Insufficient balance")
    self._balance -= amount
\`\`\`

## Check balance

\`\`\`python
def balance(self):
    return self._balance
\`\`\`

The underscore isn't fussiness — it says "interact through deposit/withdraw/balance, not by poking the variable." Today that defends the balance from a typo; tomorrow it defends a real system from a logic hole.

## Why the state rules matter

Three concrete rules emerged from building this:

1. **Never let a balance go negative** through normal operations — enforce it in the method, not by hoping.
2. **Validate every input** at the boundary: deposits and withdrawals must be positive numbers.
3. **Keep one source of truth.** The account object holds the balance; everything else asks it.

There's no real money anywhere in this demo, which is exactly what makes it a safe place to get the *behavior* right. When real financial data is on the line the stakes are higher, but the habits are the same.

> Clear statement for the record: all data in this project is fictional demonstration data — no real accounts, balances, or customers.

${faqBlock([
  ["What does a bank management system project teach you?",
   "Primarily object-oriented state management and transaction logic: accounts whose data changes only through defined, validating methods."],
  ["Should I use a database for a bank management console app?",
   "For learning, file persistence (JSON or SQLite) is enough; a real bank would need far more than a student project — so keep the scope honest."],
  ["Why prevent a negative balance in the code?",
   "Because relying on users to avoid it fails. Enforcing the rule in the withdraw method keeps the account state valid no matter who calls it."],
])}

Related: ${relatedLinks(a)}`;
}

function sneakerstoreProject(a: ArticleMeta): string {
  return `# ${a.title}

SneakerStore is the biggest thing I've built so far — an Android shoe-shopping app with real authentication, product browsing, a working cart, and address management. It's also the project that taught me the difference between "code that runs" and "code that holds up when features stack."

This is the case study: the architecture, the hard parts, and what I'd tell someone starting the same build tomorrow.

## Table of contents

- The scope, stated plainly
- The tech stack and why
- Authentication with Firebase
- Product browsing and the cart
- Address management
- What actually got hard
- Frequently asked questions

## The scope, stated plainly

Five features, no more:

- **User authentication** — sign in/register with email and password.
- **Product browsing** — a list of fictional sneakers with details.
- **Shopping cart** — add items, see totals.
- **Address management** — save and select delivery addresses.
- **Material Design UI** — clean, consistent, built with Android's design system.

It's a portfolio demonstration, not a live store — no real payment, no real orders.

## The tech stack and why

| Layer | Choice | Because |
|---|---|---|
| Language | Java | Classic Android pairing, verbose but explicit |
| UI | XML layouts | Native layout system |
| Auth | Firebase Authentication | Managed email/password + sessions |
| Local data | SQLite | On-device persistence |
| Remote data | Cloud Firestore | Synced catalog and user data |
| Tools | Android Studio | The official IDE |

## Authentication with Firebase

Email/password auth via Firebase handles the part you never want to build from scratch — password storage done safely. The app calls the SDK, gets a user object back, and lets either the built-in UI or a custom login screen drive it. ${EXTERNAL.firebaseAuth} is the reference I kept open constantly.

## Product browsing and the cart

The cart is the feature that earns its difficulty. A cart is a list of *line items* — a product reference plus a quantity — not a list of products. Getting that data model right (and updating totals in one place) is what separates a demo that glitches from one that holds together.

\`\`\`java
class CartItem {
    String productId;
    int quantity;
    long price;
}
\`\`\`

## Address management

Addresses are another resource the user owns: a list of saved addresses, one marked default, editable at checkout. In practice this means a screen, a small local model, and persistence — locally in SQLite, or in Firestore if the addresses should follow the account across devices. ${EXTERNAL.firestore} explains the cloud side.

## What actually got hard

Not the auth. Not the layouts. The hard part was **state** — making sure the cart total, the badge count, and the checkout screen always agreed, in every order the user could visit them. The fix wasn't a library; it was slowing down and giving each screen one clear source of truth. That lesson transfers to every future project, which is the whole reason the app was worth building.

> Scope note: the products, prices, and accounts shown are fictional demo data created for this portfolio.

${faqBlock([
  ["Why did you choose Firebase for SneakerStore?",
   "Firebase Authentication and Cloud Firestore provide managed auth and a synced database, so a student can focus on app logic instead of building a backend from scratch."],
  ["Is SneakerStore a real store?",
   "No — it's a portfolio demonstration with fictional products and no real payments or orders."],
  ["What is the hardest part of building an Android e-commerce app?",
   "Keeping shared state consistent — cart totals, badges, and checkout all reflecting one source of truth — rather than any single feature."],
])}

Related: ${relatedLinks(a)}`;
}

function pythonProjectsIdeas(a: ArticleMeta): string {
  return `# ${a.title}

The graduate-level mistake of beginner projects is choosing something too big on day one. The cure is a ladder: each rung forces exactly one or two new skills, and each one *ends* — finished, committed, moveable from. Here's the ladder I'd hand a student today, ordered roughly by difficulty.

## Table of contents

- How to use this list
- Rungs 1–5: the basics
- Rungs 6–10: real structure
- Rungs 11–14: the stretch zone
- The rules that make any project count
- Frequently asked questions

## How to use this list

Don't do all fourteen. Pick the first one you can't already build confidently, finish it, then take the next. Finish means: works, has a README, is committed to Git, and you can explain every line.

## Rungs 1–5: the basics

1. **Number guessing game** — loops, conditions, input.
2. **Unit converter** (kg↔lb, km↔mi) — functions and math.
3. **Password generator** — random, strings, length options.
4. **To-do list (in memory)** — lists, add/remove/mark done.
5. **Hangman** — strings, sets, and a whole lot of ifs.

## Rungs 6–10: real structure

6. **Quiz game** — data in dictionaries, scoring.
7. **Expense tracker** — arithmetic plus *persistence*: save to CSV.
8. **Contact book** — the CRUD pattern, filed to disk.
9. **Weather CLI** — your first API call and JSON parsing.
10. **URL shortener (local)** — hashing, dict lookups, file store.

## Rungs 11–14: the stretch zone

11. **Library management system** — menus, records, issue/return, file persistence.
12. **Student management system** — CRUD with search, at real scale.
13. **Personal budget with categories** — nested data + summaries.
14. **A small data analysis** — read a real CSV (your own screen-time data, say) and chart it with a library.

The two management systems in the middle are where the console app becomes a *program* — I wrote full walkthroughs for both in the Projects section.

## The rules that make any project count

- **One new idea per project.** Two max. Everything else should already be comfortable. Frustration stays low, learning stays legible.
- **Build to a spec you wrote down first.** Even three bullets. "Make a to-do" is a mood; "add, list, and complete tasks, saved to file" is a spec.
- **Commit small and often.** A commit after each working feature is a habit that pays for itself forever.

Reference as needed: ${EXTERNAL.pythonDocs} for language, and ${EXTERNAL.gitDocs} once you start committing.

${faqBlock([
  ["What is a good first Python project?",
   "Something small and finishable in one sitting — a number guessing game, a unit converter, or a password generator — so you experience the full build-commit-finish loop early."],
  ["How many projects should a beginner build?",
   "More important than a count is finishing them. A handful of *finished* projects that each teach one new idea beats dozens of abandoned half-builds."],
  ["When should I start project ideas from lists like this?",
   "As soon as you can write loops, conditions, and functions. Building is what turns syntax knowledge into programming ability."],
])}

Related: ${relatedLinks(a)}`;
}

function consoleDesign(a: ArticleMeta): string {
  return `# ${a.title}

There's a moment in every beginner's life when a single Python file hits 400 lines and turns hostile. You stop being able to find things, changes break unrelated features, and the instinct is to start over. The fix isn't patience — it's structure.

## Table of contents

- Script vs program
- The menu loop as a spine
- Splitting by responsibility
- State at the top level
- A layout that scales
- Frequently asked questions

## Script vs program

A script runs top to bottom and finishes. A program *loops* — it starts, waits for input, responds, and keeps going until the user quits. Structuring a program means designing that loop and everything around it on purpose.

## The menu loop as a spine

The loop is the spine of a console app:

\`\`\`python
def main():
    records = load_records()
    while True:
        choice = show_menu()
        if choice == "1":
            do_view(records)
        elif choice == "2":
            do_add(records)
        elif choice == "q":
            break
        save_records(records)
\`\`\`

Each option is a function. When you add a feature, you add a function and a branch — the loop itself never needs to be redesigned.

## Splitting by responsibility

The single most useful move: separate *what the program does* from *how it talks to the user* from *how it stores data*.

\`\`\`
myapp/
├── main.py          # the menu loop, and nothing else
├── operations.py    # add/search/issue — the actual logic
└── storage.py       # load/save — file handling only
\`\`\`

Storage knows about files, operations knows about rules, main knows about the menu. A change to how records save touches exactly one file — that's the benefit, felt every single time you edit.

## State at the top level

Load once into a list, work on the list, save when things change. Resist the urge to read the file on every search, or write it on every keystroke — one clear in, one clear out, and a single in-memory copy in between.

## A layout that scales

The layout above scales about as far as a console app needs to go. Past that — a GUI, a web app, a database — the *habits* survive even when the shape changes: one idea per function, one responsibility per module, one source of truth for state. That's the real deliverable.

${faqBlock([
  ["How do I stop my Python program from becoming one giant file?",
   "Split it by responsibility: a main menu module, an operations module for logic, and a storage module for file handling — each imported by the others."],
  ["What is the menu loop in a console application?",
   "The central while-loop that shows options, reads a choice, dispatches to the matching function, and repeats until the user exits."],
  ["Should I rewrite my project now that it's messy?",
   "Refactor incrementally instead — pull out one responsibility at a time and re-test. Full rewrites usually reintroduce old bugs plus new ones."],
])}

Related: ${relatedLinks(a)}`;
}

function pythonStructure(a: ArticleMeta): string {
  return `# ${a.title}

The project that starts as one \`main.py\` and stays that way is the project you'll abandon. Structure isn't ceremony — it's the difference between a codebase you can reopen in a month and one you'd rather delete. Best of all: a good starting layout is a dozen lines of folders and one clear rule.

## Table of contents

- The layout that covers 90% of projects
- Each folder's job
- Modules vs packages
- config and data, separate from code
- The README rule
- Frequently asked questions

## The layout that covers 90% of projects

\`\`\`
project/
├── app/            # your code
│   ├── __init__.py
│   ├── main.py     # entry point
│   ├── models.py   # data classes
│   └── services.py # logic
├── data/           # runtime files, gitignored
├── tests/          # tests
├── requirements.txt
├── .gitignore
└── README.md
\`\`\`

Not every project needs all of it, but starting here costs nothing and prevents a re-shuffle later.

## Each folder's job

- **app/** — the code. If it has multiple files, each file gets one job.
- **data/** — files the program reads and writes at runtime. Gitignored, because generated data isn't source code.
- **tests/** — anything that verifies your logic.
- **requirements.txt** — the exact list of packages the project needs.

## Modules vs packages

A module is one \`.py\` file. A package is a folder with an \`__init__.py\`, containing modules. When one file stops being one idea, split it into a package. That's all the ceremony Python asks for.

\`\`\`python
# importing inside the project
from app.models import Book
from app.services import issue_book
\`\`\`

## config and data, separate from code

Hard-coded paths buried in logic are the classic "works on my machine" bug. Keep configuration — file paths, names, options — in one obvious place at the top, and keep runtime data out of the source tree entirely.

## The README rule

Write the README on day one, not day forty. Even three bullet points: what it does, how to run it, and what it depends on. Future-you and every other reader get a huge discount on understanding. It's the difference between a project that looks maintained and one that looks abandoned.

${faqBlock([
  ["How should I structure a small Python project?",
   "Start with a package for code, separate folders for data and tests, and a requirements.txt — one responsibility per module, one source of truth for state."],
  ["What is the difference between a Python module and a package?",
   "A module is a single .py file; a package is a directory containing modules and an __init__.py file."],
  ["Should data files be committed to Git?",
   "Generated runtime data should be gitignored; commit only the code and a sample or schema of the data it expects."],
])}

Related: ${relatedLinks(a)}`;
}

function readmeGuide(a: ArticleMeta): string {
  return `# ${a.title}

A README is the front door of your project, and most people decide whether to walk in during the first ten seconds. Recruiters, collaborators, and future-you all read it the same way: what is this, why does it exist, how do I run it. Here's the structure that answers those questions in order.

## Table of contents

- The ten-second rule
- The structure that works
- Writing the description
- Screenshots and demos
- The badges question
- Frequently asked questions

## The ten-second rule

The top of a README must answer three things in one glance: the project's name, what it does in one line, and how to run it. Everything after that is for people already interested. If the first screen requires scrolling to understand, it's already lost.

## The structure that works

\`\`\`markdown
# Project Name

One line that says what it does and who it's for.

## What it does
Short paragraph. Bullets if there are features.

## Running it
prerequisites -> setup -> run commands.

## Project structure
A small tree or a sentence.

## What I learned
Optional, but memorable on a portfolio.

## Built with
A short list of technologies.
\`\`\`

## Writing the description

Resist the urge to narrate your effort ("I worked really hard on..."). Say what it does and what problem it solves. Specific beats enthusiastic: "manages book records with issue/return and CSV persistence" beats "a powerful management solution."

## Screenshots and demos

One meaningful screenshot or a fifteen-second demo outperforms three paragraphs. For console apps, a terminal recording or a clear screenshot of the output in action works. For the web projects, a mobile and desktop pair. ${EXTERNAL.githubDocs} explains [how to add images](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images) to a README.

## The badges question

Badges look great and mean nothing if they're lying. A "build passing" badge for a project with no CI is decoration. Skip badges until they reflect something true — your honesty is part of the portfolio.

${faqBlock([
  ["What should a README contain?",
   "At minimum: the project name, a one-line description, how to run it, and the tech stack. Great ones add screenshots, structure, and what was learned."],
  ["How long should a README be?",
   "Long enough to answer the reader's questions, short enough to keep them moving — a solid README is usually scrollable in under a minute."],
  ["Should I add badges to my README?",
   "Only badges that reflect something real, like an actual CI status. Decorative badges with nothing behind them hurt credibility."],
])}

Related: ${relatedLinks(a)}`;
}

/* ================================================================== */
/* AI/ML templates                                                     */
/* ================================================================== */

function whatIsAi(a: ArticleMeta): string {
  return `# ${a.title}

Artificial intelligence is the most overused and least understood term in software right now. That matters, because a BSCS student hearing "AI" in every hallway deserves a working definition that holds up — not the marketing one.

## Table of contents

- A definition that works
- What AI systems actually are
- What AI is not (yet)
- The gap between fiction and systems
- How to think about it as a developer
- Frequently asked questions

## A definition that works

The practical definition most engineers use: an AI system is software that **performs a task that normally requires human intelligence**, by following processes that let it adjust to information rather than following fixed rules. That's it. It's software, it targets a human-style task, and it adapts.

Notice what that definition leaves out: consciousness, feelings, intentions. None of those are required — and none are currently present.

## What AI systems actually are

Underneath the word, modern "AI" is almost always one of a few concrete things:

- **Machine learning** — models that find patterns in data (this is most of what people mean).
- **Rule-based and search systems** — old-school AI that reasons over explicit knowledge.
- **Deep learning** — a subfamily of ML using many-layered neural networks.

A spam filter, a chess engine, and a code autocomplete are all "AI" by the definition above, and they work in wildly different ways.

## What AI is not (yet)

No shipped system has general intelligence — the ability to reason across anything a human can — regardless of what a demo video suggests. The systems are narrow: extremely capable inside their trained domain, useless outside it. That's not pessimism; it's the current state of the field, stated plainly.

## The gap between fiction and systems

Movies sell AI as a mind in a box. Reality is closer to statistics with a good interface: a model saw a huge number of examples and learned to produce an output that resembles them. The impressive results are real. The "mind" is not.

## How to think about it as a developer

Approach AI as a set of *techniques* you can learn in order, not a single mountain: start with Python, add data handling, then the mathematics, then a first model. The honest framing matters because it lets you learn without the hype — and build things that actually work. ${EXTERNAL.pythonDocs} is the foundation, and this site's learning path unpacks the route.

${faqBlock([
  ["What is artificial intelligence in simple terms?",
   "Software that performs a task normally requiring human intelligence by adapting to information — such as learning patterns from data — rather than following only fixed rules."],
  ["Is AI the same as machine learning?",
   "No — machine learning is a subset of AI, and deep learning is a subset of ML. Most modern 'AI' you hear about is machine learning."],
  ["Is AI conscious or self-aware?",
   "No. Current systems are narrow pattern matchers with no consciousness, intentions, or general understanding despite their convincing outputs."],
])}

Related: ${relatedLinks(a)}`;
}

function mlBasics(a: ArticleMeta): string {
  return `# ${a.title}

"Machine learning" sounds like a machine that studies. Which, in a limited sense, it is — except "studying" means one very specific thing: looking at examples, forming a guess, checking how wrong the guess was, and adjusting. Repeat millions of times. That loop is the whole field's core idea, and you can understand it without a single formula.

## Table of contents

- The loop that is all of ML
- Features and labels
- Training vs using a model
- Why data is everything
- A mental model to keep
- Frequently asked questions

## The loop that is all of ML

1. The model makes a **prediction**.
2. We compare it to the **correct answer**.
3. The **error** (how wrong it was) is computed.
4. The model's internal dials are **adjusted** slightly, in the direction of less error.
5. Repeat.

That's training. Nothing mystical — a guess, a score, a nudge, shuffle the data, again.

## Features and labels

The vocabulary is where people get lost, but it's plain: **features** are the inputs you give the model (bedrooms, square footage), and the **label** is the thing you want it to predict (price). A supervised model learns the mapping from features to label by seeing thousands of pairs with the answer filled in.

## Training vs using a model

Training is the loop above, run over data. Using the trained model is a different act entirely: you hand it new inputs, and it outputs a prediction with no further learning. That split — train once, then predict cheaply — is why a model that takes days to train can answer in milliseconds.

## Why data is everything

The model can only learn what the data contains. Feed it biased hiring data and it learns the bias. Feed it one kind of example and it stays useless on others. The phrase "garbage in, garbage out" is a cliché because the field keeps proving it. This is why real ML work spends most of its time on data, not on clever algorithms.

## A mental model to keep

Think of a model as a **function with knobs**. Training turns the knobs until the function fits the data well. The function itself starts simple — a line through points — and that's exactly where the next step (linear regression) begins. The official references when you go deeper: ${EXTERNAL.scikit} and ${EXTERNAL.pythonDocs}.

${faqBlock([
  ["What is machine learning in simple words?",
   "Teaching a program to make predictions by showing it examples and repeatedly adjusting it based on how wrong its guesses were."],
  ["What are features and labels in machine learning?",
   "Features are the input values a model sees (e.g. square footage); labels are the answers it learns to predict (e.g. price)."],
  ["Does a model keep learning after training?",
   "Not typically — you train once on data, then run the trained model on new inputs to produce predictions."],
])}

Related: ${relatedLinks(a)}`;
}

function supervisedUnsupervised(a: ArticleMeta): string {
  return `# ${a.title}

Every map of machine learning starts with one fork in the road: does your data have the answers attached, or not? That single question divides the field into two enormous families — and it's far easier to understand than the jargon suggests.

## Table of contents

- The fork: labeled or not
- Supervised learning
- Unsupervised learning
- The in-betweeners
- How to tell which you need
- Frequently asked questions

## The fork: labeled or not

If each example comes with its correct answer attached, it's **supervised**. If you have data but no answers — just records to make sense of — it's **unsupervised**. That's the whole distinction, and it decides which algorithms are even available to you.

Consider email: a supervised setup labels each message "spam" or "not spam" and learns from the labels. An unsupervised setup gets a pile of unlabeled messages and groups them by similarity, letting a human name the groups afterward.

## Supervised learning

Supervised learning predicts a target from labeled examples. It splits again by the kind of target:

- **Classification** — the answer is a category ("spam" vs "not spam", "cat" vs "dog").
- **Regression** — the answer is a number (house price, temperature).

Most beginner ML, and most business ML, is supervised. You'll meet classification first, then regression — the two share nearly all their machinery.

## Unsupervised learning

Unsupervised learning finds structure in unlabeled data. The most common task is **clustering** — grouping similar items so patterns emerge. It's used for segmenting customers, finding similar documents, and exploring data before you even know the right questions.

## The in-betweeners

Two family members blur the line:

- **Self-supervised** — the model invents its own labels from the data (the trick behind modern language models).
- **Reinforcement learning** — an agent learns by taking actions and receiving rewards, not from labeled examples.

You don't need either on day one. Knowing they exist is enough to keep the map from lying to you.

## How to tell which you need

Ask two questions: **Do I have labels?** and **What am I predicting — a category or a number?** The answers route you to the right algorithm family. ${EXTERNAL.scikit} documents [all the families](https://scikit-learn.org/stable/supervised_learning.html) with examples when you're ready to implement.

${faqBlock([
  ["What is the difference between supervised and unsupervised learning?",
   "Supervised learning trains on labeled examples (inputs with correct answers); unsupervised learning finds structure in unlabeled data, such as natural groupings."],
  ["What is an example of supervised learning?",
   "Training an email classifier on messages already labeled spam or not-spam, so it learns to label new messages."],
  ["What is clustering?",
   "An unsupervised task that groups similar data points together, revealing structure without predefined labels."],
])}

Related: ${relatedLinks(a)}`;
}

function whatIsDataset(a: ArticleMeta): string {
  return `# ${a.title}

Every machine learning project starts the same way — not with an algorithm, but with a dataset. And the least glamorous fact in the field is also the most important: most of the work is making that dataset usable, not training the model.

## Table of contents

- What a dataset is
- Structure: rows and columns
- Structured vs unstructured
- Clean data: the real job
- Where datasets come from
- Frequently asked questions

## What a dataset is

A dataset is a collection of examples, usually arranged so each row is one example and each column is one attribute. To a machine learning model, it's the textbook: the only material the model ever learns from.

## Structure: rows and columns

The most common shape is tabular:

| ID | bedrooms | sq_ft | price |
|---|---|---|---|
| 1 | 2 | 900 | 180000 |
| 2 | 3 | 1400 | 260000 |

Each row is one house. Each column is a feature — and one column, price, is the label the model would learn to predict. When someone says "the data," nine times out of ten they mean a table exactly like this.

## Structured vs unstructured

**Structured data** is rows and columns — numbers, dates, categories. **Unstructured data** is everything else: text, images, audio, video. Both can power models, but the tooling differs wildly. Starting out, you'll mostly work with structured data because it's the shortest path to a first working model.

## Clean data: the real job

Real-world datasets arrive broken: missing values, typos in categories, impossible numbers (a house with -3 bedrooms), duplicated rows. Cleaning means finding and fixing those before training, because a model faithfully learns the mistakes too. Practitioners estimate data work consumes 70–80% of a real ML project's time — which is why "data-oriented thinking" is a skill in itself, and one I'm deliberately building toward.

## Where datasets come from

For learning, honest sources abound: open datasets (government statistics, public archives), your own exported data (good for privacy and meaning), or generated synthetic data for practice. Always check a dataset's license and origins — ${EXTERNAL.pandas} is the tool you'll use to inspect and clean whatever you find.

${faqBlock([
  ["What is a dataset in machine learning?",
   "A structured collection of examples — usually rows and columns — that a model is trained on and evaluated against."],
  ["What is the difference between structured and unstructured data?",
   "Structured data fits rows and columns (numbers, dates); unstructured data is text, images, or audio that needs different processing."],
  ["Why is cleaning data important?",
   "Models learn whatever patterns the data contains, including mistakes. Noisy or biased data produces models that reliably reproduce those flaws."],
])}

Related: ${relatedLinks(a)}`;
}

function linearRegression(a: ArticleMeta): string {
  return `# ${a.title}

Linear regression is the "hello world" of machine learning — the first algorithm where you can see a model learn, hold the result in your hand, and draw it on a whiteboard. And it teaches every core concept (features, weights, prediction, error) in a single sitting.

## Table of contents

- The one-line idea
- What the model learns
- Error, the scoreboard
- Fitting the line
- From one variable to many
- Frequently asked questions

## The one-line idea

Given points on a graph, draw the line that passes through them best — then use that line to predict where new points will land. That's it. The "learning" is choosing the line.

Think house prices: every dot is a house (x = square footage, y = sold price). The line is the model's summary of how price changes with size, and predicting a new price means reading the line at a new x.

## What the model learns

The line has a slope and an intercept. In ML vocabulary those are the **weights**: the dials the training process adjusts.

\`\`\`python
# line: y ≈ slope * x + intercept
predicted_price = slope * square_feet + intercept
\`\`\`

Before training, the slope and intercept are random. After training, they're tuned so the line is as close as possible, on average, to real prices.

## Error, the scoreboard

"Best" needs a number. For each point, take the vertical distance between the line and the actual value, square it (so direction doesn't cancel out), and average. That's **mean squared error** — the score the algorithm tries to make small.

## Fitting the line

Two paths do the tuning:

- **Gradient descent** — repeatedly nudge the weights down the error slope.
- **Closed form** — solve directly for the best weights.

For one variable, either works and the math stays gentle. In Python, ${EXTERNAL.scikit} does it in a few lines once the concepts are yours:

\`\`\`python
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X, y)          # learn the line
model.predict([[1500]])  # predict a new point
\`\`\`

## From one variable to many

One input gives a line; many inputs give a plane (and more). The core story never changes: features in, weights learned, predictions out, error minimized. Once that clicks, the whole field's vocabulary has somewhere to live.

${faqBlock([
  ["What is linear regression used for?",
   "Predicting a numeric value from one or more inputs by fitting the best straight line (or plane) through the data."],
  ["What does gradient descent do?",
   "It iteratively adjusts a model's weights in the direction that reduces error, until the error is as low as it will go."],
  ["Is linear regression machine learning?",
   "Yes — it's the simplest supervised learning algorithm for regression, and the standard first step into the field."],
])}

Related: ${relatedLinks(a)}`;
}

function mlRoadmap(a: ArticleMeta): string {
  return `# ${a.title}

The hardest part of starting machine learning isn't the math — it's the order of operations. Most people dive into a framework, hit the math they skipped, and quit. This is a path that assumes you can already write basic Python and respects that you're also, you know, a student with a life.

## Table of contents

- The sequencing principle
- Step 1: Python fluency
- Step 2: data handling
- Step 3: the mathematics that matter
- Step 4: first models
- Step 5: the honest portfolio
- Frequently asked questions

## The sequencing principle

Each step must be *usable* before you add the next. The alternative — memorizing theory you can't apply — is the number-one reason people wash out. Here, every stage ends in something you can run.

## Step 1: Python fluency

Not "hello world." Fluency means functions, data structures, file handling, and small projects that persist data. If you can build the management systems in the Projects section, you're already here.

## Step 2: data handling

Learn pandas: read CSVs, filter rows, compute group statistics. You'll do this daily in ML, and it's where "thinking in data" begins. A week of deliberate practice gets you operational.

## Step 3: the mathematics that matter

Forget the full calculus curriculum. You need three ideas, in this order: **what a derivative means** (rate of change — it powers "which way is down"), **basic linear algebra** (vectors and matrices as the shape of data), and **probability basics** (the language of uncertainty). Learn each just-in-time, tied to an algorithm that uses it.

## Step 4: first models

With Python, data, and just-enough math, run your first models in scikit-learn: linear regression, then a classifier. You're not inventing algorithms yet; you're learning the loop — load data, split train/test, fit, evaluate, interpret. That loop is 90% of practical ML.

## Step 5: the honest portfolio

Build small projects that show the loop end to end: a housing-price predictor on open data, a classifier on a public dataset, and one project on data you personally collected. Present them as learning work — because that's what they are. The goal is fluency and evidence, not a false claim of expertise.

${EXTERNAL.scikit} and ${EXTERNAL.pandas} are the two references to keep pinned as you move.

${faqBlock([
  ["Can I learn machine learning with just Python?",
   "Python is the standard language for ML, but you'll also need data-handling skills (pandas) and math foundations (derivatives, linear algebra, probability) as you progress."],
  ["How much math is needed for machine learning?",
   "To start: the concept of a derivative, basic linear algebra, and elementary probability — learned just-in-time alongside algorithms, not a full degree first."],
  ["What is the best first machine learning project?",
   "An end-to-end pipeline on a small, clean dataset — load, split, train, evaluate, explain — such as predicting house prices with linear regression."],
])}

Related: ${relatedLinks(a)}`;
}

function pythonForMl(a: ArticleMeta): string {
  return `# ${a.title}

There are languages you *can* do machine learning in, and then there's the language the entire field speaks. Python didn't win because it's fastest — it isn't. It won because one decision decades ago created an ecosystem so complete that every other step of ML work works better inside it.

## Table of contents

- The honest reason it won
- The ecosystem, in three layers
- The libraries you'll meet first
- Is Python enough?
- Frequently asked questions

## The honest reason it won

Python won machine learning for a boring, powerful reason: the heavy lifting isn't done in Python. Libraries like NumPy do the math in optimized C and Fortran underneath; Python is the comfortable upper layer where researchers and engineers write the *orchestration*. You get human-friendly syntax and near-compiled performance for the number crunching, at once.

## The ecosystem, in three layers

| Layer | Role | Examples |
|---|---|---|
| Numerical core | fast arrays and math | NumPy |
| Data + modeling | tables and algorithms | pandas, scikit-learn |
| Deep learning | neural networks at scale | PyTorch, TensorFlow |

Each layer builds on the one below it, which is why learning them in order matters — skipping to the top layer is how people get confused.

## The libraries you'll meet first

- **NumPy** — the n-dimensional array, the substrate of everything.
- **pandas** — DataFrames for cleaning and exploring tables.
- **matplotlib** — plotting, so you can *see* what the data says.
- **scikit-learn** — the swiss-army knife of classic ML algorithms.

These four cover the entire beginner-to-intermediate journey. A deep learning framework can wait until you've internalized the loop all four share.

## Is Python enough?

For learning and for most applied work, yes. Python plus its ecosystem carries you from first model to deployed service. Other skills stack on top — SQL, git, maybe C++ for the deepest systems work — but the foundation holds. ${EXTERNAL.pythonDocs} and ${EXTERNAL.scikit} are the authoritative starting points.

${faqBlock([
  ["Why is Python used for machine learning?",
   "Its ecosystem offers fast, optimized libraries (NumPy, pandas, scikit-learn, PyTorch) with a simple, productive language on top — combining performance and developer speed."],
  ["What Python libraries should I learn first for ML?",
   "NumPy for arrays, pandas for data, matplotlib for plots, and scikit-learn for classic algorithms — in that order."],
  ["Is Python fast enough for machine learning?",
   "Yes for learning and most applied work: the heavy computation runs in optimized C/C++ inside the libraries, while Python orchestrates it."],
])}

Related: ${relatedLinks(a)}`;
}

function pandasFirstSteps(a: ArticleMeta): string {
  return `# ${a.title}

If NumPy is the array, pandas is the spreadsheet — the table you filter, group, and summarize. It's the first "real" data tool a Python developer meets, and a few functions carry most of the weight.

## Table of contents

- The DataFrame
- Reading a CSV
- Selecting and filtering
- Three functions for week one
- Frequently asked questions

## The DataFrame

\`\`\`python
import pandas as pd
\`\`\`

A \`DataFrame\` is a table: rows and labeled columns, like a spreadsheet living in memory. Its sibling, the \`Series\`, is a single column.

## Reading a CSV

Most real data arrives as CSV:

\`\`\`python
df = pd.read_csv("houses.csv")
df.head()          # first five rows
df.info()          # column types and missing values
df.describe()      # summary stats
\`\`\`

Those three inspection calls are the first thing to run on any new data — they tell you *what you actually have* before you do anything to it.

## Selecting and filtering

Two ways to reach for data: select a column, or filter rows with a condition.

\`\`\`python
df["price"]                      # a column (a Series)
df[df["bedrooms"] >= 3]          # rows where bedrooms >= 3
\`\`\`

That second pattern — a boolean condition inside brackets — is the one you'll type constantly. It's worth pausing on until it stops feeling surprising.

## Three functions for week one

1. **groupby** — summarize by category:
\`\`\`python
df.groupby("neighborhood")["price"].mean()
\`\`\`
2. **fillna / dropna** — handle missing values before they poison an analysis.
3. **to_csv / to_json** — write results back out.

With read, filter, group, and clean, you can already do useful things to real data. ${EXTERNAL.pandas} [10-minute guide](https://pandas.pydata.org/docs/user_guide/10min.html) is the canonical first tour and pairs perfectly with this.

${faqBlock([
  ["What is a pandas DataFrame?",
   "A two-dimensional, labeled table of rows and columns — pandas' central structure for data manipulation."],
  ["How do I read a CSV in pandas?",
   "Use `pd.read_csv(\"file.csv\")`, then inspect with `.head()`, `.info()`, and `.describe()`."],
  ["How do I filter rows in pandas?",
   "Pass a boolean condition inside brackets, like `df[df[\"price\"] > 100000]`."],
])}

Related: ${relatedLinks(a)}`;
}

function mlMistakes(a: ArticleMeta): string {
  return `# ${a.title}

Machine learning attracts a specific kind of self-sabotage — smart, motivated people who stall out for months doing things that look like progress. I've watched (and partially lived) most of these. Here are the six dead ends and the simpler road past each.

## Table of contents

- 1. Starting with deep learning
- 2. Memorizing math instead of building
- 3. Collecting courses instead of models
- 4. Perfecting before shipping
- 5. Ignoring data quality
- 6. Pretending to be further along than you are
- The pattern underneath
- Frequently asked questions

## 1. Starting with deep learning

Everyone wants the neural network. Almost nobody should start there. The concepts that make deep learning make sense — features, training, evaluation — all show up more clearly in a linear regression or a decision tree. Start simple, then climb.

## 2. Memorizing math instead of building

Math is essential, but it sticks when an algorithm *uses* it. Learn a derivative because gradient descent needs it, not because a syllabus says so. Just-in-time beats just-in-case, every time.

## 3. Collecting courses instead of models

The warm feeling of finishing a course is a poor substitute for the discomfort of a model that won't train. Watch less, run more. One small model you built teaches more than five courses you completed.

## 4. Perfecting before shipping

Your first projects will be rough. That's the point. The developer who ships a housing-price predictor with mediocre accuracy has learned the loop; the one still polishing a notebook has learned polish.

## 5. Ignoring data quality

A model is a mirror of its data. Skip cleaning and exploration and you'll "perfectly optimize" a model trained on noise. Time in pandas before the model is time that pays off inside it.

## 6. Pretending to be further along than you are

The honest trap: inflating your level (to yourself or on a portfolio) raises expectations that a real conversation or interview will crush. Claim the direction, not the destination. "Building toward AI/ML" is true, and it's a better position than a confession waiting to happen.

## The pattern underneath

Every one of these is the same error in different clothes: optimizing for the feeling of progress instead of progress. The fix is output — a small model, a real dataset, an honest writeup. ${EXTERNAL.scikit} is enough to start.

${faqBlock([
  ["Do I need deep learning to start in ML?",
   "No. Classic algorithms like linear regression and decision trees teach the loop first; deep learning builds on those foundations later."],
  ["How do I avoid tutorial hell in machine learning?",
   "Cap the watching, then immediately build something small with the concept — a model you can run, evaluate, and explain, however rough."],
  ["Is certification important for machine learning jobs?",
   "Evidence of work matters more than certificates. A few honest, end-to-end projects carry more signal in interviews than a stack of course completions."],
])}

Related: ${relatedLinks(a)}`;
}

function mlProjectIdeas(a: ArticleMeta): string {
  return `# ${a.title}

A student ML project doesn't need a startup-sized dataset or a breakthrough. It needs three things: a real idea, a dataset you can actually get, and a scope small enough to finish before exams. Here are the ones that fit.

## Table of contents

- What makes a student ML project good
- Starter: the classics, re-built
- Better: your own data
- The one I'd pick next
- Presenting it honestly
- Frequently asked questions

## What makes a student ML project good

One that teaches the full loop — load, explore, clean, split, train, evaluate, and *explain* — on a problem you can describe in one sentence. Novelty is a bonus, not a requirement. A finished iris classifier explained well beats an unfinished anything.

## Starter: the classics, re-built

- **Housing prices** — linear regression on an open dataset; already the canonical first project.
- **Iris flowers** — the classic classifier; boring because everyone does it, which is exactly why it's safe to learn on.
- **Handwritten digits (MNIST)** — your first taste of images and neural networks.
- **Titanic survival** — a messy, missing-data-rich dataset that teaches cleaning first.
- **Spam detection** — text features, and a problem everyone understands.

## Better: your own data

Any model built on data you collected yourself is instantly more interesting to explain: export your **screen time** and predict usage patterns, log your **study hours** against grades, or scrape your own **chat messages** to summarize word habits. Personal data comes with meaning — and privacy lessons — built in.

## The one I'd pick next

If I were choosing today for *my* path: an energy-usage or exam-score style regression on a public dataset, because it forces the clean → train → explain loop while staying honest about scale. Document it end to end, and it becomes a portfolio piece that shows thinking, not just a model.

## Presenting it honestly

Write up what the model does, what it doesn't do, what you'd improve, and where the data came from. "Built toward AI/ML" is a direction, and a well-explained small project is the proof you're moving. ${EXTERNAL.scikit}'s [tutorials](https://scikit-learn.org/stable/tutorial/index.html) are the best first stop.

${faqBlock([
  ["What is a good machine learning project for a student?",
   "A small, finishable project with a real dataset — housing-price regression, iris classification, or ideally data you personally collected — that exercises the full train-evaluate loop."],
  ["Should I build my own ML dataset?",
   "If practical, yes — self-collected data makes the project personal and forces honest data-cleaning work, which is the most transferable ML skill."],
  ["Do student ML projects need to be novel?",
   "No. Clarity and completeness beat novelty; a well-explained classic project demonstrates more than a mysterious unfinished one."],
])}

Related: ${relatedLinks(a)}`;
}

/* ================================================================== */
/* Problem solving templates                                           */
/* ================================================================== */

function thinkingBeforeCoding(a: ArticleMeta): string {
  return `# ${a.title}

The fastest programmers I've watched share an unglamorous habit: they hesitate. Before typing, they read the problem twice, ask a question, and sketch. The "slow" start is exactly why they finish first.

## Table of contents

- The reflex to unlearn
- Read it twice
- Understand before build
- Break it down
- Design, then type
- Test and improve
- Frequently asked questions

## The reflex to unlearn

The beginner reflex is to start typing the moment a problem is stated. It feels like momentum. It's actually the most expensive move available, because discovering "this problem is two problems and I solved a different one" after three hours is how projects die.

## Read it twice

The first read tells you what's being *asked*. The second tells you what's being asked *exactly* — the inputs, the outputs, the constraints hiding in the last sentence. Most wrong solutions start with a skipped constraint, not a bug in the code.

## Understand before build

Before any code: can you state, in one sentence, what success looks like? If not, code is premature. Write that sentence down. It becomes your test, your todo list, and your definition of done, all in one place.

## Break it down

The skill underneath everything: decomposition. Take the problem and split it into steps small enough that each one is *obviously* doable. "Build a login system" decomposes into: store users, accept credentials, check a match, manage the session. None of those is scary; the whole is only scary before you split it.

## Design, then type

Sketch the flow — on paper or in comments — before writing syntax. A pseudocode skeleton is a plan; code is just the plan's translation. When the plan is right, the typing is fast and the debugging is short.

\`\`\`python
# pseudocode: issue a book
# 1. find the book by id
# 2. if missing -> error
# 3. if already issued -> error
# 4. else set status to issued
\`\`\`

## Test and improve

Get it working, then try to break it. Then read it back and make it cleaner. "Working" is the midpoint, not the finish — the improve pass is where the learning actually lands.

This is the same cycle you'll find in the interactive "Before I Code" section on the main page. It's not a gimmick; it's the workflow, made visible.

${faqBlock([
  ["Why should you think before coding?",
   "Because misunderstood requirements cause more failures than bugs do. A few minutes of planning prevents hours spent building the wrong thing."],
  ["How do you break down a big programming problem?",
   "Split it into steps small enough that each is obviously doable, then solve and verify them one at a time before composing the whole."],
  ["Is it bad to write pseudocode first?",
   "On the contrary — writing the plan in comments or pseudocode first is one of the highest-leverage habits a programmer can build."],
])}

Related: ${relatedLinks(a)}`;
}

function breakDownProblems(a: ArticleMeta): string {
  return `# ${a.title}

"I don't know where to start" is the most common thing a beginner says about a big problem — and it's almost always a decomposition problem, not an ability problem. You're not missing knowledge; you're missing a way to make the problem smaller.

## Table of contents

- Why "big" is an illusion
- The five-step method
- A worked example
- Splitting by dimension
- Frequently asked questions

## Why "big" is an illusion

A big problem is just several small problems stacked and glued together. Decompose it and each piece is ordinary. The skill isn't solving big problems — it's never needing to, because you've already reduced them.

## The five-step method

1. **Restate** the goal in one sentence.
2. **List** every distinct thing that must happen to reach it.
3. **Order** those things by dependency — what must come first.
4. **Shrink** any step that still feels big (repeat the split).
5. **Solve** one step, verify it, move on.

The first four steps are pure thinking and take minutes. The fifth is the only one that involves a keyboard.

## A worked example

"Build a student management system" is too big to hold. Splitting it:

- Store records → *list of dictionaries*
- Add a student → *a function that appends*
- Save between runs → *write to CSV*
- Find a student → *search by roll number*
- Show them a menu → *a while loop*

Now it's five ordinary tasks. None requires genius; each requires about twenty minutes. The "impossible" project was just a queue of easy ones.

## Splitting by dimension

When a step resists splitting, try these cuts:

- **By time** — what happens first, second, third?
- **By data** — what input is needed, what output comes out?
- **By responsibility** — who/what performs this action?

Every real decomposition is one of these three applied repeatedly. Once the method is automatic, "where do I start" has a reliable answer: *at the first step you just wrote down.*

${faqBlock([
  ["What is problem decomposition in programming?",
   "Breaking a complex task into smaller, ordered sub-problems that are individually solvable and verifiable."],
  ["How do I start a project when it feels overwhelming?",
   "Restate the goal in one sentence, list every required step, order them by dependency, then solve just the first one."],
  ["Does planning take too much time?",
   "Minutes of planning routinely saves hours of rework — the 'slow' start is what makes the finish fast."],
])}

Related: ${relatedLinks(a)}`;
}

function debuggingStrategies(a: ArticleMeta): string {
  return `# ${a.title}

Debugging is the one skill every programmer uses daily and almost nobody is taught systematically. The difference between an hour lost and five minutes well-spent is mostly a method — and the method starts with actually reading the error.

## Table of contents

- Read the error first
- Reproduce it reliably
- Narrow the search
- The binary-search bisect
- Rubber-duck it
- What not to do
- Frequently asked questions

## Read the error first

Most time is lost skipping step one. A traceback isn't a wall of noise; it's a map: the exception type names the kind of problem, the bottom lines point to *your* code, and the message usually says what's wrong. Read the last three lines before you touch anything.

## Reproduce it reliably

A bug you can't reproduce on demand is just a rumor. Find the smallest input that triggers it. That single step converts "sometimes broken" into "deterministically broken," and deterministic problems are solvable.

## Narrow the search

Add a print, a breakpoint, or a log at key points to see how far execution gets before misbehaving. You're not logging for fun — you're doing a binary search through your own logic, cutting the possible location in half each time.

## The binary-search bisect

If a version worked yesterday and broke today, bisect the changes, not your mood: revert half, test, repeat. The same trick works across code paths — comment out or stub half the pipeline and see which half contains the bug.

## Rubber-duck it

Explain the code out loud, line by line, to an actual rubber duck or a patient friend. The act of verbalizing forces your brain out of assumptions and into the actual logic — and a surprising number of bugs confess themselves before the duck replies.

## What not to do

- Don't change random things hoping. Every edit should be a hypothesis.
- Don't stack guesses. Change one thing, test, then decide.
- Don't skip the error message. It's the one collaborator who's always trying to help.

Reference when you want the discipline formalized: [this classic on programming debugging](https://docs.python.org/3/reference/) aside, the real teachers are ${EXTERNAL.pythonDocs} and a traceback read carefully.

${faqBlock([
  ["What is the best debugging strategy for beginners?",
   "Read the error message carefully, reproduce the bug with the smallest input, then narrow the location with targeted prints or breakpoints — one change at a time."],
  ["Why should I read the error message first?",
   "It identifies the exception type and points at the responsible lines, which usually isolates the problem before any guessing begins."],
  ["What does rubber duck debugging mean?",
   "Explaining your code aloud line by line to an inanimate object (or a friend), which reveals flawed assumptions you'd otherwise skip over."],
])}

Related: ${relatedLinks(a)}`;
}

function programmingLogic(a: ArticleMeta): string {
  return `# ${a.title}

Syntax is the least interesting part of programming — and the part beginners over-invest in. What makes someone a programmer is logic: the ability to turn a goal into conditionals, loops, functions, and state that unfailingly do the right thing. That skill is learnable, and it comes before every language.

## Table of contents

- The four building blocks
- Conditionals
- Loops
- Functions and state
- Logic vs syntax
- How to practice logic
- Frequently asked questions

## The four building blocks

Every program, in every language, is arrangements of four things:

1. **Sequences** — steps in order.
2. **Conditionals** — do this *if* something is true.
3. **Loops** — do this *while/for* a condition holds.
4. **Functions & state** — name reusable behavior, remember values.

Master these four and syntax differences between languages become trivia.

## Conditionals

A conditional is a gate. Learning it isn't the syntax — it's the ability to state, in words, the exact condition under which a step should run.

\`\`\`python
if balance >= price:
    complete_purchase()
else:
    notify("Insufficient funds")
\`\`\`

The thinking is the hard part: *"a purchase succeeds only when the balance covers the price."* The \`if\` is just typing.

## Loops

A loop repeats until a condition fails. The beginner trap is an off-by-one error — never quite proving whether the loop runs N times or N+1. Practice loop logic on paper: write the start, the step, and the stop condition as three separate facts.

## Functions and state

Functions package logic; state is the program's memory. Difficult bugs are almost always state bugs — the value that should have updated and didn't. Building a small console app teaches state faster than any tutorial, because you watch your own records get out of sync and learn why.

## Logic vs syntax

Syntax you can look up in seconds. Logic you either have or you're building. The good news: logic is trained by volume of *thinking* about problems — which is exactly what the "Before I Code" and problem-solving pieces on this site are for.

## How to practice logic

- Solve small problems on paper before code.
- Trace code line by line by hand.
- Build tiny programs that each exercise one block.

No shortcuts — but the stack of solved small problems compounds. ${EXTERNAL.pythonDocs} gives you the syntax; the logic only comes from using it.

${faqBlock([
  ["What is programming logic?",
   "The art of turning a goal into sequences, conditionals, loops, and state such that the program does the right thing in every case."],
  ["How do I improve my coding logic?",
   "Solve small problems with paper traces first, build tiny programs that each exercise one concept, and read back your own code critically."],
  ["Is syntax or logic more important for beginners?",
   "Logic — syntax is instantly look-upable, while logic determines whether the program is correct at all."],
])}

Related: ${relatedLinks(a)}`;
}

function beginnerMistakes(a: ArticleMeta): string {
  return `# ${a.title}

The mistakes that stall beginners aren't the dramatic ones. They're quiet habits that *feel* like learning but quietly cap it — and they're all fixable today, with no new knowledge required.

## Table of contents

- Not reading errors
- Building too big, too early
- Copy-pasting without understanding
- Skipping the "make it work" pass
- Comparing your chapter one to someone's chapter ten
- Frequently asked questions

## Not reading errors

An error message is the most useful text you'll see all day, and beginners scroll past it. The exception type and the last lines of the traceback name the problem and point at the line. Next time it throws, read it like someone handed you the answer — because they did.

## Building too big, too early

"Build a social network" on week two is how people quit. The fix is a ladder: projects that each add one new skill and each *finish*. Your goal is reps of the full build-commit-finish loop, not one heroic unfinished masterpiece.

## Copy-pasting without understanding

Copying code you could explain is a shortcut; copying code you can't is a debt. Type it out, rename things, and say each line aloud. If a line can't be explained, that line is the next thing to learn — the paste just tried to hide it from you.

## Skipping the "make it work" pass

Get it *running* before you get it *elegant*. Beginners often polish structure before the thing even works, then debug two problems at once. Working first, then clean, then fast — in that order.

## Comparing your chapter one to someone's chapter ten

You are not behind because someone's GitHub looks different from yours. Their chapter ten was once a chapter one too, and your only useful comparison is against your own last month. The people who look impressive mostly just kept going.

${faqBlock([
  ["What is the biggest mistake beginner programmers make?",
   "Starting with projects far too large to finish, which turns early excitement into early burnout instead of completed practice."],
  ["Should I copy code from tutorials?",
   "Yes, if you type it, rename it, and can explain every line afterward. No, if you paste blindly — that masking of misunderstanding stalls you."],
  ["How do I stop feeling behind as a beginner?",
   "Compare against your own previous work, not others'. Ship small finished projects and watch the gap close in your own history."],
])}

Related: ${relatedLinks(a)}`;
}

function tutorialHell(a: ArticleMeta): string {
  return `# ${a.title}

Tutorial hell is the loop where course after course feels like progress and nine months later you still can't start a project from a blank file. The name is flippant; the trap is real. This is the bridge out.

## Table of contents

- What tutorial hell actually is
- Why tutorials feel like progress
- The exit, step by step
- The 80/20 rule that saved me
- Frequently asked questions

## What tutorial hell actually is

It's not watching tutorials — tutorials are great. It's using them as a substitute for building, so that consumption *replaces* creation instead of feeding it. The tell: you can follow along perfectly and can't produce anything without a video in front of you.

## Why tutorials feel like progress

Following along gives you the *feeling* of competence because everything works. But comprehension and production are different skills — reading sheet music and performing the piece are not the same thing. Tutorials train the first; only building trains the second.

## The exit, step by step

1. **Pick one project** slightly below your ambition.
2. **Write the spec** in three bullets before touching code.
3. **Build from a blank file**, using documentation (not a video) when stuck — that's the skill being trained.
4. **Allow being stuck.** Ten minutes of friction teaches more than an hour of follow-along.
5. **Finish it** — commit it, even rough.

Do this once and the blank file stops being frightening. Do it five times and tutorials return to their proper role: references you dip into, not rails you ride.

## The 80/20 rule that saved me

Flip the ratio: 80% building, 20% consuming. A tutorial explaining a concept is homework for *right before* you use that concept. Watch twenty minutes, then build with it for an hour. The ratio, more than any course choice, is what breaks the loop.

${faqBlock([
  ["What is tutorial hell in programming?",
   "A state where endless tutorial consumption substitutes for building, leaving you able to follow along but unable to start real projects."],
  ["How do I escape tutorial hell?",
   "Build small projects from a blank file, rely on documentation instead of videos, allow friction, and flip your time ratio to mostly building."],
  ["Should I stop watching tutorials entirely?",
   "No — use them as targeted references right before applying a concept, rather than as a substitute for doing."],
])}

Related: ${relatedLinks(a)}`;
}

function codingChallenges(a: ArticleMeta): string {
  return `# ${a.title}

Coding challenges get a weird reputation: either "the way to land a job" or "a waste of time." The truth is in *how* they're done. Treated as thinking practice, they're one of the best investments available. Treated as typing practice, they're nearly useless.

## Table of contents

- What challenges train (and don't)
- Doing them the useful way
- A concrete routine
- From challenges to projects
- Frequently asked questions

## What challenges train (and don't)

A challenge trains your ability to take a stated problem, find its edge cases, and express a solution in code — the micro-loop of problem solving. It does *not* train large-scale design, persistence, or finishing real projects. Conflating the two is how people burn months on challenges with nothing to show.

## Doing them the useful way

The difference between growth and motion:

- **Solve on paper first.** Sketch the logic before code.
- **Narrate the approach** out loud, then implement.
- **Check the edge cases** — empty input, minimum, maximum.
- **Read other solutions** *after* yours works. That's where new techniques arrive.
- **Never memorize.** Languages grow, patterns do; understanding transfers.

## A concrete routine

Fifteen to thirty minutes a day beats a three-hour weekend binge. Pick problems slightly above your current level — the ones where you can almost see the shape of the answer. If it takes days, it's a project, not a challenge; if it takes seconds, it's a warm-up.

## From challenges to projects

Challenges are the gym; projects are the game. The exercises keep your problem-solving sharp, but you play the game by building — and the real-world judgment (what to build, when something's done, how to structure it) only comes from projects. Do both, in that ratio: challenges daily, projects as the main event.

The pattern beneath all of it is the same loop this site keeps returning to: **understand, break down, design, build, test, improve** — challenges just run that loop in tighter laps.

${faqBlock([
  ["Do coding challenges actually help?",
   "Yes — when treated as thinking practice (plan, implement, review edge cases, study others) rather than rote typing."],
  ["How many coding challenges should I do per day?",
   "Consistency beats volume: 15–30 focused minutes daily, choosing problems just above your current level."],
  ["Are coding challenges enough to get a job?",
   "No — they sharpen fundamentals, but real projects demonstrate the judgment and finishing ability that interviews and jobs actually reward."],
])}

Related: ${relatedLinks(a)}`;
}

/* ================================================================== */
/* Student journey templates                                           */
/* ================================================================== */

function learnAsStudent(a: ArticleMeta): string {
  return `# ${a.title}

University teaches you theory on a schedule; projects teach you understanding on your own time. A CS student who runs both without burning out treats them as the same activity in different gears — not as two competing demands.

## Table of contents

- The wrong model: two full-time jobs
- Theory and projects, one loop
- Using courses as scaffolding
- Protecting momentum
- Frequently asked questions

## The wrong model: two full-time jobs

The burnout model is treating university and personal coding as two separate full-time commitments. They're not — they're the same skill fed from two directions, and the students who thrive notice the overlap instead of the clash. The data structures lecture and your side project both benefit from the same "make it concrete" moment.

## Theory and projects, one loop

Every concept has two halves: the classroom definition and the working program. Run them together — when the lecture introduces a structure, go home and build a tiny thing with it. The lecture stops being abstract, and the project stops being guesswork. One loop, two passes.

\`\`\`python
# class today: dictionaries
# side project tonight: a lookup table for a contact app
contacts = {"042": "Haseeb", "051": "Ayesha"}
\`\`\`

## Using courses as scaffolding

Assignments are the scaffolding — use them to rehearse fundamentals so your side projects can aim at things assignments never cover: persistence, structure, a README, shipping. The assignment proves you understand the concept; the project proves you can *use* it when nobody's grading.

## Protecting momentum

The practical rules that kept me (mostly) sane:

- **Small daily reps over weekend binges.** Twenty minutes compounds.
- **One project at a time.** Two half-attended projects become zero finished ones.
- **Commit often.** A green GitHub history is a trail of small wins.
- **Rest deliberately.** You're a student first; the degree is the long game.

Burnout isn't a sign of dedication — it's a scheduling error. The students who last are the ones who made the pace sustainable, not heroic.

${faqBlock([
  ["How do I balance university with learning to code?",
   "Treat them as one loop — apply each lecture concept in a small project the same week — and keep personal coding to small, consistent reps."],
  ["Should I build projects during the semester?",
   "Yes, but small and one at a time, using assignments as scaffolding so projects focus on skills coursework doesn't cover."],
  ["How do I avoid burnout as a CS student?",
   "Sustainable daily reps, one project at a time, committing small wins often, and treating rest as part of the plan rather than a failure."],
])}

Related: ${relatedLinks(a)}`;
}

function firstLanguage(a: ArticleMeta): string {
  return `# ${a.title}

Every "best first language" article is secretly written by someone who forgot being a beginner. There is no universal best — but there is a better question than the one everyone asks. Ask not "which language is best" but "what do I want to build."

## Table of contents

- The question's real answer
- The goals map
- The language lineup
- The trap of switching
- Frequently asked questions

## The question's real answer

The best first language is the one that keeps you building long enough to become good — which means it should match your goal, your patience, and your environment. A perfect language you quit is worse than a "good enough" language you keep.

## The goals map

| Your goal | Natural first pick | Why |
|---|---|---|
| Data, AI/ML, automation | Python | gentle syntax, massive data/ML ecosystem |
| Android apps | Java (or Kotlin) | the platform's native languages |
| Web, front-to-back | JavaScript | runs everywhere the web runs |
| Systems/low-level | C | teaches what the hardware actually does |

## The language lineup

**Python** is the kindest on-ramp — the least ceremony between idea and working program, and the natural home for the AI/ML direction I'm personally building toward.

**Java** is verbose but explicit, which front-loads concepts like types and structure that pay off across every later language — and it's the classic Android choice.

**JavaScript** is unavoidable for the web, and its ubiquity means you'll meet it eventually regardless.

**C** is unforgiving but honest — learning it even briefly makes every higher-level language feel explained.

## The trap of switching

The dangerous pattern isn't a wrong first pick — it's picking a new first language every month. Shallow starts in five languages lose to one language taken deep. Choose based on your goal, then stay long enough to *build something real* in it before curiosity pulls you elsewhere. Switching later is fine; switching weekly is the habit that stalls everything.

${faqBlock([
  ["What is the best first programming language for a student?",
   "Depends on the goal — Python for data/AI/ML or gentle onboarding, Java for Android, JavaScript for the web. Pick by what you want to build."],
  ["Is Python or Java better to learn first?",
   "Python for a gentler start and data/AI direction; Java for Android or to front-load typed, structured discipline."],
  ["How long should I stick with my first language?",
   "Until you've built several real, finished projects in it — long enough that the fundamentals transfer, not just the syntax."],
])}

Related: ${relatedLinks(a)}`;
}

function projectsWhileStudying(a: ArticleMeta): string {
  return `# ${a.title}

Everyone wants a portfolio before graduation. Almost nobody has the time they imagine it requires. The honest solution isn't a semester off — it's a system that fits real projects into the cracks of a real timetable.

## Table of contents

- The wrong framing
- The small-project system
- One concept per project
- The commit cadence
- Frequently asked questions

## The wrong framing

"Big project" = "free summer" is the framing that stalls people for years. The students with portfolios aren't the ones with more free time — they're the ones running a system that produces small finished things continuously.

## The small-project system

- **Choose small.** Scoped to finish in days, not months.
- **Write the spec first.** Three bullets is enough to stop scope creep.
- **Build in the gaps.** Twenty-minute blocks after class are real time when the project is already planned.
- **Finish before polishing.** Ship the working version, then improve.

The loop — spec, build, commit, finish — is the product. Run it often enough and a portfolio assembles itself out of the shelf of finished things.

## One concept per project

Each project exists to cement one idea: file handling, a data structure, a layout pattern. One new idea per project means the learning is legible and the project stays small. Two new ideas max. This is the same ladder from the project-ideas article, and it's why the management systems I built each taught something distinct instead of everything at once.

## The commit cadence

Commit after each working feature, not at the end of a week. Small commits are a habit, a safety net, and — over a degree's worth of time — a contribution history that *is* the portfolio's proof. ${EXTERNAL.gitDocs} covers the mechanics; the cadence is the habit.

${faqBlock([
  ["How do students find time for side projects?",
   "By choosing projects small enough to finish in days, writing a spec first, and using short study gaps for focused building blocks."],
  ["How many projects should a CS student build?",
   "Focus on finishing a steady stream of small ones, each teaching one idea, rather than chasing a specific count."],
  ["When should I start building a portfolio?",
   "Now — the 'portfolio' is just the shelf of small finished projects, and it's far easier to accumulate over a degree than to assemble in senior year."],
])}

Related: ${relatedLinks(a)}`;
}

function githubStudents(a: ArticleMeta): string {
  return `# ${a.title}

GitHub is where coursework quietly turns into proof. An account, a handful of repositories, and a commit habit — that's all it takes to start turning "I studied programming" into "look at the trail." This is the getting-started map.

## Table of contents

- Git vs GitHub, once more
- Setting up your first repo
- The daily loop
- What belongs in a student profile
- Frequently asked questions

## Git vs GitHub, once more

Git is the tool that tracks versions of your files, entirely on your machine. GitHub is a *host* — the website where your Git repositories live and get shared. You can use Git without GitHub, but GitHub is what makes the work visible.

## Setting up your first repo

\`\`\`bash
git init
git add .
git commit -m "first working version"
git branch -M main
git remote add origin https://github.com/you/project.git
git push -u origin main
\`\`\`

Six commands, and your project exists somewhere real. The order matters less than the habit starting.

## The daily loop

After setup, the loop you'll repeat forever is three commands:

\`\`\`bash
git add .            # stage changes
git commit -m "..."  # save a named snapshot
git push             # publish it
\`\`\`

Commit messages are notes to future-you. "fix stuff" explains nothing; "add student search by roll number" explains everything.

## What belongs in a student profile

- **Finished projects**, even small ones, with READMEs.
- **Coursework you're proud of**, marked as such.
- **Experiments**, clearly labeled as learning.

What doesn't belong: secrets, generated builds, and anything you wouldn't show an interviewer. A clean profile of small honest things beats a cluttered one. ${EXTERNAL.githubDocs} is the reference for everything here.

${faqBlock([
  ["What is the difference between Git and GitHub?",
   "Git is the local version-control tool; GitHub is the online platform that hosts Git repositories and adds collaboration features."],
  ["What should a student put on GitHub?",
   "Finished projects with READMEs, meaningful coursework, and clearly labeled experiments — kept clean of secrets and generated files."],
  ["How do I write a good commit message?",
   "Describe the change in a short imperative phrase, like 'add search by roll number', not 'fix stuff'."],
])}

Related: ${relatedLinks(a)}`;
}

function internshipsPrep(a: ArticleMeta): string {
  return `# ${a.title}

Internship advice trends toward the intimidating: grind 300 problems, master system design, interview at the big four. A BSCS student doesn't need any of that to land a *first* internship. They need fundamentals, evidence, and an honest story. Here's the realistic version.

## Table of contents

- What first internships actually want
- The fundamentals that get tested
- Projects as evidence
- Presenting student work honestly
- The timeline that works
- Frequently asked questions

## What first internships actually want

First-internship interviews rarely test system design at scale. They test whether you can write a loop, reason about a small problem out loud, and sound like someone worth a desk. The bar is "teachable and fundamentally sound," not "already an employee."

## The fundamentals that get tested

- **A language, comfortably** — loops, functions, data structures.
- **Basic data structures** — lists, dictionaries, when one beats another.
- **Problem solving out loud** — narrating your thinking matters as much as the answer.
- **Git** — clone, branch, commit, pull request.

That's a short list, and every item on it is trainable in a semester of small projects.

## Projects as evidence

Grades say "completed a curriculum." Projects say "can build something." Two or three finished, explained projects — like the management systems in the Projects section — give an interviewer something concrete to ask about, and give you something concrete to say. Presentation beats quantity.

## Presenting student work honestly

The phrase that works: *"I built X to learn Y; here's what it does and what I'd improve."* That framing is honest, shows self-awareness, and turns "just a student project" into a story about growth. Overselling student work ("production-grade, enterprise-scale") reads as unserious the moment a follow-up question lands.

## The timeline that works

Start early and keep the reps small: fundamentals now, one new project per month, and a portfolio that's a shelf of finished things rather than a senior-year sprint. The internship is a milestone on the way to AI/ML, not the destination itself.

${faqBlock([
  ["What do companies look for in first-time interns?",
   "Fundamental skill in one language, basic data structures, the ability to reason aloud, and Git familiarity — teachability over experience."],
  ["Are projects more important than grades for internships?",
   "Grades open the door; projects often win the conversation by giving interviewers concrete evidence and discussion material."],
  ["How should I describe student projects in interviews?",
   "Honestly: what you built, why, how it works, and what you'd improve. That framing shows growth, not overselling."],
])}

Related: ${relatedLinks(a)}`;
}

function developerPortfolio(a: ArticleMeta): string {
  return `# ${a.title}

A developer portfolio isn't a résumé with animations — it's a story with evidence. The sites people remember make you understand a person's arc in one scroll: what they're learning, what they've built, where they're going. This is how to design yours around that.

## Table of contents

- Résumé vs portfolio
- The story arc
- What to include
- What to cut
- The honesty rule
- Frequently asked questions

## Résumé vs portfolio

A résumé is a list of facts, skimmed in ten seconds. A portfolio is a narrative, experienced over a minute. They serve different jobs, and a portfolio that just re-lists the résumé wastes the medium. The portfolio's superpower is *showing* what the résumé can only *claim*.

## The story arc

The memorable sites follow a quiet arc — exactly the structure this site uses:

1. **Identity** — who this is.
2. **Journey** — how they learned.
3. **Evidence** — what they built.
4. **Thinking** — how they approach problems.
5. **Direction** — where they're heading.
6. **Contact** — what's next.

You don't need a timeline of every lesson — just enough arc that a viewer can retell your story to someone else afterward.

## What to include

Real projects with real descriptions, honest skills without inflated bars, a bit of personality, and clear ways to reach you. Small and true beats large and padded.

## What to cut

Fake statistics, borrowed testimonials, invented experience, "expert" percentages on skills, and client logos you don't have. Every one of these reads as noise at best and a lie at worst — and one caught exaggeration poisons the rest.

## The honesty rule

The rule that keeps a portfolio trustworthy: **only claim what you can defend in a follow-up conversation.** "Building toward AI/ML" survives a conversation. "AI/ML expert" does not. The former is a story; the latter is a liability.

${faqBlock([
  ["What should a student developer portfolio include?",
   "A clear identity, a short journey, real finished projects with explanations, honest skills, and contact details — plus a bit of personality."],
  ["Should I put fake statistics on my portfolio?",
   "Never. Invented metrics, testimonials, or experience read as lies and undercut the real work you've done."],
  ["How is a portfolio different from a résumé?",
   "A résumé lists; a portfolio demonstrates. It shows actual projects and a story, not just claims."],
])}

Related: ${relatedLinks(a)}`;
}

function csVsSoftwareEng(a: ArticleMeta): string {
  return `# ${a.title}

Prospective students agonize over "Computer Science or Software Engineering?" as if the choice determines their life. It doesn't — the degree opens one door, and what you build alongside it opens the other. Here's the distinction that actually matters for deciding.

## Table of contents

- The real difference
- What each curriculum favors
- Which matters more
- How to decide
- Frequently asked questions

## The real difference

**Computer Science** is the study of *computation* — how algorithms work, what's computable, why some problems are hard. **Software Engineering** is the study of *building software* — how to design, test, and maintain systems that teams ship.

One is more mathematics; the other is more process. Both produce people who can program, and the job market routinely treats the two as interchangeable for entry roles.

## What each curriculum favors

| | Computer Science | Software Engineering |
|---|---|---|
| Math rigor | higher | moderate |
| Algorithms/theory | deep | solid |
| Process & documentation | light | deep |
| Project management | light | deep |

## Which matters more

For getting hired, the degree name matters far less than what you can *do*: the projects you've shipped, the fundamentals you can demonstrate. A CS student who builds is ahead of a SWE student who doesn't, and vice versa. The curriculum is the scaffold; the building is on you either way.

## How to decide

Choose by temperament, not by fear of doors closing: love the *why* behind computation? Computer Science. Love the craft of *shipping reliable software*? Software Engineering. Either way, keep a companion habit — theory students should build, engineering students should understand the underlying math — because the dividing line, in practice, is a lot thinner than the brochures make it.

${faqBlock([
  ["What is the difference between CS and software engineering?",
   "CS focuses on the theory of computation, algorithms, and math; software engineering focuses on designing, building, and maintaining software systems through engineering process."],
  ["Which degree is better for getting a job?",
   "Both are respected and often interchangeable for entry roles — projects and demonstrated skill matter more than the exact degree name."],
  ["Should I choose CS if I just want to build apps?",
   "You can build apps from either degree; pick by whether you enjoy theory more (CS) or software process and construction more (software engineering)."],
])}

Related: ${relatedLinks(a)}`;
}

/* ================================================================== */
/* Android templates                                                   */
/* ================================================================== */

function androidArchitecture(a: ArticleMeta): string {
  return `# ${a.title}

Beginner Android apps start as one Activity holding everything — layout, logic, network calls — and that works precisely until it doesn't. The moment a feature stacks onto another, the mess shows. A small amount of structure, learned early, keeps a project maintainable instead of magical.

## Table of contents

- The parts of an Android app
- The one-Activity trap
- Separating UI from logic
- A beginner-friendly structure
- Frequently asked questions

## The parts of an Android app

An Android app is, at minimum:

- **Activities** — screens, each with a lifecycle.
- **Layouts (XML)** — what each screen looks like.
- **App logic** — what the app *does* with data.

The trap is letting the Activity own all three at once.

## The one-Activity trap

When an Activity does everything — inflates the layout, parses data, talks to the database — every change ripples through one giant file. Beginners feel the pain as "I can't find where to change the price." That's an architecture problem wearing a syntax costume.

## Separating UI from logic

The first, highest-value split: an Activity should *show*, not *decide*. Move the "deciding" into plain classes that don't know the UI exists. A cart total is computed by a cart class; the Activity just displays the result.

\`\`\`java
class Cart {
    int total(List<CartItem> items) {
        int sum = 0;
        for (CartItem item : items) sum += item.price * item.quantity;
        return sum;
    }
}
\`\`\`

Now the total logic lives in one testable place, and the Activity stays thin.

## A beginner-friendly structure

You don't need full MVVM on day one. You need folders:

\`\`\`
com.example.app/
├── ui/          # activities and adapters
├── model/       # plain data classes
└── data/        # databases, auth, cloud calls
\`\`\`

Model/data/ui is an honest starting architecture: plain classes for data, one folder for storage and cloud, one for screens. It scales far enough for student projects, and it's the foundation the formal patterns (like MVVM) build on later. ${EXTERNAL.android} is the canonical guide when you want the official vocabulary.

${faqBlock([
  ["What is the biggest beginner mistake in Android architecture?",
   "Putting everything in one Activity — layout, logic, and data access — which becomes unmaintainable as features stack."],
  ["Do I need MVVM as a beginner?",
   "Not immediately. Start with a simple model/data/ui split; the formal patterns make far more sense once you've felt the problem they solve."],
  ["What should an Activity do?",
   "Display the UI and respond to input — delegating decisions and data access to separate classes."],
])}

Related: ${relatedLinks(a)}`;
}

function javaAndroid(a: ArticleMeta): string {
  return `# ${a.title}

Android development with Java and XML is a classic pairing for good reason: it's explicit, well documented, and every Android concept you learn in it transfers forward — even as Kotlin becomes the more common default. This is the orientation tour for someone starting the same way I did.

## Table of contents

- How Java and XML split the work
- The Activity lifecycle, briefly
- Your first real app
- Java vs Kotlin, honestly
- Frequently asked questions

## How Java and XML split the work

Android splits "what it looks like" from "what it does": **XML layout files** describe the UI (buttons, text, containers), and **Java classes** wire behavior onto it. You build the screen in XML, then find views and attach listeners in Java.

\`\`\`xml
<TextView
    android:id="@+id/title"
    android:text="Welcome"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content" />
\`\`\`

\`\`\`java
TextView title = findViewById(R.id.title);
title.setOnClickListener(v -> title.setText("Clicked"));
\`\`\`

One mental model: XML is the skeleton, Java is the muscles.

## The Activity lifecycle, briefly

An Activity isn't just "open" or "closed" — it moves through states (created, started, resumed, paused, stopped, destroyed). Knowing *roughly* where your setup and cleanup belong prevents the classic "app loses data on rotation" bugs. ${EXTERNAL.android} documents the [lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle) in detail.

## Your first real app

Beyond "hello world," the project that teaches the most is one with a list and a detail screen: fetch or fake a few items, show them in a list (a RecyclerView), and open details on tap. That single exercise covers layouts, adapters, intents, and the split between screens — four concepts the rest of Android builds on.

## Java vs Kotlin, honestly

Kotlin is the modern default and more concise; Java is verbose but explicit and still everywhere in tutorials, legacy code, and job listings. The concepts are identical — learning either teaches the platform. If you're already comfortable in Java (as I was), it's a perfectly honest place to build SneakerStore-class apps before moving on.

${faqBlock([
  ["Should I learn Kotlin or Java for Android?",
   "Kotlin is the modern default, but Java remains valid and well documented; the platform concepts — activities, layouts, lifecycle — are the same in both."],
  ["What is XML used for in Android?",
   "XML layout files describe the structure and appearance of the UI, which Java (or Kotlin) code then wires up with behavior."],
  ["What is the Activity lifecycle?",
   "The sequence of states an Activity passes through — created, started, resumed, paused, stopped, destroyed — that governs when to initialize and clean up."],
])}

Related: ${relatedLinks(a)}`;
}

function firebaseAuth(a: ArticleMeta): string {
  return `# ${a.title}

Authentication is the feature nobody should hand-build for a student project — password storage done wrong is how real breaches happen. Firebase Authentication handles the heavy lifting so you can wire login into an app in an afternoon and focus on what your app actually does.

## Table of contents

- Why not build it yourself
- Project setup
- Email/password sign-in
- Handling state and errors
- The mistakes that show up in logs
- Frequently asked questions

## Why not build it yourself

Rolling your own auth means storing passwords safely (salted hashing), managing sessions, and handling resets — each one a source of serious security bugs. Firebase provides all of it, maintained by people whose full-time job is getting it right. ${EXTERNAL.firebaseAuth} is the authoritative source.

## Project setup

The flow: create a Firebase project in the console, add an Android app, drop in the generated config, and enable Email/Password in the Authentication dashboard. The console walks you through each step; the SDK then exposes the calls you need.

## Email/password sign-in

\`\`\`java
FirebaseAuth auth = FirebaseAuth.getInstance();

auth.createUserWithEmailAndPassword(email, password)
    .addOnCompleteListener(task -> {
        if (task.isSuccessful()) {
            // account created and signed in
        }
    });
\`\`\`

Signing in is the sibling call (\`signInWithEmailAndPassword\`), and signing out is \`auth.signOut()\`. Listening for auth state (the current user) is how the app decides between the login screen and the main content.

## Handling state and errors

The listener pattern above is the key habit: never assume success — always branch on \`task.isSuccessful()\`. Common failures (weak password, email already in use, bad credentials) arrive as typed exceptions with readable messages; map them to friendly UI copy instead of raw logs.

## The mistakes that show up in logs

- **Forgetting to enable the provider** in the console (the "auth/invalid-credential" classic).
- **Wrong package name / SHA-1** in the project config.
- **Ignoring task failure** — which turns every auth bug into a silent blank screen.

Each is a setup issue, not a logic issue — and each costs an hour the first time, five minutes the second.

${faqBlock([
  ["What is Firebase Authentication?",
   "A managed service that provides sign-in (including email/password and social providers), session handling, and account management so apps don't implement them from scratch."],
  ["Is Firebase Auth free?",
   "Yes for its core email/password and common providers within generous free-tier limits."],
  ["Why shouldn't I build my own authentication?",
   "Secure password storage and session management are easy to get subtly wrong; a managed service handles them with maintained, audited implementations."],
])}

Related: ${relatedLinks(a)}`;
}

function firestoreVsSqlite(a: ArticleMeta): string {
  return `# ${a.title}

When your Android app needs to remember things, you face a fork: keep data on the device (SQLite) or in the cloud (Cloud Firestore). The right answer is usually both — for different jobs. Understanding which is which is the entire skill.

## Table of contents

- The local/cloud fork
- SQLite in one paragraph
- Cloud Firestore in one paragraph
- Choosing per feature
- How they coexist
- Frequently asked questions

## The local/cloud fork

SQLite is a file-based database living on the phone. Firestore is a cloud database synced over the network. One works offline and stays private; the other follows the user across devices and shares data between them. The decision is never "one or the other"; it's "which data belongs where."

## SQLite in one paragraph

SQLite stores data in a local file with SQL semantics. It's fast, works offline, costs nothing per read, and dies with the device unless you back it up. Perfect for preferences, drafts, and any data that's only meaningful on this phone. ${EXTERNAL.sqlite} is the reference.

## Cloud Firestore in one paragraph

Firestore is a NoSQL document database in the cloud. Data syncs automatically, survives device loss, and supports real-time updates — but requires a connection and incurs usage costs. Perfect for anything a user expects to find on a new phone. ${EXTERNAL.firestore} covers the basics.

## Choosing per feature

| Data | Best home | Why |
|---|---|---|
| Cart draft | SQLite | private, fast, offline |
| User profile | Firestore | follows the account |
| Product catalog | Firestore | shared, updatable |
| Saved addresses | Firestore | available on reinstall |
| UI preferences | SQLite | device-only trivia |

## How they coexist

Real apps run both: Firestore for the shared truth, SQLite for the fast local layer — sometimes as a cache of the cloud data. SneakerStore demonstrates the split naturally: the product catalog and account sync via Firestore, while transient local state lives on-device. Choosing per feature, instead of picking a religion, is what separates a defensible design from a cargo-cult one.

${faqBlock([
  ["What is the difference between SQLite and Cloud Firestore?",
   "SQLite is a local, file-based SQL database on the device (offline, private); Firestore is a cloud NoSQL database (synced, shared, requires network)."],
  ["When should I use SQLite in Android?",
   "For device-only data you need fast and offline — drafts, preferences, and anything with no cross-device meaning."],
  ["When should I use Cloud Firestore?",
   "For data that must follow the user or sync between users — profiles, catalogs, saved addresses, and shared application state."],
])}

Related: ${relatedLinks(a)}`;
}

function shoppingCartLogic(a: ArticleMeta): string {
  return `# ${a.title}

A shopping cart looks like "a list of products" and everyone models it wrong the first time. The correct model is a list of **line items** — a product reference plus a quantity. That one shift decides whether your cart stays sane or dissolves into bugs the moment quantities change.

## Table of contents

- The line-item model
- Adding to the cart
- Quantities and totals
- Persistence choices
- Frequently asked questions

## The line-item model

Store a \`CartItem\`, not a raw product. A CartItem points at a product and adds a quantity:

\`\`\`java
class CartItem {
    String productId;
    int quantity;
}

class Cart {
    List<CartItem> items;
}
\`\`\`

Without quantity, adding the same shoe twice means two near-duplicate entries; with it, it means quantity becomes two. The difference shows up immediately in the UI and in every total.

## Adding to the cart

The core logic: if the item exists, bump the quantity; otherwise add a new line.

\`\`\`java
void add(CartItem item) {
    for (CartItem i : items) {
        if (i.productId.equals(item.productId)) {
            i.quantity += item.quantity;
            return;
        }
    }
    items.add(item);
}
\`\`\`

## Quantities and totals

Total price lives in one method — never recomputed ad hoc in each screen. One source of truth for money is a non-negotiable in cart logic.

\`\`\`java
int total() {
    int sum = 0;
    for (CartItem i : items) sum += i.quantity * priceOf(i.productId);
    return sum;
}
\`\`\`

Now the summary screen, the badge, and the checkout all ask \`cart.total()\` — and agreeing keeps them right.

## Persistence choices

The cart has to survive a screen change and ideally an app restart. The honest options, from the Firestore-vs-SQLite article: keep it in memory plus on-device (SQLite) for a fast, private draft, or sync to the cloud (Firestore) if the cart should follow the account. For a student project, on-device is the right-first choice — simpler, offline-safe, and honest about scope.

${faqBlock([
  ["What is a line item in a shopping cart?",
   "A cart entry that pairs a product reference with a quantity, so repeated products collapse into one row with a count."],
  ["Where should cart totals be calculated?",
   "In exactly one place — a total() method on the cart — and referenced everywhere, so the badge, summary, and checkout always agree."],
  ["Should a cart save to SQLite or Firestore?",
   "SQLite (or memory + local persistence) is the sane default for a fast private draft; Firestore applies when the cart must sync across devices."],
])}

Related: ${relatedLinks(a)}`;
}

function materialDesign(a: ArticleMeta): string {
  return `# ${a.title}

The difference between "an app that works" and "an app that feels finished" is usually design consistency — and Material Design is a shortcut to exactly that. It's not a theme to install; it's a set of design decisions already made well, so student apps can look professional without a designer.

## Table of contents

- What Material Design gives you
- The principles that matter
- Components that do the work
- Why consistency reads as quality
- Frequently asked questions

## What Material Design gives you

Material is Google's design system for Android: guidelines, components, typography, and color treatment that have been refined across thousands of apps. Using it means inheriting those decisions instead of improvising every spacing and shadow yourself. ${EXTERNAL.material} is the canonical source.

## The principles that matter

- **Elevation** — surfaces sit at different heights via subtle shadows, making hierarchy *visible*.
- **Consistent spacing** — an 8dp grid rhythm quietly orders every screen.
- **A limited color role set** — primary, secondary, surface, error — so color stays purposeful.
- **Motion with meaning** — transitions communicate where you are, not just decoration.

## Components that do the work

You don't design most of the common pieces — you use them: app bars, bottom navigation, cards, buttons, text fields, and dialogs. Each comes with correct padding, states, and accessibility behavior already handled. Custom work is the exception, reserved for what actually makes your app unique.

## Why consistency reads as quality

Users can't articulate "the spacing uses an 8dp grid," but they feel the result as polish. An app with two button styles fights itself; an app on Material feels composed. For a student portfolio — where first impressions decide whether anyone looks past "student project" — that perceived finish is exactly the point.

${faqBlock([
  ["What is Material Design in Android?",
   "Google's design system providing guidelines and components — spacing, elevation, color roles, motion — so apps look consistent and polished."],
  ["Do I need a designer to make my app look good?",
   "No — using Material components and its spacing/color rules gives a professional baseline, leaving only your unique screens to design."],
  ["Why does consistency make an app feel finished?",
   "Users experience repeated, predictable spacing, color, and motion as polish — even without being able to name the system behind it."],
])}

Related: ${relatedLinks(a)}`;
}

/* ================================================================== */
/* Software development extras                                         */
/* ================================================================== */

function gitCommands(a: ArticleMeta): string {
  return `# ${a.title}

Most Git cheat sheets list forty commands and scare beginners off. The honest truth: seven commands carry 95% of daily work, and everything else is an occasional tool you can look up when the moment comes. Here are the seven, in the order you'll actually use them.

## Table of contents

- The seven, at a glance
- The daily workflow
- Undo and recover
- Branching without fear
- Frequently asked questions

## The seven, at a glance

\`git init\` · \`git status\` · \`git add\` · \`git commit\` · \`git push\` · \`git pull\` · \`git branch/checkout\`

That's it. Initialize, inspect, stage, snapshot, publish, update, and branch. Every other command either composes these or handles a rare disaster.

## The daily workflow

\`\`\`bash
git status              # what changed?
git add .               # stage the changes
git commit -m "..."     # snapshot with a message
git push                # publish to the remote
\`\`\`

Four commands, a few times a day. \`status\` keeps you oriented; a meaningful commit message keeps your history usable. The discipline of small, named commits is worth more than any advanced command.

## Undo and recover

The two safety commands worth knowing cold:

\`\`\`bash
git log --oneline       # the history, one line per commit
git restore <file>      # discard a file's unstaged changes
\`\`\`

And the reason Git exists: a committed snapshot can always be returned to. That guarantee is what turns "experiment freely" from courage into policy.

## Branching without fear

\`\`\`bash
git branch feature-x    # make a branch
git checkout feature-x  # switch to it
\`\`\`

Branches let you work on something without disturbing the working version. You don't need branch strategy day one — just the habit that "trying something new" means "on a branch."

${EXTERNAL.gitDocs} is the complete reference when any of this needs its fine print.

${faqBlock([
  ["What is the difference between git add and git commit?",
   "`git add` stages changes (marks them for the snapshot); `git commit` records the staged changes as a permanent, named snapshot."],
  ["How often should I commit?",
   "After each working change or feature, with a meaningful message — small, frequent commits are far more useful than big rare ones."],
  ["What is a branch in Git?",
   "A parallel line of development — a way to work on changes without disturbing the main, working version."],
])}

Related: ${relatedLinks(a)}`;
}

function gitVsGithub(a: ArticleMeta): string {
  return `# ${a.title}

The confusion is permanent enough to deserve naming: Git and GitHub are different things, and conflating them makes learning either harder. Two minutes of clarity here prevents months of vague wrongness later.

## Table of contents

- Git: the tool
- GitHub: the place
- The relationship
- Do you need both?
- Frequently asked questions

## Git: the tool

Git is a version-control program that runs on your computer. It watches a folder, records snapshots of your files as you \`commit\`, and lets you travel between those snapshots. Git works entirely offline — no account, no internet, no website. The commit history lives in a hidden \`.git\` folder next to your code.

## GitHub: the place

GitHub is a website that *hosts* Git repositories: a place to store your project online, share it, and collaborate through pull requests and issues. It's one of several such hosts (GitLab and Bitbucket exist too), just the most popular. GitHub the company did not create Git — Linus Torvalds did.

## The relationship

Git produces the history; GitHub publishes it. You can use Git happily forever without GitHub. And GitHub adds a layer — pull requests, issues, actions — that's built *on top of* the local histories Git maintains. When you \`push\`, you're sending your local Git history to GitHub's copy of the repository.

## Do you need both?

For your own learning: Git, absolutely — it's your undo button and your diary. GitHub, effectively yes for a student — it's how your work becomes visible and shareable, the difference between a folder on your laptop and a portfolio the world can see.

\`\`\`bash
git init            # Git starts tracking (locally)
git push origin main  # ...and now GitHub hosts it
\`\`\`

${EXTERNAL.gitDocs} and ${EXTERNAL.githubDocs} are the two authorities, one per layer.

${faqBlock([
  ["Are Git and GitHub the same thing?",
   "No. Git is the local version-control tool; GitHub is a website that hosts Git repositories and adds collaboration features."],
  ["Can I use Git without GitHub?",
   "Yes — Git works fully offline and locally; GitHub is an optional hosting and collaboration layer."],
  ["What does git push actually do?",
   "It uploads your local commit history to a remote repository (such as one on GitHub), syncing the two."],
])}

Related: ${relatedLinks(a)}`;
}

/* ================================================================== */
/* Router                                                              */
/* ================================================================== */

const WRITERS: Record<string, (a: ArticleMeta) => string> = {
  "python-learning-roadmap": pythonRoadmap,
  "python-functions-guide": pythonFunctions,
  "python-oop-concepts": pythonOop,
  "python-file-handling": pythonFileHandling,
  "python-data-structures": pythonDataStructures,
  "python-error-handling": pythonErrors,
  "python-standard-library": pythonStdlib,
  "python-virtual-environments": pythonVenv,
  "python-vs-java": pythonVsJava,
  "python-list-comprehensions": pythonComprehensions,
  "python-dictionaries-explained": pythonDicts,
  "library-management-system-python": libraryProject,
  "student-management-system-python": studentProject,
  "bank-management-system-python": bankProject,
  "sneakerstore-ecommerce-app": sneakerstoreProject,
  "python-projects-beginners": pythonProjectsIdeas,
  "console-app-design": consoleDesign,
  "python-project-structure": pythonStructure,
  "readme-that-works": readmeGuide,
  "what-is-artificial-intelligence": whatIsAi,
  "machine-learning-basics": mlBasics,
  "supervised-vs-unsupervised": supervisedUnsupervised,
  "what-is-a-dataset": whatIsDataset,
  "linear-regression-explained": linearRegression,
  "free-ml-learning-path": mlRoadmap,
  "python-for-machine-learning": pythonForMl,
  "pandas-first-steps": pandasFirstSteps,
  "ai-ml-mistakes-beginners": mlMistakes,
  "ai-project-ideas-students": mlProjectIdeas,
  "thinking-before-coding": thinkingBeforeCoding,
  "break-down-problems": breakDownProblems,
  "debugging-strategies": debuggingStrategies,
  "programming-logic": programmingLogic,
  "beginner-mistakes-python": beginnerMistakes,
  "tutorial-to-project": tutorialHell,
  "coding-challenges-benefits": codingChallenges,
  "learn-programming-as-student": learnAsStudent,
  "first-programming-language": firstLanguage,
  "building-projects-while-studying": projectsWhileStudying,
  "github-for-students": githubStudents,
  "preparing-for-internships": internshipsPrep,
  "developer-portfolio-guide": developerPortfolio,
  "computer-science-vs-software-engineering": csVsSoftwareEng,
  "android-app-architecture-beginners": androidArchitecture,
  "java-android-development": javaAndroid,
  "firebase-auth-android": firebaseAuth,
  "cloud-firestore-basics": firestoreVsSqlite,
  "shopping-cart-logic-android": shoppingCartLogic,
  "material-design-android": materialDesign,
  "git-commands-you-need": gitCommands,
  "git-vs-github": gitVsGithub,
};

export function getArticleContent(slugName: string): string | null {
  const article = articlesBySlug[slugName];
  if (!article) return null;
  const writer = WRITERS[slugName];
  if (!writer) return null;
  let md = writer(article);

  const extra = additions[slugName];
  if (extra) {
    // splice before the FAQ block, otherwise before the closing section
    const faqIdx = md.indexOf("## Frequently asked questions");
    const keepIdx = md.indexOf("## Keep building");
    const insertAt =
      faqIdx !== -1 ? faqIdx : keepIdx !== -1 ? keepIdx : md.length;
    md = md.slice(0, insertAt) + "\n" + extra + "\n" + md.slice(insertAt);
  }
  return md;
}

export function hasArticleContent(slugName: string): boolean {
  return Boolean(articlesBySlug[slugName]);
}

export { allArticles };
export const SITE_NAME = SITE.name;
