import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import ProductCatalog from '@/components/ProductCatalog';
import Pagination from '@/components/Pagination';
import ImageModal from '@/components/ImageModal';
import MainHeader from '@/components/MainHeader';
import MainContent from '@/components/MainContent';
import { useProductsData } from '@/hooks/useProductsData';
import { useProductOperations } from '@/hooks/useProductOperations';
import { Product, Category, Language } from '@/types/product';
import { getRussianFields } from '@/utils/productHelpers';
import { translations } from '@/utils/translations';

const CategoryPage: React.FC = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Извлекаем путь категории из URL
  const categoryPath = location.pathname.replace('/category/', '');
  
  const currentPage = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = parseInt(searchParams.get('limit') || '25');
  
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('ru');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // MainHeader states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nameEn: '', nameCn: '', nameRu: '', price: 0, sku: '', quantity: 0,
    brand: '', webLink: '', category: '', description: '', descriptionEn: '', descriptionCn: '',
    tnved: '', material: '', purpose: '', forWhom: ''
  });
  const [activeTab, setActiveTab] = useState('catalog');
  
  // States for MainContent
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({min: 0, max: 10000});
  
  // Get data from hook
  const { products, setProducts, categories, setCategories } = useProductsData();
  
  // Get product operations for editing
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
  
  const t = translations[language];

  // Find category by path
  const findCategoryByPath = (cats: Category[], path: string): Category | null => {
    const pathParts = path.split('/');
    let currentCats = cats;
    let category: Category | null = null;
    
    for (const part of pathParts) {
      category = currentCats.find(c => c.name === decodeURIComponent(part)) || null;
      if (!category) return null;
      currentCats = category.children || [];
    }
    
    return category;
  };

  // Filter products by category
  const filterProductsByCategory = (categoryPath: string): Product[] => {
    const decodedPath = categoryPath.split('/').map(part => decodeURIComponent(part)).join('/');
    console.log('Filtering products for path:', decodedPath);
    console.log('Available products:', products.map(p => ({ name: p.nameRu, category: p.category })));
    
    const filtered = products.filter(product => {
      const normalizedProductCategory = product.category.trim();
      const normalizedSearchPath = decodedPath.trim();
      
      // Extract the last part of the search path (leaf category)
      const searchPathParts = normalizedSearchPath.split('/');
      const leafCategory = searchPathParts[searchPathParts.length - 1];
      
      // Check multiple matching strategies:
      // 1. Exact match with full path
      const fullPathMatch = normalizedProductCategory === normalizedSearchPath;
      
      // 2. Product category starts with search path
      const startsWithMatch = normalizedProductCategory.startsWith(normalizedSearchPath);
      
      // 3. Product category ends with leaf category (for backwards compatibility)
      const leafMatch = normalizedProductCategory === leafCategory || 
                       normalizedProductCategory.endsWith('/' + leafCategory);
      
      const matches = fullPathMatch || startsWithMatch || leafMatch;
      
      console.log(`Comparing "${normalizedProductCategory}" with "${normalizedSearchPath}":`, {
        fullPathMatch,
        startsWithMatch, 
        leafMatch,
        matches
      });
      
      return matches;
    });
    
    console.log('Filtered products:', filtered.map(p => ({ name: p.nameRu, category: p.category })));
    return filtered;
  };

  // Get full category path
  const getCategoryPath = (): string => {
    if (!categoryPath) return '';
    return categoryPath.split('/').map(part => decodeURIComponent(part)).join('/');
  };

  // Get breadcrumb from category path
  const getBreadcrumb = (): Category[] => {
    if (!categoryPath) return [];
    
    const pathParts = categoryPath.split('/');
    const breadcrumb: Category[] = [];
    let currentCats = categories;
    
    for (const part of pathParts) {
      const decodedPart = decodeURIComponent(part);
      const category = currentCats.find(c => c.name === decodedPart);
      if (category) {
        breadcrumb.push(category);
        currentCats = category.children || [];
      }
    }
    
    return breadcrumb;
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!categoryPath) return [];
    return filterProductsByCategory(categoryPath);
  }, [products, categoryPath]);

  // Sort products by creation date (newest first) - use ID as proxy for creation order
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      // Assuming higher ID means more recent (last created)
      return (b.id || 0) - (a.id || 0);
    });
  }, [filteredProducts]);

  useEffect(() => {
    if (!categoryPath) {
      setIsLoading(false);
      return;
    }

    const category = findCategoryByPath(categories, categoryPath);
    if (category) {
      setCurrentCategory(category);
    }
    setIsLoading(false);
  }, [categoryPath, categories]);

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  const handleItemsPerPageChange = (limit: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('limit', limit);
    newParams.set('page', '1'); // Reset to first page
    setSearchParams(newParams);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600">Загрузка каталога...</p>
        </div>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Icon name="FolderX" size={64} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Категория не найдена</h1>
          <p className="text-gray-600 mb-6">Запрашиваемая категория не существует или была удалена.</p>
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="mr-3"
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Назад
          </Button>
          <Button onClick={() => window.location.href = '/'}>
            <Icon name="Home" size={16} className="mr-2" />
            На главную
          </Button>
        </div>
      </div>
    );
  }

  // Pagination calculations
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const handleProductUpdate = (updatedProduct: Product) => {
    const updatedProducts = products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    );
    setProducts(updatedProducts);
  };

  // Get all unique categories for form
  const allCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  
  // Get all unique brands
  const brands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean);
  
  // Filter toggle functions
  const onToggleBrandFilter = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };
  
  const onToggleCategoryFilter = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Filter products for MainContent
  const filteredProductsForMainContent = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = !searchQuery || 
        product.nameRu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.nameEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      
      return matchesSearch && matchesBrand && matchesCategory && matchesPrice;
    });
  }, [products, searchQuery, selectedBrands, selectedCategories, priceRange]);

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

  const breadcrumb = getBreadcrumb();

  // Debug info
  console.log('CategoryPage render:', { categoryPath, isLoading, products: products.length, filteredProducts: filteredProducts.length });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

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

      {/* Show MainContent for other tabs */}
      {activeTab !== 'catalog' ? (
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
          filteredProducts={filteredProductsForMainContent}
          products={products}
          language={language}
          translations={t}
          onToggleBrandFilter={onToggleBrandFilter}
          onToggleCategoryFilter={onToggleCategoryFilter}
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
          onUpdateCategories={setCategories}
        />
      ) : (
        <>
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <a href="/" className="hover:text-blue-600 transition-colors">
                <Icon name="Home" size={16} />
              </a>
              {breadcrumb.map((cat, index) => (
                <React.Fragment key={cat.id}>
                  <Icon name="ChevronRight" size={14} className="text-gray-400" />
                  <span 
                    className={index === breadcrumb.length - 1 ? 'text-gray-900 font-medium' : 'hover:text-blue-600 cursor-pointer'}
                  >
                    {cat.name}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </nav>

          {/* Category Header */}
          <div className="flex items-center gap-4 mb-6">
            {currentCategory.icon && (
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name={currentCategory.icon} size={32} className="text-blue-600" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{currentCategory.name}</h1>
              <p className="text-gray-600 mt-1">
                Показано {currentProducts.length} из {totalProducts} товаров (отсортированы по дате создания)
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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

          {/* Top Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <div className="text-sm text-gray-600">
                Показано {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, totalProducts)} из {totalProducts} товаров
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentProducts.length > 0 ? (
          <>
            <ProductCatalog
              products={currentProducts.map(product => {
                const russianFields = getRussianFields(product.category || '', product.nameEn || '');
                return {
                  ...product,
                  ...russianFields
                };
              })}
              categories={categories}
              language={language}
              translations={t}
              editingField={editingField}
              setEditingField={setEditingField}
              onFieldEdit={handleFieldEdit}
              onImageNavigation={handleImageNavigation}
              onShowImageManager={setShowImageManager}
              onImageClick={setSelectedProduct}
            />

            {/* Bottom Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                <div className="text-sm text-gray-600">
                  Показано {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, totalProducts)} из {totalProducts} товаров
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Icon name="Package" size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Товары не найдены</h3>
            <p className="text-gray-600 mb-6">В данной категории пока нет товаров.</p>
            <Button onClick={() => window.history.back()}>
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Вернуться назад
            </Button>
          </div>
        )}
        
        {/* Image Modal */}
        {selectedProduct && (
          <ImageModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onPrevImage={() => handleImageNavigation(selectedProduct.id, 'prev')}
            onNextImage={() => handleImageNavigation(selectedProduct.id, 'next')}
          />
        )}
      </div>
      </>
      )}
    </div>
  );
};

export default CategoryPage;