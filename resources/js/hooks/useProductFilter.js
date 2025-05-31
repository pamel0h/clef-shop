// useProductFilter.js
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useProductFilter = (initialProducts, filteredByMainFilters, initialFilters) => {
  const location = useLocation();
  const [lastRoute, setLastRoute] = useState(location.pathname);
  const [filters, setFilters] = useState(null);

  const [sortOption, setSortOption] = useState(() => {
    const defaultSort = { field: 'name', direction: 'asc' };
    const initialSort = initialFilters?.sortOption || location.state?.sortOption || defaultSort;

    if (!initialSort || Object.keys(initialSort).length === 0) {
      console.log('useProductFilter: initialSort is empty or invalid, using default', defaultSort);
      return defaultSort;
    }

    return {
      field: initialSort.field && ['name', 'price'].includes(initialSort.field) ? initialSort.field : defaultSort.field,
      direction: initialSort.direction && ['asc', 'desc'].includes(initialSort.direction) ? initialSort.direction : defaultSort.direction
    };
  });

  useEffect(() => {
    console.log('useProductFilter: Initializing', {
      initialProducts: initialProducts?.length,
      initialFilters,
      location: location.pathname,
      sortOption,
    });

    if (!initialProducts || initialProducts.length === 0) {
      console.log('useProductFilter: No initial products, skipping initialization');
      setFilters({ initialized: false });
      return;
    }

    const isSearchToCatalog = lastRoute.startsWith('/search') && location.pathname.startsWith('/catalog');
    const isCatalogToSearch = lastRoute.startsWith('/catalog') && location.pathname.startsWith('/search');
    const lastRouteSegments = lastRoute.split('/').filter((x) => x).length;
    const isFromProductDetails = lastRouteSegments > location.pathname.split('/').filter((x) => x).length;
    const isDifferentCategory = lastRoute.split('/')[2] !== location.pathname.split('/')[2];

    console.log('useProductFilter: Route analysis', {
      isSearchToCatalog,
      isCatalogToSearch,
      isDifferentCategory,
      isFromProductDetails,
      lastRouteSegments,
      currentRouteSegments: location.pathname.split('/').filter((x) => x).length,
    });

    // let newFilters = {
    //   priceRange: [0, 100000],
    //   brand: 'all',
    //   category: 'all',
    //   subcategory: 'all',
    //   brands: [],
    //   initialized: true,
    // };

    // Создаем базовые данные из товаров
const brands = [...new Set(initialProducts.map(p => p.brand).filter(Boolean))].sort();
const categories = [...new Set(initialProducts.map(p => p.category).filter(Boolean))].sort();
const subcategories = [...new Set(initialProducts.map(p => p.subcategory).filter(Boolean))].sort();

const maxPrice = initialProducts.length > 0 
  ? Math.ceil(Math.max(...initialProducts.map(p => Number(p.price) || 0)) / 1000) * 1000 
  : 100000;

// Собираем все характеристики
const allSpecs = {};
initialProducts.forEach(product => {
  if (product.specs && typeof product.specs === 'object') {
    Object.entries(product.specs).forEach(([key, value]) => {
      if (key && value) {
        if (!allSpecs[key]) allSpecs[key] = {};
        const strValue = String(value);
        if (!allSpecs[key][strValue]) {
          allSpecs[key][strValue] = { count: 0, selected: true };
        }
        allSpecs[key][strValue].count++;
      }
    });
  }
});

let newFilters = {
  priceRange: [0, maxPrice],
  brand: 'all',
  category: 'all', 
  subcategory: 'all',
  brands,
  categories,
  subcategories,
  specs: allSpecs,
  selectedSpecs: {},
  initialized: true,
};

    if (initialFilters && Object.keys(initialFilters).length > 0) {
      newFilters = {
        ...newFilters,
        ...initialFilters,
        priceRange: initialFilters.priceRange || [0, 100000],
        brand: initialFilters.brand || 'all',
        category: initialFilters.category || 'all',
        subcategory: initialFilters.subcategory || 'all',
        selectedSpecs: initialFilters.selectedSpecs || {},
      };
    } else if (location.state?.filters) {
      newFilters = {
        ...newFilters,
        ...location.state.filters,
        priceRange: location.state.filters.priceRange || [0, 100000],
        brand: location.state.filters.brand || 'all',
        category: location.state.filters.category || 'all',
        subcategory: location.state.filters.subcategory || 'all',
        selectedSpecs: location.state.filters.selectedSpecs || {},
      };
    }

    console.log('useProductFilter: Setting filters', newFilters);
    setFilters(newFilters);
    setLastRoute(location.pathname);
  }, [initialProducts, initialFilters, location.pathname, location.state]);

  return { filters, setFilters, sortOption, setSortOption };
};

export default useProductFilter;