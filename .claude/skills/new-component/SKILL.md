name: new-component
description: Create any new React component in src/components following TaskBoard conventions (folder, component, test, index export). Use whenever a new UI component is needed — including as part of implementing a larger feature (e.g. a picker, list, badge, modal, form, button). Not for editing existing components.

Read `references/component-rules.md`.
Create a folder at `src/components/<Name>/` using the templates found in `templates/`.
Define props using a separate type, `<Name>Props`; do not use `any`.
Include a test covering rendering, core interactions, and accessibility (via roles).
Copy the templates from `templates/` and substitute `{{Name}}`, `{{kebab-name}}`, `{{Description}}`, and `{{base-classes}}`. Replace `div` elements with semantic HTML elements. Replace every `it.todo` with an actual test; no `todo`s should remain.
Run `npm run test -- <Name>` and `npm run typecheck`.