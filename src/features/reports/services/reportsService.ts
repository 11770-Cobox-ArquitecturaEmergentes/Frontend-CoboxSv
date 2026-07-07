import axios from 'axios';
import { getAccessToken } from '@/lib';
import type { IncidentReportMetric } from '../types';

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
};
