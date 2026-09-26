---
name: spectra-apply
description: "Implement or resume tasks for an identified Spectra change. Use when an identified Spectra change is ready for implementation or its task work is continuing"
argument-hint: "[change-name]"
license: MIT
compatibility: Requires spectra CLI.
metadata:
  author: spectra
  version: "1.0"
  generatedBy: "Spectra"
---

Implement a Spectra change's tasks.

**Input:** Optional change name.

**Task tracking:** `tasks.md` checkboxes are truth. Attribute files by task baseline or explicit paths, never the whole dirty tree.

**Prerequisite:** `spectra` CLI; if unavailable, report and STOP.

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

1. **Select the change**

   Use an explicit name, else a unique confirmed conversation target. If unresolved, list and auto-select only one candidate, otherwise ask.
   - Ambiguous: run `spectra list --json` and `spectra list --parked --json`; mark parked entries and ask. Empty: suggest `/spectra-propose` and STOP.

   Announce "Using change: <name>"; override `/spectra-apply <other>`.

2. **Check status and parking**

   Run `spectra status --change "<name>" --json` and `spectra list --parked --json`; errors stop. If parked, disclose parking; restore when already explicitly requested. A known refusal blocks restore. With missing authorization, ask before:

   `spectra unpark "<name>"`, `spectra in-progress add "<name>"`, then `spectra status --change "<name>" --json`.

   Else run `spectra in-progress add "<name>"` silently. Keep schemaName/tasks artifact.

3. **Load compact instructions and preflight**

   **Initial completion check**: `spectra instructions apply --change "<name>" --json --summary`.
   If `state: "all_done"`: report existing completion and verification evidence (missing execution: not-run), give step 7's handoff, and STOP before implementation preflight/analyze. Otherwise load:

   `spectra instructions apply --change "<name>" --json --compact`

   Read `tasks.md` at `contextFiles.tasks`; follow returned diagnostics/preflight/instruction.

   - `state: "blocked"`: report missing artifacts, suggest `/spectra-propose`, and STOP.
   - Compact `all_done`: same exit.
   - Preflight: continue on clean; summarize warnings; for critical, list missing files/source artifacts and ask to continue.

   Run `spectra analyze <name> --json`; summarize Warning/Suggestion findings. For Critical, give location and recommendation; ask fix, continue, or stop.

   Use CLI `dormancy`: `triggered` runs `spectra drift <name> --json` before tasks; `fresh` skips full drift; `unknown` reports its reason. Surface findings; continue authorized apply unless a new decision is needed. Core owns dates/history.

   **Context validity**: if full required content remains loaded with matching version/content fingerprints, reuse without another identical file read. On file changes, when compaction removes needed content, or if identity is uncertain, reload affected content before editing or checking. Necessary rereads remain allowed. With matching identities for relevant source/tests/config/environment and recorded command/scope/result source, reuse valid results without rerunning the gate; missing or stale evidence remains unverified and needs affected checks.
4. **Read context and project preferences**

   Read `contextFiles` and `.spectra.yaml`, using the context validity rule:

   - `tdd: true`: fetch `spectra instructions --skill tdd` once; use Red-Green-Refactor per task.
   - `audit: true`: use Scoundrel, Lazy Developer, and Confused Developer lenses for safe defaults, type confusion, and silent failure.
   - Dispatch together those pending tasks whose prerequisites are all complete and which share no dependency edge with each other. Grouping does not depend on tasks being adjacent in the file. Where the environment lacks parallel execution, run them in order without reporting an error.

   Display schema, pending tasks, `progress.complete`/`progress.total` and `progress.remaining`; checkboxes are task truth, CLI provides totals.

5. **Implement pending tasks**

   Follow task order unless parallel dispatch applies.

   **Parallel worker packet** (one task):

   - task ID and complete description
   - allowed scope and target files
   - relevant Implementation Contract excerpt
   - relevant Requirement, Scenario, and Example blocks
   - verification commands
   - active TDD and audit flags

   Exclude unrelated tasks, complete proposal, complete design, and unrelated spec set. Workers must not run `spectra task start` or `spectra task done`; return touched files, verification evidence, unresolved blockers. Missing/conflicting context: stop without guessing; main supplies relevant excerpts or reports the blocker.

   **Main-thread completion**

   Only the main thread attributes tasks. Before dispatch/edits: `spectra task start --change "<name>" <task-id>`. After verification: `spectra task done --change "<name>" <task-id> --file <path>`; repeat `--file` for every worker-reported touched path. Incomplete work stays pending.

   For every task:

   1. Announce; review task/design/specs under context validity. **Read the Implementation Contract for this task before editing any source file.** If absent, use `tasks.md`; unclear criteria block work.
   2. For `## Design Source`, read `.spectra/design-cache/<name>/*.dc.html` under the validity rule. Missing source: pause and ask to re-provide it; never guess visual values.
   3. A path-only/vague task, contract conflict or refuted premise (disproved savings/mechanism) blocks work. Pause, report evidence and propose an artifact update; never edit artifacts silently.
   4. Check reuse/patterns, scope, efficiency/placeholders; first TDD tests use `##### Example:` GIVEN/WHEN/THEN values.
   5. Capture the baseline as above.
   6. Make minimal code changes.
   7. **Verify before marking done**: review `tasks.md` and Implementation Contract under the validity rule; every requirement and named target must pass. Passing verification does not settle a refuted premise.
   8. With a baseline: `spectra task done --change "<name>" <task-id>`. Otherwise repeat `--file <path>` for attributable source/tests. With no baseline or explicit files, update only the checkbox; never attribute the whole dirty tree.

   **Classify failures before pausing**:
   - Expected behavioral RED: retain the failure evidence and continue to GREEN.
   - Setup/syntax failure is not RED; repair in-scope causes and retry the focused test.
   - Recoverable compile/test failures: at most 2 evidence-driven repair attempts; rerun only affected commands. Stop when the same failure recurs without new evidence.
   - Exhausted repair, missing external capability, unresolved contract or refuted task premise: report observations, repairs and next decision as a blocker; never edit artifacts silently. Pause on user interruption.

6. **Final check**

   Run `spectra instructions apply --change "<name>" --json --summary`. If state is `all_done`, do not request instructions again. Run `spectra instructions apply --change "<name>" --json --compact` only when state is not `all_done` to resume.

   **Check that every spec scenario has a test** (`tdd: true` only): classify each delta specs `#### Scenario`/`##### Example` under `/spectra-verify` **Scenario Coverage**/**Example Traceability** into exactly one of three results: covered by a test, excluded by the test scope criterion (`spectra instructions --skill tdd`), or an uncovered gap. For each exclusion, report the ground for exclusion and leave it out of the gaps/test recommendations. Recommend gap fixes or report "every scenario has a test or a recorded exclusion". This check does not block completion. When `tdd` is not `true`, skip this audit entirely and proceed to the completion report unchanged.

7. **Report status**

   Show this session's completed tasks and N/M. If all done: recommend `/spectra-verify <name>` and `/spectra-review <name>` before `/spectra-archive`.

   Completion line: "All tasks complete! Run `/spectra-verify <change-name>` and `/spectra-review <change-name>` before archiving with `/spectra-archive`."

**Guardrails**: use CLI paths/totals, keep edits scoped, update checkboxes immediately after verification, and continue until done or blocked.
