export type Report = {
  id: string;
  name: string;
  type: 'operations' | 'incidents' | 'maintenance';
};

export type IncidentReportMetric = {
  id: number;
  metricName: string;
  metricValue: string;
  aggregatedAt: string;
};
