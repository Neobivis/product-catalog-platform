import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { Product, Category, Language } from '@/types/product';

interface SearchAndFiltersProps {
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
  language: Language;
  translations: any;
  onToggleBrandFilter: (brand: string) => void;
  onToggleCategoryFilter: (category: string) => void;
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

const CategoryTree: React.FC<{ 
  categories: Category[], 
  level?: number,
  selectedCategories: string[],
  onToggleCategoryFilter: (category: string) => void
}> = ({ categories, level = 0, selectedCategories, onToggleCategoryFilter }) => (
  <div className={`space-y-2 ${level > 0 ? 'ml-4' : ''}`}>
    {categories.map(category => (
      <div key={category.id} className="space-y-1">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={category.id}
            checked={selectedCategories.includes(category.name)}
            onCheckedChange={() => onToggleCategoryFilter(category.name)}
          />
          <Label htmlFor={category.id} className="text-sm font-medium">
            {category.name}
          </Label>
        </div>
        {category.children && (
          <CategoryTree 
            categories={category.children} 
            level={level + 1} 
            selectedCategories={selectedCategories}
            onToggleCategoryFilter={onToggleCategoryFilter}
          />
        )}
      </div>
    ))}
  </div>
);

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
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
  language,
  translations: t,
  onToggleBrandFilter,
  onToggleCategoryFilter
}) => {
  if (activeTab === 'search') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">{t.search} {t.products}</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Icon name="Search" size={16} />
            </Button>
          </div>
          {searchQuery && (
            <div className="mt-4">
              <Badge variant="secondary">
                {t.found}: {filteredProducts.length} {t.products}
              </Badge>
            </div>
          )}
        </div>
        
        {/* Search Results */}
        <div className="space-y-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-12 gap-6">
                  
                  {/* Product Images */}
                  <div className="col-span-1 lg:col-span-3">
                    <div className="space-y-4">
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={product.images[product.currentImageIndex]}
                          alt={product.nameEn}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="col-span-1 lg:col-span-9 space-y-4">
                    
                    {/* Multi-language Names */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <FlagIcon country="us" />
                        <span className="font-semibold">{product.nameEn}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FlagIcon country="cn" />
                        <span className="text-sm text-gray-600">{product.nameCn}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FlagIcon country="ru" />
                        <span className="text-sm text-gray-600">{product.nameRu}</span>
                      </div>
                    </div>

                    {/* Product Properties */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <span className="text-xs text-gray-500">Цена</span>
                        <div className="font-semibold text-lg">${product.price}</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Количество</span>
                        <div className="font-semibold">{product.quantity} шт.</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Категория</span>
                        <div className="font-semibold">{product.category}</div>
                      </div>
                    </div>

                    {/* Russian-specific fields */}
                    {language === 'ru' && (
                      <div className="border-t pt-4 mt-4">
                        <h4 className="font-semibold text-sm text-gray-700 mb-3">Российские сертификаты</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {product.tnved && (
                            <div>
                              <span className="text-xs text-gray-500">{t.tnved}</span>
                              <div className="font-semibold">{product.tnved}</div>
                            </div>
                          )}
                          {product.material && (
                            <div>
                              <span className="text-xs text-gray-500">{t.material}</span>
                              <div className="font-semibold">{product.material}</div>
                            </div>
                          )}
                          {product.purpose && (
                            <div>
                              <span className="text-xs text-gray-500">{t.purpose}</span>
                              <div className="font-semibold">{product.purpose}</div>
                            </div>
                          )}
                          {product.forWhom && (
                            <div>
                              <span className="text-xs text-gray-500">{t.forWhom}</span>
                              <div className="font-semibold">{product.forWhom}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'filters') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          {/* Categories Filter */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">{t.categories}</h3>
            </CardHeader>
            <CardContent>
              <CategoryTree 
                categories={categories} 
                selectedCategories={selectedCategories}
                onToggleCategoryFilter={onToggleCategoryFilter}
              />
            </CardContent>
          </Card>

          {/* Brands Filter */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">{t.brands}</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {brands.map(brand => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => onToggleBrandFilter(brand)}
                    />
                    <Label htmlFor={`brand-${brand}`} className="text-sm">
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Price Range Filter */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">{t.price}</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="minPrice" className="text-xs">{t.from}</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({...prev, min: Number(e.target.value)}))}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPrice" className="text-xs">{t.to}</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({...prev, max: Number(e.target.value)}))}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filter Results */}
          <div>
            <Badge variant="outline" className="text-sm">
              {t.shown}: {filteredProducts.length} {t.products}
            </Badge>
          </div>
        </div>

        {/* Filtered Products */}
        <div className="col-span-1 lg:col-span-3">
          <div className="space-y-6">
            {filteredProducts.map(product => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-12 gap-6">
                    
                    {/* Product Images */}
                    <div className="col-span-1 lg:col-span-4">
                      <div className="space-y-4">
                        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={product.images[product.currentImageIndex]}
                            alt={product.nameEn}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="col-span-1 lg:col-span-8 space-y-4">
                      
                      {/* Multi-language Names */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <FlagIcon country="us" />
                          <span className="font-semibold">{product.nameEn}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FlagIcon country="cn" />
                          <span className="text-sm text-gray-600">{product.nameCn}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FlagIcon country="ru" />
                          <span className="text-sm text-gray-600">{product.nameRu}</span>
                        </div>
                      </div>

                      {/* Product Properties */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <span className="text-xs text-gray-500">Цена</span>
                          <div className="font-semibold text-lg">${product.price}</div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Количество</span>
                          <div className="font-semibold">{product.quantity} шт.</div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Категория</span>
                          <div className="font-semibold">{product.category}</div>
                        </div>
                      </div>

                      {/* Russian-specific fields */}
                      {language === 'ru' && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-semibold text-sm text-gray-700 mb-3">Российские сертификаты</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {product.tnved && (
                              <div>
                                <span className="text-xs text-gray-500">{t.tnved}</span>
                                <div className="font-semibold">{product.tnved}</div>
                              </div>
                            )}
                            {product.material && (
                              <div>
                                <span className="text-xs text-gray-500">{t.material}</span>
                                <div className="font-semibold">{product.material}</div>
                              </div>
                            )}
                            {product.purpose && (
                              <div>
                                <span className="text-xs text-gray-500">{t.purpose}</span>
                                <div className="font-semibold">{product.purpose}</div>
                              </div>
                            )}
                            {product.forWhom && (
                              <div>
                                <span className="text-xs text-gray-500">{t.forWhom}</span>
                                <div className="font-semibold">{product.forWhom}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SearchAndFilters;