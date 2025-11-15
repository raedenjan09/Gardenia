import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ user, onToggle, isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/suppliers', label: 'Suppliers', icon: '🏢' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/orders', label: 'Orders', icon: '📋' },
    { path: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src="/images/logo.png" alt="Gardenia" className="logo-image" />
          {!isCollapsed && <span className="logo-text">GARDENIA</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={onToggle}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* User Profile */}
      <div className="sidebar-user">
        <div className="user-avatar">
          <img 
            src={user?.avatar?.url || '/images/default-avatar.png'} 
            alt={user?.name}
          />
        </div>
        {!isCollapsed && (
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {adminMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActiveRoute(item.path) ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="sidebar-actions">
          <h4>Quick Actions</h4>
          <Link to="/admin/products/new" className="action-btn">
            + Add Product
          </Link>
          <Link to="/admin/suppliers/new" className="action-btn">
            + Add Supplier
          </Link>
        </div>
      )}

      {/* Footer */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <span className="logout-icon">🚪</span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;