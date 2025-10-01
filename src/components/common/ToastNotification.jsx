import React from 'react';
import './ToastNotification.css';

const ToastNotification = ({ toast, onClose }) => {
  if (!toast || !toast.show) {
    return null;
  }

  const { message, type = 'success' } = toast;

  const iconMap = {
    success: 'bi-check-circle-fill',
    error: 'bi-x-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill',
  };

  const titleMap = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
  };

  return (
    <div className={`toast-notification show toast-${type}`}>
      <div className="toast-icon">
        <i className={`bi ${iconMap[type]}`}></i>
      </div>
      <div className="toast-content">
        <div className="toast-title">{titleMap[type]}</div>
        <div className="toast-message">{message}</div>
      </div>
      <button className="toast-close-btn" onClick={onClose}>
        <i className="bi bi-x"></i>
      </button>
    </div>
  );
};

export default ToastNotification;