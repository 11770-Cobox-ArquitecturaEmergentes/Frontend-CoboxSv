import { useMemo } from 'react';
import { mockKpis, mockIncidents, mockCategories } from '../data/mockDashboard';

export function useDashboard() {
  const kpis = useMemo(() => mockKpis, []);
  const incidents = useMemo(() => mockIncidents, []);
  const categories = useMemo(() => mockCategories, []);

  return {
    kpis,
    incidents,
    categories,
    isLoading: false,
    isError: false,
  };
}
