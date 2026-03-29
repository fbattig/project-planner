'use client';

import Link from 'next/link';
import type { ProjectListItem } from '@/lib/types/project';
import { deleteProjectAction } from '@/app/actions/project-actions';

function formatDate(iso: string): string {
  const date = new Date(iso + 'Z');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function countBits(n: number): number {
  let count = 0;
  for (let i = 0; i < 5; i++) {
    if ((n & (1 << i)) !== 0) count++;
  }
  return count;
}

export function ProjectCard({ project }: { project: ProjectListItem }) {
  const completed = countBits(project.completed_steps);

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      return;
    }
    const fd = new FormData();
    fd.append('id', String(project.id));
    deleteProjectAction(fd);
  };

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 shadow-[var(--shadow-card)] hover:border-[var(--color-accent)]/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-[var(--color-text-primary)] line-clamp-1">
          {project.title}
        </h3>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ml-2 ${
            completed === 5
              ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]'
              : 'bg-[var(--color-warning)]/15 text-[var(--color-warning)]'
          }`}
        >
          {completed}/5 steps
        </span>
      </div>
      <div className="text-xs text-[var(--color-text-muted)] mb-4 space-y-0.5">
        <p>Created: {formatDate(project.created_at)}</p>
        <p>Updated: {formatDate(project.updated_at)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/projects/${project.id}`}
          className="text-xs px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          View
        </Link>
        <Link
          href={`/projects/${project.id}/edit`}
          className="text-xs px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="text-xs px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)] transition-colors ml-auto"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
