export interface FleetPerformanceData {
  month: string;
  value: number;
}

export interface FuelConsumptionData {
  day: string;
  fuel: number;
}

export interface VehicleHealthData {
  name: string;
  value: number;
  color: string;
}

export interface RouteEfficiencyData {
  route: string;
  efficiency: number;
}

export interface FleetMarker {
  id: string;
  name: string;
  position: [number, number];
  status: 'en_ruta' | 'en_pausa' | 'estacionado';
  speed: number;
  lastUpdate: string;
}

export const fleetPerformanceData: FleetPerformanceData[] = [
  { month: 'Lun', value: 86 },
  { month: 'Mar', value: 88 },
  { month: 'Mié', value: 82 },
  { month: 'Jue', value: 90 },
  { month: 'Vie', value: 92 },
  { month: 'Sáb', value: 96 },
];

export const fuelConsumptionData: FuelConsumptionData[] = [
  { day: 'L', fuel: 450 },
  { day: 'M', fuel: 520 },
  { day: 'X', fuel: 480 },
  { day: 'J', fuel: 510 },
  { day: 'V', fuel: 490 },
  { day: 'S', fuel: 370 },
  { day: 'D', fuel: 310 },
];

export const vehicleHealthData: VehicleHealthData[] = [
  { name: 'Óptimo', value: 65, color: '#10B981' },
  { name: 'Atención', value: 25, color: '#F59E0B' },
  { name: 'Crítico', value: 10, color: '#EF4444' },
];

export const routeEfficiencyData: RouteEfficiencyData[] = [
  { route: 'R-001', efficiency: 96 },
  { route: 'R-002', efficiency: 89 },
  { route: 'R-003', efficiency: 93 },
  { route: 'R-004', efficiency: 78 },
  { route: 'R-005', efficiency: 86 },
];

export const fleetMarkers: FleetMarker[] = [
  {
    id: '1',
    name: 'Camión 01',
    position: [-12.0464, -77.0428],
    status: 'en_ruta',
    speed: 65,
    lastUpdate: 'Hace 2 min',
  },
  {
    id: '2',
    name: 'Camión 02',
    position: [-12.0632, -77.0362],
    status: 'en_pausa',
    speed: 0,
    lastUpdate: 'Hace 5 min',
  },
  {
    id: '3',
    name: 'Camión 03',
    position: [-12.0715, -77.0501],
    status: 'estacionado',
    speed: 0,
    lastUpdate: 'Hace 15 min',
  },
  {
    id: '4',
    name: 'Camión 04',
    position: [-12.0538, -77.0585],
    status: 'en_ruta',
    speed: 72,
    lastUpdate: 'Hace 1 min',
  },
];

export const CHART_COLORS = {
  green: '#10B981',
  blue: '#2563EB',
  gradientFrom: '#10B981',
  gradientTo: '#D1FAE5',
} as const;
