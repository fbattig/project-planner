import Link from 'next/link';
import { getAllProjects } from '@/lib/db/queries';
import { runMigrations } from '@/lib/db/migrations';
import { ProjectCard } from '@/components/dashboard/project-card';

export default function DashboardPage() {
  runMigrations();
  const projects = getAllProjects();

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Project Planner</h1>
        <Link
          href="/projects/new"
          className="rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          + New Project
        </Link>
      </header>
      <main className="px-4 sm:px-6 py-8 max-w-5xl mx-auto">
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-lg font-semibold mb-2">No projects yet</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Start your first project to transform an idea into a buildable blueprint.
            </p>
            <Link
              href="/projects/new"
              className="inline-block rounded-[var(--radius-md)] bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              Start your first project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
