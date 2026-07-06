export type TicketCategory =
  | 'LOGIN'
  | 'GPS'
  | 'CAMERA'
  | 'SYNCHRONIZATION'
  | 'APPLICATION_ERROR'
  | 'OTHER';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type Ticket = {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  userId: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTicketPayload = {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
};

export type UpdateTicketPayload = {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: string | null;
};

export type SupportUser = {
  id: string;
  name: string;
  email: string;
};