import { Outlet, useLocation } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import { useTranslation } from 'react-i18next';

const CatalogPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || ''; // Извлекаем query из URL или пустая строка

  console.log('CatalogPage: State', {
    query,
    location: location.pathname + location.search,
  });

  return (
    <div className="catalog">
      <div className="catalog-page page">
        <h1>{t('catalog.mainTitle')}</h1>
        {/* <Breadcrumbs /> */}
        <Outlet context={{ query }} />
      </div>
    </div>
  );
};

export default CatalogPage;