import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../services';
import { ticketsQueryKey } from '../constants';
import type {
  CreateTicketPayload,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  UpdateTicketPayload,
} from '../types';

export function useTickets() {
  return useQuery({
    queryKey: [...ticketsQueryKey] as const,
    queryFn: ticketService.getAll,
  });
}

export function useTicketById(id: string | undefined) {
  return useQuery({
    queryKey: [...ticketsQueryKey, id] as const,
    queryFn: () => {
      if (!id) throw new Error('ID requerido');
      return ticketService.getById(id);
    },
    enabled: Boolean(id),
  });
}

export function useTicketsByUser(userId: string | undefined) {
  return useQuery({
    queryKey: [...ticketsQueryKey, 'user', userId] as const,
    queryFn: () => {
      if (!userId) throw new Error('userId requerido');
      return ticketService.getByUser(userId);
    },
    enabled: Boolean(userId),
  });
}

export function useTicketsByStatus(status: TicketStatus | null) {
  return useQuery({
    queryKey: [...ticketsQueryKey, 'status', status] as const,
    queryFn: () => {
      if (!status) throw new Error('status requerido');
      return ticketService.getByStatus(status);
    },
    enabled: Boolean(status),
  });
}

export function useTicketsByPriority(priority: TicketPriority | null) {
  return useQuery({
    queryKey: [...ticketsQueryKey, 'priority', priority] as const,
    queryFn: () => {
      if (!priority) throw new Error('priority requerido');
      return ticketService.getByPriority(priority);
    },
    enabled: Boolean(priority),
  });
}

export function useTicketsByCategory(category: TicketCategory | null) {
  return useQuery({
    queryKey: [...ticketsQueryKey, 'category', category] as const,
    queryFn: () => {
      if (!category) throw new Error('category requerido');
      return ticketService.getByCategory(category);
    },
    enabled: Boolean(category),
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTicketPayload) => ticketService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...ticketsQueryKey] });
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTicketPayload }) =>
      ticketService.update(id, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: [...ticketsQueryKey] });
      void queryClient.invalidateQueries({ queryKey: [...ticketsQueryKey, variables.id] });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ticketService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...ticketsQueryKey] });
    },
  });
}