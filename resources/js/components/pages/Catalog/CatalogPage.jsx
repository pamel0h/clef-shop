import { Outlet, useLocation } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import { useTranslation } from 'react-i18next';

const CatalogPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';
  const isFromSearch = queryParams.get('fromSearch') === 'true';

  // Preserve filters unless coming from search
  const contextFilters = isFromSearch ? {} : location.state?.filters || {};
  const contextSortOption = isFromSearch ? { field: 'name', direction: 'asc' } : location.state?.sortOption || { field: 'name', direction: 'asc' };

  console.log('CatalogPage: State', {
    query,
    location: location.pathname + location.search,
    filters: contextFilters,
    sortOption: contextSortOption,
    isFromSearch,
  });

  return (
    <div className="catalog">
      <div className="catalog-page page">
        <h1>{t('catalog.mainTitle')}</h1>
        <Breadcrumbs />
        <Outlet context={{ query, filters: contextFilters, sortOption: contextSortOption }} />
      </div>
    </div>
  );
};

export default CatalogPage;