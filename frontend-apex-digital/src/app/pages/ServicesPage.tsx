import { Globe, Smartphone, Users, Check, ArrowRight, Brain, Server, Palette, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { OrbitalBackground } from '../components/OrbitalBackground';
import { OrbitalVisual } from '../components/OrbitalVisual';
import webServicesImage from '../../assets/d5c94b721baa73a3ddce491526c2f731730edbb4.png';
import mobileServicesImage from '../../assets/d8c82b8e5ddf189d5ce6dd4276ea6309667e5037.png';
import backendServicesImage from '../../assets/c440b7c6e08c80df13f84f48e0c36dd1b7f533c3.png';
import aiServicesImage from '../../assets/40dbea31e7bca1b4d6d6a9f470284fb270b80830.png';
import designServicesImage from '../../assets/b88be5357433334917189f0f8f2afdb630dda82e.png';
import oneCServicesImage from '../../assets/710c74a1837596b23c0ec5409d376df9fc3c919b.png';
import staffServicesImage from '../../assets/e39d0fbf849115c9fc4a57d39768d7f4f6b0e5a2.png';

export function ServicesPage() {
  const { t, language } = useLanguage();

  const services = [
    {
      icon: Globe,
      title: t('services.web.title'),
      description: t('services.web.desc'),
      features: [
        { ru: 'Landing pages — конверсия с первого экрана', kz: 'Landing pages — бірінші экраннан конверсия', en: 'Landing pages — conversion from first screen' },
        { ru: 'Корпоративные сайты и порталы', kz: 'Корпоративтік сайттар мен порталдар', en: 'Corporate websites and portals' },
        { ru: 'E-commerce платформы', kz: 'E-commerce платформалар', en: 'E-commerce platforms' },
        { ru: 'Web-приложения и админ-панели', kz: 'Web-қосымшалар және админ-панельдер', en: 'Web apps and admin panels' },
        { ru: 'SEO-оптимизация из коробки', kz: 'SEO оңтайландыру', en: 'SEO optimization out of the box' },
      ],
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js'],
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
    },
    {
      icon: Smartphone,
      title: t('services.mobile.title'),
      description: t('services.mobile.desc'),
      features: [
        { ru: 'iOS и Android приложения', kz: 'iOS және Android қосымшалары', en: 'iOS and Android applications' },
        { ru: 'MVP за 4-8 недель', kz: '4-8 аптада MVP', en: 'MVP in 4-8 weeks' },
        { ru: 'Интеграция с API и сервисами', kz: 'API және қызметтермен интеграция', en: 'API and service integration' },
        { ru: 'Push-уведомления и аналитика', kz: 'Push хабарландырулар және аналитика', en: 'Push notifications and analytics' },
        { ru: 'Публикация в App Store и Google Play', kz: 'App Store және Google Play жариялау', en: 'Publishing to App Store and Google Play' },
      ],
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600',
    },
    {
      icon: Server,
      title: { ru: 'Backend Development', kz: 'Backend әзірлеу', en: 'Backend Development' }[language],
      description: { 
        ru: 'Надёжные серверные решения для бизнес-логики и обработки данных', 
        kz: 'Бизнес-логика және деректерді өңдеуге арналған сенімді сервер шешімдері', 
        en: 'Reliable server solutions for business logic and data processing' 
      }[language],
      features: [
        { ru: 'REST API и GraphQL', kz: 'REST API және GraphQL', en: 'REST API and GraphQL' },
        { ru: 'Микросервисная архитектура', kz: 'Микросервистік архитектура', en: 'Microservice architecture' },
        { ru: 'Базы данных: SQL, NoSQL', kz: 'Дерекқорлар: SQL, NoSQL', en: 'Databases: SQL, NoSQL' },
        { ru: 'Real-time и WebSocket', kz: 'Real-time және WebSocket', en: 'Real-time and WebSocket' },
        { ru: 'Оптимизация и масштабирование', kz: 'Оңтайландыру және масштабтау', en: 'Optimization and scaling' },
      ],
      technologies: ['Node.js', 'Python', 'Java', 'С#', 'PostgreSQL', 'MongoDB'],
      gradient: 'from-green-500/20 to-emerald-500/20',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-600',
    },
    {
      icon: Brain,
      title: { ru: 'Machine Learning & AI', kz: 'Machine Learning & AI', en: 'Machine Learning & AI' }[language],
      description: { 
        ru: 'Интеграция искусственного интеллекта и машинного обучения в ваш продукт', 
        kz: 'Өніміңізге жасанды интеллект пен машиналық оқытуды интеграциялау', 
        en: 'Integration of artificial intelligence and machine learning into your product' 
      }[language],
      features: [
        { ru: 'NLP и чат-боты с пониманием контекста', kz: 'NLP және контекстті түсінетін чат-боттар', en: 'NLP and contextual chatbots' },
        { ru: 'Компьютерное зрение и распознавание', kz: 'Компьютерлік көру және тану', en: 'Computer vision and recognition' },
        { ru: 'Рекомендательные системы', kz: 'Ұсыныс жүйелері', en: 'Recommendation systems' },
        { ru: 'Предиктивная аналитика и прогнозирование', kz: 'Болжамдық аналитика және болжау', en: 'Predictive analytics and forecasting' },
        { ru: 'Интеграция с OpenAI, Anthropic, Google AI', kz: 'OpenAI, Anthropic, Google AI интеграциясы', en: 'Integration with OpenAI, Anthropic, Google AI' },
      ],
      technologies: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI API', 'scikit-learn'],
      gradient: 'from-orange-500/20 to-red-500/20',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-600',
    },
    {
      icon: Palette,
      title: { ru: 'UX/UI Design', kz: 'UX/UI Дизайн', en: 'UX/UI Design' }[language],
      description: { 
        ru: 'Дизайн интерфейсов, который увеличивает конверсию и улучшает пользовательский опыт', 
        kz: 'Конверсияны арттыратын және пайдаланушы тәжірибесін жақсартатын интерфейс дизайны', 
        en: 'Interface design that increases conversion and improves user experience' 
      }[language],
      features: [
        { ru: 'User Research и CJM', kz: 'User Research және CJM', en: 'User Research and CJM' },
        { ru: 'Прототипирование и тестирование', kz: 'Прототиптеу және тестілеу', en: 'Prototyping and testing' },
        { ru: 'Дизайн-системы и UI-киты', kz: 'Дизайн жүйелері және UI киттер', en: 'Design systems and UI kits' },
        { ru: 'Адаптивный дизайн (mobile + desktop)', kz: 'Адаптивті дизайн (mobile + desktop)', en: 'Responsive design (mobile + desktop)' },
        { ru: 'Анимации и микровзаимодействия', kz: 'Анимациялар және микроөзара әрекеттесулер', en: 'Animations and micro-interactions' },
      ],
      technologies: ['Figma', 'Adobe XD', 'Sketch', 'Principle', 'ProtoPie'],
      gradient: 'from-pink-500/20 to-rose-500/20',
      iconBg: 'bg-pink-500/10',
      iconColor: 'text-pink-600',
    },
    {
      icon: DollarSign,
      title: { ru: 'Интеграция 1С', kz: '1С Интеграциясы', en: '1C Integration' }[language],
      description: { 
        ru: 'Интеграция веб и мобильных приложений с системой 1С для автоматизации бизнес-процессов', 
        kz: 'Бизнес-процестерді автоматтандыруға арналған веб және мобильді қосымшаларды 1С жүйесімен интеграциялау', 
        en: 'Integration of web and mobile apps with 1C system for business process automation' 
      }[language],
      features: [
        { ru: 'Синхронизация данных с 1С', kz: '1С-пен деректерді синхрондау', en: 'Data synchronization with 1C' },
        { ru: 'REST API для 1С:Предприятие', kz: '1С:Предриятие үшін REST API', en: 'REST API for 1C:Enterprise' },
        { ru: 'Обмен номенклатурой и заказами', kz: 'Номенклатура және тапсырыстармен алмасу', en: 'Exchange of nomenclature and orders' },
        { ru: 'Интеграция с 1С:Бухгалтерия', kz: '1С:Бухгалтерия интеграциясы', en: 'Integration with 1C:Accounting' },
        { ru: 'Выгрузка отчётов и документов', kz: 'Есептер мен құжаттарды жүктеу', en: 'Export of reports and documents' },
      ],
      technologies: ['1C:Enterprise', 'REST API', 'SOAP', 'XML', 'JSON'],
      gradient: 'from-yellow-500/20 to-amber-500/20',
      iconBg: 'bg-yellow-500/10',
      iconColor: 'text-yellow-600',
    },
    {
      icon: Users,
      title: t('services.staff.title'),
      description: t('services.staff.desc'),
      features: [
        { ru: 'Frontend: React, Vue, Angular', kz: 'Frontend: React, Vue, Angular', en: 'Frontend: React, Vue, Angular' },
        { ru: 'Backend: Node.js, Python, Go, Java', kz: 'Backend: Node.js, Python, Go, Java', en: 'Backend: Node.js, Python, Go, Java' },
        { ru: 'Mobile: iOS, Android, React Native', kz: 'Mobile: iOS, Android, React Native', en: 'Mobile: iOS, Android, React Native' },
        { ru: 'QA, DevOps, UI/UX дизайнеры', kz: 'QA, DevOps, UI/UX дизайнерлер', en: 'QA, DevOps, UI/UX designers' },
        { ru: 'Part-time или Full-time занятость', kz: 'Part-time немесе Full-time', en: 'Part-time or Full-time engagement' },
      ],
      technologies: ['Flexible', 'On-demand', 'Remote', 'Senior', 'Vetted'],
      gradient: 'from-indigo-500/20 to-violet-500/20',
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero - Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1973AE] via-[#1973AE] to-[#39D2ED]">
        <div className="absolute inset-0 opacity-10">
          <OrbitalVisual variant="services" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
              {t('services.title')}
            </h1>
            <p className="text-2xl md:text-3xl text-white/95 leading-relaxed">
              {language === 'ru' && 'От идеи до запуска: дизайн, разработка, интеграция и поддержка'}
              {language === 'kz' && 'Идеядан іске қосуға дейін: дизайн, әзірлеу, интеграция және қолдау'}
              {language === 'en' && 'From idea to launch: design, development, integration and support'}
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-32">
            {services.map((service, idx) => {
              const Icon = service.icon;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  className="relative"
                >
                  {/* Background orbital for each service */}
                  <div className="absolute inset-0 -z-10">
                    <OrbitalBackground 
                      variant="small" 
                      position={isEven ? 'left' : 'right'} 
                      className="opacity-10" 
                    />
                  </div>

                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                      !isEven ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Content */}
                    <div className={isEven ? '' : 'lg:order-2'}>
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl ${service.iconBg} mb-6 shadow-lg`}>
                        <Icon className={`h-10 w-10 ${service.iconColor}`} />
                      </div>
                      <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        {service.title}
                      </h2>
                      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Features */}
                      <ul className="space-y-4 mb-8">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start space-x-3 group">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#1973AE] to-[#39D2ED] flex items-center justify-center mt-0.5">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{feature[language]}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {service.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-[#D1EDF4]/30 hover:to-[#D1EDF4]/50 border border-gray-200 text-gray-700 text-sm rounded-xl font-medium transition-all hover:scale-105 hover:shadow-md cursor-default"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-[#1973AE] to-[#39D2ED] hover:from-[#155a8a] hover:to-[#2ab8d1] text-white shadow-lg hover:shadow-xl transition-all"
                        onClick={() => {
                          window.location.hash = 'home';
                          setTimeout(() => {
                            document.querySelector('#contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                        }}
                      >
                        {language === 'ru' && 'Обсудить проект'}
                        {language === 'kz' && 'Жобаны талқылау'}
                        {language === 'en' && 'Discuss Project'}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>

                    {/* Visual */}
                    <div className={isEven ? '' : 'lg:order-1'}>
                      {idx === 0 ? (
                        // Web services - use photo
                        <div className="relative aspect-square rounded-3xl shadow-2xl overflow-hidden group">
                          <img 
                            src={webServicesImage} 
                            alt="Web Development Services"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-br from-[#1973AE]/20 to-[#39D2ED]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      ) : idx === 1 ? (
                        // Mobile services - use photo
                        <div className="relative aspect-square rounded-3xl shadow-2xl overflow-hidden group">
                          <img 
                            src={mobileServicesImage} 
                            alt="Mobile Development Services"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-br from-[#1973AE]/20 to-[#39D2ED]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      ) : idx === 2 ? (
                        // Backend services - use photo
                        <div className="relative aspect-square rounded-3xl shadow-2xl overflow-hidden group">
                          <img 
                            src={backendServicesImage} 
                            alt="Backend Development Services"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-br from-[#1973AE]/20 to-[#39D2ED]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      ) : idx === 3 ? (
                        // AI services - use photo
                        <div className="relative aspect-square rounded-3xl shadow-2xl overflow-hidden group">
                          <img 
                            src={aiServicesImage} 
                            alt="AI Development Services"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-br from-[#1973AE]/20 to-[#39D2ED]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      ) : idx === 4 ? (
                        // Design services - use photo
                        <div className="relative aspect-square rounded-3xl shadow-2xl overflow-hidden group">
                          <img 
                            src={designServicesImage} 
                            alt="Design Development Services"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-br from-[#1973AE]/20 to-[#39D2ED]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      ) : idx === 5 ? (
                        // 1C services - use photo
                        <div className="relative aspect-square rounded-3xl shadow-2xl overflow-hidden group">
                          <img 
                            src={oneCServicesImage} 
                            alt="1C Development Services"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-br from-[#1973AE]/20 to-[#39D2ED]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      ) : idx === 6 ? (
                        // Staff services - use photo
                        <div className="relative aspect-square rounded-3xl shadow-2xl overflow-hidden group">
                          <img 
                            src={staffServicesImage} 
                            alt="Staff Development Services"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-br from-[#1973AE]/20 to-[#39D2ED]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      ) : (
                        // Other services - keep icon design
                        <div className={`relative aspect-square rounded-3xl bg-gradient-to-br ${service.gradient} p-12 flex items-center justify-center shadow-2xl overflow-hidden group`}>
                          {/* Animated background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* Main icon */}
                          <Icon className={`h-64 w-64 ${service.iconColor} opacity-20 group-hover:opacity-30 transition-all duration-500 group-hover:scale-110 relative z-10`} />
                          
                          {/* Decorative circles */}
                          <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white/30 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                          <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-white/20 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 bg-gradient-to-br from-[#1973AE] via-[#39D2ED] to-[#1973AE] overflow-hidden">
        <OrbitalBackground variant="default" position="center" className="opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {language === 'ru' && 'Получить оценку проекта'}
              {language === 'kz' && 'Жобаға баға алу'}
              {language === 'en' && 'Get Project Estimate'}
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              {language === 'ru' && 'Опишите задачу — предложим решение, назовём сроки и стоимость в течение 24 часов'}
              {language === 'kz' && 'Тапсырманы сипаттаңыз — 24 сағат ішінде шешім, мерзімдер мен құнды айтамыз'}
              {language === 'en' && 'Describe your challenge — we\'ll propose solution, timeline and cost within 24 hours'}
            </p>
            <Button
              size="lg"
              className="bg-white text-[#1973AE] hover:bg-gray-50 shadow-2xl hover:shadow-3xl transition-all hover:scale-105 text-lg px-8 py-6"
              onClick={() => {
                window.location.hash = 'home';
                setTimeout(() => {
                  document.querySelector('#contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }}
            >
              {t('nav.cta')}
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}