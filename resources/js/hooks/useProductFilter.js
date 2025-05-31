import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useProductFilter = (initialProducts, filteredByMainFilters, initialFilters) => {
  const location = useLocation();
  const savedSortOption = location.state?.sortOption || { field: 'name', direction: 'asc' };
  const [lastRoute, setLastRoute] = useState(location.pathname);

  // Инициализация фильтров
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    brand: 'all',
    category: 'all',
    subcategory: 'all',
    brands: [],
    categories: [],
    subcategories: [],
    specs: {},
    selectedSpecs: {},
    initialized: false,
  });

  useEffect(() => {
    console.log('useProductFilter: Initializing', {
      initialProducts,
      filteredByMainFilters,
      initialFilters,
      lastRoute,
      currentRoute: location.pathname,
    });

    // Определяем, нужно ли сбросить фильтры
    const isSearchToCatalog = lastRoute.startsWith('/search') && location.pathname.startsWith('/catalog');
    const isCatalogToSearch = lastRoute.startsWith('/catalog') && location.pathname.startsWith('/search');
    const isDifferentCategory =
      lastRoute.includes('/catalog/') &&
      location.pathname.includes('/catalog/') &&
      lastRoute !== location.pathname;

    // ВАЖНО: проверяем, пришли ли мы из детальной страницы товара
    const isFromProductDetails = 
      (lastRoute.split('/').length === 5 && lastRoute.startsWith('/catalog/')) ||  // /catalog/cat/subcat/product
      (lastRoute.split('/').length === 3 && lastRoute.startsWith('/search/'));     // /search/product

    console.log('useProductFilter: Route analysis', {
      isSearchToCatalog,
      isCatalogToSearch,
      isDifferentCategory,
      isFromProductDetails,
      lastRouteSegments: lastRoute.split('/').length,
      currentRouteSegments: location.pathname.split('/').length
    });

    const shouldResetFilters = (isSearchToCatalog || isCatalogToSearch || isDifferentCategory) && !isFromProductDetails;

    // Вычисляем доступные бренды, категории, подкатегории и максимальную цену
    const brands = initialProducts?.length > 0
      ? [...new Set(initialProducts.map((p) => p.brand).filter((val) => val && typeof val === 'string'))].sort()
      : [];
    const categories = initialProducts?.length > 0
      ? [...new Set(initialProducts.map((p) => p.category).filter((val) => val && typeof val === 'string'))].sort()
      : [];
    const subcategories = initialProducts?.length > 0
      ? [...new Set(initialProducts.map((p) => p.subcategory).filter((val) => val && typeof val === 'string'))].sort()
      : [];
    const maxPrice = initialProducts?.length > 0
      ? Math.ceil(Math.max(...initialProducts.map((p) => Number(p.price) || 0)) / 1000) * 1000
      : 100000;

    // Формируем характеристики
    const allSpecs = {};
    if (filteredByMainFilters?.length > 0) {
      filteredByMainFilters.forEach((product) => {
        if (product.specs && typeof product.specs === 'object' && product.specs !== null) {
          Object.entries(product.specs).forEach(([key, value]) => {
            if (key && value) {
              if (!allSpecs[key]) allSpecs[key] = {};
              allSpecs[key][String(value)] = { count: 0, selected: true };
            }
          });
        }
      });

      filteredByMainFilters.forEach((product) => {
        if (product.specs && typeof product.specs === 'object' && product.specs !== null) {
          Object.entries(product.specs).forEach(([key, value]) => {
            if (allSpecs[key] && allSpecs[key][String(value)]) {
              allSpecs[key][String(value)].count += 1;
            }
          });
        }
      });
    }

    // Определяем базовые фильтры
    const baseFilters = {
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

    let newFilters;

    if (shouldResetFilters) {
      // Сбрасываем фильтры полностью
      console.log('useProductFilter: Resetting filters due to route change');
      newFilters = baseFilters;
    } else if (initialFilters && Object.keys(initialFilters).length > 0 && (!filters.initialized || isFromProductDetails)) {
      // Используем сохраненные фильтры (возврат с детальной страницы)
      console.log('useProductFilter: Restoring saved filters', initialFilters);
      
      // ВАЖНО: Проверяем, что сохраненный диапазон цен корректен
      const savedPriceRange = initialFilters.priceRange || [0, maxPrice];
      const validPriceRange = [
        Math.max(0, Math.min(savedPriceRange[0], maxPrice)),
        Math.min(maxPrice, Math.max(savedPriceRange[1], savedPriceRange[0]))
      ];

      newFilters = {
        ...baseFilters,
        priceRange: validPriceRange,
        brand: initialFilters.brand || 'all',
        category: initialFilters.category || 'all',
        subcategory: initialFilters.subcategory || 'all',
        selectedSpecs: initialFilters.selectedSpecs || {},
        initialized: true,
      };

      console.log('useProductFilter: Applied saved filters', {
        savedPriceRange,
        validPriceRange,
        newFilters
      });
    } else if (!filters.initialized) {
      // Первая инициализация без сохраненных фильтров
      console.log('useProductFilter: First initialization with default filters');
      newFilters = baseFilters;
    } else {
      // Обновляем только структурные данные (brands, categories, specs)
      console.log('useProductFilter: Updating structural data only');
      newFilters = {
        ...filters,
        brands,
        categories,
        subcategories,
        specs: allSpecs,
        initialized: true,
      };
    }

    console.log('useProductFilter: Setting filters', newFilters);
    setFilters(newFilters);
    setLastRoute(location.pathname);
  }, [initialProducts, filteredByMainFilters, initialFilters, location.pathname]);

  return { filters, setFilters, savedSortOption };
};

export default useProductFilter;