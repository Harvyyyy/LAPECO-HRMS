// src/components/modals/AddEditPositionModal.jsx (UPDATED)

import React, { useState, useEffect, useMemo } from 'react';
import './AddEditPositionModal.css';

const AddEditPositionModal = ({ show, onClose, onSave, positionData }) => {
  const initialFormState = { 
    title: '', 
    description: '', 
    hourlyRate: '', 
    overtimeRate: '',
    nightDiffRate: '',
    lateDeductionPerMin: ''
  };
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('details');

  const isEditMode = Boolean(positionData && positionData.id);

  useEffect(() => {
    if (show) {
      if (isEditMode && positionData) {
        setFormData({
          title: positionData.title || '',
          description: positionData.description || '',
          hourlyRate: positionData.hourlyRate || 0,
          overtimeRate: positionData.overtimeRate || 0,
          nightDiffRate: positionData.nightDiffRate || 0,
          lateDeductionPerMin: positionData.lateDeductionPerMin || 0,
        });
      } else {
        setFormData(initialFormState);
      }
      setActiveTab('details');
      setErrors({});
    }
  }, [positionData, show, isEditMode]); 
  
  const monthlySalary = useMemo(() => {
    const rate = parseFloat(formData.hourlyRate);
    if (isNaN(rate) || rate <= 0) return 0;
    // Standard calculation: hourly rate * 8 hours/day * 22 days/month
    return rate * 8 * 22;
  }, [formData.hourlyRate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Position title is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.hourlyRate || isNaN(formData.hourlyRate) || Number(formData.hourlyRate) <= 0) {
      newErrors.hourlyRate = 'Hourly rate must be a valid positive number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({ ...formData, monthlySalary }, positionData?.id);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content position-form-modal">
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-header">
              <h5 className="modal-title">{isEditMode ? 'Edit Position' : 'Add New Position'}</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                  <button type="button" className={`nav-link ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>Details</button>
                </li>
                <li className="nav-item">
                  <button type="button" className={`nav-link ${activeTab === 'pay' ? 'active' : ''}`} onClick={() => setActiveTab('pay')}>Pay Structure</button>
                </li>
              </ul>

              <div className="tab-content">
                {activeTab === 'details' && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">Position Title*</label>
                      <input type="text" className={`form-control ${errors.title ? 'is-invalid' : ''}`} id="title" name="title" value={formData.title} onChange={handleChange} required />
                      {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Description*</label>
                      <textarea className={`form-control ${errors.description ? 'is-invalid' : ''}`} id="description" name="description" rows="4" value={formData.description} onChange={handleChange} required></textarea>
                      {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>
                  </>
                )}

                {activeTab === 'pay' && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="hourlyRate" className="form-label">Base Rate (per hour)*</label>
                      <div className="input-group">
                          <span className="input-group-text">₱</span>
                          <input type="number" step="0.01" className={`form-control ${errors.hourlyRate ? 'is-invalid' : ''}`} id="hourlyRate" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} required placeholder="e.g., 102.27" />
                      </div>
                      {errors.hourlyRate && <div className="invalid-feedback d-block">{errors.hourlyRate}</div>}
                    </div>
                    <div className="alert alert-info small">
                        Calculated Monthly Salary: <strong className="fs-6">₱ {monthlySalary.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
                        <br/>
                        <small className="text-muted">Based on (Rate × 8 hours × 22 days)</small>
                    </div>
                    <hr/>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label htmlFor="overtimeRate" className="form-label">Overtime Rate (/hr)</label>
                            <div className="input-group"><span className="input-group-text">₱</span><input type="number" step="0.01" className="form-control" id="overtimeRate" name="overtimeRate" value={formData.overtimeRate} onChange={handleChange} /></div>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="nightDiffRate" className="form-label">Night Diff. Rate (/hr)</label>
                            <div className="input-group"><span className="input-group-text">₱</span><input type="number" step="0.01" className="form-control" id="nightDiffRate" name="nightDiffRate" value={formData.nightDiffRate} onChange={handleChange} /></div>
                        </div>
                         <div className="col-md-6">
                            <label htmlFor="lateDeductionPerMin" className="form-label">Late Deduction (/min)</label>
                            <div className="input-group"><span className="input-group-text">₱</span><input type="number" step="0.01" className="form-control" id="lateDeductionPerMin" name="lateDeductionPerMin" value={formData.lateDeductionPerMin} onChange={handleChange} /></div>
                        </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-success">{isEditMode ? 'Save Changes' : 'Add Position'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditPositionModal;