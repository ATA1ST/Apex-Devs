import { useEffect, useState } from 'react';
import { Download, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { authFetch, downloadProtectedFile } from '../../config/auth';
import { getApiErrorMessage, type ApiErrorPayload } from '../../config/api';
import type { JobApplicationDto, PaginatedResult } from '../../types/api';
import { toast } from 'sonner';

export function AdminApplicantsPage() {
  const [applicants, setApplicants] = useState<JobApplicationDto[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'reviewed' | 'rejected' | 'invited'>('all');
  const [selectedApplicant, setSelectedApplicant] = useState<JobApplicationDto | null>(null);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void loadApplicants();
  }, []);

  const loadApplicants = async () => {
    try {
      setIsLoading(true);
      const response = await authFetch('/api/admin/applicants?page=1&pageSize=200');
      const result = (await response.json().catch(() => null)) as PaginatedResult<JobApplicationDto> | ApiErrorPayload | null;

      if (!response.ok) {
        throw new Error(getApiErrorMessage(result as ApiErrorPayload | null, 'Не удалось загрузить отклики'));
      }

      setApplicants(Array.isArray((result as PaginatedResult<JobApplicationDto>).items) ? (result as PaginatedResult<JobApplicationDto>).items : []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось загрузить отклики');
      setApplicants([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApplicants = applicants.filter((app) => statusFilter === 'all' || app.status === statusFilter);

  const handleStatusChange = async (id: string, status: JobApplicationDto['status']) => {
    try {
      const response = await authFetch(`/api/admin/applicants/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note: selectedApplicant?.id === id ? note : null }),
      });
      const result = (await response.json().catch(() => null)) as ApiErrorPayload | null;

      if (!response.ok) {
        throw new Error(getApiErrorMessage(result, 'Не удалось обновить статус'));
      }

      setApplicants((current) => current.map((applicant) => applicant.id === id ? { ...applicant, status, note: selectedApplicant?.id === id ? note : applicant.note } : applicant));
      if (selectedApplicant?.id === id) {
        setSelectedApplicant({ ...selectedApplicant, status, note });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось обновить статус');
    }
  };

  const handleSaveNote = async () => {
    if (!selectedApplicant) {
      return;
    }

    await handleStatusChange(selectedApplicant.id, selectedApplicant.status);
    toast.success('Заметка сохранена');
  };

  const getStatusColor = (status: string) => {
    if (status === 'new') return 'bg-blue-100 text-blue-700';
    if (status === 'reviewed') return 'bg-yellow-100 text-yellow-700';
    if (status === 'rejected') return 'bg-red-100 text-red-700';
    if (status === 'invited') return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'new') return 'Новый';
    if (status === 'reviewed') return 'Рассмотрен';
    if (status === 'rejected') return 'Отклонен';
    if (status === 'invited') return 'Приглашён';
    return status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Отклики</h1>
        <p className="text-gray-600 mt-1">Управление откликами на вакансии</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Всего откликов</p>
          <p className="text-2xl font-bold text-gray-900">{applicants.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Новые</p>
          <p className="text-2xl font-bold text-blue-600">{applicants.filter((a) => a.status === 'new').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Рассмотрены</p>
          <p className="text-2xl font-bold text-yellow-600">{applicants.filter((a) => a.status === 'reviewed').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Приглашены</p>
          <p className="text-2xl font-bold text-green-600">{applicants.filter((a) => a.status === 'invited').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Отклонены</p>
          <p className="text-2xl font-bold text-red-600">{applicants.filter((a) => a.status === 'rejected').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Label>Статус:</Label>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="new">Новые</SelectItem>
              <SelectItem value="reviewed">Рассмотрены</SelectItem>
              <SelectItem value="invited">Приглашены</SelectItem>
              <SelectItem value="rejected">Отклонены</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Кандидат</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Вакансия</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Дата</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Загрузка откликов...</td>
                </tr>
              ) : filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Нет откликов</td>
                </tr>
              ) : (
                filteredApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{applicant.name}</p>
                        <p className="text-sm text-gray-500">{applicant.email || '—'}</p>
                        {applicant.phone && <p className="text-sm text-gray-500">{applicant.phone}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4"><p className="text-sm text-gray-700">{applicant.jobTitle}</p></td>
                    <td className="px-6 py-4"><span className="text-sm text-gray-700">{formatDate(applicant.appliedAt)}</span></td>
                    <td className="px-6 py-4"><Badge className={getStatusColor(applicant.status)}>{getStatusLabel(applicant.status)}</Badge></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedApplicant(applicant);
                          setNote(applicant.note || '');
                        }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {applicant.resumeFile && (
                          <Button size="sm" variant="outline" onClick={() => void downloadProtectedFile(applicant.resumeFile!.url, applicant.resumeFile!.name)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedApplicant} onOpenChange={(open) => {
        if (!open) {
          setSelectedApplicant(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Детали отклика</DialogTitle>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Имя</Label>
                  <p className="font-semibold">{selectedApplicant.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Email</Label>
                  <p className="font-semibold">{selectedApplicant.email || '—'}</p>
                </div>
                {selectedApplicant.phone && (
                  <div>
                    <Label className="text-sm text-gray-500">Телефон</Label>
                    <p className="font-semibold">{selectedApplicant.phone}</p>
                  </div>
                )}
                {selectedApplicant.links && (
                  <div>
                    <Label className="text-sm text-gray-500">Ссылки</Label>
                    <a href={selectedApplicant.links} target="_blank" rel="noopener noreferrer" className="text-[#1973AE] hover:underline">{selectedApplicant.links}</a>
                  </div>
                )}
                <div>
                  <Label className="text-sm text-gray-500">Вакансия</Label>
                  <p className="font-semibold">{selectedApplicant.jobTitle}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Дата отклика</Label>
                  <p className="font-semibold">{formatDate(selectedApplicant.appliedAt)}</p>
                </div>
              </div>

              {selectedApplicant.message && (
                <div>
                  <Label className="text-sm text-gray-500">Сообщение</Label>
                  <p className="mt-1 text-gray-700">{selectedApplicant.message}</p>
                </div>
              )}

              {selectedApplicant.resumeFile && (
                <div>
                  <Label className="text-sm text-gray-500">Резюме</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-gray-700">{selectedApplicant.resumeFile.name}</span>
                    <Button size="sm" variant="outline" onClick={() => void downloadProtectedFile(selectedApplicant.resumeFile!.url, selectedApplicant.resumeFile!.name)}>
                      <Download className="h-4 w-4 mr-1" />
                      Скачать
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm text-gray-500 mb-2 block">Изменить статус</Label>
                <div className="flex gap-2">
                  <Button size="sm" variant={selectedApplicant.status === 'reviewed' ? 'default' : 'outline'} onClick={() => void handleStatusChange(selectedApplicant.id, 'reviewed')}>
                    Рассмотрен
                  </Button>
                  <Button size="sm" variant={selectedApplicant.status === 'invited' ? 'default' : 'outline'} className={selectedApplicant.status === 'invited' ? 'bg-green-600 hover:bg-green-700' : ''} onClick={() => void handleStatusChange(selectedApplicant.id, 'invited')}>
                    Приглашён
                  </Button>
                  <Button size="sm" variant={selectedApplicant.status === 'rejected' ? 'default' : 'outline'} className={selectedApplicant.status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''} onClick={() => void handleStatusChange(selectedApplicant.id, 'rejected')}>
                    Отклонен
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="note">Внутренняя заметка</Label>
                <Textarea id="note" rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Добавьте заметку..." className="mt-2" />
                <Button size="sm" className="mt-2" onClick={() => void handleSaveNote()}>Сохранить заметку</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
