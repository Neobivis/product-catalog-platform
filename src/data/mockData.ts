import { Product, Category } from '@/types/product';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    icon: 'Laptop',
    children: [
      {
        id: '1-1',
        name: 'Audio',
        icon: 'Headphones',
        children: [
          { id: '1-1-1', name: 'Headphones', icon: 'Headphones' },
          { id: '1-1-2', name: 'Speakers', icon: 'Volume2' },
          { id: '1-1-3', name: 'Microphones', icon: 'Mic' }
        ]
      },
      {
        id: '1-2',
        name: 'Computers',
        icon: 'Monitor',
        children: [
          { id: '1-2-1', name: 'Laptops', icon: 'Laptop' },
          { id: '1-2-2', name: 'Desktops', icon: 'Monitor' },
          { id: '1-2-3', name: 'Tablets', icon: 'Tablet' }
        ]
      },
      {
        id: '1-3',
        name: 'Mobile',
        icon: 'Smartphone',
        children: [
          { id: '1-3-1', name: 'Smartphones', icon: 'Smartphone' },
          { id: '1-3-2', name: 'Accessories', icon: 'Cable' }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Clothing',
    icon: 'Shirt',
    children: [
      {
        id: '2-1',
        name: 'Men',
        icon: 'User',
        children: [
          { id: '2-1-1', name: 'Shirts', icon: 'Shirt' },
          { id: '2-1-2', name: 'Pants', icon: 'Package' },
          { id: '2-1-3', name: 'Shoes', icon: 'Package' }
        ]
      },
      {
        id: '2-2',
        name: 'Women',
        icon: 'User',
        children: [
          { id: '2-2-1', name: 'Dresses', icon: 'Package' },
          { id: '2-2-2', name: 'Tops', icon: 'Shirt' },
          { id: '2-2-3', name: 'Shoes', icon: 'Package' }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Home & Garden',
    icon: 'Home',
    children: [
      {
        id: '3-1',
        name: 'Furniture',
        icon: 'Package',
        children: [
          { id: '3-1-1', name: 'Living Room', icon: 'Sofa' },
          { id: '3-1-2', name: 'Bedroom', icon: 'Bed' },
          { id: '3-1-3', name: 'Kitchen', icon: 'ChefHat' }
        ]
      },
      {
        id: '3-2',
        name: 'Garden',
        icon: 'TreePine',
        children: [
          { id: '3-2-1', name: 'Tools', icon: 'Wrench' },
          { id: '3-2-2', name: 'Plants', icon: 'Leaf' }
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'Sports',
    icon: 'Dumbbell',
    children: [
      {
        id: '4-1',
        name: 'Fitness',
        icon: 'Dumbbell',
        children: [
          { id: '4-1-1', name: 'Equipment', icon: 'Dumbbell' },
          { id: '4-1-2', name: 'Clothing', icon: 'Shirt' }
        ]
      },
      {
        id: '4-2',
        name: 'Outdoor',
        icon: 'Mountain',
        children: [
          { id: '4-2-1', name: 'Camping', icon: 'Tent' },
          { id: '4-2-2', name: 'Hiking', icon: 'Mountain' }
        ]
      }
    ]
  }
];

export const products: Product[] = [
  // Electronics > Audio > Headphones
  {
    id: '1',
    name: 'Sony WH-1000XM4 Беспроводные наушники',
    description: 'Наушники с активным шумоподавлением и поддержкой Hi-Res Audio',
    price: 24990,
    originalPrice: 29990,
    category: 'Electronics/Audio/Headphones',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
    stock: 15,
    rating: 4.8,
    reviews: 245
  },
  {
    id: '2',
    name: 'Apple AirPods Pro (2-го поколения)',
    description: 'Беспроводные наушники с активным шумоподавлением',
    price: 22990,
    category: 'Electronics/Audio/Headphones',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop',
    stock: 8,
    rating: 4.7,
    reviews: 189
  },
  {
    id: '3',
    name: 'Bose QuietComfort 45',
    description: 'Комфортные наушники с превосходным шумоподавлением',
    price: 27990,
    category: 'Electronics/Audio/Headphones',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
    stock: 12,
    rating: 4.6,
    reviews: 156
  },

  // Electronics > Audio > Speakers
  {
    id: '4',
    name: 'JBL Charge 5 Портативная колонка',
    description: 'Водонепроницаемая Bluetooth-колонка с мощным звуком',
    price: 9990,
    originalPrice: 12990,
    category: 'Electronics/Audio/Speakers',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    stock: 25,
    rating: 4.5,
    reviews: 312
  },
  {
    id: '5',
    name: 'Sonos One (Gen 2)',
    description: 'Умная колонка с голосовым управлением и Hi-Fi звуком',
    price: 19990,
    category: 'Electronics/Audio/Speakers',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop',
    stock: 7,
    rating: 4.7,
    reviews: 98
  },

  // Electronics > Computers > Laptops
  {
    id: '6',
    name: 'MacBook Air M2 13" 2022',
    description: 'Ультрабук Apple с процессором M2 и дисплеем Liquid Retina',
    price: 129990,
    originalPrice: 139990,
    category: 'Electronics/Computers/Laptops',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
    stock: 5,
    rating: 4.9,
    reviews: 67
  },
  {
    id: '7',
    name: 'Dell XPS 13 Plus',
    description: 'Премиальный ультрабук с процессором Intel Core i7',
    price: 119990,
    category: 'Electronics/Computers/Laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    stock: 3,
    rating: 4.6,
    reviews: 43
  },

  // Electronics > Mobile > Smartphones
  {
    id: '8',
    name: 'iPhone 14 Pro 128GB',
    description: 'Смартфон Apple с камерой Pro и дисплеем ProMotion',
    price: 89990,
    originalPrice: 99990,
    category: 'Electronics/Mobile/Smartphones',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    stock: 12,
    rating: 4.8,
    reviews: 234
  },
  {
    id: '9',
    name: 'Samsung Galaxy S23 Ultra',
    description: 'Флагманский смартфон Samsung с S Pen и камерой 200 МП',
    price: 94990,
    category: 'Electronics/Mobile/Smartphones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    stock: 8,
    rating: 4.7,
    reviews: 178
  },

  // Clothing > Men > Shirts
  {
    id: '10',
    name: 'Классическая белая рубашка',
    description: 'Хлопковая рубашка прямого кроя для офиса и повседневной носки',
    price: 2990,
    originalPrice: 3990,
    category: 'Clothing/Men/Shirts',
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=400&fit=crop',
    stock: 20,
    rating: 4.3,
    reviews: 89
  },
  {
    id: '11',
    name: 'Джинсовая рубашка',
    description: 'Стильная джинсовая рубашка из плотного денима',
    price: 4990,
    category: 'Clothing/Men/Shirts',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop',
    stock: 15,
    rating: 4.4,
    reviews: 56
  },

  // Clothing > Women > Dresses
  {
    id: '12',
    name: 'Летнее платье миди',
    description: 'Легкое платье из натурального хлопка с цветочным принтом',
    price: 5990,
    originalPrice: 7990,
    category: 'Clothing/Women/Dresses',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop',
    stock: 18,
    rating: 4.6,
    reviews: 124
  },
  {
    id: '13',
    name: 'Коктейльное платье',
    description: 'Элегантное черное платье для особых случаев',
    price: 8990,
    category: 'Clothing/Women/Dresses',
    image: 'https://images.unsplash.com/photo-1566479179817-1d1c6e23e7d6?w=400&h=400&fit=crop',
    stock: 6,
    rating: 4.7,
    reviews: 78
  },

  // Home & Garden > Furniture > Living Room
  {
    id: '14',
    name: 'Модульный диван IKEA',
    description: 'Комфортный трехместный диван с возможностью трансформации',
    price: 49990,
    originalPrice: 59990,
    category: 'Home & Garden/Furniture/Living Room',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    stock: 4,
    rating: 4.5,
    reviews: 92
  },
  {
    id: '15',
    name: 'Журнальный столик',
    description: 'Стеклянный столик с металлическими ножками',
    price: 12990,
    category: 'Home & Garden/Furniture/Living Room',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    stock: 9,
    rating: 4.2,
    reviews: 34
  },

  // Sports > Fitness > Equipment
  {
    id: '16',
    name: 'Набор гантелей 2x10 кг',
    description: 'Разборные гантели с обрезиненным покрытием',
    price: 7990,
    category: 'Sports/Fitness/Equipment',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    stock: 11,
    rating: 4.4,
    reviews: 67
  },
  {
    id: '17',
    name: 'Коврик для йоги',
    description: 'Противоскользящий коврик из натурального каучука',
    price: 2990,
    originalPrice: 3990,
    category: 'Sports/Fitness/Equipment',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    stock: 30,
    rating: 4.6,
    reviews: 145
  },

  // Дополнительные товары для тестирования пагинации
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `${18 + i}`,
    name: `Тестовый товар ${i + 1}`,
    description: `Описание тестового товара номер ${i + 1}`,
    price: Math.floor(Math.random() * 50000) + 1000,
    category: 'Electronics/Audio/Headphones',
    stock: Math.floor(Math.random() * 20) + 1,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    reviews: Math.floor(Math.random() * 200) + 10
  } as Product))
];

// Вспомогательные функции
export const getCategoryByPath = (path: string): Category | null => {
  const pathParts = path.split('/');
  let currentCategories = categories;
  let category: Category | null = null;
  
  for (const part of pathParts) {
    category = currentCategories.find(c => c.name === part) || null;
    if (!category) return null;
    currentCategories = category.children || [];
  }
  
  return category;
};

export const getProductsByCategory = (categoryPath: string): Product[] => {
  return products.filter(product => 
    product.category.startsWith(categoryPath)
  );
};