export const aimlAdditions: Record<string, string> = {
  "what-is-artificial-intelligence": `## The umbrella in one diagram

Think of AI as a nesting set of boxes. The outermost box is "artificial intelligence" — the whole goal of software that behaves intelligently. Inside it sits "machine learning" — the currently dominant way to get there, learning from data. Inside that sits "deep learning" — learning with many-layered networks that power modern image and language models. Each box builds on the one around it; not every AI is machine learning, but nearly every headline is. The nesting matters because it tells you where to start: beginner-friendly material lives in the middle box, not the innermost one.

## Symbolic AI — the other branch

Before machine learning dominated, AI meant something else: *symbolic* systems, where engineers wrote explicit rules and knowledge by hand — if-then chains, logical inference, search over possibilities. A rules-based expert system for medical symptoms is AI under our definition; it just doesn't learn from data. Chess engines blend both: search over moves plus evaluation, with modern versions adding learned components. This branch is why the "systems that follow fixed rules aren't AI" intuition is wrong — they absolutely can be, and they still run much of the world's software quietly in the background.

## How to apply the definition

The definition does practical work when you meet a new claim. For any "AI-powered" thing, ask three questions: What task is it performing? Where does its ability come from — rules, data, or search? And does it adapt? That three-question filter separates real systems from the marketing ones, and it's the single most useful habit this article can leave you with. When you can classify a technology this way, "AI" stops being a mystery and becomes a small set of known mechanisms — which is, honestly, most of what understanding the field means.
## Capability you can see today

To make the definition concrete, look at the software you already use. A spam filter classifies messages — pattern recognition learned from millions of labeled examples. A maps app predicts travel time — regression over historical traffic, constantly refreshed by new data. An autocomplete suggests the next phrase — a language model trained on enormous text, adapting to context. None of it is general intelligence; all of it is algorithmic pattern-finding of the exact kind the definition describes. The awe, and the disbelief, both come from the same source: humble mechanics, run at a scale that feels like judgment. Knowing the mechanics doesn't make the results less real — it makes them *legible*, which is the whole point of studying the field instead of just repeating its headlines.`,

  "machine-learning-basics": `## A concrete walkthrough of the loop

Make the loop tangible with the smallest real example: predicting house prices from square footage. Start with a random guess for the slope and intercept; that's the model. Feed it the ninety houses whose prices you know — the training data. For each, compute the predicted price, measure the error against the real price, and nudge the slope and intercept slightly to shrink that average error. One pass over the data, then another, then ten thousand, the line pivoting a fraction each time. When the error stops shrinking meaningfully, the line is "trained." The remarkable part isn't any single step — it's that repeating a boring correction millions of times reliably produces something that looks intelligent.

## Where the "learning" actually lives

The learning isn't in the code — the code is the same loop every time. It lives in the *weights*, the numbers the loop adjusts. Before training, weights are random guesses; after training, they encode the pattern. That's why a trained model can be saved, copied, and run anywhere: it's just numbers plus the tiny loop that uses them. This also explains the most common beginner confusion — "I downloaded the model, why is it learning wrong on my data?" It isn't learning at all anymore. Training and inference (using the model) are two different acts, and only the first one changes anything. Losing that distinction is how most myths about AI get going.

## Why a model can be simultaneously brilliant and useless

A model trained on one kind of data has no idea anything else exists. The same model that nails house prices is useless at spam — not because it's flawed, but because the task runs outside what it ever saw. This is "narrow" intelligence, and it's neither a weakness nor a scandal; it's the defining property of everything we currently have. When a beginner internalizes this — capability is *local* to the training data — an entire genre of overhyped claims stops being credible at first glance. It's one of the most valuable insights in the whole field, and you can hold it without a single formula.`,

  "supervised-vs-unsupervised": `## A real pair of examples side by side

Housing prices, supervised: you hold rows of sold houses — each with a square footage, bedrooms, and the final price. The price is the label; the model learns to predict it. Email clustering, unsupervised: you hold a pile of messages with no labels at all; the algorithm groups them by similarity, and *you* discover the groups and name them ("looks like notifications", "looks like receipts"). Same raw material, opposite questions: the first asks "given X, what's the answer Y?"; the second asks "what structure is hiding in here?" The algorithm families are different, the data preparation is different, and the questions you can answer are different — which is why this fork is genuinely the first decision in any ML project.

## When labels are expensive

The fork also explains real-world budget. Labels usually come from humans, and humans are the expensive part. A supervised vision model might need ten thousand hand-labeled images before it's useful; that's weeks of annotator time. Unsupervised (or the cheaper self-supervised approaches) works with data that's already everywhere — all the unlabeled images on a hard drive. This is *the* economic reason the field has moved toward approaches that squeeze learning from unlabeled or automatically-labeled data. As a student you won't feel the cost directly, but every dataset choice you make sits on this same see-saw: the answers you want against the labeling you can afford. Noticing it early is what "thinking like a practitioner" means.

## A decision table to keep

| Do I have labels for the answer? | What am I predicting? | Family |
|---|---|---|
| Yes | A category | Supervised — classification |
| Yes | A number | Supervised — regression |
| No | Structure/groups | Unsupervised — clustering |
| No | I can invent labels | Self-supervised |

A single glance at this table routes most "where do I even start" moments in a beginner's first ML project. Keep it close; it's the map, not the territory, but it's the right map for the first hundred miles.
## The hybrid and the honest middle

The real world won't always hand you a clean fork. A semi-supervised setup labels a little and lets the rest be guessed; recommendation engines weld both families together — clustering "similar users" (unsupervised) then predicting what a given user wants (supervised). You don't need to *implement* these hybrids; you need to know they exist, so that when your data is 90% unlabeled with a thin slice labeled, the answer isn't despair. There's a named, standard approach for that exact situation, and recognizing it is most of preparation. The taxonomy is a map for navigating, not a filing cabinet that every real dataset agrees to respect.

## Beginner homework that cements it

A ten-minute exercise that locks the fork in: take five ML products you use (spam filter, music recommendations, facial unlock, route prediction, suggestions feed) and classify each as supervised, unsupervised, or a blend — by asking only "does it predict a known answer from labeled examples, or find structure in unlabeled ones?" The act of arguing each case out loud does more than re-reading any definition, because it forces the distinction to make predictions. Get through the five without looking anything up and you've genuinely learned the concept, not just recognized its words.`,

  "what-is-a-dataset": `## The anatomy of a clean dataset

A clean dataset earns that adjective through a checklist: each row is one *complete* example; each column is one *consistent* type (never numbers and text mixed); categorical values use one spelling ("LHR" or "Lahore", not both); missing values are either filled deliberately or flagged; and there's a single row key that identifies each record. Real datasets violated all five on day one of my own experiments. Cleaning isn't glamorous, but it's where the skill is — a model trained on a pristine dataset is a routine achievement; one trained on a messy but *honestly cleaned* dataset is actual work. That's the distinction that separates data work from data theater.

## Splitting — train, validate, test

One structural idea matters before any model runs: the split. You keep three separate piles — training (the model learns here), validation (you tune here), and test (you check honestly, only at the end). The point of the last pile is *subterfuge against yourself*: a model's only honest score comes from data it never saw during training or tuning. Beginners skip the split, "feel" the model is great, and are then surprised when it collapses on new data — a failure with a name: overfitting. The split is cheap insurance against exactly that delusion, and it belongs in every project from the first line.

## Where real datasets come from, continued

For an honest student project, three sources cover everything: open datasets with real licenses (government statistics portals, public research archives), your own exported data (screen time, study logs — leak-free and personally meaningful), and openly-licensed benchmark sets. The rule that binds them: check the license before you train, and write down where the data came from. A dataset's provenance is part of the work, not an appendix — being able to say "this is Lahore's open air-quality data from the government portal" is exactly the sentence an interviewer wants to hear after you show the model.
## The dataset as a skill, not a download

Here's the reframe that matters most for a student: treating "the dataset" as a thing you download is already wrong. The dataset is a *process* — find it, verify its provenance, load it, inspect it, clean it, split it, and only then model it. The first half of that process is where the real skill lives, and it's the half tutorials fast-forward past. Two people can start with the identical CSV: one checks the distributions, catches a mangled date column, and normalizes the categories; the other dumps it straight into a model and reports numbers. Their models will be identical; their *results* will diverge instantly. That gap is what "data-oriented thinking" names, and it's the most durable, transferable skill in the entire ML stack.`,

  "linear-regression-explained": `## The cost function, made human

"Closest to the points" means something precise, and naming it removes the mystique. For every data point, compute how far the line's prediction is from the truth, vertically; square that distance (so directions don't cancel); average the results. That average is the **cost** (also called the loss or, in the squared case, the mean squared error). A perfect line has cost near zero; a terrible one, enormous. Training a linear regression is nothing more than a search — adjust slope and intercept until the cost is as low as you can get. The word "gradient" in gradient descent is just the answer to "which way, and how much, lowers the cost fastest?" — the same idea as walking downhill in fog by feeling which direction the ground slopes.

## Multiple variables and the lie that helps

One input = one line; many inputs = the same idea in more dimensions, which you can no longer draw. Square footage, bedrooms, age, neighborhood — the model learns a weight for each and sums them. A weight the model learns also tells you something: a large weight means "this feature moves the prediction a lot," holding the rest fixed. That interpretability is why linear regression survives in the age of neural networks — it's the model you can *explain in a sentence*, which makes it the right first model and often the right *final* model for problems where the truth really is roughly linear. Interpretability isn't a consolation prize; it's a feature.

## When the line lies

The honest caveat that completes the lesson: linear regression assumes the pattern is approximately straight, and the world isn't always polite. Outliers yank the line; nonlinear relationships (price rising then plateauing) fit poorly; and correlated features confuse the weights. Spotting these is as important as running the fit — a regression that ignores its assumptions produces confident nonsense. The mature move is to always plot the residuals (the leftover errors) and look. A healthy model leaves random-looking leftovers; a failing one leaves patterns, which is the data telling you the line was the wrong shape. Listening to that is what separates running code from doing data science.
## From concept to a first run

The full first project, in miniature: load a housing dataset, split it into train and test, fit the regression on the train part only, then score it on the unseen test part. The score you report comes from the test split — the part the model never touched. That one discipline, more than any hyperparameter, separates honest results from wishful ones. Then plot: predictions against truth, residuals against input. A healthy model scatters randomly around the line; a sick one leaves a curved smear, telling you the relationship isn't straight and a linear model was the wrong shape. Reading that plot is the difference between "I ran linear regression" and "I know what my model does" — and the second version is the one worth putting in a portfolio.`,

  "free-ml-learning-path": `## The resource stack that actually works

What a student budget can afford, ranked by usefulness-per-hour: the official docs and tutorials first (scikit-learn's tour, pandas' 10-minutes), because they're correct and free; then one strong structured course for the big picture; then a steady diet of *doing* — small datasets, small models, written up. The order matters: docs while building, a course to orient, projects to cement. Anything that asks you to pay for a "complete AI career in six weeks" is selling a feeling, not a skill. The knowledge is genuinely, completely free — what's scarce is your own discipline to work through it, which no subscription provides.

## The math, dosed not dreaded

The sequence that keeps math from derailing you: derivatives (why "gradient" means downhill), then the matrix idea (data is a big rectangle of numbers), then probability (uncertainty, in language). Each one you can learn in the shadow of an algorithm that uses it, rather than as a curriculum. The people who burn out on ML usually tried to "finish the math first" — a goal with no endpoint and no momentum. Learn just enough derivative to read gradient descent, then go train the model; the rest of the math will introduce itself, repeatedly, as you need it. Just-in-time beats just-in-case, in math more than anywhere.

## What "portfolio-ready" honestly means

For the direction I'm building toward, portfolio-ready isn't a production system — it's three small end-to-end pieces with the same skeleton: a stated question, a real dataset, the clean-train-evaluate loop, and an honest writeup of what the model does and doesn't do. Presented that way, they read as "this person understands the loop and doesn't oversell" — which is exactly the signal a student should want to send. Grandiose project titles with hidden errors send the opposite signal. Small, true, and explained beats large, fake, and vague every time, and it's the standard this site holds its own projects to.
## The rhythm that prevents burnout

Progress in ML is less a sprint than a rhythm: one small complete loop per week, every week. Load, clean, fit, evaluate, write one paragraph — even if the model is modest and the dataset tiny. The rhythm protects against the two failure modes at once: the weeks-long binge that ends in exhaustion, and the zero-output month that ends in drift. It also compounds — forty small loops is a genuinely strong foundation, while forty hours of scattered watching is mostly gone by spring. Pick a fixed slot, keep the project scope laughably small, and let the repetition do the work that motivation alone never sustains.`,

  "python-for-machine-learning": `## The performance story, without the myth

The one objection — "isn't Python slow?" — deserves the real answer. Python the *language* is slow; the heavy work isn't in Python. Libraries like NumPy hand the actual computation to optimized C and Fortran routines while Python stays the readable layer that orchestrates them. A dot product over a million numbers spends its time in compiled code, not in the loop you wrote. So you get human-friendly syntax *and* near-compiled performance for the number crunching — which is precisely the trade the field needed. When someone tells you Python is too slow for ML, they're usually confusing "the words are Python" with "the work is Python." Most of the work never touches the interpreter.

## The learning stack, in dependency order

The order genuinely matters and it's not optional:

1. **NumPy** — the n-dimensional array; everything below relies on it.
2. **pandas** — DataFrames on top of arrays, for real tables.
3. **matplotlib** — seeing the data, which is half of understanding it.
4. **scikit-learn** — the classic algorithms, built on NumPy and SciPy.
5. **PyTorch / TensorFlow** — deep learning, only when you need it.

Skip to step five and you'll meet an error whose words you can't parse, because it's about an array you've never met. Climb in order and each rung is a small leap. This stack — plus honest Git habits — is the entire tool shape of modern machine learning, and there's no shortcut that doesn't eventually force you back down to foundation.
## What you don't need (yet)

Part of learning a stack is learning what to defer. You don't need Docker, cloud GPUs, or a big-data pipeline for your first hundred models. You don't need to master C++ underneath the libraries. And you don't need the newest framework the moment it trends. Those all arrive later, at the point where a specific project actually demands them — and by then you'll recognize the demand. Chasing infrastructure before fundamentals is another costume of the "optimize the feeling of progress" mistake. A laptop, Python, and the four libraries are the complete toolset for everything a beginner should attempt; the impressive tools are for problems that are already impressive, which beginner problems, mercifully, are not.`,

  "pandas-first-steps": `## A tiny but real mini-project

Proof you've absorbed the basics: take a CSV of anything — grocery receipts, exercise logs, my own study hours — and answer three questions with pandas. Which category is largest by total? What's the average per row? What does the trend look like grouped by week? That last one needs \`groupby\` plus a date, which is the moment pandas clicks from "syntax" to "tool." Write it as a script, not a notebook of cells, and add the one line that prints each answer. Thirty minutes, real data, real answers — that's the entire pitch of this article, and it's a better use of an evening than three more tutorial chapters.

## The missing-data decisions

Real tables have gaps, and pretending they don't is how analyses quietly lie. You have three honest moves: drop rows whose gaps make them unusable (\`dropna\`); fill gaps with a sensible value (\`fillna\`) — the mean, the most common category, or zero when zero is honest; or keep the gap and let the analysis acknowledge it. There's no universal right answer; the right answer is *a decision, made on purpose, written down.* A column of ages with blanks filled by the mean is a claim about your data; fill it and keep silent about it and the claim disappears into the numbers. The habit that matters isn't the command — it's making the decision explicit.

## Diving deeper, when you're ready

Once a first script runs, the next two techniques are the ones that actually level you up: **merging** (joining two tables on a common column, the relational-database idea you'll meet constantly) and **pivot/aggregation** (reshaping a long table of events into a per-group summary). Both live in the pandas user guide with precise examples, and both are the moment the tool stops being a spreadsheet and starts being a data *language*. Don't rush them — meet them the first time a real question actually needs them, which is sooner than you think once real datasets show up.
## The common early gotchas

Three errors arrive reliably in every first week, so naming them saves an hour each. First, *a boolean filter needs parentheses* — \`df[(df.a > 1) & (df.b < 2)]\`, not \`df[df.a > 1 & df.b < 2]\`, because \`&\` binds differently without them. Second, *SettingWithCopyWarning* — a sign you're modifying a view of the data instead of the frame; assign with \`.loc\` to be explicit about what you're changing. Third, *dtype surprises* — a column full of ID numbers loads as integers until one missing value forces it to floats, and suddenly your IDs print as \`1004.0\`. None of these breaks permanently; each of them costs ten confused minutes the first time and zero the second. Better to meet them here, written down, than in a stack trace at midnight.`,

  "ai-ml-mistakes-beginners": `## The meta-mistake underneath all six

Strip the six mistakes down and they're one mistake wearing different clothes: **optimizing the feeling of progress instead of progress.** A new course feels like a step; a model that won't converge feels like failure. But the feeling and the fact point opposite ways — the struggle contains the growth, the comfort contains the stall. Naming the meta-mistake is the actual cure, because it changes what you measure: not courses completed or hours watched, but models that run, datasets you cleaned, writeups you published. When the metric is output, the six traps close themselves, one by one.

## What a healthy month looks like

A concrete picture beats another warning. A healthy learning month: one small dataset cleaned and explored; one model — regression or classifier — trained end to end on it; one honest writeup (even a private README) of what worked; and three or four tiny Git commits along the way. That's the whole month's "output," and it's more than most students produce in a semester of résumé-building. Notice what's absent: no new course certificate, no framework swap, no "I'll finish the math first" stall. Volume and velocity of *real output* — that's the only metric that has ever moved anyone forward in this field.

## Honesty as a strategy, not a handicap

The final trap — inflating your level — deserves one more push, because it's the one with career teeth. "Building toward AI/ML" is a position that survives any interview; "AI/ML expert" collapses at the first technical question, and takes your credibility with it. The students who get trusted with real ML work aren't the ones who claim the most; they're the ones whose claims you can verify in their commit history. Honesty about your level isn't humility for its own sake — it's the optimal strategy when the evidence is public and the follow-up questions are inevitable.
## The regression you can run on yourself

A closing exercise that turns the whole article into a habit: keep a tiny log — a text file with one line per day — of what you *built* that day, even just "plotted residuals, found curvature." Review it every Sunday. The log is your own error metric, the thing that makes the drift toward comfort visible the week it starts, not the semester after. When the log shows courses but no models, that's the meta-mistake live on the page. When it shows models but no writeups, the honesty trap is next. Treat yourself with the same cold eye you'll one day turn on a model's training loss — the loop is identical, and so is the fix.`,

  "ai-project-ideas-students": `## The project design principles

Three rules separate a project that teaches from one that only looks like work. First, **scoped to finish**: if the whole thing can't complete inside two weekends, it's not a starter project, it's a second job. Second, **a real, obtainable dataset**: a project without data is an essay; a project with data you can actually open today is a *project*. Third, **explainable end to end**: you can describe, in plain sentences, what the model does, what the numbers mean, and what you'd improve. If you can't explain it, you didn't learn it — the project was decoration. Weigh every idea against those three rules and the good ones self-select in minutes, not weeks.

## Writing up the project for other humans

The writeup is where the learning lands and where a portfolio earns its keep. Structure: one paragraph on the question; one on the data and where it's from; a short section on cleaning; the model and, crucially, *what the evaluation actually showed*; then an honest paragraph on limits. The best student writeups I've seen are clearer than half of industry ones, because they don't hide behind jargon — they say "the model is weak on X because the data lacks Y." Post it on GitHub with the code and a README. That paired artifact — code plus narrative — is what people actually mean by "a strong ML project," far more than the accuracy score.

## From ideas to my own direction

These projects are the on-ramp I'm currently walking myself. The management systems gave me Python and persistence; the next step on the path is exactly the loop these projects train — clean data, fit a small model, evaluate, explain. Small regression first, then something with my own data, then deeper. Nothing here is claimed as finished expertise; it's the honest map of the road I'm on. If you're on a parallel one, the shared truth is the same: ideas don't build skills — finished projects do, one honest loop at a time.
## A grading rubric you can borrow

Evaluate any candidate idea with three yes/no questions and be ruthless: (1) Can I obtain the data today, legally, with a known source? (2) Can I explain the model's output to a non-programmer friend in two sentences? (3) Will the project still be finished and explained when I only have the two weekends I actually have? Three yeses and the idea is a project; any no and it's a fantasy in a good suit. It's a harsh filter, and it should be — the ideas that survive it are the only kind worth a student's scarce hours. Save the ambitious ones in a list; they'll survive contact with the filter some other semester, when the weekends get longer.`,
};
