import { useAppSelector } from '@/hooks';

export function useAuth() {
  return useAppSelector((state) => state.auth);
}
