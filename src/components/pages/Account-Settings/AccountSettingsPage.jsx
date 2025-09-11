import React, { useState } from 'react';
import './AccountSettingsPage.css';
import { USER_ROLES } from '../../../constants/roles';
import ChangePassword from './ChangePassword';
import ThemeSettings from './ThemeSettings';
import NotificationSettings from './NotificationSettings';
import LoginActivity from './LoginActivity';
import DataManagementSettings from './DataManagementSettings';

const AccountSettingsPage = ({ currentUser, userRole, handlers, theme }) => {
  const [activeSection, setActiveSection] = useState('changePassword');

  const isHrUser = userRole === USER_ROLES.HR_PERSONNEL;

  const sections = {
    personal: [
      { key: 'changePassword', label: 'Change Password', icon: 'bi-key-fill' },
      { key: 'theme', label: 'Theme & Appearance', icon: 'bi-palette-fill' },
      { key: 'notifications', label: 'Notifications', icon: 'bi-bell-fill' },
      { key: 'loginActivity', label: 'Login Activity', icon: 'bi-shield-check' },
    ],
    admin: [
      { key: 'dataManagement', label: 'Data Management', icon: 'bi-database-fill-x' },
    ]
  };

  return (
    <div className="container-fluid p-0 page-module-container">
      <header className="page-header mb-4">
        <h1 className="page-main-title">Account Settings</h1>
      </header>
      <div className="account-settings-grid">
        <nav className="settings-nav">
          <div className="nav-heading">Personal Settings</div>
          {sections.personal.map(sec => (
            <button key={sec.key} className={`nav-link ${activeSection === sec.key ? 'active' : ''}`} onClick={() => setActiveSection(sec.key)}>
              <i className={sec.icon}></i> {sec.label}
            </button>
          ))}
          
          {isHrUser && (
            <>
              <div className="nav-heading">Admin Tools</div>
              {sections.admin.map(sec => (
                <button key={sec.key} className={`nav-link ${activeSection === sec.key ? 'active' : ''}`} onClick={() => setActiveSection(sec.key)}>
                  <i className={sec.icon}></i> {sec.label}
                </button>
              ))}
            </>
          )}
        </nav>
        <div className="settings-content">
          {activeSection === 'changePassword' && <ChangePassword currentUser={currentUser} handlers={handlers} />}
          {activeSection === 'theme' && <ThemeSettings theme={theme} onToggleTheme={handlers.toggleTheme} />}
          {activeSection === 'notifications' && <NotificationSettings />}
          {activeSection === 'loginActivity' && <LoginActivity />}

          {isHrUser && activeSection === 'dataManagement' && <DataManagementSettings onReset={handlers.resetSelectedData} />}
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;