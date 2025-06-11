import { useTranslation } from 'react-i18next';
import ProductPrice from './ProductPrice';
import { useCart } from '../../../../context/CartContext'; // Импортируем useCart
import Button from '../../UI/Button';

const ProductInfo = 
({ id, name, price, discount, brand, description,category,subcategory }) => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart(); // Получаем функцию addToCart

  const handleAddToCart = async () => {
    const result = await addToCart(id, 1); // Добавляем 1 товар
    if (!result.success) {
        console.error(result.error);
    }
};

  // Выбираем описание на основе текущего локейла
  const currentDescription = description?.[i18n.language] || description?.ru || description?.en || t('description_unavailable');

  return (
    <div className="product-info">
      <h1 className="product-name">{name || t('catalog.no_name')}</h1>
      <ProductPrice price={price} discount={discount} />
      <Button onClick={handleAddToCart}>
                {t('cart.add_to_cart')}
      </Button>
      <div className="product-description">
        <p>
          <strong>{t('catalog.description')}: </strong> 
          {currentDescription}
        </p>
      </div>
      <div className="product-brand">
        <p>
        <strong>{t('catalog.brand')}: </strong>  
        {brand || t('catalog.no_brand')}
        </p>
      </div>
      <div className="product-category">
        <p>
        <strong>{t('catalog.category')}: </strong>  
        {t(`category.${category}`) || t('catalog.no_category')}
        </p>
      </div>
      <div className="product-subcategory">
        <p>
        <strong>{t('catalog.subcategory')}: </strong>  
        {t(`subcategory.${category}.${subcategory}`) || t('catalog.no_subcategory')}
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;