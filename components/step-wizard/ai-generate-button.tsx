'use client';

interface AiGenerateButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
}

export function AiGenerateButton({ onClick, loading, disabled }: AiGenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="mb-5 w-full flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-accent)]/30 bg-[var(--color-accent-subtle)] px-4 py-2.5 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Generating with AI...
        </>
      ) : (
        <>
          <span className="text-base">&#9733;</span>
          AI Generate
        </>
      )}
    </button>
  );
}
