import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Jetak Admin</h2>
      </div>
      <nav className="sidebar-nav">
        <Link to="/admin/dashboard" className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}>
          <i className="fas fa-chart-line"></i>
          Dashboard
        </Link>
        <Link to="/admin/orders" className={`nav-item ${isActive('/admin/orders') ? 'active' : ''}`}>
          <i className="fas fa-shopping-cart"></i>
          Orders
        </Link>
        <Link to="/admin/categories" className={`nav-item ${isActive('/admin/categories') ? 'active' : ''}`}>
          <i className="fas fa-tags"></i>
          Categories
        </Link>
        <Link to="/admin/stores" className={`nav-item ${isActive('/admin/stores') ? 'active' : ''}`}>
          <i className="fas fa-store"></i>
          Stores
        </Link>
        <Link to="/admin/menus" className={`nav-item ${isActive('/admin/menus') ? 'active' : ''}`}>
          <i className="fas fa-utensils"></i>
          Menus
        </Link>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 