import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import '../../../css/components/SubscriptionModal.css'; // Импортируем CSS

const SubscriptionModal = () => {
  const { closeSubscriptionModal } = useAuth();

  return (
    <div className="subscription-modal">
      <div className="sub-modal-content">
        <h2>Подпишитесь на рассылку!</h2>
        <p>Получайте самые свежие новости и эксклюзивные предложения на вашу почту.</p>
        
        <div className="modal-form">
          <button 
            className="subscribe-btn"
            onClick={closeSubscriptionModal}
          >
            Подписаться
          </button>
          <button 
            className="cancel-btn"
            onClick={closeSubscriptionModal}
          >
            Не сейчас
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;