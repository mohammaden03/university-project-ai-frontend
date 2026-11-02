/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Plus,
  Search,
  ScanText,
  FileSearch,
  Trash2,
  Settings,
  User as UserIcon,
  BookOpen,
  ScrollText,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useConversations } from '../../hooks/useConversations';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { ConversationMode } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatPersianDate, toPersianDigits } from '../../utils/persian';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { conversations, createConversation, deleteConversation, isCreating } =
    useConversations(conversationId);
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showModeModal, setShowModeModal] = useState(false);

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartNewConversation = (mode: ConversationMode) => {
    setShowModeModal(false);
    createConversation(mode).then(() => {
      if (onCloseMobile) onCloseMobile();
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId) {
      await deleteConversation(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <>
      <aside
        className={`h-full bg-stone-100/90 dark:bg-stone-900/90 border-l border-stone-200 dark:border-stone-800 flex flex-col transition-all duration-200 select-none ${
          sidebarOpen ? 'w-72' : 'w-16'
        }`}
      >
        {/* Top Header inside sidebar */}
        <div className="p-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
          {sidebarOpen ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <ScrollText className="w-4 h-4" />
              </span>
              <div className="truncate">
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                  Manuscript AI
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                  پژوهش نسخه‌های خطی
                </div>
              </div>
            </div>
          ) : (
            <span className="w-8 h-8 mx-auto rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <ScrollText className="w-4 h-4" />
            </span>
          )}

          <button
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'بستن نوار کناری' : 'گسترش نوار کناری'}
            className="hidden lg:flex p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 dark:hover:text-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {sidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* New Conversation Action */}
        <div className="p-3">
          {sidebarOpen ? (
            <div className="relative">
              <button
                onClick={() => setShowModeModal(!showModeModal)}
                disabled={isCreating}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 text-stone-100 dark:bg-stone-100 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-stone-200 transition-colors text-sm font-medium shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>گفتگوی جدید</span>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
              </button>

              {/* Quick mode dropdown modal */}
              {showModeModal && (
                <div className="absolute top-12 left-0 right-0 z-40 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl shadow-lg p-2 animate-in fade-in zoom-in-95">
                  <p className="text-[11px] font-semibold text-stone-400 dark:text-stone-400 px-2 py-1">
                    انتخاب حالت گفتگو:
                  </p>
                  <button
                    onClick={() => handleStartNewConversation('ocr')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/60 text-right transition-colors"
                  >
                    <ScanText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <div>
                      <div className="font-semibold">بازشناسی نسخه خطی (OCR)</div>
                      <div className="text-[10px] text-stone-500">استخراج متن از تصاویر</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleStartNewConversation('research')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/60 text-right transition-colors mt-1"
                  >
                    <FileSearch className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <div>
                      <div className="font-semibold">جست‌وجوی پیشرفته</div>
                      <div className="text-[10px] text-stone-500">پژوهش مفهومی و متنی</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleStartNewConversation('ocr')}
              title="گفتگوی جدید"
              className="w-10 h-10 mx-auto rounded-xl bg-slate-900 text-stone-100 dark:bg-stone-100 dark:text-slate-950 flex items-center justify-center hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Conversation Search (when expanded) */}
        {sidebarOpen && (
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                type="text"
                placeholder="جست‌وجو در گفتگوها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-1.5 text-xs rounded-lg bg-stone-200/60 dark:bg-stone-800/60 border border-transparent focus:border-stone-300 dark:focus:border-stone-700 focus:bg-white dark:focus:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
          {sidebarOpen ? (
            <>
              <div className="px-2 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                گفتگوهای اخیر ({toPersianDigits(filteredConversations.length)})
              </div>

              {filteredConversations.length === 0 ? (
                <div className="text-center py-6 px-3 text-xs text-stone-400">
                  {searchQuery ? 'گفتگویی با این عنوان یافت نشد.' : 'هنوز گفتگویی ایجاد نشده است.'}
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isActive = conv.id === conversationId;
                  const isOCR = conv.mode === 'ocr';

                  return (
                    <div
                      key={conv.id}
                      className={`group relative flex items-center justify-between rounded-xl px-2.5 py-2 text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-stone-200/80 dark:bg-stone-800 font-semibold text-stone-900 dark:text-stone-100 shadow-2xs'
                          : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
                      }`}
                      onClick={() => {
                        navigate(`/chat/${conv.id}`);
                        if (onCloseMobile) onCloseMobile();
                      }}
                    >
                      <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                        {isOCR ? (
                          <ScanText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        ) : (
                          <FileSearch className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        )}
                        <span className="truncate">{conv.title}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] text-stone-400 opacity-80 group-hover:hidden">
                          {isOCR ? 'OCR' : 'پژوهش'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTargetId(conv.id);
                          }}
                          aria-label={`حذف گفتگوی ${conv.title}`}
                          className="hidden group-hover:flex p-1 rounded hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          ) : (
            // Collapsed view icons
            <div className="flex flex-col items-center gap-2 pt-2">
              {conversations.slice(0, 8).map((conv) => {
                const isActive = conv.id === conversationId;
                const isOCR = conv.mode === 'ocr';
                return (
                  <button
                    key={conv.id}
                    title={conv.title}
                    onClick={() => {
                      navigate(`/chat/${conv.id}`);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-stone-300 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                        : 'text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800'
                    }`}
                  >
                    {isOCR ? <ScanText className="w-4 h-4" /> : <FileSearch className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Lower navigation to catalog pages */}
        <div className="p-2 border-t border-stone-200 dark:border-stone-800 space-y-0.5">
          <Link
            to="/manuscripts"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            <ScrollText className="w-4 h-4 text-stone-500 shrink-0" />
            {sidebarOpen && <span>فهرست نسخه‌های خطی</span>}
          </Link>

          <Link
            to="/books"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            <BookOpen className="w-4 h-4 text-stone-500 shrink-0" />
            {sidebarOpen && <span>فهرست کتاب‌ها</span>}
          </Link>

          <Link
            to="/authors"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            <Users className="w-4 h-4 text-stone-500 shrink-0" />
            {sidebarOpen && <span>نویسندگان و دانشمندان</span>}
          </Link>

          <Link
            to="/settings"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4 text-stone-500 shrink-0" />
            {sidebarOpen && <span>تنظیمات و سامانه</span>}
          </Link>
        </div>

        {/* User profile footer */}
        {user && (
          <div className="p-3 border-t border-stone-200 dark:border-stone-800">
            <Link
              to="/profile"
              onClick={onCloseMobile}
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-slate-800 dark:bg-stone-700 text-stone-100 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                {user.name.slice(0, 1)}
              </div>
              {sidebarOpen && (
                <div className="truncate flex-1">
                  <div className="text-xs font-medium text-stone-900 dark:text-stone-100 truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-stone-500 truncate">
                    {user.role === 'researcher' ? 'پژوهشگر ارشد' : 'کاربر سامانه'}
                  </div>
                </div>
              )}
            </Link>
          </div>
        )}
      </aside>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="حذف گفتگو"
        message="آیا از حذف این گفتگو اطمینان دارید؟ کلیه پیام‌ها و پردازش‌های این نشست پاک خواهند شد."
        confirmLabel="حذف گفتگو"
      />
    </>
  );
};
