import { ClipboardList, Palette, Code, TestTube, Rocket } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function ProcessSteps() {
  const { language } = useLanguage();

  const steps = [
    {
      icon: ClipboardList,
      title: { ru: 'Бриф и анализ', kz: 'Бриф және талдау', en: 'Brief & Analysis' },
      description: {
        ru: 'Изучаем бизнес, конкурентов, целевую аудиторию. Формируем требования.',
        kz: 'Бизнесті, бәсекелестерді, мақсатты аудиторияны зерттейміз. Талаптарды қалыптастырамыз.',
        en: 'Research business, competitors, target audience. Define requirements.',
      },
    },
    {
      icon: Palette,
      title: { ru: 'UX/UI дизайн', kz: 'UX/UI дизайн', en: 'UX/UI Design' },
      description: {
        ru: 'Прототипы, User Flow, интерфейсы. Тестируем юзабилити.',
        kz: 'Прототиптер, User Flow, интерфейстер. Юзабилитиді тестілейміз.',
        en: 'Prototypes, User Flow, interfaces. Test usability.',
      },
    },
    {
      icon: Code,
      title: { ru: 'Разработка', kz: 'Әзірлеу', en: 'Development' },
      description: {
        ru: 'Frontend, Backend, интеграции. Agile спринты, еженедельные демо.',
        kz: 'Frontend, Backend, интеграциялар. Agile спринттер, апта сайынғы демо.',
        en: 'Frontend, Backend, integrations. Agile sprints, weekly demos.',
      },
    },
    {
      icon: TestTube,
      title: { ru: 'Тестирование', kz: 'Тестілеу', en: 'QA Testing' },
      description: {
        ru: 'Функциональное, нагрузочное, кросс-браузерное тестирование.',
        kz: 'Функционалдық, жүктеме, кросс-браузерлік тестілеу.',
        en: 'Functional, load, cross-browser testing.',
      },
    },
    {
      icon: Rocket,
      title: { ru: 'Запуск и поддержка', kz: 'Іске қосу және қолдау', en: 'Launch & Support' },
      description: {
        ru: 'Деплой, мониторинг, обновления. Техподдержка и развитие.',
        kz: 'Деплой, мониторинг, жаңартулар. Техникалық қолдау және дамыту.',
        en: 'Deploy, monitoring, updates. Tech support and growth.',
      },
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'ru' && 'Как мы работаем'}
              {language === 'kz' && 'Біз қалай жұмыс істейміз'}
              {language === 'en' && 'How We Work'}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'ru' && 'Прозрачный процесс от идеи до запуска'}
              {language === 'kz' && 'Идеядан іске қосуға дейінгі мөлдір процесс'}
              {language === 'en' && 'Transparent process from idea to launch'}
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1973AE] via-[#39D2ED] to-[#1973AE]" />

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="relative">
                    <div className="flex flex-col items-center text-center">
                      {/* Step Number & Icon */}
                      <div className="relative mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1973AE] to-[#39D2ED] flex items-center justify-center shadow-lg z-10 relative">
                          <Icon className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-[#1973AE] flex items-center justify-center text-sm font-bold text-[#1973AE] z-20">
                          {idx + 1}
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {step.title[language]}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {step.description[language]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
