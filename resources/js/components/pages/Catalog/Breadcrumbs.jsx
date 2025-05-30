import { useLocation, Link } from 'react-router-dom';
import '../../../../css/components/Breadcrumbs.css';
import useCatalogData from '../../../hooks/useCatalogData';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Breadcrumbs = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const queryParams = new URLSearchParams(location.search);
  const [productName, setProductName] = useState('');
  const isFromSearch = queryParams.get('fromSearch') === 'true' || pathnames[0] === 'search';
  const searchQuery = queryParams.get('query') || '';

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

  useEffect(() => {
    if ((isSearchProductPage || isCatalogProductPage) && productData?.name) {
      setProductName(
        typeof productData.name === 'object' && productData.name !== null && 'ru' in productData.name
          ? productData.name.ru
          : productData.name
      );
    }
  }, [isSearchProductPage, isCatalogProductPage, productData]);

  const getDisplayName = (slug, index, pathArray) => {
    console.log('getDisplayName: Args', { slug, index, pathArray });
    if (!slug) return null;
    if (index === -1) return t('nav.home');
    if (index === 0 && pathArray[0] === 'catalog' && pathArray.length === 1) return t('nav.catalog');
    if (index === 0 && slug === 'search') return t('search.mainTitle');
    if (index === 0 && pathArray[0] === 'catalog') {
      const categoryName = t(`category.${slug}`) || slug;
      console.log('getDisplayName: Category', { slug, categoryName });
      return categoryName;
    }
    if (index === 1 && pathArray[0] === 'catalog') {
      const category = pathArray[1];
      const subcategoryKey = `subcategory.${category}.${slug}`;
      const subcategoryName = t(subcategoryKey) || slug;
      console.log('getDisplayName: Subcategory', { slug, category, subcategoryKey, subcategoryName });
      return typeof subcategoryName === 'object' && subcategoryName !== null && 'ru' in subcategoryName
        ? subcategoryName.ru
        : subcategoryName;
    }
    if ((index === 1 && pathArray[0] === 'search') || (index === 3 && pathArray[0] === 'catalog')) {
      if (loading) return null;
      console.log('getDisplayName: Product', { productName });
      return productName;
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
      },
      isActive: pathnames.length === 1,
    });

    if (isSearchProductPage) {
      breadcrumbItems.push({
        name: productName,
        path: {
          pathname: `/search/${pathnames[1]}`,
          search: searchQuery ? `query=${encodeURIComponent(searchQuery)}` : '',
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
        path: `/catalog/${pathnames[1]}`,
        isActive: pathnames.length === 2,
      });

      if (pathnames.length > 2) {
        breadcrumbItems.push({
          name: getDisplayName(pathnames[2], 1, pathnames),
          path: `/catalog/${pathnames[1]}/${pathnames[2]}`,
          isActive: pathnames.length === 3,
        });

        if (pathnames.length > 3) {
          breadcrumbItems.push({
            name: getDisplayName(pathnames[3], 3, pathnames),
            path: `/catalog/${pathnames[1]}/${pathnames[2]}/${pathnames[3]}`,
            isActive: true,
          });
        }

        if (isCatalogProductPage && isFromSearch) {
          breadcrumbItems.splice(1, 0, {
            name: t('search.mainTitle'),
            path: {
              pathname: '/search',
              search: searchQuery ? `query=${encodeURIComponent(searchQuery)}` : '',
            },
            isActive: false,
          });
          breadcrumbItems.pop();
          breadcrumbItems.push({
            name: productName,
            path: {
              pathname: `/catalog/${pathnames[1]}/${pathnames[2]}/${pathnames[3]}`,
              search: searchQuery ? `fromSearch=true&query=${encodeURIComponent(searchQuery)}` : '',
            },
            isActive: true,
          });
        }
      }
    }
  }

  console.log('Breadcrumbs: Items', breadcrumbItems);

  return (
    <div className="breadcrumbs-container">
      {breadcrumbItems.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {index > 0 && <span className="breadcrumb-separator"> {'>'} </span>}
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