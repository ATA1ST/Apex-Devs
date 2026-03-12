import { useState, useEffect } from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { JobDto as Job } from '../types/api';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { OrbitalVisual } from '../components/OrbitalVisual';
import { Link } from 'react-router';
import { apiUrl } from '../config/api';

export function CareersPage() {
  const { language } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadJobs = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch(apiUrl('/api/jobs'));
        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
              result?.message ||
              result?.Message ||
              'РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РІР°РєР°РЅСЃРёРё'
          );
        }

        if (!ignore) {
          setJobs(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РІР°РєР°РЅСЃРёР№');
          setJobs([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadJobs();

    return () => {
      ignore = true;
    };
  }, []);

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

  return (
      <div className="w-full min-h-screen bg-white">
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1973AE] via-[#1973AE] to-[#39D2ED]">
          <div className="absolute inset-0 opacity-10">
            <OrbitalVisual variant="careers" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
                {language === 'ru' && 'Р’Р°РєР°РЅСЃРёРё Apex Digital'}
                {language === 'kz' && 'Apex Digital РІР°РєР°РЅСЃРёСЏР»Р°СЂС‹'}
                {language === 'en' && 'Apex Digital Careers'}
              </h1>
              <p className="text-2xl md:text-3xl text-white/95 leading-relaxed">
                {language === 'ru' && 'Р Р°Р±РѕС‚Р°Р№С‚Рµ РЅР°Рґ СЃР»РѕР¶РЅС‹РјРё Р·Р°РґР°С‡Р°РјРё РІ СЃРёР»СЊРЅРѕР№ РєРѕРјР°РЅРґРµ. Р§РёСЃС‚С‹Р№ РєРѕРґ, СЃРѕРІСЂРµРјРµРЅРЅС‹Р№ СЃС‚РµРє, РїСЂРѕР·СЂР°С‡РЅС‹Рµ РїСЂРѕС†РµСЃСЃС‹.'}
                {language === 'kz' && 'РљТЇС€С‚С– РєРѕРјР°РЅРґР°РґР° РєТЇСЂРґРµР»С– РјС–РЅРґРµС‚С‚РµСЂ ТЇСЃС‚С–РЅРґРµ Р¶Т±РјС‹СЃ Р¶Р°СЃР°ТЈС‹Р·. РўР°Р·Р° РєРѕРґ, Р·Р°РјР°РЅР°СѓРё СЃС‚РµРє, Р°С€С‹Т› РїСЂРѕС†РµСЃС‚РµСЂ.'}
                {language === 'en' && 'Work on complex challenges with a strong team. Clean code, modern stack, transparent processes.'}
              </p>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              {isLoading ? (
                  <div className="text-center py-20 text-gray-600">
                    {language === 'ru' && 'Р—Р°РіСЂСѓР·РєР° РІР°РєР°РЅСЃРёР№...'}
                    {language === 'kz' && 'Р’Р°РєР°РЅСЃРёСЏР»Р°СЂ Р¶ТЇРєС‚РµР»СѓРґРµ...'}
                    {language === 'en' && 'Loading jobs...'}
                  </div>
              ) : error ? (
                  <div className="text-center py-20">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                      {language === 'ru' && 'РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё'}
                      {language === 'kz' && 'Р–ТЇРєС‚РµСѓ Т›Р°С‚РµСЃС–'}
                      {language === 'en' && 'Loading error'}
                    </h3>
                    <p className="text-lg text-gray-600">{error}</p>
                  </div>
              ) : jobs.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                      <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                      {language === 'ru' && 'Р’Р°РєР°РЅСЃРёР№ РЅРµС‚'}
                      {language === 'kz' && 'Р’Р°РєР°РЅСЃРёСЏР»Р°СЂ Р¶РѕТ›'}
                      {language === 'en' && 'No vacancies'}
                    </h3>
                    <p className="text-lg text-gray-600">
                      {language === 'ru' && 'РќР° РґР°РЅРЅС‹Р№ РјРѕРјРµРЅС‚ РѕС‚РєСЂС‹С‚С‹С… РІР°РєР°РЅСЃРёР№ РЅРµС‚. РЎР»РµРґРёС‚Рµ Р·Р° РѕР±РЅРѕРІР»РµРЅРёСЏРјРё!'}
                      {language === 'kz' && 'ТљР°Р·С–СЂРіС– СѓР°Т›С‹С‚С‚Р° Р°С€С‹Т› РІР°РєР°РЅСЃРёСЏР»Р°СЂ Р¶РѕТ›. Р–Р°ТЈР°СЂС‚СѓР»Р°СЂРґС‹ Т›Р°РґР°Т“Р°Р»Р°ТЈС‹Р·!'}
                      {language === 'en' && 'No open positions at the moment. Stay tuned for updates!'}
                    </p>
                  </div>
              ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                        <Link
                            key={job.id}
                            to={`/careers/${job.slug}`}
                            className="block group"
                        >
                          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-[#1973AE]/30">
                            <div className="flex items-start justify-between gap-6">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-[#1973AE] transition-colors">
                                    {job.title[language]}
                                  </h3>
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    {language === 'ru' && 'РћС‚РєСЂС‹С‚Р°'}
                                    {language === 'kz' && 'РђС€С‹Т›'}
                                    {language === 'en' && 'Open'}
                                  </Badge>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                            <span className="flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {getDepartmentLabel(job.department)}
                            </span>
                                  <span className="flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                                    {getLocationLabel(job.location)}
                            </span>
                                  <span className="flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                                    {formatDate(job.postedDate)}
                            </span>
                                </div>

                                <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                                  {job.shortDescription[language]}
                                </p>

                                {job.requirements.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {job.requirements.slice(0, 3).map((req, idx) => (
                                          <Badge key={idx} variant="secondary" className="text-sm">
                                            {req[language]}
                                          </Badge>
                                      ))}
                                      {job.requirements.length > 3 && (
                                          <Badge variant="secondary" className="text-sm">
                                            +{job.requirements.length - 3}
                                          </Badge>
                                      )}
                                    </div>
                                )}
                              </div>

                              <Button
                                  variant="outline"
                                  size="lg"
                                  className="flex-shrink-0 group-hover:bg-[#1973AE] group-hover:text-white group-hover:border-[#1973AE] transition-all"
                              >
                                {language === 'ru' && 'РџРѕРґСЂРѕР±РЅРµРµ'}
                                {language === 'kz' && 'РўРѕР»С‹Т“С‹СЂР°Т›'}
                                {language === 'en' && 'Details'}
                                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </div>
                          </div>
                        </Link>
                    ))}
                  </div>
              )}
            </div>
          </div>
        </section>
      </div>
  );
}
