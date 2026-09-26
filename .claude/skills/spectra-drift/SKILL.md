---
name: spectra-drift
description: "Detect drift between an identified Spectra change and the current codebase. Use when an identified Spectra change has sat idle or its design references may have moved"
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

   An explicit change-name argument wins. Otherwise use a unique confirmed context target. If neither is available, run `spectra list --json`. Auto-select only when there is exactly one active change. If there are zero active changes or more than one active change, return the candidate list or empty-state message and ask the main thread to rerun `/spectra-drift <change-name>`. Do NOT ask an interactive selection question inside the fork.

2. **Run programmatic drift analysis**

   ```bash
   spectra drift <change-name> --json
   ```

   The JSON contains:
   - `dormancy`: core-owned `{ status, reason, age_days, idle_days }`; status is `triggered`, `fresh`, or `unknown`
   - `severity`: `"light"` / `"medium"` / `"heavy"`
   - `total_score`: aggregate over Time / Structure / Tasks (Environment is display-only)
   - `dimensions`: array of `{ kind, status, score, contributes_to_total }`
   - `broken_anchors`: design.md references (file paths / symbols / functions / CLI flags) that no longer resolve
   - `tasks_blocked_external`: pending tasks whose referenced files were modified by commits outside the change dir
   - `tasks_maybe_resolved`: pending tasks whose verb+target keywords match commit subjects since `created`
   - `recommended_action`: structured `{ action_kind, change_name, flags }` data used to render the next step
   - `primary_recommendation`: legacy field retained for compatibility only; do not parse `primary_recommendation` or use it to drive follow-up behavior

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

3. **Present the report**

   Use a user-readable, conclusion-first format. The first substantive paragraph after the title MUST be a plain-language conclusion that says what to do next before showing score tables, broken anchors, task collisions, or severity labels.

   Translate severity into action-oriented meaning:
   - **Light**: the change can continue with apply.
   - **Medium**: the change can continue, but the plan should be refreshed before implementation.
   - **Heavy**: the old plan is likely unsuitable for direct implementation; restart or refresh first.

   Recommended shape:

   ```markdown
   ## Drift Report: <change-name>

   <Plain-language conclusion. Example for medium: "This change can continue, but update the plan before implementing it. Related code has changed since the plan was written, so applying the old tasks directly may cause rework or conflicts.">

   ### Why

   - <1-3 plain-language reasons derived from dimensions, broken anchors, and task collisions>

   ### Details

   | Item | Result |
   | --- | --- |
   | Time | <status> |
   | Design references | <broken anchor count or "No broken references"> |
   | Pending tasks | <blocked/maybe-resolved count or "No task collisions"> |
   | Overall | <light/medium/heavy, total score N> |

   ### Recommendation

   Present `<rendered recommended_action>` without executing it.
   ```

   Keep technical details below the plain-language conclusion. List broken anchors, blocked tasks, and maybe-resolved tasks only when non-empty. Omit empty technical detail sections entirely. Keep the report short enough to skim; the goal is to help the user decide, not to explain the scoring model.
