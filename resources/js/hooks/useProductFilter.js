import { useState, useEffect } from 'react';

const useProductFilter = (products) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    brand: 'all',
    brands: [],
  });

  useEffect(() => {
    if (products?.length > 0) {
      const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
      const maxPrice = Math.max(...products.map(p => p.price)) || 100000;
      const roundedMaxPrice = Math.ceil(maxPrice / 1000) * 1000;

      setFilters(prev => ({
        ...prev,
        brands,
        priceRange: [0, roundedMaxPrice],
      }));
    } else {
      setFilters({
        priceRange: [0, 100000],
        brand: 'all',
        brands: [],
      });
    }
  }, [products]);

  return { filters, setFilters };
};

export default useProductFilter;