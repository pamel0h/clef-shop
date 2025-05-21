import { Link } from 'react-router-dom';
import '../../../../css/components/Products.css';

const ProductCard = ({ product, categorySlug, subcategorySlug }) => {
  console.log(product.image);
  return (
    <div className="product-card">
      <Link 
        to={`/catalog/${categorySlug}/${subcategorySlug}/${product.id}`}
        className="product-link"
      >
        
        <div className="product-image-container">
          <img 
            src={product.image || 'storage/product_images/no-image.png'} 
            alt={product.name} 
            className="product-image"
          />
        </div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price} ₽</p>
      </Link>
    </div>
  );
};

export default ProductCard;