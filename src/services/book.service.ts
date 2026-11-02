/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from './api';
import { mockService } from './mockService';
import { useAuthStore } from '../stores/authStore';
import { Book } from '../types';

export const bookService = {
  async getBooks(params?: { search?: string }): Promise<Book[]> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.getBooks(params);
    }
    const res = await apiClient.get('/books', { params });
    return res.data;
  },

  async getBook(id: string): Promise<Book> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.getBook(id);
    }
    const res = await apiClient.get(`/books/${id}`);
    return res.data;
  },
};
