import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ProductFilter } from './ProductFilter';
import '../../../../css/components/Products.css';
import '../../../../css/components/Loading.css';
import useProductFilter from '../../../hooks/useProductFilter';

const ProductsList = ({ products: initialProducts = [], emptyMessage, isSearchPage = false, query, initialFilters }) => {
  const { categorySlug, subcategorySlug } = useParams();
  const location = useLocation();
  const [filteredByMainFilters, setFilteredByMainFilters] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { filters, setFilters, sortOption, setSortOption } = useProductFilter(initialProducts, filteredByMainFilters, initialFilters);
  const [isInitialized, setIsInitialized] = useState(false);

  const sortProducts = (products) => {
    if (!products || products.length === 0) return [];
    
    const field = sortOption.field && ['name', 'price'].includes(sortOption.field) ? sortOption.field : 'name';
    const direction = sortOption.direction && ['asc', 'desc'].includes(sortOption.direction) ? sortOption.direction : 'asc';
    
    console.log('ProductsList: Sorting products', { field, direction });
    return [...products].sort((a, b) => {
      let valueA, valueB;
      if (field === 'price') {
        valueA = Number(a.price) || 0;
        valueB = Number(b.price) || 0;
        if (a.discount) valueA = valueA * (1 - a.discount / 100);
        if (b.discount) valueB = valueB * (1 - b.discount / 100);
      } else {
        valueA = String(a.name || '').toLowerCase();
        valueB = String(b.name || '').toLowerCase();
      }
      
      if (direction === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  };

  useEffect(() => {
    console.log('ProductsList: Initializing', {
      initialProducts: initialProducts?.length,
      initialFilters,
      location: location.pathname + location.search,
      isSearchPage,
    });

    if (!initialProducts || initialProducts.length === 0) {
      console.log('ProductsList: No initial products');
      setFilteredByMainFilters([]);
      setFilteredProducts([]);
      return;
    }

    // Сбрасываем состояние, если изменился контекст (поиск или каталог)
    const currentRoute = location.pathname;
    const shouldReset = !isInitialized || (currentRoute.startsWith('/search') !== isSearchPage);

    if (shouldReset) {
      console.log('ProductsList: Resetting state');
      setIsInitialized(true);
    }

    // Применяем фильтры из useProductFilter
    if (filters && filters.initialized) {
      console.log('ProductsList: Applying filters from useProductFilter', filters);
      let filteredByMain = initialProducts.filter((product) => {
        const price = Number(product.price);
        const discountPrice = product.discount ? price * (1 - product.discount / 100) : price;
        
        if (filters.priceRange && (discountPrice < filters.priceRange[0] || discountPrice > filters.priceRange[1])) {
          return false;
        }
        
        if (filters.brand !== 'all' && product.brand !== filters.brand) {
          return false;
        }
        
        if (isSearchPage && filters.category !== 'all' && product.category !== filters.category) {
          return false;
        }
        
        if (isSearchPage && filters.subcategory !== 'all' && product.subcategory !== filters.subcategory) {
          return false;
        }
        
        return true;
      });

// Применяем фильтры по характеристикам
const filteredBySpecs = filteredByMain.filter((product) => {
  if (product.specs && typeof product.specs === 'object' && product.specs !== null) {
    for (const [specKey, specFilter] of Object.entries(filters.selectedSpecs || {})) {
      const productValue = product.specs[specKey];
      if (productValue !== undefined) {
        const strValue = String(productValue);
        if (specFilter[strValue] === false) {
          return false;
        }
      }
    }
  }
  return true;
});

const sortedProducts = sortProducts(filteredBySpecs);
      setFilteredProducts(sortedProducts);
    }
  }, [initialProducts, filters, location.pathname, location.search, isSearchPage, isInitialized]);

  // Применяем сортировку при изменении sortOption или filteredByMainFilters
  useEffect(() => {
    if (filteredByMainFilters.length > 0) {
      console.log('ProductsList: Applying sort due to sortOption or filteredByMainFilters change', sortOption);
      const sortedProducts = sortProducts(filteredByMainFilters);
      setFilteredProducts(sortedProducts);
    }
  }, [sortOption, filteredByMainFilters]);

  const handleFilterChange = (newFilters) => {
    console.log('ProductsList: Applying filters', newFilters);
    console.log('ProductsList: handleFilterChange received:', newFilters);
    console.log('ProductsList: Current filters state:', filters);
    
    if (!newFilters || !initialProducts) {
      console.warn('ProductsList: Invalid filters or products');
      return;
    }

    const filteredByMain = initialProducts.filter((product) => {
      const price = Number(product.price);
      const discountPrice = product.discount ? price * (1 - product.discount / 100) : price;
      
      if (newFilters.priceRange && (discountPrice < newFilters.priceRange[0] || discountPrice > newFilters.priceRange[1])) {
        return false;
      }
      
      if (newFilters.brand !== 'all' && product.brand !== newFilters.brand) {
        return false;
      }
      
      if (isSearchPage && newFilters.category !== 'all' && product.category !== newFilters.category) {
        return false;
      }
      
      if (isSearchPage && newFilters.subcategory !== 'all' && product.subcategory !== newFilters.subcategory) {
        return false;
      }
      
      return true;
    });

    console.log(`ProductsList: After main filters: ${filteredByMain.length} products from ${initialProducts.length}`);
    const sortedFilteredByMain = sortProducts(filteredByMain);
    setFilteredByMainFilters(sortedFilteredByMain);

    // Применяем фильтры по характеристикам
    const filteredBySpecs = sortedFilteredByMain.filter((product) => {
      if (product.specs && typeof product.specs === 'object' && product.specs !== null) {
        for (const [specKey, specFilter] of Object.entries(newFilters.selectedSpecs || {})) {
          const productValue = product.specs[specKey];
          if (productValue !== undefined) {
            const strValue = String(productValue);
            if (specFilter[strValue] === false) {
              return false;
            }
          }
        }
      }
      return true;
    });

    console.log(`ProductsList: After spec filters: ${filteredBySpecs.length} products`);
    const sortedFilteredProducts = sortProducts(filteredBySpecs);
    setFilteredProducts(sortedFilteredProducts);
  };

  const handleSortChange = (field, direction) => {
    console.log('ProductsList: Changing sort option', { field, direction });
    setSortOption({ field, direction });
  };

  if (!filters || !filters.initialized) {
    return <div className="loading">Инициализация фильтров...</div>;
  }

  return (
    <div className="products-list-container">
      <ProductFilter
        initialProducts={initialProducts}
        filteredByMainFilters={filteredByMainFilters}
        filteredProducts={filteredProducts}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        sortOption={sortOption}
        initialFilters={initialFilters} // Передаем initialFilters, а не filters
      />
      <div className="products">
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id || product._id || index}
                product={product}
                isSearchPage={isSearchPage}
                query={query}
                filters={filters}
                sortOption={sortOption || { field: 'name', direction: 'asc' }}
              />
            ))
          ) : (
            <p>{emptyMessage || 'Товаров нет'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsList;