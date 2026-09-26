---
name: spectra-debug
description: "Systematically debug a persistent problem through reproduce, isolate, root cause, fix, and integration phases. Use when systematic debugging is explicitly requested or a failure persists after two focused attempts"
argument-hint: "[problem-description]"
license: MIT
compatibility: Requires spectra CLI.
metadata:
  author: spectra
  version: "1.0"
  generatedBy: "Spectra"
---

Systematically debug a problem using a five-phase workflow.

**This skill enforces debugging discipline.** No guessing, no random changes, no "let me try this." Every step is deliberate and evidence-based.

**Input**: The argument after `/spectra-debug` describes the bug or unexpected behavior. Examples:

- `/spectra-debug the search returns duplicate results`
- `/spectra-debug crash on startup after upgrading`
- `/spectra-debug file watcher misses rename events`

## Write for the reader

The reader is using Spectra for the first time: they know their own project and have not learned this workflow's vocabulary. Every user-visible message is written so that reader can act on it.

### Conversation language

Use the active conversation language for user-visible analysis, questions, labels, and conclusion. Resolve it in this order: an explicit language instruction for subsequent user-visible output; the primary natural language of the current user request; the most recently established conversation language when the request is mixed or contains only technical identifiers. Keep established Traditional Chinese or English. User context selects it independently of the internal template and repository artifact locale; artifacts use the locale returned by `spectra instructions`.

### Plain wording

- Lead with what happened and what the reader does next; evidence and detail follow.
- Keep a term only when the reader can see it on screen, type it in a command, or open it as a file (change, spec, proposal, tasks, archive, CLI output such as Critical). Explain it in one clause the first time it appears.
- Every other term belongs to this workflow, so say what it means for the reader: "scenario coverage" becomes "which spec scenarios have a test"; RED becomes "the new test failed before the change, as intended".
- Write headings, table columns, and labels as plain descriptions in the conversation language; section names in this template stay internal.
- Commands, paths, identifiers, and required handoff lines stay verbatim.
- Emphasis, grouping, and pointing are carried by the words and the structure alone: a heading, a list, a table cell, bold text, or the sentence itself.

---

## The Three-Attempt Rule

**Maximum 3 fix attempts per hypothesis in Phase 4 (Fix).** Phases 1-3 (Reproduce, Isolate, Root Cause) are investigation — they do not count toward this limit. If your third fix attempt fails:

1. **Stop fixing**
2. Document what you tried and why it failed
3. Question your hypothesis — is the root cause what you think it is?
4. Research alternatives or try a completely different angle

NEVER keep trying variations of the same approach after the third attempt. That is a loop, not debugging. Stopping and reporting the failed hypothesis is the correct outcome here, not a failure to finish.

---

## Phase 1: Reproduce

First check project service, browser, device and test authorization. Use permitted evidence gathering; if required execution is unavailable, report the missing command/evidence as pending.

**Gate — behavioral Phase 2 starts after an executed test, trace replay, or measured intermittent experiment exhibits the reported symptom.** Unexecuted commands or written manual steps leave the gate shut. Record the command, environment, sample count, failure count and symptom match; retain uncertainty for intermittent results.

Pick a permitted means: a failing test, a command script, a headless browser run, a trace replay, a fuzzing loop, or a bisection harness. Keep the setup repeatable and bounded.

- **Minimise** — remove one element at a time and retest, until removing any remaining element makes the bug disappear. For intermittent failures compare measured frequencies rather than treating one passing run as disappearance.
- **Stabilise** — raise the rate with looping, stress, or timing manipulation within the bounded experiment, without requiring failure on every run. No matching failure leaves reproduction unverified: state the limitation and next experiment instead of unlimited stress.
- **Owner-supplied logs or traces** — permit labelled static investigation of source, with reproduction and fix verification unverified. This exception grants no execution permission and cannot establish a completed fix; obtain acceptable verification evidence first.
- **Identify the expected vs actual behavior** — be precise

---

## Phase 2: Isolate

Narrow down WHERE the bug lives. This phase locates the divergence point — module, function, line. Explaining why it diverges is Phase 3's job.

- **Binary search the codebase** — which module, which function, which line?
- **Check inputs and outputs** — at each boundary, is the data correct?
- **Add targeted logging** — not everywhere, just at decision points
- **Find what changed** — when the bug is a regression, use git bisect to locate the exact commit that introduced it

Goal: pinpoint the exact location where behavior diverges from expectation.

---

## Phase 3: Root Cause

Understand WHY it's broken, not just WHERE. Phase 2 located the divergence point — now explain the mechanism behind it.

Ask these questions:

- What is the mechanism — how does the code at the divergence point produce the observed behavior?
- What assumption is being violated?
- Is this a symptom of a deeper issue, or the actual problem?

Form only evidence-supported hypotheses. One supported candidate is enough; invent no candidates to meet a quota. Write each so it can be proved wrong: "if X is the cause, changing Y makes the bug disappear or worsen". A statement carrying no such prediction is not a hypothesis: restate it with a prediction or discard it.

Rank available candidates by evidence and show the ranking to the user before verification starts. Test the leading candidate without waiting for approval; accept new evidence or corrections as they arrive.

Then verify the leading candidate:

- Can you predict the bug's behavior based on your theory?
- Does your theory explain ALL the symptoms, not just some?
- Can you construct a test case that proves the root cause?

When the three-attempt limit trips, reassess and test the next supported candidate. If none remains, obtain new evidence or report a blocker; keep the failed attempts as evidence.

---

## Phase 4: Fix

Now — and only now — fix the bug.

**Preflight — before touching any code**, read `.spectra.yaml` in the project root:

- If `tdd: true`: Reuse complete TDD at the same version, otherwise fetch `spectra instructions --skill tdd`; changed/unknown content or loss after compaction requires a fresh fetch. Follow Red-Green-Refactor.
- If `tdd` is false, or the file or field does not exist → fix as usual, but a test covering the bug is still required before you mark the fix complete

Respect owner-run test restrictions: leave unavailable gates pending and report them; request only missing execution authorization.

Then:

1. **Write a failing test** that reproduces the bug
2. **Make the minimum change** to fix the root cause — not the symptoms
3. **Run the focused reproducer first** — confirm the fix with symptom-matching evidence; one passing intermittent sample is insufficient
4. **Run affected suites and project-required gates** — expand to a full suite only for demonstrated dependency impact, cross-module changes or project policy. No subsequent changes, failures or unresolved concerns: retain passing evidence instead of repeating the same gate
5. **Check related code** — search the codebase for the same pattern (the same logic error, the same missing validation), list the affected files, and report them. Fix only the current bug — same-pattern issues elsewhere are scope expansion: report them and let the user decide whether to address them together, do not expand the scope on your own

---

## Phase 5: Integration

Connect the fix back to the Spectra workflow.

- **Debugging within a Spectra change** — run `spectra list --json`. If the fix matches an active task, verify the requirement, then run `spectra task done --change "<name>" <task-id> --file <path>` and repeat `--file` for every changed source or test file.
- **Standalone debugging** (unrelated to any change) — if the fix is significant or spawns follow-up work, suggest the user formalize it with `/spectra-propose`

---

## Rationalization Table

| What You're Thinking | What You Should Do |
| --- | --- |
| "I bet it's this, let me just change it" | Reproduce first. Verify your hypothesis |
| "Let me add some prints everywhere" | Add targeted logging at specific boundaries |
| "It works on my machine" | Find what's different in the failing environment |
| "Let me try reverting this change" | Use git bisect to find the actual cause |
| "The fix is obvious, I don't need a test" | The fix is wrong. Write the test |
| "Let me just restart the service" | That hides the bug. Find the root cause |
| "Maybe if I just clear the cache..." | Understand why the cache was wrong |

---

## Guardrails

- **Don't guess** — Every change must be based on evidence
- **Don't fix symptoms** — Find and fix the root cause
- **Don't skip the test** — Phase 4 always starts with a failing test
- **Don't power through** — After 3 failed attempts, stop and reassess
- **Do keep notes** — Document what you tried, what you found, what you ruled out
- **Do check broadly** — A bug in one place often means the same bug exists elsewhere
