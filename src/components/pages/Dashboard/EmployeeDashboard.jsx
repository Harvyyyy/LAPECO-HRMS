import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

const EmployeeDashboard = ({ 
  currentUser = { name: 'Employee', employeeId: '' }, 
  schedules = [], 
  holidays = [] 
}) => {
  const leaveBalances = { vl: 12, sl: 8 };

  const today = new Date().toISOString().split('T')[0];
  
  const myScheduleToday = schedules.find(s => s.empId === currentUser.employeeId && s.date === today);

  const upcomingHolidays = useMemo(() => {
    return holidays
      .filter(h => new Date(h.date) >= new Date(today))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  }, [holidays, today]);

  return (
    <div className="dashboard-grid">
      <div className="dashboard-grid-span-4">
        <div className="welcome-header">
          <h2>Welcome, {currentUser.name.split(' ')[0]}!</h2>
        </div>
      </div>
      
      <div className="dashboard-grid-span-2 dashboard-card my-status-card">
          <div className="card-header"><h6>My Status Today</h6></div>
          <div className="card-body text-center">
              <i className={`bi ${myScheduleToday ? 'bi-calendar-check' : 'bi-calendar-x'} status-icon`}></i>
              <h4 className="status-text">{myScheduleToday ? "You are scheduled to work" : "You have the day off"}</h4>
              {myScheduleToday && <p className="status-detail">Shift: {myScheduleToday.shift}</p>}
          </div>
      </div>

      <div className="dashboard-grid-span-2">
        <div className="dashboard-stats-container">
            <div className="dashboard-stat-card">
                <div className="stat-icon icon-vl"><i className="bi bi-briefcase-fill"></i></div>
                <div className="stat-info"><span className="stat-value">{leaveBalances.vl}</span><span className="stat-label">Vacation Leaves</span></div>
            </div>
            <div className="dashboard-stat-card">
                <div className="stat-icon icon-sl"><i className="bi bi-heart-pulse-fill"></i></div>
                <div className="stat-info"><span className="stat-value">{leaveBalances.sl}</span><span className="stat-label">Sick Leaves</span></div>
            </div>
        </div>
      </div>

      <div className="dashboard-grid-span-2 dashboard-card">
        <div className="card-header"><h6>Quick Actions</h6></div>
        <div className="card-body">
            <div className="quick-actions-grid">
                <Link to="/dashboard/my-leave" className="action-card-link"><i className="bi bi-calendar-plus-fill"></i><span>Request Leave</span></Link>
                <Link to="/dashboard/my-payroll" className="action-card-link"><i className="bi bi-file-earmark-text-fill"></i><span>View Payslips</span></Link>
            </div>
        </div>
      </div>
      
      <div className="dashboard-grid-span-2 dashboard-card">
        <div className="card-header"><h6>Upcoming Holidays</h6></div>
        <div className="card-body">
            <ul className="dashboard-list-group">
                {upcomingHolidays.map(h => (
                    <li key={h.id}><span>{h.name}</span> <span className="text-muted">{h.date}</span></li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;