
import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import ProductPrice from './ProductPrice';
import '../../../../css/components/Products.css';

const ProductCard = ({ product, categorySlug, subcategorySlug }) => {
  return (
    <div className="product-card">
      <Link 
        // to={`/catalog/${categorySlug}/${subcategorySlug}/${product.id}`}
        to={`/catalog/${encodeURIComponent(product.category)}/${encodeURIComponent(product.subcategory)}/${product.id}`}
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