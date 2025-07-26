import React from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Language, Category } from '@/types/product';
import LanguageToggle from '@/components/LanguageToggle';
import AddProductForm from '@/components/AddProductForm';
import CatalogMenu from '@/components/CatalogMenu';

interface MainHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  newProduct: any;
  setNewProduct: (product: any) => void;
  allCategories: string[];
  categories: Category[];
  translations: any;
  onAddProduct: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({
  language,
  onLanguageChange,
  showAddForm,
  setShowAddForm,
  newProduct,
  setNewProduct,
  allCategories,
  categories,
  translations: t,
  onAddProduct,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 lg:px-6 py-4 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-4">
            <CatalogMenu categories={categories} translations={t} />
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{t.title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
            <AddProductForm
              showAddForm={showAddForm}
              setShowAddForm={setShowAddForm}
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              allCategories={allCategories}
              translations={t}
              onAddProduct={onAddProduct}
            />
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-wrap gap-1">
          {[
            { id: 'catalog', label: t.catalog, icon: 'Package' },
            { id: 'search', label: t.search, icon: 'Search' },
            { id: 'filters', label: t.filters, icon: 'Filter' },
            { id: 'favorites', label: t.favorites, icon: 'Heart' },
            { id: 'admin', label: t.admin, icon: 'Settings' }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm"
            >
              <Icon name={tab.icon} size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default MainHeader;