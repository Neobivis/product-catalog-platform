import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Category } from '@/types/product';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedValue: string;
  onSelect: (categoryPath: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categories,
  selectedValue,
  onSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [breadcrumb, setBreadcrumb] = useState<Category[]>([]);
  const [currentCategories, setCurrentCategories] = useState<Category[]>(categories);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setBreadcrumb([]);
      setCurrentCategories(categories);
      // Auto-expand categories based on selected value
      if (selectedValue) {
        const pathParts = selectedValue.split('/');
        const expanded = new Set<string>();
        let currentCats = categories;
        for (let i = 0; i < pathParts.length - 1; i++) {
          const cat = currentCats.find(c => c.name === pathParts[i]);
          if (cat) {
            expanded.add(cat.id);
            currentCats = cat.children || [];
          }
        }
        setExpandedCategories(expanded);
      }
    }
  }, [isOpen, categories, selectedValue]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const navigateToCategory = (category: Category) => {
    setBreadcrumb([...breadcrumb, category]);
    setCurrentCategories(category.children || []);
  };

  const navigateBack = () => {
    if (breadcrumb.length === 0) return;
    const newBreadcrumb = breadcrumb.slice(0, -1);
    setBreadcrumb(newBreadcrumb);
    
    if (newBreadcrumb.length === 0) {
      setCurrentCategories(categories);
    } else {
      const parent = newBreadcrumb[newBreadcrumb.length - 1];
      setCurrentCategories(parent.children || []);
    }
  };

  const handleCategorySelect = (category: Category) => {
    const fullPath = [...breadcrumb, category].map(cat => cat.name).join('/');
    onSelect(fullPath);
    onClose();
  };

  const clearSelection = () => {
    onSelect('');
    onClose();
  };

  const filterCategories = (cats: Category[], query: string): Category[] => {
    if (!query) return cats;
    
    return cats.filter(cat => {
      const matchesName = cat.name.toLowerCase().includes(query.toLowerCase());
      const hasMatchingChildren = cat.children && 
        filterCategories(cat.children, query).length > 0;
      return matchesName || hasMatchingChildren;
    }).map(cat => ({
      ...cat,
      children: cat.children ? filterCategories(cat.children, query) : undefined
    }));
  };

  const renderCategoryTree = (cats: Category[], level = 0) => {
    const filteredCats = searchQuery ? filterCategories(cats, searchQuery) : cats;
    
    return filteredCats.map(category => {
      const isExpanded = expandedCategories.has(category.id);
      const hasChildren = category.children && category.children.length > 0;
      const isSelected = selectedValue === [...breadcrumb, category].map(c => c.name).join('/');

      return (
        <div key={category.id} className="mb-2">
          <div
            className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer
              ${isSelected 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
              ${level > 0 ? 'ml-6' : ''}
            `}
          >
            <div className="flex items-center gap-3 flex-1">
              {/* Expand/Collapse button */}
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (searchQuery) {
                      // In search mode, navigate to category
                      setBreadcrumb([]);
                      setCurrentCategories(category.children || []);
                      setSearchQuery('');
                    } else {
                      toggleExpanded(category.id);
                    }
                  }}
                >
                  <Icon 
                    name={searchQuery ? "ArrowRight" : (isExpanded ? "ChevronDown" : "ChevronRight")} 
                    size={16} 
                  />
                </Button>
              )}
              
              {/* Category icon and name */}
              <div 
                className="flex items-center gap-3 flex-1 min-w-0"
                onClick={() => handleCategorySelect(category)}
              >
                {category.icon && (
                  <Icon 
                    name={category.icon} 
                    size={24} 
                    className={isSelected ? 'text-blue-600' : 'text-gray-600'} 
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className={`font-semibold text-lg ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                    {category.name}
                  </h3>
                  {breadcrumb.length > 0 && (
                    <p className="text-sm text-gray-500 truncate">
                      {[...breadcrumb, category].map(c => c.name).join(' → ')}
                    </p>
                  )}
                </div>
              </div>

              {/* Navigation button for categories with children */}
              {hasChildren && !searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToCategory(category);
                  }}
                  className="flex-shrink-0"
                >
                  <Icon name="ArrowRight" size={16} className="mr-1" />
                  Открыть
                </Button>
              )}
            </div>
          </div>

          {/* Expanded children */}
          {hasChildren && isExpanded && !searchQuery && (
            <div className="mt-2">
              {renderCategoryTree(category.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Icon name="FolderTree" size={24} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Выбор категории</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Search and Navigation */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          {/* Search */}
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск категорий..."
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* Breadcrumb */}
          {breadcrumb.length > 0 && !searchQuery && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBreadcrumb([]);
                  setCurrentCategories(categories);
                }}
                className="flex items-center gap-1"
              >
                <Icon name="Home" size={16} />
                Главная
              </Button>
              
              {breadcrumb.map((cat, index) => (
                <React.Fragment key={cat.id}>
                  <Icon name="ChevronRight" size={16} className="text-gray-400" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newBreadcrumb = breadcrumb.slice(0, index + 1);
                      setBreadcrumb(newBreadcrumb);
                      setCurrentCategories(cat.children || []);
                    }}
                    className="flex items-center gap-1"
                  >
                    {cat.icon && <Icon name={cat.icon} size={16} />}
                    {cat.name}
                  </Button>
                </React.Fragment>
              ))}
              
              {breadcrumb.length > 1 && (
                <>
                  <div className="flex-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={navigateBack}
                    className="flex items-center gap-1"
                  >
                    <Icon name="ArrowLeft" size={16} />
                    Назад
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentCategories.length > 0 || searchQuery ? (
            <div className="space-y-3">
              {renderCategoryTree(searchQuery ? categories : currentCategories)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="FolderOpen" size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Нет подкатегорий</h3>
              <p className="text-gray-500">В этой категории нет дочерних элементов</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            {selectedValue && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-md">
                <Icon name="Check" size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800">{selectedValue}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={clearSelection}>
              <Icon name="X" size={16} className="mr-2" />
              Очистить
            </Button>
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;