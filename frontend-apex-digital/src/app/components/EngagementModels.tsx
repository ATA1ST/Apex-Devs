import { Box, Clock, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function EngagementModels() {
  const { language } = useLanguage();

  const models = [
    {
      icon: Box,
      title: { ru: 'Fixed Scope', kz: 'Фиксирленген көлем', en: 'Fixed Scope' },
      description: {
        ru: 'Фиксированный бюджет и сроки. Чёткий scope работ.',
        kz: 'Бекітілген бюджет және мерзімдер. Нақты жұмыс көлемі.',
        en: 'Fixed budget and timeline. Clear scope of work.',
      },
      bestFor: {
        ru: 'MVP, лендинги, сайты с понятными требованиями',
        kz: 'MVP, лендингтер, түсінікті талаптары бар сайттар',
        en: 'MVP, landings, sites with clear requirements',
      },
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Clock,
      title: { ru: 'Time & Material', kz: 'Уақыт және материал', en: 'Time & Material' },
      description: {
        ru: 'Гибкие сроки и scope. Оплата по факту работы.',
        kz: 'Икемді мерзімдер және көлем. Жұмыс фактісі бойынша төлем.',
        en: 'Flexible timeline and scope. Pay as you go.',
      },
      bestFor: {
        ru: 'Сложные продукты, частые изменения, долгосрочные проекты',
        kz: 'Күрделі өнімдер, жиі өзгерістер, ұзақ мерзімді жобалар',
        en: 'Complex products, frequent changes, long-term projects',
      },
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      title: { ru: 'Outstaffing', kz: 'Аутстаффинг', en: 'Outstaffing' },
      description: {
        ru: 'Выделенная команда или специалисты в вашу команду.',
        kz: 'Сіздің командаңызға бөлінген команда немесе мамандар.',
        en: 'Dedicated team or specialists for your team.',
      },
      bestFor: {
        ru: 'Долгосрочное масштабирование команды, нехватка экспертизы',
        kz: 'Ұзақ мерзімді команданы масштабтау, сараптаманың жетіспеуі',
        en: 'Long-term team scaling, lack of expertise',
      },
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {models.map((model, idx) => {
              const Icon = model.icon;
              return (
                <div
                  key={idx}
                  className="group relative bg-white border border-gray-200 rounded-2xl p-10 hover:shadow-xl transition-all"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${model.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br ${model.color} mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      {model.title[language]}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 text-base leading-relaxed">
                      {model.description[language]}
                    </p>

                    {/* Best For */}
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        {language === 'ru' && 'Подходит для:'}
                        {language === 'kz' && 'Сәйкес келеді:'}
                        {language === 'en' && 'Best for:'}
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {model.bestFor[language]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}