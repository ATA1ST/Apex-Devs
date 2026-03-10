import { Phone, Mail, MapPin, Send, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { OrbitalBackground } from '../components/OrbitalBackground';
import { OrbitalVisual } from '../components/OrbitalVisual';

export function ContactPage() {
  const { t, language } = useLanguage();

  const contactInfo = [
    {
      icon: MapPin,
      title: { ru: 'Адрес', kz: 'Мекенжай', en: 'Address' },
      value: { ru: 'Астана, Казахстан', kz: 'Астана, Қазақстан', en: 'Astana, Kazakhstan' },
    },
    {
      icon: Phone,
      title: { ru: 'Телефон', kz: 'Телефон', en: 'Phone' },
      value: '+7 747 226 68 85',
      link: 'tel:+77472266885',
    },
    {
      icon: Mail,
      title: { ru: 'Email', kz: 'Email', en: 'Email' },
      value: 'info@apexdigital.kz',
      link: 'mailto:info@apexdigital.kz',
    },
  ];

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: '#', color: 'hover:text-pink-600' },
    { icon: Linkedin, label: 'LinkedIn', href: '#', color: 'hover:text-blue-600' },
    { icon: Send, label: 'Telegram', href: '#', color: 'hover:text-blue-500' },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-[#D1EDF4]/20 to-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {language === 'ru' && 'Свяжитесь с нами'}
              {language === 'kz' && 'Бізбен байланысыңыз'}
              {language === 'en' && 'Get in Touch'}
            </h1>
            <p className="text-xl text-gray-600">
              {language === 'ru' && 'Готовы обсудить ваш проект? Мы на связи'}
              {language === 'kz' && 'Жобаңызды талқылауға дайынсыз ба? Біз байланыстамыз'}
              {language === 'en' && 'Ready to discuss your project? We\'re here to help'}
            </p>
          </div>

          {/* Contact Info - moved here */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactInfo.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all group"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#D1EDF4] mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-[#1973AE]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title[language]}
                    </h3>
                    {item.link ? (
                      <a
                        href={item.link}
                        className="text-gray-600 hover:text-[#1973AE] transition-colors"
                      >
                        {typeof item.value === 'string' ? item.value : item.value[language]}
                      </a>
                    ) : (
                      <p className="text-gray-600">
                        {typeof item.value === 'string' ? item.value : item.value[language]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              {language === 'ru' && 'Наше расположение - город Астана, Казахстан'}
              {language === 'kz' && 'Біздің орналасуымыз - Астана қаласы, Қазақстан'}
              {language === 'en' && 'Our Location - Astana, Kazakhstan'}
            </h3>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src="https://yandex.kz/map-widget/v1/?ll=71.435819%2C51.143964&z=12"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                loading="eager"
                title="Yandex Map - Astana"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                {language === 'ru' && 'Мы в социальных сетях'}
                {language === 'kz' && 'Біз әлеуметтік желілердеміз'}
                {language === 'en' && 'Follow Us'}
              </h3>
              <div className="flex justify-center space-x-6">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 text-gray-600 transition-all hover:scale-110 ${social.color}`}
                      aria-label={social.label}
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}