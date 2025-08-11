import React, { useState, useEffect, useMemo, useRef } from 'react';
import placeholderAvatar from '../../../assets/placeholder-profile.jpg';
import { USER_ROLES } from '../../../constants/roles';
import './MyProfilePage.css';

const InfoField = ({ label, value }) => (
    <div className="info-field">
        <label className="info-label">{label}</label>
        <p className="info-value">{value || 'N/A'}</p>
    </div>
);

const MyProfilePage = ({ currentUser, userRole, positions, employees, handlers }) => {
    const [activeTab, setActiveTab] = useState('personal');
    const [formData, setFormData] = useState({});
    const [resumeFile, setResumeFile] = useState(null);
    const [resumePreview, setResumePreview] = useState(null);
    
    const fileInputRef = useRef(null);
    const isHrUser = userRole === USER_ROLES.HR_PERSONNEL;

    useEffect(() => {
        if (currentUser) {
            setFormData({
                contactNumber: currentUser.contactNumber || '',
                address: currentUser.address || '',
                sssNo: currentUser.sssNo || '',
                tinNo: currentUser.tinNo || '',
                pagIbigNo: currentUser.pagIbigNo || '',
                philhealthNo: currentUser.philhealthNo || '',
            });
            setResumePreview(currentUser.resumeUrl || null);
        }
    }, [currentUser]);

    const positionTitle = useMemo(() => 
        positions.find(p => p.id === currentUser?.positionId)?.title || 'Unassigned'
    , [currentUser, positions]);

    const manager = useMemo(() => {
        if (!currentUser?.positionId) return null;
        return employees.find(emp => emp.positionId === currentUser.positionId && emp.isTeamLeader);
    }, [currentUser, employees]);


    if (!currentUser) {
        return <div className="p-4">Loading user data...</div>;
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleResumeFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResumeFile(file);
            setResumePreview(URL.createObjectURL(file));
        }
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        handlers.updateMyProfile(currentUser.id, formData);
        if (resumeFile) {
            handlers.updateMyResume(currentUser.id, resumeFile);
        }
        alert("Profile updated successfully!");
    };

    return (
        <div className="container-fluid p-0 page-module-container">
            <div className="profile-page-header">
                <div className="profile-avatar-container" onClick={() => fileInputRef.current.click()}>
                    <img 
                        src={currentUser.imageUrl || placeholderAvatar}
                        alt="My Avatar"
                        className="profile-avatar-large"
                    />
                    <div className="profile-avatar-overlay"><i className="bi bi-camera-fill"></i></div>
                </div>
                <input type="file" ref={fileInputRef} className="d-none" accept="image/*" />
                <div className="profile-header-info">
                    <h1 className="profile-name">{currentUser.name}</h1>
                    <p className="profile-position">{positionTitle}</p>
                </div>
            </div>

            <div className="card profile-content-card">
                <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>
                                <i className="bi bi-person-lines-fill me-2"></i>Personal
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'employment' ? 'active' : ''}`} onClick={() => setActiveTab('employment')}>
                                <i className="bi bi-building me-2"></i>Employment
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'requirements' ? 'active' : ''}`} onClick={() => setActiveTab('requirements')}>
                                <i className="bi bi-card-checklist me-2"></i>Government Requirements
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'resume' ? 'active' : ''}`} onClick={() => setActiveTab('resume')}>
                                <i className="bi bi-file-earmark-person-fill me-2"></i>Resume
                            </button>
                        </li>
                    </ul>
                </div>
                <form onSubmit={handleSaveChanges}>
                    <div className="card-body">
                        {activeTab === 'personal' && (
                            <div className="info-grid">
                                <InfoField label="Email Address" value={currentUser.email} />
                                <InfoField label="Birthday" value={currentUser.birthday} />
                                <InfoField label="Gender" value={currentUser.gender} />
                                <div className="info-field">
                                    <label htmlFor="contactNumber" className="info-label">Contact Number</label>
                                    <input type="tel" className="form-control" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleFormChange} />
                                </div>
                                <div className="info-field info-field-full-width">
                                    <label htmlFor="address" className="info-label">Address</label>
                                    <textarea className="form-control" id="address" name="address" rows="3" value={formData.address} onChange={handleFormChange}></textarea>
                                </div>
                            </div>
                        )}

                        {activeTab === 'employment' && (
                            <div className="info-grid">
                                <InfoField label="Employee ID" value={currentUser.id} />
                                <InfoField label="Joining Date" value={currentUser.joiningDate} />
                                <InfoField label="Status" value={currentUser.status} />
                                <InfoField label="Reports To" value={manager?.name} />
                            </div>
                        )}

                        {activeTab === 'requirements' && (
                             <div className="info-grid">
                                <div className="info-field">
                                    <label htmlFor="sssNo" className="info-label">SSS No.</label>
                                    <input type="text" className="form-control" id="sssNo" name="sssNo" value={formData.sssNo} onChange={handleFormChange} disabled={!isHrUser} />
                                </div>
                                <div className="info-field">
                                    <label htmlFor="tinNo" className="info-label">TIN No.</label>
                                    <input type="text" className="form-control" id="tinNo" name="tinNo" value={formData.tinNo} onChange={handleFormChange} disabled={!isHrUser} />
                                </div>
                                <div className="info-field">
                                    <label htmlFor="pagIbigNo" className="info-label">Pag-IBIG No.</label>
                                    <input type="text" className="form-control" id="pagIbigNo" name="pagIbigNo" value={formData.pagIbigNo} onChange={handleFormChange} disabled={!isHrUser} />
                                </div>
                                <div className="info-field">
                                    <label htmlFor="philhealthNo" className="info-label">PhilHealth No.</label>
                                    <input type="text" className="form-control" id="philhealthNo" name="philhealthNo" value={formData.philhealthNo} onChange={handleFormChange} disabled={!isHrUser} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'resume' && (
                            <div className="resume-tab-container">
                                {isHrUser && (
                                    <div className="mb-3">
                                        <label htmlFor="resumeFile" className="info-label">Upload New Resume (PDF)</label>
                                        <input type="file" className="form-control" id="resumeFile" name="resumeFile" accept=".pdf" onChange={handleResumeFileChange} />
                                    </div>
                                )}
                                {resumePreview ? (
                                    <div className="resume-viewer">
                                        <iframe src={resumePreview} title={`${currentUser.name}'s Resume`} width="100%" height="100%" />
                                    </div>
                                ) : (
                                    <div className="resume-placeholder">
                                        <i className="bi bi-file-earmark-person-fill"></i>
                                        <p>No Resume on File</p>
                                        {isHrUser && <small className="text-muted">Upload a resume using the field above.</small>}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {(activeTab === 'personal' || (isHrUser && (activeTab === 'requirements' || activeTab === 'resume'))) && (
                        <div className="card-footer form-footer">
                            <button type="submit" className="btn btn-success">Save Changes</button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default MyProfilePage;