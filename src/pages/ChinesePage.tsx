import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Index from './Index';
import { useUserManagement } from '@/hooks/useUserManagement';

const ChinesePage: React.FC = () => {
  const location = useLocation();
  const { validateChineseAccess, authState, login } = useUserManagement();
  const [isValidated, setIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateAccess = () => {
      // Получаем полный путь /cn/xxx
      const fullPath = location.pathname;
      
      // Проверяем доступ по специальной ссылке
      const user = validateChineseAccess(fullPath);
      
      if (user) {
        // Автоматически авторизуем пользователя
        login(user.username);
        setIsValidated(true);
      } else {
        setIsValidated(false);
      }
      
      setIsLoading(false);
    };

    validateAccess();
  }, [location.pathname, validateChineseAccess, login]);

  // Показываем загрузку
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">验证访问权限...</div>
      </div>
    );
  }

  // Если доступ не валиден - редирект на главную
  if (!isValidated) {
    return <Navigate to="/" replace />;
  }

  // Если доступ валиден - показываем Index с принудительным китайским языком
  return (
    <div className="chinese-only-mode">
      <Index forceLanguage="cn" />
    </div>
  );
};

export default ChinesePage;