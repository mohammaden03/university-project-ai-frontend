/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadService } from '../services/upload.service';
import { ocrService, RecognizeOptions } from '../services/ocr.service';
import { transcriptionService } from '../services/transcription.service';
import { Attachment, OCRJob, OCRResultData, TranscriptionRecord } from '../types';

export function useOCR() {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [jobStatus, setJobStatus] = useState<OCRJob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadService.uploadFile(file, (p) => setUploadProgress(p)),
  });

  const recognizeMutation = useMutation({
    mutationFn: async (options: RecognizeOptions): Promise<OCRResultData> => {
      setIsProcessing(true);
      const initialJob = await ocrService.recognize(options);
      setJobStatus(initialJob);

      // Poll until completed or failed
      const pollInterval = 1000;
      const maxAttempts = 30;
      let attempts = 0;

      while (attempts < maxAttempts) {
        attempts++;
        await new Promise((res) => setTimeout(res, pollInterval));
        const currentJob = await ocrService.getJob(initialJob.job_id);
        setJobStatus(currentJob);

        if (currentJob.status === 'completed' && currentJob.result) {
          setIsProcessing(false);
          return currentJob.result;
        }

        if (currentJob.status === 'failed') {
          setIsProcessing(false);
          throw new Error(currentJob.error_message || 'خطا در فرآیند بازشناسی تصویر');
        }
      }

      setIsProcessing(false);
      throw new Error('زمان پردازش تصویر به پایان رسید.');
    },
  });

  const saveCorrectionMutation = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }): Promise<TranscriptionRecord> =>
      transcriptionService.updateTranscription(id, text),
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string): Promise<TranscriptionRecord> =>
      transcriptionService.verifyTranscription(id),
  });

  return {
    uploadProgress,
    jobStatus,
    isProcessing,
    isUploading: uploadMutation.isPending,
    uploadFile: (file: File): Promise<Attachment> => uploadMutation.mutateAsync(file),
    recognize: (options: RecognizeOptions): Promise<OCRResultData> =>
      recognizeMutation.mutateAsync(options),
    saveCorrection: (id: string, text: string) =>
      saveCorrectionMutation.mutateAsync({ id, text }),
    isSavingCorrection: saveCorrectionMutation.isPending,
    verifyTranscription: (id: string) => verifyMutation.mutateAsync(id),
    isVerifying: verifyMutation.isPending,
  };
}
