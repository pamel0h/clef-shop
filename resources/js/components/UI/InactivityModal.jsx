// src/components/UI/InactivityModal.jsx
import './InactivityModal.css';

const InactivityModal = ({ userName, onContinue, onLogout }) => {
    return (
        <div className="inactivity-modal-overlay">
            <div className="inactivity-modal">
                <h2>Активность сессии</h2>
                <p>Продолжить как {userName}?</p>
                <div className="modal-actions">
                    <button className="continue-btn" onClick={onContinue}>
                        Продолжить
                    </button>
                    <button className="logout-btn" onClick={onLogout}>
                        Выйти
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InactivityModal