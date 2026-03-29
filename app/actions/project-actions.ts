'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { projectSchema } from '@/lib/validations/project-schema';
import {
  createProject,
  updateProject,
  deleteProject,
  upsertPhases,
} from '@/lib/db/queries';

function computeCompletedSteps(data: {
  problem_statement: string;
  proposed_solution: string;
  functional_requirements: string;
  must_have_features: string;
  frontend: string;
  backend: string;
  database: string;
  phases: { phase_title: string }[];
}): number {
  let mask = 0;

  // Step 1: Scope — problem_statement and proposed_solution filled
  if (data.problem_statement.length > 0 && data.proposed_solution.length > 0) {
    mask |= 1;
  }

  // Step 2: Requirements — functional_requirements filled
  if (data.functional_requirements.length > 0) {
    mask |= 2;
  }

  // Step 3: MVP — must_have_features filled
  if (data.must_have_features.length > 0) {
    mask |= 4;
  }

  // Step 4: Tech Stack — at least one of frontend/backend/database filled
  if (
    data.frontend.length > 0 ||
    data.backend.length > 0 ||
    data.database.length > 0
  ) {
    mask |= 8;
  }

  // Step 5: Implementation — at least one phase exists
  if (data.phases.length > 0) {
    mask |= 16;
  }

  return mask;
}

export type ActionResult = { error: string } | { success: true; id: number };

export async function createProjectAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = extractFormData(formData);
  const parsed = projectSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError ? firstError.message : 'Validation failed' };
  }

  const data = parsed.data;
  const completedSteps = computeCompletedSteps(data);

  const id = createProject({
    title: data.title,
    problem_statement: data.problem_statement,
    proposed_solution: data.proposed_solution,
    boundaries: data.boundaries,
    functional_requirements: data.functional_requirements,
    non_functional_requirements: data.non_functional_requirements,
    user_roles: data.user_roles,
    must_have_features: data.must_have_features,
    nice_to_have_features: data.nice_to_have_features,
    mvp_rationale: data.mvp_rationale,
    frontend: data.frontend,
    backend: data.backend,
    database: data.database,
    other_tools: data.other_tools,
    completed_steps: completedSteps,
  });

  if (data.phases.length > 0) {
    upsertPhases(id, data.phases);
  }

  redirect(`/projects/${id}`);
}

export async function updateProjectAction(
  projectId: number,
  formData: FormData
): Promise<ActionResult> {
  const raw = extractFormData(formData);
  const parsed = projectSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError ? firstError.message : 'Validation failed' };
  }

  const data = parsed.data;
  const completedSteps = computeCompletedSteps(data);

  updateProject(projectId, {
    title: data.title,
    problem_statement: data.problem_statement,
    proposed_solution: data.proposed_solution,
    boundaries: data.boundaries,
    functional_requirements: data.functional_requirements,
    non_functional_requirements: data.non_functional_requirements,
    user_roles: data.user_roles,
    must_have_features: data.must_have_features,
    nice_to_have_features: data.nice_to_have_features,
    mvp_rationale: data.mvp_rationale,
    frontend: data.frontend,
    backend: data.backend,
    database: data.database,
    other_tools: data.other_tools,
    completed_steps: completedSteps,
  });

  upsertPhases(projectId, data.phases);

  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/');
  return { success: true, id: projectId };
}

export async function deleteProjectAction(
  formData: FormData
): Promise<never> {
  const id = Number(formData.get('id'));
  if (!id || isNaN(id)) {
    throw new Error('Invalid project ID');
  }

  deleteProject(id);
  revalidatePath('/');
  redirect('/');
}

function extractFormData(formData: FormData) {
  // Extract phases from numbered form fields
  const phases: { phase_title: string; phase_description: string; phase_order: number }[] = [];
  let i = 0;
  while (formData.has(`phase_title_${i}`)) {
    phases.push({
      phase_title: (formData.get(`phase_title_${i}`) as string) || '',
      phase_description: (formData.get(`phase_description_${i}`) as string) || '',
      phase_order: i,
    });
    i++;
  }

  return {
    title: (formData.get('title') as string) || '',
    problem_statement: (formData.get('problem_statement') as string) || '',
    proposed_solution: (formData.get('proposed_solution') as string) || '',
    boundaries: (formData.get('boundaries') as string) || '',
    functional_requirements: (formData.get('functional_requirements') as string) || '',
    non_functional_requirements: (formData.get('non_functional_requirements') as string) || '',
    user_roles: (formData.get('user_roles') as string) || '',
    must_have_features: (formData.get('must_have_features') as string) || '',
    nice_to_have_features: (formData.get('nice_to_have_features') as string) || '',
    mvp_rationale: (formData.get('mvp_rationale') as string) || '',
    frontend: (formData.get('frontend') as string) || '',
    backend: (formData.get('backend') as string) || '',
    database: (formData.get('database') as string) || '',
    other_tools: (formData.get('other_tools') as string) || '',
    phases,
  };
}
