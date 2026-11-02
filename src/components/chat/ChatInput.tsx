/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Image as ImageIcon,
  Filter,
  Sparkles,
  Paperclip,
  X,
  ScanText,
  FileSearch,
} from 'lucide-react';
import { ConversationMode, Attachment } from '../../types';

interface ChatInputProps {
  mode: ConversationMode;
  onSendMessage: (text: string, attachments?: Attachment[]) => void;
  onOpenUpload?: () => void;
  onToggleFilters?: () => void;
  isFilterOpen?: boolean;
  isDisabled?: boolean;
  activeFilterCount?: number;
  initialQuery?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  mode,
  onSendMessage,
  onOpenUpload,
  onToggleFilters,
  isFilterOpen = false,
  isDisabled = false,
  activeFilterCount = 0,
  initialQuery = '',
}) => {
  const [text, setText] = useState(initialQuery);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialQuery) {
      setText(initialQuery);
    }
  }, [initialQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!text.trim() || isDisabled) return;
    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto grow textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  const placeholderText =
    mode === 'ocr'
      ? 'برای استخراج متن، تصویر نسخه خطی را بارگذاری کنید یا پرسش خود را بنویسید...'
      : 'پرسش پژوهشی خود را درباره کتاب‌ها، نویسندگان یا موضوعات کهن مطرح نمایید...';

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 pb-4">
      <div className="relative rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm focus-within:border-stone-400 dark:focus-within:border-stone-600 transition-all p-2 sm:p-2.5">
        {/* Main Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          placeholder={placeholderText}
          rows={1}
          dir="rtl"
          aria-label="ورودی متن گفتگو"
          className="w-full resize-none border-0 bg-transparent px-3 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 outline-none leading-relaxed max-h-40 overflow-y-auto"
        />

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between pt-1 px-1 border-t border-stone-100 dark:border-stone-800/80">
          <div className="flex items-center gap-1.5">
            {/* Mode Indicator Tag */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${
                mode === 'ocr'
                  ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                  : 'bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300'
              }`}
            >
              {mode === 'ocr' ? (
                <>
                  <ScanText className="w-3 h-3" />
                  <span>بازشناسی خط (OCR)</span>
                </>
              ) : (
                <>
                  <FileSearch className="w-3 h-3" />
                  <span>پژوهش پیشرفته</span>
                </>
              )}
            </span>

            {/* OCR Mode: Image Upload Button */}
            {mode === 'ocr' && onOpenUpload && (
              <button
                type="button"
                onClick={onOpenUpload}
                disabled={isDisabled}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="بارگذاری تصویر نسخه خطی"
              >
                <ImageIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">بارگذاری تصویر</span>
              </button>
            )}

            {/* Research Mode: Advanced Filters Toggle */}
            {mode === 'research' && onToggleFilters && (
              <button
                type="button"
                onClick={onToggleFilters}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg transition-colors ${
                  isFilterOpen || activeFilterCount > 0
                    ? 'bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 font-semibold'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title="فیلترهای پیشرفته پژوهش"
              >
                <Filter className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">فیلترهای جست‌وجو</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Submit button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!text.trim() || isDisabled}
            aria-label="ارسال پیام"
            className="p-2 rounded-xl bg-slate-900 text-stone-100 dark:bg-stone-100 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
      <p className="text-[11px] text-center text-stone-400 mt-2">
        پلتفرم هوشمند بازشناسی خطوط کهن اسلامی و جست‌وجوی متون تاریخی
      </p>
    </div>
  );
};
