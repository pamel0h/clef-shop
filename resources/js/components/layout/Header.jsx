import '../../../css/components/Layout/Header.css'; 
import Navbar from "./Navbar";
import Input from "../UI/Input"
import Button from '../UI/Button';
import LanguageSelector from '../UI/LanguageSelector';
import LogoIcon from '../icons/LogoIcon';
import CartIcon from '../icons/CartIcon'
import ProfileIcon from '../icons/ProfileIcon'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import AuthModal from '../UI/AuthModal';

function Header() {
    const { t } = useTranslation();
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleProfileClick = () => {
        if (isAuthenticated) {
            navigate('/profile');
        } else {
            setIsAuthModalOpen(true);
        };
    }   
    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const handleCartClick = () => {
        navigate('/cart')
    }

    const handleHomeClick = () => {
        navigate('/')
    }

    
    return(
        <div className='container'>
            <div className='header'>
                <div className='logo' onClick={handleHomeClick} >
                    <LogoIcon />
                </div>
                <div className='block block--search'>
                <Input 
                        placeholder={t('header.search')}  
                        variant="search"
                        value={searchQuery}
                        onChange={(e) => {
                            console.log('Input changed:', e.target.value); // Отладка
                            setSearchQuery(e.target.value);
                        }}
                        onKeyDown={handleSearch}
                    />
                    <Navbar/>
                </div>
                <div className='block'>
                    <div>
                        <p className='text-header'>{t('header.address')}</p>
                        <p className='text-header'>+7 (978) 045- 37 - 69</p>
                    </div>
                    <div className='icons'>
                        <LanguageSelector />
                        <Button
                            variant="icon"
                            icon={<ProfileIcon />}
                            onClick={handleProfileClick}
                        />
                        <Button variant='icon' icon={<CartIcon />} onClick={handleCartClick}/>
                    </div>
                </div>
            </div>
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
            />
        </div>
    );
}

export default Header;