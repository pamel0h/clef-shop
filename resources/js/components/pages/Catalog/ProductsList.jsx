import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ProductFilter } from './ProductFilter';
import '../../../../css/components/Products.css';
import '../../../../css/components/Loading.css';

const ProductsList = ({ products: initialProducts = [], emptyMessage, isSearchPage = false, query, initialFilters, initialSortOption }) => {
  const { categorySlug, subcategorySlug } = useParams();
  const location = useLocation();
  const [filteredByMainFilters, setFilteredByMainFilters] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState(initialSortOption || { field: 'name', direction: 'asc' });
  const [filters, setFilters] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [shouldApplyInitialFilters, setShouldApplyInitialFilters] = useState(false);

  const sortProducts = (products) => {
    return [...products].sort((a, b) => {
      let valueA, valueB;
      if (sortOption.field === 'price') {
        valueA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        valueB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
      } else {
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
      }
      if (valueA < valueB) return sortOption.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOption.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  useEffect(() => {
    console.log('ProductsList: Initializing', {
      initialProducts,
      initialFilters,
      location: location.pathname,
      isSearchPage,
    });

    // Определяем, нужно ли сбросить состояние
    const currentRoute = location.pathname;
    const shouldReset = !isInitialized || 
      (currentRoute.startsWith('/search') !== isSearchPage);

    if (shouldReset) {
      console.log('ProductsList: Resetting state');
      setFilters(null);
      setIsInitialized(true);
    }

    // Инициализируем продукты с сортировкой
    const sortedProducts = sortProducts(initialProducts);
    setFilteredByMainFilters(sortedProducts);
    setFilteredProducts(sortedProducts);

    // ВАЖНО: Если есть сохраненные фильтры, запланируем их применение
    if (initialFilters && Object.keys(initialFilters).length > 0) {
      console.log('ProductsList: Planning to apply initial filters', initialFilters);
      setShouldApplyInitialFilters(true);
    }

  }, [initialProducts, location.pathname, isSearchPage]);

  // Отдельный эффект для применения фильтров при изменении сортировки
  useEffect(() => {
    if (filters) {
      handleFilterChange(filters);
    }
  }, [sortOption]);

  // Эффект для применения начальных фильтров после инициализации
  useEffect(() => {
    if (shouldApplyInitialFilters && filters && filters.initialized) {
      console.log('ProductsList: Applying initial filters after filter initialization', filters);
      handleFilterChange(filters);
      setShouldApplyInitialFilters(false);
    }
  }, [filters, shouldApplyInitialFilters]);

  const handleFilterChange = (newFilters) => {
    console.log('ProductsList: Applying filters', newFilters);
    setFilters(newFilters);

    const filteredByMain = initialProducts.filter((product) => {
      const price = Number(product.price);
      const discountPrice = product.discount ? price * (1 - product.discount / 100) : price;
      
      // Проверка цены
      if (newFilters.priceRange && (discountPrice < newFilters.priceRange[0] || discountPrice > newFilters.priceRange[1])) {
        console.log(`ProductsList: Product ${product.name} filtered out by price: ${discountPrice} not in [${newFilters.priceRange[0]}, ${newFilters.priceRange[1]}]`);
        return false;
      }
      
      // Проверка бренда
      if (newFilters.brand !== 'all' && product.brand !== newFilters.brand) {
        console.log(`ProductsList: Product ${product.name} filtered out by brand: ${product.brand} !== ${newFilters.brand}`);
        return false;
      }
      
      // Проверка категории (только для поиска)
      if (isSearchPage && newFilters.category !== 'all' && product.category !== newFilters.category) {
        console.log(`ProductsList: Product ${product.name} filtered out by category: ${product.category} !== ${newFilters.category}`);
        return false;
      }
      
      // Проверка подкатегории (только для поиска)
      if (isSearchPage && newFilters.subcategory !== 'all' && product.subcategory !== newFilters.subcategory) {
        console.log(`ProductsList: Product ${product.name} filtered out by subcategory: ${product.subcategory} !== ${newFilters.subcategory}`);
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
        for (const [specKey, specFilter] of Object.entries(newFilters.selectedSpecs)) {
          const productValue = product.specs[specKey];
          if (productValue !== undefined) {
            const strValue = String(productValue);
            if (specFilter[strValue] === false) {
              console.log(`ProductsList: Product ${product.name} filtered out by spec: ${specKey}=${strValue}`);
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

  return (
    <div className="products-list-container">
      <ProductFilter
        initialProducts={initialProducts}
        filteredByMainFilters={filteredByMainFilters}
        filteredProducts={filteredProducts}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        sortOption={sortOption}
        initialFilters={initialFilters}
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
                sortOption={sortOption}
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