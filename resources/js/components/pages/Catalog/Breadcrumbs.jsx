// components/Breadcrumbs.jsx
import { useLocation, Link } from 'react-router-dom';
import { getReadableCategory, getReadableSubcategory } from '../../../config/categoryMapping';
import '../../../../css/components/Breadcrumbs.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x && x !== 'catalog');

  const getDisplayName = (slug, index, pathArray) => {
    if (slug === '' || slug == null) return null; // Добавляем проверку на null/undefined
    if (index === -1) return 'Главная';
    if (index === 0 && pathArray.length === 0) return 'Каталог';
    if (index === 0) return getReadableCategory(slug) || slug;
    if (index === 1) {
        const category = pathArray[0];
        const name = getReadableSubcategory(category, slug) || slug;
        return typeof name === 'object' ? name.name : name;
    }
    return slug.replace(/_/g, ' ');
};

  const breadcrumbItems = [];
  
  // Главная
  breadcrumbItems.push({
    name: 'Главная',
    path: '/',
    isActive: false,
    // className: 'breadcrumb-main' // Добавляем специальный класс для главной
  });

  // Каталог и его подразделы
  if (location.pathname.startsWith('/catalog')) {
    breadcrumbItems.push({
      name: 'Каталог',
      path: '/catalog',
      isActive: pathnames.length === 0
    });

    if (pathnames.length > 0) {
      breadcrumbItems.push({
        name: getDisplayName(pathnames[0], 0, pathnames),
        path: `/catalog/${pathnames[0]}`,
        isActive: pathnames.length === 1
      });

      if (pathnames.length > 1) {
        breadcrumbItems.push({
          name: getDisplayName(pathnames[1], 1, pathnames),
          path: `/catalog/${pathnames[0]}/${pathnames[1]}`,
          isActive: pathnames.length === 2
        });
      }
    }
  }

  return (
    <div className="breadcrumbs-container">
      {breadcrumbItems.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {index > 0 && <span className="breadcrumb-separator"> &gt; </span>}
          {item.isActive ? (
            <span className="breadcrumb-active">{item.name}</span>
          ) : (
            <Link to={item.path} className={`breadcrumb-link ${item.className || ''}`}>
              {item.name}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;