import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/db/queries';
import { runMigrations } from '@/lib/db/migrations';
import { STEP_LABELS } from '@/components/step-wizard/wizard-types';

export default async function ViewProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  runMigrations();
  const { id } = await params;
  const project = getProjectById(Number(id));

  if (!project) notFound();

  const stepSections = [
    {
      label: STEP_LABELS[0],
      bit: 1,
      fields: [
        { label: 'Problem Statement', value: project.problem_statement },
        { label: 'Proposed Solution', value: project.proposed_solution },
        { label: 'Boundaries', value: project.boundaries },
      ],
    },
    {
      label: STEP_LABELS[1],
      bit: 2,
      fields: [
        { label: 'Functional Requirements', value: project.functional_requirements },
        { label: 'Non-Functional Requirements', value: project.non_functional_requirements },
        { label: 'User Roles', value: project.user_roles },
      ],
    },
    {
      label: STEP_LABELS[2],
      bit: 4,
      fields: [
        { label: 'Must-Have Features', value: project.must_have_features },
        { label: 'Nice-to-Have Features', value: project.nice_to_have_features },
        { label: 'MVP Rationale', value: project.mvp_rationale },
      ],
    },
    {
      label: STEP_LABELS[3],
      bit: 8,
      fields: [
        { label: 'Frontend', value: project.frontend },
        { label: 'Backend', value: project.backend },
        { label: 'Database', value: project.database },
        { label: 'Other Tools', value: project.other_tools },
      ],
    },
  ];

  const completedCount = [1, 2, 4, 8, 16].filter(
    (b) => (project.completed_steps & b) !== 0
  ).length;

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            &larr; Back
          </Link>
          <div>
            <h1 className="text-lg font-semibold">{project.title}</h1>
            <p className="text-xs text-[var(--color-text-muted)]">
              {completedCount}/5 steps completed
            </p>
          </div>
        </div>
        <Link
          href={`/projects/${project.id}/edit`}
          className="rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Edit
        </Link>
      </header>
      <main className="px-4 sm:px-6 py-6 max-w-4xl mx-auto space-y-6">
        {stepSections.map((section) => {
          if ((project.completed_steps & section.bit) === 0) return null;
          return (
            <div
              key={section.label}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5"
            >
              <h2 className="text-base font-semibold text-[var(--color-accent)] mb-4">
                {section.label}
              </h2>
              {section.fields.map((field) => {
                if (!field.value) return null;
                return (
                  <div key={field.label} className="mb-4 last:mb-0">
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                      {field.label}
                    </h3>
                    <p className="text-sm text-[var(--color-text-primary)] whitespace-pre-line">
                      {field.value}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Step 5: Implementation phases */}
        {(project.completed_steps & 16) !== 0 && project.phases.length > 0 && (
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5">
            <h2 className="text-base font-semibold text-[var(--color-accent)] mb-4">
              Implementation Plan
            </h2>
            {project.phases.map((phase) => (
              <div
                key={phase.id}
                className="mb-4 last:mb-0 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4"
              >
                <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  {phase.phase_title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] whitespace-pre-line">
                  {phase.phase_description}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
