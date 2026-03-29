'use server';

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface StepGenerationResult {
  [key: string]: string | { phase_title: string; phase_description: string }[];
}

const STEP_PROMPTS: Record<number, (title: string, context: string) => string> = {
  1: (title, _context) => `You are a software project planning assistant. Given the project title "${title}", generate a realistic and detailed project scope.

Return ONLY valid JSON with these exact keys:
{
  "problem_statement": "A detailed problem statement (2-3 sentences describing the pain point)",
  "proposed_solution": "A high-level solution description (2-3 sentences)",
  "boundaries": "A bullet-point list of what is out of scope for V1 (use newlines between items)"
}`,

  2: (title, context) => `You are a software project planning assistant. The project is "${title}".
${context ? `Context from scope: ${context}` : ''}

Generate detailed requirements. Return ONLY valid JSON:
{
  "functional_requirements": "A numbered list of 5-7 functional requirements (use newlines between items)",
  "non_functional_requirements": "A bullet-point list of 3-4 non-functional requirements (performance, security, etc.)",
  "user_roles": "A description of 2-3 user roles and their permissions"
}`,

  3: (title, context) => `You are a software project planning assistant. The project is "${title}".
${context ? `Context: ${context}` : ''}

Define the MVP boundaries. Return ONLY valid JSON:
{
  "must_have_features": "A numbered list of 5-6 must-have features for V1 (use newlines between items)",
  "nice_to_have_features": "A bullet-point list of 3-4 features deferred to later versions",
  "mvp_rationale": "2-3 sentences explaining why this is the right MVP cut line"
}`,

  4: (title, context) => `You are a software project planning assistant. The project is "${title}".
${context ? `Context: ${context}` : ''}

Recommend a modern tech stack. Return ONLY valid JSON:
{
  "frontend": "Framework choice with brief rationale (1 sentence)",
  "backend": "Backend/API choice with brief rationale (1 sentence)",
  "database": "Database choice with brief rationale (1 sentence)",
  "other_tools": "A bullet-point list of 3-4 other tools (hosting, CI/CD, libraries, etc.)"
}`,

  5: (title, context) => `You are a software project planning assistant. The project is "${title}".
${context ? `Context: ${context}` : ''}

Create a phased implementation plan with 4-5 phases. Return ONLY valid JSON:
{
  "phases": [
    {"phase_title": "Phase 1: Foundation", "phase_description": "Detailed description of what gets built (3-4 sentences)"},
    {"phase_title": "Phase 2: Core Features", "phase_description": "..."},
    {"phase_title": "Phase 3: ...", "phase_description": "..."}
  ]
}`,
};

function buildContext(step: number, formData: Record<string, string>): string {
  const parts: string[] = [];
  if (formData['problem_statement']) parts.push(`Problem: ${formData['problem_statement']}`);
  if (formData['proposed_solution']) parts.push(`Solution: ${formData['proposed_solution']}`);
  if (step >= 3 && formData['functional_requirements']) {
    parts.push(`Requirements: ${formData['functional_requirements']}`);
  }
  if (step >= 4 && formData['must_have_features']) {
    parts.push(`MVP Features: ${formData['must_have_features']}`);
  }
  if (step >= 5 && formData['frontend']) {
    parts.push(`Tech: ${formData['frontend']}, ${formData['backend']}, ${formData['database']}`);
  }
  return parts.join('\n');
}

export async function generateStepContent(
  step: number,
  title: string,
  formData: Record<string, string>
): Promise<{ data: StepGenerationResult | null; error: string | null }> {
  if (!title.trim()) {
    return { data: null, error: 'Enter a project title first (Step 1)' };
  }

  const promptFn = STEP_PROMPTS[step];
  if (!promptFn) {
    return { data: null, error: 'Invalid step' };
  }

  const context = buildContext(step, formData);

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: promptFn(title, context),
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return { data: null, error: 'No response from AI' };
    }

    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { data: null, error: 'Could not parse AI response' };
    }

    const parsed = JSON.parse(jsonMatch[0]) as StepGenerationResult;
    return { data: parsed, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI generation failed';
    return { data: null, error: message };
  }
}
