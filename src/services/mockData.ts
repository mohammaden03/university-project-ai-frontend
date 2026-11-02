/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Manuscript, Book, Author, Conversation, ChatMessage, OCRResultData } from '../types';

export const MOCK_AUTHORS: Author[] = [
  {
    id: 'auth_ibn_sina',
    name: 'حسین بن عبدالله ابن سینا (پورسینا)',
    birth_death: '۳۷۰ - ۴۲۸ هجری قمری',
    era: 'دوره اسلامی، قرن چهارم و پنجم هجری',
    biography: 'پزشک، فیلسوف، ریاضی‌دان و دانشمند برجسته ایرانی که از مشهورترین و تأثیرگذارترین چهره‌های دانش پزشکی و فلسفه در جهان اسلام و اروپای قرون وسطی به شمار می‌رود.',
    books_count: 4,
    manuscripts_count: 12,
  },
  {
    id: 'auth_ferdowsi',
    name: 'ابوالقاسم فردوسی طوسی',
    birth_death: '۳۲۹ - ۴۱۶ هجری قمری',
    era: 'قرن چهارم و پنجم هجری (دوره غزنوی)',
    biography: 'سراینده شاهنامه، حماسه ملی ایران، بزرگ‌ترین شاعر پارسی‌گوی و یکی از برجسته‌ترین چهره‌های ادبیات حماسی جهان.',
    books_count: 1,
    manuscripts_count: 8,
  },
  {
    id: 'auth_saadi',
    name: 'مصلح‌الدین ابومحمد مشرف بن عبدالله (سعدی شیرازی)',
    birth_death: '۶۰۶ - ۶۹۰ هجری قمری',
    era: 'قرن هفتم هجری (دوره اتابکان فارس)',
    biography: 'شاعر و نویسنده بزرگ پارسی‌گوی ایرانی، ملقب به شیخ اجل و استاد سخن، پدیدآورنده شاهکارهای جاودان گلستان، بوستان و کلیات سعدی.',
    books_count: 3,
    manuscripts_count: 15,
  },
  {
    id: 'auth_razi',
    name: 'ابوبکر محمد بن زکریای رازی',
    birth_death: '۲۵۱ - ۳۱۳ هجری قمری',
    era: 'قرن سوم و چهارم هجری',
    biography: 'پزشک، فیلسوف و شیمیدان نامدار ایرانی که الکل و اسید سولفوریک را کشف کرد و سرپرست بیمارستان بغداد و ری بود.',
    books_count: 2,
    manuscripts_count: 6,
  },
  {
    id: 'auth_qazvini',
    name: 'زکریا بن محمد قزوینی',
    birth_death: '۶۰۰ - ۶۸۲ هجری قمری',
    era: 'قرن هفتم هجری',
    biography: 'جغرافیادان، دانشمند، تاریخ‌نگار و طبیب برجسته ایرانی که کتاب گرانسنگ عجائب المخلوقات را تألیف نمود.',
    books_count: 1,
    manuscripts_count: 4,
  },
];

export const MOCK_BOOKS: Book[] = [
  {
    id: 'book_qanun',
    title: 'قانون در طب',
    original_title: 'القانون فی الطب',
    author: 'ابن سینا',
    author_id: 'auth_ibn_sina',
    subject: 'پزشکی، داروشناسی و آناتومی',
    era: 'قرن پنجم هجری',
    manuscript_count: 7,
    description: 'جامع‌ترین و مشهورترین دانشنامه پزشکی تاریخ اسلام که قرن‌ها در دانشگاه‌های شرق و غرب تدریس می‌شد.',
  },
  {
    id: 'book_shahnameh',
    title: 'شاهنامه',
    original_title: 'شاهنامه فردوسی',
    author: 'ابوالقاسم فردوسی',
    author_id: 'auth_ferdowsi',
    subject: 'ادبیات حماسی و تاریخ اساطیری',
    era: 'قرن چهارم هجری',
    manuscript_count: 8,
    description: 'شاهکار حماسه ملی ایران شامل نزدیک به ۵۰ هزار بیت شعر در بیان اساطیر، پهلوانی‌ها و تاریخ ایران کهن.',
  },
  {
    id: 'book_golestan',
    title: 'گلستان سعدی',
    original_title: 'گلستان',
    author: 'سعدی شیرازی',
    author_id: 'auth_saadi',
    subject: 'ادبیات اخلاقی و نثر مسجع',
    era: 'قرن هفتم هجری',
    manuscript_count: 9,
    description: 'کتابی از نثر مسجع و آمیخته به شعر که در یک دیباچه و هشت باب تدوین گردیده و زبانزد خردورزی ایرانی است.',
  },
  {
    id: 'book_al_hawi',
    title: 'الحاوی فی الطب',
    original_title: 'کتاب الحاوی فی علم التداوی',
    author: 'زکریای رازی',
    author_id: 'auth_razi',
    subject: 'پزشکی بالینی و بیماری‌شناسی',
    era: 'قرن چهارم هجری',
    manuscript_count: 5,
    description: 'دانشنامه بزرگ پزشکی بالینی و تجارب درمانی که یادداشت‌های جامع رازی درباره بیماری‌ها را دربر دارد.',
  },
  {
    id: 'book_ajaeb',
    title: 'عجائب المخلوقات و غرائب الموجودات',
    original_title: 'عجائب المخلوقات',
    author: 'زکریا قزوینی',
    author_id: 'auth_qazvini',
    subject: 'کیهان‌شناسی، گیتی‌شناسی و جانورشناسی کهن',
    era: 'قرن هفتم هجری',
    manuscript_count: 4,
    description: 'از شگفت‌انگیزترین آثار مصور جهان اسلام درباره اجرام آسمانی، دریاها، کانی‌ها، گیاهان و شگفتی‌های آفرینش.',
  },
];

export const MOCK_MANUSCRIPTS: Manuscript[] = [
  {
    id: 'ms_qanun_7th',
    title: 'نسخه کهن کتاب اول قانون در طب (کلیات)',
    author: 'حسین بن عبدالله ابن سینا',
    author_id: 'auth_ibn_sina',
    book_id: 'book_qanun',
    language: 'عربی',
    script_style: 'naskh',
    collection: 'کتابخانه و موزه ملی ملک',
    century: 'قرن هفتم هجری (۶۸۲ ق)',
    library_number: 'نسخه خطی شماره ۳۲۸۱',
    total_pages: 184,
    description: 'نسخه دست‌نویس کهن به خط نسخ قوی و خوانا، دارای حواشی مفصل علمی، سرلوح مذهب و عناوین به شنگرف سرخ.',
    pages: [
      {
        id: 'p1',
        page_number: 14,
        image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
        transcription: 'بسم الله الرحمن الرحيم. قال الشيخ الرئيس ابو علي الحسين بن عبدالله بن سينا: الطب علم يتعرف منه احوال بدن الانسان من جهة ما يصح ويزول عن الصحة ليحفظ الصحة حاصلة ويستردها زائلة.',
        is_verified: true,
      },
      {
        id: 'p2',
        page_number: 15,
        image_url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
        transcription: 'واما الامور الطبيعية التي بها قوام البدن فهي سبعة اجناس: الاركان والامزجة والاخلاط والاعضاء والارواح والقوى والافعال.',
        is_verified: true,
      },
      {
        id: 'p3',
        page_number: 16,
        image_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
        transcription: 'والاركان هي بسائط الاجسام الاولية التي هي اجزاء بدن الانسان وسائر الاجسام، وهي اربعة: النار والهواء والماء والارض.',
        is_verified: false,
      },
    ],
  },
  {
    id: 'ms_baysonghor',
    title: 'شاهنامه بایسنقری (نسخه کاخ گلستان)',
    author: 'ابوالقاسم فردوسی',
    author_id: 'auth_ferdowsi',
    book_id: 'book_shahnameh',
    language: 'فارسی',
    script_style: 'nastaliq',
    collection: 'کتابخانه کاخ موزه گلستان (ثبت حافظه جهانی یونسکو)',
    century: 'قرن نهم هجری (۸۳۳ ق - دوره تیموری)',
    library_number: 'نسخه خطی شماره ۷۱۶',
    total_pages: 700,
    description: 'یکی از درخشان‌ترین نگاره‌های تاریخ هنر ایران به خط نستعلیق جعفر بایسنقری، مزین به ۲۲ نگاره تذهیب‌شده زرین.',
    pages: [
      {
        id: 'p20',
        page_number: 1,
        image_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=1200&q=80',
        transcription: 'به نام خداوند جان و خرد / کزین برتر اندیشه برنگذرد\nخداوند نام و خداوند جای / خداوند روزی‌ده رهنمای\nخداوند کیوان و گردان سپهر / فروزنده ماه و ناهید و مهر',
        is_verified: true,
      },
    ],
  },
  {
    id: 'ms_golestan_mir_emad',
    title: 'گلستان سعدی به خط میرعماد الحسنی',
    author: 'سعدی شیرازی',
    author_id: 'auth_saadi',
    book_id: 'book_golestan',
    language: 'فارسی',
    script_style: 'nastaliq',
    collection: 'موزه خط و کتابت کاخ نیاوران',
    century: 'قرن یازدهم هجری (۱۰۱۷ ق - دوره صفوی)',
    library_number: 'نسخه خطی شماره ۹۴',
    total_pages: 142,
    description: 'شاهکار خوشنویسی نستعلیق از میرعماد حسنی قزوینی با حواشی طلااندازی، تشعیر گیاهی و جانوری و صحافی تیماج سوخت.',
    pages: [
      {
        id: 'p30',
        page_number: 5,
        image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
        transcription: 'منت خدای را عزوجل که طاعتش موجب قربت است و به شکر اندرش مزید نعمت. هر نفسی که فرو می‌رود ممد حیات است و چون برمی‌آید مفرح ذات.',
        is_verified: true,
      },
    ],
  },
  {
    id: 'ms_hawi_medicine',
    title: 'کتاب الحاوی فی الطب - جلد هفتم در تدبیر امراض عصب',
    author: 'محمد بن زکریای رازی',
    author_id: 'auth_razi',
    book_id: 'book_al_hawi',
    language: 'عربی',
    script_style: 'naskh',
    collection: 'کتابخانه ملی جمهوری اسلامی ایران',
    century: 'قرن ششم هجری (۵۹۴ ق)',
    library_number: 'نسخه خطی ۲۳۷۵/ف',
    total_pages: 310,
    description: 'نسخه اصیل و تاریخی الحاوی رازی با علامت تقابل و قرائت اطباء کهن و شروح آزمایش‌های دارویی تجربی.',
    pages: [
      {
        id: 'p40',
        page_number: 28,
        image_url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
        transcription: 'قال الرازي: ينبغي للطبيب ان يقصد في علاج الصداع واوجاع الراس الى معرفة السبب الفاعل اولا، فان كان من غلبة الدم فالفصد، وان كان من المرة الصفراء فالتبريد بالخل ودهن الورد.',
        is_verified: true,
      },
    ],
  },
];

export const SAMPLE_OCR_RESULT: OCRResultData = {
  transcription_id: 'tr_demo_qanun_01',
  image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
  original_text: `بسم الله الرحمن الرحيم
الحمد لله رب العالمين والصلاة على نبيه محمد وآله اجمعين
قال الشيخ الرئيس ابو علي الحسين بن عبدالله بن سينا:
الطب علم يتعرف منه احوال بدن الانسان من جهة ما يصح ويزول عن الصحة ليحفظ الصحة حاصلة ويستردها زائلة.
واما الامور الطبيعية التي بها قوام البدن فهي سبعة اجناس:
الاول: الاركان، وهي اربعة: النار والهواء والماء والارض.
الثاني: الامزجة، ومنها المعتدل ومنها الخارج عن الاعتدال.
الثالث: الاخلاط، وهي اربعة: الدم والبلغم والصفراء والسوداء.`,
  current_text: `بسم الله الرحمن الرحيم
الحمد لله رب العالمين والصلاة على نبيه محمد وآله اجمعين
قال الشيخ الرئيس ابو علي الحسين بن عبدالله بن سينا:
الطب علم يتعرف منه احوال بدن الانسان من جهة ما يصح ويزول عن الصحة ليحفظ الصحة حاصلة ويستردها زائلة.
واما الامور الطبيعية التي بها قوام البدن فهي سبعة اجناس:
الاول: الاركان، وهي اربعة: النار والهواء والماء والارض.
الثاني: الامزجة، ومنها المعتدل ومنها الخارج عن الاعتدال.
الثالث: الاخلاط، وهي اربعة: الدم والبلغم والصفراء والسوداء.`,
  is_edited: false,
  confidence: 96.4,
  script_style: 'naskh',
  language: 'arabic',
  model_name: 'ManuscriptAI-HTR-Transformer-v3 (قالب آموزشی خطوط کهن)',
  warnings: [
    'به دلیل فرسودگی جوهر در سطر سوم، دقت اعراب‌گذاری کلمات نیازمند بازبینی چشمی محقق است.',
  ],
  line_boxes: [
    { line_number: 1, text: 'بسم الله الرحمن الرحيم', confidence: 99.2 },
    { line_number: 2, text: 'الحمد لله رب العالمين والصلاة على نبيه محمد وآله اجمعين', confidence: 98.1 },
    { line_number: 3, text: 'قال الشيخ الرئيس ابو علي الحسين بن عبدالله بن سينا:', confidence: 97.4 },
    { line_number: 4, text: 'الطب علم يتعرف منه احوال بدن الانسان من جهة ما يصح ويزول عن الصحة...', confidence: 94.8 },
    { line_number: 5, text: 'واما الامور الطبيعية التي بها قوام البدن فهي سبعة اجناس:', confidence: 96.0 },
    { line_number: 6, text: 'الاول: الاركان، وهي اربعة: النار والهواء والماء والارض.', confidence: 95.3 },
  ],
  page_metadata: {
    book_title: 'قانون در طب',
    manuscript_title: 'نسخه کهن کتاب اول قانون در طب (کلیات)',
    page_number: 14,
    folio_number: '7b',
  },
};

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_ocr_sample',
    title: 'بازشناسی برگ ۱۴ قانون در طب',
    mode: 'ocr',
    created_at: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    last_message: 'متن با موفقیت استخراج شد (دقت ۹۶.۴٪)',
  },
  {
    id: 'conv_research_sample',
    title: 'پژوهش در دانش پزشکی تمدن اسلامی',
    mode: 'research',
    created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    last_message: 'بر اساس متون بازیابی‌شده، موضوع در چندین نسخه یافت شد.',
  },
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  conv_ocr_sample: [
    {
      id: 'msg_1',
      conversation_id: 'conv_ocr_sample',
      sender: 'user',
      content: 'لطفاً این برگ از نسخه خطی قانون در طب را بازشناسی و به متن دیجیتال تبدیل کن.',
      timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      type: 'image',
      attachments: [
        {
          id: 'att_1',
          url: SAMPLE_OCR_RESULT.image_url,
          file_name: 'ms_qanun_folio_14.jpg',
          file_size: 2450000,
          mime_type: 'image/jpeg',
        },
      ],
    },
    {
      id: 'msg_2',
      conversation_id: 'conv_ocr_sample',
      sender: 'assistant',
      content: 'تصویر نسخه خطی با موفقیت پردازش شد. خط شناسایی‌شده از نوع **نسخ کهن** و زبان آن **عربی علمی دوره اسلامی** است. نتیجه استخراج‌شده در کادر زیر آماده بررسی و ویرایش توسط شماست:',
      timestamp: new Date(Date.now() - 3600 * 1000 * 2 + 15000).toISOString(),
      type: 'ocr_result',
      ocr_data: SAMPLE_OCR_RESULT,
    },
  ],
  conv_research_sample: [
    {
      id: 'msg_3',
      conversation_id: 'conv_research_sample',
      sender: 'user',
      content: 'در کدام نسخه‌های خطی درباره دانش پزشکی و روش‌های درمان سردرد صحبت شده است؟',
      timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      type: 'text',
    },
    {
      id: 'msg_4',
      conversation_id: 'conv_research_sample',
      sender: 'assistant',
      content: `بر اساس جست‌وجوی معنایی و متنی در مخزن نسخه‌های خطی علوم کهن، مبحث دانش پزشکی، آسیب‌شناسی و تدبیر انواع سردرد (صداع) در دو نسخه محوری با بیشترین قرابت و استناد یافت گردید:

۱. **کتاب الحاوی فی الطب (اثر ابوبکر محمد بن زکریای رازی):**
در نسخه خطی شماره ۲۳۷۵/ف، جلد هفتم در تدبیر امراض عصب و دماغ، رازی به تفکیک علل ایجاد سردرد ناشی از غلبه اخلاط چهارگانه پرداخته و روش‌های درمانی بالینی با استفاده از اسانس‌های گیاهی (نظیر دهن الورد و بنفشه) را گزارش کرده است.

۲. **کتاب اول قانون در طب (اثر ابن سینا):**
در نسخه کهن ملک (شماره ۳۲۸۱)، ابن سینا در بحث امور طبیعیه و اسباب بیماری‌ها، چگونگی حفظ اعتدال مزاج و بازگرداندن توازن تن را تبیین نموده است.

در کارت‌های زیر، جزئیات اسناد و بخش‌های متنی مستخرج از نسخ اصلی ارائه شده است:`,
      timestamp: new Date(Date.now() - 3600 * 1000 * 24 + 12000).toISOString(),
      type: 'search_result',
      search_data: {
        query: 'دانش پزشکی و روش‌های درمان سردرد',
        total_count: 2,
        page: 1,
        page_size: 10,
        total_pages: 1,
        results: [
          {
            id: 'res_1',
            manuscript_id: 'ms_hawi_medicine',
            manuscript_title: 'کتاب الحاوی فی الطب - جلد هفتم در تدبیر امراض عصب',
            book_title: 'الحاوی فی الطب',
            author_name: 'محمد بن زکریای رازی',
            page_number: 28,
            excerpt: 'قال الرازي: ينبغي للطبيب ان يقصد في علاج الصداع واوجاع الراس الى معرفة السبب الفاعل اولا، فان كان من غلبة الدم فالفصد، وان كان من المرة الصفراء فالتبريد بالخل ودهن الورد.',
            match_type: 'semantic',
            relevance_score: 0.94,
            image_url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
            script_style: 'نسخ',
            language: 'عربی',
          },
          {
            id: 'res_2',
            manuscript_id: 'ms_qanun_7th',
            manuscript_title: 'نسخه کهن کتاب اول قانون در طب (کلیات)',
            book_title: 'قانون در طب',
            author_name: 'ابن سینا',
            page_number: 14,
            excerpt: 'الطب علم يتعرف منه احوال بدن الانسان من جهة ما يصح ويزول عن الصحة ليحفظ الصحة حاصلة ويستردها زائلة...',
            match_type: 'hybrid',
            relevance_score: 0.89,
            image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
            script_style: 'نسخ',
            language: 'عربی',
          },
        ],
        sources: [
          {
            id: 'cit_1',
            book_title: 'الحاوی فی الطب',
            author_name: 'محمد بن زکریای رازی',
            manuscript_title: 'کتاب الحاوی فی الطب - جلد هفتم',
            manuscript_id: 'ms_hawi_medicine',
            page_number: 28,
            excerpt: 'قال الرازي: ينبغي للطبيب ان يقصد في علاج الصداع واوجاع الراس الى معرفة السبب الفاعل اولا...',
            relevance_score: 0.94,
          },
          {
            id: 'cit_2',
            book_title: 'قانون در طب',
            author_name: 'حسین بن عبدالله ابن سینا',
            manuscript_title: 'نسخه کهن کتاب اول قانون در طب',
            manuscript_id: 'ms_qanun_7th',
            page_number: 14,
            excerpt: 'الطب علم يتعرف منه احوال بدن الانسان من جهة ما يصح ويزول عن الصحة ليحفظ الصحة حاصلة...',
            relevance_score: 0.89,
          },
        ],
      },
      sources: [
        {
          id: 'cit_1',
          book_title: 'الحاوی فی الطب',
          author_name: 'محمد بن زکریای رازی',
          manuscript_title: 'کتاب الحاوی فی الطب - جلد هفتم',
          manuscript_id: 'ms_hawi_medicine',
          page_number: 28,
          excerpt: 'قال الرازي: ينبغي للطبيب ان يقصد في علاج الصداع واوجاع الراس الى معرفة السبب الفاعل اولا...',
          relevance_score: 0.94,
        },
        {
          id: 'cit_2',
          book_title: 'قانون در طب',
          author_name: 'حسین بن عبدالله ابن سینا',
          manuscript_title: 'نسخه کهن کتاب اول قانون در طب',
          manuscript_id: 'ms_qanun_7th',
          page_number: 14,
          excerpt: 'الطب علم يتعرف منه احوال بدن الانسان من جهة ما يصح ويزول عن الصحة ليحفظ الصحة حاصلة...',
          relevance_score: 0.89,
        },
      ],
    },
  ],
};
