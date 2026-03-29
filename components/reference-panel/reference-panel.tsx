'use client';

import { useState } from 'react';
import { REFERENCE_DATA } from '@/lib/constants/reference-data';
import { ReferenceSection } from './reference-section';

export function ReferencePanel({ activeStep }: { activeStep: number }) {
  const [collapsed, setCollapsed] = useState(false);

  const stepData = REFERENCE_DATA.find((s) => s.stepNumber === activeStep);

  if (!stepData) return null;

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[var(--color-bg-elevated)] transition-colors"
      >
        <div>
          <div className="text-sm font-semibold text-[var(--color-text-primary)]">
            Reference: AI Help Desk
          </div>
          <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
            See how this step looks in a real project
          </div>
        </div>
        <span className="text-[var(--color-text-muted)] text-lg">
          {collapsed ? '+' : '\u2212'}
        </span>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          collapsed ? 'max-h-0' : 'max-h-[2000px]'
        }`}
      >
        <div className="px-5 pb-5 border-t border-[var(--color-border)]">
          <h3 className="text-base font-semibold text-[var(--color-accent)] mt-4 mb-4">
            {stepData.title}
          </h3>
          {stepData.sections.map((section, i) => (
            <ReferenceSection key={i} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
