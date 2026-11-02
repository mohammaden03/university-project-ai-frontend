/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { formatFileSize } from '../../utils/persian';
import { SAMPLE_OCR_RESULT } from '../../services/mockData';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  onUseSampleImage?: (imageUrl: string) => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelected,
  onUseSampleImage,
  isUploading = false,
  uploadProgress = 0,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/webp'];
  const maxSizeBytes = 15 * 1024 * 1024; // 15MB

  const handleFile = (file: File) => {
    setError(null);
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|tiff|tif|webp)$/i)) {
      setError('فرمت فایل نامعتبر است. لطفاً یک تصویر با فرمت JPG، PNG یا TIFF انتخاب فرمایید.');
      return;
    }
    if (file.size > maxSizeBytes) {
      setError('حجم فایل انتخابی بیش از حد مجاز (۱۵ مگابایت) است.');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onImageSelected(selectedFile);
    }
  };

  const handleSample = () => {
    if (onUseSampleImage) {
      onUseSampleImage(SAMPLE_OCR_RESULT.image_url);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/70 p-4 sm:p-6 shadow-xs">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/tiff,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {!selectedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
            dragOver
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
              : 'border-stone-300 dark:border-stone-700 hover:border-amber-500/60 dark:hover:border-amber-500/60 hover:bg-stone-50/60 dark:hover:bg-stone-800/40'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-1">
            تصویر نسخه خطی را اینجا بکشید یا برای انتخاب کلیک کنید
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
            پشتیبانی از فرمت‌های JPG, PNG, TIFF تا حداکثر ۱۵ مگابایت
          </p>

          {onUseSampleImage && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSample();
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>استفاده از نمونه نسخه خطی قانون ابن سینا (برای آزمایش سریع)</span>
            </button>
          )}
        </div>
      ) : (
        /* Image Preview State */
        <div className="flex flex-col gap-4">
          <div className="relative rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 max-h-72 flex items-center justify-center group">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="پیش‌نمایش تصویر نسخه خطی"
                className="max-h-72 w-auto object-contain"
              />
            )}
            <button
              onClick={handleRemove}
              disabled={isUploading}
              aria-label="حذف تصویر انتخابی"
              className="absolute top-3 left-3 p-1.5 rounded-lg bg-stone-900/80 text-white hover:bg-rose-600 transition-colors shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1">
            <div className="flex items-center gap-2 truncate">
              <ImageIcon className="w-4 h-4 text-stone-400 shrink-0" />
              <span className="font-medium text-stone-800 dark:text-stone-200 truncate">
                {selectedFile.name}
              </span>
              <span>({formatFileSize(selectedFile.size)})</span>
            </div>
            <button
              onClick={handleRemove}
              disabled={isUploading}
              className="text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              تغییر فایل
            </button>
          </div>

          {/* Upload Progress Bar if active */}
          {isUploading && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                <span>در حال بارگذاری تصویر...</span>
                <span>{uploadProgress}٪</span>
              </div>
              <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            isLoading={isUploading}
            rightIcon={<FileText className="w-4 h-4" />}
            className="w-full bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-semibold py-3"
          >
            استخراج متن از تصویر
          </Button>
        </div>
      )}

      {error && (
        <div className="mt-3 text-xs text-rose-600 dark:text-rose-400 font-medium">
          {error}
        </div>
      )}
    </div>
  );
};
