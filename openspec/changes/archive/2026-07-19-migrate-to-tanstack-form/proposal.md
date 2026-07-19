## Summary

Replace all form handling in the extension — the `@autoform/*` schema-driven layer on the options page and the `react-hook-form`-based search-engine form — with hand-written `@tanstack/react-form` forms, keeping zod for validation. Remove `react-hook-form`, `@hookform/resolvers`, `@autoform/react`, and `@autoform/zod` entirely, and replace the shadcn `ui/form.tsx` wrapper (which is react-hook-form-`Controller`-coupled) with the newer shadcn `Field` primitive (`Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`), which has no form-library coupling.

## Motivation

The options page renders a single form with two fields (`url`, `apiKey`), but relies on `@autoform/react` and `@autoform/zod` to do so. Autoform's schema-driven model requires ~13 custom files (a wrapper `AutoForm`, `types.ts`, and 11 field/wrapper components) to render those two fields, and only `StringField` plus the custom `UrlWithApiKeyLinkField` are ever reached by the schema.

Adding custom field UI is unintuitive under autoform: the API-key link button required inventing a `fieldType: 'urlWithApiLink'` string in the zod schema via `fieldConfig()`, registering a matching component in a field-type map, and threading it through autoform's provider — three indirections to render one button.

The indirection also hides a defect. `UrlWithApiKeyLinkField` keeps its own `useState` for the URL and passes `onChange={handleChange}` after spreading `inputProps`, which overrides autoform's own `onChange`. The local state and autoform's form value therefore diverge: editing the URL updates the button link but not the value submitted through `handleSubmit`. A single `field.state.value` in TanStack Form removes this class of bug by construction.

Beyond the options page, `src/entrypoints/options/routes/_search-engines/search-engines.apply.tsx` uses `react-hook-form` + `@hookform/resolvers/zod` through the shared shadcn `ui/form.tsx` wrapper (`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`). Keeping that form on `react-hook-form` while the options form moves to TanStack Form would leave two form libraries in the codebase for no reason — `react-hook-form` has no other consumers once the options form migrates. shadcn has since replaced the `react-hook-form`-coupled `Form` wrapper with a library-agnostic `Field` primitive (`Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`) designed to pair with any form library including TanStack Form, so migrating the search-engine form the same way removes the dependency cleanly instead of leaving an orphaned single-consumer wrapper.

## Proposed Solution

- Add `@tanstack/react-form` as a dependency; remove `@autoform/react`, `@autoform/zod`, `react-hook-form`, and `@hookform/resolvers`.
- Rewrite the options schema in schemas/options.ts to plain zod (`z.url()`, `z.string()`), dropping all `fieldConfig()` UI metadata. `LooseOptionsSchema` is unchanged.
- Rewrite the options route component to a hand-written TanStack Form using `useForm` with zod validation (via standard-schema), rendering two shadcn `Field`/`Input` fields and the API-key link button wired to the URL field's `field.state.value`.
- Rewrite `search-engines.apply.tsx` to a hand-written TanStack Form using `useForm` with zod validation, rendering the search-engine `Select` field through shadcn `Field`/`FieldLabel`.
- Add the shadcn `Field` primitive (`src/components/ui/field.tsx`: `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`, and any sibling exports the shadcn CLI generates) via `pnpm dlx shadcn@latest add field`, and delete `src/components/ui/form.tsx`.
- Delete the entire autoform directory (the wrapper `AutoForm`, `types.ts`, index, and all field/wrapper components).
- Preserve existing submit behavior on both forms: options page (permission request, `orpc.checkInstance` fetch, `optionsAtom` persistence, `sonner` toasts) and search-engine form (`requestUserSitePermission`, navigate to `/search-engines`).
- Remove the stray `console.log` calls in the options route component and the search-engine apply route component.

## Non-Goals

- No change to validation semantics — zod remains the source of truth for field validation.
- No change to submit-side logic (permission flows, orpc call, jotai persistence, toasts, navigation).
- No generic/reusable form abstraction — the codebase has two forms, both written directly against `@tanstack/react-form` and shadcn `Field`, not behind a schema-to-field layer.
- No change to `LooseOptionsSchema`, `enableFormSchema`, or any consumer outside the two form routes.

## Alternatives Considered

- Keep autoform and only fix the `UrlWithApiKeyLinkField` state bug: leaves the schema-UI coupling and multi-file indirection that motivated the change.
- Use `react-hook-form` directly for the options form (already a dependency): rejected — TanStack Form's API was preferred, and keeping `react-hook-form` around for one form while retiring it from the other leaves the same dependency for no benefit. Migrating the search-engine form too lets `react-hook-form` and `@hookform/resolvers` be removed entirely.
- Keep `ui/form.tsx` (the `react-hook-form`-coupled shadcn `Form` wrapper) for the search-engine form only: rejected — it has no purpose once `react-hook-form` is removed, and shadcn's own `Field` primitive is the direct replacement for both forms.

## Impact

- Affected specs: none (no user-facing behavior change; existing `bookmark-search-result` spec is unrelated).
- Affected code:
  - Added:
    - src/components/ui/field.tsx (shadcn `Field` primitive, generated via `pnpm dlx shadcn@latest add field`)
  - Modified:
    - src/schemas/options.ts
    - src/entrypoints/options/routes/_layout/index.tsx
    - src/entrypoints/options/routes/_search-engines/search-engines.apply.tsx
    - package.json
  - Removed:
    - src/components/ui/form.tsx
    - src/components/ui/autoform/AutoForm.tsx
    - src/components/ui/autoform/index.ts
    - src/components/ui/autoform/types.ts
    - src/components/ui/autoform/components/ArrayElementWrapper.tsx
    - src/components/ui/autoform/components/ArrayWrapper.tsx
    - src/components/ui/autoform/components/BooleanField.tsx
    - src/components/ui/autoform/components/DateField.tsx
    - src/components/ui/autoform/components/ErrorMessage.tsx
    - src/components/ui/autoform/components/FieldWrapper.tsx
    - src/components/ui/autoform/components/Form.tsx
    - src/components/ui/autoform/components/NumberField.tsx
    - src/components/ui/autoform/components/ObjectWrapper.tsx
    - src/components/ui/autoform/components/SelectField.tsx
    - src/components/ui/autoform/components/StringField.tsx
    - src/components/ui/autoform/components/SubmitButton.tsx
    - src/components/ui/autoform/components/UrlWithApiKeyLinkField.tsx
