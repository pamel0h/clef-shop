//CatalogPage.jsx
import { Outlet } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';

const CatalogPage = () => {
    return (
        <div className="catalog-page page">
            <h1>Catalog</h1>
            <Breadcrumbs /> 
            <Outlet /> 
        </div>
    );
};
export default CatalogPage;