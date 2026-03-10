import { ArrowLeft, Check, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { mockProjects } from '../data/mockData';
import { OrbitalBackground } from '../components/OrbitalBackground';

interface ProjectDetailPageProps {
  slug: string;
  onBack: () => void;
}

export function ProjectDetailPage({ slug, onBack }: ProjectDetailPageProps) {
  const { t, language } = useLanguage();
  const project = mockProjects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('projectDetail.notFound')}
          </h2>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('projectDetail.back')}
          </Button>
        </div>
      </div>
    );
  }

  const statusColors = {
    done: 'bg-green-100 text-green-700 border-green-200',
    progress: 'bg-blue-100 text-blue-700 border-blue-200',
    discovery: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  const statusLabels = {
    done: t('projects.status.done'),
    progress: t('projects.status.progress'),
    discovery: t('projects.status.discovery'),
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-12 overflow-hidden">
        <OrbitalBackground variant="small" position="right" className="opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Button onClick={onBack} variant="ghost" className="mb-8 -ml-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('projectDetail.back')}
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={`${statusColors[project.status]} border`}>
                  {statusLabels[project.status]}
                </Badge>
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-[#D1EDF4] text-[#1973AE]">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {project.title[language]}
              </h1>

              <p className="text-xl text-gray-600 mb-8">
                {project.fullDescription?.[language] || project.description[language]}
              </p>

              {project.timeline && (
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <span className="font-medium">Timeline:</span>
                  <span>{project.timeline[language]}</span>
                </div>
              )}
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src={project.image}
                alt={project.title[language]}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      {project.challenge && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('projectDetail.challenge')}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {project.challenge[language]}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Solution Section */}
      {project.solution && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('projectDetail.solution')}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {project.solution[language]}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {project.features && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {t('projectDetail.features')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features[language].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#39D2ED] transition-colors">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#1973AE] to-[#39D2ED] flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tech Stack Section */}
      {project.stack && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {t('projectDetail.stack')}
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.stack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="px-4 py-2 text-sm bg-white border-gray-300 hover:border-[#1973AE] hover:text-[#1973AE] transition-colors"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {t('projectDetail.gallery')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.gallery.map((image, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden shadow-lg group">
                    <img
                      src={image}
                      alt={`${project.title[language]} - Screenshot ${idx + 1}`}
                      className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {project.results && (
        <section className="py-16 bg-gradient-to-br from-[#1973AE] to-[#39D2ED]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl font-bold mb-6">
                {t('projectDetail.results')}
              </h2>
              <p className="text-xl leading-relaxed">
                {project.results[language]}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('projectDetail.cta.title')}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t('projectDetail.cta.subtitle')}
            </p>
            <Button
              size="lg"
              className="bg-[#1973AE] hover:bg-[#155a8a] text-white"
              onClick={() => {
                window.location.hash = 'home';
                setTimeout(() => {
                  document.querySelector('#contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }}
            >
              {t('projectDetail.cta.button')}
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}