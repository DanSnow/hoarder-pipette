---
name: spectra-audit
description: "Perform an explicit security audit of changed code for dangerous defaults, type confusion, unsafe API surfaces, and silent failures. Use when that security audit is requested, not merely because a diff touches paths or config"
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

Audit changed code for security sharp edges in a Claude Code fork. This generated skill is report-only. Run only the standalone analysis below and return one consolidated report, then stop. Do not ask or wait for user input. Do not edit files, run rewriting formatters, stage, commit, apply fixes, or invoke a follow-up workflow.

## Claude fork context

The standalone body below is the complete report core. Missing decisions: return the concrete context and missing input to the main thread, then stop. The main thread decides whether to authorize any recommended fix.

---

Audit changed code for security sharp edges: APIs, defaults, and boundaries that make insecure use easier than secure use.

This standalone skill is report-only: do not mutate files, reformat, stage or commit. Return one consolidated report; the main thread decides whether to authorize a fix.

## Standalone Audit

### Phase 1: Capture and classify once

Run `spectra scope --json` once per valid snapshot. Add `--change "<name>"` only for an explicitly selected change and `--base "<revision>"` only for a supplied base. Keep the `snapshot_id`, paths, per-layer patches, revisions and limitations in the main analyzer. Include committed base-to-HEAD differences for named changes and staged, unstaged and untracked content; treat untracked text as added content. Preserve rename/deletion paths and provenance limits.

On command error, stop with the error. Status `empty` means no differences in the resolved scope. Status `insufficient`, binary or unreadable content means incomplete inspection: preserve the limitations and never claim a completed clean audit. Mark unclassifiable content uncertain. Label approximated scope explicitly.

From that snapshot, classify once whether the change touches a security-sensitive surface:

- public APIs, wire formats, or compatibility contracts
- configuration, defaults, feature flags, or permission policy
- authentication, authorization, sessions, secrets, or cryptography
- input validation, parsing, deserialization, or type conversion
- filesystem, process, network, or IPC boundaries
- error-handling paths that can fail silently or mask failure

Classify the audit as:

- **ordinary mode**: only non-sensitive presentation, documentation, tests, or internal behavior with no security-boundary effect
- **sensitive**: at least one changed hunk affects a surface above
- **uncertain**: the boundary or downstream effect cannot be classified confidently from the captured diff

Treat both sensitive and uncertain classifications as **deep mode**. Never use uncertainty to skip analysis.

### Phase 2: Apply the three lenses

#### Ordinary mode: one analyzer

Use one analyzer to apply the Scoundrel, Lazy Developer, and Confused Developer lenses in a single pass. Keep the work in the current analyzer and do not launch child agents.

#### Deep mode: filtered packets

Build a **filtered context packet** for each applicable lens. It may contain only:

- only the relevant diff hunk with file/line anchor
- minimum supporting declarations, types or callees
- relevant configuration, defaults, validation or boundary definitions
- tests that prove or challenge the behavior

Every packet MUST exclude unrelated hunks, including presentation, documentation or refactors unrelated to the sensitive boundary. Carry relevant limitations and use supporting reads from the same snapshot. Do not recapture scope per lens.

When parallel dispatch is available, launch up to three lens agents in one batch, each with only its filtered packet and lens.

**Sequential fallback:** Without parallel dispatch, run Scoundrel, Lazy Developer, then Confused Developer over the same filtered context. Merge evidence from all three lenses.

### Phase 3: Consolidate and report

Merge the lens results, deduplicate overlaps, and discard claims without defensible evidence. For each finding report:

- severity: Critical, High, Medium, or Low
- affected file and line anchor
- the changed behavior and supporting evidence
- a concrete failure scenario
- a recommended fix that removes or guards the trap
- the lens that found it

Before reporting, run `spectra scope --check-snapshot "<snapshot_id>" --json` with the same optional change/base arguments. On failure, discard the snapshot and findings, refresh and re-check; if scope stays unstable, report the limitation and stop.

Report `scope_source`, `base_revision`, `head_revision`, reviewed paths, limitations and ordinary mode or deep mode. Report no security sharp edges only when scope is sufficient and all selected content was inspected. Otherwise retain unverified content alongside any findings. End findings with a severity summary.

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

## Core Framework

Secure use should be the simplest path. Safety that depends on remembering rules or understanding a primitive creates a trap.

### Three Adversaries

**Scoundrel** — deliberate exploitation: disabled controls, algorithm downgrades, validation bypass, injected permissions or paths, and unsafe option combinations.

**Lazy Developer** — copy-paste and defaults: safe examples, fail-closed zero/nil/empty/missing/timeout values, and errors that guide secure use.

**Confused Developer** — accidental misuse: swappable parameters, untyped strings/bytes, accepted configuration typos, ignored results and failures that look successful.

### Sharp-edge categories

1. **Algorithm choice:** Replace obsolete, weak or no-op selectors with safe high-level operations.
2. **Dangerous defaults:** Reject missing, zero, empty or nil values that disable validation, authentication, expiry, retry limits or encryption; fail closed.
3. **Raw primitives:** Give keys, nonces, identities, paths and permissions distinct semantic types and validated constructors.
4. **Configuration cliffs:** Validate schemas; reject typos and option combinations that remove boundaries.
5. **Silent failures:** Expose swallowed errors, ignored false results and missing security material; make failure explicit.
6. **Stringly-typed security:** Replace concatenated queries, paths, permissions, commands and policies with structured values or constrained enums.

### Severity

- **Critical:** The default or most obvious use is insecure, or an unauthenticated path crosses a high-impact boundary.
- **High:** A likely configuration or API use defeats a security control.
- **Medium:** A less common but realistic misuse causes unsafe behavior.
- **Low:** Deliberate or unusual misuse is required, but the interface still creates a defensible trap.

Discard speculative findings. Documentation alone cannot repair a dangerous interface; make safe behavior the default or only path.
