import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui';
import type { DegradedSection } from '@/types';

type DegradedSectionsBannerProps = {
  sections?: DegradedSection[] | null;
  title?: string;
};

export function DegradedSectionsBanner({ sections, title = 'Información parcial' }: DegradedSectionsBannerProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50 p-4">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-[#D97706]">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-amber-950">{title}</h2>
          <div className="mt-2 grid gap-1 text-sm text-amber-900 md:grid-cols-2">
            {sections.map((section) => (
              <p key={`${section.section}-${section.reason}`} className="min-w-0">
                <span className="font-medium">{section.section}:</span> {section.reason}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}