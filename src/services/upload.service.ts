/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiClient } from './api';
import { mockService } from './mockService';
import { useAuthStore } from '../stores/authStore';
import { Attachment } from '../types';

export const uploadService = {
  async uploadFile(file: File, onProgress?: (percent: number) => void): Promise<Attachment> {
    if (useAuthStore.getState().useMockApi) {
      if (onProgress) {
        onProgress(30);
        setTimeout(() => onProgress(75), 250);
        setTimeout(() => onProgress(100), 500);
      }
      return mockService.uploadFile(file);
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await apiClient.post<any>('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    const data = res.data;
    const filePath = data.file_path || data.url || '';
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

    return {
      id: data.id || 'att_' + Date.now(),
      url: filePath.startsWith('http') ? filePath : `${baseUrl}/storage/${filePath}`,
      file_path: filePath,
      preview_url: URL.createObjectURL(file),
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
    };
  },
};
