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
      setMetrics({ totalOrders, totalRevenue, totalCustomers, totalStores });
    } catch (err) {
      setMetrics({ totalOrders: 0, totalRevenue: 0, totalCustomers: 0, totalStores: 0 });
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
              <div className="metric-value">AED{metrics.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
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
      )}
    </div>
  );
};

export default Dashboard; 