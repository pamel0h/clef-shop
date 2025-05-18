import useCatalogData from '../../../hooks/useCatalogData';
import Category from '../../UI/Category';
import { getReadableCategory } from '../../../config/categoryMapping';
import '../../../../css/components/Categories.css';

const CategoriesList = () => {
  console.log('CategoriesList RENDERED at:', new Date().toISOString());
  const { data, loading, error } = useCatalogData('categories');

  // if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="categories-list">
      <h2>All Categories</h2>
      <div className="categories-grid">
        {data.map((category) => (
          <Category
            key={category}
            to={`/catalog/${category}`}
            title={getReadableCategory(category)}
          />
        ))}
      </div>
    </div>
  );
};

 export default CategoriesList;
