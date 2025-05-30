import { useTranslation } from 'react-i18next';
import ProductPrice from './ProductPrice';

const ProductInfo = ({ name, price, discount, brand, description }) => {
  const { t, i18n } = useTranslation();

  console.log('ProductInfo: Props', { name, price, discount, brand, description });
  console.log('ProductInfo: Current locale', i18n.language);

  // Выбираем описание на основе текущего локейла
  const currentDescription = description?.[i18n.language] || description?.ru || description?.en || t('description_unavailable');

  return (
    <div className="product-info">
      <h1 className="product-name">{name || t('no_name')}</h1>
      <ProductPrice price={price} discount={discount} />
      <div className="product-description">
        <p>
          <strong>{t('description')}:</strong> {currentDescription}
        </p>
      </div>
      <p className="product-brand">
        {t('brand')}: {brand || t('no_brand')}
      </p>
    </div>
  );
};

export default ProductInfo;