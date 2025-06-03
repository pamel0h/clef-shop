import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../../css/components/AuthModal.css';

const AuthModal = ({ isOpen, onClose, onAuthSuccess, redirectToProfile = true }) => {
    const { t } = useTranslation();
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
        setError('');
        setLoading(false);
    };

    // Функция определения куда перенаправить пользователя
    const getRedirectPath = (user) => {
        if (user.role === 'admin' || user.role === 'super_admin') {
            return '/admin/dashboard';
        }
        return '/profile';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let result;
            
            if (isLogin) {
                result = await login(email, password);
            } else {
                if (password !== passwordConfirmation) {
                    setError(t('auth.password_mismatch'));
                    setLoading(false);
                    return;
                }
                result = await register(name, email, password, passwordConfirmation);
            }

            if (result.success) {
                onClose();
                
                if (redirectToProfile) {
                    // Определяем куда перенаправить пользователя
                    const redirectPath = getRedirectPath(result.user);
                    navigate(redirectPath);
                    return;
                }
                
                onAuthSuccess();
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError(t('auth.error_occurred'));
        }
        
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>
                <h2>{isLogin ? t('auth.login') : t('auth.register')}</h2>
                <div className="auth-tabs">
                    <button
                        className={`tab ${isLogin ? 'active' : ''}`}
                        onClick={() => {
                            setIsLogin(true);
                            resetForm();
                        }}
                    >
                        {t('auth.login')}
                    </button>
                    <button
                        className={`tab ${!isLogin ? 'active' : ''}`}
                        onClick={() => {
                            setIsLogin(false);
                            resetForm();
                        }}
                    >
                        {t('auth.register')}
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>{t('auth.name')}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('auth.name_placeholder')}
                                required
                                disabled={loading}
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>{t('auth.email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('auth.email_placeholder')}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('auth.password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('auth.password_placeholder')}
                            required
                            disabled={loading}
                        />
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <label>{t('auth.password_confirmation')}</label>
                            <input
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                placeholder={t('auth.password_confirmation_placeholder')}
                                required
                                disabled={loading}
                            />
                        </div>
                    )}
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading 
                            ? t('auth.loading') 
                            : (isLogin ? t('auth.login') : t('auth.register'))
                        }
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;