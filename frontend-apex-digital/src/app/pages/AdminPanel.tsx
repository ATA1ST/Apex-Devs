import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  LogOut, 
  FolderOpen, 
  MessageSquare, 
  Settings, 
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  Upload,
  Link as LinkIcon,
  Download,
  UsersIcon
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { clearSession } from '../config/auth';
import { mockProjects } from '../data/mockData';
import { toast } from 'sonner';
import { VacanciesManagement } from './admin/VacanciesManagement';

interface Submission {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  description: string;
  files: string[];
  status: 'new' | 'processed';
  createdAt: string;
}

export function AdminPanel() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(mockProjects);
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: '1',
      name: 'Алексей Петров',
      email: 'alex@example.com',
      company: 'Tech Corp',
      service: 'Web Development',
      budget: '$50k - $100k',
      description: 'Нужен корпоративный сайт с интеграцией CRM',
      files: ['brief.pdf', 'mockups.zip'],
      status: 'new',
      createdAt: '2026-03-07T14:30:00',
    },
    {
      id: '2',
      name: 'Мария Иванова',
      email: 'maria@startup.kz',
      company: 'StartupKZ',
      service: 'Mobile Development',
      budget: '$30k - $50k',
      description: 'MVP мобильного приложения для iOS и Android',
      files: [],
      status: 'processed',
      createdAt: '2026-03-05T10:15:00',
    },
  ]);

  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    titleRu: '',
    titleKz: '',
    titleEn: '',
    descriptionRu: '',
    descriptionKz: '',
    descriptionEn: '',
    category: '',
    tags: '',
    images: [] as File[],
    demoUrl: '',
    githubUrl: '',
  });

  const handleLogout = () => {
    clearSession();
    navigate('/admin', { replace: true });
    toast.success('Вы вышли из системы');
  };

  const toggleProjectPublish = (projectId: string) => {
    setProjects(projects.map(p => 
      p.id === projectId 
        ? { ...p, isVisible: !p.isVisible }
        : p
    ));
    const project = projects.find(p => p.id === projectId);
    toast.success(project?.isVisible === false ? 'Проект теперь видим' : 'Проект скрыт от клиентов');
  };

  const deleteProject = (projectId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот проект?')) {
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success('Проект удалён');
    }
  };

  const toggleSubmissionStatus = (submissionId: string) => {
    setSubmissions(submissions.map(s =>
      s.id === submissionId
        ? { ...s, status: s.status === 'new' ? 'processed' : 'new' }
        : s
    ));
    toast.success('Статус заявки обновлён');
  };

  const deleteSubmission = (submissionId: string) => {
    if (confirm('Удалить эту заявку?')) {
      setSubmissions(submissions.filter(s => s.id !== submissionId));
      toast.success('Заявка удалена');
    }
  };

  const handleCreateProject = () => {
    setProjectForm({
      titleRu: '',
      titleKz: '',
      titleEn: '',
      descriptionRu: '',
      descriptionKz: '',
      descriptionEn: '',
      category: '',
      tags: '',
      images: [],
      demoUrl: '',
      githubUrl: '',
    });
    setEditingProject(null);
    setIsProjectDialogOpen(true);
  };

  const handleEditProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setProjectForm({
        titleRu: project.title.ru,
        titleKz: project.title.kz,
        titleEn: project.title.en,
        descriptionRu: project.description.ru,
        descriptionKz: project.description.kz,
        descriptionEn: project.description.en,
        category: project.category,
        tags: project.tags.join(', '),
        images: [],
        demoUrl: '',
        githubUrl: '',
      });
      setEditingProject(projectId);
      setIsProjectDialogOpen(true);
    }
  };

  const handleSaveProject = () => {
    // Валидация
    if (!projectForm.titleRu || !projectForm.descriptionRu || !projectForm.category) {
      toast.error('Заполните обязательные поля (RU версия)');
      return;
    }

    if (editingProject) {
      // Редактирование существующего проекта
      setProjects(projects.map(p =>
        p.id === editingProject
          ? {
              ...p,
              title: { ru: projectForm.titleRu, kz: projectForm.titleKz || projectForm.titleRu, en: projectForm.titleEn || projectForm.titleRu },
              description: { ru: projectForm.descriptionRu, kz: projectForm.descriptionKz || projectForm.descriptionRu, en: projectForm.descriptionEn || projectForm.descriptionRu },
              category: projectForm.category,
              tags: projectForm.tags.split(',').map(t => t.trim()).filter(Boolean),
            }
          : p
      ));
      toast.success('Проект успешно обновлён!');
    } else {
      // Создание нового проекта
      const newProject = {
        id: `project-${Date.now()}`,
        title: { ru: projectForm.titleRu, kz: projectForm.titleKz || projectForm.titleRu, en: projectForm.titleEn || projectForm.titleRu },
        description: { ru: projectForm.descriptionRu, kz: projectForm.descriptionKz || projectForm.descriptionRu, en: projectForm.descriptionEn || projectForm.descriptionRu },
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        tags: projectForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        category: projectForm.category,
        status: { ru: 'Завершено', en: 'Done', kz: 'Аяқталды' },
        client: { ru: 'Новый клиент', en: 'New Client', kz: 'Жаңа клиент' },
        duration: { ru: '3 месяца', en: '3 months', kz: '3 ай' },
        team: { ru: '4 специалиста', en: '4 specialists', kz: '4 маман' },
        year: new Date().getFullYear().toString(),
        challenge: { ru: 'Создание проекта', en: 'Project creation', kz: 'Жоба жасау' },
        solution: { ru: 'Успешно выполнено', en: 'Successfully completed', kz: 'Сәтті орындалды' },
        results: { ru: 'Отличные результаты', en: 'Excellent results', kz: 'Тамаша нәтижелер' },
        technologies: projectForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        features: [],
        testimonial: { ru: '', en: '', kz: '' },
      };
      setProjects([newProject, ...projects]);
      toast.success('Новый проект успешно создан!');
    }

    setIsProjectDialogOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setProjectForm({ ...projectForm, images: fileArray });
      toast.success(`Загружено ${fileArray.length} файл(ов)`);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-[#1973AE] to-[#39D2ED]" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Административная панель</h1>
                <p className="text-xs text-gray-500">Apex Digital KZ</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                Перейти на сайт
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Выход
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="projects">
              <FolderOpen className="w-4 h-4 mr-2" />
              Проекты
            </TabsTrigger>
            <TabsTrigger value="submissions">
              <MessageSquare className="w-4 h-4 mr-2" />
              Заявки
              {submissions.filter(s => s.status === 'new').length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {submissions.filter(s => s.status === 'new').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="vacancies">
              <Briefcase className="w-4 h-4 mr-2" />
              Вакансии
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Управление проектами</h2>
              <Button className="bg-[#1973AE] hover:bg-[#155a8a]" onClick={handleCreateProject}>
                <Plus className="w-4 h-4 mr-2" />
                Создать проект
              </Button>
            </div>

            <div className="grid gap-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{project.title.ru}</h3>
                        <Badge variant={project.status.ru === 'В разработке' ? 'secondary' : 'default'}>
                          {project.status.ru}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{project.description.ru}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleProjectPublish(project.id)}
                      >
                        {project.status.ru === 'В разработке' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProject(project.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Заявки клиентов</h2>
              <div className="flex space-x-2">
                <Badge variant="secondary">
                  Всего: {submissions.length}
                </Badge>
                <Badge variant="destructive">
                  Новые: {submissions.filter(s => s.status === 'new').length}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className={`bg-white rounded-lg border p-6 ${
                    submission.status === 'new' ? 'border-l-4 border-l-[#39D2ED]' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{submission.name}</h3>
                      <p className="text-sm text-gray-600">{submission.company}</p>
                    </div>
                    <Badge variant={submission.status === 'new' ? 'destructive' : 'secondary'}>
                      {submission.status === 'new' ? 'Новая' : 'Обработано'}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="text-gray-900">{submission.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Услуга:</span>
                        <p className="text-gray-900">{submission.service}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Бюджет:</span>
                        <p className="text-gray-900">{submission.budget}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Дата:</span>
                        <p className="text-gray-900">{formatDateTime(submission.createdAt)}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Описание:</span>
                      <p className="text-sm text-gray-900 mt-1">{submission.description}</p>
                    </div>
                    {submission.files.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-500">Файлы:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {submission.files.map((file, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              📎 {file}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleSubmissionStatus(submission.id)}
                    >
                      {submission.status === 'new' ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Отметить обработанной
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Отметить новой
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteSubmission(submission.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Настройки сайта</h2>
            
            <div className="bg-white rounded-lg border p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Контактная информация</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Телефон</Label>
                    <Input defaultValue="+7 747 226 68 85" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue="info@apexdigital.kz" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Адрес</Label>
                  <Input defaultValue="Астана, Казахстан" />
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900">Социальные сети</h3>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input placeholder="https://instagram.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input placeholder="https://linkedin.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Telegram</Label>
                    <Input placeholder="https://t.me/..." />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button className="bg-[#1973AE] hover:bg-[#155a8a]">
                  Сохранить изменения
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Vacancies Tab */}
          <TabsContent value="vacancies" className="space-y-6">
            <VacanciesManagement />
          </TabsContent>
        </Tabs>
      </div>

      {/* Project Create/Edit Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Редактировать проект' : 'Создать новый проект'}</DialogTitle>
            <DialogDescription>
              Заполните информацию о проекте на трёх языках. Обязательные поля отмечены звёздочкой (*)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Titles */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Название проекта</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Русский *</Label>
                  <Input
                    value={projectForm.titleRu}
                    onChange={(e) => setProjectForm({ ...projectForm, titleRu: e.target.value })}
                    placeholder="Название проекта"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Қазақша</Label>
                  <Input
                    value={projectForm.titleKz}
                    onChange={(e) => setProjectForm({ ...projectForm, titleKz: e.target.value })}
                    placeholder="Жоба атауы"
                  />
                </div>
                <div className="space-y-2">
                  <Label>English</Label>
                  <Input
                    value={projectForm.titleEn}
                    onChange={(e) => setProjectForm({ ...projectForm, titleEn: e.target.value })}
                    placeholder="Project title"
                  />
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Описание проекта</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Русский *</Label>
                  <Textarea
                    value={projectForm.descriptionRu}
                    onChange={(e) => setProjectForm({ ...projectForm, descriptionRu: e.target.value })}
                    placeholder="Подробное описание проекта"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Қазақша</Label>
                  <Textarea
                    value={projectForm.descriptionKz}
                    onChange={(e) => setProjectForm({ ...projectForm, descriptionKz: e.target.value })}
                    placeholder="Жоба туралы толық сипаттама"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>English</Label>
                  <Textarea
                    value={projectForm.descriptionEn}
                    onChange={(e) => setProjectForm({ ...projectForm, descriptionEn: e.target.value })}
                    placeholder="Detailed project description"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Category & Tags */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Категория *</Label>
                <Select value={projectForm.category} onValueChange={(value) => setProjectForm({ ...projectForm, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                    <SelectItem value="Backend Development">Backend Development</SelectItem>
                    <SelectItem value="ML & AI">ML & AI</SelectItem>
                    <SelectItem value="UX/UI Design">UX/UI Design</SelectItem>
                    <SelectItem value="1C Integration">1C Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Теги (через запятую)</Label>
                <Input
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label>Изображения проекта</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1973AE] transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="project-images"
                />
                <label htmlFor="project-images" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Нажмите для загрузки изображений
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG до 10MB (макс. 100MB)
                  </p>
                </label>
                {projectForm.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700">
                      Загружено файлов: {projectForm.images.length}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Ссылки (опционально)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Demo URL
                  </Label>
                  <Input
                    value={projectForm.demoUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                    placeholder="https://demo.example.com"
                    type="url"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    GitHub URL
                  </Label>
                  <Input
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    type="url"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsProjectDialogOpen(false)}>
              Отмена
            </Button>
            <Button className="bg-[#1973AE] hover:bg-[#155a8a]" onClick={handleSaveProject}>
              {editingProject ? 'Сохранить изменения' : 'Создать проект'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}