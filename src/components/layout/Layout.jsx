import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import Header from './Header';
import './Layout.css';

const Layout = ({ onLogout, userRole, currentUser, notifications, appLevelHandlers, theme }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
    return () => {
      body.classList.remove('light-theme', 'dark-theme');
    };
  }, [theme]);

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
          theme={theme}
        />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;