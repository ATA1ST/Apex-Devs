export interface Project {
  id: string;
  slug: string;
  title: {
    ru: string;
    kz: string;
    en: string;
  };
  description: {
    ru: string;
    kz: string;
    en: string;
  };
  fullDescription?: {
    ru: string;
    kz: string;
    en: string;
  };
  challenge?: {
    ru: string;
    kz: string;
    en: string;
  };
  solution?: {
    ru: string;
    kz: string;
    en: string;
  };
  features?: {
    ru: string[];
    kz: string[];
    en: string[];
  };
  category: 'web' | 'mobile' | 'ongoing';
  status: 'done' | 'progress' | 'discovery';
  tags: string[];
  image: string;
  gallery?: string[];
  goals?: {
    ru: string[];
    kz: string[];
    en: string[];
  };
  stack?: string[];
  results?: {
    ru: string;
    kz: string;
    en: string;
  };
  isVisible?: boolean; // Add visibility flag, default true
  timeline?: {
    ru: string;
    kz: string;
    en: string;
  };
}

export const mockProjects: Project[] = [
  {
    id: '1',
    slug: 'academic-management-platform',
    title: {
      ru: 'Academic Management Platform',
      kz: 'Academic Management Platform',
      en: 'Academic Management Platform',
    },
    description: {
      ru: 'Цифровая платформа для управления учебным процессом с умными функциями и AI-интеграцией',
      kz: 'Ақылды фнкциялар мен AI интеграциясы бар оқу процесін басқаруға арналған цифрлық платформа',
      en: 'Digital platform for academic management with smart features and AI integration',
    },
    fullDescription: {
      ru: 'Современная LMS-система нового поколения для образовательных учреждений, заменяющая традиционные решения',
      kz: 'Дәстүрлі шешімдерді алмастыратын білім беру мекемелеріне арналған жаңа буын заманауи LMS жүйесі',
      en: 'Next-generation LMS system for educational institutions, replacing traditional solutions',
    },
    challenge: {
      ru: 'Традиционные LMS устарели и не отвечают современным требованиям преподавателей и студентов. Интерфейсы перегружены, аналитика слабая, нет персонализации. Преподаватели тратят часы на рутинные задачи, а студенты не получают индивидуального подхода. Отсутствие AI-инструментов не позволяет масштабировать качество образования. Интеграции с другими системами либо отсутствуют, либо работают нестабильно, что создает дополнительные сложности.',
      kz: 'Дәстүрлі LMS ескірген және оқытушылар мен студенттердің қазіргі талаптарына сәйкес келмейді. Интерфейстер асып кеткен, аналитика әлсіз, жекелендіру жоқ. Оқытушылар қарапайым міндеттерге сағаттар жұмсайды, ал студенттер жеке көзқарас алмайды. AI құралдарының болмауы білім беру сапасын масштабтауға мүмкіндік бермейді. Басқа жүйелермен интеграция не жоқ, не тұрақсыз жұмыс істейді, бұл қосымша қиындықтар тудырады.',
      en: 'Traditional LMS are outdated and do not meet modern requirements of teachers and students. Interfaces are overloaded, analytics are weak, there is no personalization. Teachers spend hours on routine tasks, and students do not receive an individual approach. The lack of AI tools does not allow scaling the quality of education. Integrations with other systems are either missing or work unstably, which creates additional difficulties.',
    },
    solution: {
      ru: 'Разработали платформу с AI-ассистентом, умным расписанием, интерактивными материалами и продвинутой аналитикой. Система автоматизирует рутинные задачи преподавателей и персонализирует обучение для каждого студента. AI-помощник анализирует прогресс и предлагает индивидуальные рекомендации. Встроенная аналитика позволяет отслеживать метрики успеваемости в реальном времени. Платформа легко интегрируется с существующими университетскими системами через REST API. Мобильное приложение обеспечивает доступ к материалам в любое время.',
      kz: 'AI көмекшісі, ақылды кесте, интерактивті материалдар және озық аналитика бар платформа жасадық. Жүйе оқытушылардың қарапайым міндеттерін автоматтандырады және әрбір студент үшін оқытуды жекелендіреді. AI көмекші прогресті талдайды және жеке ұсыныстар береді. Кіріктірілген аналитика нақты уақытта үлгерім көрсеткіштерін қадағалауға мүмкіндік береді. Платформа REST API арқылы бар университет жүйелерімен оңай біріктіріледі. Мобильді қосымша кез келген уақытта материалдарға қолжетімділікті қамтамасыз етеді.',
      en: 'Developed platform with AI assistant, smart scheduling, interactive materials and advanced analytics. The system automates routine tasks of teachers and personalizes learning for each student. AI assistant analyzes progress and provides individual recommendations. Built-in analytics allows tracking performance metrics in real time. The platform easily integrates with existing university systems via REST API. Mobile application provides access to materials at any time.',
    },
    features: {
      ru: [
        'AI-ассистент для персонализации обучения',
        'Умное расписание с автоматическим планированием',
        'Интерактивные материалы и тесты',
        'Продвинутая аналитика успеваемости',
        'Интеграция с существующими системами',
        'Мобильное приложение для студентов',
      ],
      kz: [
        'Оқытуды жекелендіруге арналған AI көмекші',
        'Автоматты жоспарлау бар ақылды кесте',
        'Интерактивті материалдар мен тесттер',
        'Үлгерімнің озық аналитикасы',
        'Бар жүйелермен интеграция',
        'Студенттерге арналған мобильді қосымша',
      ],
      en: [
        'AI assistant for personalized learning',
        'Smart scheduling with auto-planning',
        'Interactive materials and tests',
        'Advanced performance analytics',
        'Integration with existing systems',
        'Mobile app for students',
      ],
    },
    category: 'web',
    status: 'progress',
    tags: ['Web', 'EdTech', 'AI', 'SaaS'],
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&h=800&fit=crop',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Python', 'OpenAI API'],
    timeline: {
      ru: '6 месяцев разработки, запуск в Q3 2026',
      kz: '6 ай әзірлеу, 2026 Q3 іске қосу',
      en: '6 months development, launch in Q3 2026',
    },
  },
  {
    id: '2',
    slug: 'enterprise-hr-platform',
    title: {
      ru: 'Enterprise HR Platform',
      kz: 'Enterprise HR Platform',
      en: 'Enterprise HR Platform',
    },
    description: {
      ru: 'Корпоративная платформа для управления персоналом с автоматизацией HR-процессов',
      kz: 'HR процестерін автоматтандырумен персоналды басқаруға арналған корпоративтік платформа',
      en: 'Corporate platform for employee management with HR process automation',
    },
    fullDescription: {
      ru: 'Комплексное решение для управления всеми аспектами работы с персоналом в крупных компаниях',
      kz: 'Ірі компанияларда персоналмен жұмыстың барлық аспектілерін басқаруға арналған кешенді шешім',
      en: 'Comprehensive solution for managing all aspects of employee work in large companies',
    },
    challenge: {
      ru: 'Разрозненные системы HR не позволяют эффективно управлять персоналом и анализировать данные. В крупных компаниях данные хранятся в разных системах без единой точки доступа. HR-специалисты тратят значительное время на ручную обработку информации и переключение между платформами. Аналитика требует объединения данных из множества источников. Отсутствие автоматизации создает узкие места в процессах. Кандидаты и сотрудники получают фрагментированный опыт взаимодействия.',
      kz: 'Бөлінген HR жүйелері персоналды тиімді басқаруға және деректерді талдауға мүмкіндік бермейді. Ірі компанияларда деректер бірыңғай қол жеткізу нүктесі жоқ әртүрлі жүйелерде сақталады. HR мамандары ақпаратты қолмен өңдеуге және платформалар арасында ауысуа айтарлықтай уақыт жұмсайды. Аналитика көптеген көздерден деректерді біріктіруді талап етеді. Автоматтандырудың болмауы процестерде тар жерлер жасайды. Үміткерлер мен қызметкерлер фрагменттелген өзара әрекеттесу тәжірибесін алады.',
      en: 'Fragmented HR systems do not allow effective personnel management and data analysis. In large companies, data is stored in different systems without a single point of access. HR specialists spend significant time on manual information processing and switching between platforms. Analytics requires combining data from multiple sources. Lack of automation creates bottlenecks in processes. Candidates and employees receive a fragmented interaction experience.',
    },
    solution: {
      ru: 'Единая платформа с модулями рекрутинга, онбординга, управления производительностью и аналитики. Система консолидирует все HR-процессы в одном месте с интуитивным интерфейсом. Встроенная ATS автоматизирует подбор персонала от публикации вакансий до оффера. Модуль онбординга обеспечивает структурированную адаптацию новых сотрудников. Performance management включает OKR, 360-градусную обратную связь и планы развития. Продвинутая аналитика предоставляет реальное время инсайты по всем HR-метрикам. Интеграция с payroll и другими корпоративными системами через API.',
      kz: 'Жұмысқа қабылдау, онбординг, өнімділікті басқару және аналитика модульдері бар бірыңғай платформа. Жүйе барлық HR процестерін интуитивті интерфейспен бір жерде біріктіреді. Кіріктірілген ATS вакансияларды жариялаудан офферге дейін персонал іріктеуді автоматтандырады. Онбординг модулі жаңа қызметкерлердің құрылымдалған бейімделуін қамтамасыз етеді. Performance management OKR, 360-градустық кері байланыс және даму жоспарларын қамтиды. Озық аналитика барлық HR көрсеткіштері бойынша нақты ақытта түсініктер береді. API арқылы payroll және басқа корпоративтік жүйелермен интеграция.',
      en: 'Unified platform with recruiting, onboarding, performance management and analytics modules. The system consolidates all HR processes in one place with an intuitive interface. Built-in ATS automates recruitment from job posting to offer. Onboarding module provides structured adaptation of new employees. Performance management includes OKR, 360-degree feedback and development plans. Advanced analytics provides real-time insights on all HR metrics. Integration with payroll and other corporate systems via API.',
    },
    features: {
      ru: [
        'ATS-система для рекрутинга',
        'Автоматизированный онбординг',
        'Performance management и OKR',
        'HR-аналитика и отчётность',
        'Управление отпусками и больничными',
        'Интеграция с payroll системами',
      ],
      kz: [
        'Жұмысқа қабылдауға арналған ATS жүйесі',
        'Автоматтандырылған онбординг',
        'Performance management және OKR',
        'HR аналитикасы және есептілік',
        'Демалыстар мен ауру парақтарын басқару',
        'Payroll жүйелерімен интеграция',
      ],
      en: [
        'ATS system for recruiting',
        'Automated onboarding',
        'Performance management and OKR',
        'HR analytics and reporting',
        'Leave and sick leave management',
        'Integration with payroll systems',
      ],
    },
    category: 'web',
    status: 'progress',
    tags: ['Web', 'Enterprise', 'HR', 'SaaS'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=800&fit=crop',
    ],
    stack: ['Angular', 'TypeScript', 'Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
    timeline: {
      ru: '8 месяцев разработки, поэтапный запуск',
      kz: '8 ай әзірлеу, кезең-кезеңмен іске қосу',
      en: '8 months development, phased launch',
    },
  },
  {
    id: '3',
    slug: 'sport-subscription-app',
    title: {
      ru: 'Sport Subscription App',
      kz: 'Sport Subscription App',
      en: 'Sport Subscription App',
    },
    description: {
      ru: 'Приложение для персонализированных спортивных подписок с гибкими планами',
      kz: 'Икемді жоспарлары бар жекелендірілген спорттық жазылымдарға арналған қосымша',
      en: 'App for personalized sport subscriptions with flexible plans',
    },
    fullDescription: {
      ru: 'Мобильное приложение для удобного управления абонементами в фитнес-клубы, бассейны и спортивные секции',
      kz: 'Фитнес клубтарға, бассейндерге және спорт секцияларына абонементтерді ыңғайлы басқаруға арналған мобильді қосымша',
      en: 'Mobile app for convenient management of subscriptions to fitness clubs, pools and sports sections',
    },
    challenge: {
      ru: 'Пользователи теряются в разнообразии абонементов и не могут найти оптимальный вариант. Каждый фитнес-клуб предлагает свои тарифы и условия, что затрудняет сравнение. Часто люди покупают дорогие безлимитные абонементы, но используют только часть возможностей. Отсутствие гибкости в планах приводит к переплатам. Сложно отслеживать оставшиеся визиты и срок действия абонементов. Нет единого инструмента для управления всеми спортивными подписками одновременно.',
      kz: 'Пайдаланушылар абонементтердің әртүрлілігінде жоғалады және оңтайлы нұсқаны таба алмайды. Әрбір фитнес клубы өз тарифтері мен шарттарын ұсынады, бұл салыстыруды қиындатады. Адамдар жиі қымбат шексіз абонементтерді сатып алады, бірақ мүмкіндіктердің тек бөлігін пайдаланады. Жоспарлардағы икемділіктің болмауы артық төлемдерге әкеледі. Қалған сапарларды және абонементтердің жарамдылық мерзімін қадағалау қиын. Барлық спорттық жазылымдарды бір уақытта басқаруға бірыңғай құрал жоқ.',
      en: 'Users get lost in the variety of subscriptions and cannot find the optimal option. Each fitness club offers its own rates and conditions, making comparison difficult. People often buy expensive unlimited subscriptions but use only part of the features. Lack of flexibility in plans leads to overpayments. It is difficult to track remaining visits and subscription validity period. There is no single tool to manage all sports subscriptions simultaneously.',
    },
    solution: {
      ru: 'Создали приложение с умными рекомендациями, конструктором подписок и единым кошельком. AI-алгоритм анализирует привычки пользователя и предлагает оптимальные планы. Конструктор позволяет собрать персональную подписку из разных активностей. Единый кошелёк упрощает оплату абонементов в разных клубах через одно приложение. Система напоминаний информирует об окончании сроков и неиспользованных визитах. Интеграция с фитнес-клубами обеспечивает актуальное расписание и онлайн-бронирование. Трекинг прогресса мотивирует пользователей заниматься регулярно.',
      kz: 'Ақылды ұсыныстар, жазылым конструкторы және бірыңғай әмиян бар қосымша жасадық. AI алгоритмі пайдаланушы әдеттерін талдайды және оңтайлы жоспарларды ұсынады. Конструктор әртүрлі белсенділіктерден жеке жазылым жинауға мүмкіндік береді. Бірыңғай әмиян бір қосымша арқылы әртүрлі клубтардағы абонементтерді төлеуді жеңілдетеді. Еске салу жүйесі мерзімдердің аяқталуы және пайдаланылмаған сапарлар туралы хабарлайды. Фитнес клубтармен интеграция өзекті кестені және онлайн брондауды қамтамасыз етеді. Прогресті қадағалау пайдаланушыларды үнемі айналысуға ынталандырады.',
      en: 'Created app with smart recommendations, subscription builder and unified wallet. AI algorithm analyzes user habits and suggests optimal plans. Builder allows assembling a personal subscription from different activities. Unified wallet simplifies payment of subscriptions in different clubs through one application. Reminder system informs about expiration dates and unused visits. Integration with fitness clubs provides up-to-date schedule and online booking. Progress tracking motivates users to exercise regularly.',
    },
    features: {
      ru: [
        'Умные рекомендации подписок',
        'Конструктор персонального плана',
        'Единый кошелёк для всех абонементов',
        'Бронирование занятий',
        'Трекинг посещений и прогресса',
        'Интеграция с фитнес-клубами',
      ],
      kz: [
        'Жазылымдардың ақылды ұсыныстары',
        'Жеке жоспар конструкторы',
        'Барлық абонементтерге арналған бірыңғай әмиян',
        'Сабақтарды брондау',
        'Барулар мен прогресті қадағалау',
        'Фитнес клубтармен интеграция',
      ],
      en: [
        'Smart subscription recommendations',
        'Personal plan builder',
        'Unified wallet for all subscriptions',
        'Class booking',
        'Visit and progress tracking',
        'Integration with fitness clubs',
      ],
    },
    category: 'mobile',
    status: 'progress',
    tags: ['Mobile', 'Sport', 'Subscription'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=800&fit=crop',
    ],
    stack: ['React Native', 'TypeScript', 'Node.js', 'MongoDB', 'Stripe'],
    timeline: {
      ru: '4 месяца разработки MVP, запуск в Q2 2026',
      kz: '4 ай MVP әзірлеу, 2026 Q2 іске қосу',
      en: '4 months MVP development, launch in Q2 2026',
    },
  },
  {
    id: '4',
    slug: 'idaryn-science-fair',
    title: {
      ru: 'iDaryn — Digital Platform',
      kz: 'iDaryn — Цифрлық платформа',
      en: 'iDaryn — Digital Platform',
    },
    description: {
      ru: 'Цифровая платформа для школьной научной ярмарки в Казахстане',
      kz: 'Қазақстандағы мектеп ғылыми жәрмеңкесіне арналған цифрлық платформа',
      en: 'Digital platform for school science fair in Kazakhstan',
    },
    fullDescription: {
      ru: 'Онлайн-платформа для проведения республиканской школьной научной ярмарки с подачей заявок, оценкой проектов и трансляциями',
      kz: 'Өтінімдерді беру, жобаларды бағалау және трансляциялармен республикалық мектеп ғылыми жәрмеңкесін өткізуге арналған онлайн платформа',
      en: 'Online platform for conducting republican school science fair with applications, project evaluation and broadcasts',
    },
    challenge: {
      ru: 'Организация масштабной образовательной активности требует цифровизации всех процессов',
      kz: 'Ауқымды білім беру іс-шарасын ұйымдастыру барлық процестерді цифрландыруды талап етеді',
      en: 'Organizing a large-scale educational activity requires digitalization of all processes',
    },
    solution: {
      ru: 'Разработали платформу для подачи заявок, онлайн-оценки жюри, трансляций и подведения итогов',
      kz: 'Өтінімдер беруге, қазылар алқасының онлайн бағалауына, трансляцияларға және қорытынды шығарға арналған платформа жасадық',
      en: 'Developed platform for applications, online jury evaluation, broadcasts and summarizing results',
    },
    features: {
      ru: [
        'Онлайн-регистрация участников',
        'Система оценки жюри',
        'Видеотрансляции презентаций',
        'Галерея проектов с фильтрами',
        'Рейтинги и награды',
        'Трёхъязычная поддержка (KZ/RU/EN)',
      ],
      kz: [
        'Қатысушылардың онлайн тіркелуі',
        'Қазылар алқасының бағалау жүйесі',
        'Презентациялардың бейнетрансляциялары',
        'Сүзгілері бар жобалар галереясы',
        'Рейтингтер мен марапаттар',
        'Үш тілді қолдау (KZ/RU/EN)',
      ],
      en: [
        'Online participant registration',
        'Jury evaluation system',
        'Video broadcasts of presentations',
        'Project gallery with filters',
        'Ratings and awards',
        'Trilingual support (KZ/RU/EN)',
      ],
    },
    category: 'web',
    status: 'progress',
    tags: ['Web', 'EdTech', 'Gov'],
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=800&fit=crop',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
    timeline: {
      ru: '3 месяца разработки, запуск в мае 2026',
      kz: '3 ай әзірлеу, 2026 мамырда іске қосу',
      en: '3 months development, launch in May 2026',
    },
  },
  {
    id: '5',
    slug: 'seven-business-center',
    title: {
      ru: 'Seven Business Center',
      kz: 'Seven Business Center',
      en: 'Seven Business Center',
    },
    description: {
      ru: 'Корпоративный сайт для аренды офисных помещений и жилья в Астане',
      kz: 'Астанадағы кеңсе үй-жайларын және тұрғын үйді жалға алуға арналған корпоративтік сайт',
      en: 'Corporate website for renting office space and housing in Astana',
    },
    fullDescription: {
      ru: 'Премиум-сайт для презентации и аренды офисных помещений класса А в Seven Business Center',
      kz: 'Seven Business Center-де А класты кеңсе үй-жайларын ұсыну және жалға беруге арналған премиум сайт',
      en: 'Premium website for presentation and rental of class A office space in Seven Business Center',
    },
    challenge: {
      ru: 'Необходимо презентовать премиум-локацию и упростить процесс аренды для клиентов',
      kz: 'Премиум локацияны ұсыну және клиенттер үшін жалдау процесін жеңілдету қажет',
      en: 'Need to present premium location and simplify the rental process for clients',
    },
    solution: {
      ru: '3D-туры, онлайн-бронирование, интеграция с CRM и красивая презентация помещений',
      kz: '3D турлар, онлайн брондау, CRM интеграциясы және үй-жайлардың әдемі презентациясы',
      en: '3D tours, online booking, CRM integration and beautiful space presentation',
    },
    features: {
      ru: [
        '3D-туры по помещениям',
        'Онлайн-бронирование',
        'Интерактивный план этажей',
        'Калькулятор стоимости',
        'Интеграция с CRM',
        'Личный кабинет арендатора',
      ],
      kz: [
        'Үй-жайлар бойынша 3D турлар',
        'Онлайн брондау',
        'Интерактивті қабат жоспары',
        'Құн калькуляторы',
        'CRM интеграциясы',
        'Жалға алушының жеке кабинеті',
      ],
      en: [
        '3D tours of premises',
        'Online booking',
        'Interactive floor plan',
        'Cost calculator',
        'CRM integration',
        'Tenant personal account',
      ],
    },
    category: 'web',
    status: 'progress',
    tags: ['Web', 'PropTech', 'Corporate'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'Three.js', 'PostgreSQL'],
    timeline: {
      ru: '5 месяцев разработки, запуск в Q2 2026',
      kz: '5 ай әзірлеу, 2026 Q2 іске қосу',
      en: '5 months development, launch in Q2 2026',
    },
  },
  {
    id: '6',
    slug: 'parasat-invest',
    title: {
      ru: 'Parasat Invest',
      kz: 'Parasat Invest',
      en: 'Parasat Invest',
    },
    description: {
      ru: 'Инвестиционная платформа для инвесторов, девелоперов и стартапов',
      kz: 'Инвесторлар, девелоперлер және стартаптарға арналған инвестициялық платформа',
      en: 'Investment platform for investors, developers and startups',
    },
    fullDescription: {
      ru: 'Цифровая платформа, соединяющая инвесторов с перспективными проектами в сфере недвижимости и стартапов',
      kz: 'Инвесторларды жылжымайтын мүлік және стартаптар саласындағы перспективалы жобалармен байланыстыратын цифрлық платформа',
      en: 'Digital platform connecting investors with promising projects in real estate and startups',
    },
    challenge: {
      ru: 'Инвесторы и проектные команды не могут эффективно находить друг друга',
      kz: 'Инвесторлар мен жобалық топтар бір-бірін тиімді таба алмайды',
      en: 'Investors and project teams cannot effectively find each other',
    },
    solution: {
      ru: 'Маркетплейс с верификацией проектов, инвестиционными раундами и прозрачной отчётностью',
      kz: 'Жобаларды верификациялау, инвестициялық раундтар және ашық есептілік бар маркетплейс',
      en: 'Marketplace with project verification, investment rounds and transparent reporting',
    },
    features: {
      ru: [
        'Каталог проектов с due diligence',
        'Инвестиционные раунды',
        'KYC/AML верификация',
        'Умное сопоставление (AI matching)',
        'Документооборот и договоры',
        'Аналитика портфеля',
      ],
      kz: [
        'Due diligence бар жобалар каталогы',
        'Инвестициялық раундтар',
        'KYC/AML верификациясы',
        'Ақылды сәйкестендіру (AI matching)',
        'Құжат айналымы және шарттар',
        'Портфель аналитикасы',
      ],
      en: [
        'Project catalog with due diligence',
        'Investment rounds',
        'KYC/AML verification',
        'Smart matching (AI matching)',
        'Document flow and contracts',
        'Portfolio analytics',
      ],
    },
    category: 'web',
    status: 'progress',
    tags: ['Web', 'FinTech', 'PropTech'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=800&fit=crop',
    ],
    stack: ['React', 'TypeScript', '.NET', 'C#', 'PostgreSQL', 'Azure'],
    timeline: {
      ru: '10 месяцев разработки, запуск в Q4 2026',
      kz: '10 ай әзірлеу, 2026 Q4 іске қосу',
      en: '10 months development, launch in Q4 2026',
    },
  },
  {
    id: '7',
    slug: 'ecosplit',
    title: {
      ru: 'EcoSplit — Sharing Platform',
      kz: 'EcoSplit — Sharing Platform',
      en: 'EcoSplit — Sharing Platform',
    },
    description: {
      ru: 'Платформа для шаринга подписок на стриминговые сервисы',
      kz: 'Стриминг қызметтеріне жазылымдарды бөлісуге арналған платформа',
      en: 'Platform for sharing subscriptions to streaming services',
    },
    fullDescription: {
      ru: 'Собственный продукт Apex Digital — сервис для экономии на подписках через совместное использование',
      kz: 'Apex Digital өнімі — бірлесіп пайдалану арқылы жазылымдарды үнемдеуге арналған қызмет',
      en: 'Apex Digital own product — service for saving on subscriptions through sharing',
    },
    challenge: {
      ru: 'Подписки на стриминги дорогие, но большинство функций не используются одним человеком',
      kz: 'Стриминг жазылымдары қымбат, бірақ көптеген функциялар бір адам пайдаланбайды',
      en: 'Streaming subscriptions are expensive, but most features are not used by one person',
    },
    solution: {
      ru: 'Сервис для безопасного шаринга подписок с автоматическими выплатами и управлением доступом',
      kz: 'Автоматты төлемдер мен қолжетімділікті басқарумен жазылымдарды қауіпсіз бөлісуге арналған қызмет',
      en: 'Service for secure subscription sharing with automatic payments and access management',
    },
    features: {
      ru: [
        'Автоматическое формирование групп',
        'Безопасные платежи',
        'Управление доступом',
        'Поддержка всех популярных стримингов',
        'Автоматическое продление',
        'Чат внутри группы',
      ],
      kz: [
        'Топтарды автоматты қалыптастыру',
        'Қауіпсіз төлемдер',
        'Қолжетімділікті басқару',
        'Барлық танымал стримингтерді қолдау',
        'Автоматты ұзарту',
        'Топ ішіндегі чат',
      ],
      en: [
        'Automatic group formation',
        'Secure payments',
        'Access management',
        'Support for all popular streamings',
        'Automatic renewal',
        'In-group chat',
      ],
    },
    category: 'web',
    status: 'progress',
    tags: ['Web', 'Sharing', 'FinTech'],
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=800&fit=crop',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe'],
    timeline: {
      ru: '4 месяца MVP, запуск в Q3 2026',
      kz: '4 ай MVP, 2026 Q3 іске қосу',
      en: '4 months MVP, launch in Q3 2026',
    },
  },
  {
    id: '8',
    slug: 'seriestok',
    title: {
      ru: 'SeriesTok — TikTok для сериалов',
      kz: 'SeriesTok — Сериалдарға арналған TikTok',
      en: 'SeriesTok — TikTok for TV Series',
    },
    description: {
      ru: 'Мобильное приложение с короткими клипами из сериалов',
      kz: 'Сериалдардан қысқа клиптері бар мобильді қосымша',
      en: 'Mobile app with short clips from TV series',
    },
    fullDescription: {
      ru: 'Социальная платформа для просмотра, создания и шаринга коротких клипов (1-2 минуты) из любимых сериалов',
      kz: 'Сүйікті сериалдардан қысқа клиптерді (1-2 минут) көру, жасау және бөлісуге арналған әлеуметтік платформа',
      en: 'Social platform for watching, creating and sharing short clips (1-2 minutes) from favorite TV series',
    },
    challenge: {
      ru: 'Пользователи хотят делиться любимыми моментами из сериалов, но нет удобного инструмента',
      kz: 'Пайдаланушылар сериалдардан сүйікті сәттерімен бөліскісі келеді, бірақ ыңғайлы құрал жоқ',
      en: 'Users want to share favorite moments from series, but there is no convenient tool',
    },
    solution: {
      ru: 'Создали вертикальную соцсеть с клипами, рекомендациями AI и viral-механиками',
      kz: 'Клиптері, AI ұсыныстары және viral механикалары бар вертикалды соцсеть жасадық',
      en: 'Created vertical social network with clips, AI recommendations and viral mechanics',
    },
    features: {
      ru: [
        'Вертикальная лента клипов',
        'AI-рекомендации',
        'Создание и редактирование клипов',
        'Лайки, комментарии, шаринг',
        'Подписки на сериалы и авторов',
        'Персонализированные подборки',
      ],
      kz: [
        'Клиптердің вертикалды ағыны',
        'AI ұсыныстары',
        'Клиптерді жасау және өңдеу',
        'Лайктар, пікірлер, бөлісу',
        'Сериалдарға және авторларға жазылу',
        'Жекелендірілген таңдаулар',
      ],
      en: [
        'Vertical clip feed',
        'AI recommendations',
        'Clip creation and editing',
        'Likes, comments, sharing',
        'Subscribe to series and authors',
        'Personalized collections',
      ],
    },
    category: 'mobile',
    status: 'done',
    tags: ['Mobile', 'Social', 'Entertainment'],
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&fit=crop',
    ],
    stack: ['React Native', 'TypeScript', 'Node.js', 'MongoDB', 'FFmpeg', 'AWS'],
    results: {
      ru: '10K+ скачиваний в первый месяц, 35% retention rate',
      kz: 'Бірінші айда 10K+ жүктеу, 35% retention rate',
      en: '10K+ downloads in first month, 35% retention rate',
    },
    timeline: {
      ru: 'Запущено в декабре 2025',
      kz: '2025 желтоқсанда іске қосылды',
      en: 'Launched in December 2025',
    },
  },
  {
    id: '9',
    slug: 'ktzh-chatbot',
    title: {
      ru: 'Chat-bot для КТЖ',
      kz: 'ҚТЖ үшін чат-бот',
      en: 'Chat-bot for Kazakhstan Railways',
    },
    description: {
      ru: 'Интеллектуальный чат-бот для Kazakhstan Temir Zholy (Казахстанские железные дороги)',
      kz: 'Қазақстан Темір Жолына арналған интеллектуалды чат-бот',
      en: 'Intelligent chat-bot for Kazakhstan Temir Zholy (Kazakhstan Railways)',
    },
    fullDescription: {
      ru: 'AI-ассистент для помощи пассажирам: покупка билетов, расписание, справочная информация на трёх языках',
      kz: 'Жолаушыларға көмектесуге арналған AI көмекші: билет сатып алу, кесте, үш тілде анықтама ақпараты',
      en: 'AI assistant to help passengers: ticket purchase, schedule, reference information in three languages',
    },
    challenge: {
      ru: 'Колл-центр перегружен типовыми вопросами, пользователям неудобно искать информацию',
      kz: 'Колл-орталық типтік сұрақтармен асып кетті, пайдаланушыларға ақпарат іздеу ыңғайсыз',
      en: 'Call center is overloaded with typical questions, users find it inconvenient to search for information',
    },
    solution: {
      ru: 'Разработали NLU-бота с интеграцией в систему продажи билетов и базой знаний',
      kz: 'Билет сату жүйесіне интеграциялау және білім базасы бар NLU ботын жасадық',
      en: 'Developed NLU bot with integration into ticket sales system and knowledge base',
    },
    features: {
      ru: [
        'Покупка и возврат билетов',
        'Проверка расписания',
        'Справка о маршрутах и вагонах',
        'Трёхъязычная поддержка (KZ/RU/EN)',
        'Интеграция с backend КТЖ',
        'Voice-интерфейс (опционально)',
      ],
      kz: [
        'Билеттерді сатып алу және қайтару',
        'Кестені тексеру',
        'Бағыттар мен вагондар туралы анықтама',
        'Үш тілі қолдау (KZ/RU/EN)',
        'ҚТЖ backend интеграциясы',
        'Voice интерфейсі (опционалды)',
      ],
      en: [
        'Buy and return tickets',
        'Check schedule',
        'Information about routes and cars',
        'Trilingual support (KZ/RU/EN)',
        'Integration with KTZh backend',
        'Voice interface (optional)',
      ],
    },
    category: 'web',
    status: 'done',
    tags: ['AI', 'ChatBot', 'Gov'],
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?w=1200&h=800&fit=crop',
    ],
    stack: ['Python', 'Django', 'NLU', 'PostgreSQL', 'Telegram Bot API'],
    results: {
      ru: '60% снижение нагрузки на колл-центр, 4.5/5 рейтинг пользователей',
      kz: 'Колл-орталыққа жүктемені 60% азайту, пайдаланушылардың 4.5/5 рейтингі',
      en: '60% reduction in call center load, 4.5/5 user rating',
    },
    timeline: {
      ru: 'Запущено в октябре 2025',
      kz: '2025 қазанда іске қосылды',
      en: 'Launched in October 2025',
    },
  },
];

export interface Submission {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  timeline?: string;
  description: string;
  attachments: Array<{ name: string; size: number; url: string }>;
  date: string;
  processed: boolean;
}

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    name: 'Айдар Нурланов',
    company: 'TechStart KZ',
    email: 'aidar@techstart.kz',
    phone: '+7 701 234 56 78',
    service: 'Веб-сайт',
    budget: '$5,000 - $15,000',
    timeline: 'Обычные (1-2 месяца)',
    description: 'Нужен корпоративный сайт для IT-стартапа с презентацией команды и продукта.',
    attachments: [
      { name: 'brief.pdf', size: 2400000, url: '#' },
    ],
    date: '2026-02-20',
    processed: false,
  },
  {
    id: '2',
    name: 'Elena Petrova',
    company: 'Astana Retail Group',
    email: 'e.petrova@aretail.kz',
    phone: '+7 747 111 22 33',
    service: 'Мобильное приложение',
    budget: '$15,000 - $50,000',
    timeline: 'Срочно (1-2 недели)',
    description: 'Mobile app for loyalty program, iOS and Android.',
    attachments: [],
    date: '2026-02-18',
    processed: true,
  },
];

export interface Founder {
  name: {
    ru: string;
    kz: string;
    en: string;
  };
  role: {
    ru: string;
    kz: string;
    en: string;
  };
  description: {
    ru: string[];
    kz: string[];
    en: string[];
  };
  image: string;
}

export const founders: Founder[] = [
  {
    name: {
      ru: 'Омиргалиев Руслан',
      kz: 'Омірғалиев Руслан',
      en: 'Ruslan Omirgaliyev',
    },
    role: {
      ru: 'Co-Founder',
      kz: 'Co-Founder',
      en: 'Co-Founder',
    },
    description: {
      ru: [
        'Engineering-led approach',
        'ML & Backend',
        'Project delivery',
      ],
      kz: [
        'Инженерлік тәсіл',
        'ML & Backend',
        'Жобаны жеткізу',
      ],
      en: [
        'Engineering-led approach',
        'ML & Backend',
        'Project delivery',
      ],
    },
    image: 'icon-gradient-1',
  },
  {
    name: {
      ru: 'Токтасынов Даулет',
      kz: 'Тоқтасынов Дәулет',
      en: 'Daulet Toktassynov',
    },
    role: {
      ru: 'Co-Founder',
      kz: 'Co-Founder',
      en: 'Co-Founder',
    },
    description: {
      ru: [
        'Product-minded engineer',
        'Full-stack & Mobile',
        'UX/UI architecture',
      ],
      kz: [
        'Өнімге бағытталған инженер',
        'Full-stack & Mobile',
        'UX/UI архитектурасы',
      ],
      en: [
        'Product-minded engineer',
        'Full-stack & Mobile',
        'UX/UI architecture',
      ],
    },
    image: 'icon-gradient-2',
  },
];