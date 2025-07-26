import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Category } from '@/types/product';
import CategoryModal from '@/components/CategoryModal';

interface MultipleCategorySelectorProps {
  categories: Category[];
  primaryCategory: string;
  additionalCategories: string[];
  onPrimaryCategoryChange: (categoryPath: string) => void;
  onAdditionalCategoriesChange: (categories: string[]) => void;
  translations: any;
}

const MultipleCategorySelector: React.FC<MultipleCategorySelectorProps> = ({
  categories,
  primaryCategory,
  additionalCategories,
  onPrimaryCategoryChange,
  onAdditionalCategoriesChange,
  translations
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'primary' | 'additional'>('primary');

  const findCategoryByPath = (cats: Category[], pathParts: string[]): Category | null => {
    if (pathParts.length === 0) return null;
    
    const cat = cats.find(c => c.name === pathParts[0]);
    if (!cat) return null;
    
    if (pathParts.length === 1) return cat;
    
    if (cat.children) {
      return findCategoryByPath(cat.children, pathParts.slice(1));
    }
    
    return null;
  };

  const getCategoryIcon = (categoryPath: string) => {
    if (!categoryPath) return null;
    const pathParts = categoryPath.split('/');
    const category = findCategoryByPath(categories, pathParts);
    return category?.icon;
  };

  const handlePrimarySelect = (categoryPath: string) => {
    onPrimaryCategoryChange(categoryPath);
    setIsModalOpen(false);
  };

  const handleAdditionalSelect = (categoryPath: string) => {
    if (!additionalCategories.includes(categoryPath) && categoryPath !== primaryCategory) {
      onAdditionalCategoriesChange([...additionalCategories, categoryPath]);
    }
    setIsModalOpen(false);
  };

  const removeAdditionalCategory = (categoryToRemove: string) => {
    onAdditionalCategoriesChange(
      additionalCategories.filter(cat => cat !== categoryToRemove)
    );
  };

  const openModal = (mode: 'primary' | 'additional') => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Основная категория */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {translations.primaryCategory || 'Основная категория'}
        </label>
        <Button
          variant="outline"
          onClick={() => openModal('primary')}
          className="w-full justify-between h-10 px-3 font-normal text-left"
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {getCategoryIcon(primaryCategory) && (
              <Icon name={getCategoryIcon(primaryCategory)!} size={16} className="text-gray-600 flex-shrink-0" />
            )}
            <span 
              className={`truncate ${primaryCategory ? 'text-gray-900' : 'text-gray-500'}`}
              title={primaryCategory || translations.selectCategory}
            >
              {primaryCategory || translations.selectCategory || 'Выберите категорию'}
            </span>
          </div>
          <Icon 
            name="ChevronDown"
            size={16} 
            className="text-gray-400 flex-shrink-0 ml-2" 
          />
        </Button>
      </div>

      {/* Дополнительные категории */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {translations.additionalCategories || 'Дополнительные категории'}
        </label>
        
        {/* Отображение выбранных дополнительных категорий */}
        {additionalCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {additionalCategories.map((category) => (
              <Badge 
                key={category} 
                variant="secondary" 
                className="flex items-center gap-1 px-2 py-1"
              >
                {getCategoryIcon(category) && (
                  <Icon name={getCategoryIcon(category)!} size={12} />
                )}
                <span className="text-xs">{category}</span>
                <button
                  onClick={() => removeAdditionalCategory(category)}
                  className="ml-1 hover:text-red-600"
                >
                  <Icon name="X" size={12} />
                </button>
              </Badge>
            ))}
          </div>
        )}
        
        {/* Кнопка добавления дополнительной категории */}
        <Button
          variant="outline"
          onClick={() => openModal('additional')}
          className="w-full justify-center h-10 px-3 font-normal border-dashed"
        >
          <Icon name="Plus" size={16} className="mr-2" />
          {translations.addAdditionalCategory || 'Добавить дополнительную категорию'}
        </Button>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        selectedValue={modalMode === 'primary' ? primaryCategory : ''}
        onSelect={modalMode === 'primary' ? handlePrimarySelect : handleAdditionalSelect}
      />
    </div>
  );
};

export default MultipleCategorySelector;