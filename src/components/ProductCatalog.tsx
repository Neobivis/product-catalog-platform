import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import EditableField from '@/components/EditableField';
import PriceField from '@/components/PriceField';
import MultiLanguageTextField from '@/components/MultiLanguageTextField';
import MultipleCategorySelector from '@/components/MultipleCategorySelector';
import { Product, Language, Category } from '@/types/product';
import { canEditField } from '@/types/user';
import { useUserManagement } from '@/hooks/useUserManagement';

interface ProductCatalogProps {
  products: Product[];
  categories: Category[];
  language: Language;
  translations: any;
  editingField: {productId: string, field: string} | null;
  setEditingField: (field: {productId: string, field: string} | null) => void;
  onFieldEdit: (productId: string, field: string, value: string | number) => void;
  onImageNavigation: (productId: string, direction: 'prev' | 'next') => void;
  onShowImageManager: (productId: string) => void;
  onImageClick: (product: Product) => void;
  onAdditionalCategoriesChange: (productId: string, categories: string[]) => void;
  onPriceRequest?: (productId: string) => void;
}

const FlagIcon: React.FC<{ country: 'us' | 'cn' | 'ru' }> = ({ country }) => {
  switch (country) {
    case 'us':
      return (
        <div className="w-6 h-4 bg-red-500 relative rounded-sm overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-white to-red-500"></div>
          <div className="absolute top-0 left-0 w-2 h-2 bg-blue-600"></div>
          <span className="text-xs font-bold text-white absolute top-0 left-1">US</span>
        </div>
      );
    case 'cn':
      return (
        <div className="w-6 h-4 bg-red-500 relative rounded-sm overflow-hidden flex-shrink-0">
          <div className="absolute top-0 left-0 w-2 h-4 bg-red-600"></div>
          <span className="text-xs font-bold text-yellow-400 absolute top-0 left-2">CN</span>
        </div>
      );
    case 'ru':
      return (
        <div className="w-6 h-4 relative rounded-sm overflow-hidden flex-shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
          <div className="absolute top-1 left-0 w-full h-1 bg-blue-600"></div>
          <div className="absolute top-2 left-0 w-full h-1 bg-red-600"></div>
          <span className="text-xs font-bold text-white absolute top-0 left-1">RU</span>
        </div>
      );
  }
};

const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  categories,
  language,
  translations: t,
  editingField,
  setEditingField,
  onFieldEdit,
  onImageNavigation,
  onShowImageManager,
  onImageClick,
  onAdditionalCategoriesChange,
  onPriceRequest
}) => {
  const { authState } = useUserManagement();
  return (
    <div className="space-y-6">
      {products.map(product => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Product Images */}
              <div className="order-1 lg:order-1 col-span-1 lg:col-span-3">
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={product.images[product.currentImageIndex]}
                      alt={product.nameEn}
                      className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-105"
                      onClick={() => onImageClick(product)}
                    />
                    {product.images.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => onImageNavigation(product.id, 'prev')}
                        >
                          <Icon name="ChevronLeft" size={16} />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => onImageNavigation(product.id, 'next')}
                        >
                          <Icon name="ChevronRight" size={16} />
                        </Button>
                      </>
                    )}
                    
                    {/* Image Management Button */}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-2 right-2 h-8 w-8 p-0"
                      onClick={() => onShowImageManager(product.id)}
                    >
                      <Icon name="ImagePlus" size={16} />
                    </Button>
                  </div>
                  
                  {/* Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                            index === product.currentImageIndex 
                              ? 'border-blue-500' 
                              : 'border-gray-200'
                          }`}
                          onClick={() => onImageNavigation(product.id, index === product.currentImageIndex ? 'next' : 'prev')}
                        >
                          <img
                            src={image}
                            alt={`${product.nameEn} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="order-2 lg:order-2 col-span-1 lg:col-span-9 space-y-6">
                
                {/* Multi-language Names */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 w-16">
                      <FlagIcon country="us" />
                    </div>
                    <div className="flex-1">
                      <EditableField
                        productId={product.id}
                        field="nameEn"
                        value={product.nameEn}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onFieldEdit={onFieldEdit}
                        disabled={!canEditField(authState.currentUser, 'nameEn')}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 w-16">
                      <FlagIcon country="cn" />
                    </div>
                    <div className="flex-1">
                      <EditableField
                        productId={product.id}
                        field="nameCn"
                        value={product.nameCn}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onFieldEdit={onFieldEdit}
                        disabled={!canEditField(authState.currentUser, 'nameCn')}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 w-16">
                      <FlagIcon country="ru" />
                    </div>
                    <div className="flex-1">
                      <EditableField
                        productId={product.id}
                        field="nameRu"
                        value={product.nameRu}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onFieldEdit={onFieldEdit}
                        disabled={!canEditField(authState.currentUser, 'nameRu')}
                      />
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="p-4 bg-gray-50 border rounded-lg">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">{t.description}</h4>
                  <MultiLanguageTextField
                    productId={product.id}
                    field="description"
                    valueRu={product.description || ''}
                    valueEn={product.descriptionEn || ''}
                    valueCn={product.descriptionCn || ''}
                    language={language}
                    placeholder="Добавить описание товара, ответы на частые вопросы..."
                    editingField={editingField}
                    setEditingField={setEditingField}
                    onFieldEdit={onFieldEdit}
                  />
                </div>

                {/* Product Properties */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                      <span className="font-semibold text-sm w-20">{t.priceField}</span>
                      <div className="flex-1">
                        {canEditField(authState.currentUser, 'price') ? (
                          <PriceField
                            productId={product.id}
                            field="price"
                            value={product.price}
                            language={language}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onFieldEdit={onFieldEdit}
                          />
                        ) : (
                          <span className="text-gray-600">{product.price} ¥</span>
                        )}
                      </div>
                      {onPriceRequest && authState.currentUser && authState.currentUser.role !== 'victor' && (
                        <Button
                          size="sm"
                          variant={product.price === 0 ? "secondary" : "outline"}
                          onClick={() => onPriceRequest(product.id)}
                          className="flex-shrink-0"
                          disabled={product.price === 0}
                        >
                          <Icon 
                            name={product.price === 0 ? "Check" : "MessageSquare"} 
                            size={14} 
                            className="mr-1" 
                          />
                          {product.price === 0 ? t.priceRequested : t.requestPrice}
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                      <span className="font-semibold text-sm w-20">{t.skuField}</span>
                      <div className="flex-1">
                        <EditableField
                          productId={product.id}
                          field="sku"
                          value={product.sku}
                          editingField={editingField}
                          setEditingField={setEditingField}
                          onFieldEdit={onFieldEdit}
                          disabled={!canEditField(authState.currentUser, 'sku')}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                      <span className="font-semibold text-sm w-20">{t.quantityField}</span>
                      <div className="flex-1">
                        <EditableField
                          productId={product.id}
                          field="quantity"
                          value={product.quantity}
                          editingField={editingField}
                          setEditingField={setEditingField}
                          onFieldEdit={onFieldEdit}
                          disabled={!canEditField(authState.currentUser, 'quantity')}
                          type="number"
                          editingField={editingField}
                          setEditingField={setEditingField}
                          onFieldEdit={onFieldEdit}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                      <span className="font-semibold text-sm w-20">{t.brandField}</span>
                      <div className="flex-1">
                        <EditableField
                          productId={product.id}
                          field="brand"
                          value={product.brand}
                          editingField={editingField}
                          setEditingField={setEditingField}
                          onFieldEdit={onFieldEdit}
                          disabled={!canEditField(authState.currentUser, 'brand')}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                      <span className="font-semibold text-sm w-20">{t.webLinkField}</span>
                      <div className="flex-1">
                        <EditableField
                          productId={product.id}
                          field="webLink"
                          value={product.webLink}
                          editingField={editingField}
                          setEditingField={setEditingField}
                          onFieldEdit={onFieldEdit}
                          disabled={!canEditField(authState.currentUser, 'webLink')}
                          value={product.webLink}
                          editingField={editingField}
                          setEditingField={setEditingField}
                          onFieldEdit={onFieldEdit}
                        />
                      </div>
                    </div>
                    
                    {authState.currentUser && authState.currentUser.role !== 'victor' && (
                      <div className="p-3 bg-white border rounded-lg">
                        <MultipleCategorySelector
                          categories={categories}
                          primaryCategory={product.category}
                          additionalCategories={product.additionalCategories || []}
                          onPrimaryCategoryChange={(value) => onFieldEdit(product.id, 'category', value)}
                          onAdditionalCategoriesChange={(categories) => onAdditionalCategoriesChange(product.id, categories)}
                          translations={t}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Russian-specific fields */}
                {language === 'ru' && (
                  <div className="border-t pt-4 mt-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-white border rounded-lg">
                          <span className="font-semibold text-sm w-32 flex-shrink-0">{t.tnved}</span>
                          <div className="flex-1 min-w-0">
                            <EditableField
                              productId={product.id}
                              field="tnved"
                              value={product.tnved || ''}
                              editingField={editingField}
                              setEditingField={setEditingField}
                              onFieldEdit={onFieldEdit}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 bg-white border rounded-lg">
                          <span className="font-semibold text-sm w-32 flex-shrink-0">{t.material}</span>
                          <div className="flex-1 min-w-0">
                            <EditableField
                              productId={product.id}
                              field="material"
                              value={product.material || ''}
                              editingField={editingField}
                              setEditingField={setEditingField}
                              onFieldEdit={onFieldEdit}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-white border rounded-lg">
                          <span className="font-semibold text-sm w-32 flex-shrink-0">{t.purpose}</span>
                          <div className="flex-1 min-w-0">
                            <EditableField
                              productId={product.id}
                              field="purpose"
                              value={product.purpose || ''}
                              editingField={editingField}
                              setEditingField={setEditingField}
                              onFieldEdit={onFieldEdit}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 bg-white border rounded-lg">
                          <span className="font-semibold text-sm w-32 flex-shrink-0">{t.forWhom}</span>
                          <div className="flex-1">
                            <EditableField
                              productId={product.id}
                              field="forWhom"
                              value={product.forWhom || ''}
                              editingField={editingField}
                              setEditingField={setEditingField}
                              onFieldEdit={onFieldEdit}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductCatalog;