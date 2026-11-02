/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ChatPage } from './pages/ChatPage';
import { ManuscriptsPage } from './pages/ManuscriptsPage';
import { ManuscriptDetailsPage } from './pages/ManuscriptDetailsPage';
import { BooksPage } from './pages/BooksPage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { AuthorsPage } from './pages/AuthorsPage';
import { AuthorDetailsPage } from './pages/AuthorDetailsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useAuthStore } from './stores/authStore';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, useMockApi } = useAuthStore();
  // In mock mode or when authenticated, allow route access
  if (!isAuthenticated && !useMockApi) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/chat" replace />,
      },
      {
        path: 'chat',
        element: <ChatPage />,
      },
      {
        path: 'chat/:conversationId',
        element: <ChatPage />,
      },
      {
        path: 'manuscripts',
        element: <ManuscriptsPage />,
      },
      {
        path: 'manuscripts/:id',
        element: <ManuscriptDetailsPage />,
      },
      {
        path: 'books',
        element: <BooksPage />,
      },
      {
        path: 'books/:id',
        element: <BookDetailsPage />,
      },
      {
        path: 'authors',
        element: <AuthorsPage />,
      },
      {
        path: 'authors/:id',
        element: <AuthorDetailsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
