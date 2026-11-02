/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to attach bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('manuscript_ai_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified Persian error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; detail?: string }>) => {
    let errorMessage = 'ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید.';

    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'نشست کاربری منقضی شده است. لطفاً دوباره وارد شوید.';
        localStorage.removeItem('manuscript_ai_token');
        localStorage.removeItem('manuscript_ai_user');
      } else if (error.response.status === 403) {
        errorMessage = 'دسترسی مجاز نمی‌باشد.';
      } else if (error.response.status === 404) {
        errorMessage = 'داده یا منبع مورد نظر یافت نشد.';
      } else if (error.response.status >= 500) {
        errorMessage = 'خطای داخلی سرور رخ داده است. لطفاً کمی بعد تلاش کنید.';
      } else if (error.response.data?.detail || error.response.data?.message) {
        errorMessage = error.response.data.detail || error.response.data.message || errorMessage;
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'زمان پاسخگویی سرور به پایان رسید.';
    }

    return Promise.reject(new Error(errorMessage));
  }
);
