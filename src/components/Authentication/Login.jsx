import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('HR_PERSONNEL');
  const [error, setError] = useState('');

  const availableRoles = [
    { value: 'HR_PERSONNEL', label: 'HR Personnel / Manager' },
    { value: 'TEAM_LEADER', label: 'Team Leader' },
    { value: 'REGULAR_EMPLOYEE', label: 'Regular Employee' },
  ];

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleUsernameChange = (event) => { setUsername(event.target.value); setError(''); };
  const handlePasswordChange = (event) => { setPassword(event.target.value); setError(''); };
  const handleRoleChange = (event) => setSelectedRole(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    if (!selectedRole) {
      setError('Please select a role.');
      return;
    }
    console.log('Login attempt with:', { username, password, role: selectedRole });
    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess(selectedRole);
      } else {
        console.warn("onLoginSuccess prop not provided");
      }
    }, 500);
  };

  return (
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
                  placeholder="Enter your username"
                  value={username}
                  onChange={handleUsernameChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label login-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control login-input"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <span className="input-group-text login-input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                    <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                  </span>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label login-label">Login as:</label>
                <select
                  id="role"
                  className="form-select login-input"
                  value={selectedRole}
                  onChange={handleRoleChange}
                >
                  {availableRoles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex justify-content-end mb-4">
                <a href="#" className="text-success text-decoration-none login-forgot-password" onClick={(e) => e.preventDefault()}>
                  Forgot Password?
                </a>
              </div>
              <button type="submit" className="btn btn-success w-100 login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;