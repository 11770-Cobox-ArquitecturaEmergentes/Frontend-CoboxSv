import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reportsService';
import type { IncidentReportMetric, ReportCategory, ReportMetric } from '../types';

function fetchByCategory(category: ReportCategory) {
  switch (category) {
    case 'incidents':
      return reportsService.getIncidentMetrics();
    case 'operations':
      return reportsService.getOperationsMetrics();
    case 'smartvision':
      return reportsService.getSmartVisionMetrics();
    case 'maintenance':
      return reportsService.getMaintenanceMetrics();
    case 'fleet':
      return reportsService.getFleetMetrics();
    case 'deliveries':
      return reportsService.getDeliveriesMetrics();
  }
}

export function useReportMetrics(category: ReportCategory) {
  return useQuery<IncidentReportMetric[] | ReportMetric[]>({
    queryKey: ['reports', category],
    queryFn: async () => (await fetchByCategory(category)).data,
  });
}