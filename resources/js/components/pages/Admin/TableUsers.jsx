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
        <span className="truncated-id" onDoubleClick={toggleExpand} title={id}>
            {isExpanded ? id : truncated}
        </span>
    );
};

const TableUsers = () => {
    const { t } = useTranslation();
    const { user, loading } = useAuth();
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [error, setError] = useState('');
    const [editUserId, setEditUserId] = useState(null);
    const [editedUser, setEditedUser] = useState({});
    const [backendErrors, setBackendErrors] = useState({});
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
                    setError(err.response?.data?.errors?.error?.[0] || t('admin_users.users_error'));
                } finally {
                    setLoadingUsers(false);
                }
            };
            fetchUsers();
        }
    }, [user, t]);

    const handleEdit = (user) => {
        setEditUserId(user.id);
        setEditedUser({ ...user, password: '' });
        setBackendErrors({});
    };

    const handleInputChange = (e, field) => {
        const newUser = { ...editedUser, [field]: e.target.value };
        setEditedUser(newUser);
    };

    const handleRoleChange = (e) => {
        const newUser = { ...editedUser, role: e.target.value };
        setEditedUser(newUser);
    };

    const handleSave = async (userId) => {
        setError('');
        setBackendErrors({});
        try {
            const originalUser = users.find((u) => u.id === userId);
            const payload = {};
            const fields = ['name', 'email', 'phone', 'address', 'role', 'password'];
            fields.forEach((field) => {
                if (editedUser[field] !== originalUser[field] && editedUser[field] !== '') {
                    payload[field] = editedUser[field] || null;
                }
            });

            const response = await axios.put(`/api/admin/users/${userId}`, payload);
            setUsers(
                users.map((u) =>
                    u.id === userId
                        ? { ...u, ...payload, password: undefined }
                        : u
                )
            );
            setEditUserId(null);
            setBackendErrors({});
            alert(t('admin_users.update_success'));
        } catch (err) {
            console.error('Update user error:', err.response?.data);
            console.log('Validation errors:', err.response?.data?.errors);
            if (err.response?.status === 422) {
                const errors = err.response.data.errors || {};
                console.log('Setting backendErrors:', errors);
                setBackendErrors(errors);
            } else {
                setError(err.response?.data?.errors?.error?.[0] || t('admin_users.update_error'));
            }
        }
    };

    const handleCancel = () => {
        setEditUserId(null);
        setEditedUser({});
        setBackendErrors({});
        setError('');
    };

    const handleDelete = async (userId) => {
        if (window.confirm(t('admin_users.confirm_delete'))) {
            setError('');
            try {
                const response = await axios.delete(`/api/admin/users/${userId}`);
                setUsers(users.filter((u) => u.id !== userId));
                if (filteredUsers.length <= 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
                alert(t('admin_users.delete_success'));
            } catch (err) {
                console.error('Delete user error:', err.response?.data);
                console.log('Response errors:', err.response?.data?.errors);
                const errorMessage =
                    err.response?.data?.errors?.error?.[0] ||
                    err.response?.data?.message ||
                    t('admin_users.delete_error');
                console.log('Selected error message:', errorMessage);
                alert(errorMessage);
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
        const matchesSearch =
            !searchQuery ||
            user.id.toString().includes(searchQuery.toLowerCase()) ||
            (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.role || '').toLowerCase().includes(searchQuery.toLowerCase());

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
        const dataToExport = filteredUsers.map((user) => ({
            ID: user.id,
            Name: user.name || 'N/A',
            Email: user.email,
            Phone: user.phone || 'N/A',
            Address: user.address || 'N/A',
            Role: roleOptions.find((r) => r.value === user.role)?.label || user.role,
        }));

        const headers = Object.keys(dataToExport[0]).join(',');
        const rows = dataToExport
            .map((obj) =>
                Object.values(obj)
                    .map((value) => `"${value.toString().replace(/"/g, '""')}"`)
                    .join(',')
            )
            .join('\n');

        const csvContent = `${headers}\n${rows}`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `users_export_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading || loadingUsers) return <div>{t('admin_users.loading')}</div>;
    if (error) return <div className="error-container">{error}</div>;

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
                        <th>{t('admin_users.user_id')}</th>
                        <th>{t('admin_users.name')}</th>
                        <th>{t('admin_users.email')}</th>
                        <th>{t('admin_users.phone')}</th>
                        <th>{t('admin_users.address')}</th>
                        <th>{t('admin_users.role.title')}</th>
                        <th>{t('admin_users.password')}</th>
                        <th>{t('admin_users.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map((user_item) => (
                        <tr key={user_item.id}>
                            <td><TruncatedId id={user_item.id} /></td>
                            <td>
                                {editUserId === user_item.id ? (
                                    <div className="input-container">
                                        <input
                                            type="text"
                                            value={editedUser.name || ''}
                                            onChange={(e) => handleInputChange(e, 'name')}
                                            className="name-input"
                                        />
                                        {backendErrors.name?.length > 0 && (
                                            <span className="error-message">{backendErrors.name[0]}</span>
                                        )}
                                    </div>
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
                                            className="email-input"
                                        />
                                        {backendErrors.email?.length > 0 && (
                                            <span className="error-message">{backendErrors.email[0]}</span>
                                        )}
                                    </div>
                                ) : (
                                    user_item.email
                                )}
                            </td>
                            <td>
                                {editUserId === user_item.id ? (
                                    <div className="input-container">
                                        <input
                                            type="text"
                                            value={editedUser.phone || ''}
                                            onChange={(e) => handleInputChange(e, 'phone')}
                                            className="phone-input"
                                        />
                                        {backendErrors.phone?.length > 0 && (
                                            <span className="error-message">{backendErrors.phone[0]}</span>
                                        )}
                                    </div>
                                ) : (
                                    user_item.phone || 'N/A'
                                )}
                            </td>
                            <td>
                                {editUserId === user_item.id ? (
                                    <div className="input-container">
                                        <input
                                            type="text"
                                            value={editedUser.address || ''}
                                            onChange={(e) => handleInputChange(e, 'address')}
                                            className="address-input"
                                        />
                                        {backendErrors.address?.length > 0 && (
                                            <span className="error-message">{backendErrors.address[0]}</span>
                                        )}
                                    </div>
                                ) : (
                                    user_item.address || 'N/A'
                                )}
                            </td>
                            <td>
                                {editUserId === user_item.id ? (
                                    <div className="input-container">
                                        <select
                                            value={editedUser.role || ''}
                                            onChange={handleRoleChange}
                                            className="role-select"
                                        >
                                            {roleOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {backendErrors.role?.length > 0 && (
                                            <span className="error-message">{backendErrors.role[0]}</span>
                                        )}
                                    </div>
                                ) : (
                                    roleOptions.find((r) => r.value === user_item.role)?.label || user_item.role
                                )}
                            </td>
                            <td>
                                {editUserId === user_item.id ? (
                                    <div className="input-container">
                                        <input
                                            type="password"
                                            value={editedUser.password || ''}
                                            onChange={(e) => handleInputChange(e, 'password')}
                                            className="password-input"
                                            placeholder={t('admin_users.new_password')}
                                        />
                                        {backendErrors.password?.length > 0 && (
                                            <span className="error-message">{backendErrors.password[0]}</span>
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