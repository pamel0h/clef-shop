// components/ProductCard.jsx
import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import ProductPrice from './ProductPrice';
import '../../../../css/components/Products.css';

const ProductCard = ({ product, isSearchPage, query }) => {
  return (
    <div className="product-card">
      <Link
        to={{
          pathname: `/catalog/${product.category}/${product.subcategory}/${product.id}`,
          search: isSearchPage ? `?fromSearch=true&query=${encodeURIComponent(query || '')}` : '',
          state: { fromSearch: isSearchPage, searchQuery: isSearchPage ? query : undefined },
        }}
        className="product-link"
      >
        <div className="product-image-container">
          <ProductImage src={product.image} alt={product.name} />
        </div>
        <h3 className="product-name">{product.name}</h3>
        <ProductPrice price={product.price} discount={product.discount} />
      </Link>
    </div>
  );
};

export default ProductCard;