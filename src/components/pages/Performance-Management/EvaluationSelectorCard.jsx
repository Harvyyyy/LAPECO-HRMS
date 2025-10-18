import React, { useMemo } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import Avatar from '../../common/Avatar';

const EvaluationSelectorCard = ({ employee, positionTitle, lastEvaluation, onAction }) => {
  const { status, statusClass, lastEvalDateFormatted, isDue } = useMemo(() => {
    if (!lastEvaluation) {
      return { status: 'Due for Review', statusClass: 'due', lastEvalDateFormatted: 'N/A', isDue: true };
    }
    
    const lastEvalDate = parseISO(lastEvaluation.periodEnd);
    const valid = isValid(lastEvalDate);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const isDueCalc = !valid || lastEvalDate < sixMonthsAgo;

    return {
      status: isDueCalc ? 'Due for Review' : 'Completed',
      statusClass: isDueCalc ? 'due' : 'completed',
      lastEvalDateFormatted: valid ? format(lastEvalDate, 'MMM dd, yyyy') : 'N/A',
      isDue: isDueCalc,
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
          <h5 className="selector-name" title={employee.name}>{employee.name}</h5>
          <p className="selector-position text-muted mb-0" title={positionTitle}>{positionTitle}</p>
        </div>
      </div>
      <div className="card-status-panel">
        <div className="status-item">
          <i className="bi bi-calendar-event status-icon"></i>
          <span className="status-label">Last Evaluation</span>
          <span className="status-value">{lastEvalDateFormatted}</span>
        </div>
        <div className="status-item">
          <i className={`bi ${isDue ? 'bi-hourglass-split' : 'bi-check2-circle'} status-icon ${isDue ? 'due' : 'completed'}`}></i>
          <span className="status-label">Status</span>
          <span className={`status-badge-revised status-${statusClass}`}>{status}</span>
        </div>
        <div className="card-action-button">
          {/* Removed the View Last button as requested */}
          <button 
            className="btn btn-sm btn-success"
            onClick={() => onAction('start', employee)}
          >
            {status === 'Completed' ? 'Start New' : 'Start Evaluation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationSelectorCard;