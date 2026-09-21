export const softwareAdditions: Record<string, string> = {
  "git-commands-you-need": `## The mental model that makes Git click

Git stops being scary the moment you picture it as a camera, not a cloud. \`commit\` takes a photograph of your files that you can always scroll back to; \`add\` chooses which changes get *into* the next photo; \`status\` shows what the next photo would include; \`log\` is the album. Push and pull are just copying the album to and from a server. Everything else is editing the album. That single metaphor resolves most confusions before they happen — "where did my change go" is usually "it was never staged," and "how do I get back" is "find the photo." The metaphors aren't the whole truth, but they're the truth that carries a beginner for a year, by which point the real mental model has quietly replaced them.

## The three situations that summon the extras

Seven commands cover normal life. The extras appear for three specific situations, and naming them keeps the cheat sheet from scaring you: **"I saved the wrong thing"** (restore, reset — the undo tools); **"two people changed the same file"** (conflict resolution, the one genuinely hairy moment); and **"I need yesterday's version"** (checkout an old commit, branch from it). Each has a ritual answer worth knowing exists, not memorizing. The point of the seven is that they build the *habit*; the extras are tools you'll look up on the day, and — this is the reassurance — every experienced developer does exactly that too.

## Why commit messages are part of the discipline

The commit itself is only half the artifact; the message is the other, and future-you reads it like an archaeologist reads strata. "add search" from three weeks ago may as well not exist when you're wondering *why* the search code looks that way. "add student search by roll number, partial-name matching" answers the question before it's asked. The rule that produces good messages isn't sophistication — it's a complete sentence about *what changed and why*. It costs five extra seconds and pays out every single time history gets read, which in the life of a healthy repo is constantly. A well-messaged history is a documentation layer that writes itself; a badly-messaged one is noise you have to excavate.`,

  "git-vs-github": `## The three other GitHubs you should know exist

GitHub isn't alone, and knowing the landscape keeps the concepts from collapsing into one brand. GitLab offers self-hosting and integrated CI; Bitbucket plays in the Atlassian world; and you can even run a bare Git server yourself — the protocol doesn't need any of them. The distinctions matter less than the shared shape: *all* of them are just remote homes for Git repositories. Once "Git tracks locally, a host publishes remotely" is planted, GitHub stops being the whole sentence and becomes the popular option in a category. That generalization is the actual lesson — it's about the *relationship*, not the logo.

## What "clone" really does

The command that ties the model together: \`git clone\` copies a repository — history and all — from a remote to your machine. Notice what that means: the *entire* history arrives with it, so after cloning you can browse every commit anyone ever pushed, offline, on the bus. That's the property that separates Git from every "save to cloud" mental model: the repository is not a file on a server you edit remotely; it's a complete, self-contained record, and the server holds a copy of the same record. When that lands — a repo is a thing you *have*, not a thing you visit — the GitHub-vs-Git confusion dissolves for good.

## The private vs public decision

A practical question every student bumps into: should a repo be public or private? The honest default: personal learning projects can be public and *should* be, because they're the visible proof a portfolio depends on; anything with secrets, class solutions you're meant to keep private, or code you don't have rights to share should stay private. Re-read the secret discipline — a token committed accidentally is public in seconds and finds its way into others' hands in minutes, so the habit is: private while you're unsure, public once it's clean, and always assume anything public is carved in stone. The choice is a marketing decision *and* a security decision at once, which is why both lenses deserve a moment.`,};
