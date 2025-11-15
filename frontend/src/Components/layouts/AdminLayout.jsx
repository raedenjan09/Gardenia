import React, { useState, useEffect } from 'react';
import { getUser } from '../utils/helper';
import Sidebar from './Sidebar';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-layout">
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
      >
        ☰
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar-wrapper ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <Sidebar 
          user={user} 
          onToggle={toggleSidebar}
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      {/* Main Content */}
      <main className={`main-content-with-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;