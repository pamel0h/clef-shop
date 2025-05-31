// pages/CatalogPage.jsx
import { Outlet } from 'react-router-dom';

import  Breadcrumbs from './Breadcrumbs';
import { useTranslation } from 'react-i18next';
const CatalogPage = () => {

    const { t } = useTranslation();
    return (
        <div className="catalog-page page">
            <h1>{t('catalog.mainTitle')}</h1>
            <Breadcrumbs /> 
            <Outlet /> 
        </div>
    );
};
export default CatalogPage;