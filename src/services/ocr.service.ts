/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from './api';
import { mockService } from './mockService';
import { useAuthStore } from '../stores/authStore';
import { OCRJob } from '../types';

export interface RecognizeOptions {
  image_url: string;
  script_style?: string;
  language?: string;
  manuscript_id?: string;
  page_number?: number;
}

export const ocrService = {
  async recognize(options: RecognizeOptions): Promise<OCRJob> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.createOCRJob(options.image_url, options);
    }
    const res = await apiClient.post('/ocr/recognize', options);
    return res.data;
  },

  async getJob(jobId: string): Promise<OCRJob> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.getOCRJob(jobId);
    }
    const res = await apiClient.get(`/ocr/jobs/${jobId}`);
    return res.data;
  },

  async retryJob(jobId: string): Promise<OCRJob> {
    if (useAuthStore.getState().useMockApi) {
      return mockService.retryOCRJob(jobId);
    }
    const res = await apiClient.post(`/ocr/jobs/${jobId}/retry`);
    return res.data;
  },
};
