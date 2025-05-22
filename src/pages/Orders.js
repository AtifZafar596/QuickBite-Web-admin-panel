import React, { useState, useEffect } from 'react';
import { ordersApi } from '../services/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersApi.getAll();
      console.log('Orders API response:', response);
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatusId(orderId);
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      setError('Failed to update order status');
      console.error(err);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const orderDetails = await ordersApi.getById(orderId);
      setSelectedOrder(orderDetails?.data || orderDetails);
      setShowDetails(true);
    } catch (err) {
      setError('Failed to fetch order details');
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#ffc107';
      case 'confirmed':
        return '#17a2b8';
      case 'preparing':
        return '#007bff';
      case 'ready':
        return '#28a745';
      case 'delivered':
        return '#6c757d';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="orders-page">
      <h1>Orders</h1>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Store</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{ order.users?.full_name || 'N/A'}</td>
                  <td>{order.store?.name || order.stores?.name || order.stores?.[0]?.name || 'N/A'}</td>
                  <td>${order.total_amount?.toFixed(2) || '0.00'}</td>
                  <td>
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{ backgroundColor: getStatusColor(order.status) }}
                      className="status-select"
                      disabled={updatingStatusId === order.id}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => handleViewDetails(order.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDetails && selectedOrder && (
        <div className="order-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Order Details #{selectedOrder.id}</h2>
              <button
                className="close-button"
                onClick={() => setShowDetails(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="order-info">
                <div className="info-group">
                  <h3>Customer Information</h3>
                  <p>Name: {selectedOrder.user?.name || selectedOrder.users?.name || 'N/A'}</p>
                  <p>Email: {selectedOrder.user?.email || selectedOrder.users?.email || 'N/A'}</p>
                  <p>Phone: {selectedOrder.user?.phone || selectedOrder.users?.phone || 'N/A'}</p>
                </div>
                <div className="info-group">
                  <h3>Store Information</h3>
                  <p>Name: {selectedOrder.store?.name || selectedOrder.stores?.name || selectedOrder.stores?.[0]?.name || 'N/A'}</p>
                  <p>Address: {selectedOrder.store?.address || selectedOrder.stores?.address || selectedOrder.stores?.[0]?.address || 'N/A'}</p>
                </div>
                <div className="info-group">
                  <h3>Order Information</h3>
                  <p>Status: {selectedOrder.status || 'N/A'}</p>
                  <p>Total Amount: ${selectedOrder.total_amount?.toFixed(2) || '0.00'}</p>
                  <p>Created At: {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : 'N/A'}</p>
                </div>
              </div>
              <div className="order-items">
                <h3>Order Items</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.order_items?.map((item) => (
                      <tr key={item.id}>
                        <td>{item.menu_item?.name || item.menu_items?.name || 'N/A'}</td>
                        <td>{item.quantity || 0}</td>
                        <td>${item.price?.toFixed(2) || '0.00'}</td>
                        <td>${((item.quantity || 0) * (item.price || 0)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders; 