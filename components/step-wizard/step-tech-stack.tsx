import { FormField } from '@/components/ui/form-field';
import { AiGenerateButton } from './ai-generate-button';
import type { WizardFormData } from './wizard-types';

interface StepTechStackProps {
  data: WizardFormData;
  onChange: (field: keyof WizardFormData, value: string) => void;
  onGenerate: () => void;
  generating: boolean;
}

export function StepTechStack({ data, onChange, onGenerate, generating }: StepTechStackProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Step 4: Choose the Tech Stack</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-5">
        What technologies will you use and why?
      </p>
      <AiGenerateButton
        onClick={onGenerate}
        loading={generating}
        disabled={!data.title.trim()}
      />
      <FormField
        label="Frontend"
        name="frontend"
        value={data.frontend}
        onChange={(v) => onChange('frontend', v)}
        placeholder="e.g., Next.js (React) — SSR for fast dashboards"
      />
      <FormField
        label="Backend"
        name="backend"
        value={data.backend}
        onChange={(v) => onChange('backend', v)}
        placeholder="e.g., Next.js Server Actions — same repo as frontend"
      />
      <FormField
        label="Database"
        name="database"
        value={data.database}
        onChange={(v) => onChange('database', v)}
        placeholder="e.g., PostgreSQL — relational model fits the data"
      />
      <FormField
        label="Other Tools"
        name="other_tools"
        value={data.other_tools}
        onChange={(v) => onChange('other_tools', v)}
        multiline
        placeholder="Hosting, CI/CD, libraries, APIs, etc."
      />
    </div>
  );
}
