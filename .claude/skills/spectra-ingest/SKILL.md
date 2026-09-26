---
name: spectra-ingest
description: "Update an identified Spectra change from a plan file or conversation context. Use when an identified Spectra change's requirements shift during implementation or a plan must be folded into its artifacts"
argument-hint: "[change-name|plan-file]"
license: MIT
compatibility: Requires spectra CLI.
metadata:
  author: spectra
  version: "1.0"
  generatedBy: "Spectra"
---

Update an existing Spectra change from a plan file or conversation context.

This tool can discover bare plan names under `~/.claude/plans/` and also accepts explicit existing plan paths.

**Prerequisites**: Requires `spectra` CLI. If unavailable, report and STOP.

**Input**: Optional existing change name or plan file:

- `/spectra-ingest add-auth`
- `/spectra-ingest ./plans/add-auth.md`
- `/spectra-ingest`

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

1. **Resolve the requirement source and target hint**

   Reuse an explicit or uniquely confirmed source and target before enumerating candidates. Validate an identified target with `spectra status --change "<name>" --json`. For unresolved identity or a bare change/plan collision, list exact active/parked IDs:

   ```bash
   spectra list --json
   spectra list --parked --json
   ```

   Keep `requirement_source` and `target_change` as independent values. Apply these rules in order:

   a. **Explicit plan path** — If the argument contains a path separator, resolves to an existing path, or ends in `.md`, set `requirement_source` to that exact plan path. A missing explicit plan path is an error: report it and STOP without falling back to a change or conversation context.

   b. **Exact active or parked change ID** — Otherwise, if the bare argument exactly matches an active or parked change ID, set `target_change` to that ID. Obtain `requirement_source` separately from conversation context or a separately selected plan. Do not append `.md` or report a missing plan merely because the argument selected a change.

   c. **Plan-directory candidate** — Otherwise, if the bare argument resolves to a plan under `~/.claude/plans/`, set `requirement_source` to that plan and select `target_change` separately.

   If a bare argument matches both an exact change ID and a plan-directory basename, the change ID wins. An explicit path or `.md` suffix forces plan-file interpretation. If a bare argument matches neither a change nor an available plan candidate, report the unknown argument and STOP; do not reinterpret it as conversation context.

   d. **No argument** — Without an argument, reuse the uniquely confirmed plan or conversation source. Only unresolved source intent needs a question: offer the relevant existing plan or conversation context. Recent configured plans are candidates only when needed. Keep the target change independent.

   e. **Conversation fallback** — Only without an argument and without a selected plan, use conversation context as `requirement_source`. If the context is insufficient, ask for more detail before updating artifacts.

2. **Parse plan structure** (skip for conversation context)

   Extract title, context, stages/steps, files involved, and verification.

3. **Select the target change** (REQUIRED — ingest only updates existing changes)

   Keep an explicit name, else a unique confirmed conversation target. Otherwise use the active/parked lists and auto-select only one candidate; ask only when ambiguous. Label parked candidates. With no candidates, suggest `/spectra-propose` and STOP.

   For a parked target, disclose parking. If the named ingest operation is already explicitly requested, run `spectra unpark "<name>"` as a necessary step; respect a known refusal. Otherwise ask for missing authorization. Silence does not authorize restoration.

   Then read existing artifacts for context. The selected change is `target_change`; it does not replace `requirement_source`.

4. **Update artifacts**

   For the first artifact, fetch full instructions without `--omit-context`:

   ```bash
   spectra instructions <artifact-id> --change "<name>" --json
   ```

   **Artifact context cache**: request the first artifact without `--omit-context`. In that first full response, cache its `context` and `contextRef`; both fields absent is the empty-context state, and only one is inconsistent and must not be cached. For each later artifact add `--omit-context` and compare the returned `contextRef` against the cache — equal, including absent on both sides, means reuse the cached context. When `contextRef` changes, discard the cache and request the current artifact instructions again without `--omit-context`, then replace the cache from that response.

   ```bash
   spectra instructions <artifact-id> --change "<name>" --json --omit-context
   ```

   Use `template` as structure, cached `context` and `rules` as constraints. Honor `locale`; specs stay English.

   Apply the matching `requirement_source` mapping below; keep the selected change-id.

For a plan-file source, map the parsed plan while preserving the selected change-id.

**Plan-to-Artifact Mapping**:

| Plan Section | Artifact | How to Map |
| --- | --- | --- |
| Title | Artifact title / summary | Preserve the selected change-id |
| Context | proposal: Why | Direct content transfer |
| Stages overview | proposal: What | Summarize all stages |
| Individual stages | tasks.md groups | One stage = one `##` heading, sub-items = `- [ ]` |
| File paths | proposal: Impact | Affected code list |
| Verification steps | tasks.md | Final verification task group |

For a conversation source, map the resolved context while updating artifacts.

**Context-to-Artifact Mapping**:

| Conversation Element | Artifact | How to Map |
| --- | --- | --- |
| Goal / requirement | proposal: Why | Extract motivation from discussion |
| Discussed approach | proposal: What | Summarize agreed approach |
| Mentioned files | proposal: Impact | Affected code list |
| Discussion phases | tasks.md groups | One topic = one `##` heading |

   **When updating an existing change:**
   - When the user explicitly cancels or supersedes a requirement, remove or replace it in current proposal/design/specs; preserve unaffected content. Record a `Supersedes` decision pointing to the old decision and its replacement.
   - Remove cancelled pending tasks from the executable checklist; map each to the decision or replacement in a non-checkbox change note: cancelled pending work is not completed work.
   - Preserve completed `[x]` descriptions and touched provenance unchanged. Superseded completed behavior needs a new pending compensation or migration task linked to that history. Trace historical records by original task_desc and provenance: CLI checkbox indices differ from document task numbers; new indices cannot reinterpret old records.
   - In the same update, repair all affected `[after: ...]` references and check for missing prerequisites and cycles with analyze/validate. Preserve existing `[P]` markers on retained tasks unchanged.

   Write updates with `--force` only for existing files:

   ```bash
   spectra new artifact <artifact-id> --change "<name>" --stdin --force <<'ARTIFACT_EOF'
   <updated content>
   ARTIFACT_EOF
   ```

   Specs use `spectra new artifact spec <capability-name> --change "<name>" --stdin --force`.

   On validation failure, use the bounded validation policy below. Re-check `spectra status --change "<name>" --json` after each artifact.

   Express ordering on new tasks with `[after: <task-number>]`. Leave existing `[P]` markers exactly as they are.

   - Tasks must fit one uncompacted context window; otherwise split vertically into independently verifiable behavior across layers, rather than one task per layer.

   - Use expand → migrate → contract: add the new form alongside the old, migrate with each batch its own task, then remove the old form after all migrations. The codebase builds and its tests pass at the end of every stage and every batch.

5. **Inline Self-Review** (before CLI analysis)

   Check placeholders, consistency, scope, ambiguity, and preservation:
   - quantitative claims: label every number (size, count, duration, percentage) measured or estimated. For an estimate, name the measurement that would confirm or refute it; record any decision depending on that unmeasured estimate.
   - completed tasks `[x]` still present and unchanged.
   - existing `[P]` markers preserved unchanged.
   - replacements, cancellation notes and completed history remain traceable; dependencies resolve without cycles.

   **Durable Handoff Review** (run BEFORE the CLI analyzer)

   Fix these in **incomplete** design/tasks for durable handoff; preserve completed `[x]` history:
   - **File-path-only tasks**: a task whose entire description is "edit file X" with no behavior, contract, or verification target. File paths are locator context — the task SHALL still describe what is observably true when complete.
   - **Line-number-coupled instructions**: design or task content that points to "line 42" / "the function on lines 80-95" as the only way to identify the work. Source line numbers drift; name the function, command, struct, or behavior instead.
   - **Vague acceptance criteria**: success conditions like "works correctly", "behaves as expected", "handles edge cases" without naming the observable behavior or the verification target (test name, CLI invocation, analyzer rule, manual assertion).
   - **Missing scope boundaries on non-trivial work**: design lacking explicit "in scope" / "out of scope" lines for any change that touches more than one subsystem or introduces new behavior. Trivial artifact-only edits MAY skip this; runtime, build, or tooling effects MUST NOT.
   - **Ungrounded codebase claims**: a task asserting the current state of existing code, tests, or behavior — "the existing tests need no assertion change", "only these three files reference it" — written without opening that source. Ground the claim in the source it names, or rewrite the task without it. The criterion is whether the claim has a basis, not whether a search was run.

   Fix failures using context/new source. Preserve completed tasks unchanged.

   Recheck affected artifacts, including proposal/scenarios. Keep tasks granular; superseded completed behavior needs pending compensation.

6. **Analyze-Fix Loop** (max 2 iterations)
   1. Run `spectra analyze <change-name> --json`; combine findings with unresolved inline review issues. Suggestions stay advisory.
   2. For Critical/Warning findings, show findings and attempt M/2, fix affected artifacts, then re-run analysis; at most 2 repair iterations. Stop retrying if the same diagnostics recur without new progress.
   3. Classify the remaining findings:
      - Critical remains: report **not ready** with locations, reasons and next actions; continue only artifact handling and validation.
      - Warnings only: list remaining warnings without claiming resolution; continue to validation.
      - No Critical/Warning: report consistency and continue to validation.
   4. Every validation retry (including artifact creation) requires a concrete correction; at most 2 corrections per failing gate. Stop on repeated diagnostics without progress. A failed validation remains **not ready** until corrected artifacts pass.
   5. Saving or parking preserves this not-ready result. Only offer apply when Critical is zero and validation passed; otherwise end with blockers and next actions.
7. **Validation**

   ```bash
   spectra validate "<name>"
   ```

   On failure, follow the bounded validation policy above and report the actual result.

8. **Summary and next steps**

   Show source used, change name/location, artifacts updated, and validation result.

   With unresolved Critical or failed validation, end with blockers and next actions. Only the ready branch below offers apply.

   Report completion directly, without a Done gate. With existing explicit authorization to continue apply for this target and readiness checks passed, invoke `/spectra-apply <change-name>`. Without that authorization, suggest `/spectra-apply <change-name>` as the next step and STOP. Silence does not authorize a handoff; respect a known refusal or cancellation.

**Guardrails**

- NEVER modify the plan file selected as `requirement_source`.
- NEVER write application code; this skill updates Spectra artifacts only.
- NEVER create new changes.
- Preserve all completed tasks (`[x]`) — never revert progress.
- Ask for details when source content is too brief to fill artifacts.
- Verify each artifact exists after writing.
- Without structured input, ask required questions in plain text and wait.
