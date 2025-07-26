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
    },
    {
      id: '4',
      nameEn: 'Wireless Mouse',
      nameCn: '无线鼠标',
      nameRu: 'Беспроводная мышь',
      price: 49.99,
      sku: 'WM-PRO-2024',
      quantity: 156,
      brand: 'TechMouse',
      webLink: 'https://example.com/mouse',
      category: 'Электроника/Компьютеры',
      images: ['/img/cf9d4e6b-0b84-40fa-8944-4ddf188a111f.jpg'],
      currentImageIndex: 0,
      description: 'Эргономичная беспроводная мышь с высокой точностью. DPI до 16000. Время работы до 70 часов.',
      tnved: '8471609000',
      material: 'Пластик, резина',
      purpose: 'Управление компьютером',
      forWhom: 'Пользователи ПК'
    },
    {
      id: '5',
      nameEn: 'Cotton T-Shirt',
      nameCn: '棉质T恤',
      nameRu: 'Хлопковая футболка',
      price: 19.99,
      sku: 'TS-COTTON-XXL',
      quantity: 89,
      brand: 'ComfortWear',
      webLink: 'https://example.com/tshirt',
      category: 'Одежда/Футболки',
      images: ['/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg'],
      currentImageIndex: 0,
      description: 'Мягкая хлопковая футболка базового кроя. 100% хлопок. Машинная стирка.',
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
      price: 89.99,
      sku: 'KN-SET-PRO',
      quantity: 34,
      brand: 'ChefTools',
      webLink: 'https://example.com/knives',
      category: 'Дом и сад/Кухня',
      images: ['/img/c817e33c-f23e-46f9-8803-0e914e9017bd.jpg'],
      currentImageIndex: 0,
      description: 'Профессиональный набор кухонных ножей из нержавеющей стали. 5 предметов в комплекте.',
      tnved: '8211920000',
      material: 'Нержавеющая сталь',
      purpose: 'Приготовление пищи',
      forWhom: 'Повара, кулинары'
    },
    {
      id: '7',
      nameEn: 'Yoga Mat',
      nameCn: '瑜伽垫',
      nameRu: 'Коврик для йоги',
      price: 29.99,
      sku: 'YM-ECO-2024',
      quantity: 67,
      brand: 'ZenSport',
      webLink: 'https://example.com/yoga-mat',
      category: 'Спорт и отдых/Фитнес',
      images: ['/img/cf9d4e6b-0b84-40fa-8944-4ddf188a111f.jpg'],
      currentImageIndex: 0,
      description: 'Экологичный коврик для йоги из натурального каучука. Нескользящая поверхность.',
      tnved: '4016999000',
      material: 'Натуральный каучук',
      purpose: 'Занятия йогой',
      forWhom: 'Спортсмены'
    },
    {
      id: '8',
      nameEn: 'Face Cream',
      nameCn: '面霜',
      nameRu: 'Крем для лица',
      price: 39.99,
      sku: 'FC-HYDRA-50ML',
      quantity: 123,
      brand: 'BeautyLab',
      webLink: 'https://example.com/face-cream',
      category: 'Красота и здоровье/Уход за кожей',
      images: ['/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg'],
      currentImageIndex: 0,
      description: 'Увлажняющий крем для лица с гиалуроновой кислотой. Подходит для всех типов кожи.',
      tnved: '3304990000',
      material: 'Косметические компоненты',
      purpose: 'Уход за кожей',
      forWhom: 'Взрослые'
    },
    {
      id: '9',
      nameEn: 'Car Phone Holder',
      nameCn: '车载手机支架',
      nameRu: 'Автодержатель для телефона',
      price: 24.99,
      sku: 'CPH-MAGNETIC',
      quantity: 98,
      brand: 'CarTech',
      webLink: 'https://example.com/car-holder',
      category: 'Автотовары/Аксессуары',
      images: ['/img/c817e33c-f23e-46f9-8803-0e914e9017bd.jpg'],
      currentImageIndex: 0,
      description: 'Магнитный автодержатель для смартфона. Универсальное крепление на решетку.',
      tnved: '8517709900',
      material: 'Пластик, магнит',
      purpose: 'Держатель для телефона',
      forWhom: 'Водители'
    },
    {
      id: '10',
      nameEn: 'Bluetooth Speaker',
      nameCn: '蓝牙音箱',
      nameRu: 'Bluetooth колонка',
      price: 79.99,
      sku: 'BS-PORTABLE-X1',
      quantity: 45,
      brand: 'SoundWave',
      webLink: 'https://example.com/speaker',
      category: 'Электроника/Аудио',
      images: ['/img/cf9d4e6b-0b84-40fa-8944-4ddf188a111f.jpg'],
      currentImageIndex: 0,
      description: 'Портативная Bluetooth колонка с защитой IPX7. Время работы до 12 часов.',
      tnved: '8518220000',
      material: 'Пластик, ткань',
      purpose: 'Воспроизведение музыки',
      forWhom: 'Меломаны'
    },
    {
      id: '11',
      nameEn: 'Running Shoes',
      nameCn: '跑步鞋',
      nameRu: 'Кроссовки для бега',
      price: 129.99,
      sku: 'RS-COMFORT-42',
      quantity: 76,
      brand: 'RunFast',
      webLink: 'https://example.com/running-shoes',
      category: 'Одежда/Обувь',
      images: ['/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg'],
      currentImageIndex: 0,
      description: 'Легкие кроссовки для бега с амортизацией. Дышащий верх из сетки.',
      tnved: '6404110000',
      material: 'Текстиль, резина',
      purpose: 'Бег и спорт',
      forWhom: 'Спортсмены'
    },
    {
      id: '12',
      nameEn: 'Coffee Maker',
      nameCn: '咖啡机',
      nameRu: 'Кофеварка',
      price: 199.99,
      sku: 'CM-DRIP-AUTO',
      quantity: 28,
      brand: 'BrewMaster',
      webLink: 'https://example.com/coffee-maker',
      category: 'Дом и сад/Кухня',
      images: ['/img/c817e33c-f23e-46f9-8803-0e914e9017bd.jpg'],
      currentImageIndex: 0,
      description: 'Автоматическая капельная кофеварка на 12 чашек. Программируемый таймер.',
      tnved: '8516719000',
      material: 'Пластик, стекло',
      purpose: 'Приготовление кофе',
      forWhom: 'Кофеманы'
    },
    {
      id: '13',
      nameEn: 'Power Bank',
      nameCn: '充电宝',
      nameRu: 'Внешний аккумулятор',
      price: 59.99,
      sku: 'PB-20000MAH',
      quantity: 134,
      brand: 'PowerTech',
      webLink: 'https://example.com/power-bank',
      category: 'Электроника/Аксессуары',
      images: ['/img/cf9d4e6b-0b84-40fa-8944-4ddf188a111f.jpg'],
      currentImageIndex: 0,
      description: 'Портативный аккумулятор 20000 мАч с быстрой зарядкой. USB-C и Lightning.',
      tnved: '8507600000',
      material: 'Пластик, литий',
      purpose: 'Зарядка устройств',
      forWhom: 'Пользователи гаджетов'
    },
    {
      id: '14',
      nameEn: 'LED Desk Lamp',
      nameCn: 'LED台灯',
      nameRu: 'Настольная LED лампа',
      price: 69.99,
      sku: 'DL-LED-TOUCH',
      quantity: 87,
      brand: 'LightPro',
      webLink: 'https://example.com/desk-lamp',
      category: 'Дом и сад/Освещение',
      images: ['/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg'],
      currentImageIndex: 0,
      description: 'Сенсорная настольная лампа с диммером. Регулировка цветовой температуры.',
      tnved: '9405409000',
      material: 'Металл, пластик',
      purpose: 'Освещение рабочего места',
      forWhom: 'Офисные работники'
    },
    {
      id: '15',
      nameEn: 'Gaming Chair',
      nameCn: '游戏椅',
      nameRu: 'Игровое кресло',
      price: 299.99,
      sku: 'GC-ERGONOMIC',
      quantity: 19,
      brand: 'ComfortGame',
      webLink: 'https://example.com/gaming-chair',
      category: 'Дом и сад/Мебель',
      images: ['/img/c817e33c-f23e-46f9-8803-0e914e9017bd.jpg'],
      currentImageIndex: 0,
      description: 'Эргономичное игровое кресло с поддержкой поясницы. Регулировка высоты.',
      tnved: '9401300000',
      material: 'Экокожа, металл',
      purpose: 'Игры и работа',
      forWhom: 'Геймеры'
    },
    {
      id: '16',
      nameEn: 'Protein Powder',
      nameCn: '蛋白粉',
      nameRu: 'Протеиновый порошок',
      price: 49.99,
      sku: 'PP-WHEY-1KG',
      quantity: 156,
      brand: 'NutriSport',
      webLink: 'https://example.com/protein',
      category: 'Спорт и отдых/Питание',
      images: ['/img/cf9d4e6b-0b84-40fa-8944-4ddf188a111f.jpg'],
      currentImageIndex: 0,
      description: 'Сывороточный протеин с ванильным вкусом. 25г белка на порцию.',
      tnved: '2106909200',
      material: 'Сывороточный белок',
      purpose: 'Спортивное питание',
      forWhom: 'Спортсмены'
    },
    {
      id: '17',
      nameEn: 'Smartphone Case',
      nameCn: '手机壳',
      nameRu: 'Чехол для смартфона',
      price: 14.99,
      sku: 'SC-SILICON-CLEAR',
      quantity: 234,
      brand: 'ProtectCase',
      webLink: 'https://example.com/phone-case',
      category: 'Электроника/Аксессуары',
      images: ['/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg'],
      currentImageIndex: 0,
      description: 'Прозрачный силиконовый чехол с защитой от ударов. Совместим с iPhone 15.',
      tnved: '3926909790',
      material: 'Силикон',
      purpose: 'Защита смартфона',
      forWhom: 'Пользователи смартфонов'
    },
    {
      id: '18',
      nameEn: 'Sunglasses',
      nameCn: '太阳镜',
      nameRu: 'Солнечные очки',
      price: 89.99,
      sku: 'SG-POLARIZED',
      quantity: 67,
      brand: 'SunStyle',
      webLink: 'https://example.com/sunglasses',
      category: 'Одежда/Аксессуары',
      images: ['/img/c817e33c-f23e-46f9-8803-0e914e9017bd.jpg'],
      currentImageIndex: 0,
      description: 'Поляризованные солнечные очки с UV защитой. Легкая титановая оправа.',
      tnved: '9004100000',
      material: 'Титан, стекло',
      purpose: 'Защита от солнца',
      forWhom: 'Взрослые'
    },
    {
      id: '19',
      nameEn: 'Air Purifier',
      nameCn: '空气净化器',
      nameRu: 'Очиститель воздуха',
      price: 249.99,
      sku: 'AP-HEPA-2024',
      quantity: 43,
      brand: 'CleanAir',
      webLink: 'https://example.com/air-purifier',
      category: 'Дом и сад/Климат',
      images: ['/img/cf9d4e6b-0b84-40fa-8944-4ddf188a111f.jpg'],
      currentImageIndex: 0,
      description: 'Очиститель воздуха с HEPA фильтром. Покрытие до 50 кв.м. Тихая работа.',
      tnved: '8421392000',
      material: 'Пластик, фильтры',
      purpose: 'Очистка воздуха',
      forWhom: 'Семьи'
    },
    {
      id: '20',
      nameEn: 'Electric Toothbrush',
      nameCn: '电动牙刷',
      nameRu: 'Электрическая зубная щетка',
      price: 119.99,
      sku: 'ET-SONIC-PRO',
      quantity: 89,
      brand: 'DentalCare',
      webLink: 'https://example.com/toothbrush',
      category: 'Красота и здоровье/Гигиена',
      images: ['/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg'],
      currentImageIndex: 0,
      description: 'Звуковая зубная щетка с 5 режимами чистки. Время работы до 3 недель.',
      tnved: '9603210000',
      material: 'Пластик, нейлон',
      purpose: 'Гигиена полости рта',
      forWhom: 'Взрослые'
    },
    {
      id: '21',
      nameEn: 'Cooking Pan Set',
      nameCn: '炒锅套装',
      nameRu: 'Набор сковородок',
      price: 159.99,
      sku: 'CPS-NONSTICK-3PC',
      quantity: 76,
      brand: 'KitchenMaster',
      webLink: 'https://example.com/pan-set',
      category: 'Дом и сад/Кухня',
      images: ['/img/c817e33c-f23e-46f9-8803-0e914e9017bd.jpg'],
      currentImageIndex: 0,
      description: 'Набор антипригарных сковородок из 3 предметов. Подходят для всех плит.',
      tnved: '7323930000',
      material: 'Алюминий с покрытием',
      purpose: 'Приготовление пищи',
      forWhom: 'Повара'
    },
    {
      id: '22',
      nameEn: 'Smart Watch',
      nameCn: '智能手表',
      nameRu: 'Умные часы',
      price: 329.99,
      sku: 'SW-HEALTH-2024',
      quantity: 54,
      brand: 'WatchTech',
      webLink: 'https://example.com/smart-watch',
      category: 'Электроника/Носимые устройства',
      images: ['/img/cf9d4e6b-0b84-40fa-8944-4ddf188a111f.jpg'],
      currentImageIndex: 0,
      description: 'Умные часы с мониторингом здоровья. GPS, пульсометр, NFC платежи.',
      tnved: '9102120000',
      material: 'Алюминий, силикон',
      purpose: 'Мониторинг здоровья',
      forWhom: 'Активные люди'
    },
    {
      id: '23',
      nameEn: 'Backpack',
      nameCn: '背包',
      nameRu: 'Рюкзак',
      price: 79.99,
      sku: 'BP-TRAVEL-30L',
      quantity: 123,
      brand: 'TravelGear',
      webLink: 'https://example.com/backpack',
      category: 'Одежда/Сумки',
      images: ['/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg'],
      currentImageIndex: 0,
      description: 'Туристический рюкзак 30л с отделением для ноутбука. Водоотталкивающий.',
      tnved: '4202129000',
      material: 'Нейлон, полиэстер',
      purpose: 'Путешествия',
      forWhom: 'Путешественники'
    },
    {
      id: '24',
      nameEn: 'Wireless Charger',
      nameCn: '无线充电器',
      nameRu: 'Беспроводное зарядное устройство',
      price: 39.99,
      sku: 'WC-FAST-15W',
      quantity: 167,
      brand: 'ChargeTech',
      webLink: 'https://example.com/wireless-charger',
      category: 'Электроника/Аксессуары',
      images: ['/img/c817e33c-f23e-46f9-8803-0e914e9017bd.jpg'],
      currentImageIndex: 0,
      description: 'Беспроводная зарядка с быстрой зарядкой 15W. Совместимо с Qi устройствами.',
      tnved: '8504409990',
      material: 'Пластик, медь',
      purpose: 'Зарядка устройств',
      forWhom: 'Владельцы смартфонов'
    },
    {
      id: '25',
      nameEn: 'Water Bottle',
      nameCn: '水瓶',
      nameRu: 'Бутылка для воды',
      price: 24.99,
      sku: 'WB-STEEL-750ML',
      quantity: 198,
      brand: 'HydroLife',
      webLink: 'https://example.com/water-bottle',
      category: 'Спорт и отдых/Аксессуары',
      images: ['/img/cf9d4e6b-0b84-40fa-8944-4ddf188a111f.jpg'],
      currentImageIndex: 0,
      description: 'Термобутылка из нержавеющей стали 750мл. Сохраняет температуру 12 часов.',
      tnved: '7323999000',
      material: 'Нержавеющая сталь',
      purpose: 'Хранение напитков',
      forWhom: 'Спортсмены'
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