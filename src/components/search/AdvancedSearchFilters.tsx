/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Filter, X, RotateCcw, ChevronDown, Check } from 'lucide-react';
import { SearchFilters, SearchMethod, ScriptStyle } from '../../types';
import { Button } from '../common/Button';
import { getSearchMethodLabel, getScriptStyleLabel, toPersianDigits } from '../../utils/persian';
import { MOCK_AUTHORS, MOCK_BOOKS } from '../../services/mockData';

interface AdvancedSearchFiltersProps {
  filters: SearchFilters;
  onChange: (updated: Partial<SearchFilters>) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  filters,
  onChange,
  onReset,
  isOpen,
  onToggle,
}) => {
  const searchMethods: SearchMethod[] = ['hybrid', 'semantic', 'fulltext', 'exact'];
  const scriptStyles: ScriptStyle[] = ['nastaliq', 'naskh', 'shekasteh', 'thuluth', 'kufic'];
  const languages = [
    { id: 'فارسی', label: 'فارسی' },
    { id: 'عربی', label: 'عربی' },
    { id: 'ترکی عثمانی', label: 'ترکی عثمانی' },
  ];

  // Active filters count
  const activeCount = [
    filters.book_title,
    filters.author_name,
    filters.manuscript_title,
    filters.page_number,
    filters.language,
    filters.script_style,
    filters.search_method !== 'hybrid' ? filters.search_method : null,
  ].filter(Boolean).length;

  return (
    <div className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden transition-all">
      {/* Filter Toggle Bar */}
      <div className="px-4 py-3 flex items-center justify-between gap-3 bg-stone-50/60 dark:bg-stone-900/60">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
        >
          <Filter className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>فیلترهای پیشرفته پژوهش</span>
          {activeCount > 0 && (
            <span className="bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 rounded-full px-2 py-0.5 text-[10px] font-bold">
              {toPersianDigits(activeCount)} فیلتر فعال
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>پاک کردن همه</span>
          </button>
        )}
      </div>

      {/* Active Filter Chips (Removable) */}
      {activeCount > 0 && (
        <div className="px-4 py-2 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap gap-1.5 items-center bg-stone-50/30 dark:bg-stone-900/30">
          <span className="text-[11px] text-stone-400 ml-1">فیلترهای اعمال‌شده:</span>
          {filters.book_title && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-200/70 dark:bg-stone-800 text-[11px] text-stone-800 dark:text-stone-200">
              کتاب: {filters.book_title}
              <button
                onClick={() => onChange({ book_title: '' })}
                className="hover:text-rose-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.author_name && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-200/70 dark:bg-stone-800 text-[11px] text-stone-800 dark:text-stone-200">
              نویسنده: {filters.author_name}
              <button
                onClick={() => onChange({ author_name: '' })}
                className="hover:text-rose-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.script_style && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-200/70 dark:bg-stone-800 text-[11px] text-stone-800 dark:text-stone-200">
              خط: {getScriptStyleLabel(filters.script_style)}
              <button
                onClick={() => onChange({ script_style: '' })}
                className="hover:text-rose-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.language && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-200/70 dark:bg-stone-800 text-[11px] text-stone-800 dark:text-stone-200">
              زبان: {filters.language}
              <button
                onClick={() => onChange({ language: '' })}
                className="hover:text-rose-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Collapsible Filter Panel Content */}
      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Method Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-stone-700 dark:text-stone-300">روش جست‌وجو:</label>
            <div className="grid grid-cols-2 gap-1.5">
              {searchMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => onChange({ search_method: method })}
                  className={`px-2.5 py-2 rounded-lg border text-right transition-colors ${
                    filters.search_method === method
                      ? 'border-teal-600 bg-teal-50/80 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-semibold'
                      : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  {getSearchMethodLabel(method)}
                </button>
              ))}
            </div>
          </div>

          {/* Book Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-stone-700 dark:text-stone-300">عنوان کتاب:</label>
            <select
              value={filters.book_title || ''}
              onChange={(e) => onChange({ book_title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 outline-none"
            >
              <option value="">همه کتاب‌ها</option>
              {MOCK_BOOKS.map((b) => (
                <option key={b.id} value={b.title}>
                  {b.title} ({b.author})
                </option>
              ))}
            </select>
          </div>

          {/* Author Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-stone-700 dark:text-stone-300">نویسنده / پدیدآور:</label>
            <select
              value={filters.author_name || ''}
              onChange={(e) => onChange({ author_name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 outline-none"
            >
              <option value="">همه نویسندگان</option>
              {MOCK_AUTHORS.map((a) => (
                <option key={a.id} value={a.name.split(' ')[0]}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Script Style Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-stone-700 dark:text-stone-300">سبک خط نسخه:</label>
            <select
              value={filters.script_style || ''}
              onChange={(e) => onChange({ script_style: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 outline-none"
            >
              <option value="">همه خطوط</option>
              {scriptStyles.map((s) => (
                <option key={s} value={s}>
                  {getScriptStyleLabel(s)}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-stone-700 dark:text-stone-300">زبان متن:</label>
            <select
              value={filters.language || ''}
              onChange={(e) => onChange({ language: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 outline-none"
            >
              <option value="">همه زبان‌ها</option>
              {languages.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Page Number Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-stone-700 dark:text-stone-300">شماره صفحه / برگ:</label>
            <input
              type="number"
              placeholder="مثلاً ۱۴"
              value={filters.page_number || ''}
              onChange={(e) =>
                onChange({ page_number: e.target.value ? parseInt(e.target.value, 10) : undefined })
              }
              className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
