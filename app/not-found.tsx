import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">404</div>
        <h1 className="text-xl font-semibold mb-2">Page not found</h1>
        <p className="text-[var(--color-text-secondary)] mb-6">
          The project you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block rounded-[var(--radius-md)] bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
