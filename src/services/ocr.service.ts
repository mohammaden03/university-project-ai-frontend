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
  file_path?: string;
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
    const res = await apiClient.post<any>('/ocr/recognize', {
      file_path: options.file_path || options.image_url,
      model_name: options.script_style || 'persian_naskh_v1',
      async_processing: false,
      enhance_contrast: true,
      deskew: true,
    });

    const data = res.data;
    if (data.result) {
      return data as OCRJob;
    }

    return {
      job_id: data.job_id || 'job_' + Date.now(),
      status: 'completed',
      progress: 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      result: {
        transcription_id: data.job_id || 'trans_' + Date.now(),
        image_url: options.image_url,
        original_text: data.text || '',
        current_text: data.text || '',
        is_edited: false,
        confidence: data.confidence ?? 0.94,
        script_style: (options.script_style as any) || 'naskh',
        language: (data.language as any) || 'persian',
        line_boxes:
          data.lines?.map((l: any, idx: number) => ({
            line_number: idx + 1,
            text: typeof l === 'string' ? l : l.text,
            confidence: l.confidence ?? 0.95,
            bounding_box: l.bounding_box || l.box,
          })) || [],
      },
    };
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
