import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import "../../../../css/components/Table.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

const TableOrders = () => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState(null);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [editOrderId, setEditOrderId] = useState(null);
  const [editedOrder, setEditedOrder] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');

  const [createdDateRange, setCreatedDateRange] = useState({
    start: null,
    end: null
  });
  const [updatedDateRange, setUpdatedDateRange] = useState({
    start: null,
    end: null
  });

  const statusOptions = [
    { value: 'pending', label: t('admin_orders.order_status.pending') },
    { value: 'processing', label: t('admin_orders.order_status.processing') },
    { value: 'shipped', label: t('admin_orders.order_status.shipped') },
    { value: 'delivered', label: t('admin_orders.order_status.delivered') },
    { value: 'cancelled', label: t('admin_orders.order_status.cancelled') },
  ];

  const deliveryOptions = [
    { value: 'pickup', label: t('admin_orders.delivery_type.pickup') },
    { value: 'delivery', label: t('admin_orders.delivery_type.delivery') },
  ];

  const statusFilterOptions = [
    { value: 'all', label: t('admin_orders.all_statuses') },
    ...statusOptions,
  ];

  const deliveryFilterOptions = [
    { value: 'all', label: t('admin_orders.all_delivery_types') },
    ...deliveryOptions,
  ];


  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        setError('');
        try {
          const response = await axios.get('/api/admin/orders');
          setOrders(response.data.orders);
        } catch (err) {
          setError(t('admin_orders.orders_error'));
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [user, t]);

  const exportToCSV = () => {
    const dataToExport = filteredOrders.map(order => ({
      'Order ID': order.id,
      'User ID': order.user_id,
      'Total Amount': `$${order.total_amount.toFixed(2)}`,
      'Status': t(`admin_orders.order_status.${order.status}`),
      'Phone': order.phone,
      'Delivery Type': t(`admin_orders.delivery_type.${order.delivery_type}`),
      'Address': order.address || 'N/A',
      'Created At': new Date(order.created_at).toLocaleString(),
      'Updated At': new Date(order.updated_at).toLocaleString(),
      'Items': order.items.map(item => 
        `${item.product.name} (x${item.quantity})`
      ).join('; ')
    }));

    const headers = Object.keys(dataToExport[0]).join(',');
    const rows = dataToExport.map(obj => 
      Object.values(obj).map(value => 
        `"${value.toString().replace(/"/g, '""')}"`
      ).join(',')
    ).join('\n');

    // Добавляем BOM (Byte Order Mark) для корректной кодировки UTF-8
    const BOM = "\uFEFF";
    const csvContent = BOM + `${headers}\n${rows}`;
    
    // Указываем правильный MIME-type с кодировкой
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

  const toggleProducts = (orderId) => {
    setOpenOrderId(openOrderId === orderId ? null : orderId);
  };

  const handleDelete = async (orderId) => {
    if (window.confirm(t('admin_orders.confirm_delete'))) {
      try {
        await axios.delete(`/api/admin/orders/${orderId}`);
        setOrders(orders.filter((order) => order.id !== orderId));
        if (filteredOrders.length <= 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        console.error('Delete order error:', err.response?.data);
        setError(t('admin_orders.delete_error'));
      }
    }
  };

  const handleEdit = (order) => {
    setEditOrderId(order.id);
    setEditedOrder({ ...order });
    validateOrder({ ...order }); // Проверяем валидацию при входе в режим редактирования
  };

  const validateOrder = (order) => {
    const errors = {};
    if (order.delivery_type === 'delivery' && !order.address?.trim()) {
      errors.address = t('admin_orders.address_required');
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e, field) => {
    const newOrder = { ...editedOrder, [field]: e.target.value };
    setEditedOrder(newOrder);
    validateOrder(newOrder); // Проверяем валидацию при изменении поля
  };

  const handleItemQuantityChange = (productId, quantity) => {
    const newQuantity = parseInt(quantity, 10);
    if (newQuantity < 1) return;

    const updatedItems = editedOrder.items.map((item) =>
      item.product_id === productId ? { ...item, quantity: newQuantity } : item
    );

    const newTotalAmount = updatedItems.reduce((sum, item) => {
      const price = item.product.price * (1 - (item.product.discount || 0) / 100);
      return sum + price * item.quantity;
    }, 0);

    const newOrder = {
      ...editedOrder,
      items: updatedItems,
      total_amount: newTotalAmount,
    };
    setEditedOrder(newOrder);
    validateOrder(newOrder);
  };

  const handleItemDelete = (productId) => {
    const updatedItems = editedOrder.items.filter(
      (item) => item.product_id !== productId
    );

    const newTotalAmount = updatedItems.reduce((sum, item) => {
      const price = item.product.price * (1 - (item.product.discount || 0) / 100);
      return sum + price * item.quantity;
    }, 0);

    const newOrder = {
      ...editedOrder,
      items: updatedItems,
      total_amount: newTotalAmount,
    };
    setEditedOrder(newOrder);
    validateOrder(newOrder);
  };

  const handleSave = async (orderId) => {
    if (!validateOrder(editedOrder)) {
      setError(t('admin_orders.validation_error'));
      return;
    }

    try {
      const payload = {
        ...editedOrder,
        items: editedOrder.items.map(({ product_id, quantity, attributes }) => ({
          product_id,
          quantity,
          attributes: attributes || [],
        })),
      };
      await axios.put(`/api/admin/orders/${orderId}`, payload);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, ...editedOrder } : order
        )
      );
      setEditOrderId(null);
      setValidationErrors({});
    } catch (err) {
      console.error('Update order error:', err.response?.data);
      setError(t('admin_orders.update_error'));
    }
  };

  const handleCancel = () => {
    setEditOrderId(null);
    setEditedOrder({});
    setValidationErrors({});
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setItemsPerPage(value);
      setCurrentPage(1);
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDeliveryFilterChange = (e) => {
    setDeliveryFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredOrders = orders.filter((order) => {
    // Фильтрация по поисковому запросу
    const matchesSearch = !searchQuery || 
      order.id.toString().includes(searchQuery.toLowerCase()) ||
      order.user_id.toString().includes(searchQuery.toLowerCase()) ||
      order.total_amount.toString().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.delivery_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(order.created_at).toLocaleString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(order.updated_at).toLocaleString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(
        (item) =>
          item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.quantity.toString().includes(searchQuery.toLowerCase())
      );

    // Фильтрация по статусу
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    // Фильтрация по способу доставки
    const matchesDelivery = deliveryFilter === 'all' || order.delivery_type === deliveryFilter;

    // Фильтрация по дате создания
    const createdDate = new Date(order.created_at);
    const matchesCreatedDate = (
      (!createdDateRange.start || createdDate >= createdDateRange.start) &&
      (!createdDateRange.end || createdDate <= new Date(createdDateRange.end.setHours(23, 59, 59, 999)))
    );

    // Фильтрация по дате обновления
    const updatedDate = new Date(order.updated_at);
    const matchesUpdatedDate = (
      (!updatedDateRange.start || updatedDate >= updatedDateRange.start) &&
      (!updatedDateRange.end || updatedDate <= new Date(updatedDateRange.end.setHours(23, 59, 59, 999)))
    );

    return matchesSearch && matchesStatus && matchesDelivery && matchesCreatedDate && matchesUpdatedDate;
  });

  // Обработчики для изменения диапазонов дат
  const handleCreatedStartDateChange = (date) => {
    setCreatedDateRange({ ...createdDateRange, start: date });
    setCurrentPage(1);
  };

  const handleCreatedEndDateChange = (date) => {
    setCreatedDateRange({ ...createdDateRange, end: date });
    setCurrentPage(1);
  };

  const handleUpdatedStartDateChange = (date) => {
    setUpdatedDateRange({ ...updatedDateRange, start: date });
    setCurrentPage(1);
  };

  const handleUpdatedEndDateChange = (date) => {
    setUpdatedDateRange({ ...updatedDateRange, end: date });
    setCurrentPage(1);
  };

  const clearDateFilters = () => {
    setCreatedDateRange({ start: null, end: null });
    setUpdatedDateRange({ start: null, end: null });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading || loadingOrders) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="table-header">
        <h2 className="text-2xl font-bold mb-4">Admin Orders</h2>
        <div className='settings-table'>
          <div className="search-container">
            <input
              type="text"
              placeholder={t('admin_orders.search_orders')}
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
           <div className="items-per-page-container">
            <label>{t('admin_orders.items_per_page')}: </label>
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
            disabled={filteredOrders.length === 0}
          >
            {t('admin_orders.export_csv')}
          </button>
        </div>
        
        <div className="controls-container">
          
          <div className="filter-container">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="filter-select"
            >
              {statusFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-container">
            <select
              value={deliveryFilter}
              onChange={handleDeliveryFilterChange}
              className="filter-select"
            >
              {deliveryFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
           <div className="date-filter-container">
            <label>{t('admin_orders.created_at')}:</label>
            <DatePicker
              selected={createdDateRange.start}
              onChange={handleCreatedStartDateChange}
              selectsStart
              startDate={createdDateRange.start}
              endDate={createdDateRange.end}
              placeholderText={t('admin_orders.from_date')}
              className="date-picker-input"
            />
            <DatePicker
              selected={createdDateRange.end}
              onChange={handleCreatedEndDateChange}
              selectsEnd
              startDate={createdDateRange.start}
              endDate={createdDateRange.end}
              minDate={createdDateRange.start}
              placeholderText={t('admin_orders.to_date')}
              className="date-picker-input"
            />
          </div>
          <div className="date-filter-container">
            <label>{t('admin_orders.updated_at')}:</label>
            <DatePicker
              selected={updatedDateRange.start}
              onChange={handleUpdatedStartDateChange}
              selectsStart
              startDate={updatedDateRange.start}
              endDate={updatedDateRange.end}
              placeholderText={t('admin_orders.from_date')}
              className="date-picker-input"
            />
            <DatePicker
              selected={updatedDateRange.end}
              onChange={handleUpdatedEndDateChange}
              selectsEnd
              startDate={updatedDateRange.start}
              endDate={updatedDateRange.end}
              minDate={updatedDateRange.start}
              placeholderText={t('admin_orders.to_date')}
              className="date-picker-input"
            />
          </div>
          <button 
            onClick={clearDateFilters} 
            className="clear-date-filters-btn"
          >
            {t('admin_orders.clear_dates')}
          </button>
         
        </div>
      </div>
      <table className="collection">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Phone</th>
            <th>Delivery Type</th>
            <th>Address</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Items</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((order) => (
            <React.Fragment key={order.id}>
              <tr>
                <td><TruncatedId id={order.id} /></td>
                <td><TruncatedId id={order.user_id} /></td>
                <td>{`$${order.total_amount.toFixed(2)}`}</td>
                <td>
                  {editOrderId === order.id ? (
                    <select
                      value={editedOrder.status || ''}
                      onChange={(e) => handleInputChange(e, 'status')}
                      className="status-select"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    t(`admin_orders.order_status.${order.status}`)
                  )}
                </td>
                <td>
                  {editOrderId === order.id ? (
                    <input
                      type="text"
                      value={editedOrder.phone || ''}
                      onChange={(e) => handleInputChange(e, 'phone')}
                    />
                  ) : (
                    order.phone
                  )}
                </td>
                <td>
                  {editOrderId === order.id ? (
                    <select
                      value={editedOrder.delivery_type || ''}
                      onChange={(e) => handleInputChange(e, 'delivery_type')}
                      className="delivery-select"
                    >
                      {deliveryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    t(`admin_orders.delivery_type.${order.delivery_type}`)
                  )}
                </td>
                <td>
                  {editOrderId === order.id ? (
                    <div className="input-container">
                      <input
                        type="text"
                        value={editedOrder.address || ''}
                        onChange={(e) => handleInputChange(e, 'address')}
                        className={`address-input ${validationErrors.address ? 'invalid' : ''}`}
                      />
                      {validationErrors.address && (
                        <p className="error-message">{validationErrors.address}</p>
                      )}
                    </div>
                  ) : (
                    order.address || 'N/A'
                  )}
                </td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>{new Date(order.updated_at).toLocaleString()}</td>
                <td>
                  <span
                    className="dropdown-toggle"
                    onClick={() => toggleProducts(order.id)}
                  >
                    {openOrderId === order.id ? t('admin_orders.hide') : t('admin_orders.show')}
                  </span>
                </td>
                <td>
                  {editOrderId === order.id ? (
                    <>
                      <button
                        onClick={() => handleSave(order.id)}
                        className="action-btn save"
                        disabled={Object.keys(validationErrors).length > 0}
                      >
                        {t('admin_orders.save')}
                      </button>
                      <button onClick={handleCancel} className="action-btn cancel">
                        {t('admin_orders.cancel')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(order)}
                        className="action-btn edit"
                      >
                        {t('admin_orders.edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="action-btn delete"
                      >
                        {t('admin_orders.delete')}
                      </button>
                    </>
                  )}
                </td>
              </tr>
              {openOrderId === order.id && (
                <tr className="items-row">
                  <td colSpan="10">
                    <div className="items-container">
                      {editOrderId === order.id ? (
                        editedOrder.items.map((item) => (
                          <div key={item.product_id} className="item-row">
                            <span>{item.product.name}</span>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemQuantityChange(item.product_id, e.target.value)
                              }
                              className="item-quantity-input"
                            />
                            <button
                              onClick={() => handleItemDelete(item.product_id)}
                              className="action-btn delete"
                            >
                              {t('admin_orders.delete_item')}
                            </button>
                          </div>
                        ))
                      ) : (
                        order.items.map((item) => (
                          <div key={item.product_id} className="item-row">
                            {item.product.name} (x{item.quantity})
                          </div>
                        ))
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="11">
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

export default TableOrders;