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
    products = defaultProducts;
    saveProductsToStorage(products);
  }
  
  if (!categories || categories.length === 0) {
    categories = defaultCategories;
    saveCategoriesToStorage(categories);
  }
  
  return { products, categories };
};

// Проверяет и добавляет товары в категорию "Запрос цены" если их нет
export const ensurePriceRequestProducts = (): void => {
  const { products } = ensureDataForVictor();
  
  // Проверяем есть ли товары в категории "Запрос цены"
  const priceRequestProducts = products.filter(product => 
    product.category === 'Запрос цены' || 
    (product.additionalCategories && product.additionalCategories.includes('Запрос цены'))
  );
  
  // Если товаров для запроса цены нет, добавляем несколько товаров в эту категорию
  if (priceRequestProducts.length === 0) {
    const updatedProducts = products.map((product, index) => {
      // Добавляем первые 5 товаров в категорию "Запрос цены"
      if (index < 5) {
        return {
          ...product,
          additionalCategories: [...(product.additionalCategories || []), 'Запрос цены']
        };
      }
      return product;
    });
    
    saveProductsToStorage(updatedProducts);
  }
};