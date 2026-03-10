import { Instagram, Linkedin, Send } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import apexLogo from '../../assets/f7ddf9292a18e8b118f1c91f86089d79cd5e1586.png';

export function Footer() {
  const { t, language } = useLanguage();
  const [ownerClickCount, setOwnerClickCount] = useState(0);
  const [showAdminDialog, setShowAdminDialog] = useState(false);

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
    { label: { ru: 'Backend Development', kz: 'Backend әзірлеу', en: 'Backend Development' }[language] || 'Backend', path: '/services' },
    { label: { ru: 'Machine Learning & AI', kz: 'Machine Learning & AI', en: 'Machine Learning & AI' }[language] || 'ML & AI', path: '/services' },
    { label: { ru: 'UX/UI Design', kz: 'UX/UI Дизайн', en: 'UX/UI Design' }[language] || 'Design', path: '/services' },
    { label: { ru: 'Интеграция 1С', kz: '1С Интеграциясы', en: '1C Integration' }[language] || '1C', path: '/services' },
    { label: t('services.staff.title'), path: '/services' },
  ];

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/apex-digital-kz' },
    { icon: Send, label: 'Telegram', href: 'https://t.me/+77472266885' },
  ];

  // Secret admin access: 7 clicks on "Владельцам"
  const handleOwnerClick = () => {
    setOwnerClickCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (ownerClickCount === 7) {
      setShowAdminDialog(true);
      setOwnerClickCount(0);
    }
    // Reset counter after 3 seconds of inactivity
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
            {/* Logo & Slogan */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-2">
                <img src={apexLogo} alt="Apex Digital Logo" className="h-8 w-8" />
                <span className="text-xl font-semibold text-[#1973AE]">Apex Digital</span>
              </Link>
              <p className="text-sm text-gray-600">{t('footer.slogan')}</p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t('footer.navigation')}</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-600 hover:text-[#1973AE] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {/* Secret owner link */}
                <li>
                  <button
                    onClick={handleOwnerClick}
                    className="text-sm text-gray-600 hover:text-[#1973AE] transition-colors font-normal"
                  >
                    {language === 'ru' && 'Владельцам'}
                    {language === 'kz' && 'Иелерге'}
                    {language === 'en' && 'For Owners'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t('footer.services')}</h3>
              <ul className="space-y-2">
                {serviceLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-600 hover:text-[#1973AE] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t('footer.contacts')}</h3>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">{t('contact.address')}</li>
                <li>
                  <a
                    href="tel:+77472266885"
                    className="text-sm text-gray-600 hover:text-[#1973AE] transition-colors"
                  >
                    {t('contact.phone')}
                  </a>
                </li>
              </ul>

              {/* Social Media */}
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

          {/* Bottom Bar */}
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

      {/* Admin Access Dialog */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'ru' && 'Доступ для владельцев'}
              {language === 'kz' && 'Иелерге қол жетімділік'}
              {language === 'en' && 'Owner Access'}
            </DialogTitle>
            <DialogDescription>
              {language === 'ru' && 'Вы собираетесь перейти на страницу входа в административную панель.'}
              {language === 'kz' && 'Сіз әкімшілік панельге кіру бетіне өтуге дайынсыз.'}
              {language === 'en' && 'You are about to proceed to the admin panel login page.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => setShowAdminDialog(false)} className="flex-1">
              {language === 'ru' && 'Отмена'}
              {language === 'kz' && 'Болдырмау'}
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