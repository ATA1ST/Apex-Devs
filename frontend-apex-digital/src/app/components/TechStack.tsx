import { useLanguage } from '../contexts/LanguageContext';

interface Tech {
  name: string;
  color: string;
  category: 'frontend' | 'backend' | 'mobile' | 'database';
}

export function TechStack() {
  const { language } = useLanguage();

  const technologies: Tech[] = [
    // Frontend
    { name: 'React', color: '#61DAFB', category: 'frontend' },
    { name: 'Angular', color: '#DD0031', category: 'frontend' },
    { name: 'TypeScript', color: '#3178C6', category: 'frontend' },
    { name: 'Next.js', color: '#000000', category: 'frontend' },
    
    // Backend
    { name: 'Node.js', color: '#339933', category: 'backend' },
    { name: 'Python', color: '#3776AB', category: 'backend' },
    { name: 'Java', color: '#007396', category: 'backend' },
    { name: 'Go', color: '#00ADD8', category: 'backend' },
    { name: '.NET', color: '#512BD4', category: 'backend' },
    
    // Mobile
    { name: 'React Native', color: '#61DAFB', category: 'mobile' },
    { name: 'Flutter', color: '#02569B', category: 'mobile' },
    { name: 'Swift', color: '#FA7343', category: 'mobile' },
    { name: 'Kotlin', color: '#7F52FF', category: 'mobile' },
    
    // Database
    { name: 'PostgreSQL', color: '#4169E1', category: 'database' },
    { name: 'MongoDB', color: '#47A248', category: 'database' },
    { name: 'Redis', color: '#DC382D', category: 'database' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'ru' && 'Технологический стек'}
              {language === 'kz' && 'Технологиялық стек'}
              {language === 'en' && 'Technology Stack'}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'ru' && 'Современные инструменты для надёжных решений'}
              {language === 'kz' && 'Сенімді шешімдерге арналған заманауи құралдар'}
              {language === 'en' && 'Modern tools for reliable solutions'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="group flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all hover:scale-105 cursor-default"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${tech.color}15` }}
                >
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: tech.color }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
