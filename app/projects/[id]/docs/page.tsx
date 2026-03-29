import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/db/queries';
import { runMigrations } from '@/lib/db/migrations';
import { DocsViewer } from '@/components/generate-docs/docs-viewer';

export default async function GenerateDocsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  runMigrations();
  const { id } = await params;
  const project = getProjectById(Number(id));

  if (!project) notFound();

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-border)] px-6 py-4 flex items-center gap-4">
        <Link
          href={`/projects/${project.id}`}
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          &larr; Back to Project
        </Link>
        <div>
          <h1 className="text-lg font-semibold">Claude Code Files</h1>
          <p className="text-xs text-[var(--color-text-muted)]">{project.title}</p>
        </div>
      </header>
      <main className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
        <DocsViewer project={project} />
      </main>
    </div>
  );
}
