---
name: spectra-verify
description: "Verify an identified Spectra change against its artifacts (specs, tasks, design). Use when an identified Spectra change needs task, requirement, and design conformance checked before archiving"
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

   An explicit change-name argument wins. Otherwise use a unique confirmed context target. If neither is available, run `spectra list --json` and consider only active changes with implementation tasks. Auto-select only when exactly one matching active change exists. If there are zero matching active changes or more than one matching active change, return the candidate list or empty-state message and ask the main thread to rerun `/spectra-verify <change-name>`. Do NOT ask an interactive selection question inside the fork.

2. **Check status to understand the schema**

   ```bash
   spectra status --change "<name>" --json
   ```

   Parse the JSON to understand:
   - `schemaName`: The workflow being used (e.g., "spec-driven")
   - Which artifacts exist for this change

3. **Get the change directory and load artifacts**

   ```bash
   spectra instructions apply --change "<name>" --json --compact
   ```

   Read every artifact path from `contextFiles`, including `tasks.md` at `contextFiles.tasks`, using the context validity rule below.

   Run `spectra scope --change "<name>" --json` (add `--base` only when supplied). Retain snapshot_id, paths/patches, provenance and limitations, including base-to-HEAD and staged, unstaged and untracked content. Insufficient scope or non-inspectable files remain unverified; request missing evidence without broadening scope.

   **Context validity**: if full required content remains loaded with matching version/content fingerprints, reuse without another identical file read. On file changes, when compaction removes needed content, or if identity is uncertain, reload affected content before editing or checking. Necessary rereads remain allowed. With matching identities for relevant source/tests/config/environment and recorded command/scope/result source, reuse valid results without rerunning the gate; missing or stale evidence remains unverified and needs affected checks.
4. **Initialize verification report structure**

   Track Completeness (tasks/specs), Correctness (implementation/coverage) and Coherence (design/patterns), with CRITICAL, WARNING or SUGGESTION findings.

   For each requirement keep separate fields:
   | Where it is implemented | Scenarios with a test | Examples whose values appear in a test | What was run and the result |
   | --- | --- | --- | --- |

   Execution evidence records command, scope, relevant version or content fingerprints, and result source (current output or prior session record):
   - **passed-current**: the command passed in this run against the relevant current content/environment.
   - **passed-prior**: a recorded pass whose relevant source, tests, configuration and environment all match; cite that record and the identity comparison.
   - **not-run**: no valid execution result. Static inspection is not an executed passing test. Stale or uncertain identity leaves execution unverified, labelled not-run.
   - **blocked**: execution could not complete; report the command, attempted scope and concrete blocker.

   Preserve exclusions and their grounds separately from execution. Use current session evidence for archive handoff without a persistent verification flag.

5. **Verify Completeness**

   **Task Completion**:
   Use `spectra list --json` task totals (`totalTasks`, `completedTasks`) for progress; tasks.md checkboxes are per-task truth. Each incomplete task is CRITICAL: recommend completing it or marking done only with verified implementation evidence.

   **Spec Coverage**:
   With delta specs in `openspec/changes/<name>/specs/`, fetch `spectra instructions --skill verify-spec-coverage --agent claude` once and run its Spec Coverage checks. Without delta specs, skip the fetch.

6. **Verify Correctness**

   Run the fetched Requirement Implementation Mapping, Scenario Coverage and Example Traceability checks. Without delta specs, note the skipped checks.

7. **Verify Coherence**

   **Design Adherence**:
   Compare design.md decisions with implementation. Divergence is WARNING: recommend the specific implementation correction or artifact revision. Without design.md, note the skipped check.

   **Code Pattern Consistency**:
   Check captured added/modified code for naming, directory and style consistency, retaining provenance and limitations. Significant deviations are SUGGESTION with a concrete project example.

8. **Generate Verification Report**

   Validate captured scope with `spectra scope --change "<name>" --check-snapshot "<snapshot_id>" --json` and the same supplied base. On failure, refresh scope and affected evidence; persistent instability remains unverified.

   **Summary Scorecard**:

   ```
   ## Verification Report: <change-name>

   ### Summary
   | Dimension | Status |
   | --- | --- |
   | Completeness | X/Y tasks, N reqs |
   | Correctness | M/N reqs covered |
   | Coherence | Followed/Issues |
   ```

   Group issues by priority: CRITICAL (incomplete tasks/missing implementation), WARNING (divergence/coverage gaps), SUGGESTION (patterns/improvements). Every issue needs an actionable recommendation and file/line references.

   **Final Assessment**:
   - If CRITICAL issues: report them; recommend fixing and rerunning `/spectra-verify <change>` before archive.
   - If only warnings: report warnings with evidence strength and unverified items.
   - If all clear: report no conformance issues found within inspected scope, followed by execution states and any unverified items. Reserve claims of passing tests for valid execution evidence.
   - With no Critical issues, recommend "Run `/spectra-archive <change>` when ready" with the evidence limitations; task completion alone supplies no execution proof.

**Heuristics and output**: use objective checklists, label inferences, prioritize substantive inconsistencies; uncertainty favors lower severity. Check available artifacts only and state each skipped check and reason. Use a summary table, prioritized findings and `file.ts:123` references. No vague suggestions like "consider reviewing".

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
