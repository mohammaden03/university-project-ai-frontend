/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bookmark, Sparkles } from 'lucide-react';
import { SourceCitation } from '../../types';
import { SourceCard } from './SourceCard';
import { toPersianDigits } from '../../utils/persian';

interface CitationListProps {
  sources?: SourceCitation[];
  className?: string;
}

export const CitationList: React.FC<CitationListProps> = ({ sources, className = '' }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className={`mt-4 pt-3 border-t border-stone-200/80 dark:border-stone-800/80 ${className}`}>
      <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-stone-600 dark:text-stone-300">
        <Bookmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        <span>مستندات و ارجاعات مستقیم از نسخه‌های کهن ({toPersianDigits(sources.length)} منبع):</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sources.map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>
    </div>
  );
};
