/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Edit3,
  Save,
  RotateCcw,
  AlertTriangle,
  ZoomIn,
  Columns,
  Maximize2,
  FileText,
  Sparkles,
} from 'lucide-react';
import { OCRResultData } from '../../types';
import { Button } from '../common/Button';
import { toPersianDigits, getScriptStyleLabel } from '../../utils/persian';

interface OCRResultCardProps {
  data: OCRResultData;
  onSaveCorrection?: (text: string) => Promise<any>;
  onRetry?: () => void;
  className?: string;
}

export const OCRResultCard: React.FC<OCRResultCardProps> = ({
  data,
  onSaveCorrection,
  onRetry,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(data.current_text || data.original_text);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'textOnly' | 'imageOnly'>('split');
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([editedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manuscript_transcription_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    if (!onSaveCorrection) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onSaveCorrection(editedText);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save correction:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToOriginal = () => {
    setEditedText(data.original_text);
  };

  return (
    <div
      className={`rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/80 shadow-sm overflow-hidden ${className}`}
    >
      {/* Card Header with Metadata */}
      <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
            HTR
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>نتیجه بازشناسی خط کهن (OCR / HTR)</span>
              {data.is_edited && (
                <span className="text-[11px] font-normal text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded px-1.5 py-0.2">
                  دارای اصلاحات محقق
                </span>
              )}
            </h4>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {data.page_metadata?.manuscript_title && (
                <>
                  <span>{data.page_metadata.manuscript_title}</span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              {data.page_metadata?.page_number && (
                <>
                  <span>صفحه {toPersianDigits(data.page_metadata.page_number)}</span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              {data.script_style && (
                <span>خط {getScriptStyleLabel(data.script_style)}</span>
              )}
            </div>
          </div>
        </div>

        {/* View mode buttons */}
        <div className="flex items-center gap-1 bg-stone-200/60 dark:bg-stone-800/80 p-1 rounded-lg text-xs">
          <button
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              viewMode === 'split'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-medium shadow-2xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            مقایسه همزمان
          </button>
          <button
            onClick={() => setViewMode('textOnly')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              viewMode === 'textOnly'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-medium shadow-2xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            فقط متن
          </button>
          <button
            onClick={() => setViewMode('imageOnly')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              viewMode === 'imageOnly'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-medium shadow-2xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            فقط تصویر
          </button>
        </div>
      </div>

      {/* Warnings / Confidence Ribbon */}
      <div className="px-5 py-2.5 bg-stone-100/60 dark:bg-stone-800/40 border-b border-stone-200/70 dark:border-stone-800/60 flex flex-wrap items-center justify-between text-xs text-stone-600 dark:text-stone-300 gap-2">
        <div className="flex items-center gap-4">
          {data.confidence !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="text-stone-400">میزان اطمینان مدل:</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
                {toPersianDigits(data.confidence.toFixed(1))}٪
              </span>
            </div>
          )}
          {data.model_name && (
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-stone-400">مدل هوشمند:</span>
              <span className="text-stone-700 dark:text-stone-300">{data.model_name}</span>
            </div>
          )}
        </div>

        {data.warnings && data.warnings.length > 0 && (
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{data.warnings[0]}</span>
          </div>
        )}
      </div>

      {/* Main Comparison Body */}
      <div className="p-4 sm:p-5">
        <div
          className={`grid gap-5 ${
            viewMode === 'split'
              ? 'grid-cols-1 lg:grid-cols-2'
              : viewMode === 'imageOnly'
              ? 'grid-cols-1'
              : 'grid-cols-1'
          }`}
        >
          {/* Left Column: Original Manuscript Image */}
          {(viewMode === 'split' || viewMode === 'imageOnly') && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-stone-300">
                <span>تصویر سند کهن / برگ نسخه</span>
                <span className="text-[11px] text-stone-400">کیفیت آرشیوی</span>
              </div>
              <div className="relative rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 p-2 overflow-hidden flex items-center justify-center min-h-[340px] max-h-[520px]">
                {data.image_url ? (
                  <img
                    src={data.image_url}
                    alt="نسخه خطی اصلی"
                    className="max-h-[500px] w-auto object-contain rounded-lg shadow-xs"
                  />
                ) : (
                  <div className="text-center p-8 text-stone-400 text-xs">
                    تصویر نسخه در دسترس نیست.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Column: Recognized & Editable Text */}
          {(viewMode === 'split' || viewMode === 'textOnly') && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-stone-300">
                <span>متن بازشناسی‌شده (فارسی / عربی)</span>
                {isEditing ? (
                  <span className="text-amber-600 dark:text-amber-400 text-[11px] font-medium animate-pulse">
                    حالت ویرایش فعال است
                  </span>
                ) : (
                  <span className="text-[11px] text-stone-400">قابل کپی و ویرایش</span>
                )}
              </div>

              {isEditing ? (
                /* Editable RTL Textarea */
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    dir="rtl"
                    rows={13}
                    aria-label="متن قابل ویرایش نسخه خطی"
                    className="w-full rounded-xl border-2 border-amber-500/80 bg-stone-50 dark:bg-stone-950 p-4 text-sm font-manuscript text-stone-900 dark:text-stone-100 leading-loose outline-none focus:ring-2 focus:ring-amber-500/20 shadow-inner resize-y min-h-[340px]"
                  />
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>
                      {toPersianDigits(editedText.split(/\s+/).filter(Boolean).length)} کلمه
                    </span>
                    <button
                      type="button"
                      onClick={handleResetToOriginal}
                      className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 underline"
                    >
                      بازگردانی به خروجی اولیه هوش مصنوعی
                    </button>
                  </div>
                </div>
              ) : (
                /* Read-only Beautiful Manuscript Preview */
                <div className="relative rounded-xl border border-stone-200 dark:border-stone-800 bg-amber-50/20 dark:bg-stone-950/40 p-4 sm:p-5 overflow-y-auto max-h-[500px] min-h-[340px] text-stone-900 dark:text-stone-100 font-manuscript text-base sm:text-lg leading-loose selection:bg-amber-200 dark:selection:bg-amber-900/60 whitespace-pre-wrap">
                  {editedText}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Line-level Recognition Table if available */}
        {data.line_boxes && data.line_boxes.length > 0 && (
          <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800">
            <details className="group">
              <summary className="text-xs font-semibold text-stone-600 dark:text-stone-300 cursor-pointer list-none flex items-center justify-between">
                <span>نمایش تفکیک خطوط و سطرهای شناسایی‌شده ({toPersianDigits(data.line_boxes.length)} سطر)</span>
                <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {data.line_boxes.map((line) => (
                  <div
                    key={line.line_number}
                    className="p-2 rounded-lg bg-stone-100/60 dark:bg-stone-800/40 text-xs flex items-center justify-between gap-3 hover:bg-stone-200/50 dark:hover:bg-stone-800/80 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 text-center text-stone-400 font-mono text-[11px]">
                        {toPersianDigits(line.line_number)}
                      </span>
                      <span className="font-manuscript text-stone-900 dark:text-stone-100 truncate">
                        {line.text}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 tabular-nums shrink-0">
                      {toPersianDigits(line.confidence.toFixed(1))}٪
                    </span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}

        {/* Actions Bar (Required in 8.3: «ویرایش متن», «ذخیره اصلاحات», «کپی متن», «دانلود متن», «تلاش مجدد») */}
        <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  isLoading={isSaving}
                  rightIcon={<Save className="w-3.5 h-3.5" />}
                  className="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 text-white"
                >
                  ذخیره اصلاحات
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedText(data.current_text || data.original_text);
                  }}
                  disabled={isSaving}
                >
                  انصراف
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsEditing(true)}
                rightIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                ویرایش متن
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              rightIcon={
                isCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )
              }
            >
              {isCopied ? 'کپی شد' : 'کپی متن'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              rightIcon={<Download className="w-3.5 h-3.5" />}
            >
              دانلود متن
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                تغییرات با موفقیت ذخیره شد
              </span>
            )}
            {onRetry && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRetry}
                rightIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                تلاش مجدد
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
