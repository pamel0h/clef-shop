import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../UI/Button';
import Modal from '../../UI/Modal';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productName, loading }) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('admin.catalog.confirmDelete')}>
      <div className="delete-confirm-content">
        <p>{t('admin.catalog.deleteConfirmText', { name: productName })}</p>
        <p className="warning-text">{t('admin.catalog.deleteWarning')}</p>
        
        <div className="form-actions">
          <Button 
            type="button" 
            onClick={onClose} 
            className="cancel-btn"
            disabled={loading}
          >
            {t('No')}
          </Button>
          <Button 
            type="button" 
            onClick={onConfirm} 
            className="delete-btn"
            disabled={loading}
          >
            {loading ? t('Loading') : t('Yes')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;