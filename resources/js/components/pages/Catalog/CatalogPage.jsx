// pages/CatalogPage.jsx
import { Outlet } from 'react-router-dom';

const CatalogPage = () => {
    return (
        <div className="catalog-page page">
            <h1>Catalog</h1>
            <Outlet /> 
        </div>
    );
};
export default CatalogPage;