import React from 'react';
import ScoreIndicator from '../Performance-Management/ScoreIndicator';
import Avatar from '../../common/Avatar';

const EmployeeInsightCard = ({ employee, positionTitle, trendIcon, trendText, trendColor }) => {
  return (
    <div className="employee-insight-card">
      <div className="info">
        <Avatar src={employee.imageUrl} alt={employee.name} size="md" className="avatar" />
        <div>
          <h6 className="name">{employee.name}</h6>
          <p className="position">{positionTitle}</p>
        </div>
      </div>
      <div className="performance-summary">
        <ScoreIndicator score={employee.latestScore} />
        {trendIcon && (
          <div className={`trend-indicator ${trendColor}`}>
            <i className={`bi ${trendIcon}`}></i>
            <span>{trendText}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeInsightCard;