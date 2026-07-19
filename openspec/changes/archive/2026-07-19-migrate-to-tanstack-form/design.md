## Context

The options page renders one form (`url`, `apiKey`) via `@autoform/react` + `@autoform/zod`, backed by ~13 custom field/wrapper files. The search-engine "apply" page renders a second form (`searchEngine` select) via `react-hook-form` + `@hookform/resolvers/zod`, backed by the shared shadcn `ui/form.tsx` wrapper (`Form`/`FormField`/`FormItem`/`FormLabel`/`FormControl`, built on `react-hook-form`'s `Controller`). This change replaces both with hand-written `@tanstack/react-form` forms while keeping zod for validation, and replaces `ui/form.tsx` with shadcn's newer, form-library-agnostic `Field` primitive. The API details below were confirmed against current TanStack Form docs (context7 `/tanstack/form`, v1.11.0), the project's zod v4, and current shadcn `Field`/TanStack Form integration docs (context7 `/websites/ui_shadcn`, `docs/forms/tanstack-form` and `docs/components/base/field`) to remove implementation guesswork before apply.

## Goals / Non-Goals

**Goals:**

- Replace autoform with a directly-authored TanStack Form for the two-field options form.
- Replace `react-hook-form` with a directly-authored TanStack Form for the search-engine select form.
- Replace `ui/form.tsx` with the shadcn `Field` primitive (`Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`) for both forms' layout/error display.
- Keep zod (`InstanceOptionsSchema`, `enableFormSchema`) as the single validation source for each form.
- Eliminate the `UrlWithApiKeyLinkField` dual-source-of-truth defect by reading one field value.
- Remove `react-hook-form` and `@hookform/resolvers` from dependencies once both forms migrate.
- Pin down the exact v1 API so apply needs no further research.

**Non-Goals:**

- No change to validation semantics or submit-side logic (permission flows, orpc call, jotai persistence, toasts, navigation).
- No generic/reusable form abstraction — each form is hand-written against `@tanstack/react-form` + `Field`.
- No change to `LooseOptionsSchema`, `enableFormSchema`, or consumers outside the two form routes.

## Decisions

### Pass the zod schema directly to `validators` — no adapter package

TanStack Form v1 consumes zod natively through the Standard Schema spec. The zod schema is passed straight to `validators.onChange`; there is no `@tanstack/zod-form-adapter` (that existed only in v0). Dependency additions are limited to `@tanstack/react-form`.

```tsx
const form = useForm({
  defaultValues: initialValues,
  validators: { onChange: InstanceOptionsSchema },
  onSubmit: async ({ value }) => {
    /* existing submit logic */
  },
})
```

### One source of truth per field via `form.Field` + `field.state.value`

Each field renders inside `form.Field`; the input reads `field.state.value` and writes through `field.handleChange`. The API-key link button reads the **same** `field.state.value` from within the URL field's render, so the local-state divergence in the old `UrlWithApiKeyLinkField` is structurally impossible.

```tsx
<form.Field
  name="url"
  children={(field) => (
    <Field data-invalid={field.state.meta.isTouched && !field.state.meta.isValid}>
      <FieldLabel htmlFor={field.name}>URL</FieldLabel>
      <div className="flex gap-1">
        <Input
          id={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
        />
        {/* API-key button reads field.state.value — disabled when empty */}
      </div>
      <FieldError errors={field.state.meta.errors} />
    </Field>
  )}
/>
```

### Submit through `form.handleSubmit()`; `onSubmit` receives raw `value`

The `<form>` element's submit handler calls `event.preventDefault()` then `form.handleSubmit()`. The existing async chain (requestOrigin then `orpc.checkInstance` then `setOptions` then toasts) moves into `useForm({ onSubmit })`. No zod `.transform()` is present, so `value` needs no post-parse; it is already `InstanceOptions`-shaped. The search-engine form follows the same shape: its existing async chain (`requestUserSitePermission` then `navigate`) moves into `useForm({ onSubmit })`, receiving `{ value: EnableForm }`.

### Optional: gate the Save button on submit state

The Save button can subscribe via `form.Subscribe` on `[state.canSubmit, state.isSubmitting]` to disable/label during submission. This is a nicety, not required to preserve current behavior.

### Replace `ui/form.tsx` with shadcn `Field` — no form-library coupling

shadcn's current `Field` component (`Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`, plus `FieldSet`/`FieldLegend`/`FieldSeparator` if the CLI generates them) has no dependency on `react-hook-form` — it is plain layout/typography/accessibility markup that any form library's field state can drive. It replaces `ui/form.tsx`'s `Form`/`FormField`/`FormItem`/`FormLabel`/`FormControl`/`FormDescription`/`FormMessage`, which are hard-coupled to `react-hook-form`'s `Controller` and `useFormContext`. Add it with `pnpm dlx shadcn@latest add field` (writes `src/components/ui/field.tsx`), matching the project's existing `components.json` aliases. `FieldError` accepts either a `children` message or an `errors` array shaped `Array<{ message?: string } | undefined>` — TanStack Form's `field.state.meta.errors` is passed directly; set `data-invalid` on the enclosing `Field` and `aria-invalid` on the input from `field.state.meta.isTouched && !field.state.meta.isValid`, per current shadcn TanStack Form docs.

For the search-engine form's `Select` field, `Field`/`FieldLabel` wrap the existing `Select`/`SelectTrigger`/`SelectContent`/`SelectItem` markup the same way `FormItem`/`FormLabel`/`FormControl` did — only the wrapper changes, not the `Select` usage itself. `field.handleChange` replaces `field.onChange` from the `Controller` render prop, and `field.state.value` replaces `field.value`.

## Implementation Contract

- **Behavior (options page):** Shows two inputs (URL, API key as password), pre-filled from `optionsAtom`. Typing a URL immediately enables the API-key button and updates its target to `<url>/settings/api-keys`. Saving a valid config persists it and shows the "Config Saved" toast; an invalid config (failed permission, non-ok `checkInstance`, or thrown error) shows the invalid-config toast and does not persist.
- **Behavior (search-engine apply form):** Shows a `Select` of `availableSearchEngine` options with a label. Submitting with a selected engine calls `requestUserSitePermission({ id, url })` then navigates to `/search-engines`. No behavior change from today.
- **Interface / data shape:** Options — `useForm({ defaultValues: InstanceOptions, validators: { onChange: InstanceOptionsSchema }, onSubmit })`; `onSubmit` receives `{ value: InstanceOptions }`. `InstanceOptionsSchema` becomes plain zod (`z.url()`, `z.string()`) with no `fieldConfig()`. Search-engine form — `useForm({ defaultValues: { searchEngine: '' } satisfies EnableForm, validators: { onSubmit: enableFormSchema }, onSubmit })`; `onSubmit` receives `{ value: EnableForm }`.
- **Failure modes:** Submit-side failures surface exactly as today via `sonner` toasts (options) or the existing permission/navigation flow (search-engine); validation errors from zod render inline per field via `FieldError`. No silent swallowing beyond the existing try/catch around the options submit chain.
- **Acceptance criteria:** `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass; `rg '@autoform|react-hook-form|@hookform/resolvers|fieldConfig' src/` returns no matches; the autoform directory and `src/components/ui/form.tsx` are gone; `src/components/ui/field.tsx` exists; manual check confirms options pre-fill/live API-key button/both toast paths, and search-engine form select + submit navigation.
- **Scope boundaries:** In scope — schemas/options.ts, the options `_layout` index route, `search-engines.apply.tsx`, `src/components/ui/field.tsx` (added), `src/components/ui/form.tsx` (removed), package.json, and deletion of the src/components/ui/autoform directory. Out of scope — every other form-free part of the app, `LooseOptionsSchema`, and `enableFormSchema`'s validation rules.

## Risks / Trade-offs

- **Losing declarative field metadata in the schema:** `label`/`description`/`inputProps` move from `fieldConfig()` into JSX. Accepted — it decouples validation from UI and is the stated motivation.
- **Manual field wiring vs. schema generation:** hand-written fields do not scale to many forms, but the codebase has exactly two forms, so YAGNI applies.
- **Version drift:** TanStack Form API confirmed against v1.11.0; shadcn `Field` confirmed against current shadcn docs (context7 `/websites/ui_shadcn`). If a different major installs, re-verify `validators` / Standard Schema support and the `Field`/`FieldError` prop contract before apply.
- **`pnpm dlx shadcn@latest add field` behavior at apply time:** the CLI may prompt or overwrite unrelated files. Mitigation — run it and diff the result against `components.json` aliases before committing; only `src/components/ui/field.tsx` (and its direct exports) is expected to change.
