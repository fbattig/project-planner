import { FormField } from '@/components/ui/form-field';
import { AiPromptCard } from './ai-prompt-card';
import type { WizardFormData } from './wizard-types';

interface StepRequirementsProps {
  data: WizardFormData;
  onChange: (field: keyof WizardFormData, value: string) => void;
}

export function StepRequirements({ data, onChange }: StepRequirementsProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Step 2: Gather Requirements</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-5">
        What must the system do? Who are the users?
      </p>
      <AiPromptCard
        projectTitle={data.title}
        scope={data.proposed_solution}
      />
      <FormField
        label="Functional Requirements"
        name="functional_requirements"
        value={data.functional_requirements}
        onChange={(v) => onChange('functional_requirements', v)}
        required
        multiline
        placeholder="List what the system must do (one requirement per line)."
      />
      <FormField
        label="Non-Functional Requirements"
        name="non_functional_requirements"
        value={data.non_functional_requirements}
        onChange={(v) => onChange('non_functional_requirements', v)}
        multiline
        placeholder="Performance, security, scalability constraints."
      />
      <FormField
        label="User Roles"
        name="user_roles"
        value={data.user_roles}
        onChange={(v) => onChange('user_roles', v)}
        multiline
        placeholder="Who are the users? What can each role do?"
      />
    </div>
  );
}
