// import { subcategories } from '../../../config/mockData';
import Category from '../../UI/Category';
import '../../../../css/components/Categories.css';
import useCatalogData from '../../../hooks/useCatalogData';
import { useParams } from 'react-router-dom'; 
import { getReadableCategory, getReadableSubcategory } from '../../../config/categoryMapping'; // Новый путь к маппингу
//добавить иконки

export const SubcategoriesList = () => {
  const { categorySlug } = useParams();
  const { data, loading, error } = useCatalogData('subcategories', categorySlug);

  // if (loading) return <div>Loading subcategories...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="categories-list">
      <h2>{getReadableCategory(categorySlug)}</h2>
      <div className="categories-grid">
        {data?.map((subcategory) => (
          <Category
            key={subcategory}
            to={`/catalog/${categorySlug}/${subcategory}`}
            title={getReadableSubcategory(categorySlug, subcategory)}
          />
        ))}
      </div>
    </div>
  );
};