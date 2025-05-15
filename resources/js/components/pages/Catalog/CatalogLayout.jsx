// components/Catalog/CatalogLayout.jsx
import { Outlet } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';

export const CatalogLayout = () => {
  return (
    <div className="catalog">
      <Breadcrumbs />
      <Outlet />  {/* Сюда подставится содержимое страницы */}
    </div>
  );
};