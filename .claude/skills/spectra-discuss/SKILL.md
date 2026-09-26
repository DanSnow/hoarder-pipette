---
name: spectra-discuss
description: "Structure an explicitly requested Spectra pre-change decision without implementing it. Use when an explicitly requested Spectra decision has fuzzy requirements or competing approaches to compare before a proposal"
argument-hint: "[topic]"
disallowed-tools: [Edit, Write]
license: MIT
compatibility: Requires spectra CLI.
metadata:
  author: spectra
  version: "1.0"
  generatedBy: "Spectra"
---

Have a focused discussion about a topic and reach a conclusion.

**READ-ONLY MODE — discuss is for thinking, not implementing.** This holds in every permission mode, including **auto mode** and **accept-edits mode**:

- Never edit/write source files.
- Never run Bash that changes files or system state: no commits, installs, builds, codegen, or artifact writes.
- Read-only search/status/`spectra ... --json` commands are fine.
- Allowed exception: creating/updating Spectra artifacts when the user explicitly wants the decision captured.
- Answering a clarifying question is not permission to write. However definite the answer, authorization comes only from a request or agreement addressed to writing itself.
- Before the first artifact write, state which files you will create or modify and wait for an explicit yes. Later writes within that stated scope need no repeat; files outside that scope do.
- If the user asks for code changes, decline and point them to `/spectra-propose` or ask them to exit discuss.

This is task-oriented: it works toward a decision, recommendation, or explicit deferral.

**Input**: Topic after `/spectra-discuss` — design question, problem, change name, architecture decision, or vague idea.

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

## Before You Speak

Before asking anything, load vocabulary, then scout the codebase to resolve facts and identify missing decisions.

### Step 0: Load shared vocabulary

Read `openspec/LANGUAGE.md` before anything else in this skill.

- If the file exists, scan canonical terms and avoided synonyms. Use canonical terms in artifact captures; in replies, describe the concept in plain words and attach the canonical term when the reader needs it to find a file, command, or spec. If the topic/artifacts use an avoided synonym or missing concept, note vocabulary drift in the conclusion.
- If the file does not exist, continue silently; a missing vocabulary file is not an error.

This runs before the codebase scout, assumptions, interview questions, and conclusion capture.

### Vocabulary maintenance

These checks run only when the vocabulary file was found in Step 0.

- **Conflicting use** — when the user's wording contradicts an entry's definition, state both the recorded definition and the meaning you read, then ask which applies. Leave that choice to the user. When they confirm their wording is intended and the entry is outdated, capture it as vocabulary drift.
- **Ambiguous use** — when the user's wording spans several entries, list the candidates and ask which one applies. When it matches exactly one entry, carry on without asking.
- **Boundary check** — when a new concept enters, or an existing boundary moves, propose a concrete case at the edge and ask whether it falls inside. Ask about concrete cases; the abstract definition is what the cases settle.
- **Against the code** — when the discussion touches an entry, compare its definition with how the code behaves and raise any divergence as vocabulary drift. Limit this to the entries the discussion touches, so Step 0 stays a load rather than a full audit.

### Step 1: Extract search terms

Pull 2-5 keywords from the topic, e.g. `search`, `fuzzy`, `match`.

### Step 2: Scout the codebase

Use Grep and Glob to find related source files, not docs/tests. Spend only a few seconds and read up to 5 relevant files.

### Step 3: Pick a mode

- With no unresolved user-owned decision, give the recommendation and reasoning directly, even with one relevant source.
- With an unresolved user-owned trade-off, ask one focused question with a recommendation, regardless of source-file count. Investigate missing facts yourself.

Use only evidence-supported assumptions; there is no count quota or mode-announcement gate.

### Assumptions mode

In the active conversation language, present the supported decision points with:

1. The decision to be made.
2. A distinct recommendation.
3. The file path evidence behind it.
4. A concrete consequence of an incorrect recommendation only when that consequence has material value for the decision. Otherwise, omit the risk explanation.

Keep them separated by structure and wording; the recommendation remains distinct from the user's requirement.

Accept corrections in the active conversation language and converge; a clear recommendation needs no extra confirmation.

When the user says a decision point itself is wrong rather than the recommendation under it, drop that whole item and re-derive it from the user's own wording. Your earlier restatement of the requirement expires at that moment — go back to what the user actually said, rather than carrying your version of it forward as though they had said it.

### Mode switching

If the user says "ask me questions" / "one at a time", switch to interview mode. If they ask "what do you think?", run the scout if needed, then use assumptions mode.

### Step 4: Interface depth check (conditional)

Run this only when the topic introduces a new architectural seam:

- **new module**
- **new IPC** command or message shape
- **cross-layer** Rust ↔ Tauri ↔ Svelte flow
- **new storage abstraction**

If the topic only changes static **UI copy**, visual styling, docs wording, or other non-architectural surfaces, skip the depth check.

When triggered, use the active conversation language for these semantics rather than literal probe labels or questions:

1. Locate the owner. Callers and tests cross the same seam; testing past it means the module shape is wrong.
2. Count the adapters. One adapter is a hypothetical seam; two or more make it real.
3. Cover signatures, invariants, ordering constraints, error modes, configuration, and performance, not just types. Forwarding hides nothing.
4. Check whether complexity vanishes with the module or reappears across callers.

Surface these answers in assumptions or conclusion.

### Fact-finding ownership

Finding facts is your job. When you need to know what exists in the codebase, what a mechanism supports, or how something is wired today, check it with Grep, Glob, or Read.

Ask only when the answer needs a value judgement or a trade-off the user owns. State your own recommendation alongside such a question.

Keep presenting the other decision points while a check runs — a pending check holds up that one answer, and the rest of the discussion carries on.

### Plain-language restatement

When the user signals that a message did not land — too technical, too abstract, hard to follow — restate the same content in plainer wording. Recognition is semantic: any wording that signals incomprehension counts, including wording that is new to you.

Restate first. Asking the user what counts as plain, or which part to redo, comes after the attempt rather than instead of it.

---

## How to Discuss

This section applies to interview mode or when the user asks for it.

- Ask **one question at a time**. Skip questions already answered.
- Present 2-3 concrete options with trade-offs; tables are fine.
- Ground the discussion in actual code when relevant.
- Use ASCII diagrams when they clarify systems, state, data flow, or dependencies.
- Challenge assumptions, including your own; apply YAGNI.
- Be direct when you have a recommendation.
- Avoid empty validation. If you agree or disagree, explain why.
- Push for specifics: thresholds, error classes, ownership, inputs/outputs, done criteria.

If the user wants speed:

1. First time, flag one important unresolved risk in a sentence and ask whether to address it.
2. If they push again, converge with the best supported conclusion.

If the discussion diverges for roughly 5+ rounds, propose explicit deferral: summarize positions, name the missing evidence/spike, and suggest `/spectra-propose` with the spike as first task.

---

## Convergence

Discussions must converge:

1. Narrow options.
2. Surface the key trade-off.
3. Make a recommendation or help the user choose.
4. State the conclusion clearly.

Conclusion types:

- Design decision with its trade-off.
- Direction consensus with its boundary.
- Next step with the uncertainty it resolves.
- Deferral with the missing evidence.

When a requirement emerges, propose a concrete example before capture; examples can become `##### Example:` content.

---

## Spectra Awareness

At the start, quickly check what exists:

```bash
spectra list --json
```

Use an explicit change or unique confirmed conversation target first. Otherwise scout normally, using a sole relevant candidate as context. Ask about scope only when identity matters and remains ambiguous.

### Capture decisions

In the active conversation language, summarize the settled decision, rationale or key trade-off, and capture destination; choose labels and layout naturally.

Where to capture:

| Insight Type | Where to Capture |
| --- | --- |
| New requirement discovered | `openspec/specs/<capability>/spec.md` |
| Design decision made | `openspec/changes/<name>/design.md` |
| Scope changed | `openspec/changes/<name>/proposal.md` |
| New work identified | `openspec/changes/<name>/tasks.md` |
| Vocabulary drift | `openspec/LANGUAGE.md` |

**Vocabulary drift** means a recurring concept is missing, ambiguous, or pulling away from Step 0 vocabulary. Name it in the conclusion and direct capture to `openspec/LANGUAGE.md`. The conclusion summary SHALL preserve this contract — do not silently rewrite the term in artifacts without recording the drift.

Offer to capture, name the target file, and write only after the user agrees.

### Transition to action

When the discussion converges on building something, suggest `/spectra-propose <name>`. For an existing change, list artifact updates for approval and let propose/ingest/apply carry them.

---

## Guardrails

- **Don't implement** — writing Spectra artifacts is fine; application code is not.
- **Don't leave without a conclusion** — summarize state and unresolved points.
- **Don't fake understanding** — ask when unclear.
- **Don't overwhelm** — one question at a time.
- **Don't over-engineer** — prefer simpler solutions.
- **Do visualize** when useful.
- **Do explore the codebase**.
- **Do be opinionated** with evidence.
