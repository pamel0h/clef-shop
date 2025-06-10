import { useTranslation } from 'react-i18next';

const ProductSpecs = ({ specs }) => {
  const { t } = useTranslation();
    if (!specs) return null;
    
    return (
      <div className='specs-block'>
        <h3>{t('specs.mainTitle')}:</h3>
        {(!specs || Object.keys(specs).length === 0) ? (
            <p>{t('specs.noSpecs')}</p>
          ) : (
            <ul className="product-specs">
              {Object.entries(specs).map(([key, value]) => (
                <li key={key}>{t(`specs.${key}`)}: {value}</li>
              ))}
            </ul>
            )}
      </div>
    );
  };
  export default ProductSpecs;