import React, { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  tnved?: string;
  material?: string;
  purpose?: string;
  forWhom?: string;
}

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

// Language translations
const translations = {
  ru: {
    title: 'Каталог товаров',
    addProduct: 'Добавить товар',
    catalog: 'Каталог',
    search: 'Поиск',
    filters: 'Фильтры',
    favorites: 'Избранное',
    admin: 'Админка',
    searchPlaceholder: 'Поиск по названию, SKU, бренду, категории...',
    found: 'Найдено',
    products: 'товаров',
    categories: 'Категории',
    brands: 'Бренды',
    price: 'Цена',
    from: 'От',
    to: 'До',
    shown: 'Показано',
    addNewProduct: 'Добавить новый товар',
    nameEn: 'Название (EN)',
    nameCn: 'Название (CN)',
    nameRu: 'Название (RU)',
    sku: 'SKU',
    quantity: 'Количество',
    brand: 'Бренд',
    category: 'Категория',
    webLink: 'Веб-ссылка',
    priceField: 'Цена',
    skuField: 'SKU',
    quantityField: 'Количество',
    brandField: 'Бренд',
    categoryField: 'Категория',
    webLinkField: 'Веб-ссылка',
    cancel: 'Отмена',
    add: 'Добавить',
    photos: 'фото',
    imageManagement: 'Управление изображениями',
    addImages: 'Добавить изображения',
    uploadFile: 'Загрузить файл',
    byLink: 'По ссылке',
    dragDrop: 'Перетащите изображение сюда или нажмите для выбора',
    selectFile: 'Выбрать файл',
    currentImages: 'Текущие изображения',
    main: 'Главное',
    inDevelopment: 'Раздел в разработке',
    functionalityWillBeAdded: 'будет добавлен в следующих версиях',
    tnved: 'ТН ВЭД',
    material: 'Материал',
    purpose: 'Предназначение',
    forWhom: 'Для кого'
  },
  cn: {
    title: '产品目录',
    addProduct: '添加产品',
    catalog: '目录',
    search: '搜索',
    filters: '筛选',
    favorites: '收藏',
    admin: '管理',
    searchPlaceholder: '按名称、SKU、品牌、类别搜索...',
    found: '找到',
    products: '产品',
    categories: '类别',
    brands: '品牌',
    price: '价格',
    from: '从',
    to: '到',
    shown: '显示',
    addNewProduct: '添加新产品',
    nameEn: '名称 (英文)',
    nameCn: '名称 (中文)',
    nameRu: '名称 (俄文)',
    sku: 'SKU',
    quantity: '数量',
    brand: '品牌',
    category: '类别',
    webLink: '网站链接',
    priceField: '价格',
    skuField: 'SKU',
    quantityField: '数量',
    brandField: '品牌',
    categoryField: '类别',
    webLinkField: '网站链接',
    cancel: '取消',
    add: '添加',
    photos: '张照片',
    imageManagement: '图片管理',
    addImages: '添加图片',
    uploadFile: '上传文件',
    byLink: '通过链接',
    dragDrop: '将图片拖到这里或点击选择',
    selectFile: '选择文件',
    currentImages: '当前图片',
    main: '主要',
    inDevelopment: '功能开发中',
    functionalityWillBeAdded: '将在后续版本中添加'
  }
};

type Language = 'ru' | 'cn';

const Index = () => {
  const [language, setLanguage] = useState<Language>('ru');
  const t = translations[language];
  // Sample data with more products
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
      tnved: '8471300000',
      material: 'Алюминий, пластик',
      purpose: 'Игры и работа',
      forWhom: 'Геймеры'
    },
    {
      id: '4',
      nameEn: 'Wireless Mouse',
      nameCn: '无线鼠标',
      nameRu: 'Беспроводная компьютерная мышь',
      price: 89.99,
      sku: 'WM-2024-RGB',
      quantity: 156,
      brand: 'TechMouse',
      webLink: 'https://example.com/mouse',
      category: 'Electronics/Computers',
      images: ['/img/c817e33c-f23e-46f9-8803-0e914e9017bd.jpg'],
      currentImageIndex: 0,
      tnved: '8471609000',
      material: 'Пластик, резина',
      purpose: 'Управление компьютером',
      forWhom: 'Пользователи ПК'
    },
    {
      id: '5',
      nameEn: 'Cotton T-Shirt',
      nameCn: '棉质T恤',
      nameRu: 'Хлопчатобумажная футболка',
      price: 29.99,
      sku: 'CT-2024-BLU',
      quantity: 89,
      brand: 'ComfortWear',
      webLink: 'https://example.com/tshirt',
      category: 'Clothing/Shirts',
      images: ['/img/cf9d4e6b-0b84-40fa-8944-4ddf188a111f.jpg'],
      currentImageIndex: 0,
      tnved: '6109100000',
      material: '100% хлопок',
      purpose: 'Повседневная одежда',
      forWhom: 'Взрослые, унисекс'
    },
    {
      id: '6',
      nameEn: 'Kitchen Knife Set',
      nameCn: '厨房刀具套装',
      nameRu: 'Набор кухонных ножей',
      price: 199.99,
      sku: 'KS-2024-PRO',
      quantity: 34,
      brand: 'ChefPro',
      webLink: 'https://example.com/knives',
      category: 'Home & Garden',
      images: ['/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg'],
      currentImageIndex: 0,
      tnved: '8211920000',
      material: 'Нержавеющая сталь, дерево',
      purpose: 'Приготовление пищи',
      forWhom: 'Повара, кулинары'
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
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const LanguageToggle = () => (
    <div className="flex items-center gap-2">
      <Button
        variant={language === 'ru' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('ru')}
        className="flex items-center gap-1"
      >
        🇷🇺 RU
      </Button>
      <Button
        variant={language === 'cn' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('cn')}
        className="flex items-center gap-1"
      >
        🇨🇳 CN
      </Button>
    </div>
  );
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
        tnved: '',
        material: '',
        purpose: '',
        forWhom: ''
      });
      setShowAddForm(false);
    }
  };

  // Image management functions
  const handleFileUpload = (productId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          addImageToProduct(productId, result);
        }
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

  const CategoryTree = ({ categories, level = 0 }: { categories: Category[], level?: number }) => (
    <div className={`space-y-2 ${level > 0 ? 'ml-4' : ''}`}>
      {categories.map(category => (
        <div key={category.id} className="space-y-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={category.id}
              checked={selectedCategories.includes(category.name)}
              onCheckedChange={() => toggleCategoryFilter(category.name)}
            />
            <Label htmlFor={category.id} className="text-sm font-medium">
              {category.name}
            </Label>
          </div>
          {category.children && (
            <CategoryTree categories={category.children} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );

  const ImageManager = ({ productId }: { productId: string }) => {
    const product = products.find(p => p.id === productId);
    if (!product) return null;

    return (
      <Dialog open={showImageManager === productId} onOpenChange={() => setShowImageManager(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.imageManagement} - {product.nameEn}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Add Images Section */}
            <div className="space-y-4">
              <h4 className="font-semibold">{t.addImages}</h4>
              
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">{t.uploadFile}</TabsTrigger>
                  <TabsTrigger value="url">{t.byLink}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(productId, e)}
                      className="hidden"
                    />
                    <Icon name="Upload" size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">{t.dragDrop}</p>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                    >
                      {t.selectFile}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="url" className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={() => addImageByUrl(productId)}>
                      <Icon name="Plus" size={16} />
                      {t.add}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Current Images */}
            <div className="space-y-4">
              <h4 className="font-semibold">{t.currentImages} ({product.images.length})</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      index === product.currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}>
                      <img
                        src={image}
                        alt={`${product.nameEn} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Image Controls */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setProducts(prev => prev.map(p => 
                          p.id === productId 
                            ? { ...p, currentImageIndex: index }
                            : p
                        ))}
                        disabled={index === product.currentImageIndex}
                      >
                        <Icon name="Eye" size={14} />
                      </Button>
                      
                      {product.images.length > 1 && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeImageFromProduct(productId, index)}
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      )}
                    </div>
                    
                    {/* Main Image Badge */}
                    {index === product.currentImageIndex && (
                      <Badge className="absolute top-2 left-2">
                        {t.main}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 gap-4">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{t.title}</h1>
            <LanguageToggle />
            
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Icon name="Plus" size={16} />
                  {t.addProduct}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t.addNewProduct}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nameEn">{t.nameEn}</Label>
                      <Input
                        id="nameEn"
                        value={newProduct.nameEn}
                        onChange={(e) => setNewProduct(prev => ({...prev, nameEn: e.target.value}))}
                        placeholder="Product name in English"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nameCn">{t.nameCn}</Label>
                      <Input
                        id="nameCn"
                        value={newProduct.nameCn}
                        onChange={(e) => setNewProduct(prev => ({...prev, nameCn: e.target.value}))}
                        placeholder="产品名称"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="nameRu">{t.nameRu}</Label>
                    <Input
                      id="nameRu"
                      value={newProduct.nameRu}
                      onChange={(e) => setNewProduct(prev => ({...prev, nameRu: e.target.value}))}
                      placeholder="Название товара"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">{t.price}</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct(prev => ({...prev, price: Number(e.target.value)}))}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">{t.sku}</Label>
                      <Input
                        id="sku"
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct(prev => ({...prev, sku: e.target.value}))}
                        placeholder="PRODUCT-001"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantity">{t.quantity}</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct(prev => ({...prev, quantity: Number(e.target.value)}))}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand">{t.brand}</Label>
                      <Input
                        id="brand"
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct(prev => ({...prev, brand: e.target.value}))}
                        placeholder="Brand Name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">{t.category}</Label>
                      <Select 
                        value={newProduct.category} 
                        onValueChange={(value) => setNewProduct(prev => ({...prev, category: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`${t.category}...`} />
                        </SelectTrigger>
                        <SelectContent>
                          {allCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="webLink">{t.webLink}</Label>
                      <Input
                        id="webLink"
                        value={newProduct.webLink}
                        onChange={(e) => setNewProduct(prev => ({...prev, webLink: e.target.value}))}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  {/* Russian fields section */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold text-sm text-gray-700 mb-3">Российские сертификаты</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tnved">{t.tnved}</Label>
                        <Input
                          id="tnved"
                          value={newProduct.tnved || ''}
                          onChange={(e) => setNewProduct(prev => ({...prev, tnved: e.target.value}))}
                          placeholder="8471300000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="material">{t.material}</Label>
                        <Input
                          id="material"
                          value={newProduct.material || ''}
                          onChange={(e) => setNewProduct(prev => ({...prev, material: e.target.value}))}
                          placeholder="Пластик, металл"
                        />
                      </div>
                      <div>
                        <Label htmlFor="purpose">{t.purpose}</Label>
                        <Input
                          id="purpose"
                          value={newProduct.purpose || ''}
                          onChange={(e) => setNewProduct(prev => ({...prev, purpose: e.target.value}))}
                          placeholder="Предназначение товара"
                        />
                      </div>
                      <div>
                        <Label htmlFor="forWhom">{t.forWhom}</Label>
                        <Input
                          id="forWhom"
                          value={newProduct.forWhom || ''}
                          onChange={(e) => setNewProduct(prev => ({...prev, forWhom: e.target.value}))}
                          placeholder="Взрослые"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      {t.cancel}
                    </Button>
                    <Button onClick={handleAddProduct}>
                      {t.add} {t.products.slice(0, -2)}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
        
        {/* Search Tab */}
        {activeTab === 'search' && (
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
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 w-16">
                              <div className="w-6 h-4 bg-red-500 relative rounded-sm overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-white to-red-500"></div>
                                <div className="absolute top-0 left-0 w-2 h-2 bg-blue-600"></div>
                                <span className="text-xs font-bold text-white absolute top-0 left-1">US</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <span className="text-sm">{product.nameEn}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 w-16">
                              <div className="w-6 h-4 bg-red-500 relative rounded-sm overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-4 bg-red-600"></div>
                                <span className="text-xs font-bold text-yellow-400 absolute top-0 left-2">CN</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <span className="text-sm">{product.nameCn}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 w-16">
                              <div className="w-6 h-4 relative rounded-sm overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
                                <div className="absolute top-1 left-0 w-full h-1 bg-blue-600"></div>
                                <div className="absolute top-2 left-0 w-full h-1 bg-red-600"></div>
                                <span className="text-xs font-bold text-white absolute top-0 left-1">RU</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <span className="text-sm">{product.nameRu}</span>
                            </div>
                          </div>
                        </div>

                        {/* Product Properties */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500">Цена</span>
                            <span className="font-semibold">${product.price}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500">SKU</span>
                            <span className="font-semibold">{product.sku}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500">Бренд</span>
                            <span className="font-semibold">{product.brand}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Filters Tab */}
        {activeTab === 'filters' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="col-span-1 lg:col-span-1 space-y-6">
              {/* Category Filter */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">{t.categories}</h3>
                </CardHeader>
                <CardContent>
                  <CategoryTree categories={categories} />
                </CardContent>
              </Card>

              {/* Brand Filter */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">{t.brands}</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrandFilter(brand)}
                        />
                        <Label htmlFor={brand} className="text-sm">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Price Filter */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">{t.price}</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                              <div className="w-6 h-4 bg-red-500 relative rounded-sm overflow-hidden flex-shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-white to-red-500"></div>
                                <div className="absolute top-0 left-0 w-2 h-2 bg-blue-600"></div>
                                <span className="text-xs font-bold text-white absolute top-0 left-1">US</span>
                              </div>
                              <span className="font-semibold">{product.nameEn}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-4 bg-red-500 relative rounded-sm overflow-hidden flex-shrink-0">
                                <div className="absolute top-0 left-0 w-2 h-4 bg-red-600"></div>
                                <span className="text-xs font-bold text-yellow-400 absolute top-0 left-2">CN</span>
                              </div>
                              <span className="text-sm text-gray-600">{product.nameCn}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-4 relative rounded-sm overflow-hidden flex-shrink-0">
                                <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
                                <div className="absolute top-1 left-0 w-full h-1 bg-blue-600"></div>
                                <div className="absolute top-2 left-0 w-full h-1 bg-red-600"></div>
                                <span className="text-xs font-bold text-white absolute top-0 left-1">RU</span>
                              </div>
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
        )}

        {/* Catalog Tab */}
        {activeTab === 'catalog' && (
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
                          
                          {/* Image Management Button */}
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute bottom-2 right-2 h-8 w-8 p-0"
                            onClick={() => setShowImageManager(product.id)}
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
                        
                        {/* Image Count Badge */}
                        <Badge variant="outline" className="text-xs">
                          {product.images.length} {t.photos}
                        </Badge>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="order-2 lg:order-2 col-span-1 lg:col-span-9 space-y-4">
                      
                      {/* Multi-language Names */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 w-16">
                            <div className="w-6 h-4 bg-red-500 relative rounded-sm overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-white to-red-500"></div>
                              <div className="absolute top-0 left-0 w-2 h-2 bg-blue-600"></div>
                              <span className="text-xs font-bold text-white absolute top-0 left-1">US</span>
                            </div>
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
                            <div className="w-6 h-4 bg-red-500 relative rounded-sm overflow-hidden">
                              <div className="absolute top-0 left-0 w-2 h-4 bg-red-600"></div>
                              <span className="text-xs font-bold text-yellow-400 absolute top-0 left-2">CN</span>
                            </div>
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
                            <div className="w-6 h-4 relative rounded-sm overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
                              <div className="absolute top-1 left-0 w-full h-1 bg-blue-600"></div>
                              <div className="absolute top-2 left-0 w-full h-1 bg-red-600"></div>
                              <span className="text-xs font-bold text-white absolute top-0 left-1">RU</span>
                            </div>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                            <span className="font-semibold text-sm w-20">{t.priceField}</span>
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
                            <span className="font-semibold text-sm w-20">{t.skuField}</span>
                            <div className="flex-1">
                              <EditableField
                                productId={product.id}
                                field="sku"
                                value={product.sku}
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
                                type="number"
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
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                            <span className="font-semibold text-sm w-20">{t.categoryField}</span>
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

                      {/* Russian-specific fields */}
                      {language === 'ru' && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-semibold text-sm text-gray-700 mb-3">Российские сертификаты</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                                <span className="font-semibold text-sm w-20">{t.tnved}</span>
                                <div className="flex-1">
                                  <EditableField
                                    productId={product.id}
                                    field="tnved"
                                    value={product.tnved || ''}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                                <span className="font-semibold text-sm w-20">{t.material}</span>
                                <div className="flex-1">
                                  <EditableField
                                    productId={product.id}
                                    field="material"
                                    value={product.material || ''}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                                <span className="font-semibold text-sm w-20">{t.purpose}</span>
                                <div className="flex-1">
                                  <EditableField
                                    productId={product.id}
                                    field="purpose"
                                    value={product.purpose || ''}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                                <span className="font-semibold text-sm w-20">{t.forWhom}</span>
                                <div className="flex-1">
                                  <EditableField
                                    productId={product.id}
                                    field="forWhom"
                                    value={product.forWhom || ''}
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
          <ImageManager key={`manager-${product.id}`} productId={product.id} />
        ))}
      </main>
    </div>
  );
};

export default Index;