/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ScrollText, LogIn, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';

const loginSchema = z.object({
  email: z.string().min(1, 'وارد کردن ایمیل الزامی است').email('فرمت ایمیل نامعتبر است'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ نویسه باشد'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'a.mohammadi@academics.ir',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login({ email: data.email, password: data.password });
      navigate('/chat');
    } catch (err: any) {
      setServerError(err.message || 'ورود با خطا مواجه شد.');
    }
  };

  const handleFillDemo = () => {
    setValue('email', 'a.mohammadi@academics.ir');
    setValue('password', 'password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-stone-100/60 dark:bg-stone-950 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-sm">
        {/* Brand Lockup */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-600/20 flex items-center justify-center mx-auto mb-3">
            <ScrollText className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            ورود به سامانه Manuscript AI
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            دستیار هوشمند بازشناسی و پژوهش نسخه‌های خطی کهن
          </p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              رایانامه (ایمیل) دانشگاهی یا پژوهشی:
            </label>
            <input
              type="email"
              dir="ltr"
              {...register('email')}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600 font-mono transition-colors"
              placeholder="name@university.ac.ir"
            />
            {errors.email && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                رمز عبور:
              </label>
            </div>
            <input
              type="password"
              dir="ltr"
              {...register('password')}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600 font-mono transition-colors"
            />
            {errors.password && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            rightIcon={<LogIn className="w-4 h-4" />}
            className="w-full py-2.5"
          >
            ورود به حساب کاربری
          </Button>

          {/* Quick Demo Fill button */}
          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full py-2 text-center text-xs text-amber-700 dark:text-amber-400 hover:underline flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>تکمیل با اطلاعات حساب آزمایشی پژوهشگر</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-center text-xs text-stone-500">
          <span>حساب کاربری ندارید؟ </span>
          <Link to="/register" className="font-semibold text-stone-900 dark:text-stone-100 hover:underline">
            ثبت‌نام پژوهشگر جدید
          </Link>
        </div>
      </div>
    </div>
  );
};
