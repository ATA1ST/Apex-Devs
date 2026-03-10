import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { ArrowLeft, Save } from 'lucide-react';
import { jobsStorage, Job } from '../../data/jobsData';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { toast } from 'sonner';

export function AdminJobFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id && id !== 'new';
  const [activeTab, setActiveTab] = useState<'ru' | 'kz' | 'en'>('ru');
  const [formData, setFormData] = useState({
    slug: '',
    title: { ru: '', kz: '', en: '' },
    shortDescription: { ru: '', kz: '', en: '' },
    requirements: [] as Array<{ ru: string; kz: string; en: string }>,
    postedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    department: 'dev' as 'dev' | 'design' | 'pm' | 'other',
    location: 'hybrid' as 'astana' | 'remote' | 'hybrid',
    employmentType: 'full-time' as 'full-time' | 'part-time' | 'contract',
    status: 'draft' as 'draft' | 'published' | 'closed',
    isVisible: true,
    description: {
      ru: {
        role: '',
        tasks: [''],
        requirements: [''],
        plusPoints: [''],
        conditions: [''],
      },
      kz: {
        role: '',
        tasks: [''],
        requirements: [''],
        plusPoints: [''],
        conditions: [''],
      },
      en: {
        role: '',
        tasks: [''],
        requirements: [''],
        plusPoints: [''],
        conditions: [''],
      },
    },
    stack: [] as string[],
    stackInput: '',
  });

  useEffect(() => {
    if (isEdit && id) {
      const job = jobsStorage.getJobById(id);
      if (job) {
        setFormData({
          slug: job.slug,
          title: job.title,
          shortDescription: job.shortDescription,
          requirements: job.requirements,
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
    }
  }, [id, isEdit]);

  const handleSave = () => {
    // Validate
    if (!formData.title.ru || !formData.title.kz || !formData.title.en) {
      toast.error('Заполните название на всех языках');
      return;
    }
    if (!formData.slug) {
      toast.error('Заполните slug');
      return;
    }

    const jobData = {
      slug: formData.slug,
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
      stack: formData.stack.length > 0 ? formData.stack : undefined,
      publishedAt: formData.status === 'published' ? new Date().toISOString() : undefined,
    };

    if (isEdit && id) {
      jobsStorage.updateJob(id, jobData as Partial<Job>);
      toast.success('Вакансия обновлена');
    } else {
      jobsStorage.createJob(jobData as any);
      toast.success('Вакансия создана');
    }

    window.location.hash = 'admin/panel/jobs';
  };

  const updateDescriptionField = (lang: 'ru' | 'kz' | 'en', field: string, value: any) => {
    setFormData({
      ...formData,
      description: {
        ...formData.description,
        [lang]: {
          ...formData.description[lang],
          [field]: value,
        },
      },
    });
  };

  const addArrayItem = (lang: 'ru' | 'kz' | 'en', field: 'tasks' | 'requirements' | 'plusPoints' | 'conditions') => {
    const current = formData.description[lang][field];
    updateDescriptionField(lang, field, [...current, '']);
  };

  const removeArrayItem = (lang: 'ru' | 'kz' | 'en', field: 'tasks' | 'requirements' | 'plusPoints' | 'conditions', index: number) => {
    const current = formData.description[lang][field];
    updateDescriptionField(lang, field, current.filter((_, i) => i !== index));
  };

  const updateArrayItem = (lang: 'ru' | 'kz' | 'en', field: 'tasks' | 'requirements' | 'plusPoints' | 'conditions', index: number, value: string) => {
    const current = formData.description[lang][field];
    const updated = [...current];
    updated[index] = value;
    updateDescriptionField(lang, field, updated);
  };

  const addStackItem = () => {
    if (formData.stackInput.trim()) {
      setFormData({
        ...formData,
        stack: [...formData.stack, formData.stackInput.trim()],
        stackInput: '',
      });
    }
  };

  const removeStackItem = (index: number) => {
    setFormData({
      ...formData,
      stack: formData.stack.filter((_, i) => i !== index),
    });
  };

  const renderLanguageForm = (lang: 'ru' | 'kz' | 'en') => {
    const desc = formData.description[lang];
    const langLabel = lang === 'ru' ? 'Русский' : lang === 'kz' ? 'Қазақша' : 'English';

    return (
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label>Название ({langLabel})*</Label>
          <Input
            value={formData.title[lang]}
            onChange={(e) => setFormData({ ...formData, title: { ...formData.title, [lang]: e.target.value } })}
            placeholder="Senior Frontend Developer"
          />
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label>О роли (3-5 строк)</Label>
          <Textarea
            rows={4}
            value={desc.role}
            onChange={(e) => updateDescriptionField(lang, 'role', e.target.value)}
          />
        </div>

        {/* Tasks */}
        <div className="space-y-2">
          <Label>Задачи</Label>
          {desc.tasks.map((task, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={task}
                onChange={(e) => updateArrayItem(lang, 'tasks', idx, e.target.value)}
                placeholder={`Задача ${idx + 1}`}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeArrayItem(lang, 'tasks', idx)}
              >
                ✕
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(lang, 'tasks')}>
            + Добавить задачу
          </Button>
        </div>

        {/* Requirements */}
        <div className="space-y-2">
          <Label>Требования</Label>
          {desc.requirements.map((req, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={req}
                onChange={(e) => updateArrayItem(lang, 'requirements', idx, e.target.value)}
                placeholder={`Требование ${idx + 1}`}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeArrayItem(lang, 'requirements', idx)}
              >
                ✕
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(lang, 'requirements')}>
            + Добавить требование
          </Button>
        </div>

        {/* Plus Points */}
        <div className="space-y-2">
          <Label>Будет плюсом</Label>
          {desc.plusPoints.map((point, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={point}
                onChange={(e) => updateArrayItem(lang, 'plusPoints', idx, e.target.value)}
                placeholder={`Плюс ${idx + 1}`}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeArrayItem(lang, 'plusPoints', idx)}
              >
                ✕
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(lang, 'plusPoints')}>
            + Добавить плюс
          </Button>
        </div>

        {/* Conditions */}
        <div className="space-y-2">
          <Label>Условия</Label>
          {desc.conditions.map((cond, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={cond}
                onChange={(e) => updateArrayItem(lang, 'conditions', idx, e.target.value)}
                placeholder={`Условие ${idx + 1}`}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeArrayItem(lang, 'conditions', idx)}
              >
                ✕
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(lang, 'conditions')}>
            + Добавить условие
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => window.location.hash = 'admin/panel/jobs'}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Редактировать вакансию' : 'Новая вакансия'}
            </h1>
          </div>
        </div>
        <Button
          className="bg-[#1973AE] hover:bg-[#155a8a] text-white"
          onClick={handleSave}
        >
          <Save className="mr-2 h-4 w-4" />
          Сохранить
        </Button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Slug*</Label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="senior-frontend-developer"
            />
          </div>

          <div className="space-y-2">
            <Label>Статус</Label>
            <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Черновик</SelectItem>
                <SelectItem value="published">Опубликовано</SelectItem>
                <SelectItem value="closed">Закрыто</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Отдел</Label>
            <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
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
            <Select value={formData.location} onValueChange={(v) => setFormData({ ...formData, location: v as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="astana">Astana</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Тип занятости</Label>
            <Select value={formData.employmentType} onValueChange={(v) => setFormData({ ...formData, employmentType: v as any })}>
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
            <Label>Видимость для пользователей</Label>
            <Select value={formData.isVisible ? 'visible' : 'hidden'} onValueChange={(v) => setFormData({ ...formData, isVisible: v === 'visible' })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visible">Видимая</SelectItem>
                <SelectItem value="hidden">Скрытая</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stack */}
        <div className="space-y-2">
          <Label>Технологический стек</Label>
          <div className="flex gap-2">
            <Input
              value={formData.stackInput}
              onChange={(e) => setFormData({ ...formData, stackInput: e.target.value })}
              placeholder="React"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStackItem())}
            />
            <Button type="button" onClick={addStackItem}>
              Добавить
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.stack.map((tech, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
              >
                {tech}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() => removeStackItem(idx)}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Language Tabs */}
        <div>
          <Label className="mb-4 block">Описание на разных языках</Label>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList>
              <TabsTrigger value="ru">Русский</TabsTrigger>
              <TabsTrigger value="kz">Қазақша</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            <TabsContent value="ru" className="mt-6">
              {renderLanguageForm('ru')}
            </TabsContent>
            <TabsContent value="kz" className="mt-6">
              {renderLanguageForm('kz')}
            </TabsContent>
            <TabsContent value="en" className="mt-6">
              {renderLanguageForm('en')}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}