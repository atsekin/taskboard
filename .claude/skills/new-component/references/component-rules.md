# TaskBoard Component Rules

## Props
- Prop type definition: `<Name>Props`, declared using `type`, and exported.
- Event handlers: `on<Event>` in the props (e.g., `onSave`, `onDelete`); `handle<Event>` inside the component.
- Boolean props: Use names like `disabled` or `open` (avoid the `is` prefix, e.g., use `open` instead of `isOpen`).
- Limit to ~7 props; exceeding this is a sign that the component should be broken down.
- Always support a `className` prop to allow for external spacing/margins.

## Semantics and Accessibility
- Use only `<button>` (or `<a>` for navigation) for clickable elements—never a `div` with an `onClick` handler.
- Icon-only buttons must include an `aria-label`.
- Input fields must be linked to a `<label>` using `htmlFor`/`id` (use the `useId` hook).
- Modals: must have `role="dialog"` and `aria-modal`; focus should be trapped inside upon opening; they must close when the Escape key is pressed, and focus should return to the element that triggered the modal.
- Visible focus indicator: `focus-visible:ring-2 focus-visible:ring-blue-500`.

## Styles (Tailwind)
- Class order: layout → sizing → spacing → typography → colors → states.
- States via modifiers: `hover:`, `disabled:`, `aria-selected:`.
- Conditional classes: use `clsx` instead of template literals with ternary operators.
- Colors must come exclusively from the Tailwind palette; no arbitrary values ​​like `[#123456]`.

## State
- UI state (open/closed, input field text) — managed via `useState` within the component.
- Card and column data — retrieved solely from the Zustand store using selectors:
  e.g., `useBoardStore((s) => s.cards)` (do not access the entire store).
- Components in `src/components/` do not interact with the store directly; they receive data
  via props. Components in `src/features/` are responsible for interacting with the store.

## Tests
- Use `getByRole` or text-based queries to find elements; `getByTestId` should be a last resort.
- Mandatory coverage: component rendering, primary user interactions, keyboard navigation for interactive components, and empty states for lists.

## Don't
- `React.FC`, default exports, and using `useEffect` for derived values.
- Inline styles (`style={{...}}`).
- Introducing new UI libraries (such as headless UI components or icon sets) without prior approval.