/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { SearchResponseData } from '../../types';
import { SearchResultCard } from './SearchResultCard';
import { Button } from '../common/Button';
import { toPersianDigits } from '../../utils/persian';

interface SearchResultsListProps {
  data: SearchResponseData;
  onPageChange?: (newPage: number) => void;
  isLoading?: boolean;
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({
  data,
  onPageChange,
  isLoading = false,
}) => {
  const { results, total_count, page, total_pages } = data;

  if (!results || results.length === 0) {
    return (
      <div className="text-center p-8 text-stone-500 text-sm">
        نتیجه‌ای برای جست‌وجوی شما پیدا نشد. لطفاً کلیدواژه‌ها یا فیلترها را تغییر دهید.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Result Count Strip */}
      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1">
        <span>
          یافت‌شده: <strong className="text-stone-900 dark:text-stone-100">{toPersianDigits(total_count)}</strong> مورد
        </span>
        <span>
          صفحه {toPersianDigits(page)} از {toPersianDigits(total_pages)}
        </span>
      </div>

      {/* Cards list */}
      <div className="space-y-3">
        {results.map((res) => (
          <SearchResultCard key={res.id} result={res} />
        ))}
      </div>

      {/* Pagination Bar */}
      {total_pages > 1 && onPageChange && (
        <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            صفحه قبلی
          </Button>

          <span className="text-xs text-stone-600 dark:text-stone-300">
            صفحه {toPersianDigits(page)} از {toPersianDigits(total_pages)}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= total_pages || isLoading}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            صفحه بعدی
          </Button>
        </div>
      )}
    </div>
  );
};
