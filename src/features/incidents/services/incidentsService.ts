import type { Incident, CreateIncidentPayload, ResolveIncidentPayload, IncidentStatus } from '../types';

const STORAGE_KEY = 'cobox_incidents';

const initialMockIncidents: Incident[] = [
  {
    id: 'INC-101',
    serviceReference: '1', // Relacionado con la primera orden
    reporterReference: 'Conductor #1',
    type: 'BREAKDOWN',
    severity: 'HIGH',
    status: 'REPORTED',
    description: 'Falla mecánica en el motor auxiliar. El camión se encuentra estacionado a un lado de la vía.',
    location: 'Km 24 Panamericana Sur, Lima',
    evidenceReferences: [],
    statusHistory: [
      { status: 'REPORTED', changedAt: new Date(Date.now() - 3600000).toISOString(), note: 'Incidente reportado por telemetría del conductor.' }
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'INC-102',
    serviceReference: '2',
    reporterReference: 'Conductor #2',
    type: 'ROAD_BLOCK',
    severity: 'MEDIUM',
    status: 'IN_REVIEW',
    description: 'Congestión extrema y obras civiles no programadas en la avenida principal.',
    location: 'Av. Javier Prado Este, La Molina',
    evidenceReferences: ['EVID-88'],
    statusHistory: [
      { status: 'REPORTED', changedAt: new Date(Date.now() - 7200000).toISOString(), note: 'Tráfico denso reportado.' },
      { status: 'IN_REVIEW', changedAt: new Date(Date.now() - 5400000).toISOString(), note: 'Supervisor analizando ruta alterna.' }
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

function getStoredIncidents(): Incident[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockIncidents));
      return initialMockIncidents;
    }
    return JSON.parse(data);
  } catch {
    return initialMockIncidents;
  }
}

function saveStoredIncidents(incidents: Incident[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
}

// Simulamos retardos asíncronos para que actúe como un backend real
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const incidentsService = {
  async getIncidents(): Promise<Incident[]> {
    await delay(300);
    const list = getStoredIncidents();
    // Ordenar: Severidad (HIGH > MEDIUM > LOW) primero, luego por fecha de creación desc
    const severityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return [...list].sort((a, b) => {
      const diff = severityWeight[b.severity] - severityWeight[a.severity];
      if (diff !== 0) return diff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  async getIncidentById(id: string): Promise<Incident> {
    await delay(200);
    const list = getStoredIncidents();
    const item = list.find((inc) => inc.id === id);
    if (!item) {
      throw new Error(`Incidente con ID ${id} no encontrado.`);
    }
    return item;
  },

  async createIncident(payload: CreateIncidentPayload): Promise<Incident> {
    await delay(400);
    const list = getStoredIncidents();
    const nextId = `INC-${100 + list.length + 1}`;
    
    const newIncident: Incident = {
      id: nextId,
      ...payload,
      status: 'REPORTED',
      evidenceReferences: [],
      statusHistory: [
        { status: 'REPORTED', changedAt: new Date().toISOString(), note: 'Incidente reportado inicialmente.' }
      ],
      createdAt: new Date().toISOString(),
    };

    list.push(newIncident);
    saveStoredIncidents(list);
    return newIncident;
  },

  async updateStatus(id: string, status: IncidentStatus, note?: string): Promise<Incident> {
    await delay(300);
    const list = getStoredIncidents();
    const index = list.findIndex((inc) => inc.id === id);
    if (index === -1) {
      throw new Error(`Incidente no encontrado.`);
    }

    const current = list[index];
    
    // Reglas de negocio: transiciones REPORTED -> IN_REVIEW
    if (status === 'IN_REVIEW' && current.status !== 'REPORTED') {
      throw new Error('Solo se puede pasar a revisión incidentes en estado Reportado.');
    }

    const updated: Incident = {
      ...current,
      status,
      statusHistory: [
        ...current.statusHistory,
        { status, changedAt: new Date().toISOString(), note: note || `Estado cambiado a ${status}` }
      ],
    };

    list[index] = updated;
    saveStoredIncidents(list);
    return updated;
  },

  async resolveIncident(id: string, payload: ResolveIncidentPayload): Promise<Incident> {
    await delay(400);
    const list = getStoredIncidents();
    const index = list.findIndex((inc) => inc.id === id);
    if (index === -1) {
      throw new Error(`Incidente no encontrado.`);
    }

    const current = list[index];

    // Validar transición: Debe estar en IN_REVIEW primero
    if (current.status !== 'IN_REVIEW') {
      throw new Error('El incidente debe estar en revisión antes de poder resolverse.');
    }

    const updated: Incident = {
      ...current,
      status: 'RESOLVED',
      resolution: {
        ...payload,
        closedAt: new Date().toISOString(),
      },
      statusHistory: [
        ...current.statusHistory,
        { status: 'RESOLVED', changedAt: new Date().toISOString(), note: `Incidente resuelto: ${payload.summary}` }
      ],
    };

    list[index] = updated;
    saveStoredIncidents(list);
    return updated;
  },

  async associateEvidence(id: string, evidenceId: string): Promise<Incident> {
    await delay(200);
    const list = getStoredIncidents();
    const index = list.findIndex((inc) => inc.id === id);
    if (index === -1) {
      throw new Error(`Incidente no encontrado.`);
    }

    const current = list[index];
    if (current.evidenceReferences.includes(evidenceId)) {
      return current;
    }

    const updated: Incident = {
      ...current,
      evidenceReferences: [...current.evidenceReferences, evidenceId],
      statusHistory: [
        ...current.statusHistory,
        { status: current.status, changedAt: new Date().toISOString(), note: `Se vinculó la evidencia #${evidenceId}` }
      ],
    };

    list[index] = updated;
    saveStoredIncidents(list);
    return updated;
  },
};
export const incidentsApi = incidentsService; // export alias
