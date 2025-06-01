import { useParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import {ProductFilter} from './ProductFilter';
import useProductFilteringAndSorting from '../../../hooks/useProductFilteringAndSorting';
import '../../../../css/components/Products.css';
import '../../../../css/components/Loading.css';

const ProductsList = ({ products: initialProducts = [], emptyMessage, isSearchPage = false, query }) => {
  const { categorySlug, subcategorySlug } = useParams();
  const { filteredProducts, sortOption, handleFilterChange, handleSortChange } = useProductFilteringAndSorting(
    initialProducts,
    { field: 'name', direction: 'asc' },
    isSearchPage
  );

  console.log('ProductsList: Filtered Products', filteredProducts); // Лог для отладки

  return (
    <div className="products-list-container">
<ProductFilter
  initialProducts={initialProducts}
  filteredByMainFilters={initialProducts} // ИЗМЕНЕНО: передаем initialProducts вместо filteredProducts
  filteredProducts={filteredProducts}
  onFilterChange={handleFilterChange}
  onSortChange={handleSortChange}
  sortOption={sortOption}
  isSearchPage={isSearchPage}
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
            <p>{emptyMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsList;