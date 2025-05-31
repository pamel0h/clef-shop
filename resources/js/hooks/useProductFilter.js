import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useProductFilter = (initialProducts, filteredByMainFilters, initialFilters) => {
  const location = useLocation();
  // Извлекаем сохраненные фильтры и сортировку из location.state или используем initialFilters
  const savedFilters = initialFilters || location.state?.filters || null;
  const savedSortOption = location.state?.sortOption || { field: 'name', direction: 'asc' };

  const [filters, setFilters] = useState({
    priceRange: savedFilters?.priceRange || [0, 100000],
    brand: savedFilters?.brand || 'all',
    category: savedFilters?.category || 'all',
    subcategory: savedFilters?.subcategory || 'all',
    brands: [],
    categories: [],
    subcategories: [],
    specs: {},
    selectedSpecs: savedFilters?.selectedSpecs || {},
    initialized: !!savedFilters, // Устанавливаем initialized, если есть сохраненные фильтры
  });

  useEffect(() => {
    console.log('useProductFilter: initialProducts', JSON.stringify(initialProducts, null, 2));
    console.log('useProductFilter: filteredByMainFilters', JSON.stringify(filteredByMainFilters, null, 2));

    // Формируем бренды, категории и подкатегории из initialProducts
    const brands = initialProducts?.length > 0 
      ? [...new Set(initialProducts.map(p => p.brand).filter(val => val && typeof val === 'string'))].sort()
      : [];
    const categories = initialProducts?.length > 0 
      ? [...new Set(initialProducts.map(p => p.category).filter(val => val && typeof val === 'string'))].sort()
      : [];
    const subcategories = initialProducts?.length > 0 
      ? [...new Set(initialProducts.map(p => p.subcategory).filter(val => val && typeof val === 'string'))].sort()
      : [];
    const maxPrice = initialProducts?.length > 0 
      ? Math.max(...initialProducts.map(p => Number(p.price) || 0)) || 100000
      : 100000;

    // Формируем характеристики только из товаров, прошедших фильтрацию по основным фильтрам
    const allSpecs = {};
    if (filteredByMainFilters?.length > 0) {
      filteredByMainFilters.forEach(product => {
        if (product.specs && typeof product.specs === 'object' && product.specs !== null) {
          Object.entries(product.specs).forEach(([key, value]) => {
            if (key && value) {
              if (!allSpecs[key]) allSpecs[key] = {};
              allSpecs[key][String(value)] = { 
                count: 0, 
                selected: filters.selectedSpecs[key]?.[String(value)] ?? true 
              };
            }
          });
        }
      });

      filteredByMainFilters.forEach(product => {
        if (product.specs && typeof product.specs === 'object' && product.specs !== null) {
          Object.entries(product.specs).forEach(([key, value]) => {
            if (allSpecs[key] && allSpecs[key][String(value)]) {
              allSpecs[key][String(value)].count += 1;
            }
          });
        }
      });
    }

    console.log('useProductFilter: Computed filters', {
      brands,
      categories,
      subcategories,
      maxPrice,
      specs: allSpecs
    });

    setFilters((prev) => {
      // Обновляем priceRange только если фильтры еще не инициализированы
      const newPriceRange = prev.initialized
        ? prev.priceRange
        : [0, Math.ceil(maxPrice / 1000) * 1000];

      return {
        ...prev,
        brands,
        categories,
        subcategories,
        priceRange: newPriceRange,
        specs: allSpecs,
        selectedSpecs: prev.initialized ? prev.selectedSpecs : (savedFilters?.selectedSpecs || prev.selectedSpecs),
        initialized: true, // Устанавливаем флаг после первой инициализации
      };
    });
  }, [initialProducts, filteredByMainFilters]);

  return { filters, setFilters, savedSortOption };
};

export default useProductFilter;