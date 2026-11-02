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
    const res = await apiClient.put<any>(`/transcriptions/${id}`, {
      corrected_text: text,
      text: text,
    });
    const d = res.data;
    return {
      id: String(d.id),
      manuscript_id: String(d.manuscript_page_id || ''),
      page_number: d.page_number || 1,
      image_url: d.image_url || '',
      original_text: d.original_recognized_text || d.original_text || '',
      current_text: d.corrected_text || d.original_recognized_text || d.current_text || text,
      is_verified: d.verification_status === 'VERIFIED' || !!d.is_verified,
      updated_at: d.updated_at || new Date().toISOString(),
    };
  },

  async verifyTranscription(id: string): Promise<TranscriptionRecord> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.verifyTranscription(id);
    }
    const res = await apiClient.post<any>(`/transcriptions/${id}/verify`, {
      status: 'VERIFIED',
    });
    const d = res.data;
    return {
      id: String(d.id),
      manuscript_id: String(d.manuscript_page_id || ''),
      page_number: d.page_number || 1,
      image_url: d.image_url || '',
      original_text: d.original_recognized_text || d.original_text || '',
      current_text: d.corrected_text || d.original_recognized_text || d.current_text || '',
      is_verified: true,
      updated_at: d.updated_at || new Date().toISOString(),
    };
  },
};
