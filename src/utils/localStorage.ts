import { Product, Category } from '@/types/product';

export const loadProductsFromStorage = (): Product[] | null => {
  if (typeof window !== 'undefined') {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : null;
  }
  return null;
};

export const saveProductsToStorage = (products: Product[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('products', JSON.stringify(products));
  }
};

export const loadCategoriesFromStorage = (): Category[] | null => {
  if (typeof window !== 'undefined') {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : null;
  }
  return null;
};

export const saveCategoriesToStorage = (categories: Category[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('categories', JSON.stringify(categories));
  }
};