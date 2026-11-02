/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink, Quote, Sparkles } from 'lucide-react';
import { SourceCitation } from '../../types';
import { toPersianDigits } from '../../utils/persian';

interface SourceCardProps {
  source: SourceCitation;
  className?: string;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source, className = '' }) => {
  return (
    <div
      className={`rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-4 shadow-2xs hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center shrink-0">
            <BookOpen className="w-3.5 h-3.5" />
          </span>
          <div className="truncate">
            <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
              {source.book_title}
            </h5>
            <p className="text-[11px] text-stone-500 truncate">{source.author_name}</p>
          </div>
        </div>

        <Link
          to={`/manuscripts/${source.manuscript_id}`}
          className="text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          title="مشاهده نسخه خطی کامل"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Direct Manuscript Quotation */}
      <div className="relative rounded-lg bg-stone-50 dark:bg-stone-950/40 border-r-2 border-amber-600/60 dark:border-amber-400/60 p-3 pr-3 text-xs font-manuscript text-stone-800 dark:text-stone-200 leading-relaxed">
        <Quote className="w-3 h-3 text-amber-600 dark:text-amber-400 opacity-60 mb-1" />
        <span className="block italic">{source.excerpt}</span>
      </div>

      {/* Metadata strip */}
      <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
        <span>صفحه {toPersianDigits(source.page_number)}</span>
        {source.relevance_score !== undefined && (
          <span className="tabular-nums">
            انطباق: {toPersianDigits((source.relevance_score * 100).toFixed(0))}٪
          </span>
        )}
      </div>
    </div>
  );
};
