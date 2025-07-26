import { useState, useMemo } from 'react';
import { Product, Category } from '@/types/product';

export const useFilters = (products: Product[], categories: Category[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({min: 0, max: 2000});

  // Get unique brands and categories
  const brands = useMemo(() => 
    [...new Set(products.map(p => p.brand))], [products]
  );

  const allCategories = useMemo(() => {
    const flatCategories: string[] = [];
    const traverse = (cats: Category[], prefix = '') => {
      cats.forEach(cat => {
        const fullPath = prefix ? `${prefix}/${cat.name}` : cat.name;
        flatCategories.push(fullPath);
        if (cat.children) {
          traverse(cat.children, fullPath);
        }
      });
    };
    traverse(categories);
    return flatCategories;
  }, [categories]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        product.nameEn.toLowerCase().includes(searchLower) ||
        product.nameCn.toLowerCase().includes(searchLower) ||
        product.nameRu.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower);

      // Brand filter
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      // Category filter - проверяем как основную, так и дополнительные категории
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.some(cat => 
          product.category.includes(cat) || 
          (product.additionalCategories && product.additionalCategories.some(addCat => addCat.includes(cat)))
        );

      // Price filter
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;

      return matchesSearch && matchesBrand && matchesCategory && matchesPrice;
    });
  }, [products, searchQuery, selectedBrands, selectedCategories, priceRange]);

  const toggleBrandFilter = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleCategoryFilter = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedBrands,
    selectedCategories,
    priceRange,
    setPriceRange,
    brands,
    allCategories,
    filteredProducts,
    toggleBrandFilter,
    toggleCategoryFilter
  };
};