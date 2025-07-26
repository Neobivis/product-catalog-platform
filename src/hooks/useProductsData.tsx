import { useState, useEffect } from 'react';
import { Product, Category } from '@/types/product';

// Default products data
const defaultProducts: Product[] = [
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
      category: 'Электроника/Аудио',
      images: ['/img/cf9d4e6b-0b84-40fa-8944-4ddf188a111f.jpg', '/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg'],
      currentImageIndex: 0,
      description: 'Премиум беспроводные наушники с активным шумоподавлением. Поддержка Hi-Res Audio и LDAC. Время работы до 30 часов. Быстрая зарядка - 3 минуты заряда дают 3 часа прослушивания. Совместимы с Google Assistant и Amazon Alexa. Часто задаваемые вопросы: Подходят ли для спорта? Да, имеют защиту от влаги IPX4. Можно ли подключить к двум устройствам одновременно? Да, поддерживается мультипоинт соединение.',
      descriptionEn: 'Premium wireless headphones with active noise cancellation. Hi-Res Audio and LDAC support. Battery life up to 30 hours. Quick charge - 3 minutes of charging gives 3 hours of listening. Compatible with Google Assistant and Amazon Alexa. FAQ: Are they suitable for sports? Yes, they have IPX4 moisture protection. Can you connect to two devices simultaneously? Yes, multipoint connection is supported.',
      descriptionCn: '高级无线耳机，具有主动降噪功能。支持Hi-Res Audio和LDAC。续航时间长达30小时。快速充电 - 充电3分钟可听音乐3小时。兼容Google Assistant和Amazon Alexa。常见问题：适合运动吗？是的，具有IPX4防潮保护。可以同时连接两个设备吗？是的，支持多点连接。',
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
      category: 'Электроника/Носимые устройства',
      images: ['/img/c817e33c-f23e-46f9-8803-0e914e9017bd.jpg', '/img/cf9d4e6b-0b84-40fa-8944-4ddf188a111f.jpg'],
      currentImageIndex: 0,
      description: 'Умный фитнес-трекер с GPS и пульсометром. Отслеживает более 100 видов спорта. Водонепроницаемый корпус 5ATM. Мониторинг сна и стресса. Время работы до 14 дней.',
      descriptionEn: 'Smart fitness tracker with GPS and heart rate monitor. Tracks over 100 sports activities. Waterproof 5ATM case. Sleep and stress monitoring. Battery life up to 14 days.',
      descriptionCn: '智能健身追踪器，配备GPS和心率监测器。追踪100多种运动活动。5ATM防水机身。睡眠和压力监测。续航时间长达14天。',
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
      category: 'Электроника/Компьютеры',
      images: ['/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg'],
      currentImageIndex: 0,
      description: 'Мощный игровой ноутбук с RTX 4060. Процессор Intel i7-13700H. 16GB RAM, 1TB SSD. Дисплей 15.6" 144Hz.',
      descriptionEn: 'Powerful gaming laptop with RTX 4060. Intel i7-13700H processor. 16GB RAM, 1TB SSD. 15.6" 144Hz display.',
      descriptionCn: '强大的游戏笔记本电脑，搭载RTX 4060。Intel i7-13700H处理器。16GB内存，1TB SSD。15.6英寸144Hz显示屏。',
      tnved: '8471300000',
      material: 'Алюминий, пластик',
      purpose: 'Игры и работа',
      forWhom: 'Геймеры'
    }
];

// Default categories data  
const defaultCategories: Category[] = [
    {
      id: 'uncategorized',
      name: 'Без категории',
      icon: 'HelpCircle'
    },
    {
      id: 'electronics',
      name: 'Электроника',
      icon: 'Smartphone',
      children: [
        { id: 'audio', name: 'Аудио', icon: 'Headphones' },
        { id: 'wearables', name: 'Носимые устройства', icon: 'Watch' },
        { id: 'computers', name: 'Компьютеры', icon: 'Laptop' }
      ]
    },
    {
      id: 'clothing',
      name: 'Одежда',
      icon: 'Shirt',
      children: [
        { id: 'shirts', name: 'Рубашки', icon: 'Shirt' },
        { id: 'pants', name: 'Брюки', icon: 'Crown' }
      ]
    },
    {
      id: 'home',
      name: 'Дом и сад',
      icon: 'Home'
    },
    {
      id: 'sports',
      name: 'Спорт и отдых',
      icon: 'Dumbbell',
      children: [
        { id: 'fitness', name: 'Фитнес', icon: 'Activity' },
        { id: 'outdoor', name: 'Активный отдых', icon: 'Mountain' }
      ]
    },
    {
      id: 'beauty',
      name: 'Красота и здоровье',
      icon: 'Heart',
      children: [
        { id: 'skincare', name: 'Уход за кожей', icon: 'Sparkles' },
        { id: 'makeup', name: 'Макияж', icon: 'Palette' }
      ]
    },
    {
      id: 'auto',
      name: 'Автотовары',
      icon: 'Car'
    }
];

export const useProductsData = () => {
  // Initialize state with data from localStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const savedProducts = localStorage.getItem('products');
      return savedProducts ? JSON.parse(savedProducts) : defaultProducts;
    }
    return defaultProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCategories = localStorage.getItem('categories');
      return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
    }
    return defaultCategories;
  });

  // Save to localStorage when data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('categories', JSON.stringify(categories));
    }
  }, [categories]);

  return {
    products,
    setProducts,
    categories,
    setCategories
  };
};