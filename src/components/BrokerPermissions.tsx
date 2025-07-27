import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { User, availableSections, availableProductFields, BrokerRightsConfig } from '@/types/user';
import { useUserManagement } from '@/hooks/useUserManagement';
import Icon from '@/components/ui/icon';

interface BrokerPermissionsProps {
  onClose: () => void;
}

const BrokerPermissions: React.FC<BrokerPermissionsProps> = ({ onClose }) => {
  const { users, updateUser } = useUserManagement();
  const [selectedBroker, setSelectedBroker] = useState<User | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  // Получаем всех брокеров
  const brokers = users.filter(user => user.role === 'broker');

  // Загружаем настройки выбранного брокера
  useEffect(() => {
    if (selectedBroker) {
      const productPermission = selectedBroker.permissions.find(p => p.resource === 'products');
      setSelectedSections(productPermission?.sections || []);
      setSelectedFields(productPermission?.fields || []);
    }
  }, [selectedBroker]);

  // Сохранение настроек
  const handleSave = () => {
    if (!selectedBroker) return;

    const updatedPermissions = selectedBroker.permissions.map(permission => {
      if (permission.resource === 'products') {
        return {
          ...permission,
          sections: selectedSections,
          fields: selectedFields
        };
      }
      return permission;
    });

    updateUser(selectedBroker.id, { permissions: updatedPermissions });
    onClose();
  };

  // Переключение раздела
  const toggleSection = (section: string) => {
    setSelectedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Переключение поля
  const toggleField = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  // Выбрать все разделы
  const selectAllSections = () => {
    setSelectedSections([...availableSections]);
  };

  // Сбросить все разделы
  const clearAllSections = () => {
    setSelectedSections([]);
  };

  // Выбрать все поля
  const selectAllFields = () => {
    setSelectedFields([...availableProductFields]);
  };

  // Сбросить все поля
  const clearAllFields = () => {
    setSelectedFields([]);
  };

  const sectionNames: Record<string, string> = {
    'catalog': 'Каталог товаров',
    'categories': 'Категории',
    'price-requests': 'Запросы цены',
    'reports': 'Отчеты',
    'statistics': 'Статистика',
    'user-management': 'Управление пользователями'
  };

  const fieldNames: Record<string, string> = {
    'name': 'Название (RU)',
    'nameEn': 'Название (EN)',
    'nameCn': 'Название (CN)',
    'description': 'Описание (RU)',
    'descriptionEn': 'Описание (EN)',
    'descriptionCn': 'Описание (CN)',
    'price': 'Цена',
    'currency': 'Валюта',
    'category': 'Основная категория',
    'additionalCategories': 'Дополнительные категории',
    'brand': 'Бренд',
    'model': 'Модель',
    'availability': 'Наличие',
    'inStock': 'В наличии',
    'images': 'Изображения',
    'specifications': 'Характеристики',
    'weight': 'Вес',
    'dimensions': 'Размеры'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Настройка прав для брокеров</h2>
          <Button onClick={onClose} variant="ghost" size="sm">
            <Icon name="X" size={24} />
          </Button>
        </div>

        {brokers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Брокеры не найдены. Создайте пользователей с ролью "Брокер" для настройки их прав.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Выбор брокера */}
            <Card>
              <CardHeader>
                <CardTitle>Выберите брокера</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {brokers.map(broker => (
                    <Button
                      key={broker.id}
                      variant={selectedBroker?.id === broker.id ? "default" : "outline"}
                      onClick={() => setSelectedBroker(broker)}
                      className="p-4 h-auto text-left"
                    >
                      <div>
                        <div className="font-medium">{broker.username}</div>
                        <div className="text-sm text-gray-500">{broker.email}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedBroker && (
              <>
                {/* Настройка разделов */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Доступные разделы сайта
                      <div className="space-x-2">
                        <Button onClick={selectAllSections} variant="outline" size="sm">
                          Выбрать все
                        </Button>
                        <Button onClick={clearAllSections} variant="outline" size="sm">
                          Сбросить
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableSections.map(section => (
                        <div key={section} className="flex items-center space-x-2">
                          <Checkbox
                            id={`section-${section}`}
                            checked={selectedSections.includes(section)}
                            onCheckedChange={() => toggleSection(section)}
                          />
                          <Label htmlFor={`section-${section}`} className="flex-1">
                            {sectionNames[section] || section}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Настройка полей товара */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Доступные поля товара для редактирования
                      <div className="space-x-2">
                        <Button onClick={selectAllFields} variant="outline" size="sm">
                          Выбрать все
                        </Button>
                        <Button onClick={clearAllFields} variant="outline" size="sm">
                          Сбросить
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableProductFields.map(field => (
                        <div key={field} className="flex items-center space-x-2">
                          <Checkbox
                            id={`field-${field}`}
                            checked={selectedFields.includes(field)}
                            onCheckedChange={() => toggleField(field)}
                          />
                          <Label htmlFor={`field-${field}`} className="flex-1">
                            {fieldNames[field] || field}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Кнопки действий */}
                <div className="flex justify-end space-x-4">
                  <Button onClick={onClose} variant="outline">
                    Отмена
                  </Button>
                  <Button onClick={handleSave}>
                    <Icon name="Save" size={16} className="mr-2" />
                    Сохранить настройки
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrokerPermissions;