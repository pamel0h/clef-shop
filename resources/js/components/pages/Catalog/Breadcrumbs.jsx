// import { Link, useLocation } from 'react-router-dom';
// import '../../../../css/components/Breadcrumbs.css';
// import useCatalogData from '../../../hooks/useCatalogData';
// import { getReadableCategory, getReadableSubcategory } from '../../../config/categoryMapping';

// export const Breadcrumbs = () => {
//   console.log('Breadcrumbs RENDERED at:', new Date().toISOString());
//   const { pathname } = useLocation();
//   const paths = pathname.split('/').filter(Boolean);

// // Получаем категории с указанием caller
// const { data: categories, loading: catLoading, error: catError } = useCatalogData('categories', {}, 'Breadcrumbs-categories');

// // Получаем подкатегории только если есть категория
// const currentCategory = paths[1];
// const { data: subcategories, loading: subLoading, error: subError } = currentCategory
//   ? useCatalogData('subcategories', { category: currentCategory }, 'Breadcrumbs-subcategories')
//   : { data: [], loading: false, error: null };

// const getNameBySlug = (slug, parentSlug = null) => {
//   if (slug === 'catalog') {
//     return 'Каталог';
//   }
//     // Проверяем категории
//     if (!catLoading && !catError && categories) {
//       const category = categories.find(cat => cat === slug);
//       if (category) {
//         return getReadableCategory(slug);
//       }
//     }
//     if (parentSlug && !subLoading && !subError && subcategories) {
//       const subcategory = subcategories.find(sub => sub === slug);
//       if (subcategory) {
//         return getReadableSubcategory(parentSlug, slug);
//       }
//     }
//     return parentSlug ? getReadableSubcategory(parentSlug, slug) : getReadableCategory(slug);
//   };

//   if (catLoading || subLoading) return <div className="breadcrumbs">Загрузка...</div>;
//   if (catError) return <div className="breadcrumbs">Ошибка: {catError.message}</div>;
//   if (subError && paths.length > 2) return <div className="breadcrumbs">Ошибка: {subError.message}</div>;

//   return (
//     <div className="breadcrumbs">
//       <Link to="/">Главная</Link>
//       {paths.map((path, i) => {
//         const parentSlug = i > 0 ? paths[i - 1] : null;
//         return (
//           <span key={path}>
//             › <Link to={`/${paths.slice(0, i + 1).join('/')}`}>
//               {getNameBySlug(path, parentSlug)}
//             </Link>
//           </span>
//         );
//       })}
//     </div>
//   );
// };

// export default Breadcrumbs;


// components/Breadcrumbs.jsx
import { useLocation, Link } from 'react-router-dom';
import { getReadableCategory, getReadableSubcategory } from '../../../config/categoryMapping';
import '../../../../css/components/Breadcrumbs.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x && x !== 'catalog');

  const getDisplayName = (slug, index, pathArray) => {
    if (slug === '') return null;
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