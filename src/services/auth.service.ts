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
    const token = res.data.access_token || res.data.token;
    localStorage.setItem('manuscript_ai_token', token);
    const userRes = await apiClient.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user: User = {
      id: userRes.data.id,
      name: userRes.data.full_name || userRes.data.name || email.split('@')[0],
      email: userRes.data.email,
      role: (userRes.data.role?.toLowerCase() as any) || 'researcher',
      created_at: userRes.data.created_at,
    };
    return { user, token };
  },

  async register(name: string, email: string, password?: string): Promise<{ user: User; token: string }> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.register(name, email);
    }
    await apiClient.post('/auth/register', { full_name: name, email, password, role: 'USER' });
    return this.login(email, password);
  },

  async getCurrentUser(): Promise<User> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.getCurrentUser();
    }
    const res = await apiClient.get('/auth/me');
    return {
      id: res.data.id,
      name: res.data.full_name || res.data.name,
      email: res.data.email,
      role: (res.data.role?.toLowerCase() as any) || 'researcher',
      created_at: res.data.created_at,
    };
  },
};
