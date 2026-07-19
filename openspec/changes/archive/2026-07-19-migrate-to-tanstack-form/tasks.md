## 1. Dependency swap

- [x] 1.1 Add `@tanstack/react-form` to dependencies and remove `@autoform/react` and `@autoform/zod` from package.json; verify with `pnpm install` succeeding and `rg '@autoform' package.json` returning no matches.
- [x] 1.2 Confirm no remaining source imports of `@autoform/*` originating from the removed form layer; verify with `rg '@autoform' src/` returning no matches.

## 2. Schema simplification

- [x] 2.1 Rewrite schemas/options.ts so `InstanceOptionsSchema` uses plain zod (`z.url()` for `url`, `z.string()` for `apiKey`) with no `fieldConfig()` calls and no `@autoform/zod` import, while keeping `LooseOptionsSchema` and the `InstanceOptions` type export unchanged; verify with `pnpm typecheck` passing and `rg 'fieldConfig|@autoform' src/schemas/options.ts` returning no matches.

## 3. Add shadcn `Field` primitive

- [x] 3.1 Add the shadcn `Field` component to the project via `pnpm dlx shadcn@latest add field`, producing `src/components/ui/field.tsx` exporting `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup` (and any sibling exports the CLI generates); verify with `test -f src/components/ui/field.tsx` succeeding and `pnpm typecheck` passing.

## 4. Options form rewrite

- [x] 4.1 Rewrite the options route component in the options `_layout` index route to use `@tanstack/react-form` `useForm` with zod standard-schema validation, rendering `url` and `apiKey` as shadcn `Field`/`Input` fields (apiKey as a password input), seeded from `optionsAtom`; verify with `pnpm typecheck` passing and manual load of the options page showing both fields pre-filled from stored options.
- [x] 4.2 Render the API-key link button reading the live URL field value via `field.state.value` (disabled when empty, opening `<url>/settings/api-keys` in a new tab); verify manually that typing a new URL immediately enables/updates the button link with no stale-value divergence.
- [x] 4.3 Preserve submit behavior on the form's `onSubmit`: run the permission `requestOrigin` flow, call `orpc.checkInstance`, persist via `setOptions` on success with a "Config Saved" toast, and show the invalid-config toast on failure/error; verify manually that a valid config saves with the success toast and an invalid one shows the error toast.
- [x] 4.4 Remove the stray `console.log` calls from the options route component; verify with `rg 'console\.log' src/entrypoints/options/routes/_layout/index.tsx` returning no matches.

## 5. Search-engine apply form rewrite

- [x] 5.1 Rewrite `search-engines.apply.tsx` to use `@tanstack/react-form` `useForm` with `enableFormSchema` zod validation, rendering the `searchEngine` `Select` field wrapped in shadcn `Field`/`FieldLabel` (replacing `Form`/`FormField`/`FormItem`/`FormLabel`/`FormControl` from `ui/form.tsx`); verify with `pnpm typecheck` passing and manual load of the apply page showing the search-engine select with its label.
- [x] 5.2 Preserve submit behavior on the form's `onSubmit`: call `requestUserSitePermission({ id: value.searchEngine, url })` then `navigate({ to: '/search-engines' })`; verify manually that selecting an engine and submitting navigates back to `/search-engines`.
- [x] 5.3 Remove the stray `console.log` call from the search-engine apply route component; verify with `rg 'console\.log' src/entrypoints/options/routes/_search-engines/search-engines.apply.tsx` returning no matches.

## 6. Remove autoform and react-hook-form layers

- [x] 6.1 Delete the entire src/components/ui/autoform directory (wrapper, types, index, and all field/wrapper components); verify with `test ! -d src/components/ui/autoform` succeeding.
- [x] 6.2 Delete src/components/ui/form.tsx (the react-hook-form-coupled shadcn `Form` wrapper); verify with `test ! -f src/components/ui/form.tsx` succeeding.
- [x] 6.3 Remove `react-hook-form` and `@hookform/resolvers` from package.json dependencies; verify with `pnpm install` succeeding and `rg '"react-hook-form"|"@hookform/resolvers"' package.json` returning no matches.
- [x] 6.4 Confirm no remaining source imports of `react-hook-form` or `@hookform/resolvers`; verify with `rg 'react-hook-form|@hookform/resolvers' src/` returning no matches.

## 7. Verification

- [x] 7.1 Confirm the full project is green after migration; verify with `pnpm typecheck`, `pnpm lint`, and `pnpm build` all passing.
