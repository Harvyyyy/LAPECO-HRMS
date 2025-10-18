import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { INCIDENT_TYPES } from '../../../constants/caseManagement';
import { USER_ROLES } from '../../../constants/roles';
import ConfirmationModal from '../../modals/ConfirmationModal';
import './SubmitReportPage.css';

const SubmitReportPage = ({ currentUser, employees = [], handlers, userRole }) => {
  const { theme } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const initialFormState = {
    employeeId: userRole === USER_ROLES.REGULAR_EMPLOYEE ? currentUser.id : null,
    issueDate: new Date().toISOString().split('T')[0],
    reason: INCIDENT_TYPES[0],
    description: '',
    attachment: null,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    // Pre-fill employee if navigating from MyTeamPage
    if (location.state?.employeeToReportId && userRole === USER_ROLES.TEAM_LEADER) {
      setFormData(prev => ({ ...prev, employeeId: location.state.employeeToReportId }));
    }
  }, [location.state, userRole]);

  const employeeOptions = useMemo(() => {
    if (userRole === USER_ROLES.TEAM_LEADER) {
      const teamMembers = employees.filter(emp => emp.positionId === currentUser.positionId && !emp.isTeamLeader);
      // Team leader can report themselves or their members
      const reportableEmployees = [currentUser, ...teamMembers];
      return reportableEmployees.map(emp => ({ value: emp.id, label: `${emp.name} (${emp.id})` }));
    }
    // Regular employees can only report themselves
    if (userRole === USER_ROLES.REGULAR_EMPLOYEE) {
      return [{ value: currentUser.id, label: `${currentUser.name} (${currentUser.id})` }];
    }
    return [];
  }, [employees, currentUser, userRole]);

  const selectedEmployeeName = useMemo(() => {
    return employeeOptions.find(opt => opt.value === formData.employeeId)?.label || '';
  }, [formData.employeeId, employeeOptions]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleEmployeeSelect = (selectedOption) => {
    setFormData(prev => ({ ...prev, employeeId: selectedOption ? selectedOption.value : null }));
    if (errors.employeeId) {
      setErrors(prev => ({ ...prev, employeeId: null }));
    }
  };

  const removeAttachment = () => {
    setFormData(prev => ({ ...prev, attachment: null }));
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.employeeId) newErrors.employeeId = 'You must select an employee to report.';
    if (!formData.issueDate) newErrors.issueDate = 'The date of the incident is required.';
    if (!formData.description.trim()) newErrors.description = 'A detailed description is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSubmit = () => {
    handlers.submitCaseReport({
        ...formData,
        submittedBy: currentUser.id
    });
    setShowConfirmModal(false);
    navigate('/dashboard');
  };

  return (
    <>
      <div className="container-fluid p-0 page-module-container">
        <header className="page-header mb-4">
          <h1 className="page-main-title">Submit Incident Report</h1>
          <p className="text-muted">Use this form to formally report a workplace incident to HR for review.</p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="submit-report-grid">
            <div className="report-form-main">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="employeeId" className="form-label fw-bold">Employee to Report*</label>
                      {userRole === USER_ROLES.REGULAR_EMPLOYEE ? (
                        <input type="text" className="form-control" value={currentUser.name} readOnly disabled />
                      ) : (
                        <Select
                          id="employeeId"
                          options={employeeOptions}
                          onChange={handleEmployeeSelect}
                          value={employeeOptions.find(opt => opt.value === formData.employeeId)}
                          placeholder="Search and select an employee..."
                          className={`react-select-container ${errors.employeeId ? 'is-invalid' : ''}`}
                          classNamePrefix="react-select"
                        />
                      )}
                      {errors.employeeId && <div className="invalid-feedback d-block">{errors.employeeId}</div>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="issueDate" className="form-label fw-bold">Date of Incident*</label>
                      <input type="date" id="issueDate" name="issueDate" className={`form-control ${errors.issueDate ? 'is-invalid' : ''}`} value={formData.issueDate} onChange={handleChange} required />
                      {errors.issueDate && <div className="invalid-feedback">{errors.issueDate}</div>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="reason" className="form-label fw-bold">Reason / Infraction*</label>
                      <select id="reason" name="reason" className="form-select" value={formData.reason} onChange={handleChange}>
                        {INCIDENT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <label htmlFor="description" className="form-label fw-bold">Detailed Description*</label>
                      <textarea 
                        id="description" 
                        name="description" 
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`} 
                        rows="8" 
                        value={formData.description} 
                        onChange={handleChange} 
                        placeholder={
`Provide a clear and factual account of the incident. Include details such as:
- What happened?
- Who was involved?
- When and where did it occur?
- Were there any witnesses?`
                        }
                      ></textarea>
                      {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>
                    <div className="col-12">
                      <label htmlFor="attachment" className="form-label fw-bold">Supporting Evidence (Optional)</label>
                      <p className="form-text text-muted mt-0">Attach any relevant documents, images, or screenshots.</p>
                      <input ref={fileInputRef} type="file" id="attachment" name="attachment" className="form-control" onChange={handleChange} />
                      {formData.attachment && (
                        <div className="attachment-display mt-2">
                          <i className="bi bi-paperclip"></i>
                          <span>{formData.attachment.name}</span>
                          <button type="button" className="btn-close btn-sm" onClick={removeAttachment} aria-label="Remove attachment"></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-footer text-end">
                    <button type="submit" className="btn btn-primary">
                        <i className="bi bi-send-fill me-2"></i>Submit Report to HR
                    </button>
                </div>
              </div>
            </div>
            <div className="report-form-sidebar">
              <div className="card instructions-card">
                <div className="card-header">
                  <h6 className="mb-0"><i className="bi bi-info-circle-fill me-2"></i>Submission Guidelines</h6>
                </div>
                <div className="card-body">
                  <p><strong>Be Factual and Specific:</strong> Provide clear, objective details about the incident. Avoid assumptions and emotional language.</p>
                  <p><strong>Confidentiality:</strong> Your submission will be sent directly to the HR department for review. The contents of this report are confidential.</p>
                  <p><strong>Next Steps:</strong> Once submitted, HR will investigate the matter and take appropriate action. You may be contacted for further information.</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <ConfirmationModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Confirm Report Submission"
        confirmText="Yes, Submit Report"
        confirmVariant="primary"
      >
        <p>You are about to submit an incident report regarding:</p>
        <ul className="list-unstyled bg-light p-3 rounded">
            <li><strong>Employee:</strong> {selectedEmployeeName}</li>
            <li><strong>Reason:</strong> {formData.reason}</li>
            <li><strong>Date:</strong> {formData.issueDate}</li>
        </ul>
        <p className="fw-bold">Please confirm that the information you have provided is accurate to the best of your knowledge.</p>
      </ConfirmationModal>
    </>
  );
};

export default SubmitReportPage;