import { apiClient } from '@/services';

export type SignInResponse = {
  id: number;
  email: string;
  token: string;
  roles: string[];
};

export type SignUpResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  roles: string[];
};

export const authService = {
  signIn: (email: string, password: string) =>
    apiClient.post<SignInResponse>('/api/v1/authentication/sign-in', { email, password }),

  signUp: (data: { email: string; password: string; firstName: string; lastName: string; phone: string; roles: string[] }) =>
    apiClient.post<SignUpResponse>('/api/v1/authentication/sign-up', data),
};
