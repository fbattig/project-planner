import { Suspense } from 'react';
import Link from 'next/link';
import { WizardContent } from '@/components/step-wizard/wizard-content';
import { EMPTY_FORM_DATA } from '@/components/step-wizard/wizard-types';
import { createProjectAction, updateProjectAction } from '@/app/actions/project-actions';
import type { ActionResult } from '@/app/actions/project-actions';

async function saveAction(projectId: number | undefined, formData: FormData): Promise<ActionResult> {
  'use server';
  if (projectId) {
    return updateProjectAction(projectId, formData);
  }
  return createProjectAction(formData);
}

export default function NewProjectPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-border)] px-6 py-4 flex items-center gap-4">
        <Link
          href="/"
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          &larr; Back to Projects
        </Link>
        <h1 className="text-lg font-semibold">New Project</h1>
      </header>
      <main className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
        <Suspense>
          <WizardContent
            initialData={EMPTY_FORM_DATA}
            saveAction={saveAction}
          />
        </Suspense>
      </main>
    </div>
  );
}
