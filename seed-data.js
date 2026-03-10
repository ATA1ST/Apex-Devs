// seed-data.js
// Run: mongosh apex_digital seed-data.js
// Or: mongosh "mongodb://localhost:27017/apex_digital" seed-data.js
//
// This script inserts the mock data from the frontend into MongoDB
// so you don't have to recreate everything manually.

db = db.getSiblingDB('apex_digital');

// ========== PROJECTS ==========
print("Seeding projects...");
db.projects.deleteMany({});
db.projects.insertMany([
  {
    slug: "academic-management-platform",
    title: { ru: "Academic Management Platform", kz: "Academic Management Platform", en: "Academic Management Platform" },
    description: {
      ru: "Цифровая платформа для управления учебным процессом с умными функциями и AI-интеграцией",
      kz: "Ақылды функциялар мен AI интеграциясы бар оқу процесін басқаруға арналған цифрлық платформа",
      en: "Digital platform for academic management with smart features and AI integration"
    },
    fullDescription: {
      ru: "Современная LMS-система нового поколения для образовательных учреждений",
      kz: "Білім беру мекемелеріне арналған жаңа буын заманауи LMS жүйесі",
      en: "Next-generation LMS system for educational institutions"
    },
    category: "web", status: "progress",
    tags: ["Web", "EdTech", "AI", "SaaS"],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop"
    ],
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Python", "OpenAI API"],
    isVisible: true,
    timeline: { ru: "6 месяцев разработки", kz: "6 ай әзірлеу", en: "6 months development" },
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    slug: "enterprise-hr-platform",
    title: { ru: "Enterprise HR Platform", kz: "Enterprise HR Platform", en: "Enterprise HR Platform" },
    description: {
      ru: "Корпоративная платформа для управления персоналом с автоматизацией HR-процессов",
      kz: "HR процестерін автоматтандырумен персоналды басқаруға арналған корпоративтік платформа",
      en: "Corporate platform for employee management with HR process automation"
    },
    category: "web", status: "progress",
    tags: ["Web", "Enterprise", "HR", "SaaS"],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
    stack: ["Angular", "TypeScript", "Java", "Spring Boot", "PostgreSQL", "Docker"],
    isVisible: true,
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    slug: "sport-subscription-app",
    title: { ru: "Sport Subscription App", kz: "Sport Subscription App", en: "Sport Subscription App" },
    description: {
      ru: "Приложение для персонализированных спортивных подписок с гибкими планами",
      kz: "Икемді жоспарлары бар жекелендірілген спорттық жазылымдарға арналған қосымша",
      en: "App for personalized sport subscriptions with flexible plans"
    },
    category: "mobile", status: "progress",
    tags: ["Mobile", "Sport", "Subscription"],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
    stack: ["React Native", "TypeScript", "Node.js", "MongoDB", "Stripe"],
    isVisible: true,
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    slug: "idaryn-science-fair",
    title: { ru: "iDaryn — Digital Platform", kz: "iDaryn — Цифрлық платформа", en: "iDaryn — Digital Platform" },
    description: {
      ru: "Цифровая платформа для школьной научной ярмарки в Казахстане",
      kz: "Қазақстандағы мектеп ғылыми жәрмеңкесіне арналған цифрлық платформа",
      en: "Digital platform for school science fair in Kazakhstan"
    },
    category: "web", status: "progress",
    tags: ["Web", "EdTech", "Gov"],
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
    stack: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    isVisible: true,
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    slug: "seven-business-center",
    title: { ru: "Seven Business Center", kz: "Seven Business Center", en: "Seven Business Center" },
    description: {
      ru: "Корпоративный сайт для аренды офисных помещений и жилья в Астане",
      kz: "Астанадағы кеңсе үй-жайларын және тұрғын үйді жалға алуға арналған корпоративтік сайт",
      en: "Corporate website for renting office space and housing in Astana"
    },
    category: "web", status: "progress",
    tags: ["Web", "PropTech", "Corporate"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    stack: ["React", "Next.js", "TypeScript", "Three.js", "PostgreSQL"],
    isVisible: true,
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    slug: "seriestok",
    title: { ru: "SeriesTok — TikTok для сериалов", kz: "SeriesTok — Сериалдарға арналған TikTok", en: "SeriesTok — TikTok for TV Series" },
    description: {
      ru: "Мобильное приложение с короткими клипами из сериалов",
      kz: "Сериалдардан қысқа клиптері бар мобильді қосымша",
      en: "Mobile app with short clips from TV series"
    },
    category: "mobile", status: "done",
    tags: ["Mobile", "Social", "Entertainment"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
    stack: ["React Native", "TypeScript", "Node.js", "MongoDB", "FFmpeg", "AWS"],
    results: { ru: "10K+ скачиваний в первый месяц", kz: "Бірінші айда 10K+ жүктеу", en: "10K+ downloads in first month" },
    isVisible: true,
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    slug: "ktzh-chatbot",
    title: { ru: "Chat-bot для КТЖ", kz: "ҚТЖ үшін чат-бот", en: "Chat-bot for Kazakhstan Railways" },
    description: {
      ru: "Интеллектуальный чат-бот для Kazakhstan Temir Zholy",
      kz: "Қазақстан Темір Жолына арналған интеллектуалды чат-бот",
      en: "Intelligent chat-bot for Kazakhstan Temir Zholy"
    },
    category: "web", status: "done",
    tags: ["AI", "ChatBot", "Gov"],
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop",
    stack: ["Python", "Django", "NLU", "PostgreSQL", "Telegram Bot API"],
    results: { ru: "60% снижение нагрузки на колл-центр", kz: "Колл-орталыққа жүктемені 60% азайту", en: "60% reduction in call center load" },
    isVisible: true,
    createdAt: new Date(), updatedAt: new Date()
  }
]);
print("Projects seeded: " + db.projects.countDocuments());

// ========== JOBS ==========
print("Seeding jobs...");
db.jobs.deleteMany({});
db.jobs.insertMany([
  {
    slug: "senior-frontend-developer",
    title: { ru: "Senior Frontend Developer", kz: "Senior Frontend әзірлеуші", en: "Senior Frontend Developer" },
    shortDescription: {
      ru: "Мы ищем опытного Frontend-разработчика для работы над крупными web-приложениями.",
      kz: "Біз ірі веб-қосымшалармен жұмыс істеу үшін тәжірибелі Frontend әзірлеушіні іздеп жатырмыз.",
      en: "We are looking for an experienced Frontend Developer to work on large-scale web applications."
    },
    requirements: [
      { ru: "4+ года опыта в frontend-разработке", kz: "Frontend әзірлеуде 4+ жыл тәжірибе", en: "4+ years of frontend development experience" },
      { ru: "Глубокое знание React, TypeScript, Next.js", kz: "React, TypeScript, Next.js терең білімі", en: "Deep knowledge of React, TypeScript, Next.js" },
      { ru: "Опыт работы с state management", kz: "State management тәжірибесі", en: "Experience with state management" },
    ],
    postedDate: "2025-03-01",
    department: "dev", location: "hybrid", employmentType: "full-time",
    status: "published", isVisible: true,
    description: {
      ru: {
        role: "Мы ищем опытного Frontend-разработчика для работы над крупными web-приложениями.",
        tasks: ["Разработка сложных интерфейсов на React и TypeScript", "Проектирование архитектуры frontend-приложений", "Оптимизация производительности", "Code review"],
        requirements: ["4+ года опыта в frontend", "React, TypeScript, Next.js", "State management", "CSS/Tailwind"],
        plusPoints: ["GraphQL", "Node.js", "CI/CD"],
        conditions: ["Гибкий график", "Hybrid формат", "Конкурентная зарплата"]
      },
      kz: {
        role: "Біз ірі веб-қосымшалармен жұмыс істеу үшін тәжірибелі Frontend әзірлеушіні іздейміз.",
        tasks: ["React және TypeScript арқылы күрделі интерфейстерді әзірлеу", "Frontend архитектурасын жобалау"],
        requirements: ["Frontend әзірлеуде 4+ жыл тәжірибе", "React, TypeScript, Next.js"],
        plusPoints: ["GraphQL", "Node.js"],
        conditions: ["Икемді жұмыс кестесі", "Hybrid формат"]
      },
      en: {
        role: "We are looking for an experienced Frontend Developer to work on large-scale web applications.",
        tasks: ["Develop complex interfaces with React and TypeScript", "Design frontend architecture", "Optimize performance"],
        requirements: ["4+ years of frontend experience", "React, TypeScript, Next.js", "State management"],
        plusPoints: ["GraphQL", "Node.js", "CI/CD"],
        conditions: ["Flexible schedule", "Hybrid format", "Competitive salary"]
      }
    },
    stack: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
    views: 0, applicants: 0,
    publishedAt: new Date().toISOString(),
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    slug: "ux-ui-designer",
    title: { ru: "UX/UI Designer", kz: "UX/UI дизайнер", en: "UX/UI Designer" },
    shortDescription: {
      ru: "Ищем дизайнера с сильными навыками UX/UI для работы над интерфейсами.",
      kz: "Біз күшті UX/UI дағдыларымен дизайнерді іздейміз.",
      en: "Looking for a designer with strong UX/UI skills."
    },
    requirements: [
      { ru: "3+ года опыта в UX/UI дизайне", kz: "UX/UI дизайнда 3+ жыл тәжірибе", en: "3+ years of UX/UI design experience" },
      { ru: "Отличное владение Figma", kz: "Figma өте жақсы меңгеру", en: "Excellent knowledge of Figma" },
    ],
    postedDate: "2025-03-05",
    department: "design", location: "astana", employmentType: "full-time",
    status: "published", isVisible: true,
    description: {
      ru: {
        role: "Ищем дизайнера для работы над интерфейсами web и mobile приложений.",
        tasks: ["Проектирование UI", "Создание wireframes и прототипов", "Разработка дизайн-систем"],
        requirements: ["3+ года опыта", "Figma", "Портфолио"],
        plusPoints: ["Анимации", "After Effects"],
        conditions: ["Офис в центре Астаны", "Конкурентная зарплата"]
      },
      kz: {
        role: "Веб және мобильді қосымшалар интерфейстерімен жұмыс істеуге дизайнер іздейміз.",
        tasks: ["UI жобалау", "Wireframes жасау"],
        requirements: ["3+ жыл тәжірибе", "Figma"],
        plusPoints: ["Анимациялар"],
        conditions: ["Астана орталығындағы офис"]
      },
      en: {
        role: "Looking for a designer to work on web and mobile application interfaces.",
        tasks: ["Design user interfaces", "Create wireframes and prototypes", "Develop design systems"],
        requirements: ["3+ years experience", "Figma", "Portfolio"],
        plusPoints: ["Animations", "After Effects"],
        conditions: ["Office in Astana center", "Competitive salary"]
      }
    },
    stack: ["Figma", "Adobe XD", "Sketch", "Principle"],
    views: 0, applicants: 0,
    publishedAt: new Date().toISOString(),
    createdAt: new Date(), updatedAt: new Date()
  }
]);
print("Jobs seeded: " + db.jobs.countDocuments());

print("\n✅ Seed complete! Projects: " + db.projects.countDocuments() + ", Jobs: " + db.jobs.countDocuments());
