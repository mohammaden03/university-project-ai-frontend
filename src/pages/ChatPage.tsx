/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConversations } from '../hooks/useConversations';
import { ChatLayout } from '../components/chat/ChatLayout';
import { ChatWelcome } from '../components/chat/ChatWelcome';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { ConversationMode } from '../types';

export const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const {
    activeConversation,
    isActiveLoading,
    createConversation,
    isCreating,
    conversations,
  } = useConversations(conversationId);

  const handleSelectMode = async (mode: ConversationMode, initialQuery?: string) => {
    try {
      const newConv = await createConversation(mode, initialQuery?.slice(0, 35));
      if (initialQuery) {
        // Can be stored in query params or state for immediate submission
        navigate(`/chat/${newConv.id}?q=${encodeURIComponent(initialQuery)}`);
      }
    } catch (err) {
      console.error('Failed to create conversation:', err);
    }
  };

  if (conversationId) {
    if (isActiveLoading) {
      return (
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner label="در حال بارگذاری گفتگو و تاریخچه اسناد..." />
        </div>
      );
    }

    if (!activeConversation) {
      return (
        <div className="h-full flex items-center justify-center p-6">
          <ErrorMessage
            message="گفتگوی مورد نظر یافت نشد یا ممکن است حذف شده باشد."
            onRetry={() => navigate('/chat')}
          />
        </div>
      );
    }

    return <ChatLayout conversation={activeConversation} />;
  }

  // Welcome Screen
  return (
    <div className="h-full overflow-y-auto">
      <ChatWelcome onSelectMode={handleSelectMode} isCreating={isCreating} />
    </div>
  );
};
