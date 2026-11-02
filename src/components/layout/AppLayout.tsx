/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 font-sans">
      {/* Mobile Drawer */}
      <MobileSidebar />

      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:flex shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <Header />
        <main className="flex-1 min-h-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
