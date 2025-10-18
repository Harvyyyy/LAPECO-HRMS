import React, { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import Avatar from '../../common/Avatar';

const EvaluationSelectorCard = ({ employee, positionTitle, lastEvaluation, onAction }) => {
  const { status, statusClass, lastEvalDateFormatted } = useMemo(() => {
    // This logic correctly determines the status and remains unchanged.
    if (!lastEvaluation) {
      return { status: 'Due for Review', statusClass: 'due', lastEvalDateFormatted: 'N/A' };
    }
    
    const lastEvalDate = parseISO(lastEvaluation.periodEnd);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const isDue = lastEvalDate < sixMonthsAgo;

    return {
      status: isDue ? 'Due for Review' : 'Completed',
      statusClass: isDue ? 'due' : 'completed',
      lastEvalDateFormatted: format(lastEvalDate, 'MMM dd, yyyy')
    };
  }, [lastEvaluation]);

  const avatarSrc = employee.avatarUrl || employee.imageUrl || undefined;

  return (
    <div className="evaluation-selector-card-revised">
      <div className="card-main-info">
        <Avatar
          src={avatarSrc}
          alt={employee.name}
          size="lg"
          className="selector-avatar"
        />
        <div className="selector-info">
          <h5 className="selector-name">{employee.name}</h5>
          <p className="selector-position text-muted mb-0">{positionTitle}</p>
        </div>
      </div>
      <div className="card-status-panel">
        <div className="status-item-revised">
            <i className="bi bi-calendar-event status-icon-revised"></i>
            <span className="status-label">Last Evaluation</span>
            <span className="status-value">{lastEvalDateFormatted}</span>
        </div>
        <div className="status-item-revised">
            <i className={`bi ${statusClass === 'due' ? 'bi-hourglass-split' : 'bi-check2-circle'} status-icon-revised ${statusClass}`}></i>
            <span className="status-label">Status</span>
            <span className={`status-badge-revised status-${statusClass}`}>{status}</span>
        </div>
        <div className="card-action-buttons-revised">
          {status === 'Completed' ? (
            <>
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => onAction('view', lastEvaluation)}
              >
                View Last
              </button>
              <button 
                className="btn btn-sm btn-success"
                onClick={() => onAction('start', employee)}
              >
                Start New
              </button>
            </>
          ) : (
            <button 
              className="btn btn-sm btn-success"
              onClick={() => onAction('start', employee)}
            >
              Start Evaluation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationSelectorCard;