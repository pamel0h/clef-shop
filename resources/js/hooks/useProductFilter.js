import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useProductFilter = (initialProducts, filteredByMainFilters, initialFilters) => {
  const location = useLocation();
  const [lastRoute, setLastRoute] = useState(location.pathname);
  const [filters, setFilters] = useState(null);
  const [sortOption, setSortOption] = useState(() => {
    const defaultSort = { field: 'name', direction: 'asc' };
    const initialSort = location.state?.sortOption || initialFilters?.sortOption || defaultSort;

    console.log('useProductFilter: Initializing sortOption', { initialSort, defaultSort });

    if (!initialSort || Object.keys(initialSort).length === 0) {
      console.log('useProductFilter: initialSort is empty or invalid, using default', defaultSort);
      return defaultSort;
    }

    return {
      field: initialSort.field && ['name', 'price'].includes(initialSort.field) ? initialSort.field : defaultSort.field,
      direction: initialSort.direction && ['asc', 'desc'].includes(initialSort.direction) ? initialSort.direction : defaultSort.direction,
    };
  });

  useEffect(() => {
    console.log('useProductFilter: Initializing', {
      initialProducts: initialProducts?.length,
      initialFilters,
      location: location.pathname,
      locationState: location.state,
      sortOption,
    });

    if (!initialProducts || initialProducts.length === 0) {
      console.log('useProductFilter: No initial products, skipping initialization');
      setFilters({ initialized: false });
      return;
    }

    // Define route segments
    const lastRouteSegments = lastRoute.split('/').filter((x) => x).length;
    const currentRouteSegments = location.pathname.split('/').filter((x) => x).length;
    const isFromProductDetails = lastRouteSegments > currentRouteSegments;
    const isSearchToCatalog = lastRoute.startsWith('/search') && location.pathname.startsWith('/catalog');
    const isCatalogToSearch = lastRoute.startsWith('/catalog') && location.pathname.startsWith('/search');
    const isDifferentCategory = lastRoute.split('/')[2] !== location.pathname.split('/')[2];

    console.log('useProductFilter: Route analysis', {
      isFromProductDetails,
      isSearchToCatalog,
      isCatalogToSearch,
      isDifferentCategory,
      lastRouteSegments,
      currentRouteSegments,
    });

    // Create base filter data from products
    const brands = [...new Set(initialProducts.map((p) => p.brand).filter(Boolean))].sort();
    const categories = [...new Set(initialProducts.map((p) => p.category).filter(Boolean))].sort();
    const subcategories = [...new Set(initialProducts.map((p) => p.subcategory).filter(Boolean))].sort();

    const maxPrice =
      initialProducts.length > 0
        ? Math.ceil(Math.max(...initialProducts.map((p) => Number(p.price) || 0)) / 1000) * 1000
        : 100000;

    // Collect all specifications
    const allSpecs = {};
    initialProducts.forEach((product) => {
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

    const defaultFilters = {
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

    // Apply saved filters from location.state if available
    let newFilters = defaultFilters;
    if (location.state?.filters && Object.keys(location.state.filters).length > 0) {
      console.log('useProductFilter: Applying filters from location.state', location.state.filters);
      newFilters = {
        ...defaultFilters,
        priceRange: Array.isArray(location.state.filters.priceRange) && location.state.filters.priceRange.length === 2
          ? location.state.filters.priceRange
          : defaultFilters.priceRange,
        brand: location.state.filters.brand || 'all',
        category: location.state.filters.category || 'all',
        subcategory: location.state.filters.subcategory || 'all',
        selectedSpecs: location.state.filters.selectedSpecs || {},
      };
    } else if (initialFilters && Object.keys(initialFilters).length > 0 && !isFromProductDetails) {
      console.log('useProductFilter: Applying initialFilters', initialFilters);
      newFilters = {
        ...defaultFilters,
        priceRange: Array.isArray(initialFilters.priceRange) && initialFilters.priceRange.length === 2
          ? initialFilters.priceRange
          : defaultFilters.priceRange,
        brand: initialFilters.brand || 'all',
        category: initialFilters.category || 'all',
        subcategory: initialFilters.subcategory || 'all',
        selectedSpecs: initialFilters.selectedSpecs || {},
      };
    }

    // Prevent unnecessary updates
    if (JSON.stringify(filters) !== JSON.stringify(newFilters)) {
      console.log('useProductFilter: Setting filters', newFilters);
      setFilters(newFilters);
    } else {
      console.log('useProductFilter: Filters unchanged, skipping setFilters');
    }

    setLastRoute(location.pathname);
  }, [initialProducts, initialFilters, location.pathname, location.state?.filters, sortOption]);

  return { filters, setFilters, sortOption, setSortOption };
};

export default useProductFilter;