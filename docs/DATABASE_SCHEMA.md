# Database Schema

## Overview

SQLite via `better-sqlite3`. Single file database stored at `./data/planner.db`. The schema uses two tables: `projects` for the main plan data and `project_phases` for the repeatable implementation phases.

## Schema SQL

```sql
-- Run on application startup (idempotent)

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
  completed_steps         INTEGER NOT NULL DEFAULT 0,  -- bitmask: step1=1, step2=2, step3=4, step4=8, step5=16
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
```

## Completed Steps Bitmask

The `completed_steps` column tracks which steps have been filled in using a bitmask:

| Step | Bit Value | Check Expression |
|------|-----------|------------------|
| 1. Scope | 1 (0b00001) | `completed_steps & 1` |
| 2. Requirements | 2 (0b00010) | `completed_steps & 2` |
| 3. MVP | 4 (0b00100) | `completed_steps & 4` |
| 4. Tech Stack | 8 (0b01000) | `completed_steps & 8` |
| 5. Implementation Plan | 16 (0b10000) | `completed_steps & 16` |

Helper function to count completed steps: `SELECT completed_steps` then use bit counting in application code.

## TypeScript Interfaces

```typescript
// lib/types/project.ts

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
```

## Key Queries

```sql
-- List all projects for dashboard
SELECT id, title, completed_steps, created_at, updated_at
FROM projects
ORDER BY updated_at DESC;

-- Get single project with phases
SELECT * FROM projects WHERE id = ?;
SELECT * FROM project_phases WHERE project_id = ? ORDER BY phase_order ASC;

-- Create project (returns inserted id)
INSERT INTO projects (title, problem_statement, proposed_solution, boundaries, ...)
VALUES (?, ?, ?, ?, ...)
RETURNING id;

-- Upsert phases (delete-then-insert within a transaction)
DELETE FROM project_phases WHERE project_id = ?;
INSERT INTO project_phases (project_id, phase_order, phase_title, phase_description)
VALUES (?, ?, ?, ?);

-- Update project
UPDATE projects SET title = ?, ..., updated_at = datetime('now') WHERE id = ?;

-- Delete project (phases cascade)
DELETE FROM projects WHERE id = ?;
```

## Migration Strategy

- On app startup, `lib/db/migrations.ts` runs the `CREATE TABLE IF NOT EXISTS` statements.
- For future schema changes, add numbered migration functions (`migration_002`, etc.) and track applied migrations in a `schema_version` pragma or a `_migrations` table.
- For the MVP, the startup migration is sufficient.
