
import React, { useState, useEffect } from 'react';
import Button from '../../UI/Button';
import AdminCatalogPage from './AdminCatalogPage';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('catalog'); // Изменено на 'catalog'
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Получение токена из localStorage (замени на свой способ)
  const getAuthToken = () => {
    return localStorage.getItem('auth_token');
  };

  // API запросы
  const apiRequest = async (url, options = {}) => {
    const token = getAuthToken();
    const response = await fetch(`/api/admin${url}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка API');
    }
    
    return response.json();
  };

  // Загрузка статистики
  const loadStats = async () => {
    try {
      const data = await apiRequest('/stats');
      setStats(data);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  // Загрузка пользователей
  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedRole) params.append('role', selectedRole);
      
      const data = await apiRequest(`/users?${params}`);
      setUsers(data.data || []);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  // Удаление пользователя
  const deleteUser = async (userId) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    
    try {
      await apiRequest(`/users/${userId}`, { method: 'DELETE' });
      loadUsers();
    } catch (error) {
      alert('Ошибка удаления: ' + error.message);
    }
  };

  // useEffect(() => {
  //   if (activeTab === 'dashboard') {
  //     loadStats();
  //   } else if (activeTab === 'users') {
  //     loadUsers();
  //   }
  // }, [activeTab]);

  // useEffect(() => {
  //   if (activeTab === 'users') {
  //     const timeoutId = setTimeout(loadUsers, 300);
  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [searchTerm, selectedRole]);

  // Роли для фильтра
  const roles = {
    '': 'Все роли',
    'user': 'Пользователи',
    'admin': 'Администраторы',
    'super_admin': 'Супер администраторы'
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      'user': 'Пользователь',
      'admin': 'Администратор',
      'super_admin': 'Супер администратор'
    };
    return roleLabels[role] || role;
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <h1>Админ панель</h1>
        <span>Добро пожаловать, Администратор</span>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-nav">
        <Button 
          onClick={() => setActiveTab('catalog')}
          className={activeTab === 'catalog' ? 'active' : ''}
        >
          Каталог
        </Button>
        <Button 
          onClick={() => setActiveTab('dashboard')}
          className={activeTab === 'dashboard' ? 'active' : ''}
        >
          Статистика
        </Button>
        <Button 
          onClick={() => setActiveTab('users')}
          className={activeTab === 'users' ? 'active' : ''}
        >
          Пользователи
        </Button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {(() => {
          switch (activeTab) {
            case 'catalog':
              return <AdminCatalogPage />;
            
            case 'dashboard':
              return (
                <div>
                  <h2>Статистика</h2>
                  {stats ? (
                    <div>
                      <p>Общая статистика</p>
                      {/* Здесь выводить статистику */}
                    </div>
                  ) : (
                    <p>Загрузка статистики...</p>
                  )}
                </div>
              );
            
            case 'users':
              return (
                <div>
                  <h2>Управление пользователями</h2>
                  {/* Здесь код для управления пользователями */}
                </div>
              );
            
            default:
              return <AdminCatalogPage />;
          }
        })()}
      </div>
    </div>
  );
};

export default AdminDashboard;