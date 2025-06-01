import { useTranslation } from 'react-i18next';
import useCatalogData from '../../../hooks/useCatalogData';
import Button from '../../UI/Button';
import { ProductFilter } from '../Catalog/ProductFilter';
import useProductFilteringAndSorting from '../../../hooks/useProductFilteringAndSorting';
import '../../../../css/components/AdminCatalog.css';

const AdminCatalogPage = () => {
  const { t } = useTranslation();
  const { data: products, loading, error } = useCatalogData('admin_catalog');
  const isAdminPage = true; // Флаг для страницы администратора

  // Используем хук для фильтрации и сортировки
  const { filteredProducts, sortOption, handleFilterChange, handleSortChange } = useProductFilteringAndSorting(
    products || [], // Передаем products как initialProducts
    { field: 'name', direction: 'asc' },
    isAdminPage // Передаем флаг isAdminPage
  );

  // Функция для удаления товара (заглушка)
  const handleDeleteProduct = (id) => {
    console.log('Delete product with id:', id);
    // Реализуем позже с методом destroy
  };

  if (loading) return <div className="loading">{t('Loading')}...</div>;
  if (error) return <div>{t('Error')}: {error.message}</div>;
  if (!products || products.length === 0) return <div>{t('admin.catalog.noProducts')}</div>;

  return (
    <div className="admin-catalog-page page">
      <h1>{t('admin.catalog.title')}</h1>
      <div className="admin-catalog-layout">
        <div className="filter-column">
          <ProductFilter
            initialProducts={products}
            filteredByMainFilters={products}
            filteredProducts={filteredProducts}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            sortOption={sortOption}
            isAdminPage={isAdminPage} // Передаем флаг isAdminPage
          />
        </div>
        <div className="table-column">
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
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
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
                        className="edit-button"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        {t('admin.catalog.edit')}
                      </Button>
                      <Button
                        className="delete-button"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        {t('admin.catalog.delete')}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>
                    {t('admin.catalog.noFilteredProducts')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCatalogPage;