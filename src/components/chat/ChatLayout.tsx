/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ScanText,
  FileSearch,
  Sparkles,
  Info,
  Maximize2,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { Conversation, Attachment } from '../../types';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { ImageUpload } from '../ocr/ImageUpload';
import { OCRProcessingStatus } from '../ocr/OCRProcessingStatus';
import { AdvancedSearchFilters } from '../search/AdvancedSearchFilters';
import { Modal } from '../common/Modal';
import { useChat } from '../../hooks/useChat';
import { useOCR } from '../../hooks/useOCR';
import { useSearch } from '../../hooks/useSearch';
import { useUIStore } from '../../stores/uiStore';
import { SAMPLE_OCR_RESULT } from '../../services/mockData';

interface ChatLayoutProps {
  conversation: Conversation;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({ conversation }) => {
  const { messages, isLoading, isSending, sendMessage, appendLocalMessage, updateMessageOCR } =
    useChat(conversation.id);
  const {
    uploadFile,
    isUploading,
    uploadProgress,
    recognize,
    jobStatus,
    isProcessing,
    saveCorrection,
  } = useOCR();
  const { searchFilters, setSearchFilters, resetSearchFilters } = useUIStore();
  const { search, isSearching } = useSearch(searchFilters);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const isOCR = conversation.mode === 'ocr';

  // Handling sending normal text message
  const handleSendMessage = async (text: string) => {
    setErrorNotice(null);
    try {
      if (isOCR) {
        // In OCR mode, user can ask for recognition guidance or questions about the transcribed text
        await sendMessage({ content: text });
      } else {
        // In Research Mode, user query triggers search + AI response
        await sendMessage({ content: text });

        // Trigger research search
        const searchResult = await search({
          ...searchFilters,
          book_title: searchFilters.book_title || text,
        });

        // Append assistant search response
        appendLocalMessage({
          sender: 'assistant',
          content:
            searchResult.ai_answer ||
            'بر اساس کاوش در مخزن نسخه‌های خطی، نتایج زیر به دست آمد:',
          type: 'search_result',
          search_data: searchResult,
          sources: searchResult.sources,
        });
      }
    } catch (err: any) {
      setErrorNotice(err.message || 'خطا در ارسال پیام');
    }
  };

  // Handling Image Selection & OCR submission
  const handleImageUploaded = async (file: File) => {
    setShowUploadModal(false);
    setErrorNotice(null);

    try {
      // 1. Upload the file
      const attachment = await uploadFile(file);

      // 2. Post user message with the image attachment
      await sendMessage({
        content: `درخواست بازشناسی و استخراج متن از تصویر نسخه خطی (${file.name})`,
        attachments: [attachment],
      });

      // 3. Initiate OCR processing
      const ocrResult = await recognize({
        image_url: attachment.preview_url || attachment.url,
      });

      // 4. Append assistant response with OCR result
      appendLocalMessage({
        sender: 'assistant',
        content:
          'فرآیند بازشناسی تصویر نسخه خطی تکمیل شد. نتیجه استخراج‌شده در کادر زیر آماده بررسی و ویرایش توسط شماست:',
        type: 'ocr_result',
        ocr_data: ocrResult,
      });
    } catch (err: any) {
      setErrorNotice(err.message || 'خطا در استخراج متن از تصویر');
      appendLocalMessage({
        sender: 'assistant',
        content: 'متأسفانه در فرآیند استخراج متن از تصویر خطایی رخ داد.',
        type: 'error',
        error: err.message || 'خطا در بازشناسی متن نسخه خطی',
      });
    }
  };

  const handleUseSampleImage = async (sampleUrl: string) => {
    setShowUploadModal(false);
    setErrorNotice(null);

    try {
      const mockAttachment: Attachment = {
        id: 'att_sample_qanun',
        url: sampleUrl,
        preview_url: sampleUrl,
        file_name: 'نسخه_خطی_قانون_ابن_سینا.jpg',
        file_size: 2450000,
        mime_type: 'image/jpeg',
      };

      await sendMessage({
        content: 'درخواست بازشناسی برگ ۱۴ قانون در طب ابن سینا (نسخه کهن خط نسخ)',
        attachments: [mockAttachment],
      });

      const ocrResult = await recognize({
        image_url: sampleUrl,
        script_style: 'naskh',
        language: 'arabic',
      });

      appendLocalMessage({
        sender: 'assistant',
        content:
          'بازشناسی متن نسخه کهن با موفقیت انجام گرفت. متن در کادر زیر قابل ویرایش و ذخیره است:',
        type: 'ocr_result',
        ocr_data: ocrResult,
      });
    } catch (err: any) {
      setErrorNotice(err.message || 'خطا در بازشناسی نمونه');
    }
  };

  const handleSaveCorrection = async (text: string) => {
    if (!messages) return;
    const lastOCRMessage = [...messages].reverse().find((m) => m.ocr_data);
    if (lastOCRMessage?.ocr_data) {
      const updated = await saveCorrection(lastOCRMessage.ocr_data.transcription_id, text);
      updateMessageOCR(lastOCRMessage.id, {
        ...lastOCRMessage.ocr_data,
        current_text: updated.current_text,
        is_edited: true,
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-50/50 dark:bg-stone-950/50 overflow-hidden relative">
      {/* Conversation Top Header */}
      <div className="h-13 border-b border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 backdrop-blur-xs px-4 lg:px-6 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 truncate">
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isOCR
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-600/20'
                : 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-600/20'
            }`}
          >
            {isOCR ? <ScanText className="w-3.5 h-3.5" /> : <FileSearch className="w-3.5 h-3.5" />}
          </span>
          <div className="truncate">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
              {conversation.title}
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-stone-500">
              <span>{isOCR ? 'حالت بازشناسی خط کهن (OCR / HTR)' : 'حالت پژوهش پیشرفته در متون'}</span>
            </div>
          </div>
        </div>

        {/* Header Tools */}
        <div className="flex items-center gap-2">
          {isOCR && (
            <button
              onClick={() => setShowUploadModal(true)}
              disabled={isProcessing || isUploading}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors"
            >
              بارگذاری تصویر جدید
            </button>
          )}

          {!isOCR && (
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                showFilterPanel
                  ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300'
                  : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              فیلترهای پیشرفته
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filter Drawer (Research Mode) */}
      {!isOCR && (
        <div className="px-4 py-2 border-b border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60">
          <AdvancedSearchFilters
            filters={searchFilters}
            onChange={setSearchFilters}
            onReset={resetSearchFilters}
            isOpen={showFilterPanel}
            onToggle={() => setShowFilterPanel(!showFilterPanel)}
          />
        </div>
      )}

      {/* Active OCR Processing Banner if running */}
      {isProcessing && jobStatus && (
        <div className="p-3 mx-4 mt-3">
          <OCRProcessingStatus
            status={jobStatus.status}
            progress={jobStatus.progress}
            errorMessage={jobStatus.error_message}
          />
        </div>
      )}

      {/* Error Banner */}
      {errorNotice && (
        <div className="mx-4 mt-3 p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorNotice}</span>
          </div>
          <button onClick={() => setErrorNotice(null)} className="text-stone-400 hover:text-stone-600">
            ✕
          </button>
        </div>
      )}

      {/* Chat Messages List */}
      <ChatMessageList
        messages={messages}
        isLoading={isLoading || isSending || isSearching}
        onSaveCorrection={handleSaveCorrection}
      />

      {/* Bottom Chat Input */}
      <ChatInput
        mode={conversation.mode}
        onSendMessage={handleSendMessage}
        onOpenUpload={() => setShowUploadModal(true)}
        onToggleFilters={() => setShowFilterPanel(!showFilterPanel)}
        isFilterOpen={showFilterPanel}
        isDisabled={isSending || isProcessing || isSearching}
      />

      {/* Image Upload Modal for OCR */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="بارگذاری و استخراج متن نسخه خطی"
        maxWidth="lg"
      >
        <ImageUpload
          onImageSelected={handleImageUploaded}
          onUseSampleImage={handleUseSampleImage}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />
      </Modal>
    </div>
  );
};
