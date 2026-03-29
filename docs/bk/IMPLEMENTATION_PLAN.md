# Implementation Plan

Each phase builds on the one before it. Complete all acceptance criteria in a phase before starting the next.

---

## Phase 1: Project Scaffolding and Database

**Goal:** Running Next.js app with a working SQLite database and migration system.

### Tasks
1. Initialize Next.js 16 with TypeScript, App Router, and Tailwind CSS.
2. Install `better-sqlite3` and `@types/better-sqlite3`.
3. Install `zod` for validation.
4. Add `better-sqlite3` to `serverExternalPackages` in `next.config.ts`.
5. Create `lib/db/connection.ts` — a singleton that opens `./data/planner.db` and enables WAL mode and foreign keys.
6. Create `lib/db/migrations.ts` — runs the schema SQL from `DATABASE_SCHEMA.md` on first import.
7. Create `lib/types/project.ts` — TypeScript interfaces for `Project`, `ProjectPhase`, `ProjectWithPhases`, `ProjectListItem`.
8. Create `lib/validations/project-schema.ts` — Zod schemas matching the validation rules in `REQUIREMENTS.md`.
9. Create the `data/` directory and add it to `.gitignore`.
10. Verify: app starts with `npm run dev`, database file is created, tables exist.

### Acceptance Criteria
- [ ] `npm run dev` starts without errors.
- [ ] `planner.db` is created in `./data/` on first run.
- [ ] Both `projects` and `project_phases` tables exist with correct columns.
- [ ] TypeScript compiles in strict mode with zero errors.

---

## Phase 2: Server Actions and Database Queries

**Goal:** All CRUD operations work and are callable from Server Actions.

### Tasks
1. Create `lib/db/queries.ts` with functions:
   - `getAllProjects(): ProjectListItem[]`
   - `getProjectById(id: number): ProjectWithPhases | null`
   - `createProject(data: CreateProjectInput): number` (returns new ID)
   - `updateProject(id: number, data: UpdateProjectInput): void`
   - `deleteProject(id: number): void`
   - `upsertPhases(projectId: number, phases: PhaseInput[]): void`
2. Create `app/actions/project-actions.ts` with Server Actions:
   - `createProjectAction(formData: FormData)` — validates with Zod, calls `createProject`, redirects to the new project.
   - `updateProjectAction(formData: FormData)` — validates, calls `updateProject` + `upsertPhases`, revalidates path.
   - `deleteProjectAction(formData: FormData)` — calls `deleteProject`, redirects to dashboard.
3. Phase upsert uses a transaction: DELETE all phases for the project, then INSERT the new set.
4. The `completed_steps` bitmask is computed by the Server Action based on which fields have non-empty values.

### Acceptance Criteria
- [ ] Can create a project with only Step 1 fields filled and get back a valid ID.
- [ ] Can update a project, adding data for additional steps, and see `completed_steps` update.
- [ ] Can delete a project and confirm its phases are also deleted (CASCADE).
- [ ] All queries use parameterized values (no string interpolation in SQL).
- [ ] Zod validation rejects: empty title, title >120 chars, problem_statement <10 chars.

---

## Phase 3: Reference Panel Content

**Goal:** The Help Desk prototype data is structured and renderable.

### Tasks
1. Create `lib/constants/reference-data.ts` containing the `REFERENCE_DATA` constant with all 5 steps' content from `REFERENCE_DATA.md`.
2. Create `components/reference-panel/reference-panel.tsx` — accepts an `activeStep` prop (1–5) and renders the matching reference content.
3. Create `components/reference-panel/reference-section.tsx` — renders a single section (heading + prose/list/table content).
4. The panel has a header ("📖 Reference: AI Help Desk"), a subtitle, and a collapse/expand toggle.
5. Collapsed state stored in a `useState` (client component).

### Acceptance Criteria
- [ ] Reference panel renders correct content for each of the 5 steps.
- [ ] Collapse toggle hides/shows the panel body with a smooth transition.
- [ ] Content is readable, with proper headings, lists, and table formatting.
- [ ] Component is a client component (needs `useState` for collapse) but receives data as props.

---

## Phase 4: The 5-Step Wizard UI

**Goal:** Users can create and edit projects through the guided wizard.

### Tasks
1. Create `components/step-wizard/wizard-content.tsx` — client component managing:
   - `activeStep` state (1–5), initialized from URL search param `?step=`.
   - Form data state for all fields across all steps.
   - Navigation between steps (updates URL search param).
2. Create step-specific form components:
   - `components/step-wizard/step-scope.tsx` — title, problem, solution, boundaries fields.
   - `components/step-wizard/step-requirements.tsx` — functional/non-functional requirements, user roles, AI prompt card.
   - `components/step-wizard/step-mvp.tsx` — must-have, nice-to-have, rationale fields.
   - `components/step-wizard/step-tech-stack.tsx` — frontend, backend, database, other tools fields.
   - `components/step-wizard/step-implementation.tsx` — repeatable phase editor (add/remove/reorder phases).
3. Create `components/step-wizard/step-progress-bar.tsx` — clickable step indicators showing state (incomplete/active/completed).
4. Create `components/step-wizard/wizard-navigation.tsx` — Previous / Save / Next buttons.
5. Create `components/step-wizard/ai-prompt-card.tsx` — displays the pre-written AI prompt template with a copy-to-clipboard button.
6. Build `app/projects/new/page.tsx` — renders the wizard with empty initial data.
7. Build `app/projects/[id]/edit/page.tsx` — loads existing project data and pre-fills the wizard.
8. Wire the "Save Project" button to the `createProjectAction` or `updateProjectAction` Server Action.
9. Lay out the wizard and reference panel side-by-side on desktop, stacked on mobile.

### Acceptance Criteria
- [ ] User can navigate between all 5 steps by clicking step indicators or Prev/Next buttons.
- [ ] Form data persists when navigating between steps (no data loss on step change).
- [ ] Saving with only Step 1 completed creates a project with `completed_steps = 1`.
- [ ] Saving with all steps creates a project with `completed_steps = 31` (all bits set).
- [ ] The AI prompt card in Step 2 has a working copy button with "Copied!" feedback.
- [ ] Step 5's phase editor allows adding, removing, and reordering phases.
- [ ] Reference panel shows contextual content matching the active step.
- [ ] On screens <1024px, the reference panel is a toggleable drawer, not a sidebar.
- [ ] Edit mode pre-fills all fields from the loaded project.

---

## Phase 5: Dashboard and Polish

**Goal:** Polished landing page, project view, and production-ready quality.

### Tasks
1. Build `app/page.tsx` (Dashboard):
   - Fetch all projects via `getAllProjects()` in a Server Component.
   - Render project cards in a responsive grid.
   - Each card shows: title, "3/5 steps" completion badge, created/updated dates, View/Edit/Delete actions.
   - Empty state with illustration and "Start your first project" CTA.
2. Build `app/projects/[id]/page.tsx` (View Project):
   - Fetch project via `getProjectById()`.
   - Render all completed steps as read-only sections.
   - "Edit" button in header.
3. Add delete confirmation dialog (can be a simple `confirm()` for MVP, or a modal component).
4. Add loading states: skeleton cards on dashboard, skeleton form on wizard.
5. Add error handling:
   - Server Action errors return `{ error: string }` and the UI displays them as inline messages.
   - 404 page for non-existent project IDs.
6. Global styling polish:
   - Apply design tokens from `UI_SPEC.md`.
   - Load fonts via `next/font/google`.
   - Ensure focus rings, hover states, and transitions are consistent.
7. Responsive testing: verify all layouts at 375px, 768px, 1024px, 1440px, 2560px.
8. Accessibility pass: all inputs labeled, focus order logical, no color-only indicators.

### Acceptance Criteria
- [ ] Dashboard shows all projects sorted by last updated.
- [ ] Empty dashboard shows call-to-action.
- [ ] Project view page renders all filled steps; empty steps are hidden (not shown as blank sections).
- [ ] Delete confirmation prevents accidental deletion.
- [ ] No unhandled errors in the console during normal usage.
- [ ] App is usable on a 375px-wide screen.
- [ ] All form fields have visible labels and focus indicators.

---

## Post-MVP Ideas (Not to Build Now)

These are documented here so Claude Code doesn't build them, but the user knows where to go next:

- Export project plan as Markdown or PDF.
- Project templates (presets beyond the Help Desk example).
- Live AI integration: call Claude API directly from Step 2 to generate requirements.
- Authentication for team sharing.
- Dark/light theme toggle.
- Drag-and-drop phase reordering.
- Version history for project plans.
