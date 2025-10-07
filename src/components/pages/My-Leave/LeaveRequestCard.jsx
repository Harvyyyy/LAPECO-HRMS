import React from 'react';
import { differenceInDays } from 'date-fns';
import './MyLeavePage.css';

const LeaveRequestCard = ({ request, onCancel, onExtensionRequest, onEdit }) => {
  const startDate = new Date(request.dateFrom + 'T00:00:00');
  const statusClass = (request.status || 'pending').toLowerCase().replace(/\s+/g, '-');

  const isMaternityForLiveBirth = request.leaveType === 'Maternity Leave' && request.maternityDetails?.type === 'normal';
  const daysUntilEnd = differenceInDays(new Date(request.dateTo), new Date());
  
  const isExtensionEligible = isMaternityForLiveBirth && 
                              request.status === 'Approved' &&
                              !request.extensionStatus && 
                              daysUntilEnd >= 45;

  return (
    <div className={`leave-card status-${statusClass}`}>
      <div className="date-box">
        <span className="month">{startDate.toLocaleDateString('en-US', { month: 'short' })}</span>
        <span className="day">{startDate.getDate()}</span>
      </div>
      <div className="info-section">
        <div className="info-header">
          <h6 className="leave-type">{request.leaveType}</h6>
          <div className="d-flex align-items-center gap-2">
            {request.extensionStatus && (
              <span className={`status-badge status-${request.extensionStatus.toLowerCase()}`}>
                {request.extensionStatus} Extension
              </span>
            )}
            <span className={`status-badge status-${statusClass}`}>{request.status}</span>
            {request.status === 'Pending' && (
              <div className="pending-actions">
                <button 
                  className="btn btn-sm btn-icon" 
                  title="Edit Request"
                  onClick={() => onEdit(request)}
                >
                  <i className="bi bi-pencil-fill"></i>
                </button>
                <button 
                  className="btn btn-sm btn-icon cancel-request-btn" 
                  title="Cancel Request"
                  onClick={() => onCancel(request)}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="info-body">
          <div className="info-item">
            <i className="bi bi-calendar-range"></i>
            <span>{request.dateFrom} to {request.dateTo}</span>
          </div>
          <div className="info-item">
            <i className="bi bi-clock-history"></i>
            <span>{request.days} Day(s)</span>
          </div>
        </div>
        {request.reason && (
            <p className="info-reason text-muted fst-italic">
                "{request.reason}"
            </p>
        )}
        {isExtensionEligible && (
            <div className="mt-2 text-end">
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => onExtensionRequest(request)}
                >
                    Request 30-Day Unpaid Extension
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequestCard;