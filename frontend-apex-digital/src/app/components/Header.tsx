import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import apexLogo from '../../assets/f7ddf9292a18e8b118f1c91f86089d79cd5e1586.png';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { key: 'home', label: t('nav.home'), path: '/' },
    { key: 'services', label: t('nav.services'), path: '/services' },
    { key: 'projects', label: t('nav.projects'), path: '/projects' },
    { key: 'careers', label: t('nav.careers'), path: '/careers' },
    { key: 'about', label: t('nav.about'), path: '/about' },
    { key: 'contacts', label: t('nav.contact'), path: '/contacts' },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'kz', label: 'ҚАЗ' },
    { code: 'ru', label: 'РУС' },
    { code: 'en', label: 'ENG' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const scrollToForm = () => {
    if (location.pathname !== '/') {
      window.location.href = '/#contact-form';
    } else {
      document.querySelector('#contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={apexLogo} alt="Apex Digital" className="h-10 w-auto" />
            <span className="text-xl font-semibold text-[#1973AE]">Apex Digital</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 flex-1 justify-end">
            {/* Desktop Navigation */}
            <nav className="flex items-center space-x-6 mr-8">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-[#1973AE] ${
                    isActive(item.path) ? 'text-[#1973AE]' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side - Language + CTA */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  onBlur={() => setTimeout(() => setLangDropdownOpen(false), 150)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-[#1973AE] transition-all bg-white"
                >
                  <Globe className="w-4 h-4 text-[#1973AE]" />
                  <span className="text-sm font-medium text-gray-700">
                    {languages.find((lang) => lang.code === language)?.label}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-sm font-medium transition-all text-left ${
                          language === lang.code
                            ? 'bg-[#1973AE] text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Button
                onClick={scrollToForm}
                className="bg-[#1973AE] hover:bg-[#155a8a] text-white"
              >
                {t('nav.cta')}
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#1973AE]"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base font-medium transition-colors ${
                  isActive(item.path) ? 'text-[#1973AE]' : 'text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Language Switcher */}
            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                      language === lang.code
                        ? 'bg-[#1973AE] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile CTA */}
            <Button
              onClick={scrollToForm}
              className="w-full bg-[#1973AE] hover:bg-[#155a8a] text-white"
            >
              {t('nav.cta')}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}