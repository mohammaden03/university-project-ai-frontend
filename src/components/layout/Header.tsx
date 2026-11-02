/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Sparkles, BookOpen, ScrollText, Users, MessageSquare } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';

export const Header: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme, setMobileSidebarOpen } = useUIStore();
  const { useMockApi, user } = useAuthStore();

  const navLinks = [
    { label: 'دستیار پژوهش', path: '/chat', icon: MessageSquare },
    { label: 'نسخه‌های خطی', path: '/manuscripts', icon: ScrollText },
    { label: 'کتاب‌ها', path: '/books', icon: BookOpen },
    { label: 'نویسندگان', path: '/authors', icon: Users },
  ];

  return (
    <header className="h-14 border-b border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Zone 1: Mobile toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="باز کردن منو"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link
          to="/chat"
          className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-base lg:text-lg tracking-tight whitespace-nowrap shrink-0 group"
        >
          <span className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 border border-amber-600/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ScrollText className="w-4 h-4" />
          </span>
          <span className="font-semibold tracking-normal">Manuscript AI</span>
          <span className="hidden sm:inline text-xs font-normal text-stone-500 dark:text-stone-400 border-r border-stone-300 dark:border-stone-700 pr-2 mr-1">
            نسخه‌شناس هوشمند
          </span>
        </Link>
      </div>

      {/* Zone 2: Navigation Links (Single-line, unboxed) */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-300">
        {navLinks.map((link) => {
          const isActive =
            link.path === '/chat'
              ? location.pathname.startsWith('/chat')
              : location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                isActive
                  ? 'border-amber-600 text-stone-900 dark:border-amber-400 dark:text-stone-100 font-semibold'
                  : 'border-transparent'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Zone 3: Actions (Mock indicator, Theme Toggle, Profile) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {useMockApi && (
          <span
            title="حالت داده‌های نمایشی برای توسعه و تست مستقل رابط کاربری فعال است"
            className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded px-2 py-0.5 whitespace-nowrap hidden sm:inline"
          >
            داده‌های نمایشی (Demo)
          </span>
        )}

        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'حالت روز' : 'حالت شب'}
          className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {user ? (
          <Link
            to="/profile"
            className="flex items-center gap-2 text-xs font-medium text-stone-700 dark:text-stone-200 hover:opacity-85 transition-opacity"
            title={user.name}
          >
            <div className="w-7 h-7 rounded-full bg-slate-800 dark:bg-stone-700 text-stone-100 flex items-center justify-center text-xs font-bold uppercase">
              {user.name.slice(0, 1)}
            </div>
            <span className="hidden xl:inline max-w-[120px] truncate">{user.name}</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-stone-100 dark:text-slate-900 transition-colors whitespace-nowrap"
          >
            ورود به سیستم
          </Link>
        )}
      </div>
    </header>
  );
};
