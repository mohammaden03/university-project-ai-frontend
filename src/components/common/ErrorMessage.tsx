/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium leading-relaxed">{message}</p>
          {onRetry && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                rightIcon={<RefreshCw className="w-3.5 h-3.5" />}
                className="border-rose-300 hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-900/40"
              >
                تلاش مجدد
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
