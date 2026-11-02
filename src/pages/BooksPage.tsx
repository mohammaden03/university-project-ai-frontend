/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Search, ExternalLink, ScrollText } from 'lucide-react';
import { bookService } from '../services/book.service';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { toPersianDigits } from '../utils/persian';
import { useAuthStore } from '../stores/authStore';

export const BooksPage: React.FC = () => {
  const { useMockApi } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: books, isLoading, error, refetch } = useQuery({
    queryKey: ['books', searchTerm, useMockApi],
    queryFn: () => bookService.getBooks({ search: searchTerm }),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              فهرست کتاب‌ها و دانشنامه‌های تاریخی
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            جست‌وجو و کاوش در عناوین گرانسنگ علوم، طب، ادبیات و حکمت اسلامی
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جست‌وجوی کتاب یا نویسنده..."
            className="w-full pl-3 pr-10 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 outline-none focus:border-teal-500 transition-colors"
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner label="در حال دریافت فهرست کتاب‌ها..." />
      ) : error ? (
        <ErrorMessage message="خطا در دریافت اطلاعات کتاب‌ها" onRetry={() => refetch()} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books?.map((book) => (
            <div
              key={book.id}
              className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/70 p-5 shadow-2xs hover:shadow-md hover:border-teal-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-900/60 rounded px-2 py-0.5">
                    {book.subject}
                  </span>
                  <span>{book.era}</span>
                </div>

                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
                  {book.title}
                </h3>
                <div className="text-xs text-stone-600 dark:text-stone-300 mb-3">
                  پدیدآور: <span className="font-semibold">{book.author}</span>
                </div>

                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-3 mb-4">
                  {book.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-500">
                  {toPersianDigits(book.manuscript_count)} نسخه خطی موجود
                </span>
                <Link
                  to={`/books/${book.id}`}
                  className="text-teal-700 dark:text-teal-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>مشاهده جزئیات</span>
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
