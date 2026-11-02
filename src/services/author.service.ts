/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from './api';
import { mockService } from './mockService';
import { useAuthStore } from '../stores/authStore';
import { Author } from '../types';

export const authorService = {
  async getAuthors(params?: { search?: string }): Promise<Author[]> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.getAuthors(params);
    }
    const res = await apiClient.get('/authors', { params });
    return res.data;
  },

  async getAuthor(id: string): Promise<Author> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.getAuthor(id);
    }
    const res = await apiClient.get(`/authors/${id}`);
    return res.data;
  },
};
