import { Activity, AlertTriangle, ArrowDown, Car, Clock, Gauge, Shield, Smartphone, TriangleAlert } from 'lucide-react';
import type { KpiData, Incident, Category } from '../types';

export const mockKpis: KpiData[] = [
  {
    id: 'security',
    title: 'Nivel de seguridad',
    value: '94%',
    subtitle: 'Excelente',
    icon: Shield,
    progress: 94,
    color: 'green',
  },
  {
    id: 'vehicles',
    title: 'Vehículos monitoreados',
    value: 42,
    subtitle: 'Seguimiento GPS activo',
    icon: Activity,
    color: 'default',
  },
  {
    id: 'alerts',
    title: 'Alertas hoy',
    value: 24,
    subtitle: '↓18% vs. ayer',
    icon: Clock,
    color: 'orange',
  },
  {
    id: 'critical',
    title: 'Eventos críticos',
    value: 3,
    subtitle: 'Requieren atención inmediata',
    icon: TriangleAlert,
    color: 'red',
  },
];

export const mockIncidents: Incident[] = [
  {
    id: 1,
    type: 'Uso de teléfono',
    driver: 'Ana García',
    vehicle: 'DEF-5678',
    location: 'Autopista Panamericana Km 58',
    status: 'critical',
    time: 'Hace 12 min',
    icon: Smartphone,
  },
  {
    id: 2,
    type: 'Conducción agresiva',
    driver: 'Miguel Torres',
    vehicle: 'GHI-9012',
    location: 'Av. Javier Prado Este',
    status: 'warning',
    time: 'Hace 28 min',
    icon: AlertTriangle,
  },
  {
    id: 3,
    type: 'Exceso de velocidad',
    driver: 'Carlos Mendoza',
    vehicle: 'JKL-3456',
    location: 'Carretera Central Km 15',
    status: 'critical',
    time: 'Hace 35 min',
    icon: Gauge,
  },
  {
    id: 4,
    type: 'Frenado brusco',
    driver: 'Lucía Fernández',
    vehicle: 'MNO-7890',
    location: 'Calle Las Flores 123',
    status: 'warning',
    time: 'Hace 1 h',
    icon: ArrowDown,
  },
  {
    id: 5,
    type: 'Riesgo de colisión',
    driver: 'Roberto Sánchez',
    vehicle: 'PQR-1234',
    location: 'Av. Primavera 456',
    status: 'critical',
    time: 'Hace 2 h',
    icon: Car,
  },
];

export const mockCategories: Category[] = [
  { id: 'phone', name: 'Uso de teléfono', count: 12, color: 'red', icon: Smartphone },
  { id: 'speed', name: 'Exceso de velocidad', count: 15, color: 'red', icon: Gauge },
  { id: 'aggressive', name: 'Conducción agresiva', count: 6, color: 'orange', icon: AlertTriangle },
  { id: 'braking', name: 'Frenados bruscos', count: 8, color: 'yellow', icon: ArrowDown },
  { id: 'collision', name: 'Riesgo de colisión', count: 4, color: 'red', icon: Car },
];
