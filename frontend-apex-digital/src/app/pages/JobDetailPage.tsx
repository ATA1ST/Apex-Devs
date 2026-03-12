import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { ArrowLeft, MapPin, Briefcase, Clock, Upload, X, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { OrbitalVisual } from '../components/OrbitalVisual';
import { apiRequest, apiUrl, getApiErrorMessage, type ApiErrorPayload } from '../config/api';
import type { JobDto as Job } from '../types/api';
import { toast } from 'sonner';

type Language = 'ru' | 'kz' | 'en';

export function JobDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const currentLanguage = language as Language;

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [links, setLinks] = useState(['', '', '']);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      setJob(null);
      return;
    }

    let cancelled = false;

    const loadJob = async () => {
      try {
        setIsLoading(true);
        setLoadError('');
        const result = await apiRequest<Job>(`/api/jobs/${slug}`, undefined, 'Job not found');

        if (!cancelled) {
          setJob(result);
        }
      } catch (error) {
        if (!cancelled) {
          setJob(null);
          setLoadError(error instanceof Error ? error.message : 'Failed to load job');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadJob();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const getDepartmentLabel = (dept: string) => {
    const labels = {
      dev: { ru: 'Разработка', kz: 'Әзірлеу', en: 'Development' },
      design: { ru: 'Дизайн', kz: 'Дизайн', en: 'Design' },
      pm: { ru: 'Менеджмент', kz: 'Менеджмент', en: 'Management' },
      other: { ru: 'Другое', kz: 'Басқа', en: 'Other' },
    };

    return labels[dept as keyof typeof labels]?.[currentLanguage] || dept;
  };

  const getLocationLabel = (loc: string) => {
    const labels = {
      astana: { ru: 'Астана', kz: 'Астана', en: 'Astana' },
      remote: { ru: 'Удаленно', kz: 'Қашықтан', en: 'Remote' },
      hybrid: { ru: 'Гибрид', kz: 'Гибрид', en: 'Hybrid' },
    };

    return labels[loc as keyof typeof labels]?.[currentLanguage] || loc;
  };

  const getEmploymentLabel = (type: string) => {
    const labels = {
      'full-time': { ru: 'Полная занятость', kz: 'Толық жұмыс', en: 'Full-time' },
      'part-time': { ru: 'Частичная занятость', kz: 'Толық емес жұмыс', en: 'Part-time' },
      contract: { ru: 'Контракт', kz: 'Контракт', en: 'Contract' },
    };

    return labels[type as keyof typeof labels]?.[currentLanguage] || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return currentLanguage === 'ru' ? 'Сегодня' : currentLanguage === 'kz' ? 'Бүгін' : 'Today';
    if (diffDays === 1) return currentLanguage === 'ru' ? 'Вчера' : currentLanguage === 'kz' ? 'Кеше' : 'Yesterday';
    if (diffDays < 7) {
      return `${diffDays} ${currentLanguage === 'ru' ? 'дн. назад' : currentLanguage === 'kz' ? 'күн бұрын' : 'd ago'}`;
    }
    if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} ${currentLanguage === 'ru' ? 'нед. назад' : currentLanguage === 'kz' ? 'апта бұрын' : 'w ago'}`;
    }

    return date.toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'kz' ? 'kk-KZ' : 'en-US');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const maxSize = 10 * 1024 * 1024;

    if (!allowedExtensions.includes(extension)) {
      toast.error(
        currentLanguage === 'ru'
          ? 'Разрешены только файлы PDF, DOC, DOCX'
          : currentLanguage === 'kz'
            ? 'Тек PDF, DOC, DOCX файлдарына рұқсат етіледі'
            : 'Only PDF, DOC, DOCX files are allowed',
      );
      e.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      toast.error(
        currentLanguage === 'ru'
          ? 'Максимальный размер файла 10 MB'
          : currentLanguage === 'kz'
            ? 'Файлдың максималды көлемі 10 MB'
            : 'Maximum file size is 10 MB',
      );
      e.target.value = '';
      return;
    }

    setResumeFile(file);
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!job || !name.trim() || !email.trim() || !phone.trim() || !resumeFile) {
      toast.error(
        currentLanguage === 'ru'
          ? 'Заполните обязательные поля'
          : currentLanguage === 'kz'
            ? 'Міндетті өрістерді толтырыңыз'
            : 'Please fill in the required fields',
      );
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('JobId', job.id);
      formData.append('Name', name.trim());
      formData.append('Email', email.trim());
      formData.append('Phone', phone.trim());

      const filteredLinks = links.map((x) => x.trim()).filter(Boolean);
      formData.append('Links', filteredLinks.join('\n'));
      formData.append('Message', message.trim());
      formData.append('Resume', resumeFile);

      const response = await fetch(apiUrl('/api/submissions/job-application'), {
        method: 'POST',
        body: formData,
      });

      const result = (await response.json().catch(() => null)) as ApiErrorPayload | { message?: string } | null;

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(
            result as ApiErrorPayload | null,
            currentLanguage === 'ru'
              ? 'Ошибка при отправке отклика'
              : currentLanguage === 'kz'
                ? 'Өтінішті жіберу қатесі'
                : 'Failed to submit application',
          ),
        );
      }

      setSubmitted(true);
      setShowApplicationForm(false);
      setName('');
      setEmail('');
      setPhone('');
      setLinks(['', '', '']);
      setMessage('');
      setResumeFile(null);

      toast.success(
        result?.message ||
          (currentLanguage === 'ru'
            ? 'Отклик успешно отправлен'
            : currentLanguage === 'kz'
              ? 'Өтініш сәтті жіберілді'
              : 'Application submitted successfully'),
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : currentLanguage === 'ru'
            ? 'Не удалось отправить отклик'
            : currentLanguage === 'kz'
              ? 'Өтінішті жіберу мүмкін болмады'
              : 'Failed to submit application',
      );
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">
          {currentLanguage === 'ru' && 'Загрузка вакансии...'}
          {currentLanguage === 'kz' && 'Вакансия жүктелуде...'}
          {currentLanguage === 'en' && 'Loading job...'}
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
              (currentLanguage === 'ru'
                ? 'Вакансия не найдена'
                : currentLanguage === 'kz'
                  ? 'Вакансия табылмады'
                  : 'Job not found')}
          </h2>
          <Button onClick={() => navigate('/careers')}>
            {currentLanguage === 'ru' && 'Назад к вакансиям'}
            {currentLanguage === 'kz' && 'Вакансияларға оралу'}
            {currentLanguage === 'en' && 'Back to careers'}
          </Button>
        </div>
      </div>
    );
  }

  const desc = job.description[currentLanguage];

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
              {currentLanguage === 'ru' && 'Все вакансии'}
              {currentLanguage === 'kz' && 'Барлық вакансиялар'}
              {currentLanguage === 'en' && 'All jobs'}
            </Link>

            <div className="flex items-start justify-between gap-6 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{job.title[currentLanguage]}</h1>

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
                    {currentLanguage === 'ru' && 'Открыта'}
                    {currentLanguage === 'kz' && 'Ашық'}
                    {currentLanguage === 'en' && 'Open'}
                  </Badge>
                  <Badge variant="secondary">{getEmploymentLabel(job.employmentType)}</Badge>
                </div>
              </div>
            </div>

            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-4 mb-6">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">
                    {currentLanguage === 'ru' && 'Отклик отправлен!'}
                    {currentLanguage === 'kz' && 'Өтініш жіберілді!'}
                    {currentLanguage === 'en' && 'Application submitted!'}
                  </h3>
                  <p className="text-green-700">
                    {currentLanguage === 'ru' && 'Мы рассмотрим вашу заявку и свяжемся с вами в ближайшее время.'}
                    {currentLanguage === 'kz' && 'Біз өтінішіңізді қарастырып, жақын арада хабарласамыз.'}
                    {currentLanguage === 'en' && 'We will review your application and contact you soon.'}
                  </p>
                </div>
              </div>
            )}

            {!showApplicationForm && !submitted && (
              <Button
                size="lg"
                onClick={() => setShowApplicationForm(true)}
                className="bg-[#1973AE] text-white hover:bg-[#39D2ED]"
              >
                {currentLanguage === 'ru' && 'Откликнуться'}
                {currentLanguage === 'kz' && 'Үміткер болу'}
                {currentLanguage === 'en' && 'Apply'}
              </Button>
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
                    {currentLanguage === 'ru' && 'Форма отклика'}
                    {currentLanguage === 'kz' && 'Өтініш формасы'}
                    {currentLanguage === 'en' && 'Application Form'}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowApplicationForm(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-900 font-medium mb-2 block">
                      {currentLanguage === 'ru' && 'Имя'}
                      {currentLanguage === 'kz' && 'Аты'}
                      {currentLanguage === 'en' && 'Name'}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full" />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-900 font-medium mb-2 block">
                      Email
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full" />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-900 font-medium mb-2 block">
                      {currentLanguage === 'ru' && 'Телефон'}
                      {currentLanguage === 'kz' && 'Телефон'}
                      {currentLanguage === 'en' && 'Phone'}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full" />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-900 font-medium block">
                      {currentLanguage === 'ru' && 'Ссылки'}
                      {currentLanguage === 'kz' && 'Сілтемелер'}
                      {currentLanguage === 'en' && 'Links'}
                    </Label>
                    {links.map((linkValue, index) => (
                      <Input
                        key={index}
                        type="url"
                        value={linkValue}
                        onChange={(e) => {
                          const next = [...links];
                          next[index] = e.target.value;
                          setLinks(next);
                        }}
                        placeholder={currentLanguage === 'en' ? `Portfolio link ${index + 1}` : `Ссылка ${index + 1}`}
                        className="w-full"
                      />
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-900 font-medium mb-2 block">
                      {currentLanguage === 'ru' && 'Сообщение'}
                      {currentLanguage === 'kz' && 'Хабарлама'}
                      {currentLanguage === 'en' && 'Message'}
                    </Label>
                    <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full" />
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
                          {currentLanguage === 'ru' && 'Загрузить резюме'}
                          {currentLanguage === 'kz' && 'Резюме жүктеу'}
                          {currentLanguage === 'en' && 'Upload resume'}
                        </span>
                        <input id="resume" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
                        <div>
                          <p className="font-medium text-gray-900">{resumeFile.name}</p>
                          <p className="text-sm text-gray-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile}>
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={!name.trim() || !email.trim() || !phone.trim() || !resumeFile || uploading}
                      className="flex-1 bg-[#1973AE] text-white hover:bg-[#39D2ED]"
                    >
                      {uploading
                        ? currentLanguage === 'ru'
                          ? 'Отправка...'
                          : currentLanguage === 'kz'
                            ? 'Жіберілуде...'
                            : 'Submitting...'
                        : currentLanguage === 'ru'
                          ? 'Отправить'
                          : currentLanguage === 'kz'
                            ? 'Жіберу'
                            : 'Submit'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowApplicationForm(false)}>
                      {currentLanguage === 'ru' && 'Отмена'}
                      {currentLanguage === 'kz' && 'Болдырмау'}
                      {currentLanguage === 'en' && 'Cancel'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentLanguage === 'ru' && 'О вакансии'}
                {currentLanguage === 'kz' && 'Вакансия туралы'}
                {currentLanguage === 'en' && 'About the role'}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">{desc.role}</p>
            </div>

            {desc.tasks?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {currentLanguage === 'ru' && 'Задачи'}
                  {currentLanguage === 'kz' && 'Міндеттер'}
                  {currentLanguage === 'en' && 'Tasks'}
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
                  {currentLanguage === 'ru' && 'Требования'}
                  {currentLanguage === 'kz' && 'Талаптар'}
                  {currentLanguage === 'en' && 'Requirements'}
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
                  {currentLanguage === 'ru' && 'Будет плюсом'}
                  {currentLanguage === 'kz' && 'Артықшылық болады'}
                  {currentLanguage === 'en' && 'Nice to have'}
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
                  {currentLanguage === 'ru' && 'Условия'}
                  {currentLanguage === 'kz' && 'Шарттар'}
                  {currentLanguage === 'en' && 'Conditions'}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {currentLanguage === 'ru' && 'Технологии'}
                  {currentLanguage === 'kz' && 'Технологиялар'}
                  {currentLanguage === 'en' && 'Technologies'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.stack.map((tech, idx) => (
                    <Badge key={idx} variant="secondary" className="text-base px-4 py-2">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {!showApplicationForm && !submitted && (
              <div className="bg-gradient-to-br from-[#1973AE] to-[#39D2ED] rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {currentLanguage === 'ru' && 'Готовы присоединиться к команде?'}
                  {currentLanguage === 'kz' && 'Командаға қосылуға дайынсыз ба?'}
                  {currentLanguage === 'en' && 'Ready to join the team?'}
                </h3>
                <p className="text-white/90 mb-6">
                  {currentLanguage === 'ru' && 'Отправьте заявку и мы свяжемся с вами'}
                  {currentLanguage === 'kz' && 'Өтініш жіберіңіз және біз сізбен хабарласамыз'}
                  {currentLanguage === 'en' && "Submit your application and we'll contact you"}
                </p>
                <Button size="lg" onClick={() => setShowApplicationForm(true)} className="bg-white text-[#1973AE] hover:bg-gray-100">
                  {currentLanguage === 'ru' && 'Откликнуться'}
                  {currentLanguage === 'kz' && 'Үміткер болу'}
                  {currentLanguage === 'en' && 'Apply Now'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
