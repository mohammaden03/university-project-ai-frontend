/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { Sidebar } from './Sidebar';

export const MobileSidebar: React.FC = () => {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileSidebarOpen, setMobileSidebarOpen]);

  if (!mobileSidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setMobileSidebarOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-80 max-w-[85vw] h-full bg-stone-100 dark:bg-stone-900 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        <div className="absolute left-3 top-3 z-20">
          <button
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="بستن منو"
            className="p-1.5 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="h-full w-full">
          <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
        </div>
      </div>
    </div>
  );
};
