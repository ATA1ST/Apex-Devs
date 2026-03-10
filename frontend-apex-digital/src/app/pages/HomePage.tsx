import { useState } from 'react';
import { ArrowRight, Check, Globe, Smartphone, Users, Shield, HeadphonesIcon, Phone, Send as TelegramIcon, Zap, Clock, Target, TrendingUp, Code, Gauge, FileCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { FileUpload } from '../components/FileUpload';
import { mockProjects } from '../data/mockData';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

export function HomePage() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    timeline: '',
    description: '',
    consent: false,
    files: [] as File[],
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.consent) {
      toast.error('Заполните обязательные поля');
      return;
    }
    // Simulate submission
    setFormSubmitted(true);
    toast.success(t('form.success'));
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const featuredProjects = mockProjects.filter(p => p.isVisible !== false).slice(0, 3);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-b from-[#D1EDF4]/20 to-white py-12 md:py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {t('hero.title')}
                </h1>
                <p className="text-base md:text-lg text-gray-600">
                  {t('hero.subtitle')}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#1973AE] hover:bg-[#155a8a] text-white"
                  onClick={() => {
                    setTimeout(() => {
                      document.querySelector('#contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                >
                  {t('hero.cta.primary')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#1973AE] text-[#1973AE] hover:bg-[#1973AE]/10"
                  onClick={() => {
                    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('hero.cta.secondary')}
                </Button>
              </div>
            </div>

            {/* Right Visual - positioned lower and to the right */}
            <div className="relative hidden lg:block">
              <div className="relative h-[450px] flex items-end justify-end">
                {/* Abstract tech visual - positioned in bottom right area */}
                <div className="relative mr-8 mb-16">
                  <div className="relative">
                    {/* Orbits */}
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#39D2ED]/20"
                        style={{
                          width: `${i * 140}px`,
                          height: `${i * 140}px`,
                          animation: `spin ${20 + i * 5}s linear infinite`,
                        }}
                      >
                        <div
                          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-[#1973AE] to-[#39D2ED] shadow-lg"
                        />
                      </div>
                    ))}
                    {/* Center gradient circle removed */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('services.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Web */}
            <div className="group p-8 rounded-2xl border border-gray-200 hover:border-[#1973AE] hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-xl bg-[#D1EDF4] flex items-center justify-center mb-6 group-hover:bg-[#1973AE] transition-colors">
                <Globe className="h-7 w-7 text-[#1973AE] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('services.web.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('services.web.desc')}
              </p>
              <Button variant="link" className="text-[#1973AE] p-0 h-auto">
                {t('services.cta')} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {/* Mobile */}
            <div className="group p-8 rounded-2xl border border-gray-200 hover:border-[#1973AE] hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-xl bg-[#D1EDF4] flex items-center justify-center mb-6 group-hover:bg-[#1973AE] transition-colors">
                <Smartphone className="h-7 w-7 text-[#1973AE] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('services.mobile.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('services.mobile.desc')}
              </p>
              <Button variant="link" className="text-[#1973AE] p-0 h-auto">
                {t('services.cta')} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {/* Staff */}
            <div className="group p-8 rounded-2xl border border-gray-200 hover:border-[#1973AE] hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-xl bg-[#D1EDF4] flex items-center justify-center mb-6 group-hover:bg-[#1973AE] transition-colors">
                <Users className="h-7 w-7 text-[#1973AE] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('services.staff.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('services.staff.desc')}
              </p>
              <Button variant="link" className="text-[#1973AE] p-0 h-auto">
                {t('services.cta')} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Apex - Bento Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('why.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Code, title: t('why.senior'), desc: t('why.senior.desc') },
              { icon: FileCheck, title: t('why.transparent'), desc: t('why.transparent.desc') },
              { icon: Target, title: t('why.design'), desc: t('why.design.desc') },
              { icon: Gauge, title: t('why.frontend'), desc: t('why.frontend.desc') },
              { icon: Shield, title: t('why.security'), desc: t('why.security.desc') },
              { icon: HeadphonesIcon, title: t('why.support'), desc: t('why.support.desc') },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-xl border border-gray-200 hover:border-[#39D2ED] hover:shadow-md transition-all"
              >
                <item.icon className="h-8 w-8 text-[#1973AE] mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('process.title')}
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                { step: '01', title: t('process.step1'), desc: t('process.step1.desc') },
                { step: '02', title: t('process.step2'), desc: t('process.step2.desc') },
                { step: '03', title: t('process.step3'), desc: t('process.step3.desc') },
                { step: '04', title: t('process.step4'), desc: t('process.step4.desc') },
                { step: '05', title: t('process.step5'), desc: t('process.step5.desc') },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1973AE] to-[#39D2ED] flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1 pb-8 border-b border-gray-200 last:border-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('projects.title')}
            </h2>
            <p className="text-lg text-gray-600">{t('projects.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-[#D1EDF4] text-[#1973AE]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title[language]}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {project.description[language]}
                  </p>
                  <Button
                    variant="link"
                    className="text-[#1973AE] p-0 h-auto"
                    onClick={() => {
                      window.location.hash = `projects/${project.slug}`;
                    }}
                  >
                    {t('projects.viewCase')} <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('form.title')}
              </h2>
              <p className="text-lg text-gray-600">{t('form.subtitle')}</p>
            </div>

            {formSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('form.success')}
                </h3>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('form.name')}*</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">{t('form.company')}</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('form.phone')}*</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      placeholder="+7 747 226 68 85"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('form.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="info@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="service">{t('form.service')}</Label>
                    <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">{t('form.service.web')}</SelectItem>
                        <SelectItem value="mobile">{t('form.service.mobile')}</SelectItem>
                        <SelectItem value="staff">{t('form.service.staff')}</SelectItem>
                        <SelectItem value="other">{t('form.service.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">{t('form.budget')}</Label>
                    <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">{t('form.budget.small')}</SelectItem>
                        <SelectItem value="medium">{t('form.budget.medium')}</SelectItem>
                        <SelectItem value="large">{t('form.budget.large')}</SelectItem>
                        <SelectItem value="enterprise">{t('form.budget.enterprise')}</SelectItem>
                        <SelectItem value="tbd">{t('form.budget.tbd')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline">{t('form.timeline')}</Label>
                    <Select value={formData.timeline} onValueChange={(value) => setFormData({ ...formData, timeline: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">{t('form.timeline.week')}</SelectItem>
                        <SelectItem value="twoweeks">{t('form.timeline.twoweeks')}</SelectItem>
                        <SelectItem value="month">{t('form.timeline.month')}</SelectItem>
                        <SelectItem value="twomonths">{t('form.timeline.twomonths')}</SelectItem>
                        <SelectItem value="threemonths">{t('form.timeline.threemonths')}</SelectItem>
                        <SelectItem value="sixmonths">{t('form.timeline.sixmonths')}</SelectItem>
                        <SelectItem value="flexible">{t('form.timeline.flexible')}</SelectItem>
                        <SelectItem value="tbd">{t('form.timeline.tbd')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('form.description')}</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('form.upload')}</Label>
                  <FileUpload
                    hint={t('form.upload.hint')}
                    onFilesChange={(files) => setFormData({ ...formData, files })}
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => setFormData({ ...formData, consent: checked as boolean })}
                  />
                  <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                    {t('form.consent')}
                  </Label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#1973AE] hover:bg-[#155a8a] text-white"
                >
                  {t('form.submit')}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contacts Preview */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('contact.title')}
              </h2>
              <p className="text-lg text-gray-600">{t('contact.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-8 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {t('contact.title')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Адрес</p>
                    <p className="text-gray-900">{t('contact.address')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{t('contact.phoneLabel')}</p>
                    <p className="text-gray-900">{t('contact.phone')}</p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button 
                      className="flex-1 bg-[#1973AE] hover:bg-[#155a8a] text-white"
                      onClick={() => window.location.href = 'tel:+77472266885'}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      {t('contact.call')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-[#1973AE] text-[#1973AE]"
                      onClick={() => window.open('https://t.me/+77472266885', '_blank')}
                    >
                      <TelegramIcon className="mr-2 h-4 w-4" />
                      Telegram
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {t('contact.hours')}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('contact.hours.weekdays')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('contact.hours.weekend')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}