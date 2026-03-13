import { useEffect, useState } from 'react';
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
  Paperclip,
  Loader2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { clearSession, authFetch, downloadProtectedFile } from '../config/auth';
import { toast } from 'sonner';
import { VacanciesManagement } from './admin/VacanciesManagement';
import type { SiteSettingsDto } from '../types/api';

interface AttachmentInfoDto {
  name: string;
  size: number;
  url: string;
}

interface Submission {
  id: string;
  name: string;
  email?: string | null;
  company?: string | null;
  phone?: string | null;
  service?: string | null;
  budget?: string | null;
  timeline?: string | null;
  description?: string | null;
  attachments: AttachmentInfoDto[];
  status: 'new' | 'processed';
  processed: boolean;
  adminNote?: string | null;
  createdAt: string;
}

interface LocalizedStringDto {
  ru: string;
  kz: string;
  en: string;
}

interface AdminProjectDto {
  id: string;
  slug: string;
  title: LocalizedStringDto;
  description: LocalizedStringDto;
  fullDescription?: LocalizedStringDto | null;
  challenge?: LocalizedStringDto | null;
  solution?: LocalizedStringDto | null;
  features?: {
    ru: string[];
    kz: string[];
    en: string[];
  } | null;
  category: string;
  status: string;
  tags: string[];
  image: string;
  gallery?: string[] | null;
  goals?: {
    ru: string[];
    kz: string[];
    en: string[];
  } | null;
  stack?: string[] | null;
  results?: LocalizedStringDto | null;
  isVisible: boolean;
  timeline?: LocalizedStringDto | null;
}

const defaultSiteSettings: SiteSettingsDto = {
  phone: '+7 747 226 68 85',
  email: 'info@apexdigital.kz',
  address: {
    ru: 'Астана, Казахстан',
    kz: 'Астана, Қазақстан',
    en: 'Astana, Kazakhstan',
  },
  instagram: '',
  linkedin: '',
  telegram: '',
  whatsapp: '',
};

export function AdminPanel() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<AdminProjectDto[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [savingProject, setSavingProject] = useState(false);
  const [projectActionId, setProjectActionId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);
  const [updatingSubmissionId, setUpdatingSubmissionId] = useState<string | null>(null);
  const [settingsForm, setSettingsForm] = useState<SiteSettingsDto>(defaultSiteSettings);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    titleRu: '',
    titleKz: '',
    titleEn: '',
    descriptionRu: '',
    descriptionKz: '',
    descriptionEn: '',
    category: 'web',
    tags: '',
    image: null as File | null,
  });

  const handleLogout = () => {
    clearSession();
    navigate('/admin', {replace: true});
    toast.success('Вы вышли из системы');
  };

  const serviceLabelMap: Record<string, string> = {
    website: 'Веб-сайт',
    web: 'Веб-сайт',
    mobile: 'Мобильное приложение',
    backend: 'Backend-разработка',
    uxui: 'UX/UI дизайн',
    ai: 'AI / ML',
    outstaff: 'Аутстаффинг',
  };

  const budgetLabelMap: Record<string, string> = {
    under1m: 'До 1 000 000 ₸',
    small: 'До 1 000 000 ₸',
    medium: '1–3 млн ₸',
    large: '3–10 млн ₸',
    enterprise: '10+ млн ₸',
  };

  const timelineLabelMap: Record<string, string> = {
    asap: 'Как можно скорее',
    week: 'До 1 недели',
    twoweeks: '2 недели и больше',
    month: 'До 1 месяца',
    flexible: 'Гибко',
  };

  const getLabel = (value?: string | null, map?: Record<string, string>) => {
    if (!value) return '—';
    return map?.[value] || value;
  };

  const loadProjects = async () => {
    try {
      setIsLoadingProjects(true);

      const response = await authFetch('/api/admin/projects?page=1&pageSize=100');
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || result?.Message || 'Не удалось загрузить проекты');
      }

      setProjects(Array.isArray(result?.items) ? result.items : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось загрузить проекты';
      toast.error(message);

      if (message.includes('Сессия истекла')) {
        navigate('/admin', {replace: true});
      }
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      setIsLoadingSubmissions(true);

      const response = await authFetch('/api/admin/service-requests?page=1&pageSize=100');
      const raw = await response.text();

      if (!response.ok) {
        throw new Error(raw || 'Не удалось загрузить заявки');
      }

      const result = raw ? JSON.parse(raw) : null;
      const items = Array.isArray(result?.items) ? result.items : [];
      setSubmissions(items);
    } catch (error) {
      const message =
          error instanceof Error ? error.message : 'Не удалось загрузить заявки';

      toast.error(message);

      if (message.includes('Сессия истекла')) {
        navigate('/admin', {replace: true});
      }
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const loadSettings = async () => {
    try {
      setIsLoadingSettings(true);

      const response = await authFetch('/api/admin/settings');
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || result?.Message || 'Failed to load site settings');
      }

      setSettingsForm({
        ...defaultSiteSettings,
        ...(result || {}),
        address: {
          ...defaultSiteSettings.address,
          ...(result?.address || {}),
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load site settings';
      toast.error(message);

      if (message.includes('Session expired')) {
        navigate('/admin', {replace: true});
      }
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsSavingSettings(true);

      const response = await authFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settingsForm),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || result?.Message || 'Failed to save site settings');
      }

      setSettingsForm({
        ...defaultSiteSettings,
        ...(result || {}),
        address: {
          ...defaultSiteSettings.address,
          ...(result?.address || {}),
        },
      });
      toast.success('Contact information updated');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save site settings';
      toast.error(message);

      if (message.includes('Session expired')) {
        navigate('/admin', {replace: true});
      }
    } finally {
      setIsSavingSettings(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
    loadProjects();
    loadSettings();
  }, []);

  const toggleProjectPublish = async (projectId: string) => {
    try {
      setProjectActionId(projectId);

      const response = await authFetch(`/api/admin/projects/${projectId}/visibility`, {
        method: 'PATCH',
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || result?.Message || 'Не удалось изменить видимость проекта');
      }

      setProjects((prev) =>
          prev.map((p) =>
              p.id === projectId ? {...p, isVisible: !!result?.isVisible} : p
          )
      );

      toast.success(result?.isVisible ? 'Проект теперь видим' : 'Проект скрыт');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось изменить видимость проекта');
    } finally {
      setProjectActionId(null);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот проект?')) return;

    try {
      setProjectActionId(projectId);

      const response = await authFetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || result?.Message || 'Не удалось удалить проект');
      }

      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast.success('Проект удалён');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось удалить проект');
    } finally {
      setProjectActionId(null);
    }
  };

  const toggleSubmissionStatus = async (submissionId: string) => {
    const current = submissions.find((s) => s.id === submissionId);
    if (!current) return;

    const nextStatus = current.status === 'new' ? 'processed' : 'new';

    try {
      setUpdatingSubmissionId(submissionId);

      const response = await authFetch(`/api/admin/service-requests/${submissionId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: nextStatus,
          adminNote: current.adminNote || null,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || result?.Message || 'Не удалось обновить статус');
      }

      setSubmissions((prev) =>
          prev.map((s) =>
              s.id === submissionId
                  ? {...s, status: nextStatus as 'new' | 'processed', processed: nextStatus === 'processed'}
                  : s
          )
      );

      toast.success('Статус заявки обновлён');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось обновить статус');
    } finally {
      setUpdatingSubmissionId(null);
    }
  };

  const deleteSubmission = async (submissionId: string) => {
    if (!confirm('Delete this request?')) return;

    try {
      setUpdatingSubmissionId(submissionId);

      const response = await authFetch(`/api/admin/service-requests/${submissionId}`, {
        method: 'DELETE',
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || result?.Message || 'Failed to delete request');
      }

      setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
      toast.success(result?.message || 'Request deleted');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete request';
      toast.error(message);

      if (message.includes('Session expired')) {
        navigate('/admin', {replace: true});
      }
    } finally {
      setUpdatingSubmissionId(null);
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
      category: 'web',
      tags: '',
      image: null,
    });
    setEditingProject(null);
    setIsProjectDialogOpen(true);
  };

  const handleEditProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    setProjectForm({
      titleRu: project.title.ru || '',
      titleKz: project.title.kz || '',
      titleEn: project.title.en || '',
      descriptionRu: project.description.ru || '',
      descriptionKz: project.description.kz || '',
      descriptionEn: project.description.en || '',
      category: project.category || 'web',
      tags: project.tags.join(', '),
      image: null,
    });

    setEditingProject(projectId);
    setIsProjectDialogOpen(true);
  };

  const handleSaveProject = async () => {
    if (!projectForm.titleRu.trim() || !projectForm.descriptionRu.trim() || !projectForm.category.trim()) {
      toast.error('Заполните обязательные поля (RU версия)');
      return;
    }

    try {
      setSavingProject(true);

      const formData = new FormData();
      formData.append('TitleRu', projectForm.titleRu.trim());
      formData.append('TitleKz', projectForm.titleKz.trim());
      formData.append('TitleEn', projectForm.titleEn.trim());

      formData.append('DescriptionRu', projectForm.descriptionRu.trim());
      formData.append('DescriptionKz', projectForm.descriptionKz.trim());
      formData.append('DescriptionEn', projectForm.descriptionEn.trim());

      formData.append('Category', projectForm.category.trim());
      formData.append('Status', 'progress');
      formData.append('Tags', projectForm.tags);
      formData.append('IsVisible', 'true');

      if (projectForm.image) {
        formData.append('Image', projectForm.image);
      }

      const response = await authFetch(
          editingProject ? `/api/admin/projects/${editingProject}` : '/api/admin/projects',
          {
            method: editingProject ? 'PUT' : 'POST',
            body: formData,
          }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || result?.Message || 'Не удалось сохранить проект');
      }

      if (editingProject) {
        setProjects((prev) => prev.map((p) => (p.id === editingProject ? result : p)));
        toast.success('Проект успешно обновлён');
      } else {
        setProjects((prev) => [result, ...prev]);
        toast.success('Проект успешно создан');
      }

      setIsProjectDialogOpen(false);
      setEditingProject(null);
      setProjectForm({
        titleRu: '',
        titleKz: '',
        titleEn: '',
        descriptionRu: '',
        descriptionKz: '',
        descriptionEn: '',
        category: 'web',
        tags: '',
        image: null,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось сохранить проект');
    } finally {
      setSavingProject(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProjectForm((prev) => ({ ...prev, image: file }));

    if (file) {
      toast.success(`Загружен файл: ${file.name}`);
    }
  };

  const openAttachment = async (file: AttachmentInfoDto) => {
    try {
      await downloadProtectedFile(file.url, file.name);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось открыть файл');
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
          <header className="bg-white border-b sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded bg-gradient-to-br from-[#1973AE] to-[#39D2ED]"/>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">Административная панель</h1>
                    <p className="text-xs text-gray-500">Apex Digital</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" onClick={() => navigate('/')}>
                    Перейти на сайт
                  </Button>
                  <Button variant="destructive" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2"/>
                    Выход
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Tabs defaultValue="submissions" className="space-y-6">
              <TabsList className="grid w-full max-w-2xl grid-cols-4">
                <TabsTrigger value="projects">
                  <FolderOpen className="w-4 h-4 mr-2"/>
                  Проекты
                </TabsTrigger>
                <TabsTrigger value="submissions">
                  <MessageSquare className="w-4 h-4 mr-2"/>
                  Заявки
                  {submissions.filter((s) => s.status === 'new').length > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {submissions.filter((s) => s.status === 'new').length}
                      </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="w-4 h-4 mr-2"/>
                  Настройки
                </TabsTrigger>
                <TabsTrigger value="vacancies">
                  <Briefcase className="w-4 h-4 mr-2"/>
                  Вакансии
                </TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Проекты</h2>
                    <p className="text-gray-600">Управление портфолио компании</p>
                  </div>
                  <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                          onClick={() => {
                            setEditingProject(null);
                            setProjectForm({
                              titleRu: '',
                              titleKz: '',
                              titleEn: '',
                              descriptionRu: '',
                              descriptionKz: '',
                              descriptionEn: '',
                              category: '',
                              tags: '',
                              image: null,
                            });
                          }}
                          className="bg-[#1973AE] hover:bg-[#155a8a]"
                      >
                        <Plus className="w-4 h-4 mr-2"/>
                        Добавить проект
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingProject ? 'Редактировать проект' : 'Добавить новый проект'}
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-6">
                        <Tabs defaultValue="ru" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="ru">Русский</TabsTrigger>
                            <TabsTrigger value="kz">Қазақша</TabsTrigger>
                            <TabsTrigger value="en">English</TabsTrigger>
                          </TabsList>

                          <TabsContent value="ru" className="space-y-4">
                            <div>
                              <Label htmlFor="titleRu">Название проекта *</Label>
                              <Input
                                  id="titleRu"
                                  value={projectForm.titleRu}
                                  onChange={(e) =>
                                      setProjectForm({...projectForm, titleRu: e.target.value})
                                  }
                                  placeholder="Введите название проекта"
                              />
                            </div>
                            <div>
                              <Label htmlFor="descriptionRu">Описание проекта *</Label>
                              <Textarea
                                  id="descriptionRu"
                                  value={projectForm.descriptionRu}
                                  onChange={(e) =>
                                      setProjectForm({
                                        ...projectForm,
                                        descriptionRu: e.target.value,
                                      })
                                  }
                                  placeholder="Краткое описание проекта"
                                  rows={4}
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="kz" className="space-y-4">
                            <div>
                              <Label htmlFor="titleKz">Жоба атауы</Label>
                              <Input
                                  id="titleKz"
                                  value={projectForm.titleKz}
                                  onChange={(e) =>
                                      setProjectForm({...projectForm, titleKz: e.target.value})
                                  }
                                  placeholder="Жоба атауын енгізіңіз"
                              />
                            </div>
                            <div>
                              <Label htmlFor="descriptionKz">Жоба сипаттамасы</Label>
                              <Textarea
                                  id="descriptionKz"
                                  value={projectForm.descriptionKz}
                                  onChange={(e) =>
                                      setProjectForm({
                                        ...projectForm,
                                        descriptionKz: e.target.value,
                                      })
                                  }
                                  placeholder="Жобаның қысқаша сипаттамасы"
                                  rows={4}
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="en" className="space-y-4">
                            <div>
                              <Label htmlFor="titleEn">Project Title</Label>
                              <Input
                                  id="titleEn"
                                  value={projectForm.titleEn}
                                  onChange={(e) =>
                                      setProjectForm({...projectForm, titleEn: e.target.value})
                                  }
                                  placeholder="Enter project title"
                              />
                            </div>
                            <div>
                              <Label htmlFor="descriptionEn">Project Description</Label>
                              <Textarea
                                  id="descriptionEn"
                                  value={projectForm.descriptionEn}
                                  onChange={(e) =>
                                      setProjectForm({
                                        ...projectForm,
                                        descriptionEn: e.target.value,
                                      })
                                  }
                                  placeholder="Brief project description"
                                  rows={4}
                              />
                            </div>
                          </TabsContent>
                        </Tabs>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="category">Категория *</Label>
                            <Input
                                id="category"
                                value={projectForm.category}
                                onChange={(e) =>
                                    setProjectForm({...projectForm, category: e.target.value})
                                }
                                placeholder="например: Web Development"
                            />
                          </div>

                          <div>
                            <Label htmlFor="tags">Теги</Label>
                            <Input
                                id="tags"
                                value={projectForm.tags}
                                onChange={(e) =>
                                    setProjectForm({...projectForm, tags: e.target.value})
                                }
                                placeholder="React, TypeScript, Node.js"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="images">Изображение проекта</Label>
                          <Input
                              id="images"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                          />
                          {projectForm.image && (
                              <p className="text-sm text-gray-500 mt-1">
                                {projectForm.image.name}
                              </p>
                          )}
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button
                              variant="outline"
                              onClick={() => {
                                setIsProjectDialogOpen(false);
                                setEditingProject(null);
                              }}
                          >
                            Отмена
                          </Button>
                          <Button
                              onClick={handleSaveProject}
                              disabled={savingProject}
                              className="bg-[#1973AE] hover:bg-[#155a8a]"
                          >
                            {savingProject ? 'Сохранение...' : 'Сохранить'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {isLoadingProjects ? (
                    <div className="bg-white rounded-lg border p-10 text-center text-gray-500">
                      Загрузка проектов...
                    </div>
                ) : projects.length === 0 ? (
                    <div className="bg-white rounded-lg border p-10 text-center text-gray-500">
                      Проектов пока нет
                    </div>
                ) : (
                    <div className="grid gap-4">
                      {projects.map((project) => (
                          <div
                              key={project.id}
                              className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {project.title.ru}
                                  </h3>

                                  <Badge variant={project.status === 'progress' ? 'secondary' : 'default'}>
                                    {project.status === 'progress'
                                        ? 'В разработке'
                                        : project.status === 'done'
                                            ? 'Завершено'
                                            : project.status === 'discovery'
                                                ? 'Исследование'
                                                : project.status}
                                  </Badge>

                                  {!project.isVisible && <Badge variant="outline">Скрыт</Badge>}
                                </div>

                                <p className="text-sm text-gray-600 mb-3">{project.description.ru}</p>

                                <div className="flex flex-wrap gap-2">
                                  {project.tags.map((tag, idx) => (
                                      <span
                                          key={idx}
                                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                      >
                              {tag}
                            </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 ml-4">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={projectActionId === project.id}
                                    onClick={() => toggleProjectPublish(project.id)}
                                >
                                  {project.isVisible ? (
                                      <Eye className="w-4 h-4"/>
                                  ) : (
                                      <EyeOff className="w-4 h-4"/>
                                  )}
                                </Button>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditProject(project.id)}
                                >
                                  <Edit className="w-4 h-4"/>
                                </Button>

                                <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={projectActionId === project.id}
                                    onClick={() => deleteProject(project.id)}
                                >
                                  <Trash2 className="w-4 h-4"/>
                                </Button>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                )}
              </TabsContent>

              <TabsContent value="submissions" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Заявки клиентов</h2>
                  <div className="flex space-x-2">
                    <Badge variant="secondary">
                      Всего: {submissions.length}
                    </Badge>
                    <Badge variant="destructive">
                      Новые: {submissions.filter((s) => s.status === 'new').length}
                    </Badge>
                    <Button variant="outline" onClick={loadSubmissions} disabled={isLoadingSubmissions}>
                      {isLoadingSubmissions ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : null}
                      Обновить
                    </Button>
                  </div>
                </div>

                {isLoadingSubmissions ? (
                    <div className="bg-white rounded-lg border p-10 text-center text-gray-500">
                      Загрузка заявок...
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="bg-white rounded-lg border p-10 text-center text-gray-500">
                      Заявок пока нет
                    </div>
                ) : (
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
                                <p className="text-sm text-gray-600">{submission.company || 'Без компании'}</p>
                              </div>
                              <Badge variant={submission.status === 'new' ? 'destructive' : 'secondary'}>
                                {submission.status === 'new' ? 'Новая' : 'Обработано'}
                              </Badge>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Email:</span>
                                  <p className="text-gray-900">{submission.email || '—'}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Телефон:</span>
                                  <p className="text-gray-900">{submission.phone || '—'}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Услуга:</span>
                                  <p className="text-gray-900">{getLabel(submission.service, serviceLabelMap)}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Бюджет:</span>
                                  <p className="text-gray-900">{getLabel(submission.budget, budgetLabelMap)}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Срок:</span>
                                  <p className="text-gray-900">{getLabel(submission.timeline, timelineLabelMap)}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Дата:</span>
                                  <p className="text-gray-900">{formatDateTime(submission.createdAt)}</p>
                                </div>
                              </div>

                              <div>
                                <span className="text-sm text-gray-500">Описание:</span>
                                <p className="text-sm text-gray-900 mt-1">{submission.description || '—'}</p>
                              </div>

                              {submission.attachments.length > 0 && (
                                  <div>
                                    <span className="text-sm text-gray-500">Файлы:</span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {submission.attachments.map((file, idx) => (
                                          <Button
                                              key={`${submission.id}-${idx}`}
                                              type="button"
                                              size="sm"
                                              variant="outline"
                                              onClick={() => openAttachment(file)}
                                              className="h-auto py-1.5"
                                          >
                                            <Paperclip className="w-4 h-4 mr-2"/>
                                            {file.name}
                                          </Button>
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
                                  disabled={updatingSubmissionId === submission.id}
                              >
                                {updatingSubmissionId === submission.id ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                                      Сохранение...
                                    </>
                                ) : submission.status === 'new' ? (
                                    <>
                                      <Check className="w-4 h-4 mr-2"/>
                                      Отметить обработанной
                                    </>
                                ) : (
                                    <>
                                      <X className="w-4 h-4 mr-2"/>
                                      Отметить новой
                                    </>
                                )}
                              </Button>

                              <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteSubmission(submission.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2"/>
                                Удалить
                              </Button>
                            </div>
                          </div>
                      ))}
                    </div>
                )}
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>

                <div className="bg-white rounded-lg border p-6 space-y-6">
                  {isLoadingSettings ? (
                      <div className="flex items-center gap-3 text-gray-600">
                        <Loader2 className="w-4 h-4 animate-spin"/>
                        <span>Loading settings...</span>
                      </div>
                  ) : (
                      <>
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Phone</Label>
                              <Input value={settingsForm.phone} onChange={(e) => setSettingsForm((current) => ({
                                ...current,
                                phone: e.target.value
                              }))}/>
                            </div>
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input value={settingsForm.email} onChange={(e) => setSettingsForm((current) => ({
                                ...current,
                                email: e.target.value
                              }))}/>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Address (RU)</Label>
                              <Input value={settingsForm.address.ru} onChange={(e) => setSettingsForm((current) => ({
                                ...current,
                                address: {...current.address, ru: e.target.value}
                              }))}/>
                            </div>
                            <div className="space-y-2">
                              <Label>Address (KZ)</Label>
                              <Input value={settingsForm.address.kz} onChange={(e) => setSettingsForm((current) => ({
                                ...current,
                                address: {...current.address, kz: e.target.value}
                              }))}/>
                            </div>
                            <div className="space-y-2">
                              <Label>Address (EN)</Label>
                              <Input value={settingsForm.address.en} onChange={(e) => setSettingsForm((current) => ({
                                ...current,
                                address: {...current.address, en: e.target.value}
                              }))}/>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t">
                          <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Instagram</Label>
                              <Input value={settingsForm.instagram || ''}
                                     onChange={(e) => setSettingsForm((current) => ({
                                       ...current,
                                       instagram: e.target.value
                                     }))} placeholder="https://instagram.com/..."/>
                            </div>
                            <div className="space-y-2">
                              <Label>LinkedIn</Label>
                              <Input value={settingsForm.linkedin || ''}
                                     onChange={(e) => setSettingsForm((current) => ({
                                       ...current,
                                       linkedin: e.target.value
                                     }))} placeholder="https://linkedin.com/..."/>
                            </div>
                            <div className="space-y-2">
                              <Label>Telegram</Label>
                              <Input value={settingsForm.telegram || ''}
                                     onChange={(e) => setSettingsForm((current) => ({
                                       ...current,
                                       telegram: e.target.value
                                     }))} placeholder="https://t.me/..."/>
                            </div>
                            <div className="space-y-2">
                              <Label>WhatsApp</Label>
                              <Input value={settingsForm.whatsapp || ''}
                                     onChange={(e) => setSettingsForm((current) => ({
                                       ...current,
                                       whatsapp: e.target.value
                                     }))} placeholder="https://wa.me/..."/>
                            </div>
                          </div>
                        </div>

                        <div className="pt-6">
                          <Button className="bg-[#1973AE] hover:bg-[#155a8a]" disabled={isSavingSettings}
                                  onClick={() => void saveSettings()}>
                            {isSavingSettings && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                            Save changes
                          </Button>
                        </div>
                      </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="vacancies" className="space-y-6">
                <VacanciesManagement/>
              </TabsContent>
            </Tabs>
          </div>
        </div>
    );
  }