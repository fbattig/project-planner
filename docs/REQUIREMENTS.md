# Requirements

## Functional Requirements

### FR-1: Project CRUD Operations

- **FR-1.1:** Users can create a new project plan by completing the 5-step wizard.
- **FR-1.2:** Users can save a partially completed project (not all 5 steps are required to save).
- **FR-1.3:** Users can view a saved project plan in read-only mode showing all completed steps.
- **FR-1.4:** Users can edit any step of an existing project plan and re-save.
- **FR-1.5:** Users can delete a project plan from the dashboard with a confirmation prompt.
- **FR-1.6:** Each project has a required `title` field (set during Step 1) and an auto-generated `created_at` timestamp.

### FR-2: 5-Step Wizard

- **FR-2.1:** The wizard displays exactly 5 sequential steps: Scope → Requirements → MVP → Tech Stack → Implementation Plan.
- **FR-2.2:** Users can navigate forward and backward between steps freely. Steps are not gated (users can skip ahead).
- **FR-2.3:** Each step has a form with labeled text areas and/or structured inputs specific to that step's purpose (see field specs below).
- **FR-2.4:** The wizard preserves form data in local component state while navigating between steps. Data is only committed to the database on explicit "Save Project" action.
- **FR-2.5:** A progress indicator shows which step is active and which steps have content.

#### Step Field Specifications

**Step 1 — Scope:**
- `title` (text input, required, max 120 chars) — The project name.
- `problem_statement` (textarea, required) — What problem does this solve?
- `proposed_solution` (textarea, required) — High-level description of the solution.
- `boundaries` (textarea, optional) — What is explicitly out of scope?

**Step 2 — Requirements:**
- `functional_requirements` (textarea, required) — What must the system do?
- `non_functional_requirements` (textarea, optional) — Performance, security, scalability constraints.
- `user_roles` (textarea, optional) — Who are the users and what can each do?
- `ai_prompt_suggestion` (read-only display) — A pre-written prompt the user can copy and paste into an AI tool to find requirement gaps.

**Step 3 — MVP:**
- `must_have_features` (textarea, required) — Features that must ship in version 1.
- `nice_to_have_features` (textarea, optional) — Features deferred to later versions.
- `mvp_rationale` (textarea, optional) — Why this is the right cut line.

**Step 4 — Tech Stack:**
- `frontend` (text input, optional) — Framework choice and rationale.
- `backend` (text input, optional) — Server/API choice and rationale.
- `database` (text input, optional) — Database choice and rationale.
- `other_tools` (textarea, optional) — Hosting, CI/CD, libraries, etc.

**Step 5 — Implementation Plan:**
- `phases` (repeatable group, at least 1 required) — Each phase has:
  - `phase_title` (text input, required) — e.g., "Phase 1: Project Setup"
  - `phase_description` (textarea, required) — What gets built in this phase.
  - `phase_order` (auto-incremented integer) — Determines display order.

### FR-3: Reference Panel

- **FR-3.1:** A persistent panel displays the "AI Help Desk" prototype example alongside the wizard.
- **FR-3.2:** The reference panel content updates contextually to match the active wizard step. When the user is on Step 2 (Requirements), the panel shows the Help Desk's requirements, etc.
- **FR-3.3:** The reference panel is collapsible so users can maximize their form space.
- **FR-3.4:** On screens narrower than 1024px, the reference panel becomes a toggleable overlay or drawer rather than a side-by-side column.

### FR-4: AI Thinking Partner Prompts

- **FR-4.1:** Step 2 (Requirements) displays a pre-written prompt template. Example: *"I'm building [project description]. Here is my initial scope: [paste scope]. What requirements am I missing? What clarifying questions should I answer before I start building?"*
- **FR-4.2:** The prompt includes a one-click copy-to-clipboard button.
- **FR-4.3:** A brief instructional note explains: "Paste this into Claude, ChatGPT, or another AI tool to pressure-test your requirements."

### FR-5: Dashboard

- **FR-5.1:** The root page (`/`) displays a list of all saved project plans.
- **FR-5.2:** Each project card shows: title, creation date, last modified date, and a completion indicator (e.g., "3/5 steps completed").
- **FR-5.3:** Empty state: when no projects exist, display a clear call-to-action to create the first project.
- **FR-5.4:** Projects are sorted by `updated_at` descending (most recently edited first).

## Non-Functional Requirements

- **NFR-1: Performance** — Page transitions and saves should feel instant (<200ms perceived latency). Use Server Components to minimize client JavaScript.
- **NFR-2: Data integrity** — All database writes use parameterized queries. No string concatenation in SQL.
- **NFR-3: Accessibility** — All form fields have associated labels. Focus management works correctly when navigating wizard steps. Color is not the only indicator of state.
- **NFR-4: Responsiveness** — The application must be usable on screens from 375px to 2560px wide.
- **NFR-5: Error handling** — Server Actions return structured error responses. The UI displays user-friendly error messages. Database connection failures are caught gracefully.

## Validation Rules

| Field | Rule |
|-------|------|
| `title` | Required. 1–120 characters. Trimmed of leading/trailing whitespace. |
| `problem_statement` | Required. Minimum 10 characters. |
| `proposed_solution` | Required. Minimum 10 characters. |
| `must_have_features` | Required if Step 3 is submitted. Minimum 10 characters. |
| `phase_title` | Required per phase. 1–100 characters. |
| `phase_description` | Required per phase. Minimum 10 characters. |
| All other fields | Optional. No minimum length. Max 5000 characters each. |
