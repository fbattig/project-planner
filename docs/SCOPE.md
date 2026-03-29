# Project Scope

## Problem

Developers regularly start building software without a structured plan. This leads to three recurring failure modes:

1. **Scope creep** — Features are added mid-build because no one defined "done" up front.
2. **Missed requirements** — Critical constraints (auth, data model, error handling) surface only during implementation.
3. **Architecture drift** — Tech stack decisions are made reactively instead of deliberately, resulting in inconsistent patterns.

The root cause is that most developers jump from "idea" to "code" without an intermediate planning step. There is no lightweight tool that enforces a structured thinking process while remaining approachable.

## Solution

**Project Planner** is a guided planning tool that walks users through a 5-step mental framework:

| Step | Purpose | Key Output |
|------|---------|------------|
| 1. Scope | Define what the project IS and IS NOT | Problem statement, proposed solution, boundaries |
| 2. Requirements | Clarify the functional and non-functional needs | Feature list, constraints, user roles |
| 3. MVP | Draw the line between "must ship" and "nice to have" | Prioritized feature set for version 1 |
| 4. Tech Stack | Choose technologies deliberately | Framework, database, hosting, rationale |
| 5. Implementation Plan | Break work into buildable phases | Ordered phases with clear deliverables |

The application features a **side-by-side reference panel** showing a fully worked example ("AI Help Desk" prototype) so users can see what good output looks like at each step.

## MVP Boundaries

### In Scope (Version 1)

- 5-step wizard with form inputs for each planning stage
- Persistent reference panel showing the Help Desk example, contextual to the active step
- Save/load/delete project plans via SQLite
- Dashboard listing all saved projects
- AI "thinking partner" prompt templates (copy-paste prompts, not live AI integration)
- Single-user, local-first deployment

### Explicitly Out of Scope (Version 1)

- User authentication or multi-user access
- Real-time AI integration or API calls to LLMs
- Export to PDF/Markdown/GitHub Issues
- Collaboration features (sharing, commenting)
- Project templates beyond the Help Desk example
- Deployment to cloud hosting (runs locally)
- Version history or undo/redo for project plans
