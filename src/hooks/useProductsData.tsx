import { useState, useEffect } from 'react';
import { Product, Category } from '@/types/product';
import { defaultProducts } from '@/data/defaultProducts';
import { defaultCategories } from '@/data/defaultCategories';
import { 
  loadProductsFromStorage, 
  saveProductsToStorage,
  loadCategoriesFromStorage,
  saveCategoriesToStorage 
} from '@/utils/localStorage';

export const useProductsData = () => {
  // Initialize state with data from localStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = loadProductsFromStorage();
    // Если в localStorage нет данных, всегда возвращаем defaultProducts
    if (!savedProducts || savedProducts.length === 0) {
      return defaultProducts;
    }
    return savedProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = loadCategoriesFromStorage();
    // Если в localStorage нет данных, всегда возвращаем defaultCategories
    if (!savedCategories || savedCategories.length === 0) {
      return defaultCategories;
    }
    return savedCategories;
  });

  // Save to localStorage when data changes
  useEffect(() => {
    saveProductsToStorage(products);
  }, [products]);

  useEffect(() => {
    saveCategoriesToStorage(categories);
  }, [categories]);

  // Инициализация данными по умолчанию если localStorage пуст
  useEffect(() => {
    const savedProducts = loadProductsFromStorage();
    if (!savedProducts || savedProducts.length === 0) {
      // Создаем копию defaultProducts с несколькими товарами с нулевой ценой
      const productsWithZeroPrices = defaultProducts.map((product, index) => {
        if (index < 5) {
          return { ...product, price: 0 };
        }
        return product;
      });
      setProducts(productsWithZeroPrices);
      saveProductsToStorage(productsWithZeroPrices);
    }
    
    const savedCategories = loadCategoriesFromStorage();
    if (!savedCategories || savedCategories.length === 0) {
      setCategories(defaultCategories);
      saveCategoriesToStorage(defaultCategories);
    }
  }, []);

  return {
    products,
    setProducts,
    categories,
    setCategories
  };
};