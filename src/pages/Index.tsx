import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Language } from '@/types/product';
import { translations } from '@/utils/translations';
import { useProductsData } from '@/hooks/useProductsData';
import { useProductOperations } from '@/hooks/useProductOperations';
import { useFilters } from '@/hooks/useFilters';
import { getRussianFields } from '@/utils/productHelpers';
import { hasPermission } from '@/types/user';
import { useUserManagement } from '@/hooks/useUserManagement';
import MainHeader from '@/components/MainHeader';
import MainContent from '@/components/MainContent';
import AuthModal from '@/components/AuthModal';

interface IndexProps {
  forceLanguage?: Language;
}

const Index: React.FC<IndexProps> = ({ forceLanguage }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Устанавливаем язык по умолчанию
    if (forceLanguage) return forceLanguage;
    return 'ru';
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hasRedirectedVictor, setHasRedirectedVictor] = useState(false);
  const { authState, logout } = useUserManagement();
  const navigate = useNavigate();
  
  const t = translations[language];

  // Принудительный язык для китайской версии
  useEffect(() => {
    if (forceLanguage) {
      setLanguage(forceLanguage);
    }
  }, [forceLanguage]);

  // Автоматическое переключение на китайский для пользователей chinese_only и victor
  useEffect(() => {
    if ((authState.currentUser?.role === 'chinese_only' || authState.currentUser?.role === 'victor') && !forceLanguage) {
      setLanguage('cn');
    }
  }, [authState.currentUser, forceLanguage]);

  // Автоматический переход Victor в раздел "Запрос цены" только при первом входе
  useEffect(() => {
    if (authState.currentUser?.role === 'victor' && !forceLanguage && !hasRedirectedVictor) {
      setHasRedirectedVictor(true);
      navigate('/price-requests');
    }
  }, [authState.currentUser, navigate, forceLanguage, hasRedirectedVictor]);

  // Сброс флага при смене пользователя
  useEffect(() => {
    if (!authState.currentUser || authState.currentUser.role !== 'victor') {
      setHasRedirectedVictor(false);
    }
  }, [authState.currentUser]);

  // Показываем модальное окно авторизации при первом запуске (если не гость)
  useEffect(() => {
    if (!authState.isAuthenticated && !authState.isGuest && !forceLanguage) {
      setShowAuthModal(true);
    }
  }, [authState, forceLanguage]);
  
  // Get data and operations from custom hooks
  const { products, setProducts, categories, setCategories } = useProductsData();
  
  const {
    editingField,
    setEditingField,
    showImageManager,
    setShowImageManager,
    newImageUrl,
    setNewImageUrl,
    handleFieldEdit,
    handleImageNavigation,
    handleFileUpload,
    addImageByUrl,
    removeImageFromProduct,
    setCurrentImage
  } = useProductOperations(products, setProducts);

  const {
    searchQuery,
    setSearchQuery,
    selectedBrands,
    selectedCategories,
    priceRange,
    setPriceRange,
    brands,
    allCategories,
    filteredProducts,
    toggleBrandFilter,
    toggleCategoryFilter
  } = useFilters(products, categories);

  // State management
  const [activeTab, setActiveTab] = useState('catalog');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    nameEn: '',
    nameCn: '',
    nameRu: '',
    price: 0,
    sku: '',
    quantity: 0,
    brand: '',
    webLink: '',
    category: '',
    images: ['/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg'],
    currentImageIndex: 0,
    description: '',
    descriptionEn: '',
    descriptionCn: '',
    tnved: '',
    material: '',
    purpose: '',
    forWhom: ''
  });

  const handleAddProduct = () => {
    // Проверяем права на создание продуктов
    if (!hasPermission(authState.currentUser, 'write', 'products', language)) {
      alert(t.noPermission || 'У вас нет прав для выполнения этого действия');
      return;
    }
    
    if (newProduct.nameEn && newProduct.sku) {
      const autoRussianFields = getRussianFields(newProduct.category || '', newProduct.nameEn || '');
      
      const product: Product = {
        id: Date.now().toString(),
        nameEn: newProduct.nameEn || '',
        nameCn: newProduct.nameCn || '',
        nameRu: newProduct.nameRu || '',
        price: newProduct.price || 0,
        sku: newProduct.sku || '',
        quantity: newProduct.quantity || 0,
        brand: newProduct.brand || '',
        webLink: newProduct.webLink || '',
        category: newProduct.category || '',
        images: newProduct.images || ['/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg'],
        currentImageIndex: 0,
        description: newProduct.description || '',
        descriptionEn: newProduct.descriptionEn || '',
        descriptionCn: newProduct.descriptionCn || '',
        tnved: newProduct.tnved || autoRussianFields.tnved,
        material: newProduct.material || autoRussianFields.material,
        purpose: newProduct.purpose || autoRussianFields.purpose,
        forWhom: newProduct.forWhom || autoRussianFields.forWhom
      };
      setProducts(prev => [...prev, product]);
      setNewProduct({
        nameEn: '',
        nameCn: '',
        nameRu: '',
        price: 0,
        sku: '',
        quantity: 0,
        brand: '',
        webLink: '',
        category: '',
        images: ['/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg'],
        currentImageIndex: 0,
        description: '',
        descriptionEn: '',
        descriptionCn: '',
        tnved: '',
        material: '',
        purpose: '',
        forWhom: ''
      });
      setShowAddForm(false);
    }
  };

  const handleUpdateCategories = (newCategories: Category[]) => {
    // Проверяем права на изменение категорий
    if (!hasPermission(authState.currentUser, 'write', 'categories', language)) {
      alert(t.noPermission || 'У вас нет прав для выполнения этого действия');
      return;
    }
    
    setCategories(newCategories);
    
    // Check if any products have categories that no longer exist
    const getAllCategoryPaths = (cats: Category[], path: string[] = []): string[] => {
      const paths: string[] = [];
      cats.forEach(cat => {
        const currentPath = [...path, cat.name].join('/');
        paths.push(currentPath);
        if (cat.children) {
          paths.push(...getAllCategoryPaths(cat.children, [...path, cat.name]));
        }
      });
      return paths;
    };

    const validCategoryPaths = getAllCategoryPaths(newCategories);
    
    // Move products with invalid categories to "Без категории"
    setProducts(prev => prev.map(product => {
      if (product.category && !validCategoryPaths.includes(product.category)) {
        return { ...product, category: 'Без категории' };
      }
      return product;
    }));
  };

  const handleAdditionalCategoriesChange = (productId: string, additionalCategories: string[]) => {
    // Проверяем права на изменение товаров
    if (!hasPermission(authState.currentUser, 'write', 'products', language)) {
      alert(t.noPermission || 'У вас нет прав для выполнения этого действия');
      return;
    }

    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, additionalCategories }
        : product
    ));
  };

  const handlePriceRequest = (productId: string) => {
    // Проверяем права на изменение товаров
    if (!hasPermission(authState.currentUser, 'write', 'products', language)) {
      alert(t.noPermission || 'У вас нет прав для выполнения этого действия');
      return;
    }

    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const updatedAdditionalCategories = product.additionalCategories || [];
        
        // Добавляем категорию "Запрос цены", если её ещё нет
        if (!updatedAdditionalCategories.includes('Запрос цены')) {
          updatedAdditionalCategories.push('Запрос цены');
        }

        return {
          ...product,
          price: 0, // Обнуляем цену
          additionalCategories: updatedAdditionalCategories
        };
      }
      return product;
    }));
  };

  const handlePriceRequestFilter = () => {
    // Фильтруем товары с запросом цены и показываем их
    toggleCategoryFilter('Запрос цены');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader
        language={language}
        onLanguageChange={setLanguage}
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        allCategories={allCategories}
        categories={categories}
        translations={t}
        onAddProduct={handleAddProduct}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={authState.currentUser}
        isGuest={authState.isGuest}
        onShowAuth={() => setShowAuthModal(true)}
        onLogout={logout}
        onPriceRequestFilter={handlePriceRequestFilter}
      />

      <MainContent
        activeTab={activeTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedBrands={selectedBrands}
        selectedCategories={selectedCategories}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        brands={brands}
        categories={categories}
        filteredProducts={filteredProducts}
        products={products}
        language={language}
        translations={t}
        onToggleBrandFilter={toggleBrandFilter}
        onToggleCategoryFilter={toggleCategoryFilter}
        editingField={editingField}
        setEditingField={setEditingField}
        onFieldEdit={handleFieldEdit}
        onImageNavigation={handleImageNavigation}
        showImageManager={showImageManager}
        setShowImageManager={setShowImageManager}
        newImageUrl={newImageUrl}
        setNewImageUrl={setNewImageUrl}
        onFileUpload={handleFileUpload}
        onAddImageByUrl={addImageByUrl}
        onRemoveImage={removeImageFromProduct}
        onSetCurrentImage={setCurrentImage}
        onUpdateCategories={handleUpdateCategories}
        onAdditionalCategoriesChange={handleAdditionalCategoriesChange}
        onPriceRequest={handlePriceRequest}
      />

      {/* Модальное окно авторизации */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        language={language}
      />
    </div>
  );
};

export default Index;