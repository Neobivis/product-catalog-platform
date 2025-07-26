import { Product, Category } from '@/types/product';
import { defaultProducts } from '@/data/defaultProducts';
import { defaultCategories } from '@/data/defaultCategories';
import { 
  loadProductsFromStorage, 
  saveProductsToStorage,
  loadCategoriesFromStorage,
  saveCategoriesToStorage 
} from '@/utils/localStorage';

// Обеспечивает доступность данных для Victor в любом браузере
export const ensureDataForVictor = (): { products: Product[], categories: Category[] } => {
  let products = loadProductsFromStorage();
  let categories = loadCategoriesFromStorage();
  
  // Если данных нет в localStorage, используем defaultProducts
  if (!products || products.length === 0) {
    // Создаем копию defaultProducts и делаем первые 5 товаров с нулевой ценой
    products = defaultProducts.map((product, index) => {
      if (index < 5) {
        return {
          ...product,
          price: 0
        };
      }
      return product;
    });
    saveProductsToStorage(products);
  }
  
  if (!categories || categories.length === 0) {
    categories = defaultCategories;
    saveCategoriesToStorage(categories);
  }
  
  return { products, categories };
};

// Проверяет что есть достаточно товаров с нулевой ценой для Victor
export const ensurePriceRequestProducts = (): void => {
  const { products } = ensureDataForVictor();
  
  // Проверяем есть ли товары с нулевой ценой для Victor
  const zeroProducts = products.filter(product => product.price === 0);
  
  // Если товаров с нулевой ценой меньше 3, создаем еще
  if (zeroProducts.length < 3) {
    const updatedProducts = products.map((product, index) => {
      // Делаем первые 5 товаров с нулевой ценой для Victor
      if (index < 5) {
        return {
          ...product,
          price: 0
        };
      }
      return product;
    });
    
    saveProductsToStorage(updatedProducts);
  }
};

// Создает дополнительные товары с нулевой ценой если их мало
export const ensureZeroPriceProducts = (): void => {
  const { products } = ensureDataForVictor();
  
  // Подсчитываем товары с нулевой ценой
  const zeroProducts = products.filter(product => product.price === 0);
  
  // Если товаров с нулевой ценой меньше 3, добавляем еще
  if (zeroProducts.length < 3) {
    const productsWithPrice = products.filter(product => product.price > 0);
    
    if (productsWithPrice.length > 0) {
      const updatedProducts = products.map((product, index) => {
        // Если товар имеет цену и нам нужно больше товаров с нулевой ценой
        if (product.price > 0 && zeroProducts.length + index < 3) {
          return {
            ...product,
            price: 0
          };
        }
        return product;
      });
      
      saveProductsToStorage(updatedProducts);
    }
  }
};