/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType } from '../../types';
import { ChatMessage } from './ChatMessage';
import { Loader2 } from 'lucide-react';

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
  streamingText?: string | null;
  onSaveCorrection?: (text: string) => Promise<any>;
  onRetry?: () => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isLoading = false,
  streamingText,
  onSaveCorrection,
  onRetry,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-2 sm:px-6 py-4 space-y-4">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          onSaveCorrection={onSaveCorrection}
          onRetry={onRetry}
        />
      ))}

      {/* Streaming Assistant Response */}
      {streamingText && (
        <div className="flex items-start gap-3 py-4 px-2 sm:px-4">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-600/20 flex items-center justify-center text-xs font-bold shrink-0">
            HTR
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                دستیار هوشمند نسخه‌های خطی
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <div className="text-sm leading-relaxed text-stone-800 dark:text-stone-200 whitespace-pre-wrap">
              {streamingText}
            </div>
          </div>
        </div>
      )}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="flex items-center gap-3 py-4 px-4 text-xs text-stone-500">
          <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
          <span>دستیار در حال پردازش و استخراج اطلاعات...</span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
