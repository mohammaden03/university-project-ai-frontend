/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Sun, Moon, Database, Shield, Globe, Cpu, CheckCircle2 } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/common/Button';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, setTheme } = useUIStore();
  const { useMockApi, setUseMockApi } = useAuthStore();
  const [apiBaseUrl, setApiBaseUrl] = useState(
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
            تنظیمات سامانه و ظاهر
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          پیکربندی محیط کاربری، تم، سرویس‌های اتصال به بک‌اند پایتون و مدل‌های هوش مصنوعی
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance & Theme Section */}
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-600" />
            <span>پوسته و نمایش ظاهری</span>
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            انتخاب تم روشن (روز) یا تاریک (شب) بر اساس راحتی دید در مطالعه نسخه‌های کهن
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <button
              onClick={() => setTheme('light')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                theme === 'light'
                  ? 'border-amber-600 bg-amber-50/50 text-amber-900 font-bold shadow-2xs'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-600" />
              <span className="text-xs">پوسته روشن (روز)</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                theme === 'dark'
                  ? 'border-amber-500 bg-stone-800 text-stone-100 font-bold shadow-2xs'
                  : 'border-stone-200 dark:border-stone-700 text-stone-400 hover:bg-stone-800/50'
              }`}
            >
              <Moon className="w-5 h-5 text-amber-400" />
              <span className="text-xs">پوسته تاریک (شب)</span>
            </button>
          </div>
        </div>

        {/* Backend & Mock Mode Section */}
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-2">
            <Database className="w-4 h-4 text-teal-600" />
            <span>اتصال به سرویس بک‌اند (Python Backend)</span>
          </h3>
          <p className="text-xs text-stone-500 mb-4 leading-relaxed">
            امکان تعویض لحظه‌ای میان حالت شبیه‌ساز (Mock Demo Mode) و اتصال واقعی به سرور FastAPI / Django پایتون.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-100/70 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700">
              <div>
                <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 block">
                  حالت داده‌های نمایشی و شبیه‌سازی (Mock Mode)
                </span>
                <span className="text-[11px] text-stone-500">
                  {useMockApi
                    ? 'فعال: استفاده از داده‌های نمونه، نسخ خطی موزه ملک و پاسخ‌های شبیه‌سازی‌شده'
                    : 'غیرفعال: ارسال درخواست‌های واقعی به سرور بک‌اند'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setUseMockApi(!useMockApi)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  useMockApi ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    useMockApi ? '-translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                نشانی وب‌سرویس بک‌اند (API Base URL):
              </label>
              <input
                type="text"
                dir="ltr"
                value={apiBaseUrl}
                onChange={(e) => setApiBaseUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* AI Model Architecture Info */}
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-600" />
            <span>مشخصات مدل‌های هوش مصنوعی بازشناسی و استخراج (HTR)</span>
          </h3>
          <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
            <div className="flex items-center justify-between py-1.5 border-b border-stone-100 dark:border-stone-800/80">
              <span>مدل پایه بازشناسی خطوط:</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                ManuscriptAI-HTR-Transformer-v3
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-stone-100 dark:border-stone-800/80">
              <span>خطوط آموزش‌داده‌شده:</span>
              <span>نستعلیق، نسخ کهن، شکسته، ثلث، کوفی</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span>موتور جست‌وجوی معنایی:</span>
              <span>Vector Embeddings + TF-IDF Hybrid Search</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              تنظیمات با موفقیت ذخیره شد
            </span>
          )}
          <Button variant="primary" onClick={handleSaveSettings} className="mr-auto">
            ذخیره تنظیمات
          </Button>
        </div>
      </div>
    </div>
  );
};
