import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { authFetch } from '../../config/auth';
import { getApiErrorMessage, type ApiErrorPayload } from '../../config/api';
import type { CreateJobDto, JobDescriptionLocalized, JobDto, LocalizedString } from '../../types/api';
import { toast } from 'sonner';

const emptyLocalizedString = (): LocalizedString => ({ ru: '', kz: '', en: '' });
const emptyDescription = (): JobDescriptionLocalized => ({
  ru: { role: '', tasks: [''], requirements: [''], plusPoints: [''], conditions: [''] },
  kz: { role: '', tasks: [''], requirements: [''], plusPoints: [''], conditions: [''] },
  en: { role: '', tasks: [''], requirements: [''], plusPoints: [''], conditions: [''] },
});

export function AdminJobFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = !!id && id !== 'new';
  const [activeTab, setActiveTab] = useState<'ru' | 'kz' | 'en'>('ru');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [formData, setFormData] = useState({
    slug: '',
    title: emptyLocalizedString(),
    shortDescription: emptyLocalizedString(),
    requirements: [] as Array<LocalizedString>,
    requirementDrafts: { ru: '', kz: '', en: '' },
    postedDate: new Date().toISOString().split('T')[0],
    department: 'dev',
    location: 'hybrid',
    employmentType: 'full-time',
    status: 'draft',
    isVisible: true,
    description: emptyDescription(),
    stack: [] as string[],
    stackInput: '',
  });

  useEffect(() => {
    if (!isEdit || !id) {
      return;
    }

    let cancelled = false;

    const loadJob = async () => {
      try {
        setIsLoading(true);
        const response = await authFetch(`/api/admin/jobs/${id}`);
        const result = (await response.json().catch(() => null)) as JobDto | ApiErrorPayload | null;

        if (!response.ok) {
          throw new Error(getApiErrorMessage(result as ApiErrorPayload | null, 'Не удалось загрузить вакансию'));
        }

        const job = result as JobDto;
        if (!cancelled) {
          setFormData({
            slug: job.slug,
            title: job.title,
            shortDescription: job.shortDescription,
            requirements: job.requirements,
            requirementDrafts: { ru: '', kz: '', en: '' },
            postedDate: job.postedDate,
            department: job.department,
            location: job.location,
            employmentType: job.employmentType,
            status: job.status,
            isVisible: job.isVisible,
            description: job.description,
            stack: job.stack || [],
            stackInput: '',
          });
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Не удалось загрузить вакансию');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadJob();

    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const buildPayload = (): CreateJobDto => ({
    slug: formData.slug.trim(),
    title: formData.title,
    shortDescription: formData.shortDescription,
    requirements: formData.requirements,
    postedDate: formData.postedDate,
    department: formData.department,
    location: formData.location,
    employmentType: formData.employmentType,
    status: formData.status,
    isVisible: formData.isVisible,
    description: formData.description,
    stack: formData.stack,
  });

  const handleSave = async () => {
    if (!formData.slug.trim()) {
      toast.error('Заполните slug');
      return;
    }

    if (!formData.title.ru.trim() || !formData.title.kz.trim() || !formData.title.en.trim()) {
      toast.error('Заполните название на всех языках');
      return;
    }

    if (!formData.shortDescription.ru.trim() || !formData.shortDescription.kz.trim() || !formData.shortDescription.en.trim()) {
      toast.error('Добавьте краткое описание на всех языках');
      return;
    }

    try {
      setIsSaving(true);
      const response = await authFetch(isEdit ? `/api/admin/jobs/${id}` : '/api/admin/jobs', {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(buildPayload()),
      });
      const result = (await response.json().catch(() => null)) as JobDto | ApiErrorPayload | null;

      if (!response.ok) {
        throw new Error(getApiErrorMessage(result as ApiErrorPayload | null, 'Не удалось сохранить вакансию'));
      }

      toast.success(isEdit ? 'Вакансия обновлена' : 'Вакансия создана');
      navigate('/admin/jobs');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось сохранить вакансию');
    } finally {
      setIsSaving(false);
    }
  };

  const updateDescriptionField = (lang: 'ru' | 'kz' | 'en', field: keyof JobDescriptionLocalized['ru'], value: string | string[]) => {
    setFormData((current) => ({
      ...current,
      description: {
        ...current.description,
        [lang]: {
          ...current.description[lang],
          [field]: value,
        },
      },
    }));
  };

  const addArrayItem = (lang: 'ru' | 'kz' | 'en', field: 'tasks' | 'requirements' | 'plusPoints' | 'conditions') => {
    updateDescriptionField(lang, field, [...formData.description[lang][field], '']);
  };

  const removeArrayItem = (lang: 'ru' | 'kz' | 'en', field: 'tasks' | 'requirements' | 'plusPoints' | 'conditions', index: number) => {
    updateDescriptionField(lang, field, formData.description[lang][field].filter((_, i) => i !== index));
  };

  const updateArrayItem = (lang: 'ru' | 'kz' | 'en', field: 'tasks' | 'requirements' | 'plusPoints' | 'conditions', index: number, value: string) => {
    const updated = [...formData.description[lang][field]];
    updated[index] = value;
    updateDescriptionField(lang, field, updated);
  };

  const addRequirement = () => {
    const { ru, kz, en } = formData.requirementDrafts;
    if (!ru.trim() || !kz.trim() || !en.trim()) {
      toast.error('Добавьте требование на всех языках');
      return;
    }

    setFormData((current) => ({
      ...current,
      requirements: [...current.requirements, { ru: ru.trim(), kz: kz.trim(), en: en.trim() }],
      requirementDrafts: { ru: '', kz: '', en: '' },
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData((current) => ({
      ...current,
      requirements: current.requirements.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const addStackItem = () => {
    if (formData.stackInput.trim()) {
      setFormData((current) => ({
        ...current,
        stack: [...current.stack, current.stackInput.trim()],
        stackInput: '',
      }));
    }
  };

  const removeStackItem = (index: number) => {
    setFormData((current) => ({
      ...current,
      stack: current.stack.filter((_, i) => i !== index),
    }));
  };

  const renderLanguageForm = (lang: 'ru' | 'kz' | 'en') => {
    const desc = formData.description[lang];
    const langLabel = lang === 'ru' ? 'Русский' : lang === 'kz' ? 'Қазақша' : 'English';

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Название ({langLabel})*</Label>
          <Input
            value={formData.title[lang]}
            onChange={(e) => setFormData({ ...formData, title: { ...formData.title, [lang]: e.target.value } })}
            placeholder="Senior Frontend Developer"
          />
        </div>

        <div className="space-y-2">
          <Label>Краткое описание ({langLabel})*</Label>
          <Textarea
            rows={3}
            value={formData.shortDescription[lang]}
            onChange={(e) => setFormData({ ...formData, shortDescription: { ...formData.shortDescription, [lang]: e.target.value } })}
          />
        </div>

        <div className="space-y-2">
          <Label>О роли</Label>
          <Textarea rows={4} value={desc.role} onChange={(e) => updateDescriptionField(lang, 'role', e.target.value)} />
        </div>

        {(['tasks', 'requirements', 'plusPoints', 'conditions'] as const).map((field) => (
          <div key={field} className="space-y-2">
            <Label>{field}</Label>
            {desc[field].map((item, idx) => (
              <div key={`${field}-${idx}`} className="flex gap-2">
                <Input value={item} onChange={(e) => updateArrayItem(lang, field, idx, e.target.value)} />
                <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem(lang, field, idx)}>
                  ×
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(lang, field)}>
              + Add {field}
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/admin/jobs')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{isEdit ? 'Редактировать вакансию' : 'Новая вакансия'}</h1>
          </div>
        </div>
        <Button className="bg-[#1973AE] hover:bg-[#155a8a] text-white" onClick={() => void handleSave()} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-500">Загрузка вакансии...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Slug*</Label>
              <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="senior-frontend-developer" />
            </div>

            <div className="space-y-2">
              <Label>Дата публикации</Label>
              <Input type="date" value={formData.postedDate} onChange={(e) => setFormData({ ...formData, postedDate: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Статус</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Черновик</SelectItem>
                  <SelectItem value="published">Опубликовано</SelectItem>
                  <SelectItem value="closed">Закрыто</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Отдел</Label>
              <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dev">Development</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="pm">Management</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Локация</Label>
              <Select value={formData.location} onValueChange={(v) => setFormData({ ...formData, location: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="astana">Astana</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Тип занятости</Label>
              <Select value={formData.employmentType} onValueChange={(v) => setFormData({ ...formData, employmentType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Видимость для пользователей</Label>
              <Select value={formData.isVisible ? 'visible' : 'hidden'} onValueChange={(v) => setFormData({ ...formData, isVisible: v === 'visible' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="visible">Видимая</SelectItem>
                  <SelectItem value="hidden">Скрытая</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Карточка требований</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Requirement RU" value={formData.requirementDrafts.ru} onChange={(e) => setFormData({ ...formData, requirementDrafts: { ...formData.requirementDrafts, ru: e.target.value } })} />
              <Input placeholder="Requirement KZ" value={formData.requirementDrafts.kz} onChange={(e) => setFormData({ ...formData, requirementDrafts: { ...formData.requirementDrafts, kz: e.target.value } })} />
              <Input placeholder="Requirement EN" value={formData.requirementDrafts.en} onChange={(e) => setFormData({ ...formData, requirementDrafts: { ...formData.requirementDrafts, en: e.target.value } })} />
            </div>
            <Button type="button" variant="outline" onClick={addRequirement}>Добавить requirement badge</Button>
            <div className="space-y-2">
              {formData.requirements.map((requirement, index) => (
                <div key={`${requirement.ru}-${index}`} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
                  <span>{requirement.ru} / {requirement.kz} / {requirement.en}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeRequirement(index)}>Удалить</Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Технологический стек</Label>
            <div className="flex gap-2">
              <Input value={formData.stackInput} onChange={(e) => setFormData({ ...formData, stackInput: e.target.value })} placeholder="React" onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addStackItem();
                }
              }} />
              <Button type="button" onClick={addStackItem}>Добавить</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.stack.map((tech, idx) => (
                <span key={`${tech}-${idx}`} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                  {tech}
                  <button type="button" className="ml-2 text-gray-500 hover:text-gray-700" onClick={() => removeStackItem(idx)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-4 block">Описание на разных языках</Label>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList>
                <TabsTrigger value="ru">Русский</TabsTrigger>
                <TabsTrigger value="kz">Қазақша</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
              <TabsContent value="ru" className="mt-6">{renderLanguageForm('ru')}</TabsContent>
              <TabsContent value="kz" className="mt-6">{renderLanguageForm('kz')}</TabsContent>
              <TabsContent value="en" className="mt-6">{renderLanguageForm('en')}</TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
