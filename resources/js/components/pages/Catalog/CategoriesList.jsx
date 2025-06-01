import useCatalogData from '../../../hooks/useCatalogData';
import Category from '../../UI/Category';
import '../../../../css/components/Categories.css';
import '../../../../css/components/Loading.css';
import { useTranslation } from 'react-i18next';


const CategoriesList = () => {
  const { t } = useTranslation();

  console.log('CategoriesList RENDERED at:', new Date().toISOString());
  const { data, loading, error } = useCatalogData('categories');

  if (loading) return <div className="loading"></div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="categories-list">
      <h2>{t('catalog.categories')}</h2>
      <div className="categories-grid">
        {data.map((category) => (
          <Category
            key={category}
            to={`/catalog/${category}`}
            title={t(`category.${category}`)}
          />
        ))}
      </div>
    </div>
  );
};

 export default CategoriesList;
