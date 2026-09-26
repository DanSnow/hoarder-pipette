---
name: spectra-analyze
description: "Analyze artifact consistency for an identified Spectra change — contradictions between proposal, design, specs, and tasks, plus gaps and ambiguity. Use when an identified Spectra change's artifacts may conflict before implementation"
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

   An explicit change-name argument wins. Otherwise use a unique confirmed context target. If neither is available, run `spectra list --json`. Auto-select only when there is exactly one active change. If there are zero active changes or more than one active change, return the candidate list or empty-state message and ask the main thread to rerun `/spectra-analyze <change-name>`. Do NOT ask an interactive selection question inside the fork.

2. **Run programmatic analysis**

   ```bash
   spectra analyze <change-name> --json
   ```

   This returns structured JSON with:
   - `dimensions`: Array of `{ dimension, status, finding_count }` for Coverage, Consistency, Ambiguity, Gaps, Localization
     - Localization detects whether prose artifacts (proposal, design, tasks) are written in the language matching the project's configured locale
   - `findings`: Array of `{ id, dimension, severity, location, summary, recommendation }`
   - `artifacts_analyzed` / `artifacts_missing`: Which artifacts were available

   **Context validity**: if full required content remains loaded with matching version/content fingerprints, reuse without another identical file read. On file changes, when compaction removes needed content, or if identity is uncertain, reload affected content before editing or checking. Necessary rereads remain allowed. With matching identities for relevant source/tests/config/environment and recorded command/scope/result source, reuse valid results without rerunning the gate; missing or stale evidence remains unverified and needs affected checks.
3. **Supplement with AI semantic analysis**

   The programmatic analyzer only catches structural issues; the semantic rules below are what this skill adds on top of it. Read the artifacts and apply the four rules below. Each rule states the check, how to decide, and the severity to assign — written so that two different agents applying the same rule reach the same conclusion:
   1. **Contradictory decisions** — a proposal requirement and the design (or a delta spec) make mutually exclusive decisions, i.e. the same behavior is described in two incompatible ways.
      How to decide: go through the proposal requirements one by one and compare each against the design's Decisions.
      Severity: WARNING; escalate to CRITICAL if the contradiction would block implementation.
   2. **Orphan tasks** — a task in tasks.md has no basis in the proposal's Impact section or in the specs.
      How to decide: for each task, look for a corresponding item in proposal Impact or specs.
      Severity: SUGGESTION.
   3. **Uncovered risks** — check each design risk for a requirement/scenario, concrete mitigation, executable verification task, or explicit user acceptance.
      How to decide: trace how the treatment addresses that risk. Record the treatment's artifact location; a vague reassurance is insufficient. For no-spec changes, use proposal/design/tasks without inventing delta specs or capabilities.
      Severity: WARNING only when no traceable treatment exists. Treated risks produce no uncovered-risk warning; acceptance leaves contradictory decisions subject to rule 1.
   4. **Cross-artifact inconsistency** — the same file path or behavior is described inconsistently across artifacts.
      How to decide: cross-check every file path and behavior that appears in more than one artifact.
      Severity: WARNING.

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

4. **Present results**

   Present the analyzer findings and the semantic findings from step 3 as one report:

   ```
   ## Artifact Analysis: <change-name>

   | Dimension | Status |
   | --- | --- |
   | Coverage | <status> |
   | Consistency | <status> |
   | Ambiguity | <status> |
   | Gaps | <status> |
   | Localization | <status> |
   ```

   Group findings by severity (Critical > Warning > Suggestion) with locations and recommendations. Present this report once; do not emit a partial report before step 3 finishes.
