import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';
import "../../../../css/components/ProfilePage.css";
import Order from './Order';
import ProfileForm from './ProfileForm';
import Button from '../../UI/Button';

const ProfilePage = () => {
    const { t } = useTranslation();
    const { user, isAuthenticated, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [activeContainer, setActiveContainer] = useState('profile');

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, loading, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="page--user page">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="page--user page">
            <h1>{t('profile.title')}</h1>
            <div className="menu">
                <ul>
                    <li 
                        onClick={() => setActiveContainer('profile')}
                        className={activeContainer === 'profile' ? 'active' : ''}
                    >
                        {t('profile.my_data')}
                    </li>
                    <li 
                        onClick={() => setActiveContainer('orders')}
                        className={activeContainer === 'orders' ? 'active' : ''}
                    >
                        {t('profile.orders')}
                    </li>
                    <li 
                        onClick={() => setActiveContainer('purchases')}
                        className={activeContainer === 'purchases' ? 'active' : ''}
                    >
                        {t('profile.purchases')}
                    </li>
                </ul>
                <Button onClick={handleLogout}>
                    {t('profile.logout')}
                </Button> 
            </div>
            
            <div className="user--container">
                {activeContainer === 'profile' && (
                    <div className="profile-container">
                        <h2>{t('profile.my_data')}</h2>
                        <ProfileForm user={user} />
                    </div>
                )}
                {activeContainer === 'orders' && (
                    <div className="orders-container">
                        <h2>{t('profile.my_orders')}</h2>
                        <Order status='Доставлен' title='#100'/>
                        <Order status='В пути' title='#120'/>
                    </div>
                )}
                {activeContainer === 'purchases' && (
                    <div className="purchases-container">
                        <h2>{t('profile.my_purchases')}</h2>
                        <Order status='Получен' title='#100'/>
                        <Order status='Получен' title='#110'/>
                        <Order status='Получен' title='#110'/>
                        <Order status='Получен' title='#110'/>
                        <Order status='Получен' title='#110'/>
                        <Order status='Получен' title='#110'/>
                        <Order status='Получен' title='#110'/>
                        <Order status='Получен' title='#110'/>
                        <Order status='Получен' title='#110'/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;