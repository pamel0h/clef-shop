
import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import ProductPrice from './ProductPrice';
import Button from '../../UI/Button'
import '../../../../css/components/Products.css';

const ProductCard = ({ product, categorySlug, subcategorySlug }) => {
  return (
    <div className="product-card">
      <Link 
        to={`/catalog/${categorySlug}/${subcategorySlug}/${product.id}`}
        className="product-link"
      >
        <div className="product-image-container">
          <ProductImage src={product.image} alt={product.name} />
        </div>
        <h3 className="product-name">{product.name}</h3>
        <ProductPrice price={product.price} discount={product.discount} />
      </Link>
      <Button>В корзину</Button>
    </div>
  );
};

export default ProductCard;