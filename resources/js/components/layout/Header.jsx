import '../../../css/components/Header.css'; 
import Navbar from "./Navbar";
import Input from "../UI/Input"
import Button from '../UI/Button';
import LogoIcon from '../icons/LogoIcon';
import CartIcon from '../icons/CartIcon'
import ProfileIcon from '../icons/ProfileIcon'
import LanguageIcon from '../icons/LanguageIcon'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        console.log('handleSearch called', e.key, searchQuery); // Отладка
        if (e.key === 'Enter' && searchQuery.trim()) {
            console.log('Navigating to:', `/search?query=${encodeURIComponent(searchQuery)}`); // Отладка
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };
    return(
        <div className='container'>
            <div className='header'>
                <LogoIcon className='logo' />
                <div className='block block--search'>
                <Input 
                        placeholder="Поиск..." 
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
                        <p className='text-header'>г. Севастополь, ул. Большая Морская, 17</p>
                        <p className='text-header'>+7 (978) 045- 37 - 69</p>
                    </div>
                    <div className='icons'>
                        <Button variant = 'icon' icon={<LanguageIcon />} ></Button>
                        <Link to="/profile"><Button variant = 'icon' icon={<ProfileIcon />} ></Button></Link>
                        <Link to="/cart"><Button variant = 'icon' icon={<CartIcon />} ></Button></Link>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default Header;