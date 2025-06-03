import AddEditCatalogForm from './AddEditCatalogForm';

const EditProductModal = ({ isOpen, onClose, onSubmit, product }) => {
  const handleSubmit = async (AddEditCatalogForm) => {
    if (onSubmit) {
      await onSubmit();
    }
  };

  return (
    <AddEditCatalogForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      product={product}
      title="Изменить товар"
    />
  );
};

export default EditProductModal;