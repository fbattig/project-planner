'use client';

import { useState, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StepProgressBar } from './step-progress-bar';
import { WizardNavigation } from './wizard-navigation';
import { StepScope } from './step-scope';
import { StepRequirements } from './step-requirements';
import { StepMvp } from './step-mvp';
import { StepTechStack } from './step-tech-stack';
import { StepImplementation } from './step-implementation';
import { ReferencePanel } from '@/components/reference-panel/reference-panel';
import { generateStepContent } from '@/app/actions/ai-actions';
import type { WizardFormData, PhaseFormData } from './wizard-types';
import type { ActionResult } from '@/app/actions/project-actions';

interface WizardContentProps {
  initialData: WizardFormData;
  projectId?: number;
  saveAction: (projectId: number | undefined, formData: FormData) => Promise<ActionResult>;
}

function computeCompletedStepsMask(data: WizardFormData): number {
  let mask = 0;
  if (data.problem_statement.length > 0 && data.proposed_solution.length > 0) mask |= 1;
  if (data.functional_requirements.length > 0) mask |= 2;
  if (data.must_have_features.length > 0) mask |= 4;
  if (data.frontend.length > 0 || data.backend.length > 0 || data.database.length > 0) mask |= 8;
  if (data.phases.length > 0) mask |= 16;
  return mask;
}

export function WizardContent({ initialData, projectId, saveAction }: WizardContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get('step');
  const initialStep = stepParam ? Math.min(5, Math.max(1, parseInt(stepParam, 10) || 1)) : 1;

  const [activeStep, setActiveStep] = useState(initialStep);
  const [formData, setFormData] = useState<WizardFormData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [generating, setGenerating] = useState(false);
  const [showRefOnMobile, setShowRefOnMobile] = useState(false);

  const handleFieldChange = useCallback(
    (field: keyof WizardFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handlePhasesChange = useCallback((phases: PhaseFormData[]) => {
    setFormData((prev) => ({ ...prev, phases }));
  }, []);

  const handleGenerate = useCallback(async () => {
    setError(null);
    setGenerating(true);

    const contextFields: Record<string, string> = {
      problem_statement: formData.problem_statement,
      proposed_solution: formData.proposed_solution,
      functional_requirements: formData.functional_requirements,
      must_have_features: formData.must_have_features,
      frontend: formData.frontend,
      backend: formData.backend,
      database: formData.database,
    };

    try {
      const result = await generateStepContent(activeStep, formData.title, contextFields);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.data) {
        setFormData((prev) => {
          const updated = { ...prev };
          for (const [key, value] of Object.entries(result.data!)) {
            if (key === 'phases' && Array.isArray(value)) {
              updated.phases = value as PhaseFormData[];
            } else if (typeof value === 'string' && key in updated) {
              (updated as Record<string, unknown>)[key] = value;
            }
          }
          return updated;
        });
      }
    } catch {
      setError('AI generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  }, [activeStep, formData]);

  const navigateToStep = (step: number) => {
    setActiveStep(step);
    const url = new URL(window.location.href);
    url.searchParams.set('step', String(step));
    router.replace(url.pathname + url.search, { scroll: false });
  };

  const handleSave = () => {
    setError(null);
    const fd = new FormData();

    const { phases, ...fields } = formData;
    for (const [key, value] of Object.entries(fields)) {
      fd.append(key, value);
    }

    phases.forEach((phase, i) => {
      fd.append(`phase_title_${i}`, phase.phase_title);
      fd.append(`phase_description_${i}`, phase.phase_description);
    });

    startTransition(async () => {
      const result = await saveAction(projectId, fd);
      if ('error' in result) {
        setError(result.error);
      }
    });
  };

  const completedSteps = computeCompletedStepsMask(formData);

  return (
    <div className="flex flex-col gap-4">
      <StepProgressBar
        activeStep={activeStep}
        completedSteps={completedSteps}
        onStepClick={navigateToStep}
      />

      {error && (
        <div className="rounded-[var(--radius-md)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 px-4 py-3 text-sm text-[var(--color-danger)]">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5">
            {activeStep === 1 && (
              <StepScope
                data={formData}
                onChange={handleFieldChange}
                onGenerate={handleGenerate}
                generating={generating}
              />
            )}
            {activeStep === 2 && (
              <StepRequirements
                data={formData}
                onChange={handleFieldChange}
                onGenerate={handleGenerate}
                generating={generating}
              />
            )}
            {activeStep === 3 && (
              <StepMvp
                data={formData}
                onChange={handleFieldChange}
                onGenerate={handleGenerate}
                generating={generating}
              />
            )}
            {activeStep === 4 && (
              <StepTechStack
                data={formData}
                onChange={handleFieldChange}
                onGenerate={handleGenerate}
                generating={generating}
              />
            )}
            {activeStep === 5 && (
              <StepImplementation
                data={formData}
                onPhasesChange={handlePhasesChange}
                onGenerate={handleGenerate}
                generating={generating}
              />
            )}
            <WizardNavigation
              activeStep={activeStep}
              onPrev={() => navigateToStep(activeStep - 1)}
              onNext={() => navigateToStep(activeStep + 1)}
              onSave={handleSave}
              saving={isPending}
            />
          </div>
        </div>

        {/* Desktop reference panel */}
        <div className="hidden lg:block w-[40%] min-w-[320px]">
          <ReferencePanel activeStep={activeStep} />
        </div>

        {/* Mobile reference toggle */}
        <button
          onClick={() => setShowRefOnMobile(!showRefOnMobile)}
          className="lg:hidden fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-[var(--color-accent)] text-white shadow-lg flex items-center justify-center text-lg hover:bg-[var(--color-accent-hover)] transition-colors"
          aria-label="Toggle reference panel"
        >
          ?
        </button>

        {/* Mobile reference drawer */}
        {showRefOnMobile && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowRefOnMobile(false)}
            />
            <div className="relative ml-auto w-full max-w-md bg-[var(--color-bg-primary)] h-full overflow-y-auto p-4">
              <button
                onClick={() => setShowRefOnMobile(false)}
                className="absolute top-3 right-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] text-lg"
              >
                X
              </button>
              <ReferencePanel activeStep={activeStep} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
