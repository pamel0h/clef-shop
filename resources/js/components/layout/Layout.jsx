// src/components/Layout.jsx
import '../../../css/components/Layout/Layout.css'; 
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../../context/AuthContext';
import SubscriptionModal from '../UI/SubscriptionModal';
import InactivityModal from '../UI/InactivityModal';
import { useInactivity } from '../../hooks/useInactivity';
import { useEffect } from 'react';

export const Layout = () => {
    const { user, token, logout, showSubscriptionModal } = useAuth();
    const { showModal, handleContinue } = useInactivity(user?.name, token, logout);

    // Отладочные логи
    useEffect(() => {
        console.log('Current auth state:', { 
            user: user ? user.name : 'null', 
            token: token ? 'exists' : 'null',
            showSubscriptionModal 
        });
    }, [user, token, showSubscriptionModal]);

    return (
        <div className='app'>
            <Header />
            <main>
                <Outlet />
                {showSubscriptionModal && <SubscriptionModal />}
                {showModal && (
                    <InactivityModal 
                        userName={user?.name}
                        onContinue={handleContinue}
                        onLogout={logout}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
};