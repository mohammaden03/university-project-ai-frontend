/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from './api';
import { mockService } from './mockService';
import { useAuthStore } from '../stores/authStore';
import { ChatMessage, Attachment, SourceCitation } from '../types';
import { SSEStreamParser } from '../utils/sseParser';

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
    onError: (err: any) => void,
    onSource?: (source: SourceCitation) => void
  ) {
    if (useAuthStore.getState().useMockApi) {
      // Simulate smooth chunk streaming
      await mockService.sendMessage(conversationId, content);
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
      const sources: SourceCitation[] = [];

      const parser = new SSEStreamParser({
        onToken: (tok) => {
          accumulated += tok;
          onChunk(tok);
        },
        onSource: (src) => {
          sources.push(src);
          onSource?.(src);
        },
        onError: (errMsg) => {
          onError(new Error(errMsg));
        },
        onComplete: (full) => {
          if (full && !accumulated) {
            accumulated = full;
          }
        },
      });

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          parser.feed(text);
        }
        parser.flush();
      }

      onDone({
        id: 'stream_' + Date.now(),
        conversation_id: conversationId,
        sender: 'assistant',
        content: accumulated,
        sources: sources.length > 0 ? sources : undefined,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      onError(err);
    }
  },
};
