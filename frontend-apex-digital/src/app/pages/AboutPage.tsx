import { CheckCircle, Users, Lightbulb, Target, Award, TrendingUp, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { EngagementModels } from '../components/EngagementModels';
import { TechnologyTabs } from '../components/TechnologyTabs';
import { OrbitalBackground } from '../components/OrbitalBackground';
import { OrbitalVisual } from '../components/OrbitalVisual';
import { Button } from '../components/ui/button';
import founderIcon from '../../assets/77f39adf5f138b12af66021265df8063ac566260.png';

export function AboutPage() {
  const { t, language } = useLanguage();

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-b from-[#D1EDF4]/20 to-white overflow-hidden">
        <OrbitalBackground variant="small" position="left" className="opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {language === 'ru' && 'Мы создаём IT-продукты, которые решают бизнес-задачи'}
              {language === 'kz' && 'Біз бизнес міндеттерін шешетін IT өнімдерін жасаймыз'}
              {language === 'en' && 'We create IT products that solve business challenges'}
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="relative py-20 bg-white overflow-hidden">
        <OrbitalBackground variant="default" position="right" className="opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {t('about.mission')}
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {t('about.mission.text')}
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Target className="h-6 w-6 text-[#1973AE] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {language === 'ru' && 'Фокус на результат'}
                        {language === 'kz' && 'Нәтижеге бағыттылық'}
                        {language === 'en' && 'Focus on Results'}
                      </h3>
                      <p className="text-gray-600">
                        {language === 'ru' && 'Не просто код, а решение бизнес-задач'}
                        {language === 'kz' && 'Тек код емес, бизнес міндеттерін шешу'}
                        {language === 'en' && 'Not just code, but solving business challenges'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="h-6 w-6 text-[#1973AE] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {language === 'ru' && 'Партнёрство'}
                        {language === 'kz' && 'Серіктестік'}
                        {language === 'en' && 'Partnership'}
                      </h3>
                      <p className="text-gray-600">
                        {language === 'ru' && 'Работаем как часть вашей команды'}
                        {language === 'kz' && 'Сіздің команданың бөлігі ретінде жұмыс істейміз'}
                        {language === 'en' && 'We work as part of your team'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Award className="h-6 w-6 text-[#1973AE] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {language === 'ru' && 'Качество'}
                        {language === 'kz' && 'Сапа'}
                        {language === 'en' && 'Quality'}
                      </h3>
                      <p className="text-gray-600">
                        {language === 'ru' && 'Senior-подход к разработке и дизайну'}
                        {language === 'kz' && 'Әзірлеу мен дизайнға Senior тәсіл'}
                        {language === 'en' && 'Senior approach to development and design'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#1973AE]/20 to-[#39D2ED]/20 p-8 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1607971422532-73f9d45d7a47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjB2aXN1YWwlMjBzdHVkaW8lMjBjb2RlJTIwcHJvZ3JhbW1pbmclMjBtb25pdG9yfGVufDF8fHx8MTc3MzA3MTY2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Developer coding on laptop"
                    className="rounded-xl shadow-lg w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {language === 'ru' && 'Основатели'}
                {language === 'kz' && 'Негізін қалаушылар'}
                {language === 'en' && 'Founders'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Founder 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full mb-6 overflow-hidden bg-gradient-to-br from-[#1973AE] to-[#39D2ED] p-1">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <img src={founderIcon} alt="Omirgaliev Ruslan" className="w-20 h-20" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {language === 'ru' && 'Омиргалиев Руслан'}
                    {language === 'kz' && 'Өмірғалиев Руслан'}
                    {language === 'en' && 'Omirgaliev Ruslan'}
                  </h3>
                  <p className="text-[#1973AE] font-medium mb-6">Co-Founder</p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Engineering-led approach</li>
                    <li>• ML & Backend</li>
                    <li>• Project delivery</li>
                  </ul>
                </div>
              </div>

              {/* Founder 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full mb-6 overflow-hidden bg-gradient-to-br from-[#1973AE] to-[#39D2ED] p-1">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <img src={founderIcon} alt="Toktassynov Daulet" className="w-20 h-20" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {language === 'ru' && 'Токтасынов Даулет'}
                    {language === 'kz' && 'Тоқтасынов Дәулет'}
                    {language === 'en' && 'Toktassynov Daulet'}
                  </h3>
                  <p className="text-[#1973AE] font-medium mb-6">Co-Founder</p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Product-minded engineer</li>
                    <li>• Full-stack & Mobile</li>
                    <li>• UX/UI architecture</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Team */}
      <section className="relative py-20 bg-white overflow-hidden">
        <OrbitalBackground variant="small" position="right" className="opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {language === 'ru' && 'Команда разработки'}
                {language === 'kz' && 'Әзірлеу командасы'}
                {language === 'en' && 'Development Team'}
              </h2>
              <p className="text-lg text-gray-600">
                {language === 'ru' && 'Профессионалы, создающие надёжные IT-продукты'}
                {language === 'kz' && 'Сенімді IT өнімдерін жасайтын мамандар'}
                {language === 'en' && 'Professionals creating reliable IT products'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Developer 1 */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:border-[#39D2ED] hover:shadow-lg transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1973AE] to-[#39D2ED] flex items-center justify-center text-white font-bold text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    АЕ
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {language === 'ru' && 'Ахмет Ерхан'}
                      {language === 'kz' && 'Ахмет Ерхан'}
                      {language === 'en' && 'Akhmet Yerkhan'}
                    </h3>
                    <p className="text-sm text-[#1973AE] font-medium">
                      {language === 'ru' && 'Фуллстак-разработчик'}
                      {language === 'kz' && 'Фуллстак әзірлеуші'}
                      {language === 'en' && 'Full-stack Developer'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Developer 2 */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:border-[#39D2ED] hover:shadow-lg transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1973AE] to-[#39D2ED] flex items-center justify-center text-white font-bold text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    КЕ
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {language === 'ru' && 'Касен Ернар'}
                      {language === 'kz' && 'Қасен Ернар'}
                      {language === 'en' && 'Kassen Ernar'}
                    </h3>
                    <p className="text-sm text-[#1973AE] font-medium">
                      {language === 'ru' && 'Бэкенд-разработчик'}
                      {language === 'kz' && 'Бэкенд әзірлеуші'}
                      {language === 'en' && 'Backend Developer'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Developer 3 */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:border-[#39D2ED] hover:shadow-lg transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1973AE] to-[#39D2ED] flex items-center justify-center text-white font-bold text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    АК
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {language === 'ru' && 'Айтжанов Куаныш'}
                      {language === 'kz' && 'Айтжанов Қуаныш'}
                      {language === 'en' && 'Aitzhanov Kuanysh'}
                    </h3>
                    <p className="text-sm text-[#1973AE] font-medium">
                      {language === 'ru' && 'Бэкенд-разработчик'}
                      {language === 'kz' && 'Бэкенд әзірлеуші'}
                      {language === 'en' && 'Backend Developer'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Developer 4 */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:border-[#39D2ED] hover:shadow-lg transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1973AE] to-[#39D2ED] flex items-center justify-center text-white font-bold text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    СЛ
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {language === 'ru' && 'Сматулла Лиана'}
                      {language === 'kz' && 'Сматулла Лиана'}
                      {language === 'en' && 'Smatulla Liana'}
                    </h3>
                    <p className="text-sm text-[#1973AE] font-medium">
                      {language === 'ru' && 'Фуллстак-разработчик'}
                      {language === 'kz' && 'Фуллстак әзірлеуші'}
                      {language === 'en' && 'Full-stack Developer'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Developer 5 */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:border-[#39D2ED] hover:shadow-lg transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1973AE] to-[#39D2ED] flex items-center justify-center text-white font-bold text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    НА
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {language === 'ru' && 'Наринбетов Аскат'}
                      {language === 'kz' && 'Наринбетов Аскат'}
                      {language === 'en' && 'Narinbetov Askat'}
                    </h3>
                    <p className="text-sm text-[#1973AE] font-medium">
                      {language === 'ru' && 'Тестировщик QA'}
                      {language === 'kz' && 'Тестілеуші QA'}
                      {language === 'en' && 'QA Engineer'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Developer 6 */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:border-[#39D2ED] hover:shadow-lg transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1973AE] to-[#39D2ED] flex items-center justify-center text-white font-bold text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    БН
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {language === 'ru' && 'Балтабеков Нурислам'}
                      {language === 'kz' && 'Балтабеков Нұрислам'}
                      {language === 'en' && 'Baltabekov Nurislam'}
                    </h3>
                    <p className="text-sm text-[#1973AE] font-medium">
                      {language === 'ru' && 'Фуллстак-разработчик'}
                      {language === 'kz' && 'Фуллстак әзірлеуші'}
                      {language === 'en' && 'Full-stack Developer'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Models */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {language === 'ru' && 'Модели сотрудничества'}
                {language === 'kz' && 'Серіктестік моделер'}
                {language === 'en' && 'Engagement Models'}
              </h2>
            </div>

            <EngagementModels />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* Multiple orbital backgrounds across the section */}
        <div className="absolute left-0 top-1/4 w-[400px] h-[400px] opacity-20">
          <OrbitalVisual variant="about" />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] h-[350px] opacity-15">
          <OrbitalVisual variant="about" />
        </div>
        <div className="absolute left-1/3 bottom-0 w-[300px] h-[300px] opacity-10">
          <OrbitalVisual variant="about" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {language === 'ru' && 'Наши принципы'}
                {language === 'kz' && 'Біздің принциптер'}
                {language === 'en' && 'Our Principles'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-[#D1EDF4] flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-[#1973AE]">01</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {language === 'ru' && 'Прозрачность'}
                  {language === 'kz' && 'Ашықтық'}
                  {language === 'en' && 'Transparency'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ru' && 'Честно о сроках, бюджетах и рисках. Никаких скрытых платежей.'}
                  {language === 'kz' && 'Мерзімдер, бюджеттер және тәуекелдер туралы шынайы. Жасырын төлемдер жоқ.'}
                  {language === 'en' && 'Honest about timelines, budgets and risks. No hidden fees.'}
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-[#D1EDF4] flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-[#1973AE]">02</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {language === 'ru' && 'Коммуникация'}
                  {language === 'kz' && 'Қарым-қатынас'}
                  {language === 'en' && 'Communication'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ru' && 'Регулярные демо, доступ к прогрессу, быстрая обратная связь.'}
                  {language === 'kz' && 'Үнемі демо, прогреске қолжетімділік, жылдам кері байланыс.'}
                  {language === 'en' && 'Regular demos, access to progress, quick feedback.'}
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-[#D1EDF4] flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-[#1973AE]">03</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {language === 'ru' && 'Долгосрочность'}
                  {language === 'kz' && 'Ұзақ мерзімділік'}
                  {language === 'en' && 'Long-term'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ru' && 'Строим продукты, которые легко поддерживать и развивать.'}
                  {language === 'kz' && 'Қолдауы мен дамуы оңай өнімдерді жасаймыз.'}
                  {language === 'en' && 'We build products that are easy to maintain and scale.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {language === 'ru' && 'Наши технологии'}
                {language === 'kz' && 'Біздің технологиялар'}
                {language === 'en' && 'Our Technologies'}
              </h2>
              <p className="text-lg text-gray-600">
                {language === 'ru' && 'Современный стек для создания надёжных решений'}
                {language === 'kz' && 'Сенімді шешімдерді жасауға арналған заманауи стек'}
                {language === 'en' && 'Modern stack for creating reliable solutions'}
              </p>
            </div>

            <TechnologyTabs />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#1973AE] to-[#39D2ED]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {language === 'ru' && 'Готовы начать проект?'}
              {language === 'kz' && 'Жобаны бастауға дайынсыз ба?'}
              {language === 'en' && 'Ready to Start a Project?'}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {language === 'ru' && 'Обсудим вашу задачу и предложим решение'}
              {language === 'kz' && 'Тапсырмаңызды талқылайық және шешім ұсынайық'}
              {language === 'en' && 'Let\'s discuss your challenge and propose a solution'}
            </p>
            <Button
              size="lg"
              className="bg-white text-[#1973AE] hover:bg-gray-100"
              onClick={() => {
                window.location.href = '/#contact-form';
              }}
            >
              {t('nav.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}