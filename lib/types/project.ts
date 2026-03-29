export interface Project {
  id: number;
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
  completed_steps: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectPhase {
  id: number;
  project_id: number;
  phase_order: number;
  phase_title: string;
  phase_description: string;
}

export interface ProjectWithPhases extends Project {
  phases: ProjectPhase[];
}

export interface ProjectListItem {
  id: number;
  title: string;
  completed_steps: number;
  created_at: string;
  updated_at: string;
}
