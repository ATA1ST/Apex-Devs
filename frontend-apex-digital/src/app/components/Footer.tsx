import { Instagram, Linkedin, Send } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { apiRequest } from '../config/api';
import type { SiteSettingsDto } from '../types/api';
import apexLogo from '../../assets/f7ddf9292a18e8b118f1c91f86089d79cd5e1586.png';

const fallbackSettings: SiteSettingsDto = {
  phone: '+7 747 226 68 85',
  email: 'info@apexdigital.kz',
  address: {
    ru: 'Астана, Казахстан',
    kz: 'Астана, Қазақстан',
    en: 'Astana, Kazakhstan',
  },
  instagram: '#',
  linkedin: 'https://www.linkedin.com/company/apex-digital-kz',
  telegram: 'https://t.me/+77472266885',
  whatsapp: '',
};

export function Footer() {
  const { t, language } = useLanguage();
  const [ownerClickCount, setOwnerClickCount] = useState(0);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [settings, setSettings] = useState<SiteSettingsDto>(fallbackSettings);

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        const result = await apiRequest<SiteSettingsDto>('/api/settings', undefined, 'Failed to load footer settings');
        if (!cancelled) {
          setSettings({
            ...fallbackSettings,
            ...result,
            address: {
              ...fallbackSettings.address,
              ...(result?.address || {}),
            },
          });
        }
      } catch {
        if (!cancelled) {
          setSettings(fallbackSettings);
        }
      }
    };

    void loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.services'), path: '/services' },
    { label: t('nav.projects'), path: '/projects' },
    { label: t('nav.careers'), path: '/careers' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.contact'), path: '/contacts' },
  ];

  const serviceLinks = [
    { label: t('services.web.title'), path: '/services' },
    { label: t('services.mobile.title'), path: '/services' },
    { label: { ru: 'Backend Development', kz: 'Backend даму', en: 'Backend Development' }[language] || 'Backend', path: '/services' },
    { label: { ru: 'Machine Learning & AI', kz: 'Machine Learning & AI', en: 'Machine Learning & AI' }[language] || 'ML & AI', path: '/services' },
    { label: { ru: 'UX/UI Design', kz: 'UX/UI дизайн', en: 'UX/UI Design' }[language] || 'Design', path: '/services' },
    { label: { ru: 'Интеграция 1C', kz: '1C Интеграция', en: '1C Integration' }[language] || '1C', path: '/services' },
    { label: t('services.staff.title'), path: '/services' },
  ];

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: settings.instagram || '#' },
    { icon: Linkedin, label: 'LinkedIn', href: settings.linkedin || '#' },
    { icon: Send, label: 'Telegram', href: settings.telegram || '#' },
  ];

  const handleOwnerClick = () => {
    setOwnerClickCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (ownerClickCount === 7) {
      setShowAdminDialog(true);
      setOwnerClickCount(0);
    }

    const timer = setTimeout(() => {
      setOwnerClickCount(0);
    }, 3000);

    return () => clearTimeout(timer);
  }, [ownerClickCount]);

  const handleAdminAccess = () => {
    setShowAdminDialog(false);
    window.location.href = '/admin';
  };

  return (
    <>
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-2">
                <img src={apexLogo} alt="Apex Digital Logo" className="h-8 w-8" />
                <span className="text-xl font-semibold text-[#1973AE]">Apex Digital</span>
              </Link>
              <p className="text-sm text-gray-600">{t('footer.slogan')}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t('footer.navigation')}</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-sm text-gray-600 hover:text-[#1973AE] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleOwnerClick}
                    className="text-sm text-gray-600 hover:text-[#1973AE] transition-colors font-normal"
                  >
                    {language === 'ru' && 'Для Владельцев'}
                    {language === 'kz' && 'Егерлер үшін'}
                    {language === 'en' && 'For Owners'}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t('footer.services')}</h3>
              <ul className="space-y-2">
                {serviceLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-sm text-gray-600 hover:text-[#1973AE] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t('footer.contacts')}</h3>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">{settings.address[language]}</li>
                <li>
                  <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-sm text-gray-600 hover:text-[#1973AE] transition-colors">
                    {settings.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${settings.email}`} className="text-sm text-gray-600 hover:text-[#1973AE] transition-colors">
                    {settings.email}
                  </a>
                </li>
              </ul>

              <div className="flex items-center space-x-4 mt-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="text-gray-600 hover:text-[#1973AE] transition-colors"
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600">{t('footer.copyright')}</p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-600 hover:text-[#1973AE] transition-colors">
                {t('footer.policy')}
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-[#1973AE] transition-colors">
                {t('footer.terms')}
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'ru' && 'Для Владельцев'}
              {language === 'kz' && 'Егерлер үшін'}
              {language === 'en' && 'Owner Access'}
            </DialogTitle>
            <DialogDescription>
              {language === 'ru' && 'Вы будете перенаправлены на страницу входа в панель администратора.'}
              {language === 'kz' && 'Сіз әкімші панеліне кіру парағына ауысып жатырсыз.'}
              {language === 'en' && 'You are about to proceed to the admin panel login page.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => setShowAdminDialog(false)} className="flex-1">
              {language === 'ru' && 'Отмена'}
              {language === 'kz' && 'Бас тарту'}
              {language === 'en' && 'Cancel'}
            </Button>
            <Button onClick={handleAdminAccess} className="flex-1 bg-[#1973AE] hover:bg-[#155a8a]">
              {language === 'ru' && 'Перейти к входу'}
              {language === 'kz' && 'Кіруге өту'}
              {language === 'en' && 'Go to Login'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}