'use client';

import { useState } from 'react';

export function AiPromptCard({ projectTitle, scope }: { projectTitle: string; scope: string }) {
  const [copied, setCopied] = useState(false);

  const prompt = `I'm building ${projectTitle || '[project description]'}. Here is my initial scope: ${scope || '[paste scope]'}. What requirements am I missing? What edge cases should I consider? What clarifying questions should I answer before I start building?`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-[var(--color-accent)]">
          AI Thinking Partner Prompt
        </h4>
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="text-xs text-[var(--color-text-muted)] mb-2">
        Paste this into Claude, ChatGPT, or another AI tool to pressure-test your requirements.
      </p>
      <pre className="text-xs text-[var(--color-text-secondary)] whitespace-pre-wrap font-[family-name:var(--font-jetbrains)] bg-[var(--color-bg-input)] rounded-[var(--radius-sm)] p-3">
        {prompt}
      </pre>
    </div>
  );
}
