/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, BookOpen, ScrollText } from 'lucide-react';
import { SearchResultItem } from '../../types';
import { getSearchMethodLabel, getScriptStyleLabel, toPersianDigits } from '../../utils/persian';

interface SearchResultCardProps {
  result: SearchResultItem;
  className?: string;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ result, className = '' }) => {
  return (
    <div
      className={`rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/70 p-4 sm:p-5 shadow-2xs hover:shadow-sm transition-all ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 rounded px-2 py-0.5">
              {getSearchMethodLabel(result.match_type)}
            </span>
            {result.script_style && (
              <span className="text-[11px] text-stone-500">
                خط {getScriptStyleLabel(result.script_style)}
              </span>
            )}
            {result.language && (
              <span className="text-[11px] text-stone-400">· زبان {result.language}</span>
            )}
          </div>
          <h4 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
            {result.manuscript_title}
          </h4>
          <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            کتاب: <span className="font-semibold text-stone-700 dark:text-stone-300">{result.book_title}</span> · اثر{' '}
            <span className="font-medium text-stone-700 dark:text-stone-300">{result.author_name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {result.relevance_score !== undefined && (
            <div className="text-right text-[11px] text-stone-400">
              <span>میزان تطابق: </span>
              <span className="font-bold text-stone-800 dark:text-stone-200 tabular-nums">
                {toPersianDigits((result.relevance_score * 100).toFixed(0))}٪
              </span>
            </div>
          )}
          <Link
            to={`/manuscripts/${result.manuscript_id}`}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="مشاهده نسخه خطی"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Excerpt Box */}
      <div className="rounded-xl bg-amber-50/20 dark:bg-stone-950/40 border border-stone-200/60 dark:border-stone-800/80 p-3.5 text-sm font-manuscript text-stone-800 dark:text-stone-200 leading-relaxed">
        {result.excerpt}
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <span>شماره برگ / صفحه: {toPersianDigits(result.page_number)}</span>
        <Link
          to={`/manuscripts/${result.manuscript_id}`}
          className="text-teal-700 dark:text-teal-400 hover:underline font-medium text-xs flex items-center gap-1"
        >
          <span>مشاهده برگ در مخزن نسخ</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
