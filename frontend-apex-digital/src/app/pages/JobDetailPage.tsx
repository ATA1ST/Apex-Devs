import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, MapPin, Briefcase, Clock, Upload, X, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { OrbitalVisual } from '../components/OrbitalVisual';
import { toast } from 'sonner';
import { apiUrl } from '../config/api';


type Language = 'ru' | 'kz' | 'en';

interface LocalizedText {
  ru: string;
  kz: string;
  en: string;
}

interface JobDescriptionLocale {
  role: string;
  tasks: string[];
  requirements: string[];
  plusPoints: string[];
  conditions: string[];
}

interface Job {
  id: string;
  slug: string;
  title: LocalizedText;
  shortDescription: LocalizedText;
  postedDate: string;
  department: string;
  location: string;
  employmentType: string;
  status: string;
  isVisible: boolean;
  description: {
    ru: JobDescriptionLocale;
    kz: JobDescriptionLocale;
    en: JobDescriptionLocale;
  };
  stack: string[];
}

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
  const [phone, setPhone] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [email, setEmail] = useState('');
  const [links, setLinks] = useState(['', '', '']);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadJob = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        setLoadError('');

        const response = await fetch(apiUrl(`/api/jobs/${slug}`));

        if (!response.ok) {
          throw new Error(
            currentLanguage === 'ru'
              ? 'Вакансия не найдена'
              : currentLanguage === 'kz'
              ? 'Вакансия табылмады'
              : 'Job not found'
          );
        }

        const data = await response.json();
        setJob(data);
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : currentLanguage === 'ru'
            ? 'Ошибка загрузки вакансии'
            : currentLanguage === 'kz'
            ? 'Вакансияны жүктеу қатесі'
            : 'Failed to load job'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadJob();
  }, [slug, currentLanguage]);

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
      remote: { ru: 'Удалённо', kz: 'Қашықтан', en: 'Remote' },
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

    return date.toLocaleDateString(
      currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'kz' ? 'kk-KZ' : 'en-US'
    );
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
          : 'Only PDF, DOC, DOCX files are allowed'
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
          : 'Maximum file size is 10 MB'
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

    if (!job || !name.trim() || !email.trim() || !phone.trim() || !resumeFile) return;

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

      if (!response.ok) {
        let errorMessage =
          currentLanguage === 'ru'
            ? 'Ошибка при отправке отклика'
            : currentLanguage === 'kz'
            ? 'Өтінішті жіберу қатесі'
            : 'Failed to submit application';

        try {
          const errorData = await response.json();
          if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch {
          //
        }

        throw new Error(errorMessage);
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
        currentLanguage === 'ru'
          ? 'Отклик успешно отправлен'
          : currentLanguage === 'kz'
          ? 'Өтініш сәтті жіберілді'
          : 'Application submitted successfully'
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : currentLanguage === 'ru'
          ? 'Не удалось отправить отклик'
          : currentLanguage === 'kz'
          ? 'Өтінішті жіберу мүмкін болмады'
          : 'Failed to submit application'
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

            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">
                    {currentLanguage === 'ru' && 'Отклик отправлен!'}
                    {currentLanguage === 'kz' && 'Өтініш жіберілді!'}
                    {currentLanguage === 'en' && 'Application submitted!'}
                  </h3>
                  <p className="text-green-700">
                    {currentLanguage === 'ru' && 'Мы рассмотрим вашу заявку и свяжемся с вами в ближайшее время.'}
                    {currentLanguage === 'kz' && 'Біз сіздің өтінішіңізді қарастырамыз және жақын арада хабарласамыз.'}
                    {currentLanguage === 'en' && 'We will review your application and contact you soon.'}
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
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={
                        currentLanguage === 'ru'
                          ? 'Введите ваше имя'
                          : currentLanguage === 'kz'
                          ? 'Атыңызды енгізіңіз'
                          : 'Enter your name'
                      }
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-900 font-medium mb-2 block">
                      Email
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        currentLanguage === 'ru'
                          ? 'Введите ваш email'
                          : currentLanguage === 'kz'
                          ? 'Email енгізіңіз'
                          : 'Enter your email'
                      }
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-900 font-medium mb-2 block">
                      {currentLanguage === 'ru' && 'Телефон'}
                      {currentLanguage === 'kz' && 'Телефон'}
                      {currentLanguage === 'en' && 'Phone'}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (___) ___-__-__"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-900 font-medium mb-2 block">
                      {currentLanguage === 'ru' && 'Ссылки'}
                      {currentLanguage === 'kz' && 'Сілтемелер'}
                      {currentLanguage === 'en' && 'Links'}
                    </Label>

                    <div className="space-y-3">
                      <Input
                        type="url"
                        value={links[0]}
                        onChange={(e) => setLinks((prev) => [e.target.value, prev[1], prev[2]])}
                        placeholder="GitHub / Portfolio / LinkedIn"
                        className="w-full"
                      />
                      <Input
                        type="url"
                        value={links[1]}
                        onChange={(e) => setLinks((prev) => [prev[0], e.target.value, prev[2]])}
                        placeholder={
                          currentLanguage === 'ru'
                            ? 'Дополнительная ссылка'
                            : currentLanguage === 'kz'
                            ? 'Қосымша сілтеме'
                            : 'Additional link'
                        }
                        className="w-full"
                      />
                      <Input
                        type="url"
                        value={links[2]}
                        onChange={(e) => setLinks((prev) => [prev[0], prev[1], e.target.value])}
                        placeholder={
                          currentLanguage === 'ru'
                            ? 'Дополнительная ссылка'
                            : currentLanguage === 'kz'
                            ? 'Қосымша сілтеме'
                            : 'Additional link'
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-900 font-medium mb-2 block">
                      {currentLanguage === 'ru' && 'Сопроводительное письмо'}
                      {currentLanguage === 'kz' && 'Ілеспе хат'}
                      {currentLanguage === 'en' && 'Cover Letter'}
                    </Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        currentLanguage === 'ru'
                          ? 'Кратко расскажите о себе, опыте и почему хотите откликнуться'
                          : currentLanguage === 'kz'
                          ? 'Өзіңіз, тәжірибеңіз және неге осы вакансияға қызыққаныңыз туралы қысқаша жазыңыз'
                          : 'Briefly tell us about yourself, your experience, and why you are applying'
                      }
                      rows={5}
                      className="w-full resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-900 font-medium mb-2 block">
                      {currentLanguage === 'ru' && 'Резюме'}
                      {currentLanguage === 'kz' && 'Резюме'}
                      {currentLanguage === 'en' && 'Resume'}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>

                    {!resumeFile ? (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#1973AE] transition-colors bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="text-sm text-gray-600">
                            {currentLanguage === 'ru' && 'Нажмите для загрузки'}
                            {currentLanguage === 'kz' && 'Жүктеу үшін басыңыз'}
                            {currentLanguage === 'en' && 'Click to upload'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (max 10MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#1973AE]/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#1973AE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{resumeFile.name}</p>
                            <p className="text-sm text-gray-500">
                              {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
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
                      disabled={!name || !email || !phone || !resumeFile || uploading}
                      className="flex-1 bg-[#1973AE] text-white hover:bg-[#39D2ED]"
                    >
                      {uploading ? (
                        <>
                          {currentLanguage === 'ru' && 'Отправка...'}
                          {currentLanguage === 'kz' && 'Жіберілуде...'}
                          {currentLanguage === 'en' && 'Submitting...'}
                        </>
                      ) : (
                        <>
                          {currentLanguage === 'ru' && 'Отправить'}
                          {currentLanguage === 'kz' && 'Жіберу'}
                          {currentLanguage === 'en' && 'Submit'}
                        </>
                      )}
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
                <Button
                  size="lg"
                  onClick={() => setShowApplicationForm(true)}
                  className="bg-white text-[#1973AE] hover:bg-gray-100"
                >
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
