import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, MapPin, Briefcase, Clock, Upload, X, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { jobsStorage, Job } from '../data/jobsData';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { OrbitalVisual } from '../components/OrbitalVisual';

export function JobDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [job, setJob] = useState<Job | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const foundJob = jobsStorage.getJobBySlug(slug);
    if (foundJob) {
      setJob(foundJob);
      jobsStorage.incrementViews(foundJob.id);
    }
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
    if (!job || !name || !phone || !resumeFile) return;

    setUploading(true);

    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create applicant
    jobsStorage.createApplicant({
      jobId: job.id,
      jobTitle: job.title[language],
      name,
      phone,
      email: '', // Not required in this flow
      resumeFile: {
        name: resumeFile.name,
        size: resumeFile.size,
        type: resumeFile.type,
        url: URL.createObjectURL(resumeFile),
      },
    });

    setUploading(false);
    setSubmitted(true);
    setShowApplicationForm(false);

    // Reset form
    setName('');
    setPhone('');
    setResumeFile(null);
  };

  if (!job) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'ru' && 'Вакансия не найдена'}
            {language === 'kz' && 'Вакансия табылмады'}
            {language === 'en' && 'Job not found'}
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

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#D1EDF4]/10 to-white">
      {/* Header */}
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

      {/* Application Form */}
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
                      placeholder={
                        language === 'ru' ? 'Введите ваше имя' :
                        language === 'kz' ? 'Атыңызды енгізіңіз' :
                        'Enter your name'
                      }
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
                      {language === 'ru' && 'Резюме'}
                      {language === 'kz' && 'Резюме'}
                      {language === 'en' && 'Resume'}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    {!resumeFile ? (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#1973AE] transition-colors bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="text-sm text-gray-600">
                            {language === 'ru' && 'Нажмите для загрузки'}
                            {language === 'kz' && 'Жүктеу үшін басыңыз'}
                            {language === 'en' && 'Click to upload'}
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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{resumeFile.name}</p>
                            <p className="text-sm text-gray-500">
                              {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveFile}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={!name || !phone || !resumeFile || uploading}
                      className="flex-1 bg-[#1973AE] text-white hover:bg-[#39D2ED]"
                    >
                      {uploading ? (
                        <>
                          {language === 'ru' && 'Отправка...'}
                          {language === 'kz' && 'Жіберілуде...'}
                          {language === 'en' && 'Submitting...'}
                        </>
                      ) : (
                        <>
                          {language === 'ru' && 'Отправить'}
                          {language === 'kz' && 'Жіберу'}
                          {language === 'en' && 'Submit'}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowApplicationForm(false)}
                    >
                      {language === 'ru' && 'Отмена'}
                      {language === 'kz' && 'Болдырмау'}
                      {language === 'en' && 'Cancel'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Job Details */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {language === 'ru' && 'О вакансии'}
                {language === 'kz' && 'Вакансия туралы'}
                {language === 'en' && 'About the role'}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {job.description[language].role}
              </p>
            </div>

            {/* Tasks */}
            {job.description[language].tasks.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ru' && 'Задачи'}
                  {language === 'kz' && 'Міндеттер'}
                  {language === 'en' && 'Tasks'}
                </h2>
                <ul className="space-y-3">
                  {job.description[language].tasks.map((task, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#1973AE] mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.description[language].requirements.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ru' && 'Требования'}
                  {language === 'kz' && 'Талаптар'}
                  {language === 'en' && 'Requirements'}
                </h2>
                <ul className="space-y-3">
                  {job.description[language].requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#39D2ED] mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Plus Points */}
            {job.description[language].plusPoints.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ru' && 'Будет плюсом'}
                  {language === 'kz' && 'Артықшылық болады'}
                  {language === 'en' && 'Nice to have'}
                </h2>
                <ul className="space-y-3">
                  {job.description[language].plusPoints.map((plus, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-green-500 mt-1 flex-shrink-0">+</span>
                      <span className="text-gray-700">{plus}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Conditions */}
            {job.description[language].conditions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ru' && 'Условия'}
                  {language === 'kz' && 'Жағдайлар'}
                  {language === 'en' && 'What we offer'}
                </h2>
                <ul className="space-y-3">
                  {job.description[language].conditions.map((cond, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{cond}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stack */}
            {job.stack && job.stack.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ru' && 'Технологии'}
                  {language === 'kz' && 'Технологиялар'}
                  {language === 'en' && 'Technologies'}
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

            {/* CTA */}
            {!showApplicationForm && !submitted && (
              <div className="bg-gradient-to-br from-[#1973AE] to-[#39D2ED] rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {language === 'ru' && 'Готовы присоединиться к команде?'}
                  {language === 'kz' && 'Командаға қосылуға дайынсыз ба?'}
                  {language === 'en' && 'Ready to join the team?'}
                </h3>
                <p className="text-white/90 mb-6">
                  {language === 'ru' && 'Отправьте заявку и мы свяжемся с вами'}
                  {language === 'kz' && 'Өтініш жіберіңіз және біз сізбен хабарласамыз'}
                  {language === 'en' && 'Submit your application and we\'ll contact you'}
                </p>
                <Button
                  size="lg"
                  onClick={() => setShowApplicationForm(true)}
                  className="bg-white text-[#1973AE] hover:bg-gray-100"
                >
                  {language === 'ru' && 'Откликнуться'}
                  {language === 'kz' && 'Үміткер болу'}
                  {language === 'en' && 'Apply Now'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
