# UI Specification

## Layout System

The application has two primary layouts:

### 1. Dashboard Layout (route: `/`)
```
┌─────────────────────────────────────────────┐
│  Header: "Project Planner" + [New Project]  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │ Project │  │ Project │  │ Project │    │
│  │  Card   │  │  Card   │  │  Card   │    │
│  └─────────┘  └─────────┘  └─────────┘    │
│                                             │
│  ┌─────────┐  ┌─────────┐                 │
│  │ Project │  │  + New  │                 │
│  │  Card   │  │ Project │                 │
│  └─────────┘  └─────────┘                 │
│                                             │
└─────────────────────────────────────────────┘
```

- Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop.
- Project cards show: title, creation date, completion badge ("3/5 steps"), and action buttons (view, edit, delete).
- Empty state: centered illustration or icon + "Start your first project" CTA button.

### 2. Wizard Layout (routes: `/projects/new`, `/projects/[id]/edit`)
```
┌────────────────────────────────────────────────────────────┐
│  Header: "← Back to Projects"    "Project Title"          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌── Step Progress Bar ──────────────────────────────────┐ │
│  │  ① Scope  ② Requirements  ③ MVP  ④ Stack  ⑤ Plan    │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌─── Active Form ──────────┐  ┌─── Reference Panel ───┐ │
│  │                          │  │                        │ │
│  │  [Form fields for the   │  │  "AI Help Desk"       │ │
│  │   active step]           │  │  example for this     │ │
│  │                          │  │  step.                │ │
│  │                          │  │                        │ │
│  │                          │  │  [Collapse toggle]    │ │
│  │                          │  │                        │ │
│  ├──────────────────────────┤  └────────────────────────┘ │
│  │ [← Prev]  [Save] [Next →] │                            │
│  └──────────────────────────┘                              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

- **Desktop (≥1024px):** Side-by-side: form takes 60% width, reference panel takes 40%.
- **Tablet/Mobile (<1024px):** Form is full width. Reference panel becomes a slide-over drawer toggled by a floating button.

### 3. View Layout (route: `/projects/[id]`)
- Read-only display of all completed steps in a single scrollable page.
- Each step rendered as a distinct section with a heading and content.
- "Edit" button in the header navigates to the edit wizard.

## Component Hierarchy

```
RootLayout
├── Header
│   ├── Logo / App Title
│   └── Navigation (Back link, actions)
│
├── DashboardPage
│   ├── ProjectGrid
│   │   └── ProjectCard (repeated)
│   └── EmptyState
│
├── WizardPage
│   ├── StepProgressBar
│   │   └── StepIndicator (repeated × 5)
│   ├── WizardContent (client component — manages active step state)
│   │   ├── StepScope
│   │   ├── StepRequirements
│   │   │   └── AiPromptCard (copy-to-clipboard prompt)
│   │   ├── StepMvp
│   │   ├── StepTechStack
│   │   └── StepImplementation
│   │       └── PhaseEditor (repeatable phase fields)
│   ├── WizardNavigation (Prev / Save / Next buttons)
│   └── ReferencePanel
│       └── ReferenceContent (switches content based on active step)
│
└── ViewProjectPage
    ├── ProjectHeader (title, dates, completion)
    └── StepSection (repeated for each completed step)
```

## Design Tokens

Define these as CSS custom properties in `app/globals.css` and extend in Tailwind config:

```css
:root {
  /* Surface */
  --color-bg-primary: #0f1117;
  --color-bg-secondary: #1a1d27;
  --color-bg-elevated: #232734;
  --color-bg-input: #2a2e3b;
  
  /* Text */
  --color-text-primary: #e8eaed;
  --color-text-secondary: #9ca3af;
  --color-text-muted: #6b7280;
  
  /* Accent */
  --color-accent: #6366f1;        /* Indigo — primary actions */
  --color-accent-hover: #818cf8;
  --color-accent-subtle: #6366f11a;
  
  /* Status */
  --color-success: #34d399;
  --color-warning: #fbbf24;
  --color-danger: #f87171;
  
  /* Borders */
  --color-border: #2e3344;
  --color-border-focus: #6366f1;
  
  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  
  /* Spacing scale: 4px base */
  /* Use Tailwind's default spacing scale */
  
  /* Shadows */
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.4);
}
```

**Typography:** Use a clean, modern sans-serif. Load via `next/font/google`:
- Headings: `DM Sans` (weight 600–700)
- Body: `DM Sans` (weight 400–500)
- Code/monospace: `JetBrains Mono` (for AI prompt blocks)

**Dark theme only for MVP.** A light theme can be added later via a `[data-theme="light"]` class swap.

## Step Progress Bar Behavior

- Each step indicator shows: step number, label, and state (incomplete, active, completed).
- **Incomplete:** Muted text, no fill, dashed border.
- **Active:** Accent color fill, bold label.
- **Completed:** Success color checkmark icon, solid border.
- Clicking any indicator navigates directly to that step.

## Reference Panel States

| Wizard Step | Reference Panel Shows |
|-------------|----------------------|
| 1. Scope | Help Desk problem statement and solution |
| 2. Requirements | Help Desk functional requirements, user roles, ticket statuses |
| 3. MVP | Help Desk MVP feature set and what was cut |
| 4. Tech Stack | Help Desk tech choices and rationale |
| 5. Implementation | Help Desk phased build plan |

The panel header shows: "📖 Reference: AI Help Desk" with a subtitle: "See how this step looks in a real project."

## Key Interactions

- **Save Project:** Validates all filled fields, writes to database, shows success toast, stays on current step.
- **Delete Project:** Confirmation dialog ("Are you sure? This cannot be undone.") before deletion.
- **Copy AI Prompt:** Copies pre-written text to clipboard, shows "Copied!" feedback for 2 seconds.
- **Collapse Reference Panel:** Smooth CSS transition, form area expands to full width. State persisted in `localStorage` (this is acceptable for UI preferences, not data).
