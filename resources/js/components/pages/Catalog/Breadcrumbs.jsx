// Breadcrumbs.jsx
import { useLocation, Link } from 'react-router-dom';
import '../../../../css/components/Breadcrumbs.css';
import useCatalogData from '../../../hooks/useCatalogData';
import { useTranslation } from 'react-i18next';

const Breadcrumbs = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const queryParams = new URLSearchParams(location.search);
  const isFromSearch = queryParams.get('fromSearch') === 'true' || pathnames[0] === 'search';
  const searchQuery = queryParams.get('query') || '';
  const { filters, sortOption } = location.state || {};

  const isSearchProductPage = pathnames[0] === 'search' && pathnames.length === 2;
  const isCatalogProductPage = pathnames[0] === 'catalog' && pathnames.length === 4;
  const productId = isSearchProductPage ? pathnames[1] : isCatalogProductPage ? pathnames[3] : null;
  const category = isCatalogProductPage ? pathnames[1] : null;
  const subcategory = isCatalogProductPage ? pathnames[2] : null;

  const { data: productData, loading } = useCatalogData(
    isSearchProductPage || isCatalogProductPage ? 'product_details' : null,
    isSearchProductPage
      ? { id: productId, query: searchQuery }
      : { id: productId, category, subcategory, query: isFromSearch ? searchQuery : undefined }
  );

  // Используем имя продукта напрямую из данных
  const productName = productData?.name || '';

  const getDisplayName = (slug, index, pathArray) => {
    if (!slug) return null;
    if (index === -1) return t('nav.home');
    if (index === 0 && pathArray[0] === 'catalog' && pathArray.length === 1) return t('nav.catalog');
    if (index === 0 && slug === 'search') return t('search.mainTitle');
    if (index === 0 && pathArray[0] === 'catalog') {
      const categoryName = t(`category.${slug}`) || slug;
      return categoryName;
    }
    if (index === 1 && pathArray[0] === 'catalog') {
      const category = pathArray[1];
      const subcategoryKey = `subcategory.${category}.${slug}`;
      const subcategoryName = t(subcategoryKey) || slug;
      return typeof subcategoryName === 'object' && subcategoryName !== null && 'ru' in subcategoryName
        ? subcategoryName.ru
        : subcategoryName;
    }
    if ((index === 1 && pathArray[0] === 'search') || (index === 3 && pathArray[0] === 'catalog')) {
      if (loading) return ''; 
      return productName || '';
    }
    return slug.replace(/-/g, ' ').replace(/_/g, ' ');
  };

  const breadcrumbItems = [];

  breadcrumbItems.push({
    name: t('nav.home'),
    path: '/',
    isActive: false,
  });

  if (pathnames[0] === 'search') {
    breadcrumbItems.push({
      name: t('search.mainTitle'),
      path: {
        pathname: '/search',
        search: searchQuery ? `query=${encodeURIComponent(searchQuery)}` : '',
        state: { filters, sortOption },
      },
      isActive: pathnames.length === 1,
    });

    if (isSearchProductPage) {
      breadcrumbItems.push({
        name: productName || '',
        path: {
          pathname: `/search/${pathnames[1]}`,
          search: searchQuery ? `query=${encodeURIComponent(searchQuery)}` : '',
          state: { filters, sortOption },
        },
        isActive: true,
      });
    }
  } else if (pathnames[0] === 'catalog') {
    breadcrumbItems.push({
      name: t('nav.catalog'),
      path: '/catalog',
      isActive: pathnames.length === 1,
    });

    if (pathnames.length > 1) {
      breadcrumbItems.push({
        name: getDisplayName(pathnames[1], 0, pathnames),
        path: {
          pathname: `/catalog/${pathnames[1]}`,
          state: { filters, sortOption },
        },
        isActive: pathnames.length === 2,
      });

      if (pathnames.length > 2) {
        breadcrumbItems.push({
          name: getDisplayName(pathnames[2], 1, pathnames),
          path: {
            pathname: `/catalog/${pathnames[1]}/${pathnames[2]}`,
            state: { filters, sortOption },
          },
          isActive: pathnames.length === 3,
        });

        if (pathnames.length > 3) {
          breadcrumbItems.push({
            name: getDisplayName(pathnames[3], 3, pathnames),
            path: {
              pathname: `/catalog/${pathnames[1]}/${pathnames[2]}/${pathnames[3]}`,
              state: { filters, sortOption },
            },
            isActive: true,
          });
        }

        if (isCatalogProductPage && isFromSearch) {
          breadcrumbItems.splice(1, 0, {
            name: t('search.mainTitle'),
            path: {
              pathname: '/search',
              search: searchQuery ? `query=${encodeURIComponent(searchQuery)}` : '',
              state: { filters, sortOption },
            },
            isActive: false,
          });
          breadcrumbItems.pop();
          breadcrumbItems.push({
            name: productName || t('no_name'),
            path: {
              pathname: `/catalog/${pathnames[1]}/${pathnames[2]}/${pathnames[3]}`,
              search: searchQuery ? `fromSearch=true&query=${encodeURIComponent(searchQuery)}` : '',
              state: { filters, sortOption },
            },
            isActive: true,
          });
        }
      }
    }
  }

  return (
    <div className="breadcrumbs-container">
      {breadcrumbItems.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {index > 0 && <span className="breadcrumb-separator"> {'>'} </span>}
          {item.isActive ? (
            <span className="breadcrumb-active">{item.name}</span>
          ) : (
            <Link
              to={item.path}
              className={`breadcrumb-link ${item.className || ''}`}
              state={item.path.state}
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