import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../../../context/CartContext';
import ProductImage from '../../UI/ProductImage';
import ProductPrice from './ProductPrice';
import Button from '../../UI/Button';
import '../../../../css/components/Products.css';

const ProductCard = ({ product, isSearchPage, query, filters, sortOption }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const productId = product.id || product._id;
  
  const linkTo = isSearchPage
    ? `/search/${productId}${query ? `?query=${encodeURIComponent(query)}` : ''}`
    : `/catalog/${product.category}/${product.subcategory}/${productId}${query ? `?fromSearch=true&query=${encodeURIComponent(query)}` : ''}`;

  const handleAddToCart = async () => {
    const result = await addToCart(product.id, 1);
    if (result.success) {
      setIsAdded(true);
     
      setTimeout(() => setIsAdded(false), 2000);
    } else {
      console.error(result.error);
    }
  };

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
          <ProductImage src={product.image} alt={product.name} />
        </div>
        <h3 className="product-name">{product.name}</h3>
        <ProductPrice price={product.price} discount={product.discount} />
      </Link>
      <Button 
        onClick={handleAddToCart}
        disabled={isAdded} 
      >
        {isAdded ? t('cart.added_to_cart') : t('cart.add_to_cart')}
      </Button>
    </div>
  );
};

export default ProductCard;