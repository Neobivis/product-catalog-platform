import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Language, Category } from '@/types/product';
import { User, hasPermission } from '@/types/user';
import LanguageToggle from '@/components/LanguageToggle';
import AddProductForm from '@/components/AddProductForm';
import CatalogMenu from '@/components/CatalogMenu';
import { Link } from 'react-router-dom';

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
  currentUser?: User | null;
  isGuest?: boolean;
  onShowAuth?: () => void;
  onLogout?: () => void;
  onPriceRequestFilter?: () => void;
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
  setActiveTab,
  currentUser,
  isGuest,
  onShowAuth,
  onLogout,
  onPriceRequestFilter
}) => {

  // Проверяем права на добавление продуктов
  const canAddProducts = currentUser 
    ? hasPermission(currentUser, 'write', 'products', language) && currentUser.role !== 'chinese_only'
    : false;

  // Проверяем права на админку
  const canAccessAdmin = currentUser 
    ? hasPermission(currentUser, 'admin', 'all') || hasPermission(currentUser, 'write', 'categories', language)
    : false;

  // Проверяем, нужно ли показывать переключатель языка
  const showLanguageToggle = !currentUser || currentUser.role !== 'chinese_only';
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 lg:px-6 py-4 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <img 
                src="/img/logo.svg" 
                alt="Логотип poehali.dev" 
                className="h-8 w-auto max-w-[120px]"
                onError={(e) => {
                  // Fallback to text logo if SVG fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg';
                  fallback.textContent = 'П';
                  target.parentNode?.appendChild(fallback);
                }}
              />
            </Link>
            
            <CatalogMenu categories={categories} translations={t} onPriceRequestFilter={onPriceRequestFilter} />

            {/* Кнопка Запрос цены */}
            <Link to="/price-requests">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 h-10 rounded-md font-medium flex items-center gap-2 shadow-sm">
                <Icon name="MessageSquare" size={18} />
                <span className="hidden sm:inline">Запрос цены</span>
              </Button>
            </Link>

          </div>
          
          <div className="flex items-center gap-4">
            {showLanguageToggle && (
              <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
            )}
            {canAddProducts && (
              <AddProductForm
                showAddForm={showAddForm}
                setShowAddForm={setShowAddForm}
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                allCategories={allCategories}
                translations={t}
                onAddProduct={onAddProduct}
              />
            )}
            
            {/* Информация о пользователе */}
            <div className="flex items-center gap-2">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <Badge variant={currentUser.role === 'admin' ? 'default' : 'secondary'}>
                    <Icon 
                      name={currentUser.role === 'admin' ? 'Crown' : currentUser.role === 'chinese_only' ? 'Globe' : 'User'} 
                      size={12} 
                      className="mr-1" 
                    />
                    {currentUser.username}
                  </Badge>
                  {onLogout && (
                    <Button variant="ghost" size="sm" onClick={onLogout}>
                      <Icon name="LogOut" size={14} />
                    </Button>
                  )}
                </div>
              ) : isGuest ? (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    <Icon name="Users" size={12} className="mr-1" />
                    Гость
                  </Badge>
                  {onShowAuth && (
                    <Button variant="ghost" size="sm" onClick={onShowAuth}>
                      <Icon name="LogIn" size={14} />
                    </Button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-wrap gap-1">
          {[
            { id: 'home', label: 'Главная', icon: 'Home', isLink: true },
            { id: 'catalog', label: t.catalog, icon: 'Package' },
            { id: 'search', label: t.search, icon: 'Search' },
            { id: 'filters', label: t.filters, icon: 'Filter' },
            { id: 'favorites', label: t.favorites, icon: 'Heart' },
            ...(canAccessAdmin ? [{ id: 'admin', label: t.admin, icon: 'Settings' }] : [])
          ].map(tab => {
            if (tab.isLink) {
              return (
                <Link key={tab.id} to="/">
                  <Button
                    variant={"ghost"}
                    size="sm"
                    className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm"
                  >
                    <Icon name={tab.icon} size={14} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </Button>
                </Link>
              );
            }
            
            return (
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
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default MainHeader;