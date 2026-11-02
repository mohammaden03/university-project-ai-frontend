/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from './api';
import { mockService } from './mockService';
import { useAuthStore } from '../stores/authStore';
import { User } from '../types';

export const authService = {
  async login(email: string, password?: string): Promise<{ user: User; token: string }> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.login(email);
    }
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },

  async register(name: string, email: string, password?: string): Promise<{ user: User; token: string }> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.register(name, email);
    }
    const res = await apiClient.post('/auth/register', { name, email, password });
    return res.data;
  },

  async getCurrentUser(): Promise<User> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.getCurrentUser();
    }
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
};
