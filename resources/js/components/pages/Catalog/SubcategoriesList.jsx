import { Link, useParams } from 'react-router-dom';
// import { subcategories } from '../../../config/mockData';
import Category from '../../UI/Category';
import '../../../../css/components/Categories.css';
import useCatalogData from '../../../hooks/useCatalogData';
//добавить иконки

export const SubcategoriesList = () => {
  const { category } = useParams();
  const { data, loading, error } = useCatalogData('subcategories', category);
  
  const subcategories = Array.isArray(data) ? data : [];

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="categories-list">
      <h2>Подкатегории: {category}</h2>
      <div className='categories-grid'>
        {subcategories.map(subcategory => (
          <Category
            key={`subcat-${subcategory}`}
            to={`/catalog/${category}/${subcategory}`}
            title={subcategory}
          />
        ))}
      </div>
    </div>
  );
};