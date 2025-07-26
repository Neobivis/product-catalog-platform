import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Category } from '@/types/product';

interface CatalogMenuProps {
  categories: Category[];
  translations: any;
}

const CatalogMenu: React.FC<CatalogMenuProps> = ({ categories, translations: t }) => {
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

  const renderCategoryTree = (cats: Category[], level = 0) => {
    return cats.map((category) => (
      <div key={category.name} className="relative">
        <div
          className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors
            ${hoveredCategory === category.name ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-50'}
            ${level > 0 ? 'pl-6' : ''}
          `}
          onMouseEnter={() => setHoveredCategory(category.name)}
          onMouseLeave={() => setHoveredCategory(null)}
          onClick={() => {
            // Handle category selection
            console.log('Selected category:', category.name);
            setIsOpen(false);
          }}
        >
          <div className="flex items-center gap-3">
            {category.icon && (
              <Icon 
                name={category.icon} 
                size={18} 
                className={hoveredCategory === category.name ? 'text-orange-600' : 'text-gray-600'} 
              />
            )}
            <span className="text-sm font-medium">{category.name}</span>
          </div>
          {category.children && category.children.length > 0 && (
            <Icon 
              name="ChevronRight" 
              size={16} 
              className={hoveredCategory === category.name ? 'text-orange-600' : 'text-gray-400'} 
            />
          )}
        </div>
        
        {/* Subcategories */}
        {category.children && category.children.length > 0 && hoveredCategory === category.name && (
          <div className="absolute left-full top-0 bg-white border border-gray-200 shadow-lg rounded-md min-w-64 z-50 max-h-80 overflow-y-auto">
            <div className="py-2">
              <div className="px-4 py-2 bg-gray-50 border-b sticky top-0">
                <span className="text-sm font-semibold text-gray-700">{category.name}</span>
              </div>
              <div className="py-2">
                {renderCategoryTree(category.children, level + 1)}
              </div>
            </div>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="relative">
      {/* Catalog Button */}
      <Button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-10 rounded-md font-medium flex items-center gap-2 shadow-sm"
      >
        <Icon name="Menu" size={18} />
        <span className="hidden sm:inline">{t.catalog || 'КАТАЛОГ'}</span>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="transition-transform duration-200" 
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 z-40" />
          
          {/* Menu */}
          <div 
            ref={menuRef}
            className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-xl z-50 min-w-80 max-h-96 overflow-y-auto"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 text-sm">{t.allCategories || 'Все категории'}</h3>
            </div>

            {/* Categories List */}
            <div className="py-2">
              {categories.length > 0 ? (
                renderCategoryTree(categories)
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Icon name="Package" size={32} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">{t.noCategoriesFound || 'Категории не найдены'}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {t.viewAllProducts || 'Посмотреть все товары'} →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CatalogMenu;