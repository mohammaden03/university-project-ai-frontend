/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ScanText, Search, Sparkles, ArrowLeft, BookOpen, ScrollText } from 'lucide-react';
import { ConversationMode } from '../../types';

interface ChatWelcomeProps {
  onSelectMode: (mode: ConversationMode, initialQuery?: string) => void;
  isCreating?: boolean;
}

export const ChatWelcome: React.FC<ChatWelcomeProps> = ({ onSelectMode, isCreating = false }) => {
  const exampleQueries = [
    {
      text: 'در کدام نسخه‌ها درباره دانش پزشکی در تمدن اسلامی صحبت شده است؟',
      mode: 'research' as ConversationMode,
    },
    {
      text: 'تعریف ارکان و مزاج در نسخه کهن کتاب اول قانون ابن سینا',
      mode: 'research' as ConversationMode,
    },
    {
      text: 'استخراج و بازشناسی متن برگ ۱۴ قانون در طب با خط نسخ کهن',
      mode: 'ocr' as ConversationMode,
    },
    {
      text: 'بررسی نگاره‌ها و دیباچه شاهنامه فردوسی نسخه بایسنقری',
      mode: 'research' as ConversationMode,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 lg:py-12 flex flex-col items-center text-center">
      {/* Decorative Insignia */}
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-600/20 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-6 shadow-xs">
        <ScrollText className="w-7 h-7" />
      </div>

      {/* Main Headings */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mb-3 text-balance">
        در پژوهش نسخه‌های خطی، چطور می‌توانم کمکتان کنم؟
      </h1>
      <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl mb-10 leading-relaxed text-balance">
        تصاویر نسخه‌های خطی را به متن تبدیل کنید یا در میان کتاب‌ها، نویسندگان و متون تاریخی جست‌وجوی هوشمند انجام دهید.
      </p>

      {/* Two Primary Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10 text-right">
        {/* Card 1: Manuscript OCR */}
        <button
          onClick={() => onSelectMode('ocr')}
          disabled={isCreating}
          className="group relative p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 hover:border-amber-500/40 dark:hover:border-amber-500/40 hover:shadow-md transition-all text-right flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <ScanText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
              بازشناسی نسخه خطی
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              تصویر نسخه خطی خود را بارگذاری کنید و متن آن را با کمک هوش مصنوعی استخراج و ویرایش کنید.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400 pt-3 border-t border-stone-100 dark:border-stone-800/80">
            <span>شروع بازشناسی</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 2: Advanced Research */}
        <button
          onClick={() => onSelectMode('research')}
          disabled={isCreating}
          className="group relative p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-md transition-all text-right flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
              جست‌وجوی پیشرفته
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              در میان نسخه‌های خطی بر اساس کتاب، نویسنده، صفحه، عبارت یا مفهوم موردنظر جست‌وجو کنید.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs font-semibold text-teal-700 dark:text-teal-400 pt-3 border-t border-stone-100 dark:border-stone-800/80">
            <span>شروع جست‌وجو</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Suggested Questions Section */}
      <div className="w-full text-right">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-stone-500 dark:text-stone-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>پرسش‌ها و نمونه‌های پیشنهادی برای آغاز:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {exampleQueries.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelectMode(item.mode, item.text)}
              disabled={isCreating}
              className="p-3 text-right rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/40 hover:bg-white dark:hover:bg-stone-800/80 hover:border-stone-300 dark:hover:border-stone-700 text-xs text-stone-700 dark:text-stone-300 transition-all flex items-start gap-2.5"
            >
              <span className="w-5 h-5 rounded-md bg-stone-200/80 dark:bg-stone-800 flex items-center justify-center shrink-0 mt-0.5 text-stone-500">
                {item.mode === 'ocr' ? (
                  <ScanText className="w-3 h-3" />
                ) : (
                  <Search className="w-3 h-3" />
                )}
              </span>
              <span className="leading-relaxed flex-1">{item.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
