import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useCatalogData from '../../../hooks/useCatalogData';
import Button from '../../UI/Button';
import { ProductFilter } from '../Catalog/ProductFilter';
import useProductFilteringAndSorting from '../../../hooks/useProductFilteringAndSorting';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal'; // Import the new modal
import DeleteConfirmModal from './DeleteConfirmModal';
import '../../../../css/components/AdminCatalog.css';

const AdminCatalogPage = () => {
  const { t } = useTranslation();
  const { data: products, loading, error, refetch } = useCatalogData('admin_catalog');
  const isAdminPage = true;

  // состояния
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // хук для фильтров и сортировки
  const { filteredProducts, sortOption, handleFilterChange, handleSortChange } = useProductFilteringAndSorting(
    products || [],
    { field: 'name', direction: 'asc' },
    isAdminPage
  );

  const getCSRFToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const handleAddProduct = async () => {
    try {
      await refetch();
      console.log('Product added successfully');
    } catch (error) {
      console.error('Error refreshing data after adding product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    console.log(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    try {
      await refetch();
      console.log('Product updated successfully');
    } catch (error) {
      console.error('Error refreshing data after updating product:', error);
    }
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
  
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const csrfToken = getCSRFToken();
      
      const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      if (csrfToken) {
        headers['X-CSRF-TOKEN'] = csrfToken;
      }
      
      const response = await fetch(`/api/admin/catalog/${productToDelete.id}`, {
        method: 'DELETE',
        headers
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (data.success) {
        setShowDeleteModal(false);
        setProductToDelete(null);
        await refetch();
        console.log('Product deleted successfully');
      } else {
        throw new Error(data.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Ошибка при удалении товара: ' + error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <div className="loading">{t('Loading')}...</div>;
  if (error) return <div>{t('Error')}: {error.message}</div>;
  if (!products || products.length === 0) return <div>{t('admin.catalog.noProducts')}</div>;

  return (
    <div className="admin-catalog-page">
      <meta name="csrf-token" content="{{ csrf_token() }}"></meta>
      {/* <h1>{t('admin.catalog.title')}</h1> */}

      <div className="admin-catalog-layout">
        <div className="filter-column">
          <ProductFilter
            initialProducts={products}
            filteredByMainFilters={products}
            filteredProducts={filteredProducts}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            sortOption={sortOption}
            isAdminPage={isAdminPage}
          />
        </div>
        <div className="table-column">
          <Button 
            onClick={() => setShowAddModal(true)}
            className="add-product-btn"
          >
            + {t('admin.catalog.add')}
          </Button>
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
                        onClick={() => handleEditProduct(product)}
                      >
                        {t('admin.catalog.edit')}
                      </Button>
                      <Button
                        className="delete-button"
                        onClick={() => handleDeleteProduct(product)}
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

      {/* Modals */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddProduct}
      />
      <EditProductModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setProductToEdit(null);
        }}
        onSubmit={handleUpdateProduct}
        product={productToEdit}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        productName={productToDelete?.name || ''}
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminCatalogPage;