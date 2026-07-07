export type Report = {
  id: string;
  name: string;
  type: 'operations' | 'incidents' | 'maintenance';
};

export type ReportCategory =
  | 'incidents'
  | 'operations'
  | 'smartvision'
  | 'maintenance'
  | 'fleet'
  | 'deliveries';

export type ReportMetric = {
  id: number;
  metricName: string;
  metricValue: number | string;
  aggregatedAt: string;
  [key: string]: unknown;
};

export type IncidentReportMetric = {
  id: number;
  metricName: string;
  metricValue: string;
  aggregatedAt: string;
};