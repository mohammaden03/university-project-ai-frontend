# Manuscript AI | دستیار هوشمند بازشناسی و پژوهش نسخه‌های خطی

پلتفرم پیشرفته و مدرن تحت وب برای بازشناسی نوری و دست‌نویس (OCR/HTR) و پژوهش مفهومی در نسخه‌های خطی فارسی و عربی دوره اسلامی با رابط کاربری مکالمه‌محور (الهام‌گرفته از ChatGPT).

---

## ویژگی‌های اصلی سامانه

1. **بازشناسی نسخه خطی (Manuscript OCR / HTR)**:
   - بارگذاری تصویر نسخه‌های خطی با پشتیبانی از فرمت‌های JPG، PNG و TIFF
   - پیش‌نمایش تصویر و پیگیری وضعیت پردازش مدل عصبی (`در انتظار پردازش`، `در حال پردازش`، `تکمیل شده`، `خطا در پردازش`)
   - مقایسه همزمان تصویر سند کهن و متن بازشناسی‌شده (Split-view)
   - ویرایشگر بزرگ راست‌به‌چپ (RTL) برای متن استخراج‌شده
   - ذخیره اصلاحات پژوهشگر با حفظ کامل متن اولیه استخراج‌شده
   - کپی و دانلود متن بازشناسی‌شده

2. **پژوهش پیشرفته (Advanced Research Mode)**:
   - پرسش‌های مکالمه‌محور به زبان فارسی و عربی
   - فیلترهای پیشرفته بر اساس کتاب، نویسنده، خط (نستعلیق، نسخ، شکسته، ثلث، کوفی)، زبان و روش جست‌وجو
   - روش‌های جست‌وجو: عبارت دقیق (Exact)، متنی (Full-text)، معنایی (Semantic) و ترکیبی (Hybrid)
   - پاسخ‌های تحلیلی هوش مصنوعی همراه با استنادها و منابع مستقیم (Source Citations)
   - امکان مشاهده مستقیم برگ نسخه خطی در مخزن نسخ

3. **گنجینه و فهرست‌نویسی اسناد**:
   - کاتالوگ نسخه‌های خطی، کتاب‌ها و نویسندگان با جست‌وجو و صفحه‌بندی
   - نمایش مشخصات نسخه‌ها، برگ‌های دیجیتال‌شده و وضعیت صحه‌گذاری (Verification Status)

4. **حالت توسعه و نمایشی مستقل (Mock & Production API)**:
   - جداسازی کامل سرویس‌های نمایشی و سرویس‌های تولیدی بک‌اند
   - امکان سوئیچ سریع بین داده‌های نمونه و سرور واقعی Python Backend (FastAPI / Django)

---

## پشته فناوری (Technology Stack)

- **Frontend**: React 19 + TypeScript + Vite
- **Styling & Fonts**: Tailwind CSS v4 + قلم‌های وزیرمتن (Vazirmatn) و امیری (Amiri)
- **State Management**: TanStack Query (React Query) + Zustand
- **Routing**: React Router v7
- **Forms & Validation**: React Hook Form + Zod
- **API Client**: Axios با پشتیبانی از Bearer Token و Interceptors
- **Icons**: Lucide React
- **Markdown**: React Markdown

---

## راه‌اندازی و اجرای محلی (Local Development)

### پیش‌نیازها:
- Node.js (نسخه ۱۸ به بالا)
- npm یا pnpm

### گام‌های اجرا:

۱. کپی متغیرهای محیطی:
```bash
cp .env.example .env
```

۲. نصب وابستگی‌ها:
```bash
npm install
```

۳. اجرای سرور توسعه:
```bash
npm run dev
```
برنامه در آدرس `http://localhost:3000` در دسترس خواهد بود.

۴. ساخت نسخه نهایی (Production Build):
```bash
npm run build
```

---

## استقرار با داکر (Docker Deployment)

برای بیلد و اجرای کانتینر داکر Nginx:

```bash
docker build -t manuscript-ai-frontend .
docker run -d -p 80:80 manuscript-ai-frontend
```

---

## ارتباط با بک‌اند پایتون (Backend Integration)

برای اتصال به سرور بک‌اند پایتون (`university-project-ai-backend-py`):
1. در فایل `.env`، متغیرهای زیر را تنظیم کنید:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   VITE_USE_MOCK_API=false
   ```
2. یا در بخش «تنظیمات سامانه»، کلید «حالت داده‌های نمایشی» را خاموش کنید.
