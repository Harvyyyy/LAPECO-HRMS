import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import Header from './Header';
import './Layout.css';

const MOBILE_BREAKPOINT = 992;

const Layout = ({ onLogout, userRole, currentUser, notifications, appLevelHandlers, theme }) => {
  // State for desktop sidebar (collapsed vs. expanded)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // State for mobile sidebar (off-canvas visibility)
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  
  // State to track viewport size
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
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;