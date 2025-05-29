// pages/CatalogPage.jsx
import { Outlet, useLocation } from 'react-router-dom';
import  Breadcrumbs  from './Breadcrumbs';
import { useTranslation } from 'react-i18next';
const CatalogPage = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const isFromSearch = queryParams.get('fromSearch') === 'true';
  
    // Заголовок зависит от параметра fromSearch
    const pageTitle = isFromSearch ? t('search.mainTitle') : t('catalog.mainTitle');

    return (
        <div className="catalog">
        <div className="catalog-page page">
            <h1>{pageTitle}</h1>
            <Breadcrumbs /> 
            <Outlet /> 
        </div>
        </div>
    );
};
export default CatalogPage;