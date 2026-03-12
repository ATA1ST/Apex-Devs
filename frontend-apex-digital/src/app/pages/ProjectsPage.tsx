import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { OrbitalVisual } from '../components/OrbitalVisual';
import { apiRequest } from '../config/api';
import type { ProjectDto } from '../types/api';

export function ProjectsPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'web' | 'mobile' | 'ongoing'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError('');
        const result = await apiRequest<ProjectDto[]>('/api/projects', undefined, 'Не удалось загрузить проекты');

        if (!cancelled) {
          setProjects(result);
        }
      } catch (loadError) {
        if (!cancelled) {
          setProjects([]);
          setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить проекты');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'ongoing'
        ? project.status === 'progress' || project.status === 'discovery'
        : project.category === filter);

    const matchesSearch =
      searchQuery === '' ||
      project.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description[language].toLowerCase().includes(searchQuery.toLowerCase());

    return project.isVisible !== false && matchesFilter && matchesSearch;
  });

  const getStatusLabel = (status: ProjectDto['status']) => {
    if (status === 'done') return t('projects.status.done');
    if (status === 'progress') return t('projects.status.progress');
    return t('projects.status.discovery');
  };

  const getStatusColor = (status: ProjectDto['status']) => {
    if (status === 'done') return 'bg-green-100 text-green-700';
    if (status === 'progress') return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="w-full">
      <section className="relative py-20 bg-gradient-to-b from-[#D1EDF4]/20 to-white overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-40">
          <OrbitalVisual variant="projects" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('projects.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('projects.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <TabsList>
                <TabsTrigger value="all">{t('projects.filter.all')}</TabsTrigger>
                <TabsTrigger value="web">{t('projects.filter.web')}</TabsTrigger>
                <TabsTrigger value="mobile">{t('projects.filter.mobile')}</TabsTrigger>
                <TabsTrigger value="ongoing">{t('projects.filter.ongoing')}</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('projects.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-20 text-gray-500">Loading projects...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-600">{error}</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">
                {language === 'ru' && 'Проекты не найдены'}
                {language === 'kz' && 'Жобалар табылмады'}
                {language === 'en' && 'No projects found'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.title[language]}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-[#D1EDF4] text-[#1973AE] hover:bg-[#39D2ED]/20"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {project.title[language]}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {project.description[language]}
                    </p>

                    {project.stack && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.stack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.stack.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            +{project.stack.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <Button
                      variant="link"
                      className="text-[#1973AE] p-0 h-auto group-hover:gap-2 transition-all"
                      onClick={() => navigate(`/projects/${project.slug}`)}
                    >
                      {t('projects.viewCase')}
                      <span className="inline-block group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {language === 'ru' && 'Хотите похожий проект?'}
              {language === 'kz' && 'Ұқсас жоба қалайсыз ба?'}
              {language === 'en' && 'Want a Similar Project?'}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {language === 'ru' && 'Расскажите о своей идее, и мы предложим решение'}
              {language === 'kz' && 'Идеяңыз туралы айтыңыз, біз шешім ұсынамыз'}
              {language === 'en' && 'Tell us about your idea, and we\'ll propose a solution'}
            </p>
            <Button
              size="lg"
              className="bg-[#1973AE] hover:bg-[#155a8a] text-white"
              onClick={() => navigate('/')}
            >
              {t('nav.cta')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

