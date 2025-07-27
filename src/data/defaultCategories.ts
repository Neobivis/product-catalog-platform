import { Category } from '@/types/product';

export const defaultCategories: Category[] = [
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