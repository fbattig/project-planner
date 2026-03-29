import { z } from 'zod/v4';

const MAX_FIELD_LENGTH = 5000;

export const phaseSchema = z.object({
  phase_title: z
    .string()
    .trim()
    .min(1, 'Phase title is required')
    .max(100, 'Phase title must be 100 characters or fewer'),
  phase_description: z
    .string()
    .trim()
    .min(10, 'Phase description must be at least 10 characters')
    .max(MAX_FIELD_LENGTH),
  phase_order: z.number().int().min(0),
});

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(120, 'Title must be 120 characters or fewer'),

  // Step 1: Scope
  problem_statement: z
    .string()
    .trim()
    .max(MAX_FIELD_LENGTH)
    .refine((val) => val.length === 0 || val.length >= 10, {
      message: 'Problem statement must be at least 10 characters',
    }),
  proposed_solution: z
    .string()
    .trim()
    .max(MAX_FIELD_LENGTH)
    .refine((val) => val.length === 0 || val.length >= 10, {
      message: 'Proposed solution must be at least 10 characters',
    }),
  boundaries: z.string().trim().max(MAX_FIELD_LENGTH).default(''),

  // Step 2: Requirements
  functional_requirements: z.string().trim().max(MAX_FIELD_LENGTH).default(''),
  non_functional_requirements: z.string().trim().max(MAX_FIELD_LENGTH).default(''),
  user_roles: z.string().trim().max(MAX_FIELD_LENGTH).default(''),

  // Step 3: MVP
  must_have_features: z
    .string()
    .trim()
    .max(MAX_FIELD_LENGTH)
    .refine((val) => val.length === 0 || val.length >= 10, {
      message: 'Must-have features must be at least 10 characters',
    }),
  nice_to_have_features: z.string().trim().max(MAX_FIELD_LENGTH).default(''),
  mvp_rationale: z.string().trim().max(MAX_FIELD_LENGTH).default(''),

  // Step 4: Tech Stack
  frontend: z.string().trim().max(MAX_FIELD_LENGTH).default(''),
  backend: z.string().trim().max(MAX_FIELD_LENGTH).default(''),
  database: z.string().trim().max(MAX_FIELD_LENGTH).default(''),
  other_tools: z.string().trim().max(MAX_FIELD_LENGTH).default(''),

  // Step 5: Phases
  phases: z.array(phaseSchema).default([]),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type PhaseInput = z.infer<typeof phaseSchema>;
