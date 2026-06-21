import { BrainCircuit } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { StatsCard } from '../components/StatsCard';
import { IncidentCard } from '../components/IncidentCard';
import { CategoryProgress } from '../components/CategoryProgress';

export function SmartVisionPage() {
  const { kpis, incidents, categories } = useDashboard();

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] text-white">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">SmartVision AI</h1>
          <p className="mt-0.5 text-sm text-[#6B7280]">Centro de operaciones con inteligencia artificial</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, index) => (
          <StatsCard key={kpi.id} kpi={kpi} index={index} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#111827]">Detección de riesgos en tiempo real</h2>
          <div className="space-y-3">
            {incidents.map((incident, index) => (
              <IncidentCard key={incident.id} incident={incident} index={index} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#111827]">Detección por categoría</h2>
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <CategoryProgress categories={categories} />
          </div>
        </div>
      </div>
    </section>
  );
}
