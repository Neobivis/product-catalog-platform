export type UserRole = 'admin' | 'editor' | 'viewer' | 'chinese_only';

export interface User {
  id: string;
  username: string;
  email?: string;
  password?: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  permissions: Permission[];
  // Для пользователя chinese_only - специальная ссылка
  specialLink?: string;
}

export interface Permission {
  action: 'read' | 'write' | 'delete' | 'admin';
  resource: 'products' | 'categories' | 'users' | 'all';
  language?: 'ru' | 'en' | 'cn'; // Ограничение по языку
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
}

// Предустановленные роли с правами
export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    { action: 'admin', resource: 'all' }
  ],
  editor: [
    { action: 'read', resource: 'all' },
    { action: 'write', resource: 'products' },
    { action: 'write', resource: 'categories' }
  ],
  viewer: [
    { action: 'read', resource: 'all' }
  ],
  chinese_only: [
    { action: 'read', resource: 'all', language: 'cn' },
    { action: 'write', resource: 'products', language: 'cn' },
    { action: 'write', resource: 'categories', language: 'cn' }
  ]
};

// Функция проверки прав
export const hasPermission = (
  user: User | null, 
  action: Permission['action'], 
  resource: Permission['resource'],
  language?: Permission['language']
): boolean => {
  if (!user || !user.isActive) return false;
  
  // Администратор имеет все права
  if (user.permissions.some(p => p.action === 'admin' && p.resource === 'all')) {
    return true;
  }
  
  return user.permissions.some(permission => {
    const actionMatch = permission.action === action || permission.action === 'admin';
    const resourceMatch = permission.resource === resource || permission.resource === 'all';
    const languageMatch = !permission.language || !language || permission.language === language;
    
    return actionMatch && resourceMatch && languageMatch;
  });
};

// Проверка доступа гостей (только чтение)
export const isGuestAllowed = (action: Permission['action']): boolean => {
  return action === 'read';
};