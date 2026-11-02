/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'تأیید و حذف',
  cancelLabel = 'انصراف',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-stone-900 dark:text-stone-100 mb-2">{title}</h4>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex items-center gap-3 w-full">
          <Button
            variant="danger"
            className="flex-1"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
