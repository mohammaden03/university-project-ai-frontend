/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollText, BookOpen, Layers, ExternalLink } from 'lucide-react';
import { Manuscript } from '../../types';
import { getScriptStyleLabel, toPersianDigits } from '../../utils/persian';

interface ManuscriptCardProps {
  manuscript: Manuscript;
  className?: string;
}

export const ManuscriptCard: React.FC<ManuscriptCardProps> = ({
  manuscript,
  className = '',
}) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      className={`group rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/70 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Cover Thumbnail / Archival Placeholder */}
        <div className="relative h-48 bg-amber-50/60 dark:bg-stone-950 overflow-hidden flex items-center justify-center border-b border-stone-200 dark:border-stone-800">
          {manuscript.pages && manuscript.pages[0]?.image_url && !imageError ? (
            <img
              src={manuscript.pages[0].image_url}
              alt={manuscript.title}
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-amber-100/50 via-stone-100 to-amber-50 dark:from-stone-900 dark:via-stone-950 dark:to-stone-900">
              <div className="w-12 h-12 rounded-full border border-amber-600/30 bg-amber-500/10 flex items-center justify-center text-amber-700 dark:text-amber-400 mb-2 shadow-2xs">
                <ScrollText className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">{manuscript.title}</span>
              <span className="text-[10px] text-stone-400 mt-0.5">نسخه خطی اصیل موزه</span>
            </div>
          )}

          <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
            خط {getScriptStyleLabel(manuscript.script_style)}
          </div>

          <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-xs text-stone-200 text-[11px] px-2 py-0.5 rounded-md">
            {manuscript.language}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 sm:p-5">
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 line-clamp-2 mb-1.5 leading-snug">
            {manuscript.title}
          </h3>

          <div className="text-xs text-stone-600 dark:text-stone-300 mb-3 flex items-center gap-1.5">
            <span className="text-stone-400">پدیدآور:</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">{manuscript.author}</span>
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed mb-4">
            {manuscript.description || 'نسخه خطی اصیل ثبت‌شده در فهرست اسناد کهن اسلامی.'}
          </p>

          <div className="space-y-1.5 pt-3 border-t border-stone-100 dark:border-stone-800/80 text-[11px] text-stone-500">
            <div className="flex items-center justify-between">
              <span>محل نگهداری:</span>
              <span className="font-medium text-stone-700 dark:text-stone-300 truncate max-w-[170px]">
                {manuscript.collection}
              </span>
            </div>
            {manuscript.century && (
              <div className="flex items-center justify-between">
                <span>دوره و قدمت:</span>
                <span className="text-stone-700 dark:text-stone-300">{manuscript.century}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span>تعداد کل برگ‌ها:</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200 tabular-nums">
                {toPersianDigits(manuscript.total_pages)} صفحه
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action link */}
      <div className="p-4 pt-0">
        <Link
          to={`/manuscripts/${manuscript.id}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-slate-900 hover:text-white dark:hover:bg-stone-100 dark:hover:text-slate-900 transition-colors text-xs font-semibold"
        >
          <span>مشاهده و بررسی برگ‌ها</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
