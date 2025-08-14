import React, { useState, useEffect, useRef } from 'react';
import './AddEditEmployeeModal.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import placeholderImage from '../../assets/placeholder-profile.jpg';

const AddEditEmployeeModal = ({ show, onClose, onSave, employeeData, positions, viewOnly = false, onSwitchToEdit }) => {
  const initialFormState = {
    firstName: '', middleName: '', lastName: '',
    email: '', positionId: '',
    joiningDate: new Date().toISOString().split('T')[0],
    birthday: '', gender: '', address: '', contactNumber: '',
    imageUrl: null, imagePreviewUrl: placeholderImage,
    sssNo: '', tinNo: '', pagIbigNo: '', philhealthNo: '',
    status: 'Active',
    resumeFile: null, 
    resumeUrl: null,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [activeTab, setActiveTab] = useState('personal');
  const [isViewMode, setIsViewMode] = useState(viewOnly);
  const fileInputRef = useRef(null);

  const isEditMode = Boolean(employeeData && employeeData.id);

  useEffect(() => {
    if (show) {
      setIsViewMode(viewOnly);
      if (isEditMode && employeeData) {
        setFormData({
          firstName: employeeData.firstName || '',
          middleName: employeeData.middleName || '',
          lastName: employeeData.lastName || '',
          email: employeeData.email || '',
          positionId: employeeData.positionId || '',
          joiningDate: employeeData.joiningDate || new Date().toISOString().split('T')[0],
          birthday: employeeData.birthday || '',
          gender: employeeData.gender || '',
          address: employeeData.address || '',
          contactNumber: employeeData.contactNumber || '',
          imageUrl: employeeData.imageUrl || null,
          imagePreviewUrl: employeeData.imageUrl || placeholderImage,
          sssNo: employeeData.sssNo || '',
          tinNo: employeeData.tinNo || '',
          pagIbigNo: employeeData.pagIbigNo || '',
          philhealthNo: employeeData.philhealthNo || '',
          status: employeeData.status || 'Active',
          resumeFile: null,
          resumeUrl: employeeData.resumeUrl || null,
        });
      } else {
        setFormData(initialFormState);
      }
      setActiveTab('personal');
      setFormErrors({});
    }
  }, [employeeData, show, isEditMode, viewOnly]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (name === 'imageUrl') {
        if (file) {
          setFormData({ ...formData, imageUrl: file, imagePreviewUrl: URL.createObjectURL(file) });
        }
      } else if (name === 'resumeFile') {
        setFormData({ ...formData, resumeFile: file, resumeUrl: file ? URL.createObjectURL(file) : employeeData?.resumeUrl || null });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First Name is required.';
    if (!formData.lastName.trim()) errors.lastName = 'Last Name is required.';
    if (!formData.email.trim()) { errors.email = 'Email is required.'; } 
    else if (!/\S+@\S+\.\S+/.test(formData.email)) { errors.email = 'Email address is invalid.';}
    if (!formData.positionId) errors.positionId = 'Position is required.';
    if (!formData.joiningDate) errors.joiningDate = 'Joining date is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSave = { ...formData };
      delete dataToSave.imagePreviewUrl;
      onSave(dataToSave, employeeData?.id);
      onClose();
    }
  };

  if (!show) {
    return null;
  }

  const modalTitle = isViewMode ? 'View Employee Details' : (isEditMode ? 'Edit Employee Details' : 'Add New Employee');
  
  const displayName = isViewMode || isEditMode 
    ? [employeeData?.firstName, employeeData?.middleName, employeeData?.lastName].filter(Boolean).join(' ')
    : 'New Employee';

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-header">
              <h5 className="modal-title">{modalTitle}</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body employee-form-modal-body">
              <div className="employee-form-container">
                <div className="employee-form-left-column">
                  <div className={`employee-profile-img-container ${isViewMode ? '' : 'editable'}`} onClick={() => !isViewMode && fileInputRef.current.click()}>
                    <img src={formData.imagePreviewUrl} alt="Profile Preview" className="employee-profile-img-form" onError={(e) => { e.target.src = placeholderImage; }} />
                    {!isViewMode && <div className="employee-profile-img-overlay"><i className="bi bi-camera-fill"></i></div>}
                  </div>
                  <input type="file" ref={fileInputRef} name="imageUrl" accept="image/*" onChange={handleChange} className="d-none" disabled={isViewMode} />
                  
                  <h5 className="mt-3 mb-3 text-center">{displayName}</h5>

                  <div className="form-group">
                    <label htmlFor="positionId" className="form-label">Position*</label>
                    <select className={`form-select ${formErrors.positionId ? 'is-invalid' : ''}`} id="positionId" name="positionId" value={formData.positionId} onChange={handleChange} required disabled={isViewMode}>
                        <option value="">Select a position...</option>
                        {(positions || []).map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                    {formErrors.positionId && <div className="invalid-feedback">{formErrors.positionId}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="joiningDate" className="form-label">Joining Date*</label>
                    <input type="date" className={`form-control ${formErrors.joiningDate ? 'is-invalid' : ''}`} id="joiningDate" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required disabled={isViewMode} />
                    {formErrors.joiningDate && <div className="invalid-feedback">{formErrors.joiningDate}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="status" className="form-label">Status*</label>
                    <select className="form-select" id="status" name="status" value={formData.status} onChange={handleChange} disabled={isViewMode}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="employee-form-right-column">
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      <button type="button" className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>Personal Details</button>
                    </li>
                    <li className="nav-item">
                      <button type="button" className={`nav-link ${activeTab === 'statutory' ? 'active' : ''}`} onClick={() => setActiveTab('statutory')}>Government Requirements</button>
                    </li>
                    <li className="nav-item">
                      <button type="button" className={`nav-link ${activeTab === 'resume' ? 'active' : ''}`} onClick={() => setActiveTab('resume')}>Resume</button>
                    </li>
                  </ul>
                  <div className="tab-content">
                    {activeTab === 'personal' && (
                      <div>
                        <div className="row g-3 mb-3">
                            <div className="col-md-5">
                                <label htmlFor="firstName" className="form-label">First Name*</label>
                                <input type="text" className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`} id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required disabled={isViewMode} />
                                {formErrors.firstName && <div className="invalid-feedback">{formErrors.firstName}</div>}
                            </div>
                             <div className="col-md-2">
                                <label htmlFor="middleName" className="form-label">Middle Name</label>
                                <input type="text" className="form-control" id="middleName" name="middleName" value={formData.middleName} onChange={handleChange} disabled={isViewMode} />
                            </div>
                            <div className="col-md-5">
                                <label htmlFor="lastName" className="form-label">Last Name*</label>
                                <input type="text" className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`} id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required disabled={isViewMode} />
                                {formErrors.lastName && <div className="invalid-feedback">{formErrors.lastName}</div>}
                            </div>
                        </div>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label htmlFor="email" className="form-label">Email Address*</label>
                            <input type="email" className={`form-control ${formErrors.email ? 'is-invalid' : ''}`} id="email" name="email" value={formData.email} onChange={handleChange} required disabled={isViewMode} />
                            {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                            <input type="tel" className="form-control" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} disabled={isViewMode} />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="birthday" className="form-label">Birthday</label>
                            <input type="date" className="form-control" id="birthday" name="birthday" value={formData.birthday} onChange={handleChange} disabled={isViewMode} />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="gender" className="form-label">Gender</label>
                            <select className="form-select" id="gender" name="gender" value={formData.gender} onChange={handleChange} disabled={isViewMode}>
                              <option value="">Select...</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="col-12">
                            <label htmlFor="address" className="form-label">Address</label>
                            <textarea className="form-control" id="address" name="address" rows="3" value={formData.address} onChange={handleChange} disabled={isViewMode}></textarea>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTab === 'statutory' && (
                      <div>
                        <div className="row g-3">
                          <div className="col-md-6"><label htmlFor="sssNo" className="form-label">SSS No.</label><input type="text" className="form-control" id="sssNo" name="sssNo" value={formData.sssNo} onChange={handleChange} disabled={isViewMode} /></div>
                          <div className="col-md-6"><label htmlFor="tinNo" className="form-label">TIN No.</label><input type="text" className="form-control" id="tinNo" name="tinNo" value={formData.tinNo} onChange={handleChange} disabled={isViewMode} /></div>
                          <div className="col-md-6"><label htmlFor="pagIbigNo" className="form-label">Pag-IBIG No.</label><input type="text" className="form-control" id="pagIbigNo" name="pagIbigNo" value={formData.pagIbigNo} onChange={handleChange} disabled={isViewMode} /></div>
                          <div className="col-md-6"><label htmlFor="philhealthNo" className="form-label">PhilHealth No.</label><input type="text" className="form-control" id="philhealthNo" name="philhealthNo" value={formData.philhealthNo} onChange={handleChange} disabled={isViewMode} /></div>
                        </div>
                      </div>
                    )}
                    {activeTab === 'resume' && (
                      <div className="resume-tab-container">
                        {!isViewMode && (
                          <div className="mb-3">
                            <label htmlFor="resumeFile" className="form-label">Upload New Resume (PDF)</label>
                            <input type="file" className="form-control" id="resumeFile" name="resumeFile" accept=".pdf" onChange={handleChange} />
                          </div>
                        )}

                        {formData.resumeUrl ? (
                          <div className="resume-viewer">
                            <iframe
                                src={formData.resumeUrl}
                                title={`${displayName}'s Resume`}
                                width="100%"
                                height="100%"
                            />
                          </div>
                        ) : (
                          <div className="resume-placeholder">
                            <i className="bi bi-file-earmark-person-fill"></i>
                            <p>No Resume on File</p>
                            {!isViewMode && <small className="text-muted">Upload a new resume using the field above.</small>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {isViewMode ? (
                <>
                    <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={onSwitchToEdit}>
                        <i className="bi bi-pencil-fill me-2"></i>Edit
                    </button>
                </>
              ) : (
                <>
                    <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                        {isEditMode ? 'Save Changes' : 'Add Employee'}
                    </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditEmployeeModal;