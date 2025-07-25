import React from 'react';
import Icon from '@/components/ui/icon';
import { Product, Category, Language } from '@/types/product';
import SearchAndFilters from '@/components/SearchAndFilters';
import ProductCatalog from '@/components/ProductCatalog';
import ImageManager from '@/components/ImageManager';

interface MainContentProps {
  activeTab: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedBrands: string[];
  selectedCategories: string[];
  priceRange: {min: number, max: number};
  setPriceRange: (range: {min: number, max: number}) => void;
  brands: string[];
  categories: Category[];
  filteredProducts: Product[];
  products: Product[];
  language: Language;
  translations: any;
  onToggleBrandFilter: (brand: string) => void;
  onToggleCategoryFilter: (category: string) => void;
  editingField: {productId: string, field: string} | null;
  setEditingField: (field: {productId: string, field: string} | null) => void;
  onFieldEdit: (productId: string, field: string, value: string | number) => void;
  onImageNavigation: (productId: string, direction: 'prev' | 'next') => void;
  showImageManager: string | null;
  setShowImageManager: (productId: string | null) => void;
  newImageUrl: string;
  setNewImageUrl: (url: string) => void;
  onFileUpload: (productId: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddImageByUrl: (productId: string) => void;
  onRemoveImage: (productId: string, imageIndex: number) => void;
  onSetCurrentImage: (productId: string, index: number) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  activeTab,
  searchQuery,
  setSearchQuery,
  selectedBrands,
  selectedCategories,
  priceRange,
  setPriceRange,
  brands,
  categories,
  filteredProducts,
  products,
  language,
  translations: t,
  onToggleBrandFilter,
  onToggleCategoryFilter,
  editingField,
  setEditingField,
  onFieldEdit,
  onImageNavigation,
  showImageManager,
  setShowImageManager,
  newImageUrl,
  setNewImageUrl,
  onFileUpload,
  onAddImageByUrl,
  onRemoveImage,
  onSetCurrentImage
}) => {
  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
      
      {/* Search and Filters Tabs */}
      <SearchAndFilters
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
        language={language}
        translations={t}
        onToggleBrandFilter={onToggleBrandFilter}
        onToggleCategoryFilter={onToggleCategoryFilter}
      />

      {/* Catalog Tab */}
      {activeTab === 'catalog' && (
        <ProductCatalog
          products={products}
          language={language}
          translations={t}
          editingField={editingField}
          setEditingField={setEditingField}
          onFieldEdit={onFieldEdit}
          onImageNavigation={onImageNavigation}
          onShowImageManager={setShowImageManager}
        />
      )}

      {(activeTab === 'favorites' || activeTab === 'admin') && (
        <div className="text-center py-12">
          <Icon name="Construction" size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">{t.inDevelopment}</h3>
          <p className="text-gray-500">"{activeTab}" {t.functionalityWillBeAdded}</p>
        </div>
      )}

      {/* Image Managers for all products */}
      {products.map(product => (
        <ImageManager 
          key={`manager-${product.id}`} 
          productId={product.id}
          products={products}
          showImageManager={showImageManager}
          setShowImageManager={setShowImageManager}
          newImageUrl={newImageUrl}
          setNewImageUrl={setNewImageUrl}
          translations={t}
          onFileUpload={onFileUpload}
          onAddImageByUrl={onAddImageByUrl}
          onRemoveImage={onRemoveImage}
          onSetCurrentImage={onSetCurrentImage}
        />
      ))}
    </main>
  );
};

export default MainContent;