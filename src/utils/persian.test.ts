/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toPersianDigits,
  getScriptStyleLabel,
  getSearchMethodLabel,
  getOCRStatusLabel,
  formatFileSize,
  truncateText,
} from './persian';

test('toPersianDigits converts western digits to Persian glyphs', () => {
  assert.equal(toPersianDigits(12345), '۱۲۳۴۵');
  assert.equal(toPersianDigits('Page 42 of 100'), 'Page ۴۲ of ۱۰۰');
  assert.equal(toPersianDigits(0), '۰');
  assert.equal(toPersianDigits(null), '');
});

test('getScriptStyleLabel returns proper Persian script titles', () => {
  assert.equal(getScriptStyleLabel('nastaliq'), 'نستعلیق');
  assert.equal(getScriptStyleLabel('naskh'), 'نسخ');
  assert.equal(getScriptStyleLabel('shekasteh'), 'شکسته نستعلیق');
  assert.equal(getScriptStyleLabel('thuluth'), 'ثلث');
  assert.equal(getScriptStyleLabel('kufic'), 'کوفی');
});

test('getSearchMethodLabel returns proper search method labels', () => {
  assert.equal(getSearchMethodLabel('exact'), 'عبارت دقیق');
  assert.equal(getSearchMethodLabel('fulltext'), 'جست‌وجوی متنی');
  assert.equal(getSearchMethodLabel('semantic'), 'جست‌وجوی معنایی');
  assert.equal(getSearchMethodLabel('hybrid'), 'جست‌وجوی ترکیبی');
});

test('getOCRStatusLabel maps statuses to Persian domain labels', () => {
  assert.equal(getOCRStatusLabel('pending'), 'در انتظار پردازش');
  assert.equal(getOCRStatusLabel('processing'), 'در حال پردازش');
  assert.equal(getOCRStatusLabel('completed'), 'تکمیل شده');
  assert.equal(getOCRStatusLabel('failed'), 'خطا در پردازش');
});

test('formatFileSize formats bytes correctly in Persian', () => {
  assert.equal(formatFileSize(0), '۰ بایت');
  assert.match(formatFileSize(1024), /کیلوبایت/);
  assert.match(formatFileSize(1024 * 1024 * 2.5), /مگابایت/);
});

test('truncateText truncates with ellipsis without breaking short text', () => {
  assert.equal(truncateText('کوتاه', 10), 'کوتاه');
  assert.equal(truncateText('این یک متن طولانی برای آزمایش است', 10), 'این یک متن...');
});
