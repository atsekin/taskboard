name: add-feature
description: Plan and implement a new user-facing feature for TaskBoard end-to-end — store changes, components, tests, and browser verification (e.g. a new card attribute, a new picker/control on the card form). Use when the user asks to add functionality to cards/columns/board, not for isolated bugfixes or pure refactors. For creating a single standalone UI component in isolation, use new-component instead.

## 1. Plan first
- Read `CLAUDE.md` and the relevant store/component files before proposing anything.
- Identify ambiguous points (data shape, UX, naming, visual treatment, what counts as a breaking vs. additive data change) and ask the user with `AskUserQuestion` rather than guessing — do this in plan mode, before writing code.
- Prefer extending an existing type/mechanism over adding a parallel one when it keeps the data model uniform (e.g. widen `Tag` with an optional `group` field instead of adding a separate `Card.priority` field).

## 2. Store layer (`src/store/boardStore.ts`)
- Add new constants/types next to the existing ones they extend (e.g. `TAG_TITLES` → `PRIORITY_TITLES`); keep them colocated, not in a new file.
- Any cross-field invariant (e.g. "only one tag per group") belongs in the store as a small exported pure function, enforced inside the relevant action(s) (`addCard`/`updateCard`) — don't leave it to the UI to maintain alone.
- Persistence-safety check, every time: a new *optional* field on an already-persisted shape is safe as-is, as long as every read of it treats `undefined` as "no value" — no `migrate`/`version` bump needed. A new *required* field, or any unguarded read of the new field, needs a `migrate` function and a `version` bump. State explicitly which case applies before writing code.
- Add store-level tests for the new action behavior, plus a direct unit test of any new exported helper function.

## 3. Components (`src/components/`)
- For a new standalone picker/display, follow the `new-component` skill — it must not touch the store directly; it takes data via props (`selected`/`onChange`/`className`-style).
- Reuse existing interaction idioms rather than inventing new ones — e.g. a new single-select control should mirror an existing multi-select picker's toggle-button pattern (`role="group"`, `aria-pressed`, click-the-active-option-to-clear) rather than introducing a different pattern like native radios.
- Wire the new component into whichever component already owns this data flow (e.g. `CardForm` for form inputs, `CardItem`/`TagList` for display). Keep the prop signatures of components further up the tree (`CardItem`, `Column`) unchanged wherever possible.

## 4. Tests
- Updating an existing assertion to include a newly-added field is an adaptation, not "weakening" the test — do it whenever that field is now genuinely part of the shape under test.
- Every new file gets its own test file. Cover: rendering, the core interaction, the clear/empty state, and keyboard operability for interactive components.

## 5. Verify
- Run `npm run lint && npm run typecheck && npm run test -- --run`; all must pass before calling the feature done.
- Don't start a new dev server — one is already running at :5173 per `CLAUDE.md`. Use the Chrome extension to exercise the feature end-to-end: confirm a pre-existing localStorage record (one predating this change) still loads without a blank-screen crash, and confirm the new data survives a page reload.
