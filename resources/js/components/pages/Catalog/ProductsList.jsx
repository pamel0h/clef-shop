import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ProductFilter } from './ProductFilter';
import '../../../../css/components/Products.css';
import '../../../../css/components/Loading.css';

const ProductsList = ({ products: initialProducts = [], emptyMessage, isSearchPage = false, query }) => {
  const { categorySlug, subcategorySlug } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    console.log('ProductsList: Received products', initialProducts, 'isSearchPage:', isSearchPage, 'query:', query);
    setFilteredProducts(initialProducts);
  }, [initialProducts]);

  const handleFilterChange = (newFilters) => {
    const filtered = initialProducts.filter((product) => {
      const price = Number(product.price);
      if (newFilters.priceRange && price > newFilters.priceRange[1]) return false;
      if (newFilters.brand !== 'all' && product.brand !== newFilters.brand) return false;
      if (isSearchPage && newFilters.category !== 'all' && product.category !== newFilters.category) return false;
      if (isSearchPage && newFilters.subcategory !== 'all' && product.subcategory !== newFilters.subcategory) return false;
      return true;
    });
    console.log('ProductsList: Filtered products', filtered);
    setFilteredProducts(filtered);
  };

  return (
    <div className="products-list-container">
      <ProductFilter products={initialProducts} onFilterChange={handleFilterChange} />
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