import { STEP_LABELS } from './wizard-types';

interface StepProgressBarProps {
  activeStep: number;
  completedSteps: number;
  onStepClick: (step: number) => void;
}

export function StepProgressBar({
  activeStep,
  completedSteps,
  onStepClick,
}: StepProgressBarProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === activeStep;
        const isCompleted = (completedSteps & (1 << i)) !== 0;

        return (
          <button
            key={stepNum}
            onClick={() => onStepClick(stepNum)}
            className={`flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-[var(--color-accent)] text-white'
                : isCompleted
                  ? 'bg-[var(--color-bg-elevated)] text-[var(--color-success)] border border-[var(--color-success)]/30'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)]'
            }`}
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full text-xs">
              {isCompleted && !isActive ? '\u2713' : stepNum}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
