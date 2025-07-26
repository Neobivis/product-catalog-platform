import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Category } from '@/types/product';

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
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const buildCategoryPath = (cats: Category[], targetId: string, path: string[] = []): string[] | null => {
    for (const cat of cats) {
      const currentPath = [...path, cat.name];
      if (cat.id === targetId) {
        return currentPath;
      }
      if (cat.children) {
        const found = buildCategoryPath(cat.children, targetId, currentPath);
        if (found) return found;
      }
    }
    return null;
  };

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

  const handleCategorySelect = (category: Category, parentPath: string[] = []) => {
    const fullPath = [...parentPath, category.name].join('/');
    onChange(fullPath);
    setIsOpen(false);
  };

  const renderCategoryTree = (cats: Category[], level = 0, parentPath: string[] = []) => {
    return cats.map((category) => (
      <div key={category.id} className="relative">
        <div
          className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors
            ${hoveredCategory === category.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}
            ${level > 0 ? 'pl-6' : ''}
          `}
          onMouseEnter={() => setHoveredCategory(category.id)}
          onMouseLeave={() => setHoveredCategory(null)}
          onClick={() => handleCategorySelect(category, parentPath)}
        >
          <div className="flex items-center gap-3">
            {category.icon && (
              <Icon 
                name={category.icon} 
                size={18} 
                className={hoveredCategory === category.id ? 'text-blue-600' : 'text-gray-600'} 
              />
            )}
            <span className="text-sm font-medium">{category.name}</span>
          </div>
          {category.children && category.children.length > 0 && (
            <Icon 
              name="ChevronRight" 
              size={16} 
              className={hoveredCategory === category.id ? 'text-blue-600' : 'text-gray-400'} 
            />
          )}
        </div>
        
        {/* Subcategories */}
        {category.children && category.children.length > 0 && hoveredCategory === category.id && (
          <div className="absolute left-full top-0 bg-white border border-gray-200 shadow-lg rounded-md min-w-64 z-50 max-h-80 overflow-y-auto">
            <div className="py-2">
              <div className="px-4 py-2 bg-gray-50 border-b sticky top-0">
                <span className="text-sm font-semibold text-gray-700">{category.name}</span>
              </div>
              <div className="py-2">
                {renderCategoryTree(category.children, level + 1, [...parentPath, category.name])}
              </div>
            </div>
          </div>
        )}
      </div>
    ));
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    
    // If it's the exact path, return it
    if (value.includes('/')) {
      return value;
    }
    
    // Try to find the category and build its path
    const pathParts = value.split('/');
    const category = findCategoryByPath(categories, pathParts);
    
    return category ? value : placeholder;
  };

  const getSelectedCategoryIcon = () => {
    if (!value) return null;
    
    const pathParts = value.split('/');
    const category = findCategoryByPath(categories, pathParts);
    
    return category?.icon;
  };

  return (
    <div className="relative">
      {/* Selector Button */}
      <Button
        ref={buttonRef}
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between h-10 px-3 font-normal text-left"
      >
        <div className="flex items-center gap-2">
          {getSelectedCategoryIcon() && (
            <Icon name={getSelectedCategoryIcon()!} size={16} className="text-gray-600" />
          )}
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {getDisplayValue()}
          </span>
        </div>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-gray-400" 
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/10 z-40" />
          
          {/* Menu */}
          <div 
            ref={menuRef}
            className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-xl z-50 min-w-full max-h-80 overflow-y-auto"
          >
            {/* Clear selection option */}
            <div
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 border-b"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
            >
              <Icon name="X" size={18} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Очистить выбор</span>
            </div>

            {/* Categories List */}
            <div className="py-2">
              {categories.length > 0 ? (
                renderCategoryTree(categories)
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Icon name="Package" size={32} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Категории не найдены</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategorySelector;