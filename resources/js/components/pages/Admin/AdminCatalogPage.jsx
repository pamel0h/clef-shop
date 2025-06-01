import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useCatalogData from '../../../hooks/useCatalogData';
import Button from '../../UI/Button';
import { ProductFilter } from '../Catalog/ProductFilter';
import useProductFilteringAndSorting from '../../../hooks/useProductFilteringAndSorting';
import AddProductModal from './AddProductModal';
import '../../../../css/components/AdminCatalog.css';

const AdminCatalogPage = () => {
  const { t } = useTranslation();
  const { data: products, loading, error, refetch } = useCatalogData('admin_catalog');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdminPage = true;

  // Используем хук для фильтрации и сортировки
  const { filteredProducts, sortOption, handleFilterChange, handleSortChange } = useProductFilteringAndSorting(
    products || [],
    { field: 'name', direction: 'asc' },
    isAdminPage
  );

  // Функция для удаления товара
  const handleDeleteProduct = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/catalog/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        }
      });

      const result = await response.json();

      if (result.success) {
        // Обновляем список товаров
        refetch();
        alert('Товар успешно удален');
      } else {
        alert('Ошибка при удалении товара: ' + result.error);
      }
    } catch (error) {
      alert('Ошибка сети: ' + error.message);
    }
  };

  // Функция вызывается после успешного добавления товара
  const handleProductAdded = () => {
    refetch(); // Обновляем список товаров
  };

  if (loading) return <div className="loading">{t('Loading')}...</div>;
  if (error) return <div>{t('Error')}: {error.message}</div>;

  return (
    <div className="admin-catalog-page page">
      <div className="admin-catalog-header">
        <h1>{t('admin.catalog.title')}</h1>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="add-product-button"
        >
          Добавить товар
        </Button>
      </div>

      <div className="admin-catalog-layout">
        <div className="filter-column">
          <ProductFilter
            initialProducts={products || []}
            filteredByMainFilters={products || []}
            filteredProducts={filteredProducts}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            sortOption={sortOption}
            isAdminPage={isAdminPage}
          />
        </div>
        
        <div className="table-column">
          {!products || products.length === 0 ? (
            <div className="no-products">{t('admin.catalog.noProducts')}</div>
          ) : (
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
                      <td>{t(`category.${product.category}`) || product.category || '-'}</td>
                      <td>{t(`subcategory.${product.category}.${product.subcategory}`) || product.subcategory || '-'}</td>
                      <td>{product.brand || '-'}</td>
                      <td>
                        <Button
                          className="edit-button"
                          onClick={() => console.log('Edit product:', product.id)}
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
          )}
        </div>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
};

export default AdminCatalogPage;