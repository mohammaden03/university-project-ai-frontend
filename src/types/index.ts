/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ConversationMode = 'ocr' | 'research';

export type ScriptStyle =
  | 'nastaliq'
  | 'naskh'
  | 'shekasteh'
  | 'thuluth'
  | 'kufic'
  | 'reqa'
  | 'muhaqqaq'
  | 'other';

export type SearchMethod = 'exact' | 'fulltext' | 'semantic' | 'hybrid';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'researcher' | 'student' | 'curator' | 'admin';
  avatar?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  mode: ConversationMode;
  created_at: string;
  updated_at: string;
  last_message?: string;
}

export interface Attachment {
  id: string;
  url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  preview_url?: string;
}

export interface LineBoundingBox {
  line_number: number;
  text: string;
  confidence: number;
  bounding_box?: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
}

export interface OCRResultData {
  transcription_id: string;
  image_url: string;
  original_text: string;
  current_text: string;
  is_edited: boolean;
  confidence?: number;
  script_style?: ScriptStyle;
  language?: 'persian' | 'arabic' | 'ottoman_turkish' | 'other';
  model_name?: string;
  warnings?: string[];
  line_boxes?: LineBoundingBox[];
  page_metadata?: {
    book_title?: string;
    manuscript_title?: string;
    page_number?: number;
    folio_number?: string;
  };
}

export type OCRStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface OCRJob {
  job_id: string;
  status: OCRStatus;
  progress?: number;
  error_message?: string;
  result?: OCRResultData;
  created_at: string;
  updated_at: string;
}

export interface SourceCitation {
  id: string;
  book_title: string;
  author_name: string;
  manuscript_title: string;
  manuscript_id: string;
  page_number: number;
  excerpt: string;
  image_url?: string;
  relevance_score?: number;
}

export interface SearchResultItem {
  id: string;
  manuscript_id: string;
  manuscript_title: string;
  book_title: string;
  author_name: string;
  page_number: number;
  excerpt: string;
  highlighted_terms?: string[];
  match_type: SearchMethod;
  relevance_score?: number;
  image_url?: string;
  script_style?: string;
  language?: string;
}

export interface SearchResponseData {
  query: string;
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: SearchResultItem[];
  ai_answer?: string;
  sources?: SourceCitation[];
}

export interface SearchFilters {
  book_title?: string;
  author_name?: string;
  manuscript_title?: string;
  page_number?: number;
  language?: string;
  script_style?: string;
  search_method: SearchMethod;
  page?: number;
  page_size?: number;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type?: 'text' | 'image' | 'ocr_result' | 'search_result' | 'error' | 'status';
  attachments?: Attachment[];
  ocr_job?: OCRJob;
  ocr_data?: OCRResultData;
  search_data?: SearchResponseData;
  sources?: SourceCitation[];
  error?: string;
}

export interface ManuscriptPage {
  id: string;
  page_number: number;
  image_url: string;
  transcription?: string;
  is_verified?: boolean;
}

export interface Manuscript {
  id: string;
  title: string;
  author: string;
  author_id?: string;
  book_id?: string;
  language: string;
  script_style: ScriptStyle;
  collection: string;
  century?: string;
  library_number: string;
  total_pages: number;
  cover_image?: string;
  description?: string;
  pages?: ManuscriptPage[];
}

export interface Book {
  id: string;
  title: string;
  original_title: string;
  author: string;
  author_id: string;
  subject: string;
  era: string;
  manuscript_count: number;
  description: string;
}

export interface Author {
  id: string;
  name: string;
  birth_death: string;
  era: string;
  biography: string;
  books_count: number;
  manuscripts_count: number;
}

export interface TranscriptionRecord {
  id: string;
  manuscript_id?: string;
  page_number?: number;
  image_url: string;
  original_text: string;
  current_text: string;
  is_verified: boolean;
  verified_by?: string;
  verified_at?: string;
  updated_at: string;
  history?: Array<{
    text: string;
    saved_at: string;
    editor_name?: string;
  }>;
}
