'use server';

import Anthropic from '@anthropic-ai/sdk';
import type { ProjectWithPhases } from '@/lib/types/project';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GeneratedDoc {
  filename: string;
  content: string;
}

export interface GenerateDocsResult {
  docs: GeneratedDoc[] | null;
  error: string | null;
}

function projectContext(project: ProjectWithPhases): string {
  const phasesText = project.phases
    .map((p) => `- ${p.phase_title}: ${p.phase_description}`)
    .join('\n');

  return `Project Title: ${project.title}

Problem Statement: ${project.problem_statement}

Proposed Solution: ${project.proposed_solution}

Boundaries / Out of Scope: ${project.boundaries}

Functional Requirements: ${project.functional_requirements}

Non-Functional Requirements: ${project.non_functional_requirements}

User Roles: ${project.user_roles}

Must-Have Features (MVP): ${project.must_have_features}

Nice-to-Have Features (Post-MVP): ${project.nice_to_have_features}

MVP Rationale: ${project.mvp_rationale}

Frontend: ${project.frontend}

Backend: ${project.backend}

Database: ${project.database}

Other Tools: ${project.other_tools}

Implementation Phases:
${phasesText}`;
}

async function callHaiku(systemPrompt: string, userPrompt: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const textBlock = message.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') throw new Error('No response');
  return textBlock.text;
}

const SYSTEM = `You are an expert software architect who writes detailed project documentation for Claude Code (Anthropic's AI coding assistant). Your documentation must be precise, actionable, and structured so that Claude Code can autonomously build the project from these files alone. Output raw markdown only — no wrapping code fences around the entire document.`;

export async function generateProjectDocs(
  project: ProjectWithPhases
): Promise<GenerateDocsResult> {
  const ctx = projectContext(project);

  try {
    const [claudeMd, scopeMd, requirementsMd, dbSchemaMd, techStackMd, uiSpecMd, implPlanMd] =
      await Promise.all([
        // CLAUDE.md
        callHaiku(
          SYSTEM,
          `Given this project plan, generate a CLAUDE.md file — the master instruction file for Claude Code. It should include:

1. **Identity** section: project name, one-sentence description
2. **Project Documentation** section: list the docs files to read in order (SCOPE.md, REQUIREMENTS.md, DATABASE_SCHEMA.md, TECH_STACK.md, UI_SPEC.md, IMPLEMENTATION_PLAN.md)
3. **Architecture Constraints**: framework, rendering strategy, data layer, mutations approach, styling, state management — all derived from the tech stack choices
4. **Code Style Rules**: TypeScript strict mode, file naming conventions, component naming, file organization, where Server Actions go, where DB queries go, shared types location, validation location
5. **Common Pitfalls to Avoid**: based on the tech choices, list 5-6 things NOT to do
6. **Folder Structure**: a realistic file tree for the project

Project plan:
${ctx}`
        ),

        // SCOPE.md
        callHaiku(
          SYSTEM,
          `Generate a SCOPE.md file for this project. Include:
- Overview paragraph
- Problem Statement (detailed, 2-3 paragraphs)
- Proposed Solution (detailed description with bullet points for key capabilities)
- Target Users
- Boundaries / Out of Scope (bullet list of what is NOT included in V1)
- Success Criteria (3-5 measurable outcomes)

Project plan:
${ctx}`
        ),

        // REQUIREMENTS.md
        callHaiku(
          SYSTEM,
          `Generate a REQUIREMENTS.md file. Include:
- Functional Requirements grouped by feature area (FR-1, FR-2, etc.) with sub-items (FR-1.1, FR-1.2)
- Step/field specifications where applicable
- Non-Functional Requirements (performance, security, accessibility, responsiveness, error handling)
- Validation Rules table (field | rule)

Project plan:
${ctx}`
        ),

        // DATABASE_SCHEMA.md
        callHaiku(
          SYSTEM,
          `Generate a DATABASE_SCHEMA.md file. Include:
- Overview (which database, where it's stored)
- Complete SQL CREATE TABLE statements with appropriate column types, constraints, defaults, foreign keys, indexes
- TypeScript interfaces matching each table
- Key SQL queries section (list, get by id, create, update, delete — written as parameterized SQL)
- Migration strategy section

Derive the schema from the functional requirements and data model implied by the project. Use best practices for the chosen database.

Project plan:
${ctx}`
        ),

        // TECH_STACK.md
        callHaiku(
          SYSTEM,
          `Generate a TECH_STACK.md file. Include:
- Core Dependencies table (Technology | Version | Role | Rationale)
- Dev Dependencies table (Tool | Purpose)
- "Explicitly NOT Using" table (Technology | Reason) — list 4-5 technologies deliberately excluded
- Configuration Notes section with code snippets for key config files (framework config, styling config, TypeScript config, database config)

Project plan:
${ctx}`
        ),

        // UI_SPEC.md
        callHaiku(
          SYSTEM,
          `Generate a UI_SPEC.md file. Include:
- Layout System: ASCII diagrams for each major layout/page with descriptions
- Component Hierarchy: a tree showing the component structure
- Design Tokens: CSS custom properties for colors (surfaces, text, accent, status, borders), radius, shadows — use a dark theme
- Typography: font choices for headings, body, and code
- Key Interactions: describe the main user interactions (save, delete, navigation, etc.)
- Responsive Behavior: breakpoints and how layouts adapt

Project plan:
${ctx}`
        ),

        // IMPLEMENTATION_PLAN.md
        callHaiku(
          SYSTEM,
          `Generate an IMPLEMENTATION_PLAN.md file. Include:
- One phase per section, each with:
  - **Goal** (one sentence)
  - **Tasks** (numbered list of specific, actionable items)
  - **Acceptance Criteria** (checkboxes)
- Phases should be ordered so each builds on the previous
- A "Post-MVP Ideas" section at the end listing features NOT to build now

The phases should be based on the implementation plan from the project, but expanded with detailed tasks and acceptance criteria.

Project plan:
${ctx}`
        ),
      ]);

    return {
      docs: [
        { filename: 'CLAUDE.md', content: claudeMd },
        { filename: 'docs/SCOPE.md', content: scopeMd },
        { filename: 'docs/REQUIREMENTS.md', content: requirementsMd },
        { filename: 'docs/DATABASE_SCHEMA.md', content: dbSchemaMd },
        { filename: 'docs/TECH_STACK.md', content: techStackMd },
        { filename: 'docs/UI_SPEC.md', content: uiSpecMd },
        { filename: 'docs/IMPLEMENTATION_PLAN.md', content: implPlanMd },
      ],
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Documentation generation failed';
    return { docs: null, error: message };
  }
}
