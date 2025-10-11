import React, { useState, useMemo, useEffect } from 'react';
import ConfirmationModal from '../../modals/ConfirmationModal';
import './MyResignationPage.css';

const RESIGNATION_LETTER_TEMPLATE = `Dear [Manager's Name],

Please accept this letter as formal notification that I am resigning from my position as [Your Position Title] at [Company Name]. My last day of employment will be [Your Last Day of Work].

Thank you for the opportunity to have worked in this position for the past [Duration of Employment]. I've greatly enjoyed and appreciated the opportunities I've had, and I am thankful for the skills I've learned.

I wish the company all the very best and I hope to stay in touch in the future.

Sincerely,
[Your Name]`;

const OffboardingStepper = ({ status }) => {
    const steps = [
        { name: 'Submission', description: 'Your request has been sent.' },
        { name: 'HR Review', description: 'HR is reviewing your request.' },
        { name: 'Handover', description: 'Knowledge transfer and asset handover period.' },
        { name: 'Clearance & Exit Interview', description: 'Final sign-offs and feedback session.' },
        { name: 'Final Pay', description: 'Your final compensation is being processed.' },
    ];

    const getStepStatus = (stepIndex) => {
        const statusMap = {
            'Pending': 1,
            'Approved': 2, 
        };
        const currentStepIndex = statusMap[status] || 0;
        
        if (stepIndex < currentStepIndex) return 'completed';
        if (stepIndex === currentStepIndex) return 'active';
        return 'pending';
    };

    return (
        <div className="offboarding-stepper">
            {steps.map((step, index) => (
                <div key={step.name} className={`step-item ${getStepStatus(index)}`}>
                    <div className="step-circle">{getStepStatus(index) === 'completed' ? <i className="bi bi-check-lg"></i> : index + 1}</div>
                    <div>
                        <div className="step-label">{step.name}</div>
                        <div className="step-description">{step.description}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};


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

  const handleUseTemplate = () => {
    const name = currentUser.name || '[Your Name]';
    const position = currentUser.position || '[Your Position Title]';
    const template = RESIGNATION_LETTER_TEMPLATE
        .replace('[Manager\'s Name]', '[Manager\'s Name]')
        .replace('[Your Position Title]', position)
        .replace('[Company Name]', 'Lapeco Group of Companies')
        .replace('[Your Last Day of Work]', lastDayOfWork || '[Your Last Day of Work]')
        .replace('[Duration of Employment]', '[Duration of Employment]')
        .replace('[Your Name]', name);
    setReason(template);
  };

  if (myResignation) {
    const statusClass = myResignation.status.toLowerCase();
    return (
      <div className="container-fluid p-0 page-module-container resignation-status-view">
        <header className="page-header mb-4">
          <h1 className="page-main-title">My Resignation Status</h1>
          <p className="text-muted">Your resignation request is being processed. Here is the current status.</p>
        </header>
        <div className="row">
            <div className="col-lg-8">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Offboarding Process</h5>
                         <span className={`status-badge status-${statusClass}`}>{myResignation.status}</span>
                    </div>
                    <div className="card-body">
                        <OffboardingStepper status={myResignation.status} />
                    </div>
                </div>
                 <div className="card mt-4">
                    <div className="card-header"><h6 className="mb-0">Submitted Letter</h6></div>
                    <div className="card-body">
                         <div className="resignation-letter-content">
                            {myResignation.reason}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-4">
                <div className="card">
                     <div className="card-header"><h6 className="mb-0">Your Details</h6></div>
                     <div className="card-body">
                        <div className="details-grid">
                          <div className="detail-item">
                            <span className="detail-label">Submission Date</span>
                            <span className="detail-value">{myResignation.submissionDate}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Official Effective Date</span>
                            <span className="detail-value fw-bold">{myResignation.effectiveDate}</span>
                          </div>
                        </div>
                        {myResignation.hrComments && (
                            <>
                                <hr/>
                                <div className="detail-item">
                                    <span className="detail-label">HR Comments</span>
                                    <div className="alert alert-info py-2 px-3 mb-0">{myResignation.hrComments}</div>
                                </div>
                            </>
                        )}
                     </div>
                </div>
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
      <div className="row g-4">
        <div className="col-lg-8">
            <div className="card shadow-sm">
                <form onSubmit={handleSubmit} noValidate>
                <div className="card-body p-4">
                    <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="lastDayOfWork" className="form-label">Desired Last Day of Work*</label>
                        <input type="date" id="lastDayOfWork" className={`form-control ${errors.lastDayOfWork ? 'is-invalid' : ''}`} value={lastDayOfWork} onChange={e => setLastDayOfWork(e.target.value)} />
                        {errors.lastDayOfWork && <div className="invalid-feedback">{errors.lastDayOfWork}</div>}
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="effectiveDate" className="form-label">Calculated Effective Date</label>
                        <input type="date" id="effectiveDate" className="form-control" value={calculatedEffectiveDate} readOnly disabled />
                        <div className="form-text">Based on a 30-day notice. May be adjusted by HR.</div>
                    </div>
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label htmlFor="reason" className="form-label mb-0">Resignation Letter / Reason*</label>
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleUseTemplate}>Use Template</button>
                        </div>
                        <textarea id="reason" rows="12" className={`form-control ${errors.reason ? 'is-invalid' : ''}`} value={reason} onChange={e => setReason(e.target.value)} placeholder="Please write your formal resignation letter here..."></textarea>
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
        <div className="col-lg-4">
            <div className="info-panel">
                <h5><i className="bi bi-info-circle-fill me-2"></i>What to Expect</h5>
                <p>Here’s a brief overview of the offboarding process after you submit your request.</p>
                <ul>
                    <li><strong>30-Day Notice:</strong> Philippine labor law generally requires a 30-day notice period, which is used to calculate your official last day.</li>
                    <li><strong>HR Review:</strong> Your request will be reviewed by HR and your manager. You will be notified once it is approved.</li>
                    <li><strong>Clearance Process:</strong> You will be required to complete clearance procedures, including asset turnover.</li>
                    <li><strong>Final Pay:</strong> Your final compensation, including any unused leave credits, will be processed after your clearance is complete.</li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MyResignationPage;