import { useQuery } from '@tanstack/react-query';
import { userService } from '../services';

const usersQueryKey = ['support-users'] as const;

export function useUsers() {
  return useQuery({
    queryKey: [...usersQueryKey] as const,
    queryFn: userService.getUsers,
    staleTime: 5 * 60 * 1000,
  });
}