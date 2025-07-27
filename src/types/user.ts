export type UserRole = 'admin' | 'editor' | 'viewer' | 'chinese_only' | 'victor' | 'broker';

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
  fields?: string[]; // Ограничение по полям (для брокеров)
  sections?: string[]; // Ограничение по разделам сайта (для брокеров)
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
  ],
  victor: [
    { action: 'read', resource: 'all' },
    { action: 'write', resource: 'products' } // Ограниченное редактирование только определенных полей
  ],
  broker: [
    { action: 'read', resource: 'all' },
    { action: 'write', resource: 'products' } // Настраиваемые права через админку
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

// Проверка доступа к редактированию конкретного поля для пользователя Victor
export const canVictorEditField = (fieldName: string): boolean => {
  const allowedFields = ['price', 'brand', 'nameCn'];
  return allowedFields.includes(fieldName);
};

// Проверка может ли пользователь редактировать конкретное поле
export const canEditField = (user: User | null, fieldName: string): boolean => {
  if (!user || !user.isActive) return false;
  
  // Администратор может редактировать все поля
  if (user.permissions.some(p => p.action === 'admin' && p.resource === 'all')) {
    return true;
  }
  
  // Пользователь Victor может редактировать только определенные поля
  if (user.role === 'victor') {
    return canVictorEditField(fieldName);
  }
  
  // Пользователь Broker может редактировать только разрешенные поля
  if (user.role === 'broker') {
    const productPermission = user.permissions.find(p => p.resource === 'products' && p.action === 'write');
    if (productPermission && productPermission.fields) {
      return productPermission.fields.includes(fieldName);
    }
    return false;
  }
  
  // Остальные пользователи с правами на запись могут редактировать все поля
  return hasPermission(user, 'write', 'products');
};

// Проверка может ли пользователь видеть определенный раздел сайта
export const canViewSection = (user: User | null, sectionName: string): boolean => {
  if (!user || !user.isActive) return true; // Гости видят все разделы
  
  // Администратор видит все разделы
  if (user.permissions.some(p => p.action === 'admin' && p.resource === 'all')) {
    return true;
  }
  
  // Пользователь Broker может видеть только разрешенные разделы
  if (user.role === 'broker') {
    const permission = user.permissions.find(p => p.sections);
    if (permission && permission.sections) {
      return permission.sections.includes(sectionName);
    }
    return false;
  }
  
  // Остальные пользователи видят все разделы
  return true;
};

// Типы для настройки прав брокеров
export interface BrokerRightsConfig {
  userId: string;
  allowedSections: string[];
  allowedFields: string[];
}

// Доступные разделы сайта для настройки прав
export const availableSections = [
  'catalog',
  'categories',
  'price-requests',
  'reports',
  'statistics',
  'user-management'
];

// Доступные поля товара для настройки прав
export const availableProductFields = [
  'name',
  'nameEn', 
  'nameCn',
  'description',
  'descriptionEn',
  'descriptionCn',
  'price',
  'currency',
  'category',
  'additionalCategories',
  'brand',
  'model',
  'availability',
  'inStock',
  'images',
  'specifications',
  'weight',
  'dimensions'
];