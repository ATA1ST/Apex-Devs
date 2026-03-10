import { useLanguage } from '../contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import reactLogo from '../../assets/080b74020161e2259f2239ca16a15ba9a00da8c1.png';
import typescriptLogo from '../../assets/85967f59365c5db0c089312c17bf6d49187e1166.png';
import nodeLogo from '../../assets/f27d31c3c18cc27f5cf37b5ff7cafa42f9e9a987.png';
import nextjsLogo from '../../assets/3c687d75400d4763352416da17345ae04675ebc6.png';
import aspnetLogo from '../../assets/f3435ee298ae8f0f3cee516003526b34fe3d4dc9.png';
import springLogo from '../../assets/4199071891e849f8c8081829f035eb7f6171bd8d.png';
import laravelLogo from '../../assets/505e68602b6b65dd91c439fef51641e477ddc7f1.png';
import reactNativeLogo from '../../assets/0aba0f0d5b3fe9556bb955e51dd2f944f451c044.png';
import postgresqlLogo from '../../assets/a113fcd5fce766e6d6e8760cf6a827ebd923220a.png';
import dockerLogo from '../../assets/258d4390204c00291a2aa131bb5a25e07f1a1ad5.png';
import javascriptLogo from '../../assets/cac58c0547f173483462783648a0508951448695.png';
import djangoLogo from '../../assets/d8da5fcb08892770e240353eee287d8146c8682a.png';
import golangLogo from '../../assets/4beb87bfb2f4c5ff00f9af5b48f41504b142bd32.png';
import flutterLogo from '../../assets/2ce3e53251c9c6e4d051d2c8e99b9d73d2a3e0e7.png';
import swiftLogo from '../../assets/39a95fb552d8d615001e56305fc74d41f97f4625.png';
import kotlinLogo from '../../assets/44e03ace20846673ee8676a9d09502d40c78868d.png';

export function TechnologyTabs() {
  const { language } = useLanguage();

  const autoplayPlugin = Autoplay({ delay: 3000, stopOnInteraction: false });

  return (
    <Tabs defaultValue="frontend" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 mb-8 bg-transparent h-auto">
        <TabsTrigger 
          value="frontend" 
          className="data-[state=active]:bg-[#1973AE] data-[state=active]:text-white py-3 px-6 rounded-xl border-2 border-[#1973AE]/20"
        >
          {language === 'ru' && 'Frontend'}
          {language === 'kz' && 'Frontend'}
          {language === 'en' && 'Frontend'}
        </TabsTrigger>
        <TabsTrigger 
          value="backend" 
          className="data-[state=active]:bg-[#1973AE] data-[state=active]:text-white py-3 px-6 rounded-xl border-2 border-[#1973AE]/20"
        >
          {language === 'ru' && 'Backend'}
          {language === 'kz' && 'Backend'}
          {language === 'en' && 'Backend'}
        </TabsTrigger>
        <TabsTrigger 
          value="mobile" 
          className="data-[state=active]:bg-[#1973AE] data-[state=active]:text-white py-3 px-6 rounded-xl border-2 border-[#1973AE]/20"
        >
          {language === 'ru' && 'Mobile'}
          {language === 'kz' && 'Mobile'}
          {language === 'en' && 'Mobile'}
        </TabsTrigger>
        <TabsTrigger 
          value="infrastructure" 
          className="data-[state=active]:bg-[#1973AE] data-[state=active]:text-white py-3 px-6 rounded-xl border-2 border-[#1973AE]/20"
        >
          {language === 'ru' && 'Infrastructure'}
          {language === 'kz' && 'Infrastructure'}
          {language === 'en' && 'Infrastructure'}
        </TabsTrigger>
      </TabsList>

      {/* Frontend */}
      <TabsContent value="frontend" className="mt-0">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplayPlugin]}
          className="w-full"
        >
          <CarouselContent>
            {/* React */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#61DAFB]/10 rounded-xl flex items-center justify-center mb-6">
                  <img src={reactLogo} alt="React" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">React</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Современная библиотека для создания интерактивных пользовательских интерфейсов. Используем для построения динамичных веб-приложений с component-based архитектурой и виртуальным DOM для максимальной производительности.'}
                  {language === 'kz' && 'Интерактивті пайдаланушы интерфейстерін жасауға арналған заманауи кітапхана. Максималды өнімділікке арналған component-based архитектурасы және виртуалды DOM бар динамикалық веб-қосымшаларды құруға пайдаланамыз.'}
                  {language === 'en' && 'Modern library for building interactive user interfaces. We use it to build dynamic web applications with component-based architecture and virtual DOM for maximum performance.'}
                </p>
              </div>
            </CarouselItem>

            {/* Next.js */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-black/5 rounded-xl flex items-center justify-center mb-6">
                  <img src={nextjsLogo} alt="Next.js" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Next.js</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'React-фреймворк для production с server-side rendering. Обеспечивает оптимальную производительность, SEO-оптимизацию и отличный developer experience. Поддержка статической генерации и инкрементальной регенерации.'}
                  {language === 'kz' && 'Server-side rendering бар production үшін React фреймворк. Оңтайлы өнімділікті, SEO-оңтайландыруды және керемет developer experience қамтамасыз етеді. Статикалық генерация және инкрементальді регенерацияны қолдайды.'}
                  {language === 'en' && 'React framework for production with server-side rendering. Provides optimal performance, SEO optimization and excellent developer experience. Supports static generation and incremental regeneration.'}
                </p>
              </div>
            </CarouselItem>

            {/* Angular */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#DD0031]/10 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L3 6L4.5 18L12 22L19.5 18L21 6L12 2Z" fill="#DD0031"/>
                    <path d="M12 2V22M3 6L12 12L21 6" stroke="white" strokeWidth="1.5"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Angular</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Enterprise-фреймворк от Google для масштабируемых SPA. Полнофункциональная платформа с TypeScript, dependency injection, powerful CLI и встроенным тестированием. Идеален для крупных корпоративных проектов.'}
                  {language === 'kz' && 'Масштабталатын SPA үшін Google-дан Enterprise фреймворк. TypeScript, dependency injection, powerful CLI және кірістірілген тестілеумен толық функционалды платформа. Ірі корпоративтік жобаларға өте жақсы.'}
                  {language === 'en' && 'Enterprise framework from Google for scalable SPAs. Full-featured platform with TypeScript, dependency injection, powerful CLI and built-in testing. Ideal for large corporate projects.'}
                </p>
              </div>
            </CarouselItem>

            {/* Vue.js */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#42B883]/10 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <path d="M2 3L12 21L22 3H18L12 14L6 3H2Z" fill="#42B883"/>
                    <path d="M6 3L12 14L18 3H14.5L12 7L9.5 3H6Z" fill="#35495E"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Vue.js</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Прогрессивный JavaScript фреймворк для создания пользовательских интерфейсов. Простой в изучении, гибкий и производительный. Отличная реактивность, composition API и богатая экосистема плагинов.'}
                  {language === 'kz' && 'Пайдаланушы интерфейстерін жасауға арналған прогрессивті JavaScript фреймворк. Үйренуге оңай, икемді және өнімді. Керемет реактивтілік, composition API және бай плагиндер экожүйесі.'}
                  {language === 'en' && 'Progressive JavaScript framework for building user interfaces. Easy to learn, flexible and performant. Excellent reactivity, composition API and rich plugin ecosystem.'}
                </p>
              </div>
            </CarouselItem>

            {/* TypeScript */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#3178C6]/10 rounded-xl flex items-center justify-center mb-6">
                  <img src={typescriptLogo} alt="TypeScript" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">TypeScript</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Типизированный superset JavaScript для надёжного кода. Обеспечивает раннее выявление ошибок, улучшает поддерживаемость и рефакторинг больших проектов. Отличная IDE-поддержка и автодополнение.'}
                  {language === 'kz' && 'Сенімді код үшін типтелген JavaScript superset. Қателерді ерте анықтауды қамтамасыз етеді, үлкен жобаларды қолдауды және рефакторингті жақсартады. Керемет IDE қолдауы және автотолтыру.'}
                  {language === 'en' && 'Typed superset of JavaScript for reliable code. Provides early error detection, improves maintainability and refactoring of large projects. Excellent IDE support and auto-completion.'}
                </p>
              </div>
            </CarouselItem>

            {/* JavaScript */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#F7DF1E]/10 rounded-xl flex items-center justify-center mb-6">
                  <img src={javascriptLogo} alt="JavaScript" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">JavaScript</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Основа современного веба и универсальный язык программирования. Работает в браузере и на сервере (Node.js). Огромная экосистема библиотек, активное сообщество и постоянное развитие стандарта.'}
                  {language === 'kz' && 'Заманауи веб негізі және әмбебап бағдарламалау тілі. Браузерде және серверде (Node.js) жұмыс істейді. Үлкен кітапханалар экожүйесі, белсенді қауымдастық және стандарттың үнемі дамуы.'}
                  {language === 'en' && 'Foundation of modern web and universal programming language. Works in browser and on server (Node.js). Huge ecosystem of libraries, active community and continuous standard development.'}
                </p>
              </div>
            </CarouselItem>

            {/* Tailwind CSS */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#06B6D4]/10 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <path d="M12 6C9.33 6 7.67 7.33 7 10C8 8.67 9.17 8.17 10.5 8.5C11.26 8.68 11.81 9.24 12.41 9.86C13.39 10.88 14.53 12 17 12C19.67 12 21.33 10.67 22 8C21 9.33 19.83 9.83 18.5 9.5C17.74 9.32 17.19 8.76 16.59 8.14C15.61 7.12 14.47 6 12 6Z" fill="#06B6D4"/>
                    <path d="M7 12C4.33 12 2.67 13.33 2 16C3 14.67 4.17 14.17 5.5 14.5C6.26 14.68 6.81 15.24 7.41 15.86C8.39 16.88 9.53 18 12 18C14.67 18 16.33 16.67 17 14C16 15.33 14.83 15.83 13.5 15.5C12.74 15.32 12.19 14.76 11.59 14.14C10.61 13.12 9.47 12 7 12Z" fill="#06B6D4"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Tailwind CSS</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Utility-first CSS фреймворк для быстрой разработки. Позволяет создавать кастомные дизайны без написания CSS. Оптимизация производительности через PurgeCSS, темы, адаптивность и dark mode из коробки.'}
                  {language === 'kz' && 'Жылдам әзірлеуге арналған Utility-first CSS фреймворк. CSS жазбай-ақ кастомды дизайндар жасауға мүмкіндік береді. PurgeCSS арқылы өнімділікті оңтайландыру, темалар, адаптивтілік және қораптан dark mode.'}
                  {language === 'en' && 'Utility-first CSS framework for rapid development. Allows creating custom designs without writing CSS. Performance optimization through PurgeCSS, themes, responsiveness and dark mode out of the box.'}
                </p>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </TabsContent>

      {/* Backend */}
      <TabsContent value="backend" className="mt-0">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
          className="w-full"
        >
          <CarouselContent>
            {/* ASP.NET Core */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#512BD4]/10 rounded-xl flex items-center justify-center mb-6">
                  <img src={aspnetLogo} alt="ASP.NET Core" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">ASP.NET Core</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Кроссплатформенная платформа Microsoft для веб-разработки. Высокая производительность, встроенная безопасность, middleware pipeline, dependency injection. Идеальна для enterprise-приложений и микросервисов.'}
                  {language === 'kz' && 'Веб-әзірлеуге арналған Microsoft кроссплатформалық платформасы. Жоғары өнімділік, кірістірілген қауіпсіздік, middleware pipeline, dependency injection. Enterprise қосымшалары мен микросервистерге өте жақсы.'}
                  {language === 'en' && 'Cross-platform Microsoft platform for web development. High performance, built-in security, middleware pipeline, dependency injection. Ideal for enterprise applications and microservices.'}
                </p>
              </div>
            </CarouselItem>

            {/* Spring Boot (Java) */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#6DB33F]/10 rounded-xl flex items-center justify-center mb-6">
                  <img src={springLogo} alt="Spring Boot" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Spring Boot (Java)</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Мощный enterprise-фреймворк на Java для создания production-ready приложений. Автоконфигурация, встроенные серверы, Spring Security, JPA/Hibernate. Отличная масштабируемость и стабильность.'}
                  {language === 'kz' && 'Production-ready қосымшаларды жасауға арналған Java-дағы қуатты enterprise фреймворк. Автоконфигурация, кірістірілген серверлер, Spring Security, JPA/Hibernate. Керемет масштабталу және тұрақтылық.'}
                  {language === 'en' && 'Powerful enterprise framework on Java for creating production-ready applications. Auto-configuration, embedded servers, Spring Security, JPA/Hibernate. Excellent scalability and stability.'}
                </p>
              </div>
            </CarouselItem>

            {/* Node.js (Express.js) */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#339933]/10 rounded-xl flex items-center justify-center mb-6">
                  <img src={nodeLogo} alt="Node.js" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Node.js (Express.js)</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'JavaScript runtime для backend на движке V8. Event-driven, non-blocking I/O модель для высокопроизводительных приложений. Express.js - минималистичный и гибкий веб-фреймворк с огромной экосистемой middleware.'}
                  {language === 'kz' && 'V8 қозғалтқышындағы backend үшін JavaScript runtime. Жоғары өнімді қосымшаларға арналған Event-driven, non-blocking I/O үлгісі. Express.js - үлкен middleware экожүйесі бар минималистік және икемді веб-фреймворк.'}
                  {language === 'en' && 'JavaScript runtime for backend on V8 engine. Event-driven, non-blocking I/O model for high-performance applications. Express.js - minimalist and flexible web framework with huge middleware ecosystem.'}
                </p>
              </div>
            </CarouselItem>

            {/* PHP (Laravel) */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#FF2D20]/10 rounded-xl flex items-center justify-center mb-6">
                  <img src={laravelLogo} alt="Laravel" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">PHP (Laravel)</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Элегантный PHP-фреймворк для веб-разработки. Expressive синтаксис, Eloquent ORM, мощная система роутинга, встроенная аутентификация. Богатая экосистема пакетов и отличная документация.'}
                  {language === 'kz' && 'Веб-әзірлеуге арналған әдемі PHP фреймворк. Expressive синтаксис, Eloquent ORM, қуатты роутинг жүйесі, кірістірілген аутентификация. Бай пакеттер экожүйесі және керемет құжаттама.'}
                  {language === 'en' && 'Elegant PHP framework for web development. Expressive syntax, Eloquent ORM, powerful routing system, built-in authentication. Rich package ecosystem and excellent documentation.'}
                </p>
              </div>
            </CarouselItem>

            {/* Python (Django) */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#092E20]/10 rounded-xl flex items-center justify-center mb-6">
                  <img src={djangoLogo} alt="Django" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Python (Django)</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Высокоуровневый Python веб-фреймворк, следующий принципу "batteries included". Встроенная админ-панель, ORM, формы, аутентификация. Быстрая разработка, безопасность из коробки и масштабируемость.'}
                  {language === 'kz' && '"Batteries included" принципін ұстанатын жоғары деңгейлі Python веб-фреймворк. Кірістірілген админ панелі, ORM, формалар, аутентификация. Жылдам әзірлеу, қораптан қауіпсіздік және масштабталу.'}
                  {language === 'en' && 'High-level Python web framework following "batteries included" principle. Built-in admin panel, ORM, forms, authentication. Rapid development, security out of the box and scalability.'}
                </p>
              </div>
            </CarouselItem>

            {/* Golang (Gin) */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#00ADD8]/10 rounded-xl flex items-center justify-center mb-6">
                  <img src={golangLogo} alt="Golang" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Golang (Gin)</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Быстрый язык от Google для высоконагруженных микросервисов. Gin - производительный веб-фреймворк с минимальными накладными расходами. Concurrency через goroutines, быстрая компиляция, статическая типизация.'}
                  {language === 'kz' && 'Жоғары жүктемелі микросервистерге арналған Google-дан жылдам тіл. Gin - минималды қосымша шығындары бар өнімді веб-фреймворк. Goroutines арқылы concurrency, жылдам компиляция, статикалық типтеу.'}
                  {language === 'en' && 'Fast language from Google for high-load microservices. Gin - performant web framework with minimal overhead. Concurrency via goroutines, fast compilation, static typing.'}
                </p>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </TabsContent>

      {/* Mobile */}
      <TabsContent value="mobile" className="mt-0">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
          className="w-full"
        >
          <CarouselContent>
            {/* Dart (Flutter) */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#02569B]/10 rounded-xl flex items-center justify-center mb-6">
                  <img src={flutterLogo} alt="Flutter" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Dart (Flutter)</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Кроссплатформенный UI фреймворк от Google на языке Dart. Создаём красивые нативные приложения для мобильных, веб и десктоп из единой кодовой базы. Hot reload, Material и Cupertino виджеты, отличная производительность.'}
                  {language === 'kz' && 'Dart тілінде Google-дан кроссплатформалық UI фреймворк. Бірыңғай код базасынан мобильді, веб және десктопқа арналған әдемі нативті қосымшаларды жасаймыз. Hot reload, Material және Cupertino виджеттері, керемет өнімділік.'}
                  {language === 'en' && 'Cross-platform UI framework from Google in Dart language. We create beautiful native apps for mobile, web and desktop from single codebase. Hot reload, Material and Cupertino widgets, excellent performance.'}
                </p>
              </div>
            </CarouselItem>

            {/* React Native */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#61DAFB]/10 rounded-xl flex items-center justify-center mb-6">
                  <img src={reactNativeLogo} alt="React Native" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">React Native</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Создание нативных мобильных приложений на React. Единая кодовая база для iOS и Android, доступ к нативным API, hot reload. Огромная экосистема библиотек, активное сообщество и поддержка от Meta (Facebook).'}
                  {language === 'kz' && 'React-те нативті мобильді қосымшаларды жасау. iOS және Android үшін бірыңғай код базасы, нативті API қолжетімділігі, hot reload. Үлкен кітапханалар экожүйесі, белсенді қауымдастық және Meta (Facebook) қолдауы.'}
                  {language === 'en' && 'Creating native mobile apps with React. Single codebase for iOS and Android, access to native APIs, hot reload. Huge ecosystem of libraries, active community and support from Meta (Facebook).'}
                </p>
              </div>
            </CarouselItem>

            {/* Swift (iOS) */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#F05138]/10 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <rect x="6" y="4" width="12" height="16" rx="2" stroke="#F05138" strokeWidth="2" fill="none"/>
                    <circle cx="12" cy="17" r="0.5" fill="#F05138"/>
                    <path d="M9 4H15" stroke="#F05138" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Swift (iOS)</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Современный язык Apple для нативной iOS/macOS разработки. Быстрый, безопасный, выразительный синтаксис. SwiftUI для декларативного UI, полный доступ к iOS SDK, оптимальная производительность и интеграция.'}
                  {language === 'kz' && 'Нативті iOS/macOS әзірлеуге арналған заманауи Apple тілі. Жылдам, қауіпсіз, көрнекі синтаксис. Декларативті UI үшін SwiftUI, iOS SDK толық қолжетімділігі, оңтайлы өнімділік және интеграция.'}
                  {language === 'en' && 'Modern Apple language for native iOS/macOS development. Fast, safe, expressive syntax. SwiftUI for declarative UI, full access to iOS SDK, optimal performance and integration.'}
                </p>
              </div>
            </CarouselItem>

            {/* Kotlin (Android) */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#7F52FF]/10 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="3" width="14" height="18" rx="2" stroke="#7F52FF" strokeWidth="2" fill="none"/>
                    <circle cx="12" cy="18" r="1" fill="#7F52FF"/>
                    <rect x="8" y="6" width="8" height="9" rx="1" fill="#7F52FF" opacity="0.2"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Kotlin (Android)</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Официальный язык для Android от JetBrains. Современный, лаконичный, null-safety из коробки. Jetpack Compose для современного UI, полная совместимость с Java, coroutines для асинхронности.'}
                  {language === 'kz' && 'JetBrains-тан Android үшін ресми тіл. Заманауи, қысқа, қораптан null-safety. Заманауи UI үшін Jetpack Compose, Java-мен толық үйлесімділік, асинхрондылыққа арналған coroutines.'}
                  {language === 'en' && 'Official language for Android from JetBrains. Modern, concise, null-safety out of the box. Jetpack Compose for modern UI, full compatibility with Java, coroutines for async.'}
                </p>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </TabsContent>

      {/* Infrastructure */}
      <TabsContent value="infrastructure" className="mt-0">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
          className="w-full"
        >
          <CarouselContent>
            {/* PostgreSQL */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#336791]/10 rounded-xl flex items-center justify-center mb-6">
                  <img src={postgresqlLogo} alt="PostgreSQL" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">PostgreSQL</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Мощная open-source реляционная СУБД. ACID-транзакции, поддержка JSON, полнотекстовый поиск, расширяемость. Высокая надёжность, безопасность и производительность для enterprise-решений.'}
                  {language === 'kz' && 'Қуатты open-source реляциялық ДҚБЖ. ACID-транзакциялар, JSON қолдауы, толық мәтінді іздеу, кеңейтілгіштік. Enterprise шешімдеріне арналған жоғары сенімділік, қауіпсіздік және өнімділік.'}
                  {language === 'en' && 'Powerful open-source relational DBMS. ACID transactions, JSON support, full-text search, extensibility. High reliability, security and performance for enterprise solutions.'}
                </p>
              </div>
            </CarouselItem>

            {/* MongoDB */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#47A248]/10 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3L4 7.5V16.5L12 21L20 16.5V7.5L12 3Z" fill="#47A248"/>
                    <path d="M12 12V21M4 7.5L12 12L20 7.5" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">MongoDB</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'NoSQL документо-ориентированная база данных. Гибкая схема данных, горизонтальное масштабирование, репликация. Идеальна для работы с большими объёмами неструктурированных данных и быстрой итерации.'}
                  {language === 'kz' && 'NoSQL құжатқа бағытталған дерекқор. Икемді деректер схемасы, көлденең масштабтау, репликация. Үлкен көлемдегі құрылымсыз деректермен жұмыс істеу және жылдам итерацияға өте жақсы.'}
                  {language === 'en' && 'NoSQL document-oriented database. Flexible data schema, horizontal scaling, replication. Ideal for working with large volumes of unstructured data and rapid iteration.'}
                </p>
              </div>
            </CarouselItem>

            {/* Redis */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#DC382D]/10 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#DC382D"/>
                    <path d="M2 17L12 22L22 17L12 12L2 17Z" fill="#DC382D" opacity="0.6"/>
                    <path d="M2 12L12 17L22 12" stroke="#DC382D" strokeWidth="2" fill="none" opacity="0.4"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Redis</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'In-memory хранилище данных и кэш. Экстремально быстрая работа, поддержка различных структур данных (строки, списки, sets, hashes). Pub/Sub, транзакции, персистентность. Идеален для кэширования и сессий.'}
                  {language === 'kz' && 'In-memory деректерді сақтау және кэш. Өте жылдам жұмыс, әртүрлі деректер құрылымдарын қолдау (жолдар, тізімдер, sets, hashes). Pub/Sub, транзакциялар, тұрақтылық. Кэштеуге және сессияларға өте жақсы.'}
                  {language === 'en' && 'In-memory data store and cache. Extremely fast performance, support for various data structures (strings, lists, sets, hashes). Pub/Sub, transactions, persistence. Ideal for caching and sessions.'}
                </p>
              </div>
            </CarouselItem>

            {/* MySQL */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#4479A1]/10 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12C5 12 7 10 9 10C11 10 11 12 13 12C15 12 17 10 17 10V14C17 14 15 16 13 16C11 16 11 14 9 14C7 14 5 16 5 16V12Z" fill="#4479A1"/>
                    <circle cx="6" cy="8" r="1.5" fill="#4479A1"/>
                    <circle cx="10" cy="8" r="1.5" fill="#4479A1"/>
                    <circle cx="14" cy="8" r="1.5" fill="#4479A1"/>
                    <circle cx="18" cy="8" r="1.5" fill="#4479A1"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">MySQL</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Популярная open-source реляционная СУБД. Надёжность, простота использования, отличная производительность. Поддержка ACID, репликация, партиционирование. Широко используется в веб-разработке и enterprise-проектах.'}
                  {language === 'kz' && 'Таны��ал open-source реляциялық ДҚБЖ. Сенімділік, пайдалану қарапайымдылығы, керемет өнімділік. ACID қолдауы, репликация, партициялау. Веб-әзірлеу және enterprise жобаларда кеңінен қолданылады.'}
                  {language === 'en' && 'Popular open-source relational DBMS. Reliability, ease of use, excellent performance. ACID support, replication, partitioning. Widely used in web development and enterprise projects.'}
                </p>
              </div>
            </CarouselItem>

            {/* Docker */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#2496ED]/10 rounded-xl flex items-center justify-center mb-6">
                  <img src={dockerLogo} alt="Docker" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Docker</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Платформа контейнеризации для стабильного деплоя. Изоляция приложений, гарантия одинаковой работы в любой среде. Docker Compose для оркестрации, layers для оптимизации. Упрощает развёртывание и CI/CD.'}
                  {language === 'kz' && 'Тұрақты деплойға арналған контейнерлеу платформасы. Қосымшаларды оқшаулау, кез келген ортада бірдей жұмыс кепілдігі. Оркестрацияға арналған Docker Compose, оңтайландыруға арналған layers. Орналастыру мен CI/CD жеңілдетеді.'}
                  {language === 'en' && 'Containerization platform for stable deployment. Application isolation, guarantee of consistent operation in any environment. Docker Compose for orchestration, layers for optimization. Simplifies deployment and CI/CD.'}
                </p>
              </div>
            </CarouselItem>

            {/* Kubernetes */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#326CE5]/10 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="#326CE5" strokeWidth="2" fill="none"/>
                    <circle cx="12" cy="12" r="3" fill="#326CE5"/>
                    <path d="M12 9V2M12 22V15M9 12L3 9M21 9L15 12M9 12L3 15M21 15L15 12" stroke="#326CE5" strokeWidth="1.5"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Kubernetes</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Оркестрация контейнеров для production. Автоматическое масштабирование, self-healing, rolling updates. Service discovery, load balancing, secret management. Стандарт для cloud-native приложений.'}
                  {language === 'kz' && 'Production үшін контейнерлерді оркестрация. Автоматты масштабтау, self-healing, rolling updates. Service discovery, load balancing, secret management. Cloud-native қосымшаларға стандарт.'}
                  {language === 'en' && 'Container orchestration for production. Auto-scaling, self-healing, rolling updates. Service discovery, load balancing, secret management. Standard for cloud-native applications.'}
                </p>
              </div>
            </CarouselItem>

            {/* AWS */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#FF9900]/10 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <path d="M6 14L12 18L18 14M6 10L12 14L18 10M12 2L6 6L12 10L18 6L12 2Z" fill="#FF9900"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AWS</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Ведущая облачная платформа от Amazon. EC2, S3, RDS, Lambda и 200+ сервисов. Глобальная инфраструктура, безопасность, масштабируемость. Pay-as-you-go модель, высокая доступность и надёжность.'}
                  {language === 'kz' && 'Amazon-нан жетекші бұлтты платформа. EC2, S3, RDS, Lambda және 200+ қызметтер. Ғаламдық инфрақұрылым, қауіпсіздік, масштабталу. Pay-as-you-go үлгісі, жоғары қолжетімділік және сенімділік.'}
                  {language === 'en' && 'Leading cloud platform from Amazon. EC2, S3, RDS, Lambda and 200+ services. Global infrastructure, security, scalability. Pay-as-you-go model, high availability and reliability.'}
                </p>
              </div>
            </CarouselItem>

            {/* Nginx */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 h-full hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-[#009639]/10 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" fill="#009639"/>
                    <path d="M8 8V16L16 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Nginx</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'ru' && 'Высокопроизводительный веб-сервер и reverse proxy. Асинхронная архитектура, низкое потребление памяти, load balancing. SSL/TLS termination, кэширование, gzip сжатие. Стабильность при высоких нагрузках.'}
                  {language === 'kz' && 'Жоғары өнімді веб-сервер және reverse proxy. Асинхронды архитектура, жадының төмен тұтынуы, load balancing. SSL/TLS termination, кэштеу, gzip сығу. Жоғары жүктемелерде тұрақтылық.'}
                  {language === 'en' && 'High-performance web server and reverse proxy. Asynchronous architecture, low memory consumption, load balancing. SSL/TLS termination, caching, gzip compression. Stability under high loads.'}
                </p>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </TabsContent>
    </Tabs>
  );
}