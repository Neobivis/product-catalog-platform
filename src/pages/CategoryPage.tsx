import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { useProductsData } from '@/hooks/useProductsData';
import { Product, Category } from '@/types/product';

const CategoryPage: React.FC = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Извлекаем путь категории из URL
  const categoryPath = location.pathname.replace('/category/', '');
  
  const currentPage = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = parseInt(searchParams.get('limit') || '25');
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get data from hook
  const { products, categories } = useProductsData();

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
  const filterProductsByCategory = (category: Category): Product[] => {
    const categoryPath = getCategoryPath(category);
    return products.filter(product => 
      product.category.startsWith(categoryPath)
    );
  };

  // Get full category path
  const getCategoryPath = (category: Category): string => {
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

  useEffect(() => {
    if (!categoryPath) {
      setIsLoading(false);
      return;
    }

    const category = findCategoryByPath(categories, categoryPath);
    if (category) {
      setCurrentCategory(category);
      const products = filterProductsByCategory(category);
      setFilteredProducts(products);
    }
    setIsLoading(false);
  }, [categoryPath]);

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
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const breadcrumb = getBreadcrumb();

  return (
    <div className="min-h-screen bg-gray-50">
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
                Найдено {totalProducts} товар{totalProducts === 1 ? '' : totalProducts < 5 ? 'а' : 'ов'}
              </p>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Показывать по:</span>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="75">75</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Показано {startIndex + 1}-{Math.min(endIndex, totalProducts)} из {totalProducts}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

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
      </div>
    </div>
  );
};

export default CategoryPage;