import { useLocation, Outlet } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import { useTranslation } from 'react-i18next';

function SearchPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';

  return (
    <div className="search-page page">
      <h1>{t('search.mainTitle')}</h1>
      <Breadcrumbs />
      {location.pathname === '/search' && (
        <h2>Результаты поиска по запросу: {query || 'Ничего не введено'}</h2>
      )}
      <Outlet context={{ query }} />
    </div>
  );
}

export default SearchPage;