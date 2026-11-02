/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { conversationService } from '../services/conversation.service';
import { ConversationMode } from '../types';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export function useConversations(currentId?: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { useMockApi } = useAuthStore();

  const conversationsQuery = useQuery({
    queryKey: ['conversations', useMockApi],
    queryFn: () => conversationService.getConversations(),
  });

  const activeConversationQuery = useQuery({
    queryKey: ['conversation', currentId, useMockApi],
    queryFn: () => conversationService.getConversation(currentId!),
    enabled: !!currentId,
  });

  const createConversationMutation = useMutation({
    mutationFn: ({ mode, title }: { mode: ConversationMode; title?: string }) =>
      conversationService.createConversation(mode, title),
    onSuccess: (newConv) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      navigate(`/chat/${newConv.id}`);
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: (id: string) => conversationService.deleteConversation(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      if (currentId === deletedId) {
        navigate('/chat');
      }
    },
  });

  return {
    conversations: conversationsQuery.data || [],
    isLoading: conversationsQuery.isLoading,
    activeConversation: activeConversationQuery.data,
    isActiveLoading: activeConversationQuery.isLoading,
    createConversation: (mode: ConversationMode, title?: string) =>
      createConversationMutation.mutateAsync({ mode, title }),
    isCreating: createConversationMutation.isPending,
    deleteConversation: (id: string) => deleteConversationMutation.mutateAsync(id),
    isDeleting: deleteConversationMutation.isPending,
    refetch: conversationsQuery.refetch,
  };
}
