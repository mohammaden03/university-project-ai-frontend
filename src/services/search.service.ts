/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from './api';
import { mockService } from './mockService';
import { useAuthStore } from '../stores/authStore';
import { SearchFilters, SearchResponseData, SearchResultItem, SourceCitation } from '../types';

export const searchService = {
  async search(filters: SearchFilters): Promise<SearchResponseData> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.search(filters);
    }

    let backendMode = 'hybrid';
    if (filters.search_method === 'semantic') {
      backendMode = 'semantic';
    } else if (filters.search_method === 'exact' || filters.search_method === 'fulltext') {
      backendMode = 'lexical';
    }

    const payload = {
      query: filters.book_title || filters.author_name || filters.manuscript_title || '',
      mode: backendMode,
      filters: {
        page_number: filters.page_number,
        script_style: filters.script_style,
        language: filters.language,
      },
      page: filters.page || 1,
      page_size: filters.page_size || 10,
    };

    const res = await apiClient.post<any>('/search', payload);
    const data = res.data;

    if (data.results && !data.items) {
      const items: SearchResultItem[] = data.results.map((r: any) => ({
        id: String(r.id),
        manuscript_id: String(r.manuscript?.id || r.manuscript_id || 'ms_1'),
        manuscript_title: r.manuscript?.title || '',
        book_title: r.book?.title || 'کتاب نامشخص',
        author_name: r.author?.name || 'نویسنده نامشخص',
        page_number: r.page_number || 1,
        excerpt: r.text || r.excerpt || '',
        match_type: filters.search_method,
        relevance_score: r.relevance_score,
        script_style: r.manuscript?.script_style || filters.script_style || 'naskh',
        language: r.language || 'persian',
      }));

      const sources: SourceCitation[] = data.results.map((r: any, idx: number) => ({
        id: 'src_' + (idx + 1),
        manuscript_id: String(r.manuscript?.id || r.manuscript_id || 'ms_1'),
        manuscript_title: r.manuscript?.title || '',
        book_title: r.book?.title || 'کتاب نامشخص',
        author_name: r.author?.name || 'نویسنده نامشخص',
        page_number: r.page_number || 1,
        excerpt: (r.text || r.excerpt || '').slice(0, 150) + '...',
        relevance_score: r.relevance_score,
      }));

      return {
        query: data.query || payload.query,
        total_count: data.total || data.total_count || items.length,
        page: data.page || 1,
        page_size: data.page_size || 10,
        total_pages: Math.ceil((data.total || items.length || 1) / (data.page_size || 10)),
        results: items,
        sources: sources,
      };
    }

    return data as SearchResponseData;
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
