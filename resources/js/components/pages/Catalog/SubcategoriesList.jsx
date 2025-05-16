import { Link, useParams } from 'react-router-dom';
import { subcategories } from '../../../config/mockData';
import Category from '../../UI/Category';
import '../../../../css/components/Categories.css'
//добавить иконки

export const SubcategoriesList = () => {
  const { categorySlug } = useParams();

  return (
    <div  className="categories-list">
      <h2>Подкатегории для {categorySlug}</h2>
      <div className='categories-grid'>
        {(subcategories[categorySlug] || []).map(sub => (
          <Category
            key={`subcat-${sub.slug}`}
            to={`/catalog/${categorySlug}/${sub.slug}`}
            title={sub.name}
            >
          </Category>
        ))}
       </div>
    </div>
  );
};