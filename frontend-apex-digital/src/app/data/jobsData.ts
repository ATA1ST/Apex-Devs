// Types for Jobs Module
export interface Job {
  id: string;
  slug: string;
  title: {
    ru: string;
    kz: string;
    en: string;
  };
  shortDescription: {
    ru: string;
    kz: string;
    en: string;
  };
  requirements: Array<{
    ru: string;
    kz: string;
    en: string;
  }>;
  postedDate: string;
  department: 'dev' | 'design' | 'pm' | 'other';
  location: 'astana' | 'remote' | 'hybrid';
  employmentType: 'full-time' | 'part-time' | 'contract';
  status: 'draft' | 'published' | 'closed';
  isVisible: boolean; // Visibility for end users
  description: {
    ru: {
      role: string;
      tasks: string[];
      requirements: string[];
      plusPoints: string[];
      conditions: string[];
    };
    kz: {
      role: string;
      tasks: string[];
      requirements: string[];
      plusPoints: string[];
      conditions: string[];
    };
    en: {
      role: string;
      tasks: string[];
      requirements: string[];
      plusPoints: string[];
      conditions: string[];
    };
  };
  stack?: string[];
  views: number;
  applicants: number;
  publishedAt?: string;
  updatedAt: string;
}

export interface Applicant {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone?: string;
  links?: string;
  message?: string;
  resumeFile?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
  status: 'new' | 'reviewed' | 'rejected' | 'invited';
  note?: string;
  appliedAt: string;
}

// Mock Jobs Data
export const mockJobs: Job[] = [
  {
    id: '1',
    slug: 'senior-frontend-developer',
    title: {
      ru: 'Senior Frontend Developer',
      kz: 'Senior Frontend әзірлеуші',
      en: 'Senior Frontend Developer',
    },
    shortDescription: {
      ru: 'Мы ищем опытного Frontend-разработчика для работы над крупными web-приложениями. Вы будете проектировать архитектуру, разрабатывать новые функции и улучшать производительность.',
      kz: 'Біз ірі веб-қосымшалармен жұмыс істеу үшін тәжірибелі Frontend әзірлеушіні іздеп жатырмыз. Сіз архитектураны жобалайсыз, жаңа функциялар әзірлейсіз және өнімділікті жақсартасыз.',
      en: 'We are looking for an experienced Frontend Developer to work on large-scale web applications. You will design architecture, develop new features, and improve performance.',
    },
    requirements: [
      {
        ru: '4+ года опыта в frontend-разработке',
        kz: 'Frontend әзірлеуде 4+ жыл тәжірибе',
        en: '4+ years of frontend development experience',
      },
      {
        ru: 'Глубокое знание React, TypeScript, Next.js',
        kz: 'React, TypeScript, Next.js терең білімі',
        en: 'Deep knowledge of React, TypeScript, Next.js',
      },
      {
        ru: 'Опыт работы с state management (Redux, Zustand)',
        kz: 'State management тәжірибесі (Redux, Zustand)',
        en: 'Experience with state management (Redux, Zustand)',
      },
      {
        ru: 'Понимание принципов чистой архитектуры',
        kz: 'Таза архитектура принциптерін түсіну',
        en: 'Understanding of clean architecture principles',
      },
      {
        ru: 'Знание CSS/Tailwind, адаптивной вёрстки',
        kz: 'CSS/Tailwind, адаптивті верстка білімі',
        en: 'Knowledge of CSS/Tailwind, responsive design',
      },
      {
        ru: 'Опыт оптимизации производительности',
        kz: 'Өнімділікті оңтайландыру тәжірибесі',
        en: 'Performance optimization experience',
      },
    ],
    postedDate: '2025-03-01',
    department: 'dev',
    location: 'hybrid',
    employmentType: 'full-time',
    status: 'published',
    isVisible: true,
    description: {
      ru: {
        role: 'Мы ищем опытного Frontend-разработчика для работы над крупными web-приложениями. Вы будете проектировать архитектуру, разрабатывать новые функции и улучшать производительность.',
        tasks: [
          'Разработка сложных интерфейсов на React и TypeScript',
          'Проектирование архитектуры frontend-приложений',
          'Оптимизация производительности и Core Web Vitals',
          'Code review и менторинг junior разработчиков',
          'Интеграция с REST API и GraphQL',
          'Написание unit и integration тестов',
        ],
        requirements: [
          '4+ года опыта в frontend-разработке',
          'Глубокое знание React, TypeScript, Next.js',
          'Опыт работы с state management (Redux, Zustand)',
          'Понимание принципов чистой архитектуры',
          'Знание CSS/Tailwind, адаптивной вёрстки',
          'Опыт оптимизации производительности',
        ],
        plusPoints: [
          'Опыт работы с GraphQL и Apollo Client',
          'Знание Node.js и backend-разработки',
          'Опыт внедрения CI/CD',
          'Participation в open source проектах',
        ],
        conditions: [
          'Гибкий график работы',
          'Hybrid формат (офис в Астане + удалёнка)',
          'Конкурентная зарплата',
          'Работа над крупными проектами',
          'Обучение и профессиональный рост',
          'Современный стек технологий',
        ],
      },
      kz: {
        role: 'Біз ірі веб-қосымшалармен жұмыс істеу үшін тәжірибелі Frontend әзірлеушіні іздеп жатырмыз. Сіз архитектураны жобалайсыз, жаңа функциялар әзірлейсіз және өнімділікті жақсартасыз.',
        tasks: [
          'React және TypeScript арқылы күрделі интерфейстерді әзірлеу',
          'Frontend қосымшаларының архитектурасын жобалау',
          'Өнімділікті және Core Web Vitals оңтайландыру',
          'Code review және junior әзірлеушілерге менторинг',
          'REST API және GraphQL интеграциясы',
          'Unit және integration тесттерін жазу',
        ],
        requirements: [
          'Frontend әзірлеуде 4+ жыл тәжірибе',
          'React, TypeScript, Next.js терең білімі',
          'State management тәжірибесі (Redux, Zustand)',
          'Таза архитектура принциптерін түсіну',
          'CSS/Tailwind, адаптивті верстка білімі',
          'Өнімділікті оңтайландыру тәжірибесі',
        ],
        plusPoints: [
          'GraphQL және Apollo Client тәжірибесі',
          'Node.js және backend әзірлеу білімі',
          'CI/CD енгізу тәжірибесі',
          'Open source жобаларға қатысу',
        ],
        conditions: [
          'Икемді жұмыс кестесі',
          'Hybrid формат (Астанадағы офис + қашықтан)',
          'Бәсекеге қабілетті жалақы',
          'Ірі жобалармен жұмыс',
          'Оқу және кәсіби өсу',
          'Заманауи технологиялар стегі',
        ],
      },
      en: {
        role: 'We are looking for an experienced Frontend Developer to work on large-scale web applications. You will design architecture, develop new features, and improve performance.',
        tasks: [
          'Develop complex interfaces with React and TypeScript',
          'Design frontend application architecture',
          'Optimize performance and Core Web Vitals',
          'Code review and mentoring junior developers',
          'Integration with REST API and GraphQL',
          'Write unit and integration tests',
        ],
        requirements: [
          '4+ years of frontend development experience',
          'Deep knowledge of React, TypeScript, Next.js',
          'Experience with state management (Redux, Zustand)',
          'Understanding of clean architecture principles',
          'Knowledge of CSS/Tailwind, responsive design',
          'Performance optimization experience',
        ],
        plusPoints: [
          'Experience with GraphQL and Apollo Client',
          'Knowledge of Node.js and backend development',
          'CI/CD implementation experience',
          'Open source project participation',
        ],
        conditions: [
          'Flexible work schedule',
          'Hybrid format (Astana office + remote)',
          'Competitive salary',
          'Work on large-scale projects',
          'Learning and professional growth',
          'Modern technology stack',
        ],
      },
    },
    stack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL'],
    views: 142,
    applicants: 8,
    publishedAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z',
  },
  {
    id: '2',
    slug: 'ux-ui-designer',
    title: {
      ru: 'UX/UI Designer',
      kz: 'UX/UI дизайнер',
      en: 'UX/UI Designer',
    },
    shortDescription: {
      ru: 'Ищем дизайнера с сильными навыками UX/UI для работы над интерфейсами web и mobile приложений. Вы будете создавать дизайн-системы, прототипировать и тестировать решения.',
      kz: 'Біз веб және мобильді қосымшалар интерфейстерімен жұмыс істеу үшін күшті UX/UI дағдыларымен дизайнерді іздейміз. Сіз дизайн жүйелерін жасайсыз, прототиптейсіз және шешімдерді тестілейсіз.',
      en: 'Looking for a designer with strong UX/UI skills to work on web and mobile application interfaces. You will create design systems, prototype and test solutions.',
    },
    requirements: [
      {
        ru: '3+ года опыта в UX/UI дизайне',
        kz: 'UX/UI дизайнда 3+ жыл тәжірибе',
        en: '3+ years of UX/UI design experience',
      },
      {
        ru: 'Отличное владение Figma',
        kz: 'Figma өте жақсы меңгеру',
        en: 'Excellent knowledge of Figma',
      },
      {
        ru: 'Портфолио с реализованными проектами',
        kz: 'Іске асырылған жобалармен портфолио',
        en: 'Portfolio with implemented projects',
      },
      {
        ru: 'Понимание принципов UX и информационной архитектуры',
        kz: 'UX және ақпараттық архитектура принциптерін түсіну',
        en: 'Understanding of UX and information architecture principles',
      },
      {
        ru: 'Опыт создания дизайн-систем',
        kz: 'Дизайн жүйелерін жасау тәжірибесі',
        en: 'Experience creating design systems',
      },
      {
        ru: 'Знание HTML/CSS на базовом уровне',
        kz: 'HTML/CSS базалық деңгейде білу',
        en: 'Basic knowledge of HTML/CSS',
      },
    ],
    postedDate: '2025-03-05',
    department: 'design',
    location: 'astana',
    employmentType: 'full-time',
    status: 'published',
    isVisible: true,
    description: {
      ru: {
        role: 'Ищем дизайнера с сильными навыками UX/UI для работы над интерфейсами web и mobile приложений. Вы будете создавать дизайн-системы, прототипировать и тестировать решения.',
        tasks: [
          'Проектирование пользовательских интерфейсов',
          'Создание wireframes, прототипов и mockups',
          'Разработка и поддержка дизайн-систем',
          'Проведение UX-исследований и тестирования',
          'Работа в связке с frontend-разработчиками',
          'Создание адаптивных дизайнов для разных устройств',
        ],
        requirements: [
          '3+ года опыта в UX/UI дизайне',
          'Отличное владение Figma',
          'Портфолио с реализованными проектами',
          'Понимание принципов UX и информационной архитектуры',
          'Опыт создания дизайн-систем',
          'Знание HTML/CSS на базовом уровне',
        ],
        plusPoints: [
          'Опыт работы с анимациями и микровзаимодействиями',
          'Знание Principle, ProtoPie или After Effects',
          'Опыт A/B тестирования',
        ],
        conditions: [
          'Офис в центре Астаны',
          'Работа над разнообразными проектами',
          'Конкурентная зарплата',
          'Доступ к современным инструментам',
          'Профессиональное развитие',
        ],
      },
      kz: {
        role: 'Біз веб және мобильді қосымшалар интерфейстерімен жұмыс істеу үшін күшті UX/UI дағдыларымен дизайнерді іздейміз. Сіз дизайн жүйелерін жасайсыз, прототиптейсіз және шешімдерді тестілейсіз.',
        tasks: [
          'Пайдаланушы интерфейстерін жобалау',
          'Wireframes, прототиптер және mockups жасау',
          'Дизайн жүйелерін әзірлеу және қолдау',
          'UX зерттеулер мен тестілеуді жүргізу',
          'Frontend әзірлеушілермен жұмыс',
          'Әртүрлі құрылғыларға адаптивті дизайндар жасау',
        ],
        requirements: [
          'UX/UI дизайнда 3+ жыл тәжірибе',
          'Figma өте жақсы меңгеру',
          'Іске асырылған жобалармен портфолио',
          'UX және ақпараттық архитектура принциптерін түсіну',
          'Дизайн жүйелерін жасау тәжірибесі',
          'HTML/CSS базалық деңгейде білу',
        ],
        plusPoints: [
          'Анимациялар және микроөзара әрекеттесулермен жұмыс тәжірибесі',
          'Principle, ProtoPie немесе After Effects білімі',
          'A/B тестілеу тәжірибесі',
        ],
        conditions: [
          'Астана орталығындағы офис',
          'Әртүрлі жобалармен жұмыс',
          'Бәсекеге қабілетті жалақы',
          'Заманауи құралдарға қол жеткізу',
          'Кәсіби даму',
        ],
      },
      en: {
        role: 'Looking for a designer with strong UX/UI skills to work on web and mobile application interfaces. You will create design systems, prototype and test solutions.',
        tasks: [
          'Design user interfaces',
          'Create wireframes, prototypes and mockups',
          'Develop and maintain design systems',
          'Conduct UX research and testing',
          'Work closely with frontend developers',
          'Create responsive designs for different devices',
        ],
        requirements: [
          '3+ years of UX/UI design experience',
          'Excellent knowledge of Figma',
          'Portfolio with implemented projects',
          'Understanding of UX and information architecture principles',
          'Experience creating design systems',
          'Basic knowledge of HTML/CSS',
        ],
        plusPoints: [
          'Experience with animations and micro-interactions',
          'Knowledge of Principle, ProtoPie or After Effects',
          'A/B testing experience',
        ],
        conditions: [
          'Office in the center of Astana',
          'Work on diverse projects',
          'Competitive salary',
          'Access to modern tools',
          'Professional development',
        ],
      },
    },
    stack: ['Figma', 'Adobe XD', 'Sketch', 'Principle'],
    views: 89,
    applicants: 5,
    publishedAt: '2025-03-05T14:00:00Z',
    updatedAt: '2025-03-05T14:00:00Z',
  },
];

// Mock Applicants Data
export const mockApplicants: Applicant[] = [];

// Jobs Storage Manager (localStorage + in-memory)
class JobsStorage {
  private jobs: Job[] = [];
  private applicants: Applicant[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedJobs = localStorage.getItem('apex_jobs');
      const savedApplicants = localStorage.getItem('apex_applicants');
      
      this.jobs = savedJobs ? JSON.parse(savedJobs) : [...mockJobs];
      this.applicants = savedApplicants ? JSON.parse(savedApplicants) : [...mockApplicants];
    } catch (e) {
      this.jobs = [...mockJobs];
      this.applicants = [...mockApplicants];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('apex_jobs', JSON.stringify(this.jobs));
      localStorage.setItem('apex_applicants', JSON.stringify(this.applicants));
    } catch (e) {
      console.error('Failed to save to storage');
    }
  }

  // Jobs CRUD
  getAllJobs(): Job[] {
    return [...this.jobs];
  }

  getPublishedJobs(): Job[] {
    return this.jobs.filter(job => job.status === 'published');
  }

  getVisibleJobs(): Job[] {
    return this.jobs.filter(job => job.status === 'published' && job.isVisible);
  }

  getJobById(id: string): Job | undefined {
    return this.jobs.find(job => job.id === id);
  }

  getJobBySlug(slug: string): Job | undefined {
    return this.jobs.find(job => job.slug === slug);
  }

  createJob(job: Omit<Job, 'id' | 'views' | 'applicants' | 'updatedAt'>): Job {
    const newJob: Job = {
      ...job,
      id: Date.now().toString(),
      views: 0,
      applicants: 0,
      updatedAt: new Date().toISOString(),
    };
    this.jobs.push(newJob);
    this.saveToStorage();
    return newJob;
  }

  updateJob(id: string, updates: Partial<Job>): Job | undefined {
    const index = this.jobs.findIndex(job => job.id === id);
    if (index === -1) return undefined;

    this.jobs[index] = {
      ...this.jobs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToStorage();
    return this.jobs[index];
  }

  deleteJob(id: string): boolean {
    const index = this.jobs.findIndex(job => job.id === id);
    if (index === -1) return false;

    this.jobs.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  incrementViews(jobId: string): void {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.views++;
      this.saveToStorage();
    }
  }

  incrementApplicants(jobId: string): void {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.applicants++;
      this.saveToStorage();
    }
  }

  // Applicants CRUD
  getAllApplicants(): Applicant[] {
    return [...this.applicants];
  }

  getApplicantsByJob(jobId: string): Applicant[] {
    return this.applicants.filter(app => app.jobId === jobId);
  }

  createApplicant(applicant: Omit<Applicant, 'id' | 'appliedAt' | 'status'>): Applicant {
    const newApplicant: Applicant = {
      ...applicant,
      id: Date.now().toString(),
      status: 'new',
      appliedAt: new Date().toISOString(),
    };
    this.applicants.push(newApplicant);
    this.incrementApplicants(applicant.jobId);
    this.saveToStorage();
    return newApplicant;
  }

  updateApplicant(id: string, updates: Partial<Applicant>): Applicant | undefined {
    const index = this.applicants.findIndex(app => app.id === id);
    if (index === -1) return undefined;

    this.applicants[index] = {
      ...this.applicants[index],
      ...updates,
    };
    this.saveToStorage();
    return this.applicants[index];
  }

  deleteApplicant(id: string): boolean {
    const index = this.applicants.findIndex(app => app.id === id);
    if (index === -1) return false;

    this.applicants.splice(index, 1);
    this.saveToStorage();
    return true;
  }
}

export const jobsStorage = new JobsStorage();