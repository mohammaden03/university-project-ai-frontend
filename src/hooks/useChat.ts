/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chat.service';
import { ChatMessage, Attachment, OCRResultData, SearchResponseData } from '../types';
import { useAuthStore } from '../stores/authStore';
import { generateId } from '../utils/persian';

export function useChat(conversationId?: string) {
  const queryClient = useQueryClient();
  const { useMockApi } = useAuthStore();
  const [streamingText, setStreamingText] = useState<string | null>(null);

  const messagesQuery = useQuery({
    queryKey: ['messages', conversationId, useMockApi],
    queryFn: () => (conversationId ? chatService.getMessages(conversationId) : Promise.resolve([])),
    enabled: !!conversationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({
      content,
      attachments,
    }: {
      content: string;
      attachments?: Attachment[];
    }) => {
      if (!conversationId) throw new Error('شناسه گفتگو موجود نیست.');
      return chatService.sendMessage(conversationId, content, attachments);
    },
    onSuccess: (newMsg) => {
      queryClient.setQueryData<ChatMessage[]>(['messages', conversationId, useMockApi], (old = []) => [
        ...old,
        newMsg,
      ]);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const appendLocalMessage = (message: Partial<ChatMessage>) => {
    if (!conversationId) return;
    const fullMessage: ChatMessage = {
      id: message.id || generateId('msg'),
      conversation_id: conversationId,
      sender: message.sender || 'assistant',
      content: message.content || '',
      timestamp: new Date().toISOString(),
      type: message.type || 'text',
      ocr_data: message.ocr_data,
      search_data: message.search_data,
      sources: message.sources,
      attachments: message.attachments,
      error: message.error,
    };

    queryClient.setQueryData<ChatMessage[]>(['messages', conversationId, useMockApi], (old = []) => [
      ...old,
      fullMessage,
    ]);
  };

  const updateMessageOCR = (messageId: string, updatedOCR: OCRResultData) => {
    queryClient.setQueryData<ChatMessage[]>(['messages', conversationId, useMockApi], (old = []) =>
      old.map((msg) =>
        msg.id === messageId || msg.ocr_data?.transcription_id === updatedOCR.transcription_id
          ? { ...msg, ocr_data: updatedOCR }
          : msg
      )
    );
  };

  return {
    messages: messagesQuery.data || [],
    isLoading: messagesQuery.isLoading,
    isSending: sendMessageMutation.isPending,
    sendMessage: sendMessageMutation.mutateAsync,
    appendLocalMessage,
    updateMessageOCR,
    streamingText,
    setStreamingText,
  };
}
