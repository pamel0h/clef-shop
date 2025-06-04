import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useCatalogData from '../../../hooks/useCatalogData';
import Button from '../../UI/Button';
import { ProductFilter } from '../Catalog/ProductFilter';
import useProductFilteringAndSorting from '../../../hooks/useProductFilteringAndSorting';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import '../../../../css/components/AdminCatalog.css';

const AdminCatalogPage = () => {
  const { t } = useTranslation();
  const { data: products, loading, error, refetch } = useCatalogData('admin_catalog');
  const isAdminPage = true;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const fileInputRef = useRef(null);

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
        'X-Requested-With': 'XMLHttpRequest',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/admin/catalog/${productToDelete.id}`, {
        method: 'DELETE',
        headers,
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

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const csrfToken = getCSRFToken();

      const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      if (csrfToken) {
        headers['X-CSRF-TOKEN'] = csrfToken;
      }

      const response = await fetch('/api/admin/catalog/export', {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'catalog_export.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      console.log('CSV exported successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert(t('admin.catalog.exportError') + error.message);
    }
  };

  const handleUploadCSV = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    try {
        const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
        const csrfToken = getCSRFToken();

        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        if (csrfToken) {
            headers['X-CSRF-TOKEN'] = csrfToken;
        }

        const formData = new FormData();
        let csvFile = null;
        const imageFiles = [];

        for (const file of files) {
            const mime = file.type;
            if (mime === 'text/csv' || mime === 'text/plain') {
                csvFile = file;
            } else if (['image/jpeg', 'image/png'].includes(mime)) {
                imageFiles.push(file);
            }
        }

        if (!csvFile) {
            throw new Error(t('admin.catalog.noCsvFile'));
        }

        formData.append('csv', csvFile);
        imageFiles.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        const response = await fetch('/api/admin/catalog/import', {
            method: 'POST',
            headers,
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('Server error:', data);
            const errorMessage = data.errors
                ? Object.values(data.errors).flat().join(', ')
                : data.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        if (data.success) {
            await refetch();
            console.log(`Imported ${data.imported} products`);
            alert(t('admin.catalog.importSuccess', { count: data.imported }));
            if (data.errors && data.errors.length > 0) {
                alert(t('admin.catalog.importErrors', { errors: data.errors.join('; ') }));
            }
        } else {
            throw new Error(data.error || 'Failed to import products');
        }
    } catch (error) {
        console.error('Error importing CSV:', error);
        alert(t('admin.catalog.uploadError') + ': ' + error.message);
    }
    event.target.value = '';
};

  if (loading) return <div className="loading">`</div>;
  if (error) return <div>{t('Error')}: {error.message}</div>;
  if (!products || products.length === 0) return <div>{t('admin.catalog.noProducts')}</div>;

  return (
    <div className="admin-catalog-page">
      <meta name="csrf-token" content="{{ csrf_token() }}" />
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
          <Button
            onClick={handleExport}
            className="export-csv-btn"
          >
            {t('admin.catalog.export')}
          </Button>
          <Button
            onClick={() => fileInputRef.current.click()}
            className="upload-csv-btn"
          >
            {t('admin.catalog.upload')}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".csv,image/jpeg,image/png"
            multiple
            onChange={handleUploadCSV}
          />
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