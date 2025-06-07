import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import "../../../../css/components/Table.css";

const TruncatedId = ({ id }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  const truncated = id.length > 5 ? `${id.slice(0, 5)}...` : id;
  
  return (
    <span 
      className="truncated-id" 
      onDoubleClick={toggleExpand}
      title={id}
    >
      {isExpanded ? id : truncated}
    </span>
  );
};

const TableUsers = () => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const roleOptions = [
    { value: 'user', label: t('admin_users.role.user') },
    { value: 'admin', label: t('admin_users.role.admin') },
  ];

  const filterOptions = [
    { value: 'all', label: t('admin_users.all_roles') },
    ...roleOptions,
  ];

  useEffect(() => {
    if (user) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        setError('');
        try {
          const response = await axios.get('/api/admin/users');
          setUsers(response.data.users);
        } catch (err) {
          setError(t('admin_users.users_error'));
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [user, t]);

  const handleEdit = (user) => {
    setEditUserId(user.id);
    setEditedUser({ ...user, new_password: '' });
    validateUser({ ...user, new_password: '' });
  };

  const validateUser = (user) => {
    const errors = {};
    if (!user.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = t('admin_users.email_invalid');
    }
    if (user.new_password && user.new_password.length < 8) {
      errors.new_password = t('admin_users.password_too_short');
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e, field) => {
    const newUser = { ...editedUser, [field]: e.target.value };
    setEditedUser(newUser);
    validateUser(newUser);
  };

  const handleRoleChange = (e) => {
    const newUser = { ...editedUser, role: e.target.value };
    setEditedUser(newUser);
  };

  const handleSave = async (userId) => {
    if (!validateUser(editedUser)) {
      setError(t('admin_users.validation_error'));
      return;
    }

    try {
      const originalUser = users.find((u) => u.id === userId);

      const payload = {};
      const fields = ['name', 'email', 'phone', 'address', 'role', 'new_password'];
      fields.forEach((field) => {
        if (field === 'new_password') {
          if (editedUser[field]) {
            payload.password = editedUser[field];
          }
        } else if (editedUser[field] !== originalUser[field]) {
          payload[field] = editedUser[field] || null;
        }
      });

      await axios.put(`/api/admin/users/${userId}`, payload);
      
      setUsers(
        users.map((u) =>
          u.id === userId
            ? { ...u, ...payload, password: undefined }
            : u
        )
      );
      setEditUserId(null);
      setValidationErrors({});
    } catch (err) {
      console.error('Update user error:', err.response?.data);
      setError(err.response?.data?.message || t('admin_users.update_error'));
    }
  };

  const handleCancel = () => {
    setEditUserId(null);
    setEditedUser({});
    setValidationErrors({});
  };

  const handleDelete = async (userId) => {
    if (window.confirm(t('admin_users.confirm_delete'))) {
      try {
        await axios.delete(`/api/admin/users/${userId}`);
        setUsers(users.filter((u) => u.id !== userId));
        if (filteredUsers.length <= 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        console.error('Delete user error:', err.response?.data);
        setError(t('admin_users.delete_error'));
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setItemsPerPage(value);
      setCurrentPage(1);
    }
  };

  const filteredUsers = users.filter((user) => {
    // Фильтрация по поисковому запросу
    const matchesSearch = !searchQuery || 
      user.id.toString().includes(searchQuery.toLowerCase()) ||
      (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.role || '').toLowerCase().includes(searchQuery.toLowerCase());

    // Фильтрация по роли
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const exportToCSV = () => {
    // Подготовка данных для экспорта
    const dataToExport = filteredUsers.map(user => ({
      ID: user.id,
      Name: user.name || 'N/A',
      Email: user.email,
      Phone: user.phone || 'N/A',
      Address: user.address || 'N/A',
      Role: roleOptions.find(r => r.value === user.role)?.label || user.role,
    }));

    // Создание CSV содержимого
    const headers = Object.keys(dataToExport[0]).join(',');
    const rows = dataToExport.map(obj => 
      Object.values(obj).map(value => 
        `"${value.toString().replace(/"/g, '""')}"`
      ).join(',')
    ).join('\n');

    const csvContent = `${headers}\n${rows}`;

    // Создание Blob и скачивание файла
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || loadingUsers) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="table-header">
        <h2 className="text-2xl font-bold mb-4">{t('admin_users.title')}</h2>
        <div className="controls-container">
          <div className="search-container">
            <input
              type="text"
              placeholder={t('admin_users.search_users')}
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <select
              value={roleFilter}
              onChange={handleRoleFilterChange}
              className="role-filter-select"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="items-per-page-container">
            <label>{t('admin_users.items_per_page')}: </label>
            <input
              type="number"
              min="1"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="items-per-page-input"
            />
          </div>
          <button 
            onClick={exportToCSV} 
            className="export-btn"
            disabled={filteredUsers.length === 0}
          >
            {t('admin_users.export_csv')}
          </button>
        </div>
      </div>
      <table className="collection">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Role</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user_item) => (
            <tr key={user_item.id}>
              <td><TruncatedId id={user_item.id} /></td>
              <td>
                {editUserId === user_item.id ? (
                  <input
                    type="text"
                    value={editedUser.name || ''}
                    onChange={(e) => handleInputChange(e, 'name')}
                    className="name-input"
                  />
                ) : (
                  user_item.name || 'N/A'
                )}
              </td>
              <td>
                {editUserId === user_item.id ? (
                  <div className="input-container">
                    <input
                      type="email"
                      value={editedUser.email || ''}
                      onChange={(e) => handleInputChange(e, 'email')}
                      className={`email-input ${validationErrors.email ? 'invalid' : ''}`}
                    />
                    {validationErrors.email && (
                      <span className="error-message">{validationErrors.email}</span>
                    )}
                  </div>
                ) : (
                  user_item.email
                )}
              </td>
              <td>
                {editUserId === user_item.id ? (
                  <input
                    type="text"
                    value={editedUser.phone || ''}
                    onChange={(e) => handleInputChange(e, 'phone')}
                    className="phone-input"
                  />
                ) : (
                  user_item.phone || 'N/A'
                )}
              </td>
              <td>
                {editUserId === user_item.id ? (
                  <input
                    type="text"
                    value={editedUser.address || ''}
                    onChange={(e) => handleInputChange(e, 'address')}
                    className="address-input"
                  />
                ) : (
                  user_item.address || 'N/A'
                )}
              </td>
              <td>
                {editUserId === user_item.id ? (
                  <select
                    value={editedUser.role || 'user'}
                    onChange={handleRoleChange}
                    className="role-select"
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  roleOptions.find(r => r.value === user_item.role)?.label || user_item.role
                )}
              </td>
              <td>
                {editUserId === user_item.id ? (
                  <div className="input-container">
                    <input
                      type="password"
                      value={editedUser.new_password || ''}
                      onChange={(e) => handleInputChange(e, 'new_password')}
                      className={`password-input ${validationErrors.new_password ? 'invalid' : ''}`}
                      placeholder={t('admin_users.new_password')}
                    />
                    {validationErrors.new_password && (
                      <span className="error-message">{validationErrors.new_password}</span>
                    )}
                  </div>
                ) : (
                  ''
                )}
              </td>
              <td>
                {editUserId === user_item.id ? (
                  <>
                    <button
                      onClick={() => handleSave(user_item.id)}
                      className="action-btn save"
                      disabled={Object.keys(validationErrors).length > 0}
                    >
                      {t('admin_users.save')}
                    </button>
                    <button onClick={handleCancel} className="action-btn cancel">
                      {t('admin_users.cancel')}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(user_item)}
                      className="action-btn edit"
                    >
                      {t('admin_users.edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(user_item.id)}
                      className="action-btn delete"
                    >
                      {t('admin_users.delete')}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="8">
              
              <div className="links">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? 'disabled' : ''}
                >
                  «
                </a>
                {Array.from({ length: totalPages }, (_, index) => (
                  <a
                    key={index + 1}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(index + 1);
                    }}
                    className={currentPage === index + 1 ? 'active' : ''}
                  >
                    {index + 1}
                  </a>
                ))}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? 'disabled' : ''}
                >
                  »
                </a>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TableUsers;