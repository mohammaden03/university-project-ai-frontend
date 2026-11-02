/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen, ScrollText, Users, ExternalLink } from 'lucide-react';
import { bookService } from '../services/book.service';
import { manuscriptService } from '../services/manuscript.service';
import { ManuscriptCard } from '../components/manuscripts/ManuscriptCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { toPersianDigits } from '../utils/persian';
import { useAuthStore } from '../stores/authStore';

export const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { useMockApi } = useAuthStore();

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', id, useMockApi],
    queryFn: () => bookService.getBook(id!),
    enabled: !!id,
  });

  const { data: manuscriptsData } = useQuery({
    queryKey: ['bookManuscripts', id, useMockApi],
    queryFn: () => manuscriptService.getManuscripts({ search: book?.title }),
    enabled: !!book?.title,
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner label="در حال دریافت مشخصات کتاب..." />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-xl mx-auto p-8">
        <ErrorMessage message="کتاب مورد نظر یافت نشد." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/books" className="hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1">
          <ArrowRight className="w-3.5 h-3.5" />
          <span>فهرست کتاب‌ها</span>
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-stone-800 dark:text-stone-200">{book.title}</span>
      </div>

      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200 dark:border-teal-900/60">
            {book.subject}
          </span>
          <span className="text-xs text-stone-500">{book.era}</span>
        </div>

        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          {book.title}
        </h1>
        <p className="text-sm font-medium text-stone-600 dark:text-stone-300 mb-4">
          عنوان اصلی یا ثبت‌شده: {book.original_title} · پدیدآور: {book.author}
        </p>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-4xl">
          {book.description}
        </p>
      </div>

      {/* Related Manuscripts Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-amber-600" />
          <span>نسخه‌های خطی شناسایی‌شده از این اثر</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {manuscriptsData?.items?.map((ms) => (
            <ManuscriptCard key={ms.id} manuscript={ms} />
          ))}
        </div>
      </div>
    </div>
  );
};
