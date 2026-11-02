/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { SSEStreamParser } from './sseParser.js';

describe('SSEStreamParser', () => {
  test('dispatches single token event correctly', () => {
    const tokens: string[] = [];
    const parser = new SSEStreamParser({
      onToken: (t) => tokens.push(t),
    });

    parser.feed('event: token\ndata: {"token": "سلام"}\n\n');
    assert.deepEqual(tokens, ['سلام']);
  });

  test('dispatches multiple events in a single payload', () => {
    const tokens: string[] = [];
    const sources: any[] = [];
    let completed = false;

    const parser = new SSEStreamParser({
      onToken: (t) => tokens.push(t),
      onSource: (s) => sources.push(s),
      onComplete: () => { completed = true; },
    });

    const stream = [
      'event: message_start\ndata: {"query": "قانون"}\n\n',
      'event: source\ndata: {"book_title": "القانون في الطب", "author_name": "ابن سینا"}\n\n',
      'event: token\ndata: {"token": "در این کتاب"}\n\n',
      'event: token\ndata: {"token": "..."}\n\n',
      'event: message_complete\ndata: {"full_text": "در این کتاب..."}\n\n',
    ].join('');

    parser.feed(stream);

    assert.equal(sources.length, 1);
    assert.equal(sources[0].book_title, 'القانون في الطب');
    assert.deepEqual(tokens, ['در این کتاب', '...']);
    assert.equal(completed, true);
  });

  test('handles packets split arbitrarily across chunks', () => {
    const tokens: string[] = [];
    const parser = new SSEStreamParser({
      onToken: (t) => tokens.push(t),
    });

    // Chunk 1: Cut in middle of data JSON
    parser.feed('event: token\ndata: {"tok');
    assert.equal(tokens.length, 0);

    // Chunk 2: Finishes token and starts second
    parser.feed('en": "بخش ۱"}\n\nevent: token\nda');
    assert.deepEqual(tokens, ['بخش ۱']);

    // Chunk 3: Finishes second token
    parser.feed('ta: {"token": "بخش ۲"}\n\n');
    assert.deepEqual(tokens, ['بخش ۱', 'بخش ۲']);
  });

  test('handles flush for remaining buffered data without trailing newlines', () => {
    const tokens: string[] = [];
    const parser = new SSEStreamParser({
      onToken: (t) => tokens.push(t),
    });

    parser.feed('event: token\ndata: {"token": "پایانی"}');
    assert.equal(tokens.length, 0);

    parser.flush();
    assert.deepEqual(tokens, ['پایانی']);
  });

  test('handles error event correctly', () => {
    let capturedError = '';
    const parser = new SSEStreamParser({
      onError: (err) => { capturedError = err; },
    });

    parser.feed('event: error\ndata: {"error": "خطای دسترسی به مدل"}\n\n');
    assert.equal(capturedError, 'خطای دسترسی به مدل');
  });
});
