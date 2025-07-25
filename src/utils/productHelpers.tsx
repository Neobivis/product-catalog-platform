import { Product } from '@/types/product';

export const getRussianFields = (category: string, nameEn: string) => {
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