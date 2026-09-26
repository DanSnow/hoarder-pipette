---
name: spectra-review
description: "Review code changed for an identified Spectra change for correctness, efficiency, reuse, and conventions. Use when an identified Spectra change has implementation ready for code-quality review; for spec conformance use verify"
argument-hint: "[change-name]"
context: fork
agent: Explore
disallowed-tools: [Edit, Write]
license: MIT
compatibility: Requires spectra CLI.
metadata:
  author: spectra
  version: "1.0"
  generatedBy: "Spectra"
---

## Claude fork context

This generated Claude Code skill runs with `context: fork` as a report-only workflow.

Run only the report core below. Return one consolidated report, then stop. Do not ask or wait for user input. Do not edit files, run rewriting formatters, stage, commit, or invoke a follow-up workflow. Missing decisions override any interactive report-core instruction: return the concrete context and missing input to the main thread, then stop. Recommendations may appear in the report, but the main thread decides what happens next.

---

1. **Select the change**

   An explicit change-name argument wins. Otherwise use a unique confirmed context target. If neither is available, run `spectra list --json` and auto-select only when there is exactly one active change. On ambiguity, return the candidate list or empty-state message and ask the main thread to rerun `/spectra-review <change-name>`. Do NOT ask an interactive selection question inside the fork.

2. **Load intent context**

   Read available proposal, design, tasks and specs as intent context. Implementation-to-spec verification belongs to `/spectra-verify`.

3. **Resolve review scope**

   Run `spectra scope --change "<change-name>" --json`, adding `--base "<revision>"` only for a supplied base. Keep `snapshot_id`, scope source, revisions, files, patches and limitations as one snapshot.

   Trusted touched tracking constrains paths. A validated base includes committed base-to-HEAD changes even with a clean worktree; current layers include staged, unstaged and untracked content. When `scope_source` starts with `approximated_`, state that the scope is approximated. Preserve dirty-baseline limitations: file attribution does not prove hunk ownership.

   Status `insufficient` requires a partial report naming missing evidence. Status `empty` means the resolver established no differences. Use the returned status, even when the current diff is empty.

4. **Gather the implementation diff**

   Inspect all captured diffs, preserving each layer's path and `old_path` for renames/deletions. Treat untracked text as added content; keep non-inspectable content (including binary) unverified. Read only necessary supporting declarations, tests and call sites within the same snapshot. Reuse captured patches across lenses; keep findings within named scope.

5. **Review four search lenses in order**

   These are search lenses, not checklist categories; they SHALL NOT create a quota. Prefer a clean report over filling a category with weak findings.
   - **Correctness**: logic, edge cases, state transitions, stale data and error paths under realistic inputs.
   - **Efficiency**: repeated work, blocking, algorithm cost, wasteful IO and process spawning.
   - **Simplification and reuse**: duplication, overlooked helpers, avoidable abstractions and behavior-preserving simplifications.
   - **Convention**: divergence from local naming, boundaries, patterns or generated-output rules that creates maintenance risk.

6. **Build findings with strict anatomy**

   Every finding MUST include:
   - a file and line anchor;
   - a one-sentence defect summary;
   - a concrete failure scenario with the input, state or sequence that breaks;
   - severity: Critical, Warning, or Suggestion;
   - basis: rule violation or reviewer judgement.

   A rule violation cites the source location of the standard it breaks (project document or existing code). When no source can be cited, label it a reviewer judgement instead.

   When a heuristic conflicts with a documented rule, the project standard wins; the report states the conflict.

   Style-only nits SHALL NOT be reported. Drop personal preferences, checklist-only observations and weak refactor suggestions.

7. **Adversarially re-check candidate findings**

   Before reporting, adversarially re-check each candidate against nearby tests, helpers and call sites. Try to prove the case is already handled; drop speculative or ungrounded scenarios.

8. **Generate the report**

   Run `spectra scope --change "<change-name>" --check-snapshot "<snapshot_id>" --json` with the same optional `--base`. On failure, discard the old snapshot and findings, refresh and re-check. If scope stays unstable, report the limitation and stop. A successful check reuses captured patches.

   Sort findings by severity: Critical, then Warning, then Suggestion. The basis label plays no part in ordering. You MUST cap findings at 20; when exceeded, state that the output was truncated.

   Recommended shape:

   ```markdown
   ## Review Report: <change-name>

   Scope source: <scope_source>; status: <resolved | empty | insufficient>
   Revisions: <base_revision or absent> → <head_revision or unborn>; plus current layers
   Reviewed files: <paths>
   Limitations / unverified content: <limitations and paths, or none>

   Dimensions reviewed: correctness, efficiency, simplification and reuse, convention

   ### Findings

   1. **<Severity>** `<file>:<line>` — <one-sentence defect summary>
      Basis: <rule violation — source location | reviewer judgement>
      Failure scenario: <specific input/state/sequence and wrong behavior>
      Recommendation: <specific fix direction>
   ```

   With 0 findings, list reviewed files and all four dimensions. A completed clean review requires sufficient scope and inspection of all selected content; otherwise preserve incomplete status and limitations.

**Guardrails**

- Report-only: do not edit, run rewriting formatters, stage or commit.
- Findings must identify actionable defects in the changed implementation scope.

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
