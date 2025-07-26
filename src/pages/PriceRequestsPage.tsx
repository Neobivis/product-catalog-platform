import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product, Language } from '@/types/product';
import { translations } from '@/utils/translations';
import { useProductsData } from '@/hooks/useProductsData';
import { useProductOperations } from '@/hooks/useProductOperations';
import { getRussianFields } from '@/utils/productHelpers';
import { hasPermission } from '@/types/user';
import { useUserManagement } from '@/hooks/useUserManagement';
import MainHeader from '@/components/MainHeader';
import ProductCatalog from '@/components/ProductCatalog';
import AuthModal from '@/components/AuthModal';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface PriceRequestsPageProps {
  forceLanguage?: Language;
}

const PriceRequestsPage: React.FC<PriceRequestsPageProps> = ({ forceLanguage }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (forceLanguage) return forceLanguage;
    return 'ru';
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { authState, logout } = useUserManagement();
  
  const t = translations[language];

  // Принудительный язык
  useEffect(() => {
    if (forceLanguage) {
      setLanguage(forceLanguage);
    }
  }, [forceLanguage]);

  // Автоматическое переключение на китайский для пользователей chinese_only
  useEffect(() => {
    if (authState.currentUser?.role === 'chinese_only' && !forceLanguage) {
      setLanguage('cn');
    }
  }, [authState.currentUser, forceLanguage]);

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

  // Фильтрация товаров с запросом цены
  const priceRequestProducts = products.filter(product => {
    // Проверяем основную категорию
    if (product.category === 'Запрос цены') {
      return true;
    }
    
    // Проверяем дополнительные категории
    if (product.additionalCategories && product.additionalCategories.includes('Запрос цены')) {
      return true;
    }
    
    return false;
  });

  // State management
  const [activeTab] = useState('catalog');
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
    descriptionRu: '',
    additionalCategories: []
  });

  const allCategories = Array.from(new Set(products.map(product => product.category).filter(Boolean)));

  // Handlers
  const handleAddProduct = () => {
    if (!newProduct.nameRu || !newProduct.category) {
      alert(t.fillRequiredFields || 'Заполните обязательные поля');
      return;
    }

    const productToAdd: Product = {
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
      descriptionRu: newProduct.descriptionRu || '',
      additionalCategories: newProduct.additionalCategories || []
    };

    setProducts(prev => [...prev, productToAdd]);
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
      descriptionRu: '',
      additionalCategories: []
    });
    setShowAddForm(false);
  };

  const handleUpdateCategories = (updatedCategories: any[]) => {
    setCategories(updatedCategories);
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
        setActiveTab={() => {}}
        currentUser={authState.currentUser}
        isGuest={authState.isGuest}
        onShowAuth={() => setShowAuthModal(true)}
        onLogout={logout}
      />

      {/* Заголовок страницы */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            <Icon name="ArrowLeft" size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="MessageSquare" size={20} className="text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Запрос цены</h1>
              <p className="text-gray-600">Товары с запросом индивидуальной цены</p>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Icon name="Info" size={16} className="text-green-600" />
            <span className="text-green-800 font-medium">
              Найдено товаров: {priceRequestProducts.length}
            </span>
          </div>
        </div>

        {/* Каталог товаров */}
        {priceRequestProducts.length > 0 ? (
          <ProductCatalog
            products={priceRequestProducts}
            language={language}
            translations={t}
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
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="MessageSquare" size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет товаров с запросом цены
            </h3>
            <p className="text-gray-500 mb-6">
              Когда товары будут добавлены в запрос цены, они появятся здесь
            </p>
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Вернуться к каталогу
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Модальное окно авторизации */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          language={language}
        />
      )}
    </div>
  );
};

export default PriceRequestsPage;