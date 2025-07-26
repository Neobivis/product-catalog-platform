import { useState, useEffect } from 'react';
import { User, UserRole, rolePermissions, AuthState } from '@/types/user';

const USERS_STORAGE_KEY = 'catalog_users';
const AUTH_STORAGE_KEY = 'catalog_auth';

// Создание пользователей по умолчанию
const createDefaultUsers = (): User[] => {
  const now = new Date().toISOString();
  
  return [
    {
      id: '1',
      username: 'Администратор',
      email: 'neobivis@gmail.com',
      password: 'Neo321678',
      role: 'admin',
      createdAt: now,
      isActive: true,
      permissions: rolePermissions.admin
    },
    {
      id: '2', 
      username: 'Victor',
      email: 'victor@company.com',
      role: 'victor',
      createdAt: now,
      isActive: true,
      permissions: rolePermissions.victor
    }
  ];
};

// Загрузка пользователей из localStorage
const loadUsersFromStorage = (): User[] => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading users from storage:', error);
  }
  return createDefaultUsers();
};

// Сохранение пользователей в localStorage
const saveUsersToStorage = (users: User[]): void => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to storage:', error);
  }
};

// Загрузка состояния авторизации
const loadAuthFromStorage = (): AuthState => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading auth from storage:', error);
  }
  return {
    currentUser: null,
    isAuthenticated: false,
    isGuest: true
  };
};

// Сохранение состояния авторизации
const saveAuthToStorage = (auth: AuthState): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  } catch (error) {
    console.error('Error saving auth to storage:', error);
  }
};

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>(() => loadUsersFromStorage());
  const [authState, setAuthState] = useState<AuthState>(() => loadAuthFromStorage());

  // Функция для сброса данных пользователей (для отладки)
  const resetUsers = () => {
    const defaultUsers = createDefaultUsers();
    setUsers(defaultUsers);
    localStorage.removeItem(USERS_STORAGE_KEY);
  };

  // Сохранение при изменениях
  useEffect(() => {
    saveUsersToStorage(users);
  }, [users]);

  useEffect(() => {
    saveAuthToStorage(authState);
  }, [authState]);

  // Создание нового пользователя
  const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'permissions'>): User => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      permissions: rolePermissions[userData.role],
      specialLink: userData.role === 'chinese_only' 
        ? `/cn/${Math.random().toString(36).substring(2, 15)}`
        : undefined
    };
    
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  // Обновление пользователя
  const updateUser = (userId: string, updates: Partial<User>): void => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const updatedUser = { ...user, ...updates };
        // Обновляем права при смене роли
        if (updates.role && updates.role !== user.role) {
          updatedUser.permissions = rolePermissions[updates.role];
          // Создаем специальную ссылку для chinese_only
          if (updates.role === 'chinese_only') {
            updatedUser.specialLink = `/cn/${Math.random().toString(36).substring(2, 15)}`;
          } else {
            updatedUser.specialLink = undefined;
          }
        }
        return updatedUser;
      }
      return user;
    }));
  };

  // Удаление пользователя
  const deleteUser = (userId: string): void => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    // Если удаляем текущего пользователя - выходим
    if (authState.currentUser?.id === userId) {
      logout();
    }
  };

  // Авторизация пользователя по логину и паролю
  const login = (email: string, password?: string): boolean => {
    const user = users.find(u => {
      if (password) {
        // Вход по email и паролю
        return u.email === email && u.password === password && u.isActive;
      } else {
        // Вход по username (для старого API)
        return u.username === email && u.isActive;
      }
    });
    
    if (user) {
      const newAuthState: AuthState = {
        currentUser: { ...user, lastLogin: new Date().toISOString() },
        isAuthenticated: true,
        isGuest: false
      };
      setAuthState(newAuthState);
      
      // Обновляем время последнего входа
      updateUser(user.id, { lastLogin: new Date().toISOString() });
      
      // Перезагружаем страницу после входа
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
      return true;
    }
    return false;
  };

  // Выход из системы
  const logout = (): void => {
    setAuthState({
      currentUser: null,
      isAuthenticated: false,
      isGuest: true
    });
  };

  // Автологин администратора (для удобства разработки)
  const loginAsAdmin = (): void => {
    const admin = users.find(u => u.role === 'admin');
    if (admin) {
      login(admin.username);
    }
  };

  // Вход пользователя по ID (для специальных ссылок)
  const loginUserById = (userId: string): boolean => {
    const user = users.find(u => u.id === userId && u.isActive);
    
    if (user) {
      const newAuthState: AuthState = {
        currentUser: { ...user, lastLogin: new Date().toISOString() },
        isAuthenticated: true,
        isGuest: false
      };
      setAuthState(newAuthState);
      
      // Обновляем время последнего входа
      updateUser(user.id, { lastLogin: new Date().toISOString() });
      
      return true;
    }
    return false;
  };

  // Вход как гость
  const continueAsGuest = (): void => {
    setAuthState({
      currentUser: null,
      isAuthenticated: false,
      isGuest: true
    });
  };

  // Проверка доступа к специальной китайской ссылке
  const validateChineseAccess = (link: string): User | null => {
    return users.find(u => u.role === 'chinese_only' && u.specialLink === link && u.isActive) || null;
  };

  return {
    users,
    authState,
    createUser,
    updateUser,
    deleteUser,
    login,
    logout,
    loginAsAdmin,
    loginUserById,
    continueAsGuest,
    validateChineseAccess,
    resetUsers
  };
};