// CatalogPage.jsx
import { Outlet, useLocation } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import { useTranslation } from 'react-i18next';

const CatalogPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';
  const isFromSearch = queryParams.get('fromSearch') === 'true';

  // Сбрасываем фильтры, если пришли из поиска
  const contextFilters = isFromSearch ? null : location.state?.filters || null;
  const contextSortOption = isFromSearch ? null : location.state?.sortOption || null;

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
        <Outlet context={{ filters: contextFilters, sortOption: contextSortOption }} />
      </div>
    </div>
  );
};

export default CatalogPage;