/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from './api';
import { mockService } from './mockService';
import { useAuthStore } from '../stores/authStore';
import { ChatMessage, Attachment } from '../types';

export const chatService = {
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.getMessages(conversationId);
    }
    const res = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
    return res.data;
  },

  async sendMessage(
    conversationId: string,
    content: string,
    attachments?: Attachment[]
  ): Promise<ChatMessage> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.sendMessage(conversationId, content, attachments);
    }
    const res = await apiClient.post(`/chat/conversations/${conversationId}/messages`, {
      content,
      attachments,
    });
    return res.data;
  },

  async streamMessage(
    conversationId: string,
    content: string,
    onChunk: (chunk: string) => void,
    onDone: (message: ChatMessage) => void,
    onError: (err: any) => void
  ) {
    if (useAuthStore.getState().useMockApi) {
      // Simulate smooth chunk streaming
      const userMsg = await mockService.sendMessage(conversationId, content);
      let streamedResponse = '';
      const fullText =
        'پاسخ تحلیلی دستیار هوشمند با بررسی مراجع و متون نسخ خطی...';
      const words = fullText.split(' ');

      let i = 0;
      const interval = setInterval(() => {
        if (i < words.length) {
          const chunk = (i === 0 ? '' : ' ') + words[i];
          streamedResponse += chunk;
          onChunk(chunk);
          i++;
        } else {
          clearInterval(interval);
          onDone({
            id: 'stream_' + Date.now(),
            conversation_id: conversationId,
            sender: 'assistant',
            content: streamedResponse,
            timestamp: new Date().toISOString(),
          });
        }
      }, 60);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/chat/conversations/${conversationId}/messages/stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('manuscript_ai_token') || ''}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error('خطا در دریافت پاسخ استریم از سرور');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulated = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          accumulated += text;
          onChunk(text);
        }
      }

      onDone({
        id: 'stream_' + Date.now(),
        conversation_id: conversationId,
        sender: 'assistant',
        content: accumulated,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      onError(err);
    }
  },
};
