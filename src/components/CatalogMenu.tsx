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
  const [currentCategories, setCurrentCategories] = useState<Category[]>(categories);
  const [breadcrumb, setBreadcrumb] = useState<Category[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset to root categories when closing
        setCurrentCategories(categories);
        setBreadcrumb([]);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (breadcrumb.length > 0) {
          // Go back one level
          navigateBack();
        } else {
          setIsOpen(false);
        }
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
  }, [isOpen, breadcrumb]);

  const navigateToCategory = (category: Category) => {
    if (!category.children || category.children.length === 0) {
      // Leaf category - navigate to category page
      const categoryPath = [...breadcrumb, category].map(c => encodeURIComponent(c.name)).join('/');
      window.location.href = `/category/${categoryPath}`;
      setIsOpen(false);
      // Reset to root
      setCurrentCategories(categories);
      setBreadcrumb([]);
      return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      setBreadcrumb([...breadcrumb, category]);
      setCurrentCategories(category.children || []);
      setIsAnimating(false);
    }, 150);
  };

  const navigateBack = () => {
    if (breadcrumb.length === 0) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      const newBreadcrumb = breadcrumb.slice(0, -1);
      setBreadcrumb(newBreadcrumb);
      
      if (newBreadcrumb.length === 0) {
        setCurrentCategories(categories);
      } else {
        const parent = newBreadcrumb[newBreadcrumb.length - 1];
        setCurrentCategories(parent.children || []);
      }
      setIsAnimating(false);
    }, 150);
  };

  const navigateToRoot = () => {
    if (breadcrumb.length === 0) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setBreadcrumb([]);
      setCurrentCategories(categories);
      setIsAnimating(false);
    }, 150);
  };

  const renderCategories = () => {
    return currentCategories.map((category) => (
      <div
        key={category.id}
        className="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
        onClick={() => navigateToCategory(category)}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {category.icon && (
            <Icon 
              name={category.icon} 
              size={18} 
              className="text-gray-600 flex-shrink-0" 
            />
          )}
          <span className="text-sm font-medium text-gray-900 truncate">{category.name}</span>
        </div>
        
        {category.children && category.children.length > 0 && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {category.children.length}
            </span>
            <Icon name="ChevronRight" size={16} className="text-gray-400" />
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
        <span className="hidden sm:inline">{t.catalog || 'Каталог'}</span>
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
            className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-xl z-50 w-80 overflow-hidden flex flex-col"
            style={{ maxHeight: 'min(75vh, 600px)' }}
          >
            {/* Header with Navigation */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              {breadcrumb.length > 0 ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={navigateBack}
                      className="h-6 w-6 p-0 flex-shrink-0"
                    >
                      <Icon name="ArrowLeft" size={14} />
                    </Button>
                    <span className="font-semibold text-gray-800 text-sm truncate">
                      {breadcrumb[breadcrumb.length - 1].name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={navigateToRoot}
                    className="h-6 px-2 text-xs flex-shrink-0"
                  >
                    <Icon name="Home" size={12} className="mr-1" />
                    Главная
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Icon name="FolderTree" size={16} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {t.allCategories || 'Все категории'}
                  </h3>
                </div>
              )}
            </div>

            {/* Breadcrumb */}
            {breadcrumb.length > 0 && (
              <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                <div className="flex items-center gap-1 text-xs text-blue-700">
                  <Icon name="Home" size={12} />
                  {breadcrumb.map((cat, index) => (
                    <React.Fragment key={cat.id}>
                      <Icon name="ChevronRight" size={10} className="text-blue-400" />
                      <span className="truncate max-w-20" title={cat.name}>
                        {cat.name}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Categories List with Animation */}
            <div 
              className={`transition-all duration-150 ${
                isAnimating ? 'opacity-50 transform translate-x-2' : 'opacity-100 transform translate-x-0'
              }`}
            >
              <div className="flex-1 overflow-y-auto">
                {currentCategories.length > 0 ? (
                  renderCategories()
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <Icon name="Package" size={32} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">{t.noCategoriesFound || 'Категории не найдены'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setCurrentCategories(categories);
                  setBreadcrumb([]);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <Icon name="Grid3X3" size={14} />
                {t.viewAllProducts || 'Посмотреть все товары'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CatalogMenu;