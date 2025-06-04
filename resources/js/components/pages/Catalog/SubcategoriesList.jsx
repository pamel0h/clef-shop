import { Outlet } from 'react-router-dom';

import Category from '../../UI/Category';
import '../../../../css/components/Categories.css';
import useCatalogData from '../../../hooks/useCatalogData';
import { useParams } from 'react-router-dom'; 
import '../../../../css/components/Loading.css';
import { useTranslation } from 'react-i18next';
//добавить иконки

export const SubcategoriesList = () => {
  const { t } = useTranslation();
  const { categorySlug } = useParams();

  if (!categorySlug) {
    console.warn('Category slug is undefined');
    return <div>Ошибка: категория не указана</div>;
  }

  const { data, loading, error } = useCatalogData('subcategories', { category: categorySlug });

  if (loading) return <div className="loading"></div>;
  if (error) return <div className="error">Ошибка: {error.message}</div>;

  return (
     <div className="subcategories-page categories-list"> 
      <h2>{t(`category.${categorySlug}`)}</h2>
      <div className="categories-grid">
        {data?.length > 0 ? (
          data.map((subcategory) => {
            const subcategoryTitle=t(`subcategory.${categorySlug}.${subcategory}`)
            return (
              <Category
                key={subcategory}
                to={`/catalog/${categorySlug}/${subcategory}`}
                title={subcategoryTitle}
                type="subcategory"
              />
            );
          })
        ) : (
          !loading &&  <p>Подкатегорий не найдено</p>
        )}
      </div>
      <Outlet />
    </div>
  );
};

export default SubcategoriesList;