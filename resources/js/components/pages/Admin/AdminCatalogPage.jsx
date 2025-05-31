import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useCatalogData from '../../../hooks/useCatalogData';
import Button from '../../UI/Button';
// import '../../../../css/components/AdminCatalog.css'; // Убедись, что этот файл существует

const AdminCatalogPage = () => {
  const { t } = useTranslation();
  const { data: products, loading, error } = useCatalogData('admin_catalog');

  // Функция для удаления товара (пока заглушка, так как метод не реализован)
  const handleDeleteProduct = (id) => {
    console.log('Delete product with id:', id);
    // Реализуем позже, когда добавим метод destroy в контроллере
  };

  if (loading) return <div className="loading">{t('Loading')}...</div>;
  if (error) return <div>{t('Error')}: {error.message}</div>;
  if (!products || products.length === 0) return <div>{t('admin.catalog.noProducts')}</div>;

  return (
    <div className="admin-catalog-page">
      <h1>{t('admin.catalog.title')}</h1>
      
      <table className="admin-products-table">
        <thead>
          <tr>
            <th>№</th>
            <th>{t('admin.catalog.name')}</th>
            <th>{t('admin.catalog.price')}</th>
            <th>{t('admin.catalog.discount')}</th>
            <th>{t('admin.catalog.category')}</th>
            <th>{t('admin.catalog.subcategory')}</th>
            <th>{t('admin.catalog.brand')}</th>
            <th>{t('admin.catalog.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.name || '-'}</td>
              <td>{product.price ? `${product.price} ₽` : '-'}</td>
              <td>{product.discount ? `${product.discount}%` : '-'}</td>
              <td>{t(`category.${product.category}`) || '-'}</td>
              <td>{t(`subcategory.${product.category}.${product.subcategory}`) || '-'}</td>
              <td>{product.brand || '-'}</td>
              <td>
                <Button
                  className="delete-button"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  {t('admin.catalog.delete')}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCatalogPage;