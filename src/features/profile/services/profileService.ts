import { fleetApi } from '@/services';
import type { UpdateProfilePayload, UserProfile } from '../types';

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await fleetApi.get<UserProfile>('/api/v1/users/me');
    return data;
  },
  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    const { data } = await fleetApi.put<UserProfile>('/api/v1/users/me', payload);
    return data;
  },
};