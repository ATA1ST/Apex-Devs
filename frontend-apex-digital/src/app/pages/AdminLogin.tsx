import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  loginAdmin,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  isAuthenticated,
} from '../config/auth';
import { Alert, AlertDescription } from '../components/ui/alert';

export function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin/panel', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const rateLimit = checkRateLimit();
    if (!rateLimit.allowed) {
      setIsLocked(true);
      setLockTime(rateLimit.remainingTime || 0);
      setError(`Слишком много попыток входа. Попробуйте через ${rateLimit.remainingTime} секунд.`);
    }
  }, []);

  useEffect(() => {
    if (isLocked && lockTime > 0) {
      const timer = setInterval(() => {
        setLockTime((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setError('');
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lockTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const rateLimit = checkRateLimit();
    if (!rateLimit.allowed) {
      setIsLocked(true);
      setLockTime(rateLimit.remainingTime || 0);
      setError(`Слишком много попыток входа. Попробуйте через ${rateLimit.remainingTime} секунд.`);
      return;
    }

    setIsLoading(true);

    try {
      await loginAdmin(formData.login, formData.password);
      clearRateLimit();
      navigate('/admin/panel', { replace: true });
    } catch (err) {
      recordFailedAttempt();
      setError(err instanceof Error ? err.message : 'Ошибка при входе. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1973AE] via-[#39D2ED] to-[#1973AE] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Административная панель</h1>
          <p className="text-white/80">Вход только для авторизованных сотрудников Apex Digital</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="login">Логин</Label>
              <Input
                id="login"
                type="text"
                placeholder="Введите логин"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                disabled={isLoading || isLocked}
                autoComplete="username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading || isLocked}
                autoComplete="current-password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1973AE] hover:bg-[#155a8a]"
              disabled={isLoading || isLocked}
            >
              {isLoading ? 'Проверка...' : isLocked ? `Заблокировано (${lockTime}s)` : 'Войти'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#1973AE] mt-0.5" />
              <div>
                <p className="font-medium text-slate-800">Security-first access</p>
                <p className="mt-1">Учётные данные не публикуются в интерфейсе. Для доступа используйте выданные администратором секреты.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            className="text-white hover:text-white/80"
            onClick={() => navigate('/')}
          >
            ← Вернуться на главную
          </Button>
        </div>
      </div>
    </div>
  );
}
