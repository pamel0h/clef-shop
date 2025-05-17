import useCatalogData from '../../../hooks/useCatalogData';
import Category from '../../UI/Category';
import { getReadableCategory } from '../../../config/categoryMapping';
import '../../../../css/components/Categories.css';

const CategoriesList = () => {
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

// const CategoriesList = () => {
//   const { data, loading, error } = useCatalogData('categories');

//   if (error) return <div className="error">Error: {error.message}</div>;

//   return (
//     <div className="categories-list">
//       <h2>All Categories</h2>
//       <div className="categories-grid">
//         {loading ? (
//           Array(6).fill().map((_, index) => (
//             <div key={index} className="skeleton-category" />
//           ))
//         ) : (
//           data.map((category) => (
//             <Category
//               key={category}
//               to={`/catalog/${category}`}
//               title={category.replace(/_/g, ' ')}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

export default CategoriesList;