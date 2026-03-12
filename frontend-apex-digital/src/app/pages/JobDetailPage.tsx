import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, MapPin, Briefcase, Clock, Upload, X, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { JobDto as Job } from '../types/api';
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
              'Р’Р°РєР°РЅСЃРёСЏ РЅРµ РЅР°Р№РґРµРЅР°'
          );
        }

        if (!ignore) {
          setJob(result);
        }
      } catch (err) {
        if (!ignore) {
          setLoadError(err instanceof Error ? err.message : 'РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РІР°РєР°РЅСЃРёРё');
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
      dev: { ru: 'Р Р°Р·СЂР°Р±РѕС‚РєР°', kz: 'УР·С–СЂР»РµСѓ', en: 'Development' },
      design: { ru: 'Р”РёР·Р°Р№РЅ', kz: 'Р”РёР·Р°Р№РЅ', en: 'Design' },
      pm: { ru: 'РњРµРЅРµРґР¶РјРµРЅС‚', kz: 'РњРµРЅРµРґР¶РјРµРЅС‚', en: 'Management' },
      other: { ru: 'Р”СЂСѓРіРѕРµ', kz: 'Р‘Р°СЃТ›Р°', en: 'Other' },
    };
    return labels[dept as keyof typeof labels]?.[language] || dept;
  };

  const getLocationLabel = (loc: string) => {
    const labels = {
      astana: { ru: 'РђСЃС‚Р°РЅР°', kz: 'РђСЃС‚Р°РЅР°', en: 'Astana' },
      remote: { ru: 'РЈРґР°Р»С‘РЅРЅРѕ', kz: 'ТљР°С€С‹Т›С‚Р°РЅ', en: 'Remote' },
      hybrid: { ru: 'Р“РёР±СЂРёРґ', kz: 'Р“РёР±СЂРёРґ', en: 'Hybrid' },
    };
    return labels[loc as keyof typeof labels]?.[language] || loc;
  };

  const getEmploymentLabel = (type: string) => {
    const labels = {
      'full-time': { ru: 'РџРѕР»РЅР°СЏ Р·Р°РЅСЏС‚РѕСЃС‚СЊ', kz: 'РўРѕР»С‹Т› Р¶Т±РјС‹СЃ', en: 'Full-time' },
      'part-time': { ru: 'Р§Р°СЃС‚РёС‡РЅР°СЏ Р·Р°РЅСЏС‚РѕСЃС‚СЊ', kz: 'РўРѕР»С‹Т› РµРјРµСЃ Р¶Т±РјС‹СЃ', en: 'Part-time' },
      contract: { ru: 'РљРѕРЅС‚СЂР°РєС‚', kz: 'РљРѕРЅС‚СЂР°РєС‚', en: 'Contract' },
    };
    return labels[type as keyof typeof labels]?.[language] || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return language === 'ru' ? 'РЎРµРіРѕРґРЅСЏ' : language === 'kz' ? 'Р‘ТЇРіС–РЅ' : 'Today';
    if (diffDays === 1) return language === 'ru' ? 'Р’С‡РµСЂР°' : language === 'kz' ? 'РљРµС€Рµ' : 'Yesterday';
    if (diffDays < 7) return `${diffDays} ${language === 'ru' ? 'РґРЅ. РЅР°Р·Р°Рґ' : language === 'kz' ? 'РєТЇРЅ Р±Т±СЂС‹РЅ' : 'd ago'}`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${language === 'ru' ? 'РЅРµРґ. РЅР°Р·Р°Рґ' : language === 'kz' ? 'Р°РїС‚Р° Р±Т±СЂС‹РЅ' : 'w ago'}`;
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
      toast.error('Р—Р°РїРѕР»РЅРёС‚Рµ РѕР±СЏР·Р°С‚РµР»СЊРЅС‹Рµ РїРѕР»СЏ');
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
            'РћС€РёР±РєР° РїСЂРё РѕС‚РїСЂР°РІРєРµ РѕС‚РєР»РёРєР°'
        );
      }

      setSubmitted(true);
      setShowApplicationForm(false);
      setName('');
      setPhone('');
      setResumeFile(null);

      toast.success(result?.message || 'Р—Р°СЏРІРєР° РѕС‚РїСЂР°РІР»РµРЅР°');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'РћС€РёР±РєР° РїСЂРё РѕС‚РїСЂР°РІРєРµ РѕС‚РєР»РёРєР°');
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="text-center text-gray-600">
            {language === 'ru' && 'Р—Р°РіСЂСѓР·РєР° РІР°РєР°РЅСЃРёРё...'}
            {language === 'kz' && 'Р’Р°РєР°РЅСЃРёСЏ Р¶ТЇРєС‚РµР»СѓРґРµ...'}
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
                      ? 'Р’Р°РєР°РЅСЃРёСЏ РЅРµ РЅР°Р№РґРµРЅР°'
                      : language === 'kz'
                          ? 'Р’Р°РєР°РЅСЃРёСЏ С‚Р°Р±С‹Р»РјР°РґС‹'
                          : 'Job not found')}
            </h2>
            <Button onClick={() => navigate('/careers')}>
              {language === 'ru' && 'РќР°Р·Р°Рґ Рє РІР°РєР°РЅСЃРёСЏРј'}
              {language === 'kz' && 'Р’Р°РєР°РЅСЃРёСЏР»Р°СЂТ“Р° РѕСЂР°Р»Сѓ'}
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
                {language === 'ru' && 'Р’СЃРµ РІР°РєР°РЅСЃРёРё'}
                {language === 'kz' && 'Р‘Р°СЂР»С‹Т› РІР°РєР°РЅСЃРёСЏР»Р°СЂ'}
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
                      {language === 'ru' && 'РћС‚РєСЂС‹С‚Р°'}
                      {language === 'kz' && 'РђС€С‹Т›'}
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
                    {language === 'ru' && 'РћС‚РєР»РёРєРЅСѓС‚СЊСЃСЏ'}
                    {language === 'kz' && 'Т®РјС–С‚РєРµСЂ Р±РѕР»Сѓ'}
                    {language === 'en' && 'Apply'}
                  </Button>
              )}

              {submitted && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-1">
                        {language === 'ru' && 'РћС‚РєР»РёРє РѕС‚РїСЂР°РІР»РµРЅ!'}
                        {language === 'kz' && 'УЁС‚С–РЅС–С€ Р¶С–Р±РµСЂС–Р»РґС–!'}
                        {language === 'en' && 'Application submitted!'}
                      </h3>
                      <p className="text-green-700">
                        {language === 'ru' && 'РњС‹ СЂР°СЃСЃРјРѕС‚СЂРёРј РІР°С€Сѓ Р·Р°СЏРІРєСѓ Рё СЃРІСЏР¶РµРјСЃСЏ СЃ РІР°РјРё РІ Р±Р»РёР¶Р°Р№С€РµРµ РІСЂРµРјСЏ.'}
                        {language === 'kz' && 'Р‘С–Р· СЃС–Р·РґС–ТЈ У©С‚С–РЅС–С€С–ТЈС–Р·РґС– Т›Р°СЂР°СЃС‚С‹СЂР°РјС‹Р· Р¶У™РЅРµ Р¶Р°Т›С‹РЅ Р°СЂР°РґР° С…Р°Р±Р°СЂР»Р°СЃР°РјС‹Р·.'}
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
                        {language === 'ru' && 'Р¤РѕСЂРјР° РѕС‚РєР»РёРєР°'}
                        {language === 'kz' && 'УЁС‚С–РЅС–С€ С„РѕСЂРјР°СЃС‹'}
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
                          {language === 'ru' && 'РРјСЏ'}
                          {language === 'kz' && 'РђС‚С‹'}
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
                          {language === 'ru' && 'РўРµР»РµС„РѕРЅ'}
                          {language === 'kz' && 'РўРµР»РµС„РѕРЅ'}
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
                          {language === 'ru' && 'Р—Р°РіСЂСѓР·РёС‚СЊ СЂРµР·СЋРјРµ'}
                                {language === 'kz' && 'Р РµР·СЋРјРµ Р¶ТЇРєС‚РµСѓ'}
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
                                ? 'РћС‚РїСЂР°РІРєР°...'
                                : language === 'kz'
                                    ? 'Р–С–Р±РµСЂС–Р»СѓРґРµ...'
                                    : 'Submitting...'
                            : language === 'ru'
                                ? 'РћС‚РїСЂР°РІРёС‚СЊ РѕС‚РєР»РёРє'
                                : language === 'kz'
                                    ? 'УЁС‚С–РЅС–С€ Р¶С–Р±РµСЂСѓ'
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
                  {language === 'ru' && 'Рћ СЂРѕР»Рё'}
                  {language === 'kz' && 'Р У©Р» С‚СѓСЂР°Р»С‹'}
                  {language === 'en' && 'About the role'}
                </h2>
                <p className="text-gray-700 leading-8 whitespace-pre-line">{desc.role}</p>
              </div>

              {desc.tasks?.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {language === 'ru' && 'Р—Р°РґР°С‡Рё'}
                      {language === 'kz' && 'РњС–РЅРґРµС‚С‚РµСЂ'}
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
                      {language === 'ru' && 'РўСЂРµР±РѕРІР°РЅРёСЏ'}
                      {language === 'kz' && 'РўР°Р»Р°РїС‚Р°СЂ'}
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
                      {language === 'ru' && 'Р‘СѓРґРµС‚ РїР»СЋСЃРѕРј'}
                      {language === 'kz' && 'РђСЂС‚С‹Т›С€С‹Р»С‹Т› Р±РѕР»Р°РґС‹'}
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
                      {language === 'ru' && 'РЈСЃР»РѕРІРёСЏ'}
                      {language === 'kz' && 'РЁР°СЂС‚С‚Р°СЂ'}
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
