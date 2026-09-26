---
name: spectra-propose
description: "Create a complete Spectra change proposal with all artifacts. Use when the user explicitly requests Spectra planning from a requirement, plan file, or prior structured decision"
argument-hint: "[description]"
license: MIT
compatibility: Requires spectra CLI.
metadata:
  author: spectra
  version: "1.0"
  generatedBy: "Spectra"
---

Create a complete Spectra change proposal — requirement to validated artifacts — in one workflow.

**Input**: Requirement description after `/spectra-propose` (e.g., `/spectra-propose add dark mode`). If absent, extract from conversation context or ask.

**Prerequisites**: Requires `spectra` CLI. If unavailable, report and STOP.

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

**Steps**

1. **Determine the requirement source**

   a. **Argument provided** → use it as the requirement description, then derive a kebab-case change name.

   b. **Plan file available**:
   - If conversation context mentions `~/.claude/plans/<name>.md` and the file exists, ask whether to use the plan file or conversation context.
   - If chosen, read it and extract `plan_title`, `plan_context`, `plan_stages`, and `plan_files`.

   c. **Conversation context**:
   - Extract requirements from conversation history.
   - If insufficient, ask for three concrete dimensions before `spectra new change`: what changes, why, and done criteria.

   Strip archive-style `YYYY-MM-DD-` date prefix from active change names; strip the date prefix before running `spectra new change`.
   **IMPORTANT**: Do NOT proceed without understanding what the user wants to build.

2. **Classify the change type**

   | Type | When to use |
   | --- | --- |
   | Feature | New functionality, new capabilities |
   | Bug Fix | Fixing existing behavior, resolving errors |
   | Refactor | Architecture improvements, performance optimization, UI adjustments |

   **Determine spec impact** separately before creating the change:
   - Ask whether the change alters capability-level observable behavior.
   - If the change is tooling, dependency, build, or documentation work with no capability-level observable behavior change, use `no-spec`.
   - If spec impact is uncertain, default to `spec-driven`.
   - For `no-spec`, proposal says `Affected specs: none` and Do NOT create any delta spec.

3. **Scan existing specs for relevance**

   Skip this for `no-spec`. Otherwise list `openspec/specs/*/spec.md`, compare spec IDs to the requirement, read short Purpose snippets for up to 3 candidates, and show related specs only as info.

4. **Create the change directory**

   ## Create command

   Capability-level behavior:

   ```bash
   spectra new change "<name>" --agent claude
   ```

   No capability-level behavior:

   ```bash
   spectra new change "<name>" --schema no-spec --agent claude
   ```

   If the change exists, suggest continuing it.

5. **Write the proposal**

   **Impact path rules**: paths must be project-root relative; avoid relative fragments like `parser/mod.rs`; do not wrap shell commands in backticks; use prose when no concrete path is known.

   Fetch the proposal template for the step 2 type — `--type bug-fix`, `--type refactor`, or no flag for Feature and `no-spec` changes. The returned `template` is the single source of the proposal structure; follow its sections exactly.

   ```bash
   spectra instructions proposal --change "<name>" --json [--type <bug-fix|refactor>]
   spectra new artifact proposal --change "<name>" --stdin <<'ARTIFACT_EOF'
   <proposal content>
   ARTIFACT_EOF
   ```

   The proposal is the first artifact. Request its instructions without `--omit-context`.

   **Artifact context cache**: request the first artifact without `--omit-context`. In that first full response, cache its `context` and `contextRef`; both fields absent is the empty-context state, and only one is inconsistent and must not be cached. For each later artifact add `--omit-context` and compare the returned `contextRef` against the cache — equal, including absent on both sides, means reuse the cached context. When `contextRef` changes, discard the cache and request the current artifact instructions again without `--omit-context`, then replace the cache from that response.

   On validation failure, use the bounded validation policy below.

6. **Get artifact build order**

   ```bash
   spectra status --change "<name>" --json
   ```

   Use `applyRequires`, artifact statuses, and dependencies from the JSON.

7. **Create remaining artifacts in sequence**

   For each `ready` artifact:
   - Evaluate optional criteria from `instruction`; skip only when criteria clearly do not match.
   - Fetch later artifact instructions without resending the cached context:

     ```bash
     spectra instructions <artifact-id> --change "<name>" --json --omit-context
     ```

   - Use `template` as structure. Apply the cached `context` and returned `rules` as constraints; do NOT copy them into files. Honor `locale`, except specs are always English.
   - Before writing a task that asserts the current state of existing code, tests, or behavior, open the source it names and confirm the claim. Scope this to the source the assertion touches; a full scan of the change's other modules is not required.
   - Write with CLI:

     ```bash
     spectra new artifact <artifact-id> --change "<name>" --stdin <<'ARTIFACT_EOF'
     <content>
     ARTIFACT_EOF
     ```

     Specs use `spectra new artifact spec <capability-name> --change "<name>" --stdin`.

   - Re-run `spectra status --change "<name>" --json`; stop when all `applyRequires` artifacts are done. If only blocked artifacts remain, list blockers and pause.
   - If context is unclear, ask the user before writing; use structured input if available, otherwise ask in plain text and wait for the response.

8. **Inline Self-Review** (before CLI analysis)

   Check artifacts for:
   - placeholders: TBD, TODO, FIXME, "implement later", "details to follow", vague instructions, empty template sections, weasel quantities.
   - consistency: capabilities, specs, design, tasks, and file paths agree.
   - scope: more than 15 pending tasks, any >1 hour task, or unrelated subsystems.
   - ambiguity: testable success/failure, boundary conditions, clear "the system".
   - quantitative claims: label every number (size, count, duration, percentage) measured or estimated. For an estimate, name the measurement that would confirm or refute it; record any decision depending on that unmeasured estimate.
   - if unresolved ambiguity remains, fetch `spectra instructions --skill clarify` when available.
   - The CLI analyzer catches many of the misses above, but the handoff review below must be completed inline.

   **Durable Handoff Review** (run BEFORE the CLI analyzer)

   This change has to survive being parked or handed to another agent. Reject and fix any of the following:
   - **File-path-only tasks**: a task whose entire description is "edit file X" with no behavior, contract, or verification target. File paths are locator context — the task SHALL still describe what is observably true when complete.
   - **Line-number-coupled instructions**: design or task content that points to "line 42" / "the function on lines 80-95" as the only way to identify the work. Source line numbers drift; name the function, command, struct, or behavior instead.
   - **Vague acceptance criteria**: success conditions like "works correctly", "behaves as expected", "handles edge cases" without naming the observable behavior or the verification target (test name, CLI invocation, analyzer rule, manual assertion).
   - **Missing scope boundaries on non-trivial work**: design lacking explicit "in scope" / "out of scope" lines for any change that touches more than one subsystem or introduces new behavior. Trivial artifact-only edits MAY skip this; runtime, build, or tooling effects MUST NOT.
   - **Ungrounded codebase claims**: a task asserting the current state of existing code, tests, or behavior — "the existing tests need no assertion change", "only these three files reference it" — written without opening that source. Ground the claim in the source it names, or rewrite the task without it. The criterion is whether the claim has a basis, not whether a search was run.

   Fix every failure inline before analyzer. If new input is required, surface it.

   Write scenarios and explicit design intent for the next implementer; resolve placeholders before handoff.

9. **Analyze-Fix Loop** (max 2 iterations)
   1. Run `spectra analyze <change-name> --json`; combine findings with unresolved inline review issues. Suggestions stay advisory.
   2. For Critical/Warning findings, show findings and attempt M/2, fix affected artifacts, then re-run analysis; at most 2 repair iterations. Stop retrying if the same diagnostics recur without new progress.
   3. Classify the remaining findings:
      - Critical remains: report **not ready** with locations, reasons and next actions; continue only artifact handling and validation.
      - Warnings only: list remaining warnings without claiming resolution; continue to validation.
      - No Critical/Warning: report consistency and continue to validation.
   4. Every validation retry (including artifact creation) requires a concrete correction; at most 2 corrections per failing gate. Stop on repeated diagnostics without progress. A failed validation remains **not ready** until corrected artifacts pass.
   5. Saving or parking preserves this not-ready result. Only offer apply when Critical is zero and validation passed; otherwise end with blockers and next actions.
10. **Validation**

    ```bash
    spectra validate "<name>"
    ```

    On failure, follow the bounded validation policy above and report the actual result.

11. **Park the change and end the workflow**

    Show change name/location, artifacts created, and validation result. Then execute:

    ```bash
    spectra park "<name>"
    ```

    Report parked status separately from readiness. With unresolved Critical or failed validation, end with blockers and next actions. Otherwise tell the user `/spectra-apply <change-name>` will unpark/start when ready; in read-only planning mode, remind them to switch to an editing mode. Do NOT invoke `/spectra-apply`.

**Artifact Creation Guidelines**

- **Design source capture (visual design changes only)**: cache primary `.dc.html` into `.spectra/design-cache/<change-name>/`, include a `## Design Source` section with source, cache path, and exact px / hex / radius / spacing / icon names. Omit when no visual source exists.
- Follow `spectra instructions` for artifact type.
- Read dependencies before creating artifacts.
- Use `template` as structure; never copy `context`, `rules`, or `project_context` blocks.
- Express ordering with `[after: <task-number>]` declarations on tasks that depend on earlier work, and leave independent tasks unmarked. Write a declaration whenever two tasks cannot run at the same time, whether the reason is ordering or an overlap in the files they touch. Hand-written `[P]` markers are no longer produced; the parallel value is derived from the dependency graph.
- Tasks must fit one uncompacted context window; otherwise split vertically into independently verifiable behavior across layers, rather than one task per layer.
- Use expand → migrate → contract: add the new form alongside the old, migrate with each batch its own task, then remove the old form after all migrations. The codebase builds and its tests pass at the end of every stage and every batch.

**Guardrails**

- Create every artifact needed by `applyRequires`; skip optional artifacts only when their criteria do not apply.
- Verify each artifact exists after writing.
- NEVER write application code or implement features.
- NEVER skip the artifact workflow.
- NEVER reinterpret requirements by ignoring proposal.
- NEVER invoke `/spectra-apply`; user decides when to start implementation.
