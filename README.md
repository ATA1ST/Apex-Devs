# Apex Digital — Full-Stack Backend + Frontend Integration Blueprint

---

## 1. АНАЛИЗ СУЩЕСТВУЮЩЕГО ФРОНТЕНДА (ZIP)

### Найденные страницы
| Страница | Файл | Назначение |
|----------|------|------------|
| Home | `pages/HomePage.tsx` | Лендинг + форма заявки на услуги |
| Services | `pages/ServicesPage.tsx` | Список услуг |
| Projects | `pages/ProjectsPage.tsx` | Портфолио проектов |
| Project Detail | `pages/ProjectDetailPage.tsx` | Детали проекта по slug |
| Careers | `pages/CareersPage.tsx` | Список вакансий |
| Job Detail | `pages/JobDetailPage.tsx` | Детали вакансии + форма отклика |
| About | `pages/AboutPage.tsx` | О компании |
| Contacts | `pages/ContactPage.tsx` | Контакты (без формы, только инфо) |
| Admin Login | `pages/AdminLogin.tsx` | Вход в админку |
| Admin Panel | `pages/AdminPanel.tsx` | Главная панель админки |
| Admin Jobs | `pages/admin/AdminJobsPage.tsx` | Управление вакансиями |
| Admin Job Form | `pages/admin/AdminJobFormPage.tsx` | Создание/редактирование вакансии |
| Admin Applicants | `pages/admin/AdminApplicantsPage.tsx` | Просмотр откликов |

### Моковые данные
- `data/mockData.ts` — проекты (`mockProjects`), заявки (`mockSubmissions`), основатели (`founders`)
- `data/jobsData.ts` — вакансии (`mockJobs`), отклики (`mockApplicants`), `JobsStorage` на localStorage
- `config/auth.ts` — **ЗАХАРДКОЖЕННЫЕ** логин/пароль (`apex_admin`/`ApexDigital2026!`)

### Фейковая авторизация
- Логин/пароль хранятся в `config/auth.ts` в открытом виде
- Сессия через `sessionStorage` без участия backend
- Rate limiting чисто на стороне клиента через `localStorage`
- Кнопка "Нужен доступ?" показывает пароль в диалоге

### Локализация
- Три языка: `ru` / `kz` / `en`
- Все сущности используют `{ ru: string, kz: string, en: string }` для текстовых полей
- `LanguageContext.tsx` с переключением через `setLanguage()`

### Формы на фронтенде
1. **Заявка на услуги** (HomePage) — name, company, email, phone, service, budget, timeline, description, files, consent
2. **Отклик на вакансию** (JobDetailPage) — name, phone, resumeFile (обязательно)
3. **Вход в админку** (AdminLogin) — login, password

---

## 2. АРХИТЕКТУРА РЕШЕНИЯ

### Backend: .NET 8 Web API + MongoDB
```
ApexDigital.Api/
├── Controllers/         # HTTP endpoints
│   ├── AuthController.cs        # POST /api/auth/login, GET /api/auth/status
│   ├── ProjectsController.cs    # GET /api/projects, /api/projects/{slug}
│   ├── JobsController.cs        # GET /api/jobs, /api/jobs/{slug}
│   ├── SubmissionsController.cs # POST /api/submissions/service-request, /job-application
│   ├── SettingsController.cs    # GET /api/settings
│   ├── AdminController.cs       # /api/admin/* — CRUD всего, dashboard
│   └── FilesController.cs       # GET /api/files/{subfolder}/{name} (admin only)
├── Middleware/
│   └── SecurityHeadersMiddleware.cs
├── Program.cs           # DI, auth, CORS, rate limiting
├── appsettings.json
└── appsettings.Development.json

ApexDigital.Domain/
├── Entities/            # MongoDB document models
│   ├── BaseEntity.cs
│   ├── LocalizedString.cs    # { ru, kz, en } helper
│   ├── AdminUser.cs
│   ├── Project.cs
│   ├── JobVacancy.cs
│   ├── JobApplication.cs
│   ├── ServiceRequest.cs
│   ├── SiteSettings.cs
│   └── AuditLog.cs
└── Enums/

ApexDigital.Application/
├── DTOs/Dtos.cs         # Все request/response DTO
└── Services/
    ├── AuthService.cs       # Логин с brute force protection
    ├── AuditService.cs      # Audit trail
    ├── DatabaseSeeder.cs    # Seed admin + settings
    └── MappingExtensions.cs # Entity <-> DTO mapping

ApexDigital.Infrastructure/
├── Persistence/MongoDbContext.cs    # MongoDB collections + indexes
├── Security/
│   ├── TokenService.cs             # JWT generation/validation
│   └── PasswordHasher.cs           # BCrypt
└── FileStorage/
    └── LocalFileStorageService.cs  # Secure file upload/download
```

### Auth Strategy: JWT Bearer Token
**Почему JWT, а не cookie:**
- Фронтенд — SPA на отдельном origin (localhost:5173 vs localhost:5200)
- JWT проще для CORS в SPA-архитектуре
- Нет CSRF-проблем (токен в Authorization header)
- Один админ — нет нужды в сложной session store

**Поток:**
1. `POST /api/auth/login` → возвращает JWT token
2. Frontend хранит в `sessionStorage` (не localStorage — не переживёт закрытие вкладки)
3. Каждый запрос к `/api/admin/*` включает `Authorization: Bearer {token}`
4. Невалидный/истёкший токен → 401 → redirect на /admin

### File Storage Strategy: Локальная файловая система
**Почему не GridFS:**
- Для MVP/small production локальное хранилище проще
- Файлы (резюме, вложения) — маленькие (< 20 MB)
- При масштабировании заменяется на S3/Azure Blob через тот же интерфейс `IFileStorageService`

**Безопасность файлов:**
- GUID-имена (никогда оригинальное имя на диске)
- Whitelist расширений (.pdf, .doc, .docx, .jpg, .jpeg, .png, .webp)
- Whitelist MIME-типов
- Size limit: 20 MB на файл
- Path traversal protection
- Скачивание только для авторизованных админов

---

## 3. MONGODB COLLECTIONS

### admin_users
| Поле | Тип | Описание |
|------|-----|----------|
| _id | ObjectId | |
| login | string (unique) | Логин админа |
| passwordHash | string | BCrypt hash |
| displayName | string | Имя для UI |
| lastLoginAt | DateTime? | Последний вход |
| failedAttempts | int | Неудачные попытки |
| lockedUntil | DateTime? | Блокировка до |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### projects
Полностью повторяет `Project` interface из `mockData.ts`. Все текстовые поля — `{ ru, kz, en }`.

**Индексы:** `slug` (unique), `isVisible`

### jobs
Полностью повторяет `Job` interface из `jobsData.ts`. Включает вложенный `description` с блоками `{ role, tasks[], requirements[], plusPoints[], conditions[] }` для каждого языка.

**Индексы:** `slug` (unique), `status`

### job_applications
**Индексы:** `jobId`, `status`

### service_requests
**Индексы:** `createdAt` (desc), `status`

### site_settings
Одна запись. Контакты, соцсети, адрес.

### audit_logs
**Индексы:** `createdAt` (desc)

---

## 4. API ENDPOINTS

### Public API (без авторизации)

| Method | Route | Назначение |
|--------|-------|------------|
| GET | `/api/projects` | Список видимых проектов |
| GET | `/api/projects/{slug}` | Детали проекта |
| GET | `/api/jobs` | Список опубликованных вакансий |
| GET | `/api/jobs/{slug}` | Детали вакансии (+ views++) |
| POST | `/api/submissions/service-request` | Заявка на услуги (multipart) |
| POST | `/api/submissions/job-application` | Отклик на вакансию (multipart) |
| GET | `/api/settings` | Публичные настройки сайта |
| POST | `/api/auth/login` | Вход админа |

### Admin API (требует JWT)

| Method | Route | Назначение |
|--------|-------|------------|
| GET | `/api/auth/status` | Проверка сессии |
| GET | `/api/admin/dashboard` | Метрики |
| GET | `/api/admin/service-requests` | Заявки (paginated) |
| PATCH | `/api/admin/service-requests/{id}/status` | Изменить статус |
| GET | `/api/admin/projects` | Все проекты |
| POST | `/api/admin/projects` | Создать проект |
| PUT | `/api/admin/projects/{id}` | Обновить проект |
| PATCH | `/api/admin/projects/{id}/visibility` | Скрыть/показать |
| DELETE | `/api/admin/projects/{id}` | Удалить проект |
| GET | `/api/admin/jobs` | Все вакансии |
| GET | `/api/admin/jobs/{id}` | Детали вакансии |
| POST | `/api/admin/jobs` | Создать вакансию |
| PUT | `/api/admin/jobs/{id}` | Обновить вакансию |
| DELETE | `/api/admin/jobs/{id}` | Удалить вакансию |
| GET | `/api/admin/applicants` | Отклики (paginated) |
| PATCH | `/api/admin/applicants/{id}/status` | Изменить статус |
| DELETE | `/api/admin/applicants/{id}` | Удалить отклик |
| PUT | `/api/admin/settings` | Обновить настройки |
| GET | `/api/files/{subfolder}/{name}` | Скачать файл |

---

## 5. FRONTEND INTEGRATION — ЧТО МЕНЯТЬ

### Файлы, которые ЗАМЕНЯЮТСЯ полностью:
1. `src/app/config/auth.ts` — новая версия без хардкоженных паролей
2. `src/app/pages/AdminLogin.tsx` — без диалога с паролем, реальный API вызов
3. `src/app/routes.tsx` — тот же, но убраны старые импорты из auth

### Новые файлы:
1. `src/app/api/apiClient.ts` — HTTP клиент
2. `src/app/api/types.ts` — типы, соответствующие backend DTO
3. `src/app/api/services.ts` — все API вызовы
4. `.env` — `VITE_API_URL=http://localhost:5200`

### Файлы, которые нужно МОДИФИЦИРОВАТЬ (заменить mock на API):

#### `pages/HomePage.tsx`
Замены:
- `import { mockProjects } from '../data/mockData'` → `import { projectsService } from '../api/services'`
- `const featuredProjects = mockProjects.filter(...)` → `useEffect` с `projectsService.getAll()`
- `handleSubmit` → вызывать `submissionsService.createServiceRequest(formData)`
- Пример:
```tsx
const [projects, setProjects] = useState<Project[]>([]);
useEffect(() => {
  projectsService.getAll().then(data => setProjects(data.slice(0, 3)));
}, []);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.name || !formData.phone || !formData.consent) {
    toast.error('Заполните обязательные поля'); return;
  }
  try {
    await submissionsService.createServiceRequest(formData);
    setFormSubmitted(true);
    toast.success(t('form.success'));
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Ошибка');
  }
};
```

#### `pages/ProjectsPage.tsx`
```tsx
// Было: import { mockProjects } from '../data/mockData'
// Стало:
import { projectsService } from '../api/services';
import type { Project } from '../api/types';

const [projects, setProjects] = useState<Project[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  projectsService.getAll().then(data => {
    setProjects(data);
    setLoading(false);
  });
}, []);
```

#### `pages/ProjectDetailPage.tsx`
```tsx
// Было: const project = mockProjects.find(p => p.slug === slug)
// Стало:
useEffect(() => {
  if (slug) {
    projectsService.getBySlug(slug).then(setProject).catch(() => setProject(null));
  }
}, [slug]);
```

#### `pages/CareersPage.tsx`
```tsx
// Было: import { jobsStorage } from '../data/jobsData'
// Стало:
import { jobsService } from '../api/services';

const [jobs, setJobs] = useState<Job[]>([]);
useEffect(() => {
  jobsService.getAll().then(setJobs);
}, []);
```

#### `pages/JobDetailPage.tsx`
```tsx
// Было: const job = jobsStorage.getJobBySlug(slug)
// Стало:
useEffect(() => {
  if (slug) jobsService.getBySlug(slug).then(setJob);
}, [slug]);

// handleSubmit:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!job || !name || !phone || !resumeFile) return;
  setUploading(true);
  try {
    await submissionsService.createJobApplication({
      jobId: job.id, name, phone, resume: resumeFile,
    });
    setSubmitted(true);
    setShowApplicationForm(false);
  } catch (err) {
    toast.error('Ошибка при отправке');
  } finally {
    setUploading(false);
  }
};
```

#### `pages/AdminPanel.tsx`
```tsx
// Было: import { mockProjects } from '../data/mockData'
// Стало:
import { adminService } from '../api/services';
import type { DashboardMetrics, Project, ServiceRequest } from '../api/types';

const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
const [projects, setProjects] = useState<Project[]>([]);

useEffect(() => {
  adminService.getDashboard().then(setMetrics);
  adminService.getProjects().then(res => setProjects(res.items));
}, []);

// toggleProjectPublish:
const toggleProjectPublish = async (id: string) => {
  await adminService.toggleProjectVisibility(id);
  setProjects(prev => prev.map(p => p.id === id ? { ...p, isVisible: !p.isVisible } : p));
};

// submissions:
// Заменить локальный стейт на API
useEffect(() => {
  adminService.getServiceRequests().then(res => setSubmissions(res.items));
}, []);
```

#### `pages/admin/AdminJobsPage.tsx`
```tsx
// Было: import { jobsStorage } from '../../data/jobsData'
// Стало:
import { adminService } from '../../api/services';

useEffect(() => {
  adminService.getJobs().then(res => setJobs(res.items));
}, []);
```

#### `pages/admin/AdminJobFormPage.tsx`
```tsx
// Было: jobsStorage.createJob(...) / jobsStorage.updateJob(...)
// Стало: adminService.createJob(...) / adminService.updateJob(id, ...)
```

#### `pages/admin/AdminApplicantsPage.tsx`
```tsx
// Было: jobsStorage.getAllApplicants()
// Стало: adminService.getApplicants().then(res => setApplicants(res.items))
```

---

## 6. SECURITY CHECKLIST

### ✅ Обязательно (сделано в backend):
- [x] Захардкоженные пароли убраны с фронта
- [x] BCrypt (work factor 12) для хеширования пароля
- [x] JWT с HMAC-SHA256, TTL 2 часа
- [x] Rate limiting на login (5 req/min)
- [x] Rate limiting на public forms (10 req/min)
- [x] Brute force protection (5 попыток → lockout 5 мин)
- [x] Generic error messages ("Неверный логин или пароль" — без различия)
- [x] Timing-attack protection (verify dummy hash при несуществующем логине)
- [x] Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- [x] CORS whitelist по origin
- [x] Server-side validation через DataAnnotations
- [x] File upload: extension whitelist, MIME whitelist, size limit
- [x] Path traversal protection в file storage
- [x] GUID file names (не оригинальные)
- [x] File download — только для авторизованных
- [x] Audit trail для всех admin действий
- [x] Request body size limit (50 MB)
- [x] Secrets в appsettings/env, не в коде

### ✅ Желательно (для production):
- [ ] HTTPS (настраивается при деплое через reverse proxy)
- [ ] HSTS header
- [ ] Content-Security-Policy
- [ ] Антивирусное сканирование загруженных файлов
- [ ] Rotate JWT secrets
- [ ] Prometheus/Grafana мониторинг

### ❌ Не нужно для этого проекта:
- CAPTCHA (нет публичной регистрации, формы не spam-target)
- OAuth/OIDC (один админ)
- 2FA (можно добавить позже)
- IP whitelisting (если не специально просят)

---

## 7. ИНСТРУКЦИЯ ПО ЗАПУСКУ

### Предварительные требования
- .NET 8 SDK
- Node.js 18+
- MongoDB 6+ (локально или Atlas)

### 1. Установить MongoDB
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt install -y mongodb
sudo systemctl start mongod

# Или Docker:
docker run -d --name mongodb -p 27017:27017 mongo:7
```

### 2. Запустить Backend
```bash
cd backend/ApexDigital.Api

# Восстановить пакеты
dotnet restore

# Запустить (Development mode)
dotnet run

# Backend будет доступен на http://localhost:5200
```

**Конфигурация через environment variables (production):**
```bash
export MongoDB__ConnectionString="mongodb://localhost:27017"
export MongoDB__DatabaseName="apex_digital"
export Jwt__Secret="ваш-длинный-случайный-секрет-минимум-32-символа"
export AdminSeed__Login="apex_admin"
export AdminSeed__Password="ВашСложныйПароль123!"
```

### 3. Подготовить Frontend
```bash
# Скопировать новые файлы в проект:
cp frontend/src/app/api/* <ваш-проект>/src/app/api/
cp frontend/src/app/config/auth.ts <ваш-проект>/src/app/config/auth.ts
cp frontend/src/app/pages/AdminLogin.tsx <ваш-проект>/src/app/pages/AdminLogin.tsx
cp frontend/src/app/routes.tsx <ваш-проект>/src/app/routes.tsx
cp frontend/.env <ваш-проект>/.env

# Установить зависимости (если ещё не)
npm install
# или
pnpm install

# Запустить dev server
npm run dev
# → http://localhost:5173
```

### 4. Модифицировать существующие страницы
Следуя инструкциям из раздела 5, заменить mock-импорты на API-вызовы в:
- `HomePage.tsx`
- `ProjectsPage.tsx`
- `ProjectDetailPage.tsx`
- `CareersPage.tsx`
- `JobDetailPage.tsx`
- `AdminPanel.tsx`
- `admin/AdminJobsPage.tsx`
- `admin/AdminJobFormPage.tsx`
- `admin/AdminApplicantsPage.tsx`

### 5. Seed данных
При первом запуске backend автоматически:
1. Создаёт индексы в MongoDB
2. Создаёт admin user (логин/пароль из `AdminSeed` config)
3. Создаёт default site settings

### 6. Войти в админку
```
URL: http://localhost:5173/admin
Логин: apex_admin
Пароль: ApexDigital2026! (из appsettings.Development.json)
```

### 7. Наполнить данными
Через админку создать:
- Проекты (скопировать из mockData)
- Вакансии (скопировать из jobsData)

Или написать seed-скрипт, который вставит данные из mock-файлов напрямую в MongoDB.

---

## 8. INTEGRATION MAP

| Frontend страница | Backend endpoints | Данные |
|-------------------|-------------------|--------|
| HomePage (проекты) | `GET /api/projects` | Список проектов |
| HomePage (форма) | `POST /api/submissions/service-request` | Заявка на услуги с файлами |
| ProjectsPage | `GET /api/projects` | Все видимые проекты |
| ProjectDetailPage | `GET /api/projects/{slug}` | Проект по slug |
| CareersPage | `GET /api/jobs` | Опубликованные вакансии |
| JobDetailPage | `GET /api/jobs/{slug}` | Вакансия по slug |
| JobDetailPage (форма) | `POST /api/submissions/job-application` | Отклик с резюме |
| ContactPage | `GET /api/settings` | Контакты, соцсети |
| AdminLogin | `POST /api/auth/login` | JWT token |
| AdminPanel (dashboard) | `GET /api/admin/dashboard` | Метрики |
| AdminPanel (проекты) | `GET/POST/PUT/DELETE /api/admin/projects` | CRUD |
| AdminPanel (заявки) | `GET /api/admin/service-requests` | Список заявок |
| AdminJobsPage | `GET /api/admin/jobs` | Все вакансии |
| AdminJobFormPage | `POST/PUT /api/admin/jobs` | Создание/редактирование |
| AdminApplicantsPage | `GET /api/admin/applicants` | Отклики |
| Скачивание файлов | `GET /api/files/{subfolder}/{name}` | Резюме, вложения |

---

## 9. ДЕПЛОЙ (Production-ready заметки)

1. **Backend** — Docker + reverse proxy (nginx/Caddy) с HTTPS
2. **Frontend** — `npm run build` → статика через nginx
3. **MongoDB** — Atlas (managed) или self-hosted с auth
4. **Secrets** — через Docker secrets, Kubernetes secrets, или .env (не в git)
5. **CORS** — поставить реальный domain в `Cors:AllowedOrigins`
6. **JWT Secret** — сменить на реальный длинный случайный ключ
7. **Admin password** — сменить сразу после первого входа

---

*Проект однофайловый (все слои в одном .csproj для простоты). Для enterprise-масштаба — разделить на отдельные проекты через Solution.*
