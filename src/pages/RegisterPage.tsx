/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ScrollText, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';

const registerSchema = z.object({
  name: z.string().min(3, 'نام و نام خانوادگی باید حداقل ۳ حرف باشد'),
  email: z.string().min(1, 'وارد کردن ایمیل الزامی است').email('فرمت ایمیل نامعتبر است'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ نویسه باشد'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });
      navigate('/chat');
    } catch (err: any) {
      setServerError(err.message || 'ثبت‌نام با خطا مواجه شد.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-stone-100/60 dark:bg-stone-950 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-600/20 flex items-center justify-center mx-auto mb-3">
            <ScrollText className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            ثبت‌نام پژوهشگر جدید
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            دسترسی به پلتفرم استخراج و بازشناسی متون کهن
          </p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              نام و نام خانوادگی:
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600 transition-colors"
              placeholder="مثلاً: دکتر مریم تهرانی"
            />
            {errors.name && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              رایانامه (ایمیل):
            </label>
            <input
              type="email"
              dir="ltr"
              {...register('email')}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600 font-mono transition-colors"
              placeholder="user@example.com"
            />
            {errors.email && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              رمز عبور:
            </label>
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
            rightIcon={<UserPlus className="w-4 h-4" />}
            className="w-full py-2.5"
          >
            تکمیل ثبت‌نام و ورود
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-center text-xs text-stone-500">
          <span>قبلاً حساب کاربری داشته‌اید؟ </span>
          <Link to="/login" className="font-semibold text-stone-900 dark:text-stone-100 hover:underline">
            ورود به حساب
          </Link>
        </div>
      </div>
    </div>
  );
};
