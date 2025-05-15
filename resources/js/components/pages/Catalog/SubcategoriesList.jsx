import { Link, useParams } from 'react-router-dom';
import { subcategories } from '../../../config/mockData';

export const SubcategoriesList = () => {
  const { categorySlug } = useParams();

  return (
    <div>
      <h2>Подкатегории для {categorySlug}</h2>
      <ul>
        {(subcategories[categorySlug] || []).map(sub => (
          <li key={`subcat-${sub.slug}`}>
            <Link to={`/catalog/${categorySlug}/${sub.slug}`}>
              {sub.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};