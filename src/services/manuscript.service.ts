/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from './api';
import { mockService } from './mockService';
import { useAuthStore } from '../stores/authStore';
import { Manuscript } from '../types';

export const manuscriptService = {
  async getManuscripts(params?: { search?: string; page?: number; page_size?: number }): Promise<{
    items: Manuscript[];
    total: number;
    page: number;
    total_pages: number;
  }> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.getManuscripts(params);
    }
    const res = await apiClient.get('/manuscripts', { params });
    return res.data;
  },

  async getManuscript(id: string): Promise<Manuscript> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.getManuscript(id);
    }
    const res = await apiClient.get(`/manuscripts/${id}`);
    return res.data;
  },
};
