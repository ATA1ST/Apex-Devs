import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Users, EyeOff } from 'lucide-react';
import { jobsStorage, Job } from '../../data/jobsData';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';

export function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'closed'>('all');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    const allJobs = jobsStorage.getAllJobs();
    setJobs(allJobs);
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const handleDelete = (id: string) => {
    if (confirm('Удалить вакансию?')) {
      jobsStorage.deleteJob(id);
      loadJobs();
    }
  };

  const handleStatusChange = (id: string, status: 'draft' | 'published' | 'closed') => {
    jobsStorage.updateJob(id, { status });
    loadJobs();
  };

  const handleToggleVisibility = (id: string, currentVisibility: boolean) => {
    jobsStorage.updateJob(id, { isVisible: !currentVisibility });
    loadJobs();
  };

  const getStatusColor = (status: string) => {
    if (status === 'published') return 'bg-green-100 text-green-700';
    if (status === 'draft') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Вакансии</h1>
          <p className="text-gray-600 mt-1">Управление вакансиями и просмотр метрик</p>
        </div>
        <Button
          className="bg-[#1973AE] hover:bg-[#155a8a] text-white"
          onClick={() => window.location.hash = 'admin/panel/jobs/new'}
        >
          <Plus className="mr-2 h-4 w-4" />
          Новая вакансия
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Всего вакансий</p>
          <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Опубликовано</p>
          <p className="text-2xl font-bold text-green-600">
            {jobs.filter(j => j.status === 'published').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Просмотры</p>
          <p className="text-2xl font-bold text-blue-600">
            {jobs.reduce((acc, j) => acc + j.views, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Отклики</p>
          <p className="text-2xl font-bold text-[#1973AE]">
            {jobs.reduce((acc, j) => acc + j.applicants, 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
          <TabsList>
            <TabsTrigger value="all">Все ({jobs.length})</TabsTrigger>
            <TabsTrigger value="published">
              Опубликовано ({jobs.filter(j => j.status === 'published').length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Черновики ({jobs.filter(j => j.status === 'draft').length})
            </TabsTrigger>
            <TabsTrigger value="closed">
              Закрыто ({jobs.filter(j => j.status === 'closed').length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Вакансия
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Отдел
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Обновлено
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Просмотры
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Отклики
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Конверсия
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    Нет вакансий
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{job.title.ru}</p>
                        <p className="text-sm text-gray-500">{job.location}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status === 'published' ? 'Опубликовано' : job.status === 'draft' ? 'Черновик' : 'Закрыто'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700 capitalize">{job.department}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{formatDate(job.updatedAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <Eye className="h-4 w-4 mr-1 text-gray-400" />
                        {job.views}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        {job.applicants}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {job.views > 0 ? `${((job.applicants / job.views) * 100).toFixed(1)}%` : '0%'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Visibility Toggle */}
                        <Button
                          size="sm"
                          variant="ghost"
                          title={job.isVisible ? 'Скрыть от пользователей' : 'Показать пользователям'}
                          onClick={() => handleToggleVisibility(job.id, job.isVisible)}
                          className={job.isVisible ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}
                        >
                          {job.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>

                        {job.status === 'draft' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(job.id, 'published')}
                          >
                            Опубликовать
                          </Button>
                        )}
                        {job.status === 'published' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(job.id, 'closed')}
                          >
                            Закрыть
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.location.hash = `admin/panel/jobs/${job.id}/edit`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(job.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}