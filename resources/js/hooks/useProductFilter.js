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
    specs: {} 
  });

  useEffect(() => {
    console.log('useProductFilter: Processing products', products);
    if (products?.length > 0) {
      const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort();
      const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
      const subcategories = [...new Set(products.map((p) => p.subcategory).filter(Boolean))].sort();
      const maxPrice = Math.max(...products.map((p) => p.price)) || 100000;
      const roundedMaxPrice = Math.ceil(maxPrice / 1000) * 1000;
      
      // Собираем характеристики
      const allSpecs = {};
    
      products.forEach(product => {
        if (product.specs) {
          Object.entries(product.specs).forEach(([key, value]) => {
            if (!allSpecs[key]) allSpecs[key] = {};
            allSpecs[key][String(value)] = true;
          });
        }
      });

      setFilters(prev => ({
        ...prev,
        brands,
        categories,
        subcategories,
        priceRange: [0, Math.ceil(maxPrice / 1000) * 1000],
        specs: allSpecs
      }));
    }
  }, [products]);

  return { filters, setFilters };
};

export default useProductFilter;