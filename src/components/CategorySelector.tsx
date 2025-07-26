import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Category } from '@/types/product';
import CategoryModal from '@/components/CategoryModal';

interface CategorySelectorProps {
  categories: Category[];
  value: string;
  onChange: (categoryPath: string) => void;
  placeholder?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  value,
  onChange,
  placeholder = "Выберите категорию"
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const getDisplayValue = () => {
    if (!value) return placeholder;
    return value;
  };

  const getSelectedCategoryIcon = () => {
    if (!value) return null;
    
    const pathParts = value.split('/');
    const category = findCategoryByPath(categories, pathParts);
    
    return category?.icon;
  };

  const handleSelect = (categoryPath: string) => {
    onChange(categoryPath);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Selector Button */}
      <Button
        variant="outline"
        onClick={() => setIsModalOpen(true)}
        className="w-full justify-between h-10 px-3 font-normal text-left"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {getSelectedCategoryIcon() && (
            <Icon name={getSelectedCategoryIcon()!} size={16} className="text-gray-600 flex-shrink-0" />
          )}
          <span 
            className={`truncate ${value ? 'text-gray-900' : 'text-gray-500'}`}
            title={getDisplayValue()}
          >
            {getDisplayValue()}
          </span>
        </div>
        <Icon 
          name="ChevronDown"
          size={16} 
          className="text-gray-400 flex-shrink-0 ml-2" 
        />
      </Button>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        selectedValue={value}
        onSelect={handleSelect}
      />
    </>
  );
};

export default CategorySelector;