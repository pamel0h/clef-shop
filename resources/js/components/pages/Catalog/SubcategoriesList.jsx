import { Outlet } from 'react-router-dom';

import Category from '../../UI/Category';
import '../../../../css/components/Categories.css';
import useCatalogData from '../../../hooks/useCatalogData';
import { useParams } from 'react-router-dom'; 
import { getReadableCategory, getReadableSubcategory } from '../../../config/categoryMapping'; // Новый путь к маппингу
//добавить иконки

export const SubcategoriesList = () => {
  console.log('SubCategoriesList rendered'); 
  const { categorySlug } = useParams();
  console.log('SubcategoriesList params:', { categorySlug });

  if (!categorySlug) {
    console.warn('Category slug is undefined');
    return <div>Ошибка: категория не указана</div>;
  }

  const { data, loading, error } = useCatalogData('subcategories', { category: categorySlug });
  console.log('Subcategories data:', { data, loading, error });

  // if (loading) return <div className="subcategories-page">Загрузка подкатегорий...</div>;
  if (error) return <div className="subcategories-page">Ошибка: {error.message}</div>;

  return (
     <div className="subcategories-page categories-list"> 
      <h2>{getReadableCategory(categorySlug)}</h2>
      <div className="categories-grid">
        {data?.length > 0 ? (
          data.map((subcategory) => {
            console.log('Rendering subcategory:', subcategory, 'Link:', `/catalog/${categorySlug}/${subcategory}`);
            const subcategoryTitle = typeof getReadableSubcategory(categorySlug, subcategory) === 'object'
              ? getReadableSubcategory(categorySlug, subcategory).name
              : getReadableSubcategory(categorySlug, subcategory);

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