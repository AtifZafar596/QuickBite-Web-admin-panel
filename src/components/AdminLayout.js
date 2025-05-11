import React from 'react';
import Sidebar from './Sidebar';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout; 