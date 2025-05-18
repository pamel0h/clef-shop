// components/Catalog/CatalogLayout.jsx
import { Outlet } from 'react-router-dom';

export const CatalogLayout = () => {
  return (
    <div className="catalog">
      <Outlet /> {/* Только содержимое страницы */}
    </div>
  );
};