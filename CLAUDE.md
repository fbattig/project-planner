# CLAUDE.md — Project Planner App

## Identity

This is **Project Planner**, a Next.js application that guides developers through a structured 5-step mental framework to transform a raw idea into a buildable software blueprint. It ships with a built-in "AI Help Desk" reference prototype so users always have a concrete example of what good output looks like at every step.

## Project Documentation

Read these files **in order** before writing any code:

1. `docs/SCOPE.md` — Problem statement, solution, and MVP boundaries
2. `docs/REQUIREMENTS.md` — Functional and non-functional requirements
3. `docs/DATABASE_SCHEMA.md` — SQLite schema, migrations, and data model
4. `docs/TECH_STACK.md` — Technology choices with rationale and version pins
5. `docs/UI_SPEC.md` — Layout system, component hierarchy, and design tokens
6. `docs/REFERENCE_DATA.md` — Full "AI Help Desk" prototype content for the reference panel
7. `docs/IMPLEMENTATION_PLAN.md` — Phased build roadmap with acceptance criteria

## Architecture Constraints

- **Framework:** Next.js 16 with App Router. No Pages Router.
- **Rendering:** Use Server Components by default. Mark components `"use client"` only when they need interactivity (forms, state, browser APIs).
- **Data layer:** SQLite via `better-sqlite3`. No ORMs. Raw SQL with parameterized queries.
- **Mutations:** Use Next.js Server Actions for all create/update/delete operations. No standalone API route handlers unless strictly necessary.
- **Styling:** Tailwind CSS v4. No CSS modules, no styled-components.
- **State:** URL search params and Server Component props for server state. React `useState`/`useReducer` only for local UI state (active step, form drafts).
- **No external services:** No external databases, no third-party auth, no paid APIs in the MVP.

## Code Style Rules

- TypeScript strict mode. No `any` types.
- File naming: `kebab-case` for files and folders.
- Component naming: `PascalCase` for React components.
- Prefer named exports over default exports for components.
- Co-locate related files: `components/step-wizard/step-wizard.tsx`, `components/step-wizard/step-wizard.types.ts`.
- Server Actions go in `app/actions/` with one file per domain (`project-actions.ts`).
- Database queries go in `lib/db/queries.ts`. Database connection in `lib/db/connection.ts`.
- Shared types in `lib/types/`.
- Validation with Zod schemas in `lib/validations/`.

## Testing Expectations

- Each Server Action should be testable in isolation.
- Database queries should be tested against an in-memory SQLite instance.
- UI components: manual visual review is acceptable for MVP.

## Common Pitfalls to Avoid

- Do NOT use `prisma`, `drizzle`, or any ORM. Use `better-sqlite3` directly.
- Do NOT create API route handlers (`route.ts`) for CRUD. Use Server Actions.
- Do NOT install a separate state management library (Redux, Zustand). The wizard step state lives in URL params or local `useState`.
- Do NOT add authentication in the MVP.
- Do NOT use `localStorage` for project data. All persistence goes through SQLite.
- Do NOT over-abstract early. Prefer duplication over the wrong abstraction.

## Folder Structure (Target)

```
project-planner/
├── CLAUDE.md
├── docs/
│   ├── SCOPE.md
│   ├── REQUIREMENTS.md
│   ├── DATABASE_SCHEMA.md
│   ├── TECH_STACK.md
│   ├── UI_SPEC.md
│   ├── REFERENCE_DATA.md
│   └── IMPLEMENTATION_PLAN.md
├── app/
│   ├── layout.tsx              # Root layout with font loading + global styles
│   ├── page.tsx                # Dashboard — list of saved projects
│   ├── projects/
│   │   ├── new/
│   │   │   └── page.tsx        # 5-step wizard for creating a project
│   │   └── [id]/
│   │       ├── page.tsx        # View a saved project plan
│   │       └── edit/
│   │           └── page.tsx    # Edit an existing project
│   └── actions/
│       └── project-actions.ts  # Server Actions for CRUD
├── components/
│   ├── step-wizard/            # The 5-step wizard and its sub-components
│   ├── reference-panel/        # "AI Help Desk" prototype reference guide
│   ├── dashboard/              # Project list, cards, empty states
│   └── ui/                     # Shared primitives (Button, Input, Card, etc.)
├── lib/
│   ├── db/
│   │   ├── connection.ts       # SQLite connection singleton
│   │   ├── queries.ts          # All SQL queries
│   │   └── migrations.ts       # Schema creation and migrations
│   ├── types/
│   │   └── project.ts          # TypeScript interfaces
│   ├── validations/
│   │   └── project-schema.ts   # Zod schemas
│   └── constants/
│       └── reference-data.ts   # "AI Help Desk" prototype content as typed constants
├── public/
└── tailwind.config.ts
```
