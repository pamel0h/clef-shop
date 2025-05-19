import { useState } from 'react';
import "../../../../css/components/ProfilePage.css";
import Order from './Order';
import ProfileForm from './ProfileForm';
import Button from '../../UI/Button';
import Input from '../../UI/Input';

const ProfilePage = () => {
    const [activeContainer, setActiveContainer] = useState('profile');

    return (
        <div className="page--user page">
            <h1>Profile</h1>
            <div className="menu">
                <ul>
                    <li 
                        onClick={() => setActiveContainer('profile')}
                        className={activeContainer === 'profile' ? 'active' : ''}
                    >
                        My profile
                    </li>
                    <li 
                        onClick={() => setActiveContainer('orders')}
                        className={activeContainer === 'orders' ? 'active' : ''}
                    >
                        Orders
                    </li>
                    <li 
                        onClick={() => setActiveContainer('purchases')}
                        className={activeContainer === 'purchases' ? 'active' : ''}
                    >
                        Purchases
                    </li>
                </ul>
                <Button>Выйти</Button>
            </div>
            
            <div className="user--container">
                {activeContainer === 'profile' && (
                    <div className="profile-container">
                        <h2>My profile</h2>
                        <ProfileForm />
                    </div>
                )}
                {activeContainer === 'orders' && (
                    <div className="orders-container">
                        <h2>My orders</h2>
                            <Order status='Доставлен' title='#100'/>
                            <Order status='В пути' title='#120'/>
                    </div>
                )}
                {activeContainer === 'purchases' && (
                    <div className="purchases-container">
                        <h2>My purchases</h2>
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