// hooks/useProductFilter.jsx
import { useState, useEffect } from 'react';

const useProductFilter = (products) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    brand: 'all',
    category: 'all',
    subcategory: 'all',
    brands: [],
    categories: [],
    subcategories: [],
  });

  useEffect(() => {
    if (products?.length > 0) {
      const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort();
      const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
      const subcategories = [...new Set(products.map((p) => p.subcategory).filter(Boolean))].sort();
      const maxPrice = Math.max(...products.map((p) => p.price)) || 100000;
      const roundedMaxPrice = Math.ceil(maxPrice / 1000) * 1000;

      setFilters((prev) => ({
        ...prev,
        brands,
        categories,
        subcategories,
        priceRange: [0, roundedMaxPrice],
        // Сбрасываем subcategory, если текущая подкатегория не соответствует новой категории
        subcategory:
          prev.category === 'all' || subcategories.includes(prev.subcategory)
            ? prev.subcategory
            : 'all',
      }));
    } else {
      setFilters({
        priceRange: [0, 100000],
        brand: 'all',
        category: 'all',
        subcategory: 'all',
        brands: [],
        categories: [],
        subcategories: [],
      });
    }
  }, [products]);

  return { filters, setFilters };
};

export default useProductFilter;