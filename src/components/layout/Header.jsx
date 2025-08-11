import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import placeholderAvatar from '../../assets/placeholder-profile.jpg';
import NotificationDropdown from './NotificationDropdown';
import ThemeToggle from './ThemeToggle'; 

const Header = ({ onLogout, currentUser, notifications, appLevelHandlers, theme }) => {
  const user = currentUser || { 
    name: 'GUEST', employeeId: '0000000', avatarUrl: null, role: 'REGULAR_EMPLOYEE'
  };

  const positionMap = {
    HR_PERSONNEL: 'HR Personnel',
    TEAM_LEADER: 'Team Leader',
    REGULAR_EMPLOYEE: 'Employee',
  };

  const displayPosition = positionMap[user.role] || user.role.replace('_', ' ');

  return (
    <header className="app-header">
      <div className="header-left"></div>
      <div className="header-right">
        <ThemeToggle theme={theme} onToggle={appLevelHandlers.toggleTheme} />
        
        <NotificationDropdown notifications={notifications} handlers={appLevelHandlers} />
        <div className="dropdown user-profile-menu">
          <div 
            className="user-info-wrapper"
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            <img 
              src={user.avatarUrl || placeholderAvatar} 
              alt="User Avatar" 
              className="user-avatar" 
              onError={(e) => { e.target.onerror = null; e.target.src=placeholderAvatar; }}
            />
            <div className="user-text-info">
              <span className="user-name">{user.name}</span>
              <span className="user-position">{displayPosition}</span>
            </div>
            <i className="bi bi-chevron-down dropdown-caret"></i>
          </div>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
            <li className="dropdown-header-custom">
              <h6 className="mb-0">{user.name}</h6>
              <div className="text-muted small">ID: {user.employeeId}</div>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li><Link className="dropdown-item" to="/dashboard/my-profile"><i className="bi bi-person-fill"></i> My Profile</Link></li>
            <li><Link className="dropdown-item" to="/dashboard/account-settings"><i className="bi bi-gear-fill"></i> Settings</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item text-danger" onClick={onLogout}>
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;