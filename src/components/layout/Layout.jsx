import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import Header from './Header';
import './Layout.css';

const Layout = ({ onLogout, userRole, currentUser, notifications, appLevelHandlers }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="app-layout">
      <SideBar 
        userRole={userRole} 
        isCollapsed={isSidebarCollapsed} 
      />
      <button
        className={`sidebar-toggle-button ${isSidebarCollapsed ? 'collapsed' : ''}`}
        onClick={handleToggleSidebar}
        title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        <i className={`bi ${isSidebarCollapsed ? 'bi-chevron-double-right' : 'bi-chevron-double-left'}`}></i>
      </button>
      <div className={`content-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header 
          onLogout={onLogout} 
          currentUser={currentUser}
          notifications={notifications}
          appLevelHandlers={appLevelHandlers}
        />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;