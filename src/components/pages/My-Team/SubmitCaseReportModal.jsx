import React, { useState, useEffect } from 'react';
import './SubmitCaseReportModal.css';
import { INCIDENT_TYPES } from '../../../constants/caseManagement';

const SubmitCaseReportModal = ({ show, onClose, onSubmit, employee }) => {
    const initialFormState = {
        issueDate: new Date().toISOString().split('T')[0],
        reason: INCIDENT_TYPES[0],
        description: '',
        attachment: null,
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (show) {
            setFormData(initialFormState);
            setErrors({});
        }
    }, [show]);

    if (!show) return null;

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] || null }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.reason.trim()) newErrors.reason = 'Please select a reason for the report.';
        if (!formData.description.trim()) newErrors.description = 'A detailed description of the incident is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="modal-header">
                            <h5 className="modal-title">Report Incident for {employee.name}</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <p className="text-muted">This report will be sent to HR for review. If approved, it will be logged as a formal case.</p>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label htmlFor="issueDate" className="form-label">Date of Incident*</label>
                                    <input type="date" id="issueDate" name="issueDate" className="form-control" value={formData.issueDate} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="reason" className="form-label">Reason / Infraction*</label>
                                    <select id="reason" name="reason" className={`form-select ${errors.reason ? 'is-invalid' : ''}`} value={formData.reason} onChange={handleChange}>
                                        {INCIDENT_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
                                </div>
                                <div className="col-12">
                                    <label htmlFor="description" className="form-label">Description of Incident*</label>
                                    <textarea id="description" name="description" className={`form-control ${errors.description ? 'is-invalid' : ''}`} rows="5" value={formData.description} onChange={handleChange} placeholder="Provide specific details about what occurred, including date, time, and any witnesses..."></textarea>
                                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                </div>
                                <div className="col-12">
                                    <label htmlFor="attachment" className="form-label">Supporting Evidence (Optional)</label>
                                    <input type="file" id="attachment" name="attachment" className="form-control" onChange={handleChange} />
                                    {formData.attachment && (
                                        <div className="attachment-display mt-2">
                                            <i className="bi bi-paperclip"></i>
                                            <span>{formData.attachment.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Submit Report to HR</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubmitCaseReportModal;