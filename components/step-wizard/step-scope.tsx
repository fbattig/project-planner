import { FormField } from '@/components/ui/form-field';
import { AiGenerateButton } from './ai-generate-button';
import type { WizardFormData } from './wizard-types';

interface StepScopeProps {
  data: WizardFormData;
  onChange: (field: keyof WizardFormData, value: string) => void;
  onGenerate: () => void;
  generating: boolean;
}

export function StepScope({ data, onChange, onGenerate, generating }: StepScopeProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Step 1: Define the Scope</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-5">
        What problem are you solving and what&apos;s your proposed solution?
      </p>
      <FormField
        label="Project Title"
        name="title"
        value={data.title}
        onChange={(v) => onChange('title', v)}
        required
        maxLength={120}
        placeholder="e.g., AI Help Desk"
      />
      <AiGenerateButton
        onClick={onGenerate}
        loading={generating}
        disabled={!data.title.trim()}
      />
      <FormField
        label="Problem Statement"
        name="problem_statement"
        value={data.problem_statement}
        onChange={(v) => onChange('problem_statement', v)}
        required
        multiline
        placeholder="What problem does this project solve? Who experiences it?"
      />
      <FormField
        label="Proposed Solution"
        name="proposed_solution"
        value={data.proposed_solution}
        onChange={(v) => onChange('proposed_solution', v)}
        required
        multiline
        placeholder="Describe your solution at a high level."
      />
      <FormField
        label="Boundaries (Out of Scope)"
        name="boundaries"
        value={data.boundaries}
        onChange={(v) => onChange('boundaries', v)}
        multiline
        placeholder="What is explicitly NOT included in this project?"
      />
    </div>
  );
}
