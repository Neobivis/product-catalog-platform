import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Моковые данные для демонстрации
const mockProducts = [
  {
    id: 1,
    name_ru: "Смартфон Galaxy S24",
    name_en: "Galaxy S24 Smartphone", 
    name_cn: "Galaxy S24 智能手机",
    price: 85000,
    currency: "RUB",
    category: "Электроника",
    brand: "Samsung",
    model: "Galaxy S24",
    availability: true,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300",
    description_ru: "Флагманский смартфон с камерой 200MP",
    description_en: "Flagship smartphone with 200MP camera",
    description_cn: "配备 200MP 摄像头的旗舰智能手机"
  },
  {
    id: 2,
    name_ru: "Ноутбук MacBook Pro",
    name_en: "MacBook Pro Laptop",
    name_cn: "MacBook Pro 笔记本电脑",
    price: 180000,
    currency: "RUB", 
    category: "Компьютеры",
    brand: "Apple",
    model: "MacBook Pro 14",
    availability: true,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300",
    description_ru: "Профессиональный ноутбук для разработчиков",
    description_en: "Professional laptop for developers",
    description_cn: "面向开发者的专业笔记本电脑"
  },
  {
    id: 3,
    name_ru: "Наушники AirPods Pro",
    name_en: "AirPods Pro Headphones",
    name_cn: "AirPods Pro 耳机",
    price: 25000,
    currency: "RUB",
    category: "Аудио",
    brand: "Apple", 
    model: "AirPods Pro 2",
    availability: false,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300",
    description_ru: "Беспроводные наушники с шумоподавлением",
    description_en: "Wireless headphones with noise cancellation", 
    description_cn: "具有降噪功能的无线耳机"
  }
];

const mockCategories = [
  { id: 1, name: "Электроника", count: 150 },
  { id: 2, name: "Компьютеры", count: 89 },
  { id: 3, name: "Аудио", count: 45 },
  { id: 4, name: "Смартфоны", count: 76 }
];

const TemplateIndex: React.FC = () => {
  const [language, setLanguage] = useState<'ru' | 'en' | 'cn'>('ru');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const getProductName = (product: typeof mockProducts[0]) => {
    switch (language) {
      case 'en': return product.name_en;
      case 'cn': return product.name_cn;
      default: return product.name_ru;
    }
  };

  const getProductDescription = (product: typeof mockProducts[0]) => {
    switch (language) {
      case 'en': return product.description_en;
      case 'cn': return product.description_cn;
      default: return product.description_ru;
    }
  };

  const translations = {
    ru: {
      title: "Каталог товаров",
      search: "Поиск товаров...",
      categories: "Категории",
      filters: "Фильтры",
      allCategories: "Все категории",
      price: "Цена",
      inStock: "В наличии",
      outOfStock: "Нет в наличии",
      viewProduct: "Смотреть",
      addToCart: "В корзину"
    },
    en: {
      title: "Product Catalog",
      search: "Search products...",
      categories: "Categories", 
      filters: "Filters",
      allCategories: "All categories",
      price: "Price",
      inStock: "In stock",
      outOfStock: "Out of stock",
      viewProduct: "View",
      addToCart: "Add to cart"
    },
    cn: {
      title: "产品目录",
      search: "搜索产品...",
      categories: "类别",
      filters: "筛选器",
      allCategories: "所有类别", 
      price: "价格",
      inStock: "有库存",
      outOfStock: "缺货",
      viewProduct: "查看",
      addToCart: "添加到购物车"
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
            </div>
            
            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <Button
                variant={language === 'ru' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('ru')}
              >
                RU
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('en')}
              >
                EN
              </Button>
              <Button
                variant={language === 'cn' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('cn')}
              >
                中文
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-1 relative">
              <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Icon name="Filter" size={18} />
              <span>{t.filters}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Icon name="Layers" className="mr-2" size={18} />
                  {t.categories}
                </h3>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === '' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory('')}
                  >
                    {t.allCategories}
                  </Button>
                  {mockCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.name ? 'default' : 'ghost'}
                      className="w-full justify-between"
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="ml-2">
                        {category.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Filters Card */}
            {showFilters && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">{t.filters}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t.price}</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Любая цена" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-10000">0 - 10,000 ₽</SelectItem>
                          <SelectItem value="10000-50000">10,000 - 50,000 ₽</SelectItem>
                          <SelectItem value="50000+">50,000+ ₽</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={getProductName(product)}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {!product.availability && (
                      <Badge variant="destructive" className="absolute top-2 right-2">
                        {t.outOfStock}
                      </Badge>
                    )}
                    {product.availability && (
                      <Badge variant="default" className="absolute top-2 right-2">
                        {t.inStock}
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {getProductName(product)}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {getProductDescription(product)}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline">{product.category}</Badge>
                      <span className="text-xs text-gray-500">{product.brand}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-blue-600">
                        {product.price.toLocaleString()} {product.currency}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Icon name="Eye" size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          disabled={!product.availability}
                        >
                          <Icon name="ShoppingCart" size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <Button variant="outline" disabled>
                  <Icon name="ChevronLeft" size={16} />
                </Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">
                  <Icon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateIndex;