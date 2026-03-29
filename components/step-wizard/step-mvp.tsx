import { FormField } from '@/components/ui/form-field';
import type { WizardFormData } from './wizard-types';

interface StepMvpProps {
  data: WizardFormData;
  onChange: (field: keyof WizardFormData, value: string) => void;
}

export function StepMvp({ data, onChange }: StepMvpProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Step 3: Define the MVP</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-5">
        What must ship in version 1? What can wait?
      </p>
      <FormField
        label="Must-Have Features"
        name="must_have_features"
        value={data.must_have_features}
        onChange={(v) => onChange('must_have_features', v)}
        required
        multiline
        placeholder="Features that must ship in version 1 (one per line)."
      />
      <FormField
        label="Nice-to-Have Features"
        name="nice_to_have_features"
        value={data.nice_to_have_features}
        onChange={(v) => onChange('nice_to_have_features', v)}
        multiline
        placeholder="Features deferred to later versions."
      />
      <FormField
        label="MVP Rationale"
        name="mvp_rationale"
        value={data.mvp_rationale}
        onChange={(v) => onChange('mvp_rationale', v)}
        multiline
        placeholder="Why is this the right cut line for V1?"
      />
    </div>
  );
}
