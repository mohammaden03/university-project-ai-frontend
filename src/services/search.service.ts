/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from './api';
import { mockService } from './mockService';
import { useAuthStore } from '../stores/authStore';
import { SearchFilters, SearchResponseData } from '../types';

export const searchService = {
  async search(filters: SearchFilters): Promise<SearchResponseData> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.search(filters);
    }
    const res = await apiClient.post('/search', filters);
    return res.data;
  },

  async getSuggestions(prefix: string): Promise<string[]> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.getSearchSuggestions(prefix);
    }
    const res = await apiClient.get('/search/suggestions', {
      params: { prefix },
    });
    return res.data;
  },
};
