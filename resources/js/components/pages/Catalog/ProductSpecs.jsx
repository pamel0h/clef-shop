import { useTranslation } from 'react-i18next';

const ProductSpecs = ({ specs }) => {
  const { t } = useTranslation();
    if (!specs) return null;
    
    return (
        <div className='specs-block'>
        <h3>Характеристики товара:</h3>
      <ul className="product-specs">
        {Object.entries(specs).map(([key, value]) => (
          <li key={key}>{t(`specs.${key}`)}: {value}</li>
        ))}
      </ul>
      </div>
    );
  };
  export default ProductSpecs;