import React, { useState } from 'react';
import { Product, Language } from '@/types/product';
import { translations } from '@/utils/translations';
import { useProductsData } from '@/hooks/useProductsData';
import { useProductOperations } from '@/hooks/useProductOperations';
import { useFilters } from '@/hooks/useFilters';
import { getRussianFields } from '@/utils/productHelpers';
import MainHeader from '@/components/MainHeader';
import MainContent from '@/components/MainContent';

const Index = () => {
  const [language, setLanguage] = useState<Language>('ru');
  const t = translations[language];
  
  // Get data and operations from custom hooks
  const { products, setProducts, categories } = useProductsData();
  
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
        translations={t}
        onAddProduct={handleAddProduct}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
      />
    </div>
  );
};

export default Index;