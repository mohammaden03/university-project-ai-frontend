/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const queryClient = useQueryClient();
  const { user, token, isAuthenticated, setAuth, logout, useMockApi, setUseMockApi } =
    useAuthStore();

  const userQuery = useQuery({
    queryKey: ['currentUser', token, useMockApi],
    queryFn: () => authService.getCurrentUser(),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password?: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password?: string }) =>
      authService.register(name, email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  return {
    user: user || userQuery.data || null,
    token,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending || userQuery.isLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    useMockApi,
    setUseMockApi,
  };
}
