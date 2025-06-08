import { useState, useEffect } from 'react';

const useProductFilter = (initialProducts = [], filteredByMainFilters = [], savedFilters = null) => {
  const maxPrice = initialProducts.length > 0
    ? Math.ceil(Math.max(...initialProducts.map((p) => Number(p.price) || 0)) / 1000) * 1000
    : 100000;

  const [filters, setFilters] = useState({
    priceRange: savedFilters?.priceRange || [0, maxPrice],
    brand: savedFilters?.brand || 'all',
    category: savedFilters?.category || 'all',
    subcategory: savedFilters?.subcategory || 'all',
    searchQuery: savedFilters?.searchQuery || '',
    brands: [],
    categories: [],
    subcategories: [],
    specs: savedFilters?.specs || {},
    selectedSpecs: savedFilters?.selectedSpecs || {},
  });

  useEffect(() => {
    if (!initialProducts.length) return;

    // Извлечение брендов, категорий, подкатегорий из initialProducts
    const brands = [...new Set(initialProducts.map((p) => p.brand).filter(Boolean))].sort();
    const categories = [...new Set(initialProducts.map((p) => p.category).filter(Boolean))].sort();
    const subcategories = [...new Set(initialProducts.map((p) => p.subcategory).filter(Boolean))].sort();

    // Установка максимальной цены из initialProducts
    const maxPrice = initialProducts.length > 0
      ? Math.ceil(Math.max(...initialProducts.map((p) => Number(p.price) || 0)) / 1000) * 1000
      : 100000;

    setFilters((prev) => ({
      ...prev,
      brands,
      categories,
      subcategories,
      priceRange: prev.priceRange[1] === 100000 ? [0, maxPrice] : prev.priceRange, // Сохраняем priceRange, если оно было задано
    }));
  }, [initialProducts]);

  useEffect(() => {
    // Формируем specs из товаров, отфильтрованных основными фильтрами
    const allSpecs = {};
    const mainFilteredProducts = initialProducts.filter((product) => {
      const price = Number(product.price);
      const discountPrice = product.discount ? price * (1 - product.discount / 100) : price;

      // Фильтр по цене
      if (filters.priceRange && (discountPrice < filters.priceRange[0] || discountPrice > filters.priceRange[1])) {
        return false;
      }

      // Фильтр по бренду
      if (filters.brand !== 'all' && product.brand !== filters.brand) {
        return false;
      }

      // Фильтр по категории
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Фильтр по подкатегории
      if (filters.subcategory !== 'all' && product.subcategory !== filters.subcategory) {
        return false;
      }

      return true;
    });

    mainFilteredProducts.forEach((product) => {
      if (product.specs && typeof product.specs === 'object' && product.specs !== null) {
        Object.entries(product.specs).forEach(([key, value]) => {
          if (key && value) {
            if (!allSpecs[key]) allSpecs[key] = {};
            const strValue = String(value);
            allSpecs[key][strValue] = {
              count: (allSpecs[key][strValue]?.count || 0) + 1,
              selected: filters.selectedSpecs[key]?.[strValue] ?? true,
            };
          }
        });
      }
    });

    const newSelectedSpecs = Object.keys(allSpecs).reduce((acc, key) => {
      acc[key] = Object.keys(allSpecs[key]).reduce((valAcc, val) => {
        valAcc[val] = filters.selectedSpecs[key]?.[val] ?? true;
        return valAcc;
      }, {});
      return acc;
    }, {});

    setFilters((prev) => ({
      ...prev,
      specs: allSpecs,
      selectedSpecs: newSelectedSpecs,
    }));
  }, [initialProducts, filters.priceRange, filters.brand, filters.category, filters.subcategory]);

  return { filters, setFilters };
};

export default useProductFilter;