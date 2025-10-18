import React from 'react';
import './Avatar.css';

const Avatar = ({ src, alt = 'Avatar', size = 'md', className = '' }) => {
  // Simple error handler in case a provided src link is broken
  const handleError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling?.classList.remove('d-none');
  };

  return (
    <>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`avatar-component avatar-${size} ${className}`}
          onError={handleError}
        />
      ) : (
        <div className={`avatar-component avatar-placeholder avatar-${size} ${className}`} title={alt}>
          <i className="bi bi-person-fill"></i>
        </div>
      )}
      {/* Fallback placeholder for broken images, hidden by default */}
      {src && (
        <div className={`avatar-component avatar-placeholder avatar-${size} ${className} d-none`} title={alt}>
          <i className="bi bi-person-fill"></i>
        </div>
      )}
    </>
  );
};

export default Avatar;