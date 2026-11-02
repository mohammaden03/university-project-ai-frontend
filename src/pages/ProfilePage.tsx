/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, LogOut, Shield, ScrollText, Bookmark, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { formatPersianDate, toPersianDigits } from '../utils/persian';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
            حساب کاربری و پرونده پژوهشی
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            اطلاعات هویتی پژوهشگر و آمار فعالیت‌های بازشناسی خطوط
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          rightIcon={<LogOut className="w-4 h-4 text-rose-600" />}
          className="text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
        >
          خروج از حساب
        </Button>
      </div>

      {/* User Card */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 text-stone-100 dark:bg-stone-100 dark:text-slate-950 flex items-center justify-center text-xl font-bold uppercase shadow-sm">
          {user?.name?.slice(0, 1) || 'پ'}
        </div>

        <div className="space-y-1.5 text-center sm:text-right flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {user?.name || 'پژوهشگر ارجمند'}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
              {user?.role === 'researcher' ? 'پژوهشگر ارشد نسخه‌های کهن' : 'کاربر پژوهشی'}
            </span>
          </div>

          <p className="text-xs text-stone-500 font-mono" dir="ltr">
            {user?.email || 'researcher@manuscript-ai.ir'}
          </p>

          <p className="text-[11px] text-stone-400 pt-2 flex items-center justify-center sm:justify-start gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>عضویت از: {formatPersianDate(user?.created_at || new Date().toISOString())}</span>
          </p>
        </div>
      </div>

      {/* Research Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-4 text-center">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            {toPersianDigits(14)}
          </div>
          <div className="text-xs text-stone-500 mt-1">نسخه‌های بازشناسی‌شده</div>
        </div>

        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-4 text-center">
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 tabular-nums">
            {toPersianDigits(42)}
          </div>
          <div className="text-xs text-stone-500 mt-1">ارجاعات مستند ثبت‌شده</div>
        </div>

        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-4 text-center">
          <div className="text-2xl font-bold text-stone-800 dark:text-stone-200 tabular-nums">
            {toPersianDigits(8)}
          </div>
          <div className="text-xs text-stone-500 mt-1">برگ‌های صحه‌گذاری‌شده</div>
        </div>
      </div>
    </div>
  );
};
