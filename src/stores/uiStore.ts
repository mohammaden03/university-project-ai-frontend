/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { ConversationMode, SearchFilters } from '../types';

type Theme = 'light' | 'dark';

interface UIState {
  theme: Theme;
  sidebarOpen: boolean; // desktop expanded/collapsed
  mobileSidebarOpen: boolean; // mobile drawer
  activeMode: ConversationMode;
  searchFilters: SearchFilters;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setActiveMode: (mode: ConversationMode) => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  resetSearchFilters: () => void;
}

const STORAGE_KEY_THEME = 'manuscript_ai_theme';

const defaultFilters: SearchFilters = {
  book_title: '',
  author_name: '',
  manuscript_title: '',
  page_number: undefined,
  language: '',
  script_style: '',
  search_method: 'hybrid',
  page: 1,
  page_size: 10,
};

// Initial theme check
const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem(STORAGE_KEY_THEME) as Theme | null;
  if (saved === 'dark' || saved === 'light') return saved;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const applyThemeToDOM = (theme: Theme) => {
  if (typeof document !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

export const useUIStore = create<UIState>((set, get) => {
  const initialTheme = getInitialTheme();
  applyThemeToDOM(initialTheme);

  return {
    theme: initialTheme,
    sidebarOpen: true,
    mobileSidebarOpen: false,
    activeMode: 'ocr',
    searchFilters: { ...defaultFilters },

    toggleTheme: () => {
      const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY_THEME, nextTheme);
      applyThemeToDOM(nextTheme);
      set({ theme: nextTheme });
    },

    setTheme: (theme) => {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
      applyThemeToDOM(theme);
      set({ theme });
    },

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

    setActiveMode: (activeMode) => set({ activeMode }),

    setSearchFilters: (newFilters) =>
      set((state) => ({
        searchFilters: { ...state.searchFilters, ...newFilters },
      })),

    resetSearchFilters: () =>
      set({
        searchFilters: { ...defaultFilters },
      }),
  };
});
