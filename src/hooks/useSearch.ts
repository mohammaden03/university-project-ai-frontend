/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { searchService } from '../services/search.service';
import { SearchFilters, SearchResponseData } from '../types';
import { useAuthStore } from '../stores/authStore';

export function useSearch(currentFilters?: SearchFilters) {
  const { useMockApi } = useAuthStore();

  const searchMutation = useMutation({
    mutationFn: (filters: SearchFilters): Promise<SearchResponseData> =>
      searchService.search(filters),
  });

  const suggestionsQuery = useQuery({
    queryKey: ['suggestions', currentFilters?.book_title, useMockApi],
    queryFn: () => searchService.getSuggestions(currentFilters?.book_title || ''),
    staleTime: 1000 * 60,
  });

  return {
    search: searchMutation.mutateAsync,
    isSearching: searchMutation.isPending,
    searchData: searchMutation.data,
    suggestions: suggestionsQuery.data || [],
  };
}
