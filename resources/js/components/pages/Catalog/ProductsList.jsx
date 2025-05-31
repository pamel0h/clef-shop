import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ProductFilter } from './ProductFilter';
import '../../../../css/components/Products.css';
import '../../../../css/components/Loading.css';

const ProductsList = ({ products: initialProducts = [], emptyMessage, isSearchPage = false, query }) => {
  const { categorySlug, subcategorySlug } = useParams();
  const [filteredByMainFilters, setFilteredByMainFilters] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState({
    field: 'name',
    direction: 'asc'
  });

  // Функция для сортировки продуктов
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
    console.log('ProductsList: Received initialProducts', JSON.stringify(initialProducts, null, 2));
    const sortedProducts = sortProducts(initialProducts);
    setFilteredByMainFilters(sortedProducts);
    setFilteredProducts(sortedProducts);
  }, [initialProducts, sortOption]);

  const handleFilterChange = (newFilters) => {
    console.log('ProductsList: Applying filters', JSON.stringify(newFilters, null, 2));

    // Первый этап: фильтрация по основным фильтрам
    const filteredByMain = initialProducts.filter((product) => {
      console.log(`ProductsList: Checking product ${product.id} (${product.name})`, JSON.stringify(product, null, 2));
      const price = Number(product.price);
      const discountPrice = product.discount ? price * (1 - product.discount / 100) : price;
      if (newFilters.priceRange && (discountPrice < newFilters.priceRange[0] || discountPrice > newFilters.priceRange[1])) {
        console.log(`ProductsList: Product ${product.name} filtered out by price`, { discountPrice, priceRange: newFilters.priceRange });
        return false;
      }
      if (newFilters.brand !== 'all' && product.brand !== newFilters.brand) {
        console.log(`ProductsList: Product ${product.name} filtered out by brand`, { productBrand: product.brand, filterBrand: newFilters.brand });
        return false;
      }
      if (isSearchPage && newFilters.category !== 'all' && product.category !== newFilters.category) {
        console.log(`ProductsList: Product ${product.name} filtered out by category`, { productCategory: product.category, filterCategory: newFilters.category });
        return false;
      }
      if (isSearchPage && newFilters.subcategory !== 'all' && product.subcategory !== newFilters.subcategory) {
        console.log(`ProductsList: Product ${product.name} filtered out by subcategory`, { productSubcategory: product.subcategory, filterSubcategory: newFilters.subcategory });
        return false;
      }
      return true;
    });

    // Сохраняем товары, отфильтрованные по основным фильтрам
    const sortedFilteredByMain = sortProducts(filteredByMain);
    setFilteredByMainFilters(sortedFilteredByMain);

    // Второй этап: фильтрация по характеристикам
    const filteredBySpecs = sortedFilteredByMain.filter(product => {
      if (product.specs && typeof product.specs === 'object' && product.specs !== null) {
        for (const [specKey, specFilter] of Object.entries(newFilters.selectedSpecs)) {
          const productValue = product.specs[specKey];
          if (productValue !== undefined) {
            const strValue = String(productValue);
            if (specFilter[strValue] === false) {
              console.log(`ProductsList: Product ${product.name} filtered out by spec`, { specKey, specValue: strValue, specFilter });
              return false;
            }
          }
        }
      }
      return true;
    });

    const sortedFilteredProducts = sortProducts(filteredBySpecs);
    console.log('ProductsList: Filtered products', JSON.stringify(sortedFilteredProducts, null, 2));
    setFilteredProducts(sortedFilteredProducts);
  };

  const handleSortChange = (field, direction) => {
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