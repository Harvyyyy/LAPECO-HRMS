import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import Header from './Header';
import ToastNotification from '../common/ToastNotification';
import './Layout.css';

const MOBILE_BREAKPOINT = 992;

const Layout = ({ onLogout, userRole, currentUser, notifications, appLevelHandlers, theme, toast, clearToast, employees, positions }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const applyTheme = () => {
      const body = document.body;
      if (theme === 'dark') {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
      } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
      }
    };
    applyTheme();
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobileView(isMobile);
      if (!isMobile) {
        setIsMobileSidebarVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (toast && toast.show) {
      const timer = setTimeout(() => {
        clearToast();
      }, 4000); // Auto-dismiss after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  const handleToggleDesktopSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleToggleMobileSidebar = () => {
    setIsMobileSidebarVisible(!isMobileSidebarVisible);
  };

  return (
    <div className={`app-layout ${isMobileSidebarVisible ? 'mobile-sidebar-active' : ''}`}>
      <SideBar 
        userRole={userRole} 
        isCollapsed={isSidebarCollapsed && !isMobileView} 
        isMobileVisible={isMobileSidebarVisible}
        onMobileNavItemClick={handleToggleMobileSidebar}
      />
      
      {isMobileView && isMobileSidebarVisible && (
        <div className="app-overlay" onClick={handleToggleMobileSidebar}></div>
      )}

      {!isMobileView && (
        <button
          className={`sidebar-toggle-button ${isSidebarCollapsed ? 'collapsed' : ''}`}
          onClick={handleToggleDesktopSidebar}
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <i className={`bi ${isSidebarCollapsed ? 'bi-chevron-double-right' : 'bi-chevron-double-left'}`}></i>
        </button>
      )}

      <div className={`content-wrapper ${isSidebarCollapsed && !isMobileView ? 'sidebar-collapsed' : ''}`}>
        <Header 
          onLogout={onLogout} 
          currentUser={currentUser}
          notifications={notifications}
          appLevelHandlers={appLevelHandlers}
          theme={theme}
          isMobileView={isMobileView}
          onToggleMobileSidebar={handleToggleMobileSidebar}
        />
        <main className="page-content">
          <Outlet context={{ theme, employees, positions }} />
        </main>
      </div>

      <div className="toast-notification-container">
        <ToastNotification toast={toast} onClose={clearToast} />
      </div>
    </div>
  );
};

export default Layout;