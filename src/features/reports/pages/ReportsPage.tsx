import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/common';
import { Card, Skeleton } from '@/components/ui';
import { Activity } from 'lucide-react';
import { reportsService } from '../services/reportsService';
import type { IncidentReportMetric } from '../types';

export function ReportsPage() {
  const [metrics, setMetrics] = useState<IncidentReportMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await reportsService.getIncidentMetrics();
        if (response.data) {
          setMetrics(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch incident metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Reportes" 
        description="Analítica operativa y estadísticas generales (Arquitectura Medallón)." 
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <Skeleton className="h-[120px] w-full" />
        ) : metrics.length > 0 ? (
          metrics.map((metric) => (
            <Card key={metric.id} className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 capitalize">
                    {metric.metricName.replace(/_/g, ' ').toLowerCase()}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {metric.metricValue}
                  </h3>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-400">
                Última actualización: {new Date(metric.aggregatedAt).toLocaleString()}
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <p className="text-gray-500 text-sm">No hay métricas disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
