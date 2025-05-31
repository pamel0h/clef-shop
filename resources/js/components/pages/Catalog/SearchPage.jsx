// SearchPage.jsx
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from './Breadcrumbs';

const SearchPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';
  const isFromCatalog = queryParams.get('fromSearch') === 'true';

  // Сбрасываем фильтры, если пришли из каталога
  const contextFilters = isFromCatalog ? null : location.state?.filters || null;
  const contextSortOption = isFromCatalog ? null : location.state?.sortOption || null;

  console.log('SearchPage: State', {
    query,
    location: location.pathname + location.search,
    filters: contextFilters,
    sortOption: contextSortOption,
    isFromCatalog,
  });

  return (
    <div className="search-page page">
      <h1>{t('search.mainTitle')}</h1>
      <Breadcrumbs />
      <Outlet context={{ query, filters: contextFilters, sortOption: contextSortOption }} />
    </div>
  );
};

export default SearchPage;