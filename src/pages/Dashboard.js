import React, { useEffect, useState } from 'react';
import { ordersApi, storesApi } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalStores: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all orders
      const ordersRes = await ordersApi.getAll();
      const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      // Calculate metrics
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
      const customersSet = new Set(orders.map(o => o.user_id));
      const totalCustomers = customersSet.size;
      // Fetch all stores
      const storesRes = await storesApi.getAll();
      const stores = Array.isArray(storesRes) ? storesRes : [];
      const totalStores = stores.length;
      // Recent orders (latest 5)
      const sortedOrders = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setRecentOrders(sortedOrders.slice(0, 5));
      setMetrics({ totalOrders, totalRevenue, totalCustomers, totalStores });
    } catch (err) {
      setMetrics({ totalOrders: 0, totalRevenue: 0, totalCustomers: 0, totalStores: 0 });
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <h1>Admin Dashboard</h1>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="dashboard-metrics">
            <div className="metric-card orders">
              <div className="metric-icon"><i className="fas fa-shopping-cart"></i></div>
              <div className="metric-info">
                <div className="metric-value">{metrics.totalOrders}</div>
                <div className="metric-label">Total Orders</div>
              </div>
            </div>
            <div className="metric-card revenue">
              <div className="metric-icon"><i className="fas fa-dollar-sign"></i></div>
              <div className="metric-info">
                <div className="metric-value">dzd{metrics.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                <div className="metric-label">Total Revenue</div>
              </div>
            </div>
            <div className="metric-card customers">
              <div className="metric-icon"><i className="fas fa-users"></i></div>
              <div className="metric-info">
                <div className="metric-value">{metrics.totalCustomers}</div>
                <div className="metric-label">Customers</div>
              </div>
            </div>
            <div className="metric-card stores">
              <div className="metric-icon"><i className="fas fa-store"></i></div>
              <div className="metric-info">
                <div className="metric-value">{metrics.totalStores}</div>
                <div className="metric-label">Stores</div>
              </div>
            </div>
          </div>
          <div className="dashboard-section">
            <h2>Recent Orders</h2>
            <table className="recent-orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Store</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign: 'center'}}>No recent orders</td></tr>
                ) : recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.user?.name || order.users?.name || 'N/A'}</td>
                    <td>{order.store?.name || order.stores?.name || order.stores?.[0]?.name || 'N/A'}</td>
                    <td>dzd{order.total_amount?.toFixed(2) || '0.00'}</td>
                    <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                    <td>{order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 