/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Users, BookOpen, ScrollText } from 'lucide-react';
import { authorService } from '../services/author.service';
import { bookService } from '../services/book.service';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { toPersianDigits } from '../utils/persian';
import { useAuthStore } from '../stores/authStore';

export const AuthorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { useMockApi } = useAuthStore();

  const { data: author, isLoading, error } = useQuery({
    queryKey: ['author', id, useMockApi],
    queryFn: () => authorService.getAuthor(id!),
    enabled: !!id,
  });

  const { data: books } = useQuery({
    queryKey: ['authorBooks', id, useMockApi],
    queryFn: () => bookService.getBooks({ search: author?.name.split(' ')[0] }),
    enabled: !!author?.name,
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner label="در حال دریافت زندگی‌نامه نویسنده..." />
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="max-w-xl mx-auto p-8">
        <ErrorMessage message="اطلاعات نویسنده یافت نشد." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/authors" className="hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1">
          <ArrowRight className="w-3.5 h-3.5" />
          <span>فهرست نویسندگان</span>
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-stone-800 dark:text-stone-200">{author.name}</span>
      </div>

      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 mb-2 font-medium">
          <span>{author.era}</span>
          <span>·</span>
          <span>حیات: {author.birth_death}</span>
        </div>

        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
          {author.name}
        </h1>

        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-4xl">
          {author.biography}
        </p>
      </div>

      {/* Books and Works */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-600" />
          <span>آثار و کتاب‌های ثبت‌شده</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books?.map((book) => (
            <div
              key={book.id}
              className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/70 p-5"
            >
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1">
                {book.title}
              </h4>
              <p className="text-xs text-stone-500 mb-3">{book.subject}</p>
              <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 mb-4 leading-relaxed">
                {book.description}
              </p>
              <Link
                to={`/books/${book.id}`}
                className="text-xs text-teal-700 dark:text-teal-400 font-semibold hover:underline"
              >
                مشاهده نسخه‌های خطی این اثر ←
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
