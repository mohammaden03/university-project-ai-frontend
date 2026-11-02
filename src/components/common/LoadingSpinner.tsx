/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'در حال بارگذاری...',
  size = 'md',
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center gap-3 p-6 text-stone-500 dark:text-stone-400 ${className}`}
    >
      <Loader2 className={`${iconSizes[size]} animate-spin text-slate-800 dark:text-stone-300`} />
      {label && <p className="text-xs font-medium">{label}</p>}
      <span className="sr-only">{label}</span>
    </div>
  );
};
