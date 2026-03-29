'use client';

import { useState, useEffect, useCallback } from 'react';
import { generateProjectDocs } from '@/app/actions/generate-docs-action';
import type { GeneratedDoc } from '@/app/actions/generate-docs-action';
import type { ProjectWithPhases } from '@/lib/types/project';

interface DocsViewerProps {
  project: ProjectWithPhases;
}

export function DocsViewer({ project }: DocsViewerProps) {
  const [docs, setDocs] = useState<GeneratedDoc[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await generateProjectDocs(project);
    if (result.error) {
      setError(result.error);
    } else {
      setDocs(result.docs);
    }
    setLoading(false);
  }, [project]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleCopy = async (index: number) => {
    if (!docs?.[index]) return;
    await navigator.clipboard.writeText(docs[index].content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    if (!docs) return;
    const allContent = docs
      .map((d) => `--- ${d.filename} ---\n\n${d.content}`)
      .join('\n\n\n');
    await navigator.clipboard.writeText(allContent);
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownload = (doc: GeneratedDoc) => {
    const blob = new Blob([doc.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.filename.replace('docs/', '');
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    if (!docs) return;
    docs.forEach((doc) => handleDownload(doc));
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-3 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-[var(--color-text-secondary)]">
          Generating project documentation with AI...
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          Creating 7 files — this may take a moment
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="rounded-[var(--radius-md)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 px-6 py-4 inline-block">
          <p className="text-sm text-[var(--color-danger)] mb-3">{error}</p>
          <button
            onClick={generate}
            className="text-xs px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!docs) return null;

  const activeDoc = docs[activeTab];

  return (
    <div>
      {/* Header actions */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--color-text-secondary)]">
          7 files generated. Copy or download them into your project folder, then run Claude Code.
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="text-xs px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            {copiedIndex === -1 ? 'Copied all!' : 'Copy All'}
          </button>
          <button
            onClick={handleDownloadAll}
            className="text-xs px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
          >
            Download All
          </button>
          <button
            onClick={generate}
            className="text-xs px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Regenerate
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-[var(--color-border)] mb-0">
        {docs.map((doc, i) => (
          <button
            key={doc.filename}
            onClick={() => setActiveTab(i)}
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
              i === activeTab
                ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            {doc.filename}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeDoc && (
        <div className="rounded-b-[var(--radius-lg)] border border-t-0 border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
            <span className="text-xs font-mono text-[var(--color-text-muted)]">
              {activeDoc.filename}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(activeTab)}
                className="text-xs px-3 py-1 rounded-[var(--radius-sm)] text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] transition-colors"
              >
                {copiedIndex === activeTab ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => handleDownload(activeDoc)}
                className="text-xs px-3 py-1 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Download
              </button>
            </div>
          </div>
          <pre className="p-4 text-sm text-[var(--color-text-primary)] whitespace-pre-wrap font-[family-name:var(--font-jetbrains)] overflow-x-auto max-h-[600px] overflow-y-auto leading-relaxed">
            {activeDoc.content}
          </pre>
        </div>
      )}

      {/* Usage instructions */}
      <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
          How to use with Claude Code
        </h3>
        <ol className="text-xs text-[var(--color-text-secondary)] space-y-1.5 list-decimal list-inside">
          <li>Create a new project folder and place <code className="text-[var(--color-accent)]">CLAUDE.md</code> in the root</li>
          <li>Create a <code className="text-[var(--color-accent)]">docs/</code> subfolder and place the remaining 6 files inside</li>
          <li>Open the folder in your terminal and run <code className="text-[var(--color-accent)]">claude</code></li>
          <li>Ask Claude Code: <em>&quot;Read the docs and start building Phase 1&quot;</em></li>
        </ol>
      </div>
    </div>
  );
}
