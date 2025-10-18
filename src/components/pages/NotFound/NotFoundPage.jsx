import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inDashboard = location.pathname.startsWith('/dashboard');
  const base = inDashboard ? '/dashboard' : '';

  const quickLinks = [
    { to: `${base}`, label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: `${base}/my-profile`, label: 'My Profile', icon: 'bi-person-circle' },
    { to: `${base}/account-settings`, label: 'Account Settings', icon: 'bi-gear' },
  ];

  return (
    <div className="not-found-container">
      <div className="not-found-card shadow-sm">
        <div className="icon-circle animated-pulse">
          <i className="bi bi-exclamation-triangle-fill"></i>
        </div>
        <h2 className="title">Page Not Found</h2>
        <p className="subtitle">Sorry, we can’t find the page you were looking for.</p>
        <div className="attempted-path"><code>{location.pathname}</code></div>
        <p className="message">If you typed the address, check the spelling. Otherwise, try one of these helpful destinations:</p>

        <div className="link-grid">
          {quickLinks.map(link => (
            <Link key={link.to} to={link.to} className="link-grid-item">
              <i className={`bi ${link.icon}`}></i>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="actions">
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;