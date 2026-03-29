import { getDb } from './connection';

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS projects (
  id                      INTEGER PRIMARY KEY AUTOINCREMENT,
  title                   TEXT    NOT NULL CHECK(length(trim(title)) >= 1 AND length(title) <= 120),

  -- Step 1: Scope
  problem_statement       TEXT    NOT NULL DEFAULT '',
  proposed_solution        TEXT    NOT NULL DEFAULT '',
  boundaries              TEXT    NOT NULL DEFAULT '',

  -- Step 2: Requirements
  functional_requirements  TEXT    NOT NULL DEFAULT '',
  non_functional_requirements TEXT NOT NULL DEFAULT '',
  user_roles              TEXT    NOT NULL DEFAULT '',

  -- Step 3: MVP
  must_have_features      TEXT    NOT NULL DEFAULT '',
  nice_to_have_features   TEXT    NOT NULL DEFAULT '',
  mvp_rationale           TEXT    NOT NULL DEFAULT '',

  -- Step 4: Tech Stack
  frontend                TEXT    NOT NULL DEFAULT '',
  backend                 TEXT    NOT NULL DEFAULT '',
  database                TEXT    NOT NULL DEFAULT '',
  other_tools             TEXT    NOT NULL DEFAULT '',

  -- Metadata
  completed_steps         INTEGER NOT NULL DEFAULT 0,
  created_at              TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at              TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS project_phases (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id        INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase_order       INTEGER NOT NULL DEFAULT 0,
  phase_title       TEXT    NOT NULL CHECK(length(trim(phase_title)) >= 1 AND length(phase_title) <= 100),
  phase_description TEXT    NOT NULL DEFAULT '',

  UNIQUE(project_id, phase_order)
);

CREATE INDEX IF NOT EXISTS idx_phases_project ON project_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_updated ON projects(updated_at DESC);
`;

let migrated = false;

export function runMigrations(): void {
  if (migrated) return;

  const db = getDb();
  db.exec(SCHEMA_SQL);
  migrated = true;
}
