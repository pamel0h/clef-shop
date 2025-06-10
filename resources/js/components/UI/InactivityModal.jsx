// src/components/UI/InactivityModal.jsx
import '../../../css/components/InactivityModal.css';
import Button from './Button';

const InactivityModal = ({ userName, onContinue, onLogout }) => {
    return (
        <div className="inactivity-modal-overlay">
            <div className="inactivity-modal">
                <h2>Активность сессии</h2>
                <p>Продолжить как {userName}?</p>
                <div className="modal-actions">
                    <Button className="continue-btn" onClick={onContinue}>
                        Продолжить
                    </Button>
                    <Button variant='secondary' className="logout-btn" onClick={onLogout}>
                        Выйти
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InactivityModal