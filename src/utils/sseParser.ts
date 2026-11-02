/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SourceCitation } from '../types';

export interface SSEParsedEvent {
  event: string;
  data: any;
}

export interface SSECallbacks {
  onToken?: (token: string) => void;
  onSource?: (source: SourceCitation) => void;
  onStart?: (data: any) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: string) => void;
}

/**
 * Robust Server-Sent Events (SSE) buffer parser for stream responses.
 * Handles split packets across chunk boundaries.
 */
export class SSEStreamParser {
  private buffer = '';
  private callbacks: SSECallbacks;

  constructor(callbacks: SSECallbacks) {
    this.callbacks = callbacks;
  }

  public feed(chunk: string): void {
    this.buffer += chunk;

    // SSE events are separated by double newline \n\n or \r\n\r\n
    let boundaryIndex: number;
    while ((boundaryIndex = this.findBoundaryIndex(this.buffer)) !== -1) {
      const rawEvent = this.buffer.slice(0, boundaryIndex).trim();
      const delimiterLength = this.buffer.slice(boundaryIndex).startsWith('\r\n\r\n') ? 4 : 2;
      this.buffer = this.buffer.slice(boundaryIndex + delimiterLength);

      if (rawEvent) {
        this.parseAndDispatch(rawEvent);
      }
    }
  }

  public flush(): void {
    const remaining = this.buffer.trim();
    if (remaining) {
      this.parseAndDispatch(remaining);
      this.buffer = '';
    }
  }

  private findBoundaryIndex(text: string): number {
    const rn = text.indexOf('\r\n\r\n');
    const nn = text.indexOf('\n\n');
    if (rn !== -1 && nn !== -1) {
      return Math.min(rn, nn);
    }
    return rn !== -1 ? rn : nn;
  }

  private parseAndDispatch(rawBlock: string): void {
    const lines = rawBlock.split(/\r?\n/);
    let eventType = 'message';
    const dataLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith('event:')) {
        eventType = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        dataLines.push(line.slice(5).trim());
      }
    }

    if (dataLines.length === 0) {
      // In case the backend streamed raw non-SSE tokens
      if (rawBlock && !rawBlock.startsWith(':')) {
        this.callbacks.onToken?.(rawBlock);
      }
      return;
    }

    const rawData = dataLines.join('\n');
    let parsedData: any;
    try {
      parsedData = JSON.parse(rawData);
    } catch {
      parsedData = rawData;
    }

    switch (eventType) {
      case 'token':
        if (typeof parsedData === 'object' && parsedData?.token !== undefined) {
          this.callbacks.onToken?.(parsedData.token);
        } else if (typeof parsedData === 'string') {
          this.callbacks.onToken?.(parsedData);
        }
        break;

      case 'source':
        this.callbacks.onSource?.(parsedData as SourceCitation);
        break;

      case 'message_start':
        this.callbacks.onStart?.(parsedData);
        break;

      case 'message_complete':
        const full = typeof parsedData === 'object' && parsedData?.full_text
          ? parsedData.full_text
          : (typeof parsedData === 'string' ? parsedData : '');
        this.callbacks.onComplete?.(full);
        break;

      case 'error':
        const err = typeof parsedData === 'object' && parsedData?.error
          ? parsedData.error
          : String(parsedData);
        this.callbacks.onError?.(err);
        break;

      default:
        // Generic data handler
        if (typeof parsedData === 'object' && parsedData?.token) {
          this.callbacks.onToken?.(parsedData.token);
        }
        break;
    }
  }
}
