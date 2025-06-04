import { useTranslation } from 'react-i18next';
import ProductPrice from './ProductPrice';
import { useCart } from '../../../../context/CartContext'; // Импортируем useCart
import Button from '../../UI/Button';

const ProductInfo = ({ name, price, discount, brand, description }) => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart(); // Получаем функцию addToCart

  const handleAddToCart = async () => {
    const result = await addToCart(product.id, 1); // Добавляем 1 товар
    if (!result.success) {
        console.error(result.error);
    }
};

  // Выбираем описание на основе текущего локейла
  const currentDescription = description?.[i18n.language] || description?.ru || description?.en || t('description_unavailable');

  return (
    <div className="product-info">
      <h1 className="product-name">{name || t('no_name')}</h1>
      <ProductPrice price={price} discount={discount} />
      <Button onClick={handleAddToCart}>
                {t('cart.add_to_cart')}
      </Button>
      <div className="product-description">
        <p>
          {/* <strong>{t('description')}:</strong>  */}
          {currentDescription}
        </p>
      </div>
      <p className="product-brand">
        {t('brand')}: {brand || t('no_brand')}
      </p>
    </div>
  );
};

export default ProductInfo;