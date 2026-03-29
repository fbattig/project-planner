import { AiGenerateButton } from './ai-generate-button';
import type { WizardFormData, PhaseFormData } from './wizard-types';

interface StepImplementationProps {
  data: WizardFormData;
  onPhasesChange: (phases: PhaseFormData[]) => void;
  onGenerate: () => void;
  generating: boolean;
}

export function StepImplementation({ data, onPhasesChange, onGenerate, generating }: StepImplementationProps) {
  const addPhase = () => {
    onPhasesChange([...data.phases, { phase_title: '', phase_description: '' }]);
  };

  const removePhase = (index: number) => {
    onPhasesChange(data.phases.filter((_, i) => i !== index));
  };

  const updatePhase = (index: number, field: keyof PhaseFormData, value: string) => {
    const updated = data.phases.map((phase, i) =>
      i === index ? { ...phase, [field]: value } : phase
    );
    onPhasesChange(updated);
  };

  const movePhase = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= data.phases.length) return;
    const updated = [...data.phases];
    const temp = updated[index]!;
    updated[index] = updated[target]!;
    updated[target] = temp;
    onPhasesChange(updated);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Step 5: Plan the Implementation</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-5">
        Break the project into sequential phases.
      </p>
      <AiGenerateButton
        onClick={onGenerate}
        loading={generating}
        disabled={!data.title.trim()}
      />

      {data.phases.map((phase, i) => (
        <div
          key={i}
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 mb-3"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              Phase {i + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => movePhase(i, -1)}
                disabled={i === 0}
                className="px-2 py-1 text-xs rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-input)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Up
              </button>
              <button
                type="button"
                onClick={() => movePhase(i, 1)}
                disabled={i === data.phases.length - 1}
                className="px-2 py-1 text-xs rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-input)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Down
              </button>
              <button
                type="button"
                onClick={() => removePhase(i)}
                className="px-2 py-1 text-xs rounded-[var(--radius-sm)] text-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-white transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
          <div className="mb-3">
            <label
              htmlFor={`phase_title_${i}`}
              className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
            >
              Phase Title <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="text"
              id={`phase_title_${i}`}
              name={`phase_title_${i}`}
              value={phase.phase_title}
              onChange={(e) => updatePhase(i, 'phase_title', e.target.value)}
              maxLength={100}
              placeholder={`e.g., Phase ${i + 1}: Project Setup`}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--color-border-focus)] transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor={`phase_description_${i}`}
              className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
            >
              Description <span className="text-[var(--color-danger)]">*</span>
            </label>
            <textarea
              id={`phase_description_${i}`}
              name={`phase_description_${i}`}
              value={phase.phase_description}
              onChange={(e) => updatePhase(i, 'phase_description', e.target.value)}
              rows={3}
              placeholder="What gets built in this phase?"
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--color-border-focus)] transition-colors resize-y min-h-[80px]"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addPhase}
        className="w-full rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] py-3 text-sm text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
      >
        + Add Phase
      </button>
    </div>
  );
}
