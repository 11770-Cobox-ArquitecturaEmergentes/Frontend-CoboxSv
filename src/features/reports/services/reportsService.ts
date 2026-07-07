import axios from 'axios';
import { getAccessToken } from '@/lib';
import type { IncidentReportMetric, ReportMetric } from '../types';

export const reportApiClient = axios.create({
  baseURL: import.meta.env.VITE_REPORTS_API_URL ?? 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
  validateStatus: (status) => status < 400,
});

reportApiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const reportsService = {
  getIncidentMetrics: () => reportApiClient.get<IncidentReportMetric[]>('/reports/incidents'),
  getOperationsMetrics: () => reportApiClient.get<ReportMetric[]>('/reports/operations'),
  getSmartVisionMetrics: () => reportApiClient.get<ReportMetric[]>('/reports/smartvision'),
  getMaintenanceMetrics: () => reportApiClient.get<ReportMetric[]>('/reports/maintenance'),
  getFleetMetrics: () => reportApiClient.get<ReportMetric[]>('/reports/fleet'),
  getDeliveriesMetrics: () => reportApiClient.get<ReportMetric[]>('/reports/deliveries'),
};