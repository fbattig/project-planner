import { getDb } from './connection';
import { runMigrations } from './migrations';
import type { ProjectListItem, ProjectWithPhases, ProjectPhase } from '@/lib/types/project';

function ensureDb() {
  runMigrations();
  return getDb();
}

export function getAllProjects(): ProjectListItem[] {
  const db = ensureDb();
  return db
    .prepare(
      `SELECT id, title, completed_steps, created_at, updated_at
       FROM projects
       ORDER BY updated_at DESC`
    )
    .all() as ProjectListItem[];
}

export function getProjectById(id: number): ProjectWithPhases | null {
  const db = ensureDb();

  const project = db
    .prepare('SELECT * FROM projects WHERE id = ?')
    .get(id) as ProjectWithPhases | undefined;

  if (!project) return null;

  const phases = db
    .prepare(
      'SELECT * FROM project_phases WHERE project_id = ? ORDER BY phase_order ASC'
    )
    .all(id) as ProjectPhase[];

  return { ...project, phases };
}

export interface CreateProjectInput {
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
}

export function createProject(data: CreateProjectInput): number {
  const db = ensureDb();

  const stmt = db.prepare(`
    INSERT INTO projects (
      title, problem_statement, proposed_solution, boundaries,
      functional_requirements, non_functional_requirements, user_roles,
      must_have_features, nice_to_have_features, mvp_rationale,
      frontend, backend, database, other_tools,
      completed_steps
    ) VALUES (
      @title, @problem_statement, @proposed_solution, @boundaries,
      @functional_requirements, @non_functional_requirements, @user_roles,
      @must_have_features, @nice_to_have_features, @mvp_rationale,
      @frontend, @backend, @database, @other_tools,
      @completed_steps
    )
  `);

  const result = stmt.run(data);
  return Number(result.lastInsertRowid);
}

export type UpdateProjectInput = CreateProjectInput;

export function updateProject(id: number, data: UpdateProjectInput): void {
  const db = ensureDb();

  db.prepare(`
    UPDATE projects SET
      title = @title,
      problem_statement = @problem_statement,
      proposed_solution = @proposed_solution,
      boundaries = @boundaries,
      functional_requirements = @functional_requirements,
      non_functional_requirements = @non_functional_requirements,
      user_roles = @user_roles,
      must_have_features = @must_have_features,
      nice_to_have_features = @nice_to_have_features,
      mvp_rationale = @mvp_rationale,
      frontend = @frontend,
      backend = @backend,
      database = @database,
      other_tools = @other_tools,
      completed_steps = @completed_steps,
      updated_at = datetime('now')
    WHERE id = @id
  `).run({ ...data, id });
}

export function deleteProject(id: number): void {
  const db = ensureDb();
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
}

export interface PhaseInput {
  phase_order: number;
  phase_title: string;
  phase_description: string;
}

export function upsertPhases(projectId: number, phases: PhaseInput[]): void {
  const db = ensureDb();

  const deleteStmt = db.prepare(
    'DELETE FROM project_phases WHERE project_id = ?'
  );
  const insertStmt = db.prepare(`
    INSERT INTO project_phases (project_id, phase_order, phase_title, phase_description)
    VALUES (@project_id, @phase_order, @phase_title, @phase_description)
  `);

  const upsert = db.transaction(() => {
    deleteStmt.run(projectId);
    for (const phase of phases) {
      insertStmt.run({
        project_id: projectId,
        phase_order: phase.phase_order,
        phase_title: phase.phase_title,
        phase_description: phase.phase_description,
      });
    }
  });

  upsert();
}
