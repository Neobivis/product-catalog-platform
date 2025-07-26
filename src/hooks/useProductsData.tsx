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
    return savedProducts || defaultProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = loadCategoriesFromStorage();
    return savedCategories || defaultCategories;
  });

  // Save to localStorage when data changes
  useEffect(() => {
    saveProductsToStorage(products);
  }, [products]);

  useEffect(() => {
    saveCategoriesToStorage(categories);
  }, [categories]);

  return {
    products,
    setProducts,
    categories,
    setCategories
  };
};