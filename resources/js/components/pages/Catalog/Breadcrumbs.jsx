// components/Breadcrumbs.jsx
import { useLocation, Link } from 'react-router-dom';
import { getReadableCategory, getReadableSubcategory } from '../../../config/categoryMapping';
import '../../../../css/components/Breadcrumbs.css';
import useCatalogData from '../../../hooks/useCatalogData';
import { useEffect, useState } from 'react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x && x !== 'catalog');
  const queryParams = new URLSearchParams(location.search);
  const [productName, setProductName] = useState('');
  const isFromSearch = queryParams.get('fromSearch') === 'true'; // Используем только query-параметр
  const searchQuery = queryParams.get('query') || ''; // Получаем query из URL

  // Проверяем, является ли это страницей товара
  const isProductPage = pathnames.length === 3;
  const productId = isProductPage ? pathnames[2] : null;
  const category = isProductPage ? pathnames[0] : null;
  const subcategory = isProductPage ? pathnames[1] : null;

  const { data: productData, loading, error } = useCatalogData(
    isProductPage ? 'product_details' : null,
    {
      id: productId,
      category,
      subcategory,
    }
  );

  useEffect(() => {
    if (isProductPage && productData?.name) {
      setProductName(productData.name);
    }

    // Логи для отладки
    console.log('Breadcrumbs: isFromSearch=', isFromSearch);
    console.log('Breadcrumbs: searchQuery=', searchQuery);
    console.log('Breadcrumbs: isProductPage=', isProductPage);
    console.log('Breadcrumbs: productName=', productName);
    console.log('Breadcrumbs: productData=', productData);
  }, [isFromSearch, searchQuery, isProductPage, productData]);

  const getDisplayName = (slug, index, pathArray) => {
    if (!slug) return null;
    if (index === -1) return 'Главная';
    if (index === 0 && pathArray.length === 0) return 'Каталог';
    if (index === 0) return getReadableCategory(slug) || slug;
    if (index === 1) {
      const category = pathArray[0];
      const name = getReadableSubcategory(category, slug) || slug;
      return typeof name === 'object' ? name.name : name;
    }
    if (index === 2 && isFromSearch && productName) {
      return productName;
    }
    return slug.replace(/-/g, ' ').replace(/_/g, ' ');
  };

  const breadcrumbItems = [];

  // Главная
  breadcrumbItems.push({
    name: 'Главная',
    path: '/',
    isActive: false,
  });

  // Если это страница из поиска
  if (isFromSearch && isProductPage) {
    breadcrumbItems.push({
      name: 'Поиск',
      path: {
        pathname: '/search',
        search: searchQuery ? `?query=${encodeURIComponent(searchQuery)}` : '',
      },
      isActive: false,
    });
    breadcrumbItems.push({
      name: productName || 'Товар',
      path: location.pathname,
      isActive: true,
    });
  }
  // Каталог и его подразделы
  else if (location.pathname.startsWith('/catalog')) {
    breadcrumbItems.push({
      name: 'Каталог',
      path: '/catalog',
      isActive: pathnames.length === 0,
    });

    if (pathnames.length > 0) {
      breadcrumbItems.push({
        name: getDisplayName(pathnames[0], 0, pathnames),
        path: `/catalog/${pathnames[0]}`,
        isActive: pathnames.length === 1,
      });

      if (pathnames.length > 1) {
        breadcrumbItems.push({
          name: getDisplayName(pathnames[1], 1, pathnames),
          path: `/catalog/${pathnames[0]}/${pathnames[1]}`,
          isActive: pathnames.length === 2,
        });

        if (pathnames.length > 2) {
          breadcrumbItems.push({
            name: getDisplayName(pathnames[2], 2, pathnames),
            path: `/catalog/${pathnames[0]}/${pathnames[1]}/${pathnames[2]}`,
            isActive: pathnames.length === 3,
          });
        }
      }
    }
  }
  // Для страницы поиска (не товара)
  else if (location.pathname.startsWith('/search')) {
    breadcrumbItems.push({
      name: 'Поиск',
      path: `/search${searchQuery ? `?query=${encodeURIComponent(searchQuery)}` : ''}`,
      isActive: true,
    });
  }

  console.log('Breadcrumbs: breadcrumbItems=', breadcrumbItems);

  return (
    <div className="breadcrumbs-container">
      {breadcrumbItems.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {index > 0 && <span className="breadcrumb-separator"> > </span>}
          {item.isActive ? (
            <span className="breadcrumb-active">{item.name}</span>
          ) : (
            <Link
              to={{
                pathname: typeof item.path === 'string' ? item.path : item.path.pathname,
                search: typeof item.path === 'object' ? item.path.search : undefined,
              }}
              className={`breadcrumb-link ${item.className || ''}`}
            >
              {item.name}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;