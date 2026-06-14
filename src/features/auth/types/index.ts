import type { UserRole } from '@/types';

export type AuthUser = {
  id: string;
  name: string;
  role: UserRole;
};
