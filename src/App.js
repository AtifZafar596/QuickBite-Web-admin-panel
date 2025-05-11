import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Categories from './pages/Categories';
import Stores from './pages/Stores';
import Menus from './pages/Menus';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('adminToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="stores" element={<Stores />} />
                  <Route path="menus" element={<Menus />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App; 