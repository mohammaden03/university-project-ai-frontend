/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from './api';
import { mockService } from './mockService';
import { useAuthStore } from '../stores/authStore';
import { Conversation, ConversationMode } from '../types';

export const conversationService = {
  async getConversations(): Promise<Conversation[]> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.getConversations();
    }
    const res = await apiClient.get('/chat/conversations');
    return (res.data || []).map((c: any) => ({
      ...c,
      mode: (c.mode?.toLowerCase() as ConversationMode) || 'ocr',
    }));
  },

  async getConversation(id: string): Promise<Conversation> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.getConversation(id);
    }
    const res = await apiClient.get(`/chat/conversations/${id}`);
    return {
      ...res.data,
      mode: (res.data.mode?.toLowerCase() as ConversationMode) || 'ocr',
    };
  },

  async createConversation(mode: ConversationMode, title?: string): Promise<Conversation> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.createConversation(mode, title);
    }
    const backendMode = mode.toUpperCase();
    const res = await apiClient.post('/chat/conversations', { mode: backendMode, title });
    return {
      ...res.data,
      mode: (res.data.mode?.toLowerCase() as ConversationMode) || mode,
    };
  },

  async deleteConversation(id: string): Promise<void> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.deleteConversation(id);
    }
    await apiClient.delete(`/chat/conversations/${id}`);
  },
};
