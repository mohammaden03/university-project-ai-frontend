/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  ScrollText,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { manuscriptService } from '../services/manuscript.service';
import { transcriptionService } from '../services/transcription.service';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Button } from '../components/common/Button';
import { getScriptStyleLabel, toPersianDigits } from '../utils/persian';
import { useAuthStore } from '../stores/authStore';

export const ManuscriptDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { useMockApi, user } = useAuthStore();
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const {
    data: manuscript,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['manuscript', id, useMockApi],
    queryFn: () => manuscriptService.getManuscript(id!),
    enabled: !!id,
  });

  const currentPage = manuscript?.pages?.[selectedPageIndex];

  const handleCopyTranscription = async () => {
    if (currentPage?.transcription) {
      await navigator.clipboard.writeText(currentPage.transcription);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleVerify = async () => {
    if (!currentPage) return;
    setIsVerifying(true);
    try {
      await transcriptionService.verifyTranscription(currentPage.id);
      currentPage.is_verified = true;
      setVerifiedSuccess(true);
      setTimeout(() => setVerifiedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner label="در حال دریافت مشخصات نسخه خطی..." />
      </div>
    );
  }

  if (error || !manuscript) {
    return (
      <div className="max-w-xl mx-auto p-8">
        <ErrorMessage
          message="نسخه خطی مورد نظر یافت نشد یا در دسترس نیست."
          onRetry={() => refetch()}
        />
        <div className="mt-4 text-center">
          <Link to="/manuscripts" className="text-xs text-amber-700 hover:underline">
            بازگشت به فهرست نسخه‌ها
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link
          to="/manuscripts"
          className="hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>فهرست نسخه‌های خطی</span>
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-stone-800 dark:text-stone-200 truncate">{manuscript.title}</span>
      </div>

      {/* Main Metadata Card */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-600/20">
                خط {getScriptStyleLabel(manuscript.script_style)}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                زبان {manuscript.language}
              </span>
              <span className="text-xs text-stone-500">{manuscript.library_number}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              {manuscript.title}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-3xl">
              {manuscript.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:border-r border-stone-100 dark:border-stone-800/80 lg:pr-6 text-xs text-stone-500">
            <div>
              <span className="block text-stone-400">پدیدآور:</span>
              <strong className="text-stone-800 dark:text-stone-200">{manuscript.author}</strong>
            </div>
            <div>
              <span className="block text-stone-400">محل نگهداری:</span>
              <strong className="text-stone-800 dark:text-stone-200">{manuscript.collection}</strong>
            </div>
            <div>
              <span className="block text-stone-400">تعداد برگ‌ها:</span>
              <strong className="text-stone-800 dark:text-stone-200 tabular-nums">
                {toPersianDigits(manuscript.total_pages)} صفحه
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Page Viewer & Transcription Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Thumbnails rail */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
            <span>برگ‌های دیجیتال‌شده</span>
            <span className="text-[11px] text-stone-400">
              {toPersianDigits(manuscript.pages?.length || 0)} برگ
            </span>
          </h3>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {manuscript.pages?.map((page, idx) => (
              <button
                key={page.id}
                onClick={() => setSelectedPageIndex(idx)}
                className={`w-full text-right p-2.5 rounded-xl border transition-all flex items-center gap-3 ${
                  selectedPageIndex === idx
                    ? 'border-amber-600 bg-amber-50/60 dark:bg-amber-950/30 shadow-2xs font-bold'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <img
                  src={page.image_url}
                  alt={`برگ ${page.page_number}`}
                  className="w-10 h-12 object-cover rounded-md border border-stone-200 dark:border-stone-700 shrink-0"
                />
                <div className="truncate flex-1">
                  <div className="text-xs text-stone-900 dark:text-stone-100 truncate">
                    برگ شماره {toPersianDigits(page.page_number)}
                  </div>
                  <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                    {page.is_verified ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        تأییدشده
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        نیازمند بازبینی
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Page Image & Transcription Split */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Image Display */}
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 p-3 flex flex-col justify-between">
            <div className="text-xs font-semibold text-stone-600 dark:text-stone-300 px-2 py-1 flex items-center justify-between">
              <span>برگ {toPersianDigits(currentPage?.page_number || 1)}</span>
              <span className="text-[11px] text-stone-400">تصویر اسکن وضوح بالا</span>
            </div>
            <div className="flex-1 flex items-center justify-center p-2 min-h-[400px]">
              {currentPage?.image_url && (
                <img
                  src={currentPage.image_url}
                  alt={`برگ ${currentPage.page_number}`}
                  referrerPolicy="no-referrer"
                  className="max-h-[500px] w-auto object-contain rounded-lg shadow-sm"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.innerHTML = `
                        <div class="w-full h-80 rounded-xl bg-amber-50/80 dark:bg-stone-900 border border-amber-600/20 flex flex-col items-center justify-center p-6 text-center">
                          <div class="w-14 h-14 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                          </div>
                          <span class="text-sm font-bold text-stone-800 dark:text-stone-200">برگ ${currentPage?.page_number || ''} نسخه خطی</span>
                          <span class="text-xs text-stone-500 mt-1">تصویر آرشیوی نسخه کهن</span>
                        </div>
                      `;
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* Transcription Display */}
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-stone-800/80">
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    متن استخراج‌شده (بازشناسی HTR)
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                    {currentPage?.is_verified ? (
                      <span className="text-emerald-600 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        مورد تأیید پژوهشگر
                      </span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        پیش‌نویس اولیه هوش مصنوعی
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyTranscription}
                  rightIcon={
                    isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )
                  }
                >
                  {isCopied ? 'کپی شد' : 'کپی'}
                </Button>
              </div>

              <div className="rounded-xl bg-amber-50/20 dark:bg-stone-950/40 p-4 font-manuscript text-stone-900 dark:text-stone-100 text-sm leading-loose max-h-[420px] overflow-y-auto whitespace-pre-wrap">
                {currentPage?.transcription || 'هنوز متنی برای این برگ ثبت نگردیده است.'}
              </div>
            </div>

            {/* Verification Bar */}
            <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              {verifiedSuccess && (
                <span className="text-xs text-emerald-600 font-medium">
                  برگ با موفقیت به عنوان نسخه تأییدشده علامت‌گذاری شد
                </span>
              )}
              {!currentPage?.is_verified && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleVerify}
                  isLoading={isVerifying}
                  rightIcon={<ShieldCheck className="w-4 h-4" />}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  تأیید و صحه‌گذاری متن
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
