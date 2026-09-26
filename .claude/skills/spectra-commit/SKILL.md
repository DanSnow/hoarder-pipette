---
name: spectra-commit
description: "Commit only files belonging to an identified Spectra change. Use when an identified Spectra change's work is ready to commit while unrelated edits remain in the dirty tree"
argument-hint: "[change-name]"
license: MIT
compatibility: Requires spectra CLI.
metadata:
  author: spectra
  version: "1.0"
  generatedBy: "Spectra"
---

Commit files related to a specific Spectra change.

This is a **utility skill** (not a workflow step). It reads source file tracking data and artifact changes to stage and commit only the files belonging to one change — useful when multiple changes are in progress simultaneously.

**Input**: Optionally specify a change name after `/spectra-commit` (e.g., `/spectra-commit add-auth`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Prerequisites**: This skill requires `git`. Run `git --version`. If git is not available (command not found or similar error), inform the user to install git and STOP.

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
   - If `spectra list --json` returns an empty active list, inform the user there is no active change to commit. Suggest creating one with `/spectra-propose` or restoring a parked change with `spectra unpark <name>`, then STOP
   - If ambiguous, run `spectra list --json` AND `spectra list --parked --json` to get all available changes (including parked ones). Every parked change MUST be annotated with "(parked)" in the selection list, so the user never picks one without knowing. Ask the user to select using structured input if available; otherwise ask in plain text and wait for the response
   - If the user cancels the selection, end immediately — do not run any git operations

   Always announce: "Committing for change: <name>"

2. **Read and verify tracking data**

   Run `spectra scope --json` once for current staged, unstaged and untracked paths and patches. Cache its `snapshot_id` and HEAD. Combine this current-worktree scope with the original task provenance below; historical committed-only paths are not pending commit content. A scope or tracking parse error stops planning.

   Check for `.spectra/touched/<change-name>.json`. If it exists, parse it to get source files grouped by task.

   Preserve each entry's task-baseline or explicit-file provenance. Treat a legacy entry without task provenance as **unverified**: show it separately and keep it excluded unless the user explicitly includes it. If the file does not exist, proceed without source file data — only artifact files will be included.

3. **Collect artifact files**

   Use cached scope `path` and `old_path` entries under `openspec/changes/<name>/` as artifact files. If Git status is needed, parse `git status --porcelain=v1 -z` as NUL records with both rename paths, treating whitespace/newlines as filename data. Cache the proposal summary and task progress for both normal and archive commit messages.

4. **Identify unrelated and shared files**

   From the cached scope, any dirty files NOT in the artifact set and NOT in the tracking file are "unrelated changes."

   Load `spectra list --json` if the step 1 active list was not needed for selection. For each OTHER change in that active list (never enumerate `.spectra/touched/` — it can hold stale files from archived changes), read its `.spectra/touched/<other>.json`; skip missing or unparseable files silently. Files of this commit that also appear there are "shared files"; record which changes track them.

5. **Display commit plan**

   Capture HEAD, candidate worktree bytes/type/mode and index entries (including intent-to-add and other flags). Show complete candidate differences against HEAD, including staged and unstaged content and full new-file content. Shared, legacy or otherwise mixed work stays excluded until the user confirms its complete content explicitly.

   Show the file list grouped into sections:

   Use these sections: Change Artifacts; verified Source Files grouped by task; Unverified Legacy Tracking (not included); Shared with other active changes (not included by default — annotate each file with the tracking change names and require an explicit include/exclude decision at confirmation); and Unrelated Changes (not included). Show each path with its Git status.

   If no tracking file was found, warn that no source file tracking data exists and only artifact files will be committed.

   If there are no artifact files and no included verified source files, inform the user that there is nothing to commit and STOP.

   **Generate commit message**

   Run `git log -10 --no-merges` (full format, not `--oneline`) and observe the repository's commit conventions: subject style (prefix, language, tense) and body usage (presence, paragraphs or bullets).

   Use the cached proposal summary and cached task progress as content. If no archive occurred, the cache still represents the active change; if archive occurred, do not re-read the moved active path.

   Write the subject and body following the observed conventions. If the archive sub-flow ran, state in the body that the change was archived, phrased in the repository's style. Only when no clear convention is observable (too few commits, inconsistent styles, or `git log` failure), fall back to this fixed format, omitting `Archived: yes` when the archive sub-flow did not run and deriving `<summary>` from the proposal's Why section (first sentence):

   ```
   spectra(<change-name>): <summary>

   Change: <change-name>
   Tasks: <completed>/<total> complete
   Archived: yes
   ```

   Include the generated subject and full body in the plan below; accept message edits as plan changes.

6. **User confirmation**

   If the cached task progress shows all tasks complete, note that this change looks finished and recommend **Archive first, then commit together** (archive safety checks stay in the archive sub-flow).

   Display full candidate content and commit message together, with all exclusions, shared/legacy attribution and warnings. If the unchanged complete plan was already approved, proceed. Otherwise obtain explicit approval for this complete plan using structured input if available, or plain text. Silence is not approval.

   Options:
   - **Commit as shown**: Proceed with the displayed artifact + source files
   - **Include all dirty files**: Prepare the expanded content and message, then confirm the changed scope before execution
   - **Customize**: Let the user add or remove specific files from the commit set
   - **Archive first, then commit together**: Run archive before committing — archive file moves will be included in this commit

   For **Customize**, show a numbered included/excluded list, collect additions/removals, recompute and redisplay the complete content and message, then ask for **Commit as shown** or **Adjust again**. Repeat until explicitly confirmed or cancelled; cancellation performs no Git operation.

   If the user selects "Archive first, then commit together":
   - Fetch the archive sub-flow with `spectra instructions --skill commit-archive --agent claude` and execute it as step 6a before continuing to step 7. Do not perform any archive action from memory; the fetched sub-flow is the only source for step 6a.

7. **Retain the approved plan**

   Use the unchanged approved content and message; no message-only confirmation. After customization or archive-first, use the rebuilt plan and obtain approval only for changed scope, message or warnings. Then continue with its fresh snapshot and approved fingerprints.

8. **Prepare the confirmed paths and message**

   The commit includes each candidate's complete current content, including staged and unstaged changes. Use the complete plan approval for that content and message before execution. Use private temporary files outside the worktree: write each exact repository-relative file path followed by NUL to `<paths-file>`, and write the approved message to `<message-file>`. Write data through a file API and pass filenames as separate command arguments.

   Include deleted paths and both rename endpoints. Records contain raw paths: spaces, newlines, leading hyphens, non-ASCII bytes and pathspec magic are literal data. An unrepresentable path blocks planning.

   Keep unrelated index entries untouched. A path-limited commit uses worktree content, so the plan must expose partial staging and exclude mixed work unless its complete content was explicitly confirmed.

   Before preparation, check `spectra scope --check-snapshot "<snapshot_id>" --json` and compare the approved message and candidate fingerprints. Changed HEAD, content or index invalidates the plan; redisplay it for confirmation.

   Only candidates absent from both HEAD and the index need registration. Journal their absent preimages, write just those paths as NUL records to `<new-paths-file>`, and run this only when that list is nonempty:

   ```bash
   git --literal-pathspecs add --intent-to-add --pathspec-from-file="<new-paths-file>" --pathspec-file-nul
   ```

   Record the entries this operation actually created, including flags, even after an error. Preserve existing entries and pre-existing intent-to-add state. Compare all other index entries with the plan and candidate content again; only the journaled registration is an expected change. Any unexpected change stops execution and requires a fresh plan.

   **Cancellation or preparation failure:** With no registration, leave staging untouched. Otherwise acquire the actual Git index's `index.lock` exclusively. While holding it, compare each journaled entry with its written value; a mismatch leaves cleanup pending. Copy the *current* index to an owned temporary index, and run the following with `GIT_INDEX_FILE` pointing only to that copy and journaled paths supplied on stdin as NUL records:

   ```bash
   git --literal-pathspecs update-index --force-remove -z --stdin
   ```

   Publish that copy through the owned lock only after successful validation, preserving index permissions. This removes only registrations that were originally absent. Preserve concurrent entries; a busy lock or failed comparison leaves cleanup pending. Remove only locks and temporary files this workflow owns. Cancellation ends without committing.

9. **Commit**

   Immediately before commit, recheck HEAD, approved message, candidate bytes/type/mode and index entries against the plan plus journaled registrations. Any unexpected change invalidates confirmation: conditionally clean up owned registrations, display the new plan and wait. A busy index lock stops execution and stays owned by its writer.

   ```bash
   git --literal-pathspecs commit --only --pathspec-from-file="<paths-file>" --pathspec-file-nul -F "<message-file>"
   ```

   This native command limits the commit even when other paths are already staged. If Git lacks these options, report the unsupported version and stop. Keep repository hooks enabled.

10. **Verify and report the actual outcome**

    Retain Git exit status, stdout and stderr. Read and retain the resulting HEAD hash immediately, then verify its parent, tree diff, candidate blob identities/modes, message, worktree and unrelated index entries against the confirmed plan. Compare tree paths without rename detection so both rename endpoints are checked. Account for Git clean filters and message cleanup when comparing expected blobs/message; if their effects cannot be established before confirmation, stop planning. A path list or `git status` alone does not prove the content matches.

    - No new commit and Git failed: report the hook/error output and apply only the conditional registration cleanup above. If a hook changed candidate content, disclose its diff and invalidate confirmation. Preserve hook edits and unrelated staging; arbitrary hook side effects require separate owner handling.
    - A commit exists: show its actual hash and message. If its parent/tree/content differs, unrelated entries changed, or a later check/cleanup fails, report the commit hash and pending issue, including observed differences. Never retry commit, amend, reset or roll back that history automatically. A successful Git exit alone does not mean verification passed.
    - HEAD cannot be read, or a moved HEAD cannot be identified as this attempt's commit: report retained output/hash evidence and outcome unknown/pending. Resolve that uncertainty before any further commit attempt.

    Remove only owned temporary files. Report cleanup failures as pending alongside the actual commit outcome.

**Guardrails**

- Use the native path-limited command above; unrestricted commit, `git add .`, `git add -A`, reset, stash and `--no-verify` are forbidden shortcuts.
- **NEVER commit files the user hasn't confirmed** — always show the file list and get explicit confirmation first
- **Always show the full file list before committing** — no silent staging
- If the tracking file is missing, warn but don't block — artifact-only commits are valid
- The "Unrelated Changes" section is informational only — these files are excluded by default
- If structured input is not available, ask the same questions as plain text and wait for the user's response
