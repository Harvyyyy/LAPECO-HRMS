import React, { useState, useMemo } from 'react';
import './MyResignationPage.css';

const MyResignationPage = ({ currentUser, resignations, handlers }) => {
  const [lastDayOfWork, setLastDayOfWork] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});

  const myResignation = useMemo(() => {
    return resignations.find(r => r.employeeId === currentUser.id);
  }, [resignations, currentUser.id]);

  const calculatedEffectiveDate = useMemo(() => {
    const today = new Date();
    today.setDate(today.getDate() + 30);
    return today.toISOString().split('T')[0];
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!lastDayOfWork) newErrors.lastDayOfWork = 'Please indicate your desired last day of work.';
    if (!reason.trim()) newErrors.reason = 'A resignation letter/reason is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      handlers.submitResignation({
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        position: currentUser.position,
        lastDayOfWork,
        reason,
      });
      setLastDayOfWork('');
      setReason('');
    }
  };

  if (myResignation) {
    const statusClass = myResignation.status.toLowerCase();
    return (
      <div className="container-fluid p-0 page-module-container resignation-status-view">
        <header className="page-header mb-4">
          <h1 className="page-main-title">My Resignation Status</h1>
          <p className="text-muted">Your resignation request has been submitted. You can view its status below.</p>
        </header>
        <div className={`card status-card status-${statusClass}`}>
          <div className="card-header status-card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Request Submitted</h5>
            <span className={`status-badge status-${statusClass}`}>{myResignation.status}</span>
          </div>
          <div className="card-body">
            <div className="details-grid mb-4">
              <div className="detail-item">
                <span className="detail-label">Submission Date</span>
                <span className="detail-value">{myResignation.submissionDate}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Desired Last Day</span>
                <span className="detail-value">{myResignation.lastDayOfWork}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Official Effective Date</span>
                <span className="detail-value fw-bold">{myResignation.effectiveDate}</span>
              </div>
            </div>
            <h6 className="section-title">Submitted Letter</h6>
            <div className="resignation-letter-content">
              {myResignation.reason}
            </div>
            {myResignation.hrComments && (
                <>
                    <h6 className="section-title mt-4">HR Comments</h6>
                    <div className="alert alert-info">{myResignation.hrComments}</div>
                </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0 page-module-container">
      <header className="page-header mb-4">
        <h1 className="page-main-title">Submit Resignation</h1>
        <p className="text-muted">Please complete the form below to formally submit your resignation.</p>
      </header>
      <div className="card shadow-sm">
        <form onSubmit={handleSubmit} noValidate>
          <div className="card-body p-4">
            <div className="alert alert-info">
              <i className="bi bi-info-circle-fill me-2"></i>
              As per Philippine labor law, a 30-day notice period is generally required. Your official last day of employment will be calculated based on this.
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="lastDayOfWork" className="form-label">Desired Last Day of Work*</label>
                <input type="date" id="lastDayOfWork" className={`form-control ${errors.lastDayOfWork ? 'is-invalid' : ''}`} value={lastDayOfWork} onChange={e => setLastDayOfWork(e.target.value)} />
                {errors.lastDayOfWork && <div className="invalid-feedback">{errors.lastDayOfWork}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="effectiveDate" className="form-label">Calculated Effective Date (30-day notice)</label>
                <input type="date" id="effectiveDate" className="form-control" value={calculatedEffectiveDate} readOnly disabled />
                <div className="form-text">This date is for reference and may be adjusted by HR upon review.</div>
              </div>
              <div className="col-12">
                <label htmlFor="reason" className="form-label">Resignation Letter / Reason*</label>
                <textarea id="reason" rows="10" className={`form-control ${errors.reason ? 'is-invalid' : ''}`} value={reason} onChange={e => setReason(e.target.value)} placeholder="Please write your formal resignation letter here..."></textarea>
                {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
              </div>
            </div>
          </div>
          <div className="card-footer text-end">
            <button type="submit" className="btn btn-danger">
              <i className="bi bi-send-fill me-2"></i>Submit Resignation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyResignationPage;