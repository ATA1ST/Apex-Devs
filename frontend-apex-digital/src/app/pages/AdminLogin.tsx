import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Lock, AlertCircle, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  getLogin, 
  verifyPassword, 
  createSession, 
  checkRateLimit, 
  recordFailedAttempt, 
  clearRateLimit,
  isAuthenticated 
} from '../config/auth';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

export function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin/panel', { replace: true });
    }
  }, [navigate]);

  // Check rate limit on mount
  useEffect(() => {
    const rateLimit = checkRateLimit();
    if (!rateLimit.allowed) {
      setIsLocked(true);
      setLockTime(rateLimit.remainingTime || 0);
      setError(`Слишком много попыток входа. Попробуйте через ${rateLimit.remainingTime} секунд.`);
    }
  }, []);

  // Countdown timer
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

    // Check rate limit
    const rateLimit = checkRateLimit();
    if (!rateLimit.allowed) {
      setIsLocked(true);
      setLockTime(rateLimit.remainingTime || 0);
      setError(`Слишком много попыток входа. Попробуйте через ${rateLimit.remainingTime} секунд.`);
      return;
    }

    setIsLoading(true);

    try {
      // Validate login
      const expectedLogin = getLogin();
      if (formData.login !== expectedLogin) {
        recordFailedAttempt();
        setError('Неверный логин или пароль');
        setIsLoading(false);
        return;
      }

      // Verify password
      const isValid = await verifyPassword(formData.password);
      
      if (!isValid) {
        recordFailedAttempt();
        setError('Неверный логин или пароль');
        setIsLoading(false);
        return;
      }

      // Success - clear rate limit and create session
      clearRateLimit();
      createSession(formData.login);
      navigate('/admin/panel', { replace: true });
    } catch (err) {
      setError('Ошибка при входе. Попробуйте снова.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1973AE] via-[#39D2ED] to-[#1973AE] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Административная панель</h1>
          <p className="text-white/80">Вход для владельцев Apex Digital</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Field */}
            <div className="space-y-2">
              <Label htmlFor="login">Логин</Label>
              <Input
                id="login"
                type="text"
                placeholder="Введите логин"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                disabled={isLoading || isLocked}
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading || isLocked}
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#1973AE] hover:bg-[#155a8a]"
              disabled={isLoading || isLocked}
            >
              {isLoading ? 'Проверка...' : isLocked ? `Заблокировано (${lockTime}s)` : 'Войти'}
            </Button>
          </form>

          {/* Help Section */}
          <div className="mt-6 pt-6 border-t">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full text-sm text-gray-600 hover:text-[#1973AE]">
                  <Info className="w-4 h-4 mr-2" />
                  Нужен доступ?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Учетные данные администратора</DialogTitle>
                  <DialogDescription className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Временные учетные данные для доступа к админ-панели:
                    </p>
                    <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Логин:</p>
                        <p className="text-sm font-mono font-semibold text-gray-900 bg-white px-3 py-2 rounded border">
                          apex_admin
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Пароль:</p>
                        <p className="text-sm font-mono font-semibold text-gray-900 bg-white px-3 py-2 rounded border">
                          ApexDigital2026!
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 italic">
                      Примечание: Это временные данные для демонстрации. В production используйте безопасные учетные данные.
                    </p>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Back Link */}
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