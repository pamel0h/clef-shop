// components/pages/Catalog/CategoriesList.jsx
import { Link } from 'react-router-dom';
import { categories } from '../../../config/mockData';

const CategoriesList = () => {
  return (
    <div>
      <h2>All Categories</h2>
      <ul>
        {categories.map((category, index) => (
          <li key={`cat-${category.slug}-${index}`}> {/* Используем slug + index */}
            <Link to={`/catalog/${category.slug}`}>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesList;