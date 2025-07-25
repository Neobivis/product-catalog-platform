import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Product {
  id: string;
  nameEn: string;
  nameCn: string;
  nameRu: string;
  price: number;
  sku: string;
  quantity: number;
  brand: string;
  webLink: string;
  category: string;
  images: string[];
  currentImageIndex: number;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      nameEn: 'Premium Wireless Headphones',
      nameCn: '高级无线耳机',
      nameRu: 'Премиум беспроводные наушники',
      price: 299.99,
      sku: 'WH-1000XM5',
      quantity: 45,
      brand: 'TechBrand',
      webLink: 'https://example.com/headphones',
      category: 'Electronics',
      images: ['/img/cf9d4e6b-0b84-40fa-8944-4ddf188a111f.jpg', '/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg'],
      currentImageIndex: 0
    },
    {
      id: '2',
      nameEn: 'Smart Fitness Tracker',
      nameCn: '智能健身追踪器',
      nameRu: 'Умный фитнес-трекер',
      price: 149.99,
      sku: 'FT-2024-PRO',
      quantity: 78,
      brand: 'FitTech',
      webLink: 'https://example.com/tracker',
      category: 'Wearables',
      images: ['/img/c817e33c-f23e-46f9-8803-0e914e9017bd.jpg', '/img/cf9d4e6b-0b84-40fa-8944-4ddf188a111f.jpg'],
      currentImageIndex: 0
    }
  ]);

  const [editingField, setEditingField] = useState<{productId: string, field: string} | null>(null);
  const [activeTab, setActiveTab] = useState('catalog');

  const handleFieldEdit = (productId: string, field: string, value: string | number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, [field]: field === 'price' || field === 'quantity' ? Number(value) : value }
        : product
    ));
    setEditingField(null);
  };

  const handleImageNavigation = (productId: string, direction: 'prev' | 'next') => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const newIndex = direction === 'next' 
          ? (product.currentImageIndex + 1) % product.images.length
          : (product.currentImageIndex - 1 + product.images.length) % product.images.length;
        return { ...product, currentImageIndex: newIndex };
      }
      return product;
    }));
  };

  const EditableField = ({ 
    productId, 
    field, 
    value, 
    type = 'text' 
  }: { 
    productId: string; 
    field: string; 
    value: string | number; 
    type?: string;
  }) => {
    const isEditing = editingField?.productId === productId && editingField?.field === field;

    if (isEditing) {
      return (
        <Input
          type={type}
          defaultValue={value}
          className="h-8 text-sm"
          autoFocus
          onBlur={(e) => handleFieldEdit(productId, field, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleFieldEdit(productId, field, e.currentTarget.value);
            }
            if (e.key === 'Escape') {
              setEditingField(null);
            }
          }}
        />
      );
    }

    return (
      <div className="flex items-center justify-between group">
        <span className="text-sm">{value}</span>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
          onClick={() => setEditingField({ productId, field })}
        >
          <Icon name="Edit2" size={12} />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Каталог товаров</h1>
          
          {/* Navigation */}
          <nav className="flex space-x-1">
            {[
              { id: 'catalog', label: 'Каталог', icon: 'Package' },
              { id: 'search', label: 'Поиск', icon: 'Search' },
              { id: 'filters', label: 'Фильтры', icon: 'Filter' },
              { id: 'favorites', label: 'Избранное', icon: 'Heart' },
              { id: 'admin', label: 'Админка', icon: 'Settings' }
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <Icon name={tab.icon} size={16} />
                {tab.label}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {products.map(product => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-12 gap-6">
                    
                    {/* Product Images */}
                    <div className="col-span-3">
                      <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={product.images[product.currentImageIndex]}
                            alt={product.nameEn}
                            className="w-full h-full object-cover"
                          />
                          {product.images.length > 1 && (
                            <>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                onClick={() => handleImageNavigation(product.id, 'prev')}
                              >
                                <Icon name="ChevronLeft" size={16} />
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                onClick={() => handleImageNavigation(product.id, 'next')}
                              >
                                <Icon name="ChevronRight" size={16} />
                              </Button>
                            </>
                          )}
                        </div>
                        
                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                          <div className="flex gap-2">
                            {product.images.map((image, index) => (
                              <button
                                key={index}
                                className={`w-16 h-16 rounded border-2 overflow-hidden ${
                                  index === product.currentImageIndex 
                                    ? 'border-blue-500' 
                                    : 'border-gray-200'
                                }`}
                                onClick={() => setProducts(prev => prev.map(p => 
                                  p.id === product.id 
                                    ? { ...p, currentImageIndex: index }
                                    : p
                                ))}
                              >
                                <img
                                  src={image}
                                  alt={`${product.nameEn} ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="col-span-9 space-y-4">
                      
                      {/* Multi-language Names */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 w-16">
                            <span className="font-semibold text-sm">EN</span>
                            <span className="text-lg">🇺🇸</span>
                          </div>
                          <div className="flex-1">
                            <EditableField
                              productId={product.id}
                              field="nameEn"
                              value={product.nameEn}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 w-16">
                            <span className="font-semibold text-sm">CN</span>
                            <span className="text-lg">🇨🇳</span>
                          </div>
                          <div className="flex-1">
                            <EditableField
                              productId={product.id}
                              field="nameCn"
                              value={product.nameCn}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 w-16">
                            <span className="font-semibold text-sm">RU</span>
                            <span className="text-lg">🇷🇺</span>
                          </div>
                          <div className="flex-1">
                            <EditableField
                              productId={product.id}
                              field="nameRu"
                              value={product.nameRu}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Product Properties */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                            <span className="font-semibold text-sm w-20">Price</span>
                            <div className="flex-1">
                              <EditableField
                                productId={product.id}
                                field="price"
                                value={`$${product.price}`}
                                type="text"
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                            <span className="font-semibold text-sm w-20">SKU</span>
                            <div className="flex-1">
                              <EditableField
                                productId={product.id}
                                field="sku"
                                value={product.sku}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                            <span className="font-semibold text-sm w-20">Quantity</span>
                            <div className="flex-1">
                              <EditableField
                                productId={product.id}
                                field="quantity"
                                value={product.quantity}
                                type="number"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                            <span className="font-semibold text-sm w-20">Brand</span>
                            <div className="flex-1">
                              <EditableField
                                productId={product.id}
                                field="brand"
                                value={product.brand}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                            <span className="font-semibold text-sm w-20">Web Link</span>
                            <div className="flex-1">
                              <EditableField
                                productId={product.id}
                                field="webLink"
                                value={product.webLink}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                            <span className="font-semibold text-sm w-20">Category</span>
                            <div className="flex-1">
                              <EditableField
                                productId={product.id}
                                field="category"
                                value={product.category}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab !== 'catalog' && (
          <div className="text-center py-12">
            <Icon name="Construction" size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Раздел в разработке</h3>
            <p className="text-gray-500">Функционал "{activeTab}" будет добавлен в следующих версиях</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;