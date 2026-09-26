---
name: spectra-archive
description: "Archive an identified, completed Spectra change and apply its delta specs. Use when an identified Spectra change has every task done and verified"
argument-hint: "[change-name]"
license: MIT
compatibility: Requires spectra CLI.
metadata:
  author: spectra
  version: "1.0"
  generatedBy: "Spectra"
---

Archive a completed change.

**Input**: Optionally specify a change name after `/spectra-archive` (e.g., `/spectra-archive add-auth`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Prerequisites**: This skill requires the `spectra` CLI. If any `spectra` command fails with "command not found" or similar, report the error and STOP.

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

   Use an explicit name first, then a unique confirmed conversation target. Otherwise list candidates and auto-select only one candidate; ask for the missing target when ambiguous. Use `spectra list --json` for active changes.

2. **Check artifact completion status**

   Run `spectra status --change "<name>" --json` to check artifact completion.

   Parse the JSON to understand:
   - `schemaName`: The workflow being used
   - `artifacts`: List of artifacts with their status (`done` or other)

   Retain incomplete artifact warnings for the complete plan after preview.

   **Quality gate pre-check**: Use only current conversation/session evidence; no persistent state file. If verification is unconfirmed, retain a recommendation to run `/spectra-verify <name>` and `/spectra-review <name>`. This advisory check MUST NOT block archive. Carry any earlier CRITICAL findings and their locations into the complete plan.

3. **Preview the archive transaction**

   Run one read-only preview:

   ```bash
   spectra archive <name> --preview --json
   ```

   Parse and display the preview's incomplete tasks, delta application plan, conflicts, and preview warnings together. Preview is the source of truth; do not manually apply delta specs or mutate tasks, metadata, specs, tracking, snapshots, or archive paths while analyzing it.

   If preview reports a blocking delta parse or validation error, display the error and STOP. You must not execute archive or stage files after a blocking preview error.

4. **Confirm the complete archive plan**

   Present incomplete artifacts and tasks, delta actions, conflicts, preview warnings, known CRITICAL findings with locations, cleanup implications and selected flags together. In this plan, list each CRITICAL finding with its location; allow archive anyway or quality checks first.

   - Incomplete tasks remain unchanged unless `--mark-tasks-complete` is explicitly chosen; declining archives with a warning.
   - Delta specs apply once during archive by default; explicitly skipping adds `--skip-specs`. With no delta specs, omit this choice. Never run standalone sync.
   - If the unchanged complete plan is already explicitly authorized, proceed without another confirmation. Otherwise collect missing choices and approval together against this plan. Silence or elapsed time cannot supply missing choices.
   - A changed plan invalidates affected approval: display its changes and obtain the missing authorization. If the user cancels, STOP without mutation.

5. **Check the approved plan**

   Confirm that current artifacts, tasks, deltas and selected flags still match the previewed plan. On changes, refresh affected evidence and return to step 4 before execution.

6. **Perform exactly one archive execution**

   Start from this single structured execution command:

   ```bash
   spectra archive <name> --json
   ```

   Insert confirmed `--mark-tasks-complete` and/or `--skip-specs` flags before `--json`, then execute the constructed command exactly once. Do not retry archive automatically.

   Parse the structured result. Use its `archived_id` and actual `archived_path`; never derive the archive path from the date or main project root. Show `cleanup_warnings` as post-success warnings. Non-empty cleanup warnings do not mean archive failed, but must remain visible in the summary.

   If archive fails, report the error and STOP. Do not perform caller-side cleanup. For an "already exists" error, suggest renaming the existing archive.

7. **Display summary**

   Show archive completion summary including:
   - Change name
   - Schema that was used
   - Archive location from `archived_path`
   - Delta application status (applied once / explicitly skipped / no delta specs)
   - Any incomplete artifact/task and `cleanup_warnings` warnings

**Output On Success**

```
## Archive Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** <archived_path returned by archive>
**Specs:** ✓ Applied once by core archive

All artifacts complete. All tasks complete.
```

**Output On Success With Warnings**

```
## Archive Complete (with warnings)

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** <archived_path returned by archive>
**Specs:** Delta application skipped (user chose to skip)

**Warnings:**
- Archived with 2 incomplete artifacts
- Archived with 3 incomplete tasks
- Delta application was skipped (user chose to skip)

Review the archive if this was not intentional.
```

**Output On Error (Archive Exists)**

```
## Archive Failed

**Change:** <change-name>
**Target:** <archive target reported by the error>

Target archive directory already exists.

**Options:**
1. Rename the existing archive
2. Delete the existing archive if it's a duplicate
3. Wait until a different date to archive
```

**Guardrails**

- Ask for a target only when identity is unresolved
- Use artifact graph (spectra status --json) for completion checking
- Don't block archive on warnings - just inform and confirm
- Preserve .openspec.yaml when moving to archive (it moves with the directory)
- Show clear summary of what happened
- Preview once before confirmation; execute the core archive transaction exactly once afterward
- Never apply delta specs outside core archive execution; `--skip-specs` is the only skip mechanism
- Never delete tracking data before archive; core post-success cleanup owns it
- Use returned `archived_id`, `archived_path`, and `cleanup_warnings`
- If structured input is not available, ask the same questions as plain text and wait for the user's response
