import React from 'react';
import '../../../css/components/SuccessModal.css';

const SuccessModal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="success-modal-overlay">
            <div className="success-modal-content">
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>
                <h2>{title}</h2>
                <p>{message}</p>
                <button className="submit-button" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;