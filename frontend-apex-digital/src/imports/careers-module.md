Ты — Lead Product Designer + Security-minded Frontend Engineer. Добавь в сайт Apex Digital новый модуль “Вакансии” (public) и управление вакансиями (admin) без backend, но с максимально “security-like” реализацией на фронтенде и отличным UX.

1) НАВИГАЦИЯ И СТРАНИЦЫ
Добавь вкладку в хедер: “Вакансии” рядом с “Проекты”.
Страницы:
- /careers (Вакансии — публично)
- /careers/:slug (Детальная вакансия)
- Админка:
  - /admin/panel/jobs (список вакансий + метрики)
  - /admin/panel/jobs/new (создание)
  - /admin/panel/jobs/:id/edit (редактирование)
  - /admin/panel/applicants (отклики по вакансиям, фильтры)
  - /admin/panel/analytics (сводка просмотров/откликов)

2) ПУБЛИЧНАЯ СТРАНИЦА /careers
Дизайн должен быть таким же “дорогим” как остальной сайт:
- Hero: “Вакансии Apex Digital” + короткое пояснение (без клише).
- Фильтры: Отдел (Dev/Design/PM/Other), Формат (Remote/Office/Hybrid), Тип (Full-time/Part-time/Contract).
- Поиск по названию.
- Карточки вакансий: 
  title, location (Astana/Remote), формат, краткое описание 1–2 строки, дата публикации, бейдж “Открыта”.
  Кнопка: “Подробнее” → /careers/:slug.
- Empty state: если вакансий нет — красивый блок:
  “Сейчас открытых вакансий нет. Оставьте резюме — мы вернёмся, когда появится подходящая роль.”
  + кнопка “Отправить резюме” (general application).

3) /careers/:slug — ДЕТАЛЬНАЯ ВАКАНСИЯ
Структура:
- Заголовок + бейджи (Remote/Hybrid, Full-time, Department)
- Блоки:
  A) О роли (3–5 строк)
  B) Задачи (6–10 bullets)
  C) Требования (6–10 bullets)
  D) Будет плюсом (3–6 bullets)
  E) Условия (4–8 bullets)
  F) Стек (chips) — только если уместно
- Справа/внизу: “Откликнуться” (форма)

4) ФОРМА ОТКЛИКА (UX ВАЖНО)
Поля:
- Имя* 
- Email* 
- Телефон (optional)
- LinkedIn/GitHub/Portfolio (optional)
- Сообщение (optional)
- Upload резюме* (pdf/doc/docx), один файл, лимит 25MB (или 50MB если уже есть 100MB логика)
- Checkbox согласия на обработку данных
Состояния:
- upload progress
- error (тип файла/размер/обязательные поля)
- success (мы получили отклик, ответим при необходимости)
- антиспам: “cooldown” после отправки 30 секунд

5) МЕТРИКИ ВАКАНСИЙ (БЕЗ BACKEND, НО УБЕДИТЕЛЬНО)
Сделай простую, но честную модель:
- Views: увеличивать при открытии /careers/:slug (с дедупликацией по sessionStorage раз в 24 часа на пользователя).
- Applicants: увеличивать при успешной отправке формы отклика.
- Отображать на карточках в админке: Views / Applicants / Conversion.
Важно: публично метрики не показывать.

6) АДМИНКА: JOBS CRUD + APPLICANTS
В /admin/panel/jobs:
- Таблица вакансий:
  Title, Status (Draft/Published/Closed), Department, Updated, Views, Applicants, Actions (Edit/Publish/Close/Delete)
- Кнопка “New vacancy”
- Быстрые фильтры (Published/Draft/Closed)
Создание/Редактирование:
- Все тексты три языка RU/KZ/EN (tabs).
- Поля: title, slug, department, location, format, employment type, description blocks (role/tasks/requirements/plus/conditions), stack tags, status.
- Publish workflow: Draft → Published → Closed.

Отклики /admin/panel/applicants:
- Таблица: Vacancy, Name, Email, Date, Status (New/Reviewed/Rejected/Invited), Attachment (resume)
- Просмотр карточки отклика: данные + ссылка “download resume”
- Возможность оставить internal note (mock)

7) SECURITY-LIKE НА ФРОНТЕ (максимум возможного без backend)
- Админка скрыта, публично нет ссылок кроме “Владельцам” в футере.
- Логин/пароль захардкожены НЕ в UI:
  - В .env хранить ADMIN_USER + SALT + HASH (PBKDF2 SHA-256 150k итераций).
  - Пароль не показывать нигде. В UI только hint как сейчас.
  - Constant-time compare, rate limit (5 попыток → блок 2 минуты).
  - TTL сессии 2 часа.
- Данные вакансий/откликов хранить в mock storage:
  - В памяти + localStorage (для демо persistence).
  - Чётко разделить публичный слой и admin слой.
- Важно: нигде не писать пароль в комментариях.

8) ТОН И ДИЗАЙН (АНТИ-AI)
- Никаких эмодзи и лозунгов.
- Меньше общих фраз — больше структурированных bullets.
- Визуал: белый фон, чистая сетка, аккуратные разделители, фирменный orbital-паттерн можно только в hero/CTA.
- Иконки минимальные и из одного набора.

9) ПЕРЕВОДЫ (RU/KZ/EN)
- Все страницы вакансий и формы — три языка.
- Для пустого состояния вакансий тоже три языка.

РЕЗУЛЬТАТ:
Добавь вкладку “Вакансии” с публичной витриной и детальными страницами, форму отклика с upload резюме, и полноценный admin CRUD для вакансий + список откликов + метрики (views/applicants/conversion) — всё реализуемо на фронте без backend, но максимально аккуратно и “secure-like”.