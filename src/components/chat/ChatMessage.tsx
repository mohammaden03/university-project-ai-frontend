/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ScrollText, User as UserIcon, AlertCircle } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types';
import { OCRResultCard } from '../ocr/OCRResultCard';
import { SearchResultsList } from '../search/SearchResultsList';
import { CitationList } from '../citations/CitationList';
import { formatPersianDate, formatFileSize } from '../../utils/persian';

interface ChatMessageProps {
  message: ChatMessageType;
  onSaveCorrection?: (text: string) => Promise<any>;
  onRetry?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSaveCorrection,
  onRetry,
}) => {
  const isAssistant = message.sender === 'assistant';

  return (
    <div
      className={`flex items-start gap-3 sm:gap-4 py-4 px-2 sm:px-4 ${
        isAssistant ? 'bg-transparent' : 'bg-stone-100/40 dark:bg-stone-900/40 rounded-2xl'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
          isAssistant
            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-600/20'
            : 'bg-slate-900 text-stone-100 dark:bg-stone-200 dark:text-slate-900'
        }`}
      >
        {isAssistant ? <ScrollText className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
      </div>

      {/* Message Content Area */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Header: Sender & Timestamp */}
        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <span className="font-semibold text-stone-900 dark:text-stone-100">
            {isAssistant ? 'دستیار هوشمند نسخه‌های خطی' : 'شما'}
          </span>
          <span aria-hidden="true">·</span>
          <span>{formatPersianDate(message.timestamp)}</span>
        </div>

        {/* Uploaded attachments (if any) */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2.5 my-2">
            {message.attachments.map((att) => (
              <div
                key={att.id}
                className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-2 overflow-hidden max-w-xs shadow-2xs"
              >
                {att.preview_url || att.url ? (
                  <img
                    src={att.preview_url || att.url}
                    alt={att.file_name}
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                ) : null}
                <div className="text-xs truncate font-medium text-stone-800 dark:text-stone-200 px-1">
                  {att.file_name}
                </div>
                <div className="text-[10px] text-stone-400 px-1">
                  {formatFileSize(att.file_size)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Text Body rendered via ReactMarkdown for assistant */}
        {message.content && (
          <div className="text-sm leading-relaxed text-stone-800 dark:text-stone-200 font-sans prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-stone-900 dark:prose-headings:text-stone-100 prose-blockquote:border-r-amber-600 prose-blockquote:font-manuscript">
            {isAssistant ? (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
          </div>
        )}

        {/* Error message card */}
        {message.error && (
          <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/60 dark:bg-rose-950/20 p-3 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{message.error}</span>
          </div>
        )}

        {/* Specialized OCR Result Card */}
        {message.ocr_data && (
          <div className="my-3">
            <OCRResultCard
              data={message.ocr_data}
              onSaveCorrection={onSaveCorrection}
              onRetry={onRetry}
            />
          </div>
        )}

        {/* Specialized Search Results List */}
        {message.search_data && (
          <div className="my-3">
            <SearchResultsList data={message.search_data} />
          </div>
        )}

        {/* Citations List if present */}
        {message.sources && message.sources.length > 0 && (
          <CitationList sources={message.sources} />
        )}
      </div>
    </div>
  );
};
