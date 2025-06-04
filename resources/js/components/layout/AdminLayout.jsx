import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../../css/components/AdminLayout.css';

const AdminLayout = () => {
  const { t } = useTranslation();
  const [isPagesOpen, setIsPagesOpen] = useState(false);

  const togglePagesMenu = () => {
    setIsPagesOpen(!isPagesOpen);
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>{t('admin.title')}</h2>
        <ul>
          <li>
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
               {t('admin.main')}
            </NavLink>
          </li>
          
          <li>
            <div
              className={`dropdown-btn ${isPagesOpen ? 'active' : ''}`}
              onClick={togglePagesMenu}
            >
              {t('admin.pages')}
            </div>
            <div className={`dropdown-container ${isPagesOpen ? 'open' : ''}`}>
              <NavLink 
                to="/admin/pages/home" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {t('admin.editHome')}
              </NavLink>
              <NavLink 
                to="/admin/pages/about" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {t('admin.editAbout')}
              </NavLink>
              <NavLink 
                to="/admin/pages/contacts" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {t('admin.editContacts')}
              </NavLink>
              <NavLink 
                to="/admin/pages/news" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {t('admin.editNews')}
              </NavLink>
              
            </div>
          </li>
          
          <li>
            <NavLink 
              to="/admin/orders" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Заказы
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/producti" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Товары
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Пользователи
            </NavLink>
          </li>
          <li>
              <NavLink 
                to="/admin/messages" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Сообщения
              </NavLink>
          </li>
          
        </ul>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;