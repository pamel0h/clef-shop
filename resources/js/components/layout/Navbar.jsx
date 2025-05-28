
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAV_LINKS } from '../../config/navLinks';
import { Link } from 'react-router-dom';
import '../../../css/components/Navbar.css';

const Navbar = () => {
  const { t } = useTranslation(); 

  return (
    <nav>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          to={link.href}
        >
          {t(link.labelKey)} 
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;