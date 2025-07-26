import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import MainHeader from '@/components/MainHeader';
import { useProductsData } from '@/hooks/useProductsData';
import { useProductOperations } from '@/hooks/useProductOperations';
import { Product, Language } from '@/types/product';
import { translations } from '@/utils/translations';
import { getRussianFields } from '@/utils/productHelpers';

const HomePage: React.FC = () => {
  const [language, setLanguage] = useState<Language>('ru');
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentPage = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = parseInt(searchParams.get('limit') || '25');
  
  // Local state for MainHeader
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nameEn: '', nameCn: '', nameRu: '', price: 0, sku: '', quantity: 0,
    brand: '', webLink: '', category: '', description: '', descriptionEn: '', descriptionCn: '',
    tnved: '', material: '', purpose: '', forWhom: ''
  });
  const [activeTab, setActiveTab] = useState('catalog');
  
  const t = translations[language];
  
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

  // Sort products by creation date (newest first) - simulate with reverse order
  const sortedProducts = useMemo(() => {
    return [...products].reverse();
  }, [products]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Get all unique categories for form
  const allCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  const handlePageChange = (page: number) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', page.toString());
      return newParams;
    });
  };

  const handleItemsPerPageChange = (limit: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('limit', limit);
      newParams.set('page', '1'); // Reset to first page
      return newParams;
    });
  };

  const addProduct = () => {
    if (newProduct.nameEn && newProduct.price > 0) {
      const product: Product = {
        id: (products.length + 1).toString(),
        nameEn: newProduct.nameEn,
        nameCn: newProduct.nameCn || '',
        nameRu: newProduct.nameRu || newProduct.nameEn,
        price: newProduct.price,
        sku: newProduct.sku || `SKU-${Date.now()}`,
        quantity: newProduct.quantity || 0,
        brand: newProduct.brand || '',
        webLink: newProduct.webLink || '',
        category: newProduct.category || 'Без категории',
        images: ['/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg'],
        currentImageIndex: 0,
        description: newProduct.description || '',
        descriptionEn: newProduct.descriptionEn || '',
        descriptionCn: newProduct.descriptionCn || '',
        tnved: newProduct.tnved || '',
        material: newProduct.material || '',
        purpose: newProduct.purpose || '',
        forWhom: newProduct.forWhom || ''
      };

      setProducts(prev => [...prev, product]);
      setNewProduct({
        nameEn: '', nameCn: '', nameRu: '', price: 0, sku: '', quantity: 0,
        brand: '', webLink: '', category: '', description: '', descriptionEn: '', descriptionCn: '',
        tnved: '', material: '', purpose: '', forWhom: ''
      });
      setShowAddForm(false);
    }
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
        onAddProduct={addProduct}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Последние товары
          </h1>
          <p className="text-gray-600">
            Показаны {paginatedProducts.length} из {sortedProducts.length} товаров
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Показывать по:</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="75">75</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-700">товаров</span>
          </div>

          {/* Pagination Info */}
          <div className="text-sm text-gray-600">
            Страница {currentPage} из {totalPages}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
          {paginatedProducts.map((product) => {
            const russianFields = getRussianFields(product, language);
            return (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  ...russianFields
                }}
              />
            );
          })}
        </div>

        {/* No Products Message */}
        {paginatedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Товары не найдены</h3>
            <p className="text-gray-600">Добавьте первый товар в каталог</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;