//components/Catalog/Breadcrumbs.jsx
import { Link, useLocation } from 'react-router-dom';
import '../../../../css/components/Breadcrumbs.css';
import { categories, subcategories } from '../../../config/mockData';

export const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const paths = pathname.split('/').filter(Boolean);

  // Функция для получения имени по slug
  const getNameBySlug = (slug, parentSlug = null) => {
    // Проверяем категории
    const category = categories.find(cat => cat.slug === slug);
    if (category) return category.name;
    
    // Проверяем подкатегории
    if (parentSlug && subcategories[parentSlug]) {
      const subcategory = subcategories[parentSlug].find(sub => sub.slug === slug);
      if (subcategory) return subcategory.name;
    }
    if(slug=='catalog'){
      const name = 'Каталог';
      return name;
    }
    return slug; // Если не нашли, возвращаем slug как есть
  };

  return (
    <div className="breadcrumbs">
      <Link to="/">Главная</Link>
      {paths.map((path, i) => {
        const parentSlug = i > 0 ? paths[i-1] : null;
        return (
          <span key={path}>
            › <Link to={`/${paths.slice(0, i+1).join('/')}`}>
              {getNameBySlug(path, parentSlug)}
            </Link>
          </span>
        );
      })}
    </div>
  );
};