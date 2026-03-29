import type { ReferenceSection as ReferenceSectionType } from '@/lib/constants/reference-data';

export function ReferenceSection({ section }: { section: ReferenceSectionType }) {
  return (
    <div className="mb-5">
      <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
        {section.heading}
      </h4>
      <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
        {section.content}
      </div>
    </div>
  );
}
