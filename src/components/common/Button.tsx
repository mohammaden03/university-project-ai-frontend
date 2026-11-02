/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer select-none whitespace-nowrap shrink-0 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-500 rounded-lg';

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 min-h-[32px]',
      md: 'text-sm px-4 py-2 min-h-[40px]',
      lg: 'text-base px-5 py-2.5 min-h-[46px]',
    };

    const variantStyles = {
      primary:
        'bg-slate-900 text-stone-100 hover:bg-slate-800 dark:bg-stone-100 dark:text-slate-950 dark:hover:bg-stone-200 shadow-sm active:translate-y-px',
      secondary:
        'bg-stone-200 text-stone-900 hover:bg-stone-300 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700 active:translate-y-px',
      outline:
        'border border-stone-300 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800/80',
      ghost:
        'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800/60',
      danger:
        'bg-rose-700 text-white hover:bg-rose-800 dark:bg-rose-800 dark:hover:bg-rose-700 shadow-sm',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
        {children}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
