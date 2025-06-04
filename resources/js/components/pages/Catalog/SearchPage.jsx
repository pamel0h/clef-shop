import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from './Breadcrumbs';

const SearchPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';
  const isFromCatalog = queryParams.get('fromSearch') === 'true';

  const contextFilters = isFromCatalog ? {} : location.state?.filters || {};
  const contextSortOption = isFromCatalog ? { field: 'name', direction: 'asc' } : location.state?.sortOption || { field: 'name', direction: 'asc' };
  
  return (
    <div className="search-page page">
      <h1>{t('search.mainTitle')}</h1>
      <Breadcrumbs />
      <Outlet context={{ query, filters: contextFilters, sortOption: contextSortOption }} />
    </div>
  );
};

export default SearchPage;