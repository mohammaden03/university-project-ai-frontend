/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mb-5 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
