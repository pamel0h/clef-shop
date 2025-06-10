import React from 'react';
import '../../../css/components/SuccessModal.css';
import Button from './Button';

const SuccessModal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="success-modal-overlay">
            <div className="success-modal-content">
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>
                <h3>{title}</h3>
                <p>{message}</p>
                <Button onClick={onClose}>
                    OK
                </Button>
            </div>
        </div>
    );
};

export default SuccessModal;