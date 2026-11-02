/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ScrollText, Filter, Plus } from 'lucide-react';
import { manuscriptService } from '../services/manuscript.service';
import { ManuscriptCard } from '../components/manuscripts/ManuscriptCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { toPersianDigits } from '../utils/persian';
import { useAuthStore } from '../stores/authStore';

export const ManuscriptsPage: React.FC = () => {
  const { useMockApi } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['manuscripts', searchTerm, page, useMockApi],
    queryFn: () => manuscriptService.getManuscripts({ search: searchTerm, page, page_size: 6 }),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <ScrollText className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              گنجینه و مخزن نسخه‌های خطی
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            فهرست دست‌نویس‌های کهن، اسناد تاریخی و نسخ مذهب جهان اسلام
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="جست‌وجو بر اساس عنوان، نویسنده یا موزه..."
            className="w-full pl-3 pr-10 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Content State */}
      {isLoading ? (
        <LoadingSpinner label="در حال دریافت فهرست نسخه‌های خطی از پایگاه داده..." />
      ) : error ? (
        <ErrorMessage
          message="خطا در ارتباط با سرور یا دریافت فهرست نسخه‌ها."
          onRetry={() => refetch()}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          icon={<ScrollText className="w-6 h-6" />}
          title="نسخه خطی با این مشخصات یافت نشد"
          description="لطفاً عبارت دیگری را جست‌وجو فرمایید."
          actionLabel="نمایش همه نسخه‌ها"
          onAction={() => setSearchTerm('')}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((ms) => (
              <ManuscriptCard key={ms.id} manuscript={ms} />
            ))}
          </div>

          {/* Pagination */}
          {data.total_pages > 1 && (
            <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                صفحه قبلی
              </Button>
              <span className="text-xs text-stone-500">
                صفحه {toPersianDigits(page)} از {toPersianDigits(data.total_pages)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                disabled={page >= data.total_pages}
              >
                صفحه بعدی
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
