import React, { useState } from 'react';
import './Login.css';

// --- Sample User Credentials for Demo ---
const sampleUsers = {
    'hr_user': { id: 'EMP005', password: 'password123' },
    'leader_carol': { id: 'EMP003', password: 'password123' },
    'leader_bob': { id: 'EMP002', password: 'password123' },
    'employee_alice': { id: 'EMP001', password: 'password123' },
};

const Login = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const user = sampleUsers[username];

    if (user && user.password === password) {
      console.log('Login successful for user ID:', user.id);
      if (onLoginSuccess) {
        onLoginSuccess(user.id);
      }
    } else {
      setError('Invalid username or password.');
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPasswordModal(true);
  };

  return (
    <>
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-container login-page-wrapper">
        <div className="logo-container text-center mb-4">
          <img src="/logo.png" alt="Lapeco Logo" className="login-page-logo img-fluid" />
        </div>

        <div className="login-card bg-light bg-opacity-75 p-4 shadow-lg rounded">
          <div className="row justify-content-center">
            <div className="col-md-12">
              <h2 className="text-center mb-1 login-title">Login</h2>

              <div className="login-error-container mb-3">
                {error && (
                  <div className="alert alert-danger py-2 fade show" role="alert">
                    {error}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="mb-3">
                  <label htmlFor="username" className="form-label login-label">Username</label>
                  <input
                    type="text"
                    className="form-control login-input"
                    id="username"
                    placeholder="e.g., leader_carol"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label login-label">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control login-input"
                      id="password"
                      placeholder="password123"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <span className="input-group-text login-input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                      <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                    </span>
                  </div>
                </div>
                <div className="d-flex justify-content-end mb-4">
                  <a href="#" className="text-success text-decoration-none login-forgot-password" onClick={handleForgotPasswordClick}>
                    Forgot Password?
                  </a>
                </div>
                <button type="submit" className="btn btn-success w-100 login-button">
                  Login
                </button>
              </form>
              
              <div className="mt-4 text-center text-muted small">
                  <p className="mb-1"><strong>Sample Users:</strong></p>
                  <ul className="list-unstyled mb-0">
                      <li>hr_user (HR)</li>
                      <li>leader_carol (Team Leader)</li>
                      <li>leader_bob (Team Leader)</li>
                      <li>employee_alice (Regular)</li>
                  </ul>
                  <p className="mt-1">Password for all is: <strong>password123</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForgotPasswordModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="bi bi-shield-lock-fill me-2"></i>Password Reset</h5>
                <button type="button" className="btn-close" onClick={() => setShowForgotPasswordModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>For security reasons, password resets must be handled by an authorized administrator.</p>
                <p className="mb-0"><strong>Please contact an HR Personnel to request a password reset for your account.</strong></p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => setShowForgotPasswordModal(false)}>
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;