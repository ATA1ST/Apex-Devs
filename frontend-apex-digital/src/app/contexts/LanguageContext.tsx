import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'ru' | 'kz' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.services': 'Услуги',
    'nav.projects': 'Проекты',
    'nav.careers': 'Вакансии',
    'nav.about': 'О нас',
    'nav.contact': 'Контакты',
    'nav.cta': 'Начать проект',
    
    // Hero
    'hero.title': 'Разрабатываем сайты, мобильные приложения и усиливаем команды',
    'hero.subtitle': 'Apex Digital: IT-партнёр в Астане, ведущий ваш проект от идеи до запуска',
    'hero.cta.primary': 'Обсудить проект',
    'hero.cta.secondary': 'Смотреть проекты',
    'hero.metric.projects': 'проектов',
    'hero.metric.time': 'недель MVP',
    'hero.metric.team': 'Senior команда',
    
    // Services
    'services.title': 'Наши услуги',
    'services.web.title': 'Веб-сайты',
    'services.web.desc': 'Landing, корпоративные, e-commerce, админки. SEO-ready, быстрая загрузка.',
    'services.mobile.title': 'Мобильные приложения',
    'services.mobile.desc': 'iOS/Android приложения. MVP, интеграции, аналитика.',
    'services.staff.title': 'Аутстаффинг IT-специалистов',
    'services.staff.desc': 'Frontend, Backend, Mobile, QA, DevOps, UI/UX. Part-time/Full-time.',
    'services.cta': 'Подробнее',
    
    // Why Apex
    'why.title': 'Почему Apex Digital',
    'why.senior': 'Опытная команда',
    'why.senior.desc': 'Чёткая оценка проекта, чистый код, продуманная архитектура.',
    'why.transparent': 'Прозрачные этапы и сроки',
    'why.transparent.desc': 'Регулярные демо, доступ к прогрессу в реальном времени.',
    'why.design': 'Дизайн для конверсии',
    'why.design.desc': 'UX/UI тестирование, A/B тесты, фокус на метриках.',
    'why.frontend': 'Быстрая загрузка',
    'why.frontend.desc': 'Оптимизация скорости, Core Web Vitals, SEO из коробки.',
    'why.security': 'Безопасность и масштабируемость',
    'why.security.desc': 'Код-ревью, тестирование, готовность к росту нагрузки.',
    'why.support': 'Поддержка после релиза',
    'why.support.desc': 'Техподдержка, доработки, обновления по мере роста продукта.',
    
    // Process
    'process.title': 'Как мы работаем',
    'process.step1': 'Бриф и цели',
    'process.step1.desc': 'Узнаём задачу, аудиторию, цели. 1 день.',
    'process.step2': 'UX/UI прототип',
    'process.step2.desc': 'Интерактивный дизайн в Figma. 3-5 дней.',
    'process.step3': 'Разработка',
    'process.step3.desc': 'Чистый код, регулярные демо. 2-6 недель.',
    'process.step4': 'Тестирование',
    'process.step4.desc': 'QA, баг-фиксы, оптимизация. 3-5 дней.',
    'process.step5': 'Запуск и поддержка',
    'process.step5.desc': 'Деплой, мониторинг, доработки.',
    
    // Projects
    'projects.title': 'Наши проекты',
    'projects.subtitle': 'Реальные кейсы с результатами',
    'projects.filter.all': 'Все',
    'projects.filter.web': 'Web',
    'projects.filter.mobile': 'Mobile',
    'projects.filter.ongoing': 'В работе',
    'projects.search': 'Поиск проектов...',
    'projects.viewCase': 'Открыть кейс',
    'projects.status.done': 'Готово',
    'projects.status.progress': 'В работе',
    'projects.status.discovery': 'Анализ',
    
    // Project Detail
    'projectDetail.back': 'Назад к проектам',
    'projectDetail.notFound': 'Проект не найден',
    'projectDetail.challenge': 'Задача',
    'projectDetail.solution': 'Решение',
    'projectDetail.features': 'Ключевые функции',
    'projectDetail.stack': 'Технологии',
    'projectDetail.gallery': 'Скриншоты',
    'projectDetail.results': 'Результаты',
    'projectDetail.cta.title': 'Хотите похожий проект?',
    'projectDetail.cta.subtitle': 'Расскажите о своей задаче, и мы предложим оптимальное решение',
    'projectDetail.cta.button': 'Обсудить проект',
    
    // Contact Form
    'form.title': 'Оставить заявку',
    'form.subtitle': 'Расскажите о проекте и мы ответим вам в течении 24 часов',
    'form.name': 'Имя',
    'form.company': 'Компания',
    'form.email': 'Email',
    'form.phone': 'Телефон',
    'form.service': 'Тип услуги',
    'form.service.web': 'Веб-сайт',
    'form.service.mobile': 'Мобильное приложение',
    'form.service.staff': 'Аутстаффинг',
    'form.service.other': 'Другое (чат-бот/интеграция/искуственный интеллект и т.д.)',
    'form.budget': 'Бюджет',
    'form.budget.small': '1-3 млн ₸',
    'form.budget.medium': '3-5 млн ₸',
    'form.budget.large': '5-10 млн ₸',
    'form.budget.enterprise': '10+ млн ₸',
    'form.budget.tbd': 'Нужны уточнения',
    'form.timeline': 'Сроки проекта',
    'form.timeline.week': 'Срочно (в пределах двух недель)',
    'form.timeline.twoweeks': '2 недели и больше',
    'form.timeline.month': '1 месяц и больше',
    'form.timeline.twomonths': '2 месяца и больше',
    'form.timeline.threemonths': '3 месяца и больше',
    'form.timeline.sixmonths': '6 месяцев и больше',
    'form.timeline.flexible': 'Гибкий',
    'form.timeline.tbd': 'Нужны уточнения',
    'form.description': 'Краткое описание проекта',
    'form.upload': 'Перетащите файлы',
    'form.upload.hint': 'Краткие скриншоты/видео/файл/архивы проекта, задумки или идеи',
    'form.consent': 'Согласен на обработку данных',
    'form.submit': 'Отправить заявку',
    'form.success': 'Заявка отправлена! Мы свяжемся в течение 24 часов.',
    
    'contact.title': 'Контакты',
    'contact.subtitle': 'Свяжитесь с нами удобным способом',
    'contact.address': 'Астана, Казахстан',
    'contact.phone': '+7 747 226 68 85',
    'contact.phoneLabel': 'Даулет',
    'contact.call': 'Позвонить',
    'contact.telegram': 'Написать в Telegram',
    'contact.hours': 'Часы работы',
    'contact.hours.weekdays': 'Пн-Пт: 9:00 - 18:00',
    'contact.hours.weekend': 'Сб-Вс: выходной',
    
    'about.title': 'О нас',
    'about.mission': 'Наша миссия',
    'about.mission.text': 'Создавать IT-продукты, которые решают реальные бизнес-задачи и приносят ценность пользователям.',
    'about.team': 'Команда',
    'about.founders': 'Основатели',
    
    // Admin
    'admin.login': 'Вход в админ-панель',
    'admin.email': 'Email',
    'admin.password': 'Пароль',
    'admin.submit': 'Войти',
    'admin.forgot': 'Забыли пароль?',
    'admin.adminOnly': 'Только для администраторов',
    
    // Admin Panel
    'admin.dashboard': 'Дашборд',
    'admin.projects': 'Проекты',
    'admin.media': 'Медиатека',
    'admin.submissions': 'Заявки',
    'admin.settings': 'Настройки',
    'admin.logout': 'Выйти',
    'admin.newProject': 'Новый проект',
    'admin.newSubmissions': 'Новых заявок',
    'admin.liveProjects': 'Проектов онлайн',
    'admin.drafts': 'Черновиков',
    
    // Footer
    'footer.slogan': 'Apex Digital разрабатывает надёжные веб-платформы и цифровые решения для бизнеса. Мы превращаем идеи в реальные технологические продукты',
    'footer.navigation': 'Навигация',
    'footer.services': 'Услуги',
    'footer.contacts': 'Контакты',
    'footer.copyright': '© Apex Digital, 2026',
    'footer.policy': 'Политика конфиденциальности',
    'footer.terms': 'Условия использования',
  },
  
  kz: {
    // Navigation
    'nav.home': 'Басты бет',
    'nav.services': 'Қызметтер',
    'nav.projects': 'Жобалар',
    'nav.careers': 'Жұмыс орны',
    'nav.about': 'Біз туралы',
    'nav.contact': 'Байланыс',
    'nav.cta': 'Өтінім қалдыру',
    
    // Hero
    'hero.title': 'Сайттар, мобильді қосымшалар жасап, командаларды күшейтеміз',
    'hero.subtitle': 'Apex Digital: Астанадағы IT серіктес, сізге проектіңізді идеядан іске қосуға дейін көмектеседі',
    'hero.cta.primary': 'Жобаны талқылау',
    'hero.cta.secondary': 'Жобаларды қарау',
    'hero.metric.projects': 'жоба',
    'hero.metric.time': 'апта MVP',
    'hero.metric.team': 'Senior команда',
    
    // Services
    'services.title': 'Біздің қызметтер',
    'services.web.title': 'Веб-сайттар',
    'services.web.desc': 'Landing, корпоративтік, e-commerce, админкалар. SEO-дайын, жылдам жүктеу.',
    'services.mobile.title': 'Мобильді қосымшалар',
    'services.mobile.desc': 'iOS/Android қосымшалары. MVP, интеграциялар, аналитика.',
    'services.staff.title': 'IT мамандарын аутстаффинг',
    'services.staff.desc': 'Frontend, Backend, Mobile, QA, DevOps, UI/UX. Part-time/Full-time.',
    'services.cta': 'Толығырақ',
    
    // Why Apex
    'why.title': 'Неліктен Apex Digital',
    'why.senior': 'Опытная команда',
    'why.senior.desc': 'Чёткая оценка проекта, чистый код, продуманная архитектура.',
    'why.transparent': 'Прозрачные этапы и сроки',
    'why.transparent.desc': 'Регулярные демо, доступ к прогрессу в реальном времени.',
    'why.design': 'Дизайн для конверсии',
    'why.design.desc': 'UX/UI тестирование, A/B тесты, фокус на метриках.',
    'why.frontend': 'Быстрая загрузка',
    'why.frontend.desc': 'Оптимизация скорости, Core Web Vitals, SEO из коробки.',
    'why.security': 'Безопасность и масштабируемость',
    'why.security.desc': 'Код-ревью, тестирование, готовность к росту нагрузки.',
    'why.support': 'Поддержка после релиза',
    'why.support.desc': 'Техподдержка, доработки, обновления по мере роста продукта.',
    
    // Process
    'process.title': 'Біз қалай жұмыс істейміз',
    'process.step1': 'Бриф және мақсаттар',
    'process.step1.desc': 'Тапсырма, аудитория, мақсаттарды білеміз. 1 күн.',
    'process.step2': 'UX/UI прототип',
    'process.step2.desc': 'Figma-да интерактивті дизайн. 3-5 күн.',
    'process.step3': 'Әзірлеу',
    'process.step3.desc': 'Таза код, үнемі демо. 2-6 апта.',
    'process.step4': 'Тестілеу',
    'process.step4.desc': 'QA, қателерді түзету, оптимизация. 3-5 күн.',
    'process.step5': 'Іске қосу және қолдау',
    'process.step5.desc': 'Деплой, мониторинг, өңдеулер.',
    
    // Projects
    'projects.title': 'Біздің жобалар',
    'projects.subtitle': 'Нәтижелері бар нақты кейстер',
    'projects.filter.all': 'Барлығы',
    'projects.filter.web': 'Web',
    'projects.filter.mobile': 'Mobile',
    'projects.filter.ongoing': 'Жұмыста',
    'projects.search': 'Жобаларды іздеу...',
    'projects.viewCase': 'Кейсті ашу',
    'projects.status.done': 'Дайын',
    'projects.status.progress': 'Жұмыста',
    'projects.status.discovery': 'Талдау',
    
    // Project Detail
    'projectDetail.back': 'Жобаларға қайту',
    'projectDetail.notFound': 'Жоба табылмады',
    'projectDetail.challenge': 'Тапсырма',
    'projectDetail.solution': 'ешім',
    'projectDetail.features': 'Негізгі функциялар',
    'projectDetail.stack': 'Технологиялар',
    'projectDetail.gallery': 'Скриншоттар',
    'projectDetail.results': 'Нәтижелер',
    'projectDetail.cta.title': 'Оқишауыңызға сәйкес жоба қажет?',
    'projectDetail.cta.subtitle': 'Тапсырманызды айтсаңыз, біз оптималды шешім тапамыз',
    'projectDetail.cta.button': 'Жобаны талқылау',
    
    // Contact Form
    'form.title': 'Өтінім қалдыру',
    'form.subtitle': 'Жобаңыз туралы айтыңыз, 24 сағат ішінде жауап береміз',
    'form.name': 'Аты',
    'form.company': 'Компания',
    'form.email': 'Email',
    'form.phone': 'Телефон',
    'form.service': 'Қызмет түрі',
    'form.service.web': 'Веб-сайт',
    'form.service.mobile': 'Мобильді қосымша',
    'form.service.staff': 'Аутстаффинг',
    'form.service.other': 'Басқа',
    'form.budget': 'Бюджет',
    'form.budget.small': '1-3 млн ₸',
    'form.budget.medium': '3-5 млн ₸',
    'form.budget.large': '5-10 млн ₸',
    'form.budget.enterprise': '10+ млн ₸',
    'form.budget.tbd': 'Нақтылау қажет',
    'form.timeline': 'Timeline',
    'form.timeline.week': '1 week',
    'form.timeline.twoweeks': '2 weeks',
    'form.timeline.month': '1 month',
    'form.timeline.twomonths': '2 months',
    'form.timeline.threemonths': '3 months',
    'form.timeline.sixmonths': '6 months',
    'form.timeline.flexible': 'Икемді',
    'form.timeline.tbd': 'Need Clarification',
    'form.description': 'Жоба сипаттамасы',
    'form.upload': 'Файлдарды тіркеу',
    'form.upload.hint': 'ТТ, скриншоттар, бейне, мұрағаттар. 100MB дейін.',
    'form.consent': 'Деректерді өңдеуге к��лісемін',
    'form.submit': 'Өтінімді жіберу',
    'form.success': 'Өтінім жіберілді! 24 сағат ішінде хабарласамыз.',
    
    // Contact
    'contact.title': 'Байланыс',
    'contact.subtitle': 'Бізбен ыңғайлы тәсілмен хабарласыңыз',
    'contact.address': 'Астана, Қазақстан',
    'contact.phone': '+7 747 226 68 85',
    'contact.phoneLabel': 'Дәулет',
    'contact.call': 'Қоңырау шалу',
    'contact.telegram': 'Telegram-ға жазу',
    'contact.hours': 'Жұмыс уақыты',
    'contact.hours.weekdays': 'Дс-Жм: 9:00 - 18:00',
    'contact.hours.weekend': 'Сн-Жк: демалыс',
    
    // About
    'about.title': 'Біз туралы',
    'about.mission': 'Біздің миссия',
    'about.mission.text': 'Нақты бизнес міндеттерін шешетін және пайдаланушыларға құндылық әкелетін IT өнімдерін жасау.',
    'about.team': 'Команда',
    'about.founders': 'Негізін қалаушылар',
    
    // Admin
    'admin.login': 'Админ-панельге кіру',
    'admin.email': 'Email',
    'admin.password': 'Пароль',
    'admin.submit': 'Кіру',
    'admin.forgot': 'Парольді ұмыттыңыз ба?',
    'admin.adminOnly': 'Тек әкімшілерге арналған',
    
    // Admin Panel
    'admin.dashboard': 'Дашборд',
    'admin.projects': 'Жобалар',
    'admin.media': 'Медиатека',
    'admin.submissions': 'Өтінімдер',
    'admin.settings': 'Баптаулар',
    'admin.logout': 'Шығу',
    'admin.newProject': 'Жаңа жоба',
    'admin.newSubmissions': 'Жаңа өтінімдер',
    'admin.liveProjects': 'Онлайн жобалар',
    'admin.drafts': 'Жобалаулар',
    
    // Footer
    'footer.slogan': 'Apex Digital бизнес үшін сенімді веб-платформалар мен цифрлық шешімдерді әзірлейді. Біз идеяларды нақты технологиялық өнімдерге айналдырамыз.',
    'footer.navigation': 'Навигация',
    'footer.services': 'Қызметтер',
    'footer.contacts': 'Байланыс',
    'footer.copyright': '© Apex Digital, 2026',
    'footer.policy': 'Құпиялылық саясаты',
    'footer.terms': 'Пайдалану шарттары',
  },
  
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.projects': 'Projects',
    'nav.careers': 'Careers',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cta': 'Get Started',
    
    // Hero
    'hero.title': 'We build websites, mobile apps, and strengthen engineering teams',
    'hero.subtitle': 'Apex Digital is your IT partner in Astana: from idea to launch',
    'hero.cta.primary': 'Discuss Project',
    'hero.cta.secondary': 'View Projects',
    'hero.metric.projects': 'projects',
    'hero.metric.time': 'weeks MVP',
    'hero.metric.team': 'Senior team',
    
    // Services
    'services.title': 'Our Services',
    'services.web.title': 'Web Development',
    'services.web.desc': 'Landing pages, corporate sites, e-commerce, admin panels. SEO-ready, fast loading.',
    'services.mobile.title': 'Mobile Applications',
    'services.mobile.desc': 'iOS/Android apps. MVP, integrations, analytics.',
    'services.staff.title': 'IT Staff Augmentation',
    'services.staff.desc': 'Frontend, Backend, Mobile, QA, DevOps, UI/UX. Part-time/Full-time.',
    'services.cta': 'Learn More',
    
    // Why Apex
    'why.title': 'Why Apex Digital',
    'why.senior': 'Experienced Team',
    'why.senior.desc': 'Clear project assessment, clean code, thoughtful architecture.',
    'why.transparent': 'Transparent Stages and Deadlines',
    'why.transparent.desc': 'Regular demos, real-time progress access.',
    'why.design': 'Conversion-focused Design',
    'why.design.desc': 'UX/UI testing, A/B tests, focus on metrics.',
    'why.frontend': 'Fast Loading',
    'why.frontend.desc': 'Speed optimization, Core Web Vitals, SEO out of the box.',
    'why.security': 'Security and Scalability',
    'why.security.desc': 'Code review, testing, ready for growth.',
    'why.support': 'Post-release Support',
    'why.support.desc': 'Tech support, improvements, updates as the product grows.',
    
    // Process
    'process.title': 'How We Work',
    'process.step1': 'Brief and Goals',
    'process.step1.desc': 'Learn about task, audience, goals. 1 day.',
    'process.step2': 'UX/UI Prototype',
    'process.step2.desc': 'Interactive design in Figma. 3-5 days.',
    'process.step3': 'Development',
    'process.step3.desc': 'Clean code, regular demos. 2-6 weeks.',
    'process.step4': 'Testing',
    'process.step4.desc': 'QA, bug fixes, optimization. 3-5 days.',
    'process.step5': 'Launch and Support',
    'process.step5.desc': 'Deploy, monitoring, improvements.',
    
    // Projects
    'projects.title': 'Our Projects',
    'projects.subtitle': 'Real cases with results',
    'projects.filter.all': 'All',
    'projects.filter.web': 'Web',
    'projects.filter.mobile': 'Mobile',
    'projects.filter.ongoing': 'Ongoing',
    'projects.search': 'Search projects...',
    'projects.viewCase': 'View Case',
    'projects.status.done': 'Done',
    'projects.status.progress': 'In Progress',
    'projects.status.discovery': 'Discovery',
    
    // Project Detail
    'projectDetail.back': 'Back to Projects',
    'projectDetail.notFound': 'Project not found',
    'projectDetail.challenge': 'Challenge',
    'projectDetail.solution': 'Solution',
    'projectDetail.features': 'Key Features',
    'projectDetail.stack': 'Technologies',
    'projectDetail.gallery': 'Screenshots',
    'projectDetail.results': 'Results',
    'projectDetail.cta.title': 'Want a similar project?',
    'projectDetail.cta.subtitle': 'Tell us about your challenge, and we\'ll propose an optimal solution',
    'projectDetail.cta.button': 'Discuss Project',
    
    // Contact Form
    'form.title': 'Get Started',
    'form.subtitle': 'Tell us about your project, we\'ll respond within 24 hours',
    'form.name': 'Name',
    'form.company': 'Company',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.service': 'Service Type',
    'form.service.web': 'Website',
    'form.service.mobile': 'Mobile App',
    'form.service.staff': 'Staff Augmentation',
    'form.service.other': 'Other',
    'form.budget': 'Budget',
    'form.budget.small': 'Up to $5,000',
    'form.budget.medium': '$5,000 - $15,000',
    'form.budget.large': '$15,000 - $50,000',
    'form.budget.enterprise': '$50,000+',
    'form.budget.tbd': 'Need Clarification',
    'form.timeline': 'Timeline',
    'form.timeline.week': '1 week',
    'form.timeline.twoweeks': '2 weeks',
    'form.timeline.month': '1 month',
    'form.timeline.twomonths': '2 months',
    'form.timeline.threemonths': '3 months',
    'form.timeline.sixmonths': '6 months',
    'form.timeline.flexible': 'Flexible',
    'form.timeline.tbd': 'Need Clarification',
    'form.description': 'Project Description',
    'form.upload': 'Attach Files',
    'form.upload.hint': 'Brief, screenshots, videos, archives. Up to 100MB.',
    'form.consent': 'I agree to data processing',
    'form.submit': 'Submit Request',
    'form.success': 'Request submitted! We\'ll contact you within 24 hours.',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch the way you prefer',
    'contact.address': 'Astana, Kazakhstan',
    'contact.phone': '+7 747 226 68 85',
    'contact.phoneLabel': 'Daulet',
    'contact.call': 'Call Us',
    'contact.telegram': 'Message on Telegram',
    'contact.hours': 'Working Hours',
    'contact.hours.weekdays': 'Mon-Fri: 9:00 AM - 6:00 PM',
    'contact.hours.weekend': 'Sat-Sun: Closed',
    
    // About
    'about.title': 'About Us',
    'about.mission': 'Our Mission',
    'about.mission.text': 'Create IT products that solve real business challenges and bring value to users.',
    'about.team': 'Team',
    'about.founders': 'Founders',
    
    // Admin
    'admin.login': 'Admin Login',
    'admin.email': 'Email',
    'admin.password': 'Password',
    'admin.submit': 'Sign In',
    'admin.forgot': 'Forgot password?',
    'admin.adminOnly': 'Admin Only',
    
    // Admin Panel
    'admin.dashboard': 'Dashboard',
    'admin.projects': 'Projects',
    'admin.media': 'Media Library',
    'admin.submissions': 'Submissions',
    'admin.settings': 'Settings',
    'admin.logout': 'Logout',
    'admin.newProject': 'New Project',
    'admin.newSubmissions': 'New Submissions',
    'admin.liveProjects': 'Live Projects',
    'admin.drafts': 'Drafts',
    
    // Footer
    'footer.slogan': 'Apex Digital develops robust web platforms and digital solutions for businesses. We transform ideas into tangible technology products',
    'footer.navigation': 'Navigation',
    'footer.services': 'Services',
    'footer.contacts': 'Contacts',
    'footer.copyright': '© Apex Digital, 2026',
    'footer.policy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}