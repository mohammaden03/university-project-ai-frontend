/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
        صفحه مورد نظر یافت نشد
      </h1>
      <p className="text-sm text-stone-500 max-w-md mb-6 leading-relaxed">
        ممکن است آدرس مورد نظر جابه‌جا شده باشد یا نسخه خطی مربوطه از دسترس خارج شده باشد.
      </p>

      <Link to="/chat">
        <Button variant="primary" rightIcon={<MessageSquare className="w-4 h-4" />}>
          بازگشت به دستیار گفتگو
        </Button>
      </Link>
    </div>
  );
};
