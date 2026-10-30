# TaskBoard
A Kanban board built with React 19, TypeScript, and Vite. No backend; data is stored in localStorage.

## Commands
- Checks before completing a task: `npm run lint && npm run typecheck && npm run test -- --run`
- Running a single test: `npm run test -- --run <path to file>`
- Do not run `npm run dev` — I am keeping the server running myself; it’s available at :5173

## Architecture
- src/components/ — UI components (one component per folder)
- src/features/<feature>/ — features (components, store, and tests)
- src/store/ — Zustand stores

## Rules
- Use only functional components; no `any` types allowed.
- Styles must be implemented using Tailwind CSS only.
- New dependencies may only be added after approval from me.