interface WizardNavigationProps {
  activeStep: number;
  onPrev: () => void;
  onNext: () => void;
  onSave: () => void;
  saving: boolean;
}

export function WizardNavigation({
  activeStep,
  onPrev,
  onNext,
  onSave,
  saving,
}: WizardNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)] mt-6">
      <button
        type="button"
        onClick={onPrev}
        disabled={activeStep === 1}
        className="px-4 py-2 text-sm rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2 text-sm rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors font-medium"
        >
          {saving ? 'Saving...' : 'Save Project'}
        </button>
        {activeStep < 5 && (
          <button
            type="button"
            onClick={onNext}
            className="px-4 py-2 text-sm rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
