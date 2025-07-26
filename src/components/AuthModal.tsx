import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useUserManagement } from '@/hooks/useUserManagement';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ru' | 'en' | 'cn';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, language }) => {
  const { login, loginAsAdmin, continueAsGuest, users } = useUserManagement();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const t = {
    ru: {
      title: 'Вход в систему',
      username: 'Имя пользователя',
      login: 'Войти',
      continueAsGuest: 'Продолжить как гость',
      quickLogin: 'Быстрый вход',
      error: 'Пользователь не найден или неактивен',
      adminAccess: 'Администратор',
      userNotFound: 'Пользователь не найден'
    },
    en: {
      title: 'Login',
      username: 'Username',
      login: 'Login',
      continueAsGuest: 'Continue as Guest',
      quickLogin: 'Quick Login',
      error: 'User not found or inactive',
      adminAccess: 'Administrator',
      userNotFound: 'User not found'
    },
    cn: {
      title: '登录',
      username: '用户名',
      login: '登录',
      continueAsGuest: '以访客身份继续',
      quickLogin: '快速登录',
      error: '用户未找到或已禁用',
      adminAccess: '管理员',
      userNotFound: '用户未找到'
    }
  };

  const currentT = t[language];

  const handleLogin = () => {
    if (username.trim()) {
      const success = login(username.trim());
      if (success) {
        setError('');
        onClose();
      } else {
        setError(currentT.error);
      }
    }
  };

  const handleQuickLogin = (userToLogin: string) => {
    const success = login(userToLogin);
    if (success) {
      setError('');
      onClose();
    }
  };

  const handleGuestContinue = () => {
    continueAsGuest();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {currentT.title}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" size={16} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Основная форма входа */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{currentT.username}</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={currentT.username}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <Button onClick={handleLogin} className="w-full">
              {currentT.login}
            </Button>
          </div>

          {/* Быстрый вход */}
          <div>
            <div className="text-sm font-medium mb-2">{currentT.quickLogin}:</div>
            <div className="space-y-2">
              {users.filter(u => u.isActive).map(user => (
                <Button
                  key={user.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin(user.username)}
                  className="w-full justify-start"
                >
                  <Icon 
                    name={user.role === 'admin' ? 'Crown' : user.role === 'chinese_only' ? 'Globe' : 'User'} 
                    size={14} 
                    className="mr-2" 
                  />
                  {user.username}
                  {user.role === 'admin' && ` (${currentT.adminAccess})`}
                </Button>
              ))}
            </div>
          </div>

          {/* Продолжить как гость */}
          <div className="pt-4 border-t">
            <Button 
              variant="ghost" 
              onClick={handleGuestContinue}
              className="w-full"
            >
              <Icon name="Users" size={16} className="mr-2" />
              {currentT.continueAsGuest}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthModal;