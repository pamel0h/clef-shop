import '../../../css/components/Header.css'; 
import Navbar from "./Navbar";
import Input from "../UI/Input"
import Button from '../UI/Button';
import LanguageSelector from '../UI/LanguageSelector';
import LogoIcon from '../icons/LogoIcon';
import CartIcon from '../icons/CartIcon'
import ProfileIcon from '../icons/ProfileIcon'
import LanguageIcon from '../icons/LanguageIcon'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


function Header() {
    const { t } = useTranslation();

    return(
        <div className='container'>
            <div className='header'>
                <div className='logo' >
                    <LogoIcon />
                </div>
                <div className='block block--search'>
                    <Input placeholder={t('header.search')} variant="search"/>
                    <Navbar/>
                </div>
                <div className='block'>
                    <div>
                        <p className='text-header'>{t('header.address')}</p>
                        <p className='text-header'>+7 (978) 045- 37 - 69</p>
                    </div>
                    <div className='icons'>
                        <LanguageSelector />
                        {/* <Button variant = 'icon' icon={<LanguageIcon />} ></Button> */}
                        <Link to="/profile"><Button variant = 'icon' icon={<ProfileIcon />} ></Button></Link>
                        <Link to="/cart"><Button variant = 'icon' icon={<CartIcon />} ></Button></Link>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default Header;