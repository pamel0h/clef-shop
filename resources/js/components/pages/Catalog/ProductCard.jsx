import { Link } from 'react-router-dom';
import ProductImage from '../../UI/ProductImage';
import ProductPrice from './ProductPrice';
import '../../../../css/components/Products.css';

const ProductCard = ({ product, isSearchPage, query, filters, sortOption }) => {
  const productId = product.id || product._id;
  const linkTo = isSearchPage
    ? `/search/${productId}${query ? `?query=${encodeURIComponent(query)}` : ''}`
    : `/catalog/${product.category}/${product.subcategory}/${productId}${query ? `?fromSearch=true&query=${encodeURIComponent(query)}` : ''}`;

  console.log('ProductCard: Link state', { filters, sortOption, linkTo }); // Отладка

  return (
    <div className="product-card">
      <Link
        to={linkTo}
        className="product-link"
        state={{ 
          filters: filters || {}, 
          sortOption: sortOption || { field: 'name', direction: 'asc' },
          fromSearch: isSearchPage, 
          searchQuery: isSearchPage ? query : undefined 
        }}
      >
        <div className="product-image-container">
          <ProductImage src={product.image} alt={product.name} variant="thumbnail" />
        </div>
        <h3 className="product-name">{product.name}</h3>
        <ProductPrice price={product.price} discount={product.discount} />
      </Link>
    </div>
  );
};

export default ProductCard;