import React, { useState, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Product, Category, Language } from '@/types/product';
import { translations } from '@/utils/translations';
import LanguageToggle from '@/components/LanguageToggle';
import AddProductForm from '@/components/AddProductForm';
import ProductCatalog from '@/components/ProductCatalog';
import SearchAndFilters from '@/components/SearchAndFilters';
import ImageManager from '@/components/ImageManager';

const Index = () => {
  const [language, setLanguage] = useState<Language>('ru');
  const t = translations[language];
  
  // Sample data with products
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
      category: 'Electronics/Audio',
      images: ['/img/cf9d4e6b-0b84-40fa-8944-4ddf188a111f.jpg', '/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg'],
      currentImageIndex: 0,
      description: 'Премиум беспроводные наушники с активным шумоподавлением. Поддержка Hi-Res Audio и LDAC. Время работы до 30 часов. Быстрая зарядка - 3 минуты заряда дают 3 часа прослушивания. Совместимы с Google Assistant и Amazon Alexa. Часто задаваемые вопросы: Подходят ли для спорта? Да, имеют защиту от влаги IPX4. Можно ли подключить к двум устройствам одновременно? Да, поддерживается мультипоинт соединение.',
      tnved: '8518210000',
      material: 'Пластик, металл',
      purpose: 'Прослушивание музыки',
      forWhom: 'Взрослые'
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
      category: 'Electronics/Wearables',
      images: ['/img/c817e33c-f23e-46f9-8803-0e914e9017bd.jpg', '/img/cf9d4e6b-0b84-40fa-8944-4ddf188a111f.jpg'],
      currentImageIndex: 0,
      description: 'Умный фитнес-трекер с GPS и пульсометром. Отслеживает более 100 видов спорта. Водонепроницаемый корпус 5ATM. Мониторинг сна и стресса. Время работы до 14 дней.',
      tnved: '8517120000',
      material: 'Силикон, пластик',
      purpose: 'Фитнес-трекинг',
      forWhom: 'Спортсмены'
    },
    {
      id: '3',
      nameEn: 'Gaming Laptop',
      nameCn: '游戏笔记本电脑',
      nameRu: 'Игровой ноутбук',
      price: 1299.99,
      sku: 'GL-2024-RTX',
      quantity: 23,
      brand: 'GameTech',
      webLink: 'https://example.com/laptop',
      category: 'Electronics/Computers',
      images: ['/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg'],
      currentImageIndex: 0,
      description: 'Мощный игровой ноутбук с RTX 4060. Процессор Intel i7-13700H. 16GB RAM, 1TB SSD. Дисплей 15.6" 144Hz.',
      tnved: '8471300000',
      material: 'Алюминий, пластик',
      purpose: 'Игры и работа',
      forWhom: 'Геймеры'
    }
  ]);

  const [categories] = useState<Category[]>([
    {
      id: 'electronics',
      name: 'Electronics',
      children: [
        { id: 'audio', name: 'Audio' },
        { id: 'wearables', name: 'Wearables' },
        { id: 'computers', name: 'Computers' }
      ]
    },
    {
      id: 'clothing',
      name: 'Clothing',
      children: [
        { id: 'shirts', name: 'Shirts' },
        { id: 'pants', name: 'Pants' }
      ]
    },
    {
      id: 'home',
      name: 'Home & Garden'
    }
  ]);

  // State management
  const [editingField, setEditingField] = useState<{productId: string, field: string} | null>(null);
  const [activeTab, setActiveTab] = useState('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({min: 0, max: 2000});
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImageManager, setShowImageManager] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  
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
    tnved: '',
    material: '',
    purpose: '',
    forWhom: ''
  });

  // Get unique brands and categories
  const brands = useMemo(() => 
    [...new Set(products.map(p => p.brand))], [products]
  );

  const allCategories = useMemo(() => {
    const flatCategories: string[] = [];
    const traverse = (cats: Category[], prefix = '') => {
      cats.forEach(cat => {
        const fullPath = prefix ? `${prefix}/${cat.name}` : cat.name;
        flatCategories.push(fullPath);
        if (cat.children) {
          traverse(cat.children, fullPath);
        }
      });
    };
    traverse(categories);
    return flatCategories;
  }, [categories]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        product.nameEn.toLowerCase().includes(searchLower) ||
        product.nameCn.toLowerCase().includes(searchLower) ||
        product.nameRu.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower);

      // Brand filter
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.some(cat => product.category.includes(cat));

      // Price filter
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;

      return matchesSearch && matchesBrand && matchesCategory && matchesPrice;
    });
  }, [products, searchQuery, selectedBrands, selectedCategories, priceRange]);

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

  const handleFileUpload = (productId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        addImageToProduct(productId, imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageToProduct = (productId: string, imageUrl: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, images: [...product.images, imageUrl] }
        : product
    ));
  };

  const removeImageFromProduct = (productId: string, imageIndex: number) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const newImages = product.images.filter((_, index) => index !== imageIndex);
        // Ensure at least one image remains
        if (newImages.length === 0) {
          newImages.push('/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg');
        }
        // Adjust current image index if necessary
        const newCurrentIndex = product.currentImageIndex >= newImages.length 
          ? Math.max(0, newImages.length - 1)
          : product.currentImageIndex;
        
        return { 
          ...product, 
          images: newImages,
          currentImageIndex: newCurrentIndex
        };
      }
      return product;
    }));
  };

  const addImageByUrl = (productId: string) => {
    if (newImageUrl.trim()) {
      addImageToProduct(productId, newImageUrl.trim());
      setNewImageUrl('');
    }
  };

  const setCurrentImage = (productId: string, index: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, currentImageIndex: index }
        : p
    ));
  };

  const toggleBrandFilter = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleCategoryFilter = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleAddProduct = () => {
    if (newProduct.nameEn && newProduct.sku) {
      // Auto-generate Russian fields based on category and product type
      const getRussianFields = (category: string, nameEn: string) => {
        const categoryLower = category.toLowerCase();
        const nameLower = nameEn.toLowerCase();
        
        // Default ТН ВЭД codes and materials based on category
        if (categoryLower.includes('electronics')) {
          if (nameLower.includes('headphone') || nameLower.includes('audio')) {
            return {
              tnved: '8518210000',
              material: 'Пластик, металл',
              purpose: 'Прослушивание музыки',
              forWhom: 'Взрослые'
            };
          } else if (nameLower.includes('computer') || nameLower.includes('laptop')) {
            return {
              tnved: '8471300000',
              material: 'Алюминий, пластик',
              purpose: 'Вычислительные операции',
              forWhom: 'Пользователи ПК'
            };
          } else if (nameLower.includes('mouse')) {
            return {
              tnved: '8471609000',
              material: 'Пластик, резина',
              purpose: 'Управление компьютером',
              forWhom: 'Пользователи ПК'
            };
          } else if (nameLower.includes('tracker') || nameLower.includes('wearable')) {
            return {
              tnved: '8517120000',
              material: 'Силикон, пластик',
              purpose: 'Фитнес-трекинг',
              forWhom: 'Спортсмены'
            };
          } else {
            return {
              tnved: '8517620000',
              material: 'Пластик, металл',
              purpose: 'Электронное устройство',
              forWhom: 'Взрослые'
            };
          }
        } else if (categoryLower.includes('clothing')) {
          if (nameLower.includes('shirt') || nameLower.includes('t-shirt')) {
            return {
              tnved: '6109100000',
              material: '100% хлопок',
              purpose: 'Повседневная одежда',
              forWhom: 'Взрослые, унисекс'
            };
          } else if (nameLower.includes('pants') || nameLower.includes('trousers')) {
            return {
              tnved: '6203120000',
              material: 'Хлопок, полиэстер',
              purpose: 'Повседневная одежда',
              forWhom: 'Взрослые'
            };
          } else {
            return {
              tnved: '6109900000',
              material: 'Текстиль',
              purpose: 'Одежда',
              forWhom: 'Взрослые'
            };
          }
        } else if (categoryLower.includes('home')) {
          if (nameLower.includes('knife') || nameLower.includes('kitchen')) {
            return {
              tnved: '8211920000',
              material: 'Нержавеющая сталь',
              purpose: 'Приготовление пищи',
              forWhom: 'Повара, кулинары'
            };
          } else {
            return {
              tnved: '3924100000',
              material: 'Пластик, дерево',
              purpose: 'Бытовое использование',
              forWhom: 'Домохозяйства'
            };
          }
        }
        
        // Default fallback
        return {
          tnved: '9999999999',
          material: 'Смешанные материалы',
          purpose: 'Общее назначение',
          forWhom: 'Взрослые'
        };
      };
      
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 lg:px-6 py-4 shadow-sm backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 gap-4">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{t.title}</h1>
            <LanguageToggle language={language} onLanguageChange={setLanguage} />
            
            <AddProductForm
              showAddForm={showAddForm}
              setShowAddForm={setShowAddForm}
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              allCategories={allCategories}
              translations={t}
              onAddProduct={handleAddProduct}
            />
          </div>
          
          {/* Navigation */}
          <nav className="flex flex-wrap gap-1">
            {[
              { id: 'catalog', label: t.catalog, icon: 'Package' },
              { id: 'search', label: t.search, icon: 'Search' },
              { id: 'filters', label: t.filters, icon: 'Filter' },
              { id: 'favorites', label: t.favorites, icon: 'Heart' },
              { id: 'admin', label: t.admin, icon: 'Settings' }
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm"
              >
                <Icon name={tab.icon} size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
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
          onToggleBrandFilter={toggleBrandFilter}
          onToggleCategoryFilter={toggleCategoryFilter}
        />

        {/* Catalog Tab */}
        {activeTab === 'catalog' && (
          <ProductCatalog
            products={products}
            language={language}
            translations={t}
            editingField={editingField}
            setEditingField={setEditingField}
            onFieldEdit={handleFieldEdit}
            onImageNavigation={handleImageNavigation}
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
            onFileUpload={handleFileUpload}
            onAddImageByUrl={addImageByUrl}
            onRemoveImage={removeImageFromProduct}
            onSetCurrentImage={setCurrentImage}
          />
        ))}
      </main>
    </div>
  );
};

export default Index;