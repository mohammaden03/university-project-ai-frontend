/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { OCRStatus } from '../../types';
import { getOCRStatusLabel, toPersianDigits } from '../../utils/persian';

interface OCRProcessingStatusProps {
  status: OCRStatus;
  progress?: number;
  errorMessage?: string;
  className?: string;
}

export const OCRProcessingStatus: React.FC<OCRProcessingStatusProps> = ({
  status,
  progress,
  errorMessage,
  className = '',
}) => {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40',
      description: 'تصویر در صف پردازش مدل هوشمند بازشناسی خطوط کهن قرار دارد...',
    },
    processing: {
      icon: Loader2,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40',
      description: 'در حال قطعه‌بندی سطرها، تشخیص خط و استخراج حروف به کمک شبکه‌های عصبی...',
    },
    completed: {
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40',
      description: 'بازشناسی متن نسخه خطی با موفقیت به پایان رسید.',
    },
    failed: {
      icon: AlertCircle,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40',
      description: errorMessage || 'پردازش تصویر با خطا مواجه شد. لطفاً دوباره تلاش کنید.',
    },
  };

  const current = statusConfig[status] || statusConfig.processing;
  const Icon = current.icon;
  const isSpinning = status === 'processing';

  return (
    <div
      role="status"
      className={`rounded-2xl border p-4.5 ${current.bgColor} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl bg-white dark:bg-stone-900 shrink-0 shadow-2xs ${current.color}`}>
          <Icon className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {getOCRStatusLabel(status)}
            </h4>
            {progress !== undefined && progress > 0 && (
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                {toPersianDigits(progress)}٪
              </span>
            )}
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {current.description}
          </p>

          {/* Indeterminate or determinate progress bar for processing state */}
          {status === 'processing' && (
            <div className="mt-3 w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
              {progress ? (
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              ) : (
                <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full w-1/3 animate-pulse" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
