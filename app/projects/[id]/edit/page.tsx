import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/db/queries';
import { runMigrations } from '@/lib/db/migrations';
import { WizardContent } from '@/components/step-wizard/wizard-content';
import { createProjectAction, updateProjectAction } from '@/app/actions/project-actions';
import type { WizardFormData } from '@/components/step-wizard/wizard-types';
import type { ActionResult } from '@/app/actions/project-actions';

async function saveAction(projectId: number | undefined, formData: FormData): Promise<ActionResult> {
  'use server';
  if (projectId) {
    return updateProjectAction(projectId, formData);
  }
  return createProjectAction(formData);
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  runMigrations();
  const { id } = await params;
  const project = getProjectById(Number(id));

  if (!project) notFound();

  const initialData: WizardFormData = {
    title: project.title,
    problem_statement: project.problem_statement,
    proposed_solution: project.proposed_solution,
    boundaries: project.boundaries,
    functional_requirements: project.functional_requirements,
    non_functional_requirements: project.non_functional_requirements,
    user_roles: project.user_roles,
    must_have_features: project.must_have_features,
    nice_to_have_features: project.nice_to_have_features,
    mvp_rationale: project.mvp_rationale,
    frontend: project.frontend,
    backend: project.backend,
    database: project.database,
    other_tools: project.other_tools,
    phases: project.phases.map((p) => ({
      phase_title: p.phase_title,
      phase_description: p.phase_description,
    })),
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-border)] px-6 py-4 flex items-center gap-4">
        <Link
          href={`/projects/${project.id}`}
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          &larr; Back to Project
        </Link>
        <h1 className="text-lg font-semibold">Edit: {project.title}</h1>
      </header>
      <main className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
        <Suspense>
          <WizardContent
            initialData={initialData}
            projectId={project.id}
            saveAction={saveAction}
          />
        </Suspense>
      </main>
    </div>
  );
}
