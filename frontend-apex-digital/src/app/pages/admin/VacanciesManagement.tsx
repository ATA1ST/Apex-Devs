import { useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Download, UsersIcon, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { authFetch, downloadProtectedFile } from '../../config/auth';
import { getApiErrorMessage, type ApiErrorPayload } from '../../config/api';

type EmploymentType = 'full-time' | 'part-time' | 'contract';
type VacancyStatus = 'draft' | 'published' | 'closed';
type DepartmentType = 'dev' | 'design' | 'pm' | 'other';
type LocationType = 'astana' | 'remote' | 'hybrid';

interface LocalizedText {
  ru: string;
  kz: string;
  en: string;
}

interface VacancyLocaleDetails {
  role: string;
  tasks: string[];
  requirements: string[];
  plusPoints: string[];
  conditions: string[];
}

interface Vacancy {
  id: string;
  slug: string;
  title: LocalizedText;
  shortDescription: LocalizedText;
  postedDate: string;
  department: DepartmentType | string;
  location: LocationType | string;
  employmentType: EmploymentType | string;
  status: VacancyStatus | string;
  isVisible: boolean;
  description: {
    ru: VacancyLocaleDetails;
    kz: VacancyLocaleDetails;
    en: VacancyLocaleDetails;
  };
  stack: string[];
  applicationsCount?: number;
}

interface JobApplication {
  id: string;
  jobId?: string;
  name: string;
  email?: string;
  phone: string;
  links?: string;
  message?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  appliedAt: string;
}

type VacancyFormState = {
  slug: string;
  title: LocalizedText;
  shortDescription: LocalizedText;
  postedDate: string;
  department: DepartmentType;
  location: LocationType;
  employmentType: EmploymentType;
  status: VacancyStatus;
  isVisible: boolean;
  stack: string[];
  description: {
    ru: VacancyLocaleDetails;
    kz: VacancyLocaleDetails;
    en: VacancyLocaleDetails;
  };
};

const emptyLocaleDetails = (): VacancyLocaleDetails => ({
  role: '',
  tasks: [],
  requirements: [],
  plusPoints: [],
  conditions: [],
});

const createEmptyForm = (): VacancyFormState => ({
  slug: '',
  title: { ru: '', kz: '', en: '' },
  shortDescription: { ru: '', kz: '', en: '' },
  postedDate: new Date().toISOString().split('T')[0],
  department: 'dev',
  location: 'astana',
  employmentType: 'full-time',
  status: 'draft',
  isVisible: true,
  stack: [],
  description: {
    ru: emptyLocaleDetails(),
    kz: emptyLocaleDetails(),
    en: emptyLocaleDetails(),
  },
});

function getDepartmentLabel(value: string) {
  switch (value) {
    case 'dev':
      return 'Разработка';
    case 'design':
      return 'Дизайн';
    case 'pm':
      return 'Менеджмент';
    case 'other':
      return 'Другое';
    default:
      return value;
  }
}

function getLocationLabel(value: string) {
  switch (value) {
    case 'astana':
      return 'Астана';
    case 'remote':
      return 'Удалённо';
    case 'hybrid':
      return 'Гибрид';
    default:
      return value;
  }
}

function getEmploymentLabel(value: string) {
  switch (value) {
    case 'full-time':
      return 'Full-time';
    case 'part-time':
      return 'Part-time';
    case 'contract':
      return 'Contract';
    default:
      return value;
  }
}

function getStatusLabel(value: string) {
  switch (value) {
    case 'draft':
      return 'Черновик';
    case 'published':
      return 'Опубликована';
    case 'closed':
      return 'Закрыта';
    default:
      return value;
  }
}

function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'published') return 'default';
  if (status === 'closed') return 'destructive';
  return 'secondary';
}

function linesToArray(value: string) {
  return value
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean);
}

function arrayToLines(value?: string[]) {
  return (value || []).join('\n');
}

function mapVacancyToForm(vacancy: Vacancy): VacancyFormState {
  return {
    slug: vacancy.slug || '',
    title: vacancy.title || { ru: '', kz: '', en: '' },
    shortDescription: vacancy.shortDescription || { ru: '', kz: '', en: '' },
    postedDate: vacancy.postedDate || new Date().toISOString().split('T')[0],
    department: (vacancy.department as DepartmentType) || 'dev',
    location: (vacancy.location as LocationType) || 'astana',
    employmentType: (vacancy.employmentType as EmploymentType) || 'full-time',
    status: (vacancy.status as VacancyStatus) || 'draft',
    isVisible: vacancy.isVisible ?? true,
    stack: vacancy.stack || [],
    description: {
      ru: vacancy.description?.ru || emptyLocaleDetails(),
      kz: vacancy.description?.kz || emptyLocaleDetails(),
      en: vacancy.description?.en || emptyLocaleDetails(),
    },
  };
}

function normalizeVacancyFromApi(raw: any): Vacancy {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title ?? { ru: '', kz: '', en: '' },
    shortDescription: raw.shortDescription ?? { ru: '', kz: '', en: '' },
    postedDate: raw.postedDate ?? '',
    department: raw.department ?? 'dev',
    location: raw.location ?? 'astana',
    employmentType: raw.employmentType ?? 'full-time',
    status: raw.status ?? 'draft',
    isVisible: raw.isVisible ?? true,
    description: raw.description ?? {
      ru: emptyLocaleDetails(),
      kz: emptyLocaleDetails(),
      en: emptyLocaleDetails(),
    },
    stack: raw.stack ?? [],
    applicationsCount:
        raw.applicants ??
        raw.applicationsCount ??
        raw.responsesCount ??
        raw.applications?.length ??
        0,
  };
}

function normalizeApplicationsFromApi(raw: any[]): JobApplication[] {
  return (raw || []).map((item) => ({
    id: item.id,
    jobId: item.jobId,
    name: item.name,
    email: item.email,
    phone: item.phone,
    links: item.links,
    message: item.message,
    resumeUrl: item.resumeUrl ?? item.resume?.url ?? item.fileUrl,
    resumeFileName:
        item.resumeFileName ?? item.resume?.fileName ?? item.resume?.name ?? item.resumeFile?.name,
    appliedAt: item.appliedAt ?? item.createdAt ?? new Date().toISOString(),
  }));
}

export function VacanciesManagement() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApplicationsDialogOpen, setIsApplicationsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);

  const [editingVacancyId, setEditingVacancyId] = useState<string | null>(null);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [formData, setFormData] = useState<VacancyFormState>(createEmptyForm());

  const adminJobsPath = useMemo(() => '/api/admin/jobs', []);
  const adminApplicantsPath = useMemo(() => '/api/admin/applicants', []);

  const loadVacancies = async () => {
    try {
      setIsLoading(true);

      const response = await authFetch('/api/admin/jobs?page=1&pageSize=200');
      const data = (await response.json().catch(() => null)) as
          | { items?: any[] }
          | ApiErrorPayload
          | any[]
          | null;

      if (!response.ok) {
        throw new Error(
            getApiErrorMessage(data as ApiErrorPayload | null, 'Не удалось загрузить вакансии')
        );
      }

      const list = Array.isArray(data) ? data : data?.items ?? [];
      setVacancies(list.map(normalizeVacancyFromApi));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка загрузки вакансий');
      setVacancies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadVacancies();
  }, []);

  const handleCreate = () => {
    setFormData(createEmptyForm());
    setEditingVacancyId(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (vacancy: Vacancy) => {
    setFormData(mapVacancyToForm(vacancy));
    setEditingVacancyId(vacancy.id);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.slug.trim() || !formData.title.ru.trim() || !formData.shortDescription.ru.trim()) {
      toast.error('Заполните обязательные поля');
      return;
    }

    const payload = {
      slug: formData.slug.trim(),
      title: {
        ru: formData.title.ru.trim(),
        kz: formData.title.kz.trim(),
        en: formData.title.en.trim(),
      },
      shortDescription: {
        ru: formData.shortDescription.ru.trim(),
        kz: formData.shortDescription.kz.trim(),
        en: formData.shortDescription.en.trim(),
      },
      requirements: formData.description.ru.requirements.map((req, index) => ({
        ru: req,
        kz: formData.description.kz.requirements[index] || '',
        en: formData.description.en.requirements[index] || '',
      })),
      postedDate: formData.postedDate,
      department: formData.department,
      location: formData.location,
      employmentType: formData.employmentType,
      status: formData.status,
      isVisible: formData.isVisible,
      description: {
        ru: formData.description.ru,
        kz: formData.description.kz,
        en: formData.description.en,
      },
      stack: formData.stack,
    };

    try {
      setIsSaving(true);

      const response = await authFetch(
          editingVacancyId ? `${adminJobsPath}/${editingVacancyId}` : adminJobsPath,
          {
            method: editingVacancyId ? 'PUT' : 'POST',
            body: JSON.stringify(payload),
          }
      );

      const result = (await response.json().catch(() => null)) as Vacancy | ApiErrorPayload | null;

      if (!response.ok) {
        throw new Error(
            getApiErrorMessage(
                result as ApiErrorPayload | null,
                editingVacancyId ? 'Не удалось обновить вакансию' : 'Не удалось создать вакансию'
            )
        );
      }

      toast.success(editingVacancyId ? 'Вакансия обновлена' : 'Вакансия создана');
      setIsDialogOpen(false);
      setEditingVacancyId(null);
      await loadVacancies();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка сохранения вакансии');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить вакансию?')) return;

    try {
      const response = await authFetch(`${adminJobsPath}/${id}`, {
        method: 'DELETE',
      });

      const result = (await response.json().catch(() => null)) as ApiErrorPayload | null;

      if (!response.ok) {
        throw new Error(getApiErrorMessage(result, 'Не удалось удалить вакансию'));
      }

      setVacancies((prev) => prev.filter((v) => v.id !== id));
      toast.success('Вакансия удалена');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка удаления вакансии');
    }
  };

  const toggleVisibility = async (vacancy: Vacancy) => {
    const payload = {
      slug: vacancy.slug,
      title: vacancy.title,
      shortDescription: vacancy.shortDescription,
      requirements: vacancy.description.ru.requirements.map((req, index) => ({
        ru: req,
        kz: vacancy.description.kz.requirements[index] || '',
        en: vacancy.description.en.requirements[index] || '',
      })),
      postedDate: vacancy.postedDate,
      department: vacancy.department,
      location: vacancy.location,
      employmentType: vacancy.employmentType,
      status: vacancy.status,
      isVisible: !vacancy.isVisible,
      description: vacancy.description,
      stack: vacancy.stack,
    };

    try {
      const response = await authFetch(`${adminJobsPath}/${vacancy.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as Vacancy | ApiErrorPayload | null;

      if (!response.ok) {
        throw new Error(getApiErrorMessage(result as ApiErrorPayload | null, 'Не удалось изменить видимость вакансии'));
      }

      setVacancies((prev) =>
          prev.map((v) =>
              v.id === vacancy.id ? { ...v, isVisible: !v.isVisible } : v
          )
      );
      toast.success('Видимость вакансии изменена');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка изменения видимости');
    }
  };

  const showApplications = async (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
    setApplications([]);
    setIsApplicationsDialogOpen(true);

    try {
      setIsLoadingApplications(true);

      const response = await authFetch(
          `${adminApplicantsPath}?jobId=${encodeURIComponent(vacancy.id)}&page=1&pageSize=100`
      );

      const data = (await response.json().catch(() => null)) as
          | { items?: any[] }
          | ApiErrorPayload
          | any[]
          | null;

      if (!response.ok) {
        throw new Error(getApiErrorMessage(data as ApiErrorPayload | null, 'Не удалось загрузить отклики'));
      }

      const list = Array.isArray(data) ? data : data?.items ?? [];
      setApplications(normalizeApplicationsFromApi(list));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка загрузки откликов');
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const downloadResume = async (app: JobApplication) => {
    try {
      await downloadProtectedFile(`/api/admin/applicants/${app.id}/resume`, app.resumeFileName || 'resume');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '???????????? ???????????????????? ????????????');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderLocaleSection = (
      locale: 'ru' | 'kz' | 'en',
      title: string
  ) => (
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-gray-900">{title}</h3>

        <div className="space-y-2">
          <Label>Роль</Label>
          <Textarea
              value={formData.description[locale].role}
              onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: {
                      ...formData.description,
                      [locale]: {
                        ...formData.description[locale],
                        role: e.target.value,
                      },
                    },
                  })
              }
              rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Задачи (по одной на строку)</Label>
          <Textarea
              value={arrayToLines(formData.description[locale].tasks)}
              onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: {
                      ...formData.description,
                      [locale]: {
                        ...formData.description[locale],
                        tasks: linesToArray(e.target.value),
                      },
                    },
                  })
              }
              rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Требования (по одному на строку)</Label>
          <Textarea
              value={arrayToLines(formData.description[locale].requirements)}
              onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: {
                      ...formData.description,
                      [locale]: {
                        ...formData.description[locale],
                        requirements: linesToArray(e.target.value),
                      },
                    },
                  })
              }
              rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Будет плюсом (по одному на строку)</Label>
          <Textarea
              value={arrayToLines(formData.description[locale].plusPoints)}
              onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: {
                      ...formData.description,
                      [locale]: {
                        ...formData.description[locale],
                        plusPoints: linesToArray(e.target.value),
                      },
                    },
                  })
              }
              rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Условия (по одному на строку)</Label>
          <Textarea
              value={arrayToLines(formData.description[locale].conditions)}
              onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: {
                      ...formData.description,
                      [locale]: {
                        ...formData.description[locale],
                        conditions: linesToArray(e.target.value),
                      },
                    },
                  })
              }
              rows={3}
          />
        </div>
      </div>
  );

  return (
      <>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Управление вакансиями</h2>
            <Button className="bg-[#1973AE] hover:bg-[#155a8a]" onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Создать вакансию
            </Button>
          </div>

          {isLoading ? (
              <div className="bg-white rounded-lg border p-8 flex items-center justify-center text-gray-500">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Загрузка вакансий...
              </div>
          ) : vacancies.length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
                Пока нет вакансий
              </div>
          ) : (
              <div className="grid gap-4">
                {vacancies.map((vacancy) => (
                    <div key={vacancy.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{vacancy.title.ru}</h3>

                            <Badge variant={vacancy.isVisible ? 'default' : 'secondary'}>
                              {vacancy.isVisible ? 'Видна на сайте' : 'Скрыта'}
                            </Badge>

                            <Badge variant={getStatusBadgeVariant(vacancy.status)}>
                              {getStatusLabel(vacancy.status)}
                            </Badge>

                            {(vacancy.applicationsCount ?? 0) > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="cursor-pointer"
                                    onClick={() => void showApplications(vacancy)}
                                >
                                  <UsersIcon className="w-3 h-3 mr-1" />
                                  {vacancy.applicationsCount} откликов
                                </Badge>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 mb-3">{vacancy.shortDescription.ru}</p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                            <span>{getLocationLabel(vacancy.location)}</span>
                            <span>{getDepartmentLabel(vacancy.department)}</span>
                            <span>{getEmploymentLabel(vacancy.employmentType)}</span>
                            <span>{vacancy.postedDate}</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {vacancy.stack.map((tech, idx) => (
                                <span key={idx} className="px-2 py-1 bg-[#D1EDF4] text-[#1973AE] text-xs rounded">
                          {tech}
                        </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {(vacancy.applicationsCount ?? 0) > 0 && (
                              <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-[#39D2ED] text-[#39D2ED] hover:bg-[#39D2ED]/10"
                                  onClick={() => void showApplications(vacancy)}
                              >
                                <UsersIcon className="w-4 h-4" />
                              </Button>
                          )}

                          <Button size="sm" variant="outline" onClick={() => void toggleVisibility(vacancy)}>
                            {vacancy.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>

                          <Button size="sm" variant="outline" onClick={() => handleEdit(vacancy)}>
                            <Edit className="w-4 h-4" />
                          </Button>

                          <Button size="sm" variant="destructive" onClick={() => void handleDelete(vacancy.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVacancyId ? 'Редактировать вакансию' : 'Создать вакансию'}</DialogTitle>
              <DialogDescription>
                Заполните информацию о вакансии на трёх языках
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="senior-fullstack-developer"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Дата публикации</Label>
                  <Input
                      type="date"
                      value={formData.postedDate}
                      onChange={(e) => setFormData({ ...formData, postedDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Отдел</Label>
                  <Select
                      value={formData.department}
                      onValueChange={(value: DepartmentType) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dev">Разработка</SelectItem>
                      <SelectItem value="design">Дизайн</SelectItem>
                      <SelectItem value="pm">Менеджмент</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Локация</Label>
                  <Select
                      value={formData.location}
                      onValueChange={(value: LocationType) => setFormData({ ...formData, location: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="astana">Астана</SelectItem>
                      <SelectItem value="remote">Удалённо</SelectItem>
                      <SelectItem value="hybrid">Гибрид</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Тип занятости</Label>
                  <Select
                      value={formData.employmentType}
                      onValueChange={(value: EmploymentType) => setFormData({ ...formData, employmentType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Статус</Label>
                  <Select
                      value={formData.status}
                      onValueChange={(value: VacancyStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Черновик</SelectItem>
                      <SelectItem value="published">Опубликована</SelectItem>
                      <SelectItem value="closed">Закрыта</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Видимость</Label>
                <Select
                    value={formData.isVisible ? 'visible' : 'hidden'}
                    onValueChange={(value) =>
                        setFormData({ ...formData, isVisible: value === 'visible' })
                    }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visible">Видна на сайте</SelectItem>
                    <SelectItem value="hidden">Скрыта</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Название вакансии *</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Русский</Label>
                    <Input
                        value={formData.title.ru}
                        onChange={(e) =>
                            setFormData({
                              ...formData,
                              title: { ...formData.title, ru: e.target.value },
                            })
                        }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Қазақша</Label>
                    <Input
                        value={formData.title.kz}
                        onChange={(e) =>
                            setFormData({
                              ...formData,
                              title: { ...formData.title, kz: e.target.value },
                            })
                        }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>English</Label>
                    <Input
                        value={formData.title.en}
                        onChange={(e) =>
                            setFormData({
                              ...formData,
                              title: { ...formData.title, en: e.target.value },
                            })
                        }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Краткое описание *</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>Русский</Label>
                    <Textarea
                        value={formData.shortDescription.ru}
                        onChange={(e) =>
                            setFormData({
                              ...formData,
                              shortDescription: { ...formData.shortDescription, ru: e.target.value },
                            })
                        }
                        rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Қазақша</Label>
                    <Textarea
                        value={formData.shortDescription.kz}
                        onChange={(e) =>
                            setFormData({
                              ...formData,
                              shortDescription: { ...formData.shortDescription, kz: e.target.value },
                            })
                        }
                        rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>English</Label>
                    <Textarea
                        value={formData.shortDescription.en}
                        onChange={(e) =>
                            setFormData({
                              ...formData,
                              shortDescription: { ...formData.shortDescription, en: e.target.value },
                            })
                        }
                        rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Технологический стек (через запятую)</Label>
                <Input
                    value={formData.stack.join(', ')}
                    onChange={(e) =>
                        setFormData({
                          ...formData,
                          stack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                    }
                    placeholder="React, TypeScript, Node.js, PostgreSQL"
                />
              </div>

              {renderLocaleSection('ru', 'Подробное описание (Русский)')}
              {renderLocaleSection('kz', 'Подробное описание (Қазақша)')}
              {renderLocaleSection('en', 'Detailed Description (English)')}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                Отмена
              </Button>
              <Button
                  className="bg-[#1973AE] hover:bg-[#155a8a]"
                  onClick={() => void handleSave()}
                  disabled={isSaving}
              >
                {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Сохранение...
                    </>
                ) : editingVacancyId ? (
                    'Сохранить'
                ) : (
                    'Создать'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isApplicationsDialogOpen} onOpenChange={setIsApplicationsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Отклики на вакансию: {selectedVacancy?.title.ru}</DialogTitle>
              <DialogDescription>
                Всего откликов: {applications.length}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {isLoadingApplications ? (
                  <div className="text-center py-8 text-gray-500 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Загрузка откликов...
                  </div>
              ) : applications.length > 0 ? (
                  applications.map((app) => (
                      <div key={app.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="space-y-1">
                            <h4 className="font-semibold text-gray-900">{app.name}</h4>
                            <p className="text-sm text-gray-600">{app.phone}</p>
                            {app.email && <p className="text-sm text-gray-600">{app.email}</p>}
                            <p className="text-xs text-gray-500 mt-1">
                              Откликнулся: {formatDate(app.appliedAt)}
                            </p>
                          </div>

                          <Button
                              size="sm"
                              variant="outline"
                              className="border-[#1973AE] text-[#1973AE]"
                              onClick={() => void downloadResume(app)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Скачать резюме
                          </Button>
                        </div>

                        {app.links && (
                            <div className="text-sm text-gray-600 mb-2 whitespace-pre-line">
                              <span className="font-medium text-gray-800">Ссылки:</span>
                              <div className="mt-1">{app.links}</div>
                            </div>
                        )}

                        {app.message && (
                            <div className="text-sm text-gray-600 mb-2 whitespace-pre-line">
                              <span className="font-medium text-gray-800">Сопроводительное письмо:</span>
                              <div className="mt-1">{app.message}</div>
                            </div>
                        )}

                        <div className="text-sm text-gray-500">
                          📎 {app.resumeFileName || app.resumeUrl || 'Резюме'}
                        </div>
                      </div>
                  ))
              ) : (
                  <div className="text-center py-8 text-gray-500">
                    Пока нет откликов на эту вакансию
                  </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
  );
}