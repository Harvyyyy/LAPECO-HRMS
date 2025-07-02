import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { USER_ROLES } from '../../../constants/roles';
import './Dashboard.css';

import HRDashboard from './HRDashboard';
import TeamLeaderDashboard from './TeamLeaderDashboard';
import EmployeeDashboard from './EmployeeDashboard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = (props) => {
  const { userRole } = props;

  const renderDashboardByRole = () => {
    switch (userRole) {
      case USER_ROLES.HR_PERSONNEL:
        return <HRDashboard {...props} />;
      case USER_ROLES.TEAM_LEADER:
        return <TeamLeaderDashboard {...props} />;
      case USER_ROLES.REGULAR_EMPLOYEE:
        return <EmployeeDashboard {...props} />;
      default:
        return <div className="p-5 text-center">Welcome! Your dashboard is being configured.</div>;
    }
  };

  return (
    <div className="dashboard-container">
      {renderDashboardByRole()}
    </div>
  );
};

export default Dashboard;