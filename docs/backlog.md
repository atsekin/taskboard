# Backlog

Issues found while refactoring `src/components` to the `new-component` standard (see `.claude/skills/new-component/references/component-rules.md`). Left unfixed intentionally — this was a structural refactor only, no behavior changes.

- [ ] **Modal** — No focus trap, no autofocus on open, and no focus-return to the triggering element on close/Escape. `component-rules.md` requires all three for modals.
  - Suggested improvement: on open, focus the first focusable element inside the dialog and cycle Tab/Shift+Tab within it; on close, restore focus to whatever element had focus before the modal opened.
  - Rough effort: M

- [ ] **CardForm** — Title and description fields are a plain `<input>`/`<textarea>` with no associated `<label>`.
  - Suggested improvement: generate ids with `useId()` and add `<label htmlFor>` elements (visible or `sr-only`) for both fields.
  - Rough effort: S

- [ ] **CardItem / Column** — Both call `useBoardStore` directly from `src/components/`. `component-rules.md` says store access belongs in a `src/features/` layer, which doesn't exist yet in this repo.
  - Suggested improvement: introduce `src/features/board/` and move store-reading/writing logic there, leaving `src/components/` purely props-driven.
  - Rough effort: L

- [ ] **Column** — Selects the entire `cards` array from the store and filters client-side on every render, instead of a narrower/memoized selector.
  - Suggested improvement: derive per-column card lists in the store itself, or memoize the filter (e.g. with `useMemo` or a per-column selector).
  - Rough effort: S

- [ ] **Board** — Imports `COLUMN_IDS`/`COLUMN_TITLES` constants directly from the store module.
  - Suggested improvement: pass these in as props from a feature-level wrapper, or re-export them from a neutral constants module outside the store.
  - Rough effort: S

## Card restyle leftovers (Figma frame 2:527, see `docs/design.md`)

- [ ] **TagList** — Figma shows the priority tag above the title; the app renders priority and category tags in one list after the title.
  - Suggested improvement: reorder with CSS `order`, or split into two lists (priority / category), updating the `aria-label="Tags"` tests accordingly.
  - Rough effort: S

- [ ] **CardItem** — No avatars (32x32, 8px gap) and no date (11px Poppins Regular, `#666`) — the app has no data for either.
  - Suggested improvement: add assignee and date fields to the `Card` type, with a persist `migrate`/version bump, then render them as in Figma.
  - Rough effort: M

- [ ] **CardItem** — The Move left/right, Edit and Delete row is not in Figma and still uses the old slate/red styling.
  - Suggested improvement: decide with design where these actions live (e.g. hover menu), then restyle with theme tokens.
  - Rough effort: S

- [ ] **Theme** — "Critical" priority has no Figma colour; `--color-priority-critical-bg: #9b1230` is a placeholder.
  - Suggested improvement: get the real value from design and update `src/index.css` and `docs/design.md`.
  - Rough effort: S

- [ ] **TagList** — Figma only defines Mobile (pink) and Web (purple); the app's tags don't include either, so Frontend/Design are pink (`--color-tag-accent-bg`) and the rest purple as a stand-in.
  - Suggested improvement: get a real per-category colour mapping from design (or add a colour field to tags).
  - Rough effort: S
