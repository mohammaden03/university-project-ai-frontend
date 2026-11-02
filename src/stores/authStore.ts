/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  useMockApi: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  setUseMockApi: (useMock: boolean) => void;
}

const STORAGE_KEY_TOKEN = 'manuscript_ai_token';
const STORAGE_KEY_USER = 'manuscript_ai_user';
const STORAGE_KEY_MOCK = 'manuscript_ai_use_mock';

// Demo initial user for smooth academic researcher experience
const defaultDemoUser: User = {
  id: 'usr_researcher_01',
  name: 'دکتر علیرضا محمدی',
  email: 'a.mohammadi@academics.ir',
  role: 'researcher',
  created_at: new Date().toISOString(),
};

export const useAuthStore = create<AuthState>((set) => {
  const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
  const storedUserJson = localStorage.getItem(STORAGE_KEY_USER);
  const storedMock = localStorage.getItem(STORAGE_KEY_MOCK);

  const initialMock =
    storedMock !== null
      ? storedMock === 'true'
      : import.meta.env.VITE_USE_MOCK_API !== 'false';

  let initialUser: User | null = null;
  if (storedUserJson) {
    try {
      initialUser = JSON.parse(storedUserJson);
    } catch {
      initialUser = null;
    }
  } else if (initialMock) {
    // If mock mode is active and no user stored, provide logged in demo user
    initialUser = defaultDemoUser;
  }

  const initialToken = storedToken || (initialMock ? 'mock_jwt_token_demo' : null);

  return {
    user: initialUser,
    token: initialToken,
    isAuthenticated: !!initialToken,
    isLoading: false,
    useMockApi: initialMock,

    setAuth: (user, token) => {
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
    },

    setUser: (user) => {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
      set({ user });
    },

    logout: () => {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_USER);
      set({ user: null, token: null, isAuthenticated: false });
    },

    setUseMockApi: (useMock) => {
      localStorage.setItem(STORAGE_KEY_MOCK, String(useMock));
      set({ useMockApi: useMock });
    },
  };
});
