/**
 * Additional in-depth sections per article, spliced in before the FAQ/outro
 * so every piece clears ~900 words and a genuine 4+ minute read.
 */

export const pythonAdditions: Record<string, string> = {
  "python-learning-roadmap": `## How to test each phase

Each phase has an exit test — but no external grader. The test is self-inspection: can you build the phase's exit project *without looking anything up apart from documentation*? Looking up syntax is fine and normal; looking up the idea is the signal you're not done with the phase yet.

## Tools to run alongside

Keep three things open while you work: your editor, a terminal with Python running, and the official docs. Resist the urge to install heavy tools early — an IDE's autocomplete will happily write code your understanding can't back up. Plain editor plus REPL keeps the thinking in your head where it belongs.

## What "done" means here

Done isn't finishing the last phase. It's reaching the point where a new Python problem stops feeling like a crisis and starts feeling like a sequence. You'll know you're there when the question shifts from "how do I write this?" to "which structure is cleanest?" That shift — not a certificate — is the actual destination of this roadmap.

## A note to past-me

If I could send one instruction back to the version of me that started this: build smaller, finish more, and commit every working piece before bed. The landmarks on this path were never the concepts. They were the finished programs — the calculator, then the file-backed manager, then the project I could explain end to end. Everything else on this page is scaffolding around that fact.`,

  "python-functions-guide": `## Pure functions and why they're easier

A function that only reads its inputs and returns a result — and touches nothing outside — is a "pure" function. These are dramatically easier to reason about, test, and reuse, because the same inputs always give the same output. Not every function can be pure (printing, reading files), but pushing as much logic as possible into pure helpers is one of the highest-leverage habits in Python. When a bug appears, you can test the pure part in isolation, without setting up files or mocks.

## Writing functions that test themselves

Docstrings cost three lines and pay rent every time you return:

\`\`\`python
def total_with_tax(price, rate=0.17):
    """Return price including tax."""
    return price * (1 + rate)
\`\`\`

The docstring states intent; a quick assertion states truth:

\`\`\`python
assert total_with_tax(100) == 117.0
\`\`\`

That one line, even written informally at the bottom of a script, catches regressions the moment you touch the function later. For real projects these move into a tests file, but the habit starts here — in the same file, the same day.

## A practice set that forces the habit

Convert these everyday operations into functions, one by one, over a week: calculate a tip; check whether a year is a leap year; format a name as "last, first"; convert temperature scales; and validate that an email contains exactly one @ and a dot after it. Each is small enough to finish in one sitting, and each forces you to decide — parameters or no parameters, return or print, helper or inline. The goal isn't the five functions. It's reaching the point where writing \`def\` is your reflex, not your decision.

## Functions grow into architecture

When a single function no longer fits on one screen, the fix isn't a bigger function — it's two functions. Extract a helper, give it a real name, and let the original call it. Repeat this gently for a year and you've arrived, without ever "studying architecture," at programs that organize themselves: short functions, one job each, named honestly. That's most of what experienced developers mean by clean code, and it starts with the humble \`def\`.`,

  "python-oop-concepts": `## Class vs instance variables

One subtlety trips more people than inheritance: the difference between class attributes and instance attributes.

\`\`\`python
class Student:
    school = "Superior University"   # class attribute — shared

    def __init__(self, name):
        self.name = name             # instance attribute — per object
\`\`\`

\`school\` belongs to the class and is identical for every student. \`name\` belongs to each student individually. The bug everyone hits: putting something that should differ per instance (like a list) on the class, then noticing every object "shares" it. If it varies per object, it belongs in \`__init__\` on \`self\`.

## Dunder methods, the quiet engine

Methods like \`__init__\`, \`__str__\`, and \`__eq__\` are "dunder" (double-underscore) methods — hooks Python itself calls. Define \`__str__\` and \`print(book)\` becomes readable; define \`__eq__\` and comparing two records does the right thing.

\`\`\`python
class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

    def __str__(self):
        return f"{self.title} by {self.author}"
\`\`\`

They're not exotic — they're how your objects participate politely in the language. Knowing a few (\`__init__\`, \`__str__\`, \`__eq__\`, \`__len__\`) makes your classes feel native.

## Bringing it back to a real program

A Book class, an Account class, a Student class — the OOP chapter of a degree reads like a list of nouns. The part that matters is how they behave together in a system: a Library holds Books; an Account holds a balance and knows the rules for changing it. When you can read a problem and see which nouns deserve classes, which verbs deserve methods, and which relationships deserve composition, you've internalized OOP rather than just typed it. The fastest way there is one real class-based program, built slowly, then read back with a critical eye. That's what the management systems were for.

## Composition before inheritance

The honest ranking for structuring code: plain functions first, then classes that contain other objects (composition), and inheritance last — only when several classes genuinely share behavior. Inheritance is the loudest OOP feature and the easiest to overuse. Most "is-a" modeling people reach for is better served by a "has-a" relationship that's easier to change later.`,

  "python-file-handling": `## Text vs binary, and encodings

Everything in a file is ultimately bytes; "text mode" just decodes them through an encoding. The default is UTF-8 on modern Python, and that's what you want almost always. When you see \`UnicodeDecodeError\`, the file probably isn't UTF-8 — pass the right \`encoding=\` to \`open()\`. Binary mode (\`"rb"\`, \`"wb"\`) is for things that aren't text: images, audio, serialized state. For a student working in text and CSV, text mode covers everything, but knowing the encoding knob exists saves an afternoon one day.

## Parsing files without loading everything

\`readlines()\` loads every line into memory at once. For the sizes a student project meets, that's fine. But the habit to build early is streaming: iterate the file directly, processing line by line.

\`\`\`python
with open("books.txt", "r") as f:
    for line in f:
        title, author = line.strip().split(",")
        process(title, author)
\`\`\`

Streaming keeps memory flat no matter how large the file grows — a thousand-row book list processes the same as a million-row one. The pattern stays identical as your data does.

## JSON vs CSV: the honest fork

When records are flat and tabular — title, author, status — CSV is the friendly default: it opens in a spreadsheet and the \`csv\` module handles the format. When records nest — a book that has a list of borrowers, or a student whose address is itself a small structure — JSON becomes the natural fit, because it preserves that nesting as data instead of flattening it into columns. The same book record, expressed both ways, makes the difference obvious: CSV flattens to one row of delimited fields, while JSON keeps the nested borrow *history* intact as an embedded list.

Both are "file handling" wearing different clothes — the real lesson is choosing the format that matches your data's shape rather than bending the data to a format you know. The Library Management System used one shape, the Student records another, and the choice was always about what the records *were*, not what was fashionable.

## CSV pitfalls worth naming in advance

- **Header rows** — skip them once, don't treat them as data.
- **Commas inside values** — the \`csv\` module handles quoting, hand-splitting on \`","\` does not.
- **Trailing empty lines** — \`strip()\` and skip blanks.
- **newline=""** on Windows — pass it to \`open()\` for csv files to avoid extra blank rows.

Use the \`csv\` module rather than \`split(",")\`. It exists precisely because the format's edge cases outnumber its rules.`,

  "python-data-structures": `## Choosing by what you ask, not what you store

Beginners usually ask "what am I storing?" and stop. The better question is "what will I ask this structure to do?" If your program looks things up by name, a list that stores the same records forces a scan every time; a dict answers instantly. The structure is a decision about *operations*, not just contents. A phone book keyed by name is a dictionary even though it's "a collection of names" — because the thing you do a thousand times is "look up this person."

## Combining structures: the real programs

No real program uses one structure alone. A library system is a *list* of book *dictionaries*, sometimes indexed by a dict of ID→book for fast lookup. The Records in real apps nest:

\`\`\`python
library = {
    "101": {"title": "Clean Code", "tags": {"classic", "refactoring"}},
    "202": {"title": "Automate", "tags": {"python", "projects"}},
}
\`\`\`

Learning the flat structures is chapter one; the skill is seeing them compose — dicts holding lists, lists of dicts, sets inside records. That composition is where flat knowledge becomes actual programming.

## Performance you can feel

This matters more than it sounds. A list lookup scans on average half the elements; a dict lookup is constant time. On ten records you can't feel the difference; on ten thousand a linear scan becomes a visible pause. The reason dictionaries dominate real programs isn't aesthetics — it's that the lookup cost stays flat while data grows. Building the dictionary-index habit now means your programs don't quietly get slower as soon as they get real.`,

  "python-error-handling": `## Reading a traceback like a map

A traceback is read bottom-up, and beginners read it top-down. The last line names the exception and describes it; the line above points at *your* code with a file and line number; everything above shows the call chain that got there. Three lines of attention locate 90% of bugs before any guessing starts. The full stack matters for library code, but for your own programs the tail is the treasure.

## Raising errors on purpose

Errors aren't only caught — they're also raised. When a function receives input it cannot meaningfully handle, raising an error is kinder than returning a sentinel like \`-1\` or \`None\` that silently poisons everything downstream.

\`\`\`python
def withdraw(self, amount):
    if amount <= 0:
        raise ValueError("Must withdraw a positive amount")
    if amount > self._balance:
        raise ValueError("Insufficient balance")
    self._balance -= amount
\`\`\`

Raise the *specific, honest* type (\`ValueError\`, \`TypeError\`), with a message a future developer will understand. The caller can then decide: catch and recover, or let it surface. That decision is the boundary where real program design happens.

## The verboten: bare except

\`\`\`python
# never
try:
    ...
except:
    pass
\`\`\`

A bare \`except\` catches everything, including \`KeyboardInterrupt\` and genuine bugs, and the \`pass\` erases the evidence. The program doesn't crash — it lies. If you must catch broadly while debugging, still log or print the exception, and narrow the \`except\` before you move on. Errors are the program talking to you; silencing them is how small problems become 2 a.m. mysteries.

## A realistic worked example

Tie it together with a function that reads a number and refuses to give up until it gets one:

\`\`\`python
def ask_number(prompt):
    while True:
        raw = input(prompt)
        try:
            return float(raw)
        except ValueError:
            print("That wasn't a number — try again.")
\`\`\`

This is the same validation loop a Student Management System uses before storing a CGPA. Notice the shape: the \`try\` wraps only the risky line (\`float(raw)\`), the \`except\` catches only the one failure that means "bad input," and the loop retries until the user cooperates. Crash-proof input handling is mostly this pattern, repeated politely forever. Once you've typed it twice, you'll reflexively reach for it every time a program meets a human.`,

  "python-standard-library": `## The deliberate-practice list

Rather than reading the whole index, schedule one small session per module: write a script that renames a folder of files with \`pathlib\`; convert a nested dict to JSON and back with \`json\`; compute "what day of the week was I born" with \`datetime\`; and tally word frequencies in a paragraph with \`Counter\`. Each session is thirty findable minutes, and each converts a module from "I've heard of it" to "I've used it." After four sessions you've crossed the threshold where the standard library stops being a mystery and becomes a reflex to check.

## The drawer is bigger than it looks

A final pass around the edges, because these are the ones nobody tells beginners about: \`statistics\` for mean/median without NumPy, \`secrets\` for genuinely random tokens (never \`random\` for anything security-adjacent), \`tempfile\` for safe scratch files, and \`ast\` for safely reading Python-looking structures. You won't need most of these this month. You'll be glad to know they exist the month you do. Skim the module index once; let the names become familiar furniture, not memorized facts.

## A habit: reach for stdlib first

Before installing a package, ask whether Python already ships the answer. Three questions: does it manipulate files and paths (os, pathlib, shutil)? Does it parse a common format (json, csv, xml)? Does it handle dates, random numbers, or collections (datetime, random, collections)? If the answer is yes, you have a zero-dependency, zero-risk solution. Every external package adds a moving part to your project — an upgrade that can break, a license to check, a size on disk. Standard library code keeps working, keeps being documented, and keeps your \`requirements.txt\` honest. The instinct isn't "never install." It's "check the drawer before buying."

## The modules that quietly upgrade your code

Beyond the marquee names, a few quieter modules punch above their weight:

- **\`functools\`** — \`lru_cache\` memoizes expensive functions with a decorator.
- **\`argparse\`** — turns a script into a proper CLI with \`--flags\` and help text.
- **\`itertools\`** — lazy iteration for combinations, cycling, and grouping.
- **\`re\`** — regular expressions, when \`split\` stops being enough.
- **\`collections\`** — the specialized containers: \`deque\`, \`Counter\`, \`defaultdict\`.

You don't need these day one — but knowing the names means that the moment \`split\` fumbles, you recall there's a tool named \`re\`. That recognition, more than memorization, is what the standard library actually gives you.`,

  "python-virtual-environments": `## What actually happens when you activate

Activation feels like magic, and it helps to know it isn't. Activating a venv simply prepends its \`bin\` (or \`Scripts\`) directory to your shell's \`PATH\`. From that moment, typing \`python\` finds the environment's interpreter first, and that interpreter looks for packages in the environment's \`site-packages\` before anywhere else. Deactivating (\`deactivate\`) just undoes the path change. There's no daemon, no virtualization layer — just a folder and a path. Understanding that demystifies every "where did my package go?" moment: you installed into a different environment than the one you're running, full stop.

## Reproducing a project for someone else

\`\`\`bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
\`\`\`

Three commands, and another machine (or future-you) has your exact environment. \`requirements.txt\` is the contract that makes this work — which is why it should be committed and kept accurate. Regenerate it with \`pip freeze > requirements.txt\` whenever dependencies change. A project whose environment can't be rebuilt in three commands isn't reproducible, and "works on my machine" is the sound it makes.

## A minimal project, end to end

\`\`\`bash
mkdir notes-app && cd notes-app
python -m venv .venv
source .venv/bin/activate
pip install requests
pip freeze > requirements.txt
\`\`\`

Five commands and the project is isolated, reproducible, and shareable. The order matters: environment first, then install inside it. A surprisingly common beginner error is installing *before* activating — the package lands in the global environment, the venv stays empty, and the project quietly depends on the wrong state. The prompt showing \`(.venv)\` is the tell that you're in the right place.

## Pip vs pipenv vs poetry vs uv

The ecosystem keeps inventing nicer tools, and the choice confuses beginners. The ranking that's honest: plain \`venv\` + \`pip\` is enough and is what all the others build on; \`uv\` is a fast modern alternative worth knowing about; \`poetry\` adds dependency resolution and packaging for larger projects. None of them change the underlying concept — isolated environments — so learn the concept first with the plain tools, and pick a fancier wrapper later, when a specific pain (speed, reproducible locks) actually appears. Tool-hopping before the concept lands is restarting the same lesson in different clothes.

## One environment per project, really

The rule that dissolves most confusion: *every project gets its own environment, always.* Not "when it's important" — always. The cost is one command and a few megabytes; the benefit is never, ever wondering whether a bug is your code or a version clash. Once the rule is unconditional, it also becomes unthinking — you create the venv with the project folder the way you pick up the keyboard before you type. That automatic-ness is the goal. The students who struggle with environments aren't missing a concept; they're missing the reflex.`,

  "python-vs-java": `## What transfers between them

Here's the reassurance that ends the debate: everything you learn in one transfers to the other, minus the syntax. A loop is a loop; a class is a class; a data structure is a data structure. The time you spend learning "programming" is never wasted when the language changes — only the spelling changes. People who've written real programs in two languages don't describe them as alien worlds. They describe them as the same building with different door keys.

## The runtime comparison on a real demo

Consider the same tiny task in both — reading numbers and summing them:

\`\`\`java
import java.util.Scanner;
public class Sum {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int total = 0;
        for (int i = 0; i < 5; i++) total += in.nextInt();
        System.out.println(total);
    }
}
\`\`\`

\`\`\`python
total = 0
for _ in range(5):
    total += int(input())
print(total)
\`\`\`

Same program: Java fronts the ceremony while Python hides it. The Java version's ceremony does real work — explicit types mean the compiler catches a mistake before you run. The Python version's brevity does real work too — you read the intent instantly. Choose by which trade you want today, not by which language is "right."

## A note on ecosystems and libraries

The other half of choosing is what each language lets you reach for. Python's data and ML libraries (NumPy, pandas, scikit-learn) are the reason it owns the AI/ML on-ramp. Java's ecosystem carries Android and a huge share of enterprise infrastructure. Students often choose a language for its syntax and stay for its libraries — worth weighing both on the same scale. My own split is the practical proof: Python where the data lives, Java where the Android app lives, no loyalty required.`,

  "python-list-comprehensions": `## Reading nested comprehensions without panic

A comprehension with two loops reads in the same order as the nested loops it replaces:

\`\`\`python
pairs = [(a, b) for a in range(3) for b in range(3)]
\`\`\`

The first \`for\` is the outer loop, the second is the inner — left to right, exactly like the indented version. Nested comprehensions above two levels are usually a cue to write a normal loop or a helper function instead. The tool is for clarity; when it stops being clear, that's the tool telling you to put it down.

## Practical applications of comprehensions

Beyond the textbook squares and evens, these are the real uses that show up constantly:

- **Filter a collection**: \`active = [u for u in users if u["active"]]\`
- **Extract one field**: \`names = [u["name"] for u in users]\`
- **Transform values**: \`deg = [(f - 32) * 5/9 for f in temps_f]\`
- **Build a lookup**: \`by_id = {u["id"]: u for u in users}\`

That last one — a comprehension that inverts a list into a dict — is the dictionary-index pattern from the data-structures article, expressed in one line. It's the most valuable single line in this entire page, and you'll type some version of it in nearly every real project.

## Comprehension vs map/filter

Python has functional cousins — \`map\` and \`filter\` — that do the same jobs. For simple cases the comprehension is usually the more readable choice, which is why the community has largely adopted it: \`[n*2 for n in nums]\` reads left-to-right like a sentence, whereas \`list(map(lambda n: n*2, nums))\` buries the operation inside a lambda. There are corners where \`map\` wins (a function you already have lying around), but as a default, comprehensions are the idiomatic modern Python. The choice is style, not performance — so pick the one whose shape matches your idea and don't lose sleep over it.

## A readability rule you can actually apply

The one-line test: if you can read the comprehension aloud as a single smooth sentence, it belongs in one line; if you find yourself backtracking with your finger, expand it into a loop. Readability rules are usually vague, but this one is checkable at the moment of writing. Here's the same transformation both ways — the comprehension first, then a deliberately over-stuffed one that should have stayed a loop:

\`\`\`python
# reads smoothly, keep it
visible = [u for u in users if u.active and u.age >= 18]

# this earned a loop
result = [x for y in groups for x in y.items if x.score > 90 and (x.tag or x.flag) and not x.hidden]
\`\`\`

The second one runs, but it fights the reader. When you catch yourself nesting conditions inside conditions inside comprehensions, that's the signal: stop compressing, start a loop. Mastery of the idiom includes knowing its expiration date.`,

  "python-dictionaries-explained": `## Ordered dictionaries and what that changes

Since Python 3.7, dictionaries remember insertion order. It's a small change with a quietly large effect: the order you add keys is the order you get them back when iterating. Practically, you can now rely on a dict to preserve sequence when you build it in a deliberate order — menu options, precedence lists, config sections. The guarantee isn't "sorted," which people sometimes expect and are surprised not to get; it's "insertion." If you need sorted keys, sort them yourself with \`sorted(d)\`.

## Dictionaries under the hood: hashing

Why are dict lookups so fast? Under the hood, each key is run through a hash function that produces a number, and that number says *where* in the table the value lives. A lookup computes the hash and goes straight to that slot — no scanning. That's why keys must be hashable (strings, numbers, tuples) and lists can't be keys: lists can change, which would change their hash, which would orphan their value. Grasping this one mechanism explains four behaviors at once: fast lookups, unique keys, unhashable list keys, and why a dict of ten and a dict of ten million cost the same single lookup.

## Real pattern: grouping records by a field

The recurring use case: you have rows and want them grouped by category.

\`\`\`python
from collections import defaultdict

by_program = defaultdict(list)
for s in students:
    by_program[s["program"]].append(s)
\`\`\`

\`defaultdict(list)\` means "give me a fresh list when I touch a missing key." Without it you'd write the if-not-present dance every time. Grouping, counting, indexing — dictionaries are the common thread running through all of them.

## A mistake everyone makes once

The classic dict bug: using a mutable default as the starting value. If you write a function whose parameter defaults to a list, that list is created *once* when the function is defined, then shared across every call that doesn't pass it:

\`\`\`python
# wrong: all callers share one list
def enroll(course, students=[]):
    students.append(course)
    return students
\`\`\`

Two unrelated calls will see each other's data. The fix is the \`None\` pattern:

\`\`\`python
def enroll(course, students=None):
    if students is None:
        students = []
    students.append(course)
    return students
\`\`\`

It's the same hidden-default trap as the one in the functions article, transmuted onto dicts — and it's the kind of bug that survives because everything *looks* right in a single test run. Dictionaries don't cause it; defaults do. Naming the trap makes it visible, which is the only way to stop walking into it.

## The dictionary skills to practice deliberately

A short checklist, because this is a structure worth drilling: look up with \`.get()\` instead of brackets; add a key only if missing (setdefault); iterate keys, values, and pairs fluently; nest a dict inside a dict and reach two levels deep without hesitation; and invert a list into a dict keyed by an ID. Five drills, each about fifteen minutes, and the structure stops being a thing you think about — which is exactly when it starts carrying real programs. In the management systems, the single step that made everything faster was the shift from "scan the list to find this record" to "ask the dict." That one move is the whole value of this article, compressed into a habit.`,
};
