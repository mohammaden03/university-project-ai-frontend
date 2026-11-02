/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from './api';
import { mockService } from './mockService';
import { useAuthStore } from '../stores/authStore';
import { TranscriptionRecord } from '../types';

export const transcriptionService = {
  async getTranscription(id: string): Promise<TranscriptionRecord> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.getTranscription(id);
    }
    const res = await apiClient.get(`/transcriptions/${id}`);
    return res.data;
  },

  async updateTranscription(id: string, text: string): Promise<TranscriptionRecord> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.updateTranscription(id, text);
    }
    const res = await apiClient.put(`/transcriptions/${id}`, { text });
    return res.data;
  },

  async verifyTranscription(id: string): Promise<TranscriptionRecord> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.verifyTranscription(id);
    }
    const res = await apiClient.post(`/transcriptions/${id}/verify`);
    return res.data;
  },
};
