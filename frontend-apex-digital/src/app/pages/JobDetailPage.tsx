import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, MapPin, Briefcase, Clock, Upload, X, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Job } from '../data/jobsData';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { OrbitalVisual } from '../components/OrbitalVisual';
import { apiUrl } from '../config/api';
import { toast } from 'sonner';

export function JobDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let ignore = false;

    const loadJob = async () => {
      try {
        setIsLoading(true);
        setLoadError('');

        const response = await fetch(apiUrl(`/api/jobs/${slug}`));
        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
              result?.message ||
              result?.Message ||
              'Вакансия не найдена'
          );
        }

        if (!ignore) {
          setJob(result);
        }
      } catch (err) {
        if (!ignore) {
          setLoadError(err instanceof Error ? err.message : 'Ошибка загрузки вакансии');
          setJob(null);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadJob();

    return () => {
      ignore = true;
    };
  }, [slug]);

  const getDepartmentLabel = (dept: string) => {
    const labels = {
      dev: { ru: 'Разработка', kz: 'Әзірлеу', en: 'Development' },
      design: { ru: 'Дизайн', kz: 'Дизайн', en: 'Design' },
      pm: { ru: 'Менеджмент', kz: 'Менеджмент', en: 'Management' },
      other: { ru: 'Другое', kz: 'Басқа', en: 'Other' },
    };
    return labels[dept as keyof typeof labels]?.[language] || dept;
  };

  const getLocationLabel = (loc: string) => {
    const labels = {
      astana: { ru: 'Астана', kz: 'Астана', en: 'Astana' },
      remote: { ru: 'Удалённо', kz: 'Қашықтан', en: 'Remote' },
      hybrid: { ru: 'Гибрид', kz: 'Гибрид', en: 'Hybrid' },
    };
    return labels[loc as keyof typeof labels]?.[language] || loc;
  };

  const getEmploymentLabel = (type: string) => {
    const labels = {
      'full-time': { ru: 'Полная занятость', kz: 'Толық жұмыс', en: 'Full-time' },
      'part-time': { ru: 'Частичная занятость', kz: 'Толық емес жұмыс', en: 'Part-time' },
      contract: { ru: 'Контракт', kz: 'Контракт', en: 'Contract' },
    };
    return labels[type as keyof typeof labels]?.[language] || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return language === 'ru' ? 'Сегодня' : language === 'kz' ? 'Бүгін' : 'Today';
    if (diffDays === 1) return language === 'ru' ? 'Вчера' : language === 'kz' ? 'Кеше' : 'Yesterday';
    if (diffDays < 7) return `${diffDays} ${language === 'ru' ? 'дн. назад' : language === 'kz' ? 'күн бұрын' : 'd ago'}`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${language === 'ru' ? 'нед. назад' : language === 'kz' ? 'апта бұрын' : 'w ago'}`;
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'kz' ? 'kk-KZ' : 'en-US');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!job || !name.trim() || !phone.trim() || !resumeFile) {
      toast.error('Заполните обязательные поля');
      return;
    }

    try {
      setUploading(true);

      const data = new FormData();
      data.append('jobId', job.id);
      data.append('name', name.trim());
      data.append('phone', phone.trim());
      data.append('resume', resumeFile);

      const response = await fetch(apiUrl('/api/submissions/job-application'), {
        method: 'POST',
        body: data,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
            result?.message ||
            result?.Message ||
            'Ошибка при отправке отклика'
        );
      }

      setSubmitted(true);
      setShowApplicationForm(false);
      setName('');
      setPhone('');
      setResumeFile(null);

      toast.success(result?.message || 'Заявка отправлена');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка при отправке отклика');
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="text-center text-gray-600">
            {language === 'ru' && 'Загрузка вакансии...'}
            {language === 'kz' && 'Вакансия жүктелуде...'}
            {language === 'en' && 'Loading job...'}
          </div>
        </div>
    );
  }

  if (!job) {
    return (
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {loadError ||
                  (language === 'ru'
                      ? 'Вакансия не найдена'
                      : language === 'kz'
                          ? 'Вакансия табылмады'
                          : 'Job not found')}
            </h2>
            <Button onClick={() => navigate('/careers')}>
              {language === 'ru' && 'Назад к вакансиям'}
              {language === 'kz' && 'Вакансияларға оралу'}
              {language === 'en' && 'Back to careers'}
            </Button>
          </div>
        </div>
    );
  }

  const desc = job.description[language];

  return (
      <div className="w-full min-h-screen bg-gradient-to-b from-[#D1EDF4]/10 to-white">
        <section className="relative py-12 border-b border-gray-200">
          <div className="absolute inset-0 opacity-10">
            <OrbitalVisual variant="careers" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto">
              <Link to="/careers" className="inline-flex items-center text-[#1973AE] hover:text-[#39D2ED] mb-6 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'ru' && 'Все вакансии'}
                {language === 'kz' && 'Барлық вакансиялар'}
                {language === 'en' && 'All jobs'}
              </Link>

              <div className="flex items-start justify-between gap-6 mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{job.title[language]}</h1>

                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    {getDepartmentLabel(job.department)}
                  </span>
                    <span className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                      {getLocationLabel(job.location)}
                  </span>
                    <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                      {formatDate(job.postedDate)}
                  </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {language === 'ru' && 'Открыта'}
                      {language === 'kz' && 'Ашық'}
                      {language === 'en' && 'Open'}
                    </Badge>
                    <Badge variant="secondary">{getEmploymentLabel(job.employmentType)}</Badge>
                  </div>
                </div>
              </div>

              {!showApplicationForm && !submitted && (
                  <Button
                      size="lg"
                      onClick={() => setShowApplicationForm(true)}
                      className="bg-[#1973AE] text-white hover:bg-[#39D2ED]"
                  >
                    {language === 'ru' && 'Откликнуться'}
                    {language === 'kz' && 'Үміткер болу'}
                    {language === 'en' && 'Apply'}
                  </Button>
              )}

              {submitted && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-1">
                        {language === 'ru' && 'Отклик отправлен!'}
                        {language === 'kz' && 'Өтініш жіберілді!'}
                        {language === 'en' && 'Application submitted!'}
                      </h3>
                      <p className="text-green-700">
                        {language === 'ru' && 'Мы рассмотрим вашу заявку и свяжемся с вами в ближайшее время.'}
                        {language === 'kz' && 'Біз сіздің өтінішіңізді қарастырамыз және жақын арада хабарласамыз.'}
                        {language === 'en' && 'We will review your application and contact you soon.'}
                      </p>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </section>

        {showApplicationForm && (
            <section className="py-12 bg-white border-b border-gray-200">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                  <div className="bg-gradient-to-br from-[#D1EDF4]/20 to-white rounded-2xl p-8 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {language === 'ru' && 'Форма отклика'}
                        {language === 'kz' && 'Өтініш формасы'}
                        {language === 'en' && 'Application Form'}
                      </h2>
                      <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowApplicationForm(false)}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="name" className="text-gray-900 font-medium mb-2 block">
                          {language === 'ru' && 'Имя'}
                          {language === 'kz' && 'Аты'}
                          {language === 'en' && 'Name'}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-gray-900 font-medium mb-2 block">
                          {language === 'ru' && 'Телефон'}
                          {language === 'kz' && 'Телефон'}
                          {language === 'en' && 'Phone'}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                            id="phone"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full"
                        />
                      </div>

                      <div>
                        <Label htmlFor="resume" className="text-gray-900 font-medium mb-2 block">
                          Resume / CV
                          <span className="text-red-500 ml-1">*</span>
                        </Label>

                        {!resumeFile ? (
                            <label
                                htmlFor="resume"
                                className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#1973AE] transition-colors"
                            >
                              <Upload className="w-8 h-8 text-gray-400 mb-3" />
                              <span className="text-gray-700">
                          {language === 'ru' && 'Загрузить резюме'}
                                {language === 'kz' && 'Резюме жүктеу'}
                                {language === 'en' && 'Upload resume'}
                        </span>
                              <input
                                  id="resume"
                                  type="file"
                                  className="hidden"
                                  onChange={handleFileChange}
                                  accept=".pdf,.doc,.docx"
                              />
                            </label>
                        ) : (
                            <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
                              <div>
                                <p className="font-medium text-gray-900">{resumeFile.name}</p>
                                <p className="text-sm text-gray-500">
                                  {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                              <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile}>
                                <X className="w-5 h-5" />
                              </Button>
                            </div>
                        )}
                      </div>

                      <Button
                          type="submit"
                          disabled={uploading}
                          className="w-full bg-[#1973AE] text-white hover:bg-[#39D2ED]"
                      >
                        {uploading
                            ? language === 'ru'
                                ? 'Отправка...'
                                : language === 'kz'
                                    ? 'Жіберілуде...'
                                    : 'Submitting...'
                            : language === 'ru'
                                ? 'Отправить отклик'
                                : language === 'kz'
                                    ? 'Өтініш жіберу'
                                    : 'Submit application'}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
        )}

        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ru' && 'О роли'}
                  {language === 'kz' && 'Рөл туралы'}
                  {language === 'en' && 'About the role'}
                </h2>
                <p className="text-gray-700 leading-8 whitespace-pre-line">{desc.role}</p>
              </div>

              {desc.tasks?.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {language === 'ru' && 'Задачи'}
                      {language === 'kz' && 'Міндеттер'}
                      {language === 'en' && 'Tasks'}
                    </h2>
                    <ul className="space-y-3">
                      {desc.tasks.map((item, index) => (
                          <li key={index} className="text-gray-700 flex items-start gap-3">
                            <span className="mt-2 h-2 w-2 rounded-full bg-[#1973AE]" />
                            <span>{item}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              {desc.requirements?.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {language === 'ru' && 'Требования'}
                      {language === 'kz' && 'Талаптар'}
                      {language === 'en' && 'Requirements'}
                    </h2>
                    <ul className="space-y-3">
                      {desc.requirements.map((item, index) => (
                          <li key={index} className="text-gray-700 flex items-start gap-3">
                            <span className="mt-2 h-2 w-2 rounded-full bg-[#1973AE]" />
                            <span>{item}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              {desc.plusPoints?.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {language === 'ru' && 'Будет плюсом'}
                      {language === 'kz' && 'Артықшылық болады'}
                      {language === 'en' && 'Nice to have'}
                    </h2>
                    <ul className="space-y-3">
                      {desc.plusPoints.map((item, index) => (
                          <li key={index} className="text-gray-700 flex items-start gap-3">
                            <span className="mt-2 h-2 w-2 rounded-full bg-[#1973AE]" />
                            <span>{item}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              {desc.conditions?.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {language === 'ru' && 'Условия'}
                      {language === 'kz' && 'Шарттар'}
                      {language === 'en' && 'Conditions'}
                    </h2>
                    <ul className="space-y-3">
                      {desc.conditions.map((item, index) => (
                          <li key={index} className="text-gray-700 flex items-start gap-3">
                            <span className="mt-2 h-2 w-2 rounded-full bg-[#1973AE]" />
                            <span>{item}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              {job.stack && job.stack.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Stack</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.stack.map((item, index) => (
                          <Badge key={index} variant="secondary">
                            {item}
                          </Badge>
                      ))}
                    </div>
                  </div>
              )}
            </div>
          </div>
        </section>
      </div>
  );
}