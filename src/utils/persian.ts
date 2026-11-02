/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScriptStyle, SearchMethod, OCRStatus } from '../types';

/**
 * Converts English digits (0-9) to Persian digits (۰-۹)
 */
export function toPersianDigits(input: number | string | undefined | null): string {
  if (input === undefined || input === null) return '';
  const str = String(input);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}

/**
 * Formats a date string into readable Persian date/time
 */
export function formatPersianDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    // Use Intl DateTimeFormat with fa-IR locale
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Human-readable Persian file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '۰ بایت';
  const k = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${toPersianDigits(val)} ${sizes[i]}`;
}

/**
 * Persian labels for traditional calligraphy scripts
 */
export function getScriptStyleLabel(style?: string | ScriptStyle): string {
  const map: Record<string, string> = {
    nastaliq: 'نستعلیق',
    naskh: 'نسخ',
    shekasteh: 'شکسته نستعلیق',
    thuluth: 'ثلث',
    kufic: 'کوفی',
    reqa: 'رقاع',
    muhaqqaq: 'محقق',
    other: 'سایر خطوط',
  };
  return (style && map[style.toLowerCase()]) || style || 'نامشخص';
}

/**
 * Persian labels for search algorithms
 */
export function getSearchMethodLabel(method?: string | SearchMethod): string {
  const map: Record<string, string> = {
    exact: 'عبارت دقیق',
    fulltext: 'جست‌وجوی متنی',
    semantic: 'جست‌وجوی معنایی',
    hybrid: 'جست‌وجوی ترکیبی',
  };
  return (method && map[method.toLowerCase()]) || 'ترکیبی';
}

/**
 * Persian labels for OCR processing statuses
 */
export function getOCRStatusLabel(status: OCRStatus | string): string {
  switch (status) {
    case 'pending':
      return 'در انتظار پردازش';
    case 'processing':
      return 'در حال پردازش';
    case 'completed':
      return 'تکمیل شده';
    case 'failed':
      return 'خطا در پردازش';
    default:
      return status;
  }
}

/**
 * Truncate text cleanly with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

/**
 * Simple client-side ID generator
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}
