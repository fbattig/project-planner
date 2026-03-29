export interface PhaseFormData {
  phase_title: string;
  phase_description: string;
}

export interface WizardFormData {
  title: string;
  problem_statement: string;
  proposed_solution: string;
  boundaries: string;
  functional_requirements: string;
  non_functional_requirements: string;
  user_roles: string;
  must_have_features: string;
  nice_to_have_features: string;
  mvp_rationale: string;
  frontend: string;
  backend: string;
  database: string;
  other_tools: string;
  phases: PhaseFormData[];
}

export const EMPTY_FORM_DATA: WizardFormData = {
  title: '',
  problem_statement: '',
  proposed_solution: '',
  boundaries: '',
  functional_requirements: '',
  non_functional_requirements: '',
  user_roles: '',
  must_have_features: '',
  nice_to_have_features: '',
  mvp_rationale: '',
  frontend: '',
  backend: '',
  database: '',
  other_tools: '',
  phases: [],
};

export const STEP_LABELS = [
  'Scope',
  'Requirements',
  'MVP',
  'Tech Stack',
  'Implementation',
] as const;
