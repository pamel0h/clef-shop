import { categories } from '../../../config/mockData';
import Category from '../../UI/Category';
import '../../../../css/components/Categories.css'
//добавить иконки и переход по хлебным крошкам

const CategoriesList = () => {

  return (
    <div className="categories-list">
      <h2>All Categories</h2>
      <div className='categories-grid'>
          {categories.map((category) => (
            <Category
              key={`cat-${category.slug}`}
              to={`/catalog/${category.slug}`}
              title={category.name}
            />
        ))}
      </div>
      
    </div>
  );
};

export default CategoriesList;