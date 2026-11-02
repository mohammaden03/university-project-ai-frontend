/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Conversation,
  ChatMessage,
  OCRJob,
  OCRResultData,
  TranscriptionRecord,
  SearchFilters,
  SearchResponseData,
  Manuscript,
  Book,
  Author,
  User,
  Attachment,
} from '../types';
import {
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  MOCK_AUTHORS,
  MOCK_BOOKS,
  MOCK_MANUSCRIPTS,
  SAMPLE_OCR_RESULT,
} from './mockData';
import { generateId } from '../utils/persian';

// LocalStorage keys for mock state persistence
const STORAGE_CONVERSATIONS = 'manuscript_ai_mock_conversations';
const STORAGE_MESSAGES = 'manuscript_ai_mock_messages';
const STORAGE_TRANSCRIPTIONS = 'manuscript_ai_mock_transcriptions';
const STORAGE_OCR_JOBS = 'manuscript_ai_mock_ocr_jobs';

class MockService {
  private conversations: Conversation[] = [];
  private messages: Record<string, ChatMessage[]> = {};
  private transcriptions: Record<string, TranscriptionRecord> = {};
  private ocrJobs: Record<string, OCRJob> = {};

  constructor() {
    this.init();
  }

  private init() {
    // Load conversations
    const savedConv = localStorage.getItem(STORAGE_CONVERSATIONS);
    if (savedConv) {
      try {
        this.conversations = JSON.parse(savedConv);
      } catch {
        this.conversations = [...INITIAL_CONVERSATIONS];
      }
    } else {
      this.conversations = [...INITIAL_CONVERSATIONS];
      this.saveConversations();
    }

    // Load messages
    const savedMsg = localStorage.getItem(STORAGE_MESSAGES);
    if (savedMsg) {
      try {
        this.messages = JSON.parse(savedMsg);
      } catch {
        this.messages = { ...INITIAL_MESSAGES };
      }
    } else {
      this.messages = { ...INITIAL_MESSAGES };
      this.saveMessages();
    }

    // Load transcriptions
    const savedTr = localStorage.getItem(STORAGE_TRANSCRIPTIONS);
    if (savedTr) {
      try {
        this.transcriptions = JSON.parse(savedTr);
      } catch {
        this.transcriptions = {};
      }
    }

    // Ensure sample transcription exists
    if (!this.transcriptions[SAMPLE_OCR_RESULT.transcription_id]) {
      this.transcriptions[SAMPLE_OCR_RESULT.transcription_id] = {
        id: SAMPLE_OCR_RESULT.transcription_id,
        image_url: SAMPLE_OCR_RESULT.image_url,
        original_text: SAMPLE_OCR_RESULT.original_text,
        current_text: SAMPLE_OCR_RESULT.current_text,
        is_verified: false,
        updated_at: new Date().toISOString(),
        history: [],
      };
      this.saveTranscriptions();
    }
  }

  private saveConversations() {
    localStorage.setItem(STORAGE_CONVERSATIONS, JSON.stringify(this.conversations));
  }

  private saveMessages() {
    localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(this.messages));
  }

  private saveTranscriptions() {
    localStorage.setItem(STORAGE_TRANSCRIPTIONS, JSON.stringify(this.transcriptions));
  }

  private saveJobs() {
    localStorage.setItem(STORAGE_OCR_JOBS, JSON.stringify(this.ocrJobs));
  }

  // --- Auth Mock ---
  async login(email: string): Promise<{ user: User; token: string }> {
    await this.delay(400);
    const user: User = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0] || 'پژوهشگر ارجمند',
      email,
      role: 'researcher',
      created_at: new Date().toISOString(),
    };
    return { user, token: 'mock_jwt_token_' + Date.now() };
  }

  async register(name: string, email: string): Promise<{ user: User; token: string }> {
    await this.delay(400);
    const user: User = {
      id: 'usr_' + Date.now(),
      name,
      email,
      role: 'researcher',
      created_at: new Date().toISOString(),
    };
    return { user, token: 'mock_jwt_token_' + Date.now() };
  }

  async getCurrentUser(): Promise<User> {
    await this.delay(200);
    return {
      id: 'usr_researcher_01',
      name: 'دکتر علیرضا محمدی',
      email: 'a.mohammadi@academics.ir',
      role: 'researcher',
      created_at: new Date().toISOString(),
    };
  }

  // --- Conversations Mock ---
  async getConversations(): Promise<Conversation[]> {
    await this.delay(250);
    return [...this.conversations].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }

  async getConversation(id: string): Promise<Conversation> {
    await this.delay(200);
    const conv = this.conversations.find((c) => c.id === id);
    if (!conv) throw new Error('گفتگوی مورد نظر یافت نشد.');
    return conv;
  }

  async createConversation(mode: 'ocr' | 'research', title?: string): Promise<Conversation> {
    await this.delay(300);
    const defaultTitle =
      mode === 'ocr'
        ? `بازشناسی نسخه خطی جدید ${this.conversations.filter((c) => c.mode === 'ocr').length + 1}`
        : `پژوهش نسخه خطی جدید ${this.conversations.filter((c) => c.mode === 'research').length + 1}`;

    const newConv: Conversation = {
      id: generateId('conv'),
      title: title || defaultTitle,
      mode,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.conversations.unshift(newConv);
    this.messages[newConv.id] = [];
    this.saveConversations();
    this.saveMessages();
    return newConv;
  }

  async deleteConversation(id: string): Promise<void> {
    await this.delay(250);
    this.conversations = this.conversations.filter((c) => c.id !== id);
    delete this.messages[id];
    this.saveConversations();
    this.saveMessages();
  }

  // --- Chat Messages Mock ---
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    await this.delay(200);
    return this.messages[conversationId] || [];
  }

  async sendMessage(
    conversationId: string,
    content: string,
    attachments?: Attachment[]
  ): Promise<ChatMessage> {
    await this.delay(350);
    const conv = this.conversations.find((c) => c.id === conversationId);
    if (!conv) throw new Error('گفتگو یافت نشد.');

    const userMessage: ChatMessage = {
      id: generateId('msg_user'),
      conversation_id: conversationId,
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
      type: attachments && attachments.length > 0 ? 'image' : 'text',
      attachments,
    };

    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    this.messages[conversationId].push(userMessage);

    // Update conversation metadata
    conv.updated_at = new Date().toISOString();
    conv.last_message = content.slice(0, 50);
    this.saveConversations();
    this.saveMessages();

    return userMessage;
  }

  // --- OCR Mock ---
  async uploadFile(file: File): Promise<Attachment> {
    await this.delay(600);
    // Create an object URL or base64 representation
    const previewUrl = URL.createObjectURL(file);
    return {
      id: generateId('att'),
      url: previewUrl,
      preview_url: previewUrl,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type || 'image/jpeg',
    };
  }

  async createOCRJob(imageUrl: string, options?: { script_style?: string; language?: string }): Promise<OCRJob> {
    await this.delay(400);
    const jobId = generateId('job');
    const transcriptionId = generateId('tr');

    const job: OCRJob = {
      job_id: jobId,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.ocrJobs[jobId] = job;
    this.saveJobs();

    // Simulate asynchronous pipeline progression
    setTimeout(() => {
      if (this.ocrJobs[jobId]) {
        this.ocrJobs[jobId].status = 'processing';
        this.ocrJobs[jobId].progress = 45;
        this.ocrJobs[jobId].updated_at = new Date().toISOString();
        this.saveJobs();
      }
    }, 1200);

    setTimeout(() => {
      if (this.ocrJobs[jobId]) {
        const generatedResult: OCRResultData = {
          transcription_id: transcriptionId,
          image_url: imageUrl,
          original_text: `بسم الله الرحمن الرحيم
الحمد لله الذي شرف اهل العلم بمعرفته، وجعل العقل سراجاً في ظلمة الهوى.
فصل في اقسام الامراض والعلل العارضة للاعضاء الباطنة:
اعلم ان المرض خروج العضو عن مجراه الطبيعي ومزاجه السوي، اما في كيفيته او في كميته او في تركيبه.
والعلاج مبني على حفظ الصحة بالاضداد، وتعديل الاخلاط الفاسدة بالاستفراغ والتدبير اللطيف.`,
          current_text: `بسم الله الرحمن الرحيم
الحمد لله الذي شرف اهل العلم بمعرفته، وجعل العقل سراجاً في ظلمة الهوى.
فصل في اقسام الامراض والعلل العارضة للاعضاء الباطنة:
اعلم ان المرض خروج العضو عن مجراه الطبيعي ومزاجه السوي، اما في كيفيته او في كميته او في تركيبه.
والعلاج مبني على حفظ الصحة بالاضداد، وتعديل الاخلاط الفاسدة بالاستفراغ والتدبير اللطيف.`,
          is_edited: false,
          confidence: 95.8,
          script_style: (options?.script_style as any) || 'naskh',
          language: (options?.language as any) || 'arabic',
          model_name: 'ManuscriptAI-HTR-Transformer-v3 (قالب آموزشی خطوط کهن اسلامی)',
          warnings: ['سطر چهارم به دلیل ساییدگی کناره برگ با احتمال بازبینی ۷٪ ثبت شده است.'],
          line_boxes: [
            { line_number: 1, text: 'بسم الله الرحمن الرحيم', confidence: 99.4 },
            { line_number: 2, text: 'الحمد لله الذي شرف اهل العلم بمعرفته، وجعل العقل سراجاً...', confidence: 97.2 },
            { line_number: 3, text: 'فصل في اقسام الامراض والعلل العارضة للاعضاء الباطنة:', confidence: 96.5 },
            { line_number: 4, text: 'اعلم ان المرض خروج العضو عن مجراه الطبيعي ومزاجه السوي...', confidence: 93.1 },
            { line_number: 5, text: 'والعلاج مبني على حفظ الصحة بالاضداد، وتعديل الاخلاط الفاسدة...', confidence: 95.8 },
          ],
          page_metadata: {
            manuscript_title: 'نسخه خطی بارگذاری‌شده',
            page_number: 1,
            folio_number: '1a',
          },
        };

        this.ocrJobs[jobId].status = 'completed';
        this.ocrJobs[jobId].progress = 100;
        this.ocrJobs[jobId].result = generatedResult;
        this.ocrJobs[jobId].updated_at = new Date().toISOString();
        this.saveJobs();

        // Save into transcriptions store
        this.transcriptions[transcriptionId] = {
          id: transcriptionId,
          image_url: imageUrl,
          original_text: generatedResult.original_text,
          current_text: generatedResult.current_text,
          is_verified: false,
          updated_at: new Date().toISOString(),
          history: [],
        };
        this.saveTranscriptions();
      }
    }, 2800);

    return job;
  }

  async getOCRJob(jobId: string): Promise<OCRJob> {
    await this.delay(200);
    const job = this.ocrJobs[jobId];
    if (!job) {
      // Return a simulated completed job if not found
      return {
        job_id: jobId,
        status: 'completed',
        result: SAMPLE_OCR_RESULT,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    return job;
  }

  async retryOCRJob(jobId: string): Promise<OCRJob> {
    await this.delay(300);
    return this.createOCRJob(SAMPLE_OCR_RESULT.image_url);
  }

  // --- Transcriptions Mock ---
  async getTranscription(id: string): Promise<TranscriptionRecord> {
    await this.delay(200);
    const tr = this.transcriptions[id];
    if (tr) return tr;
    return {
      id,
      image_url: SAMPLE_OCR_RESULT.image_url,
      original_text: SAMPLE_OCR_RESULT.original_text,
      current_text: SAMPLE_OCR_RESULT.current_text,
      is_verified: false,
      updated_at: new Date().toISOString(),
      history: [],
    };
  }

  async updateTranscription(id: string, text: string): Promise<TranscriptionRecord> {
    await this.delay(350);
    let record = this.transcriptions[id];
    if (!record) {
      record = {
        id,
        image_url: SAMPLE_OCR_RESULT.image_url,
        original_text: SAMPLE_OCR_RESULT.original_text,
        current_text: SAMPLE_OCR_RESULT.current_text,
        is_verified: false,
        updated_at: new Date().toISOString(),
        history: [],
      };
    }

    // Preserve original OCR text untouched!
    if (!record.history) record.history = [];
    record.history.push({
      text: record.current_text,
      saved_at: new Date().toISOString(),
      editor_name: 'کاربر پژوهشگر',
    });

    record.current_text = text;
    record.updated_at = new Date().toISOString();
    this.transcriptions[id] = record;
    this.saveTranscriptions();

    return record;
  }

  async verifyTranscription(id: string): Promise<TranscriptionRecord> {
    await this.delay(300);
    const record = await this.getTranscription(id);
    record.is_verified = true;
    record.verified_at = new Date().toISOString();
    record.verified_by = 'دکتر علیرضا محمدی (پژوهشگر ارشد)';
    this.transcriptions[id] = record;
    this.saveTranscriptions();
    return record;
  }

  // --- Search Mock ---
  async search(filters: SearchFilters): Promise<SearchResponseData> {
    await this.delay(650);
    const query = filters.book_title || filters.author_name || 'طب و حکمت کهن';

    // Filter manuscripts based on query and filters
    let results = MOCK_MANUSCRIPTS.flatMap((ms) => {
      return (ms.pages || []).map((page, idx) => ({
        id: `sr_${ms.id}_${page.id}`,
        manuscript_id: ms.id,
        manuscript_title: ms.title,
        book_title: MOCK_BOOKS.find((b) => b.id === ms.book_id)?.title || 'دانشنامه تاریخی',
        author_name: ms.author,
        page_number: page.page_number,
        excerpt: page.transcription || 'متن کهن استخراج‌شده از این برگ نسخه خطی...',
        match_type: filters.search_method,
        relevance_score: Number((0.96 - idx * 0.05).toFixed(2)),
        image_url: page.image_url,
        script_style: ms.script_style,
        language: ms.language,
      }));
    });

    if (filters.author_name) {
      results = results.filter((r) => r.author_name.includes(filters.author_name!));
    }
    if (filters.book_title) {
      results = results.filter((r) => r.book_title.includes(filters.book_title!));
    }
    if (filters.script_style) {
      results = results.filter((r) => r.script_style === filters.script_style);
    }

    const pageSize = filters.page_size || 5;
    const page = filters.page || 1;
    const paginated = results.slice((page - 1) * pageSize, page * pageSize);

    const sources = paginated.slice(0, 3).map((r) => ({
      id: `cit_${r.id}`,
      book_title: r.book_title,
      author_name: r.author_name,
      manuscript_title: r.manuscript_title,
      manuscript_id: r.manuscript_id,
      page_number: r.page_number,
      excerpt: r.excerpt.slice(0, 160) + '...',
      image_url: r.image_url,
      relevance_score: r.relevance_score,
    }));

    const aiAnswer = `بر اساس جست‌وجوی انجام‌شده در مجموعه نسخه‌های خطی، متون و شواهد متعددی مرتبط با پرسش شما بازیابی شد:
- در آثار منسوب به **${paginated[0]?.author_name || 'دانشمندان کهن'}**، مباحث نظری و تجربی پیرامون این موضوع در قالب فصول و ابواب مشخص تدوین شده است.
- نسخه‌های خطی نگهداری‌شده در موزه ملک و کتابخانه کاخ گلستان دارای حواشی شارحان است که بر غنای این مستندات افزوده است.

در ادامه، کارت‌های استخراج‌شده از برگ‌های دارای تطابق و مستندات مستقیم قابل مشاهده و ارجاع است.`;

    return {
      query,
      total_count: results.length,
      page,
      page_size: pageSize,
      total_pages: Math.max(1, Math.ceil(results.length / pageSize)),
      results: paginated,
      ai_answer: aiAnswer,
      sources,
    };
  }

  async getSearchSuggestions(prefix: string): Promise<string[]> {
    await this.delay(150);
    const suggestions = [
      'دانش پزشکی در تمدن اسلامی',
      'تعریف ارکان و مزاج در قانون ابن سینا',
      'روش‌های درمان سردرد در الحاوی رازی',
      'آغاز شاهنامه فردوسی به خط نستعلیق',
      'دیباچه گلستان سعدی و خط میرعماد',
      'نسخه‌های خطی قرن هفتم هجری',
      'نگاره‌های شاهنامه بایسنقری',
    ];
    if (!prefix) return suggestions.slice(0, 4);
    return suggestions.filter((s) => s.includes(prefix)).slice(0, 5);
  }

  // --- Catalog (Manuscripts, Books, Authors) Mock ---
  async getManuscripts(params?: { search?: string; page?: number; page_size?: number }): Promise<{
    items: Manuscript[];
    total: number;
    page: number;
    total_pages: number;
  }> {
    await this.delay(300);
    let items = [...MOCK_MANUSCRIPTS];
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.author.toLowerCase().includes(q) ||
          m.collection.toLowerCase().includes(q)
      );
    }
    const page = params?.page || 1;
    const pageSize = params?.page_size || 6;
    const paginated = items.slice((page - 1) * pageSize, page * pageSize);

    return {
      items: paginated,
      total: items.length,
      page,
      total_pages: Math.max(1, Math.ceil(items.length / pageSize)),
    };
  }

  async getManuscript(id: string): Promise<Manuscript> {
    await this.delay(200);
    const ms = MOCK_MANUSCRIPTS.find((m) => m.id === id);
    if (!ms) throw new Error('نسخه خطی یافت نشد.');
    return ms;
  }

  async getBooks(params?: { search?: string }): Promise<Book[]> {
    await this.delay(200);
    let books = [...MOCK_BOOKS];
    if (params?.search) {
      const q = params.search.toLowerCase();
      books = books.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }
    return books;
  }

  async getBook(id: string): Promise<Book> {
    await this.delay(200);
    const book = MOCK_BOOKS.find((b) => b.id === id);
    if (!book) throw new Error('کتاب یافت نشد.');
    return book;
  }

  async getAuthors(params?: { search?: string }): Promise<Author[]> {
    await this.delay(200);
    let authors = [...MOCK_AUTHORS];
    if (params?.search) {
      const q = params.search.toLowerCase();
      authors = authors.filter((a) => a.name.toLowerCase().includes(q));
    }
    return authors;
  }

  async getAuthor(id: string): Promise<Author> {
    await this.delay(200);
    const author = MOCK_AUTHORS.find((a) => a.id === id);
    if (!author) throw new Error('نویسنده یافت نشد.');
    return author;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockService = new MockService();
