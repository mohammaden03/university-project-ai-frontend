/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users, Search, ExternalLink, BookOpen, ScrollText } from 'lucide-react';
import { authorService } from '../services/author.service';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { toPersianDigits } from '../utils/persian';
import { useAuthStore } from '../stores/authStore';

export const AuthorsPage: React.FC = () => {
  const { useMockApi } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: authors, isLoading, error, refetch } = useQuery({
    queryKey: ['authors', searchTerm, useMockApi],
    queryFn: () => authorService.getAuthors({ search: searchTerm }),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              نویسندگان، دانشمندان و خوشنویسان کهن
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            شرح احوال، زیست‌نامه و آثار مکتوب مفاخر علمی و ادبی تمدن اسلامی
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جست‌وجوی نام پدیدآور..."
            className="w-full pl-3 pr-10 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner label="در حال دریافت فهرست نویسندگان..." />
      ) : error ? (
        <ErrorMessage message="خطا در دریافت اطلاعات نویسندگان" onRetry={() => refetch()} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors?.map((author) => (
            <div
              key={author.id}
              className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/70 p-5 shadow-2xs hover:shadow-md hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] text-stone-500 mb-1.5">{author.era}</div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
                  {author.name}
                </h3>
                <div className="text-xs text-amber-700 dark:text-amber-400 mb-3 font-medium">
                  تاریخ حیات: {author.birth_death}
                </div>

                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-3 mb-4">
                  {author.biography}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-stone-500">
                  <span>{toPersianDigits(author.books_count)} اثر</span>
                  <span>·</span>
                  <span>{toPersianDigits(author.manuscripts_count)} نسخه</span>
                </div>
                <Link
                  to={`/authors/${author.id}`}
                  className="text-amber-700 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>شرح آثار</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
