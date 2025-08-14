import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProgramDetailPage.css';
import EnrollEmployeeModal from '../../modals/EnrollEmployeeModal';
import UpdateEnrollmentStatusModal from '../../modals/UpdateEnrollmentStatusModal';
import ReportPreviewModal from '../../modals/ReportPreviewModal';
import useReportGenerator from '../../../hooks/useReportGenerator';

const ProgramDetailPage = ({ employees, trainingPrograms, enrollments, handlers }) => {
  const { programId } = useParams();
  
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'employeeName', direction: 'ascending' });

  const { generateReport, pdfDataUri, isLoading, setPdfDataUri } = useReportGenerator();

  const selectedProgram = useMemo(() => {
    return trainingPrograms.find(p => p.id.toString() === programId);
  }, [trainingPrograms, programId]);

  const enrolledInProgram = useMemo(() => {
    if (!selectedProgram) return [];
    const employeeMap = new Map(employees.map(e => [e.id, e.name]));
    return enrollments
      .filter(enr => enr.programId.toString() === programId)
      .map(enr => ({ ...enr, employeeName: employeeMap.get(enr.employeeId) || 'Unknown' }));
  }, [selectedProgram, enrollments, employees, programId]);

  const displayedEnrollments = useMemo(() => {
    let filtered = [...enrolledInProgram];
    if (statusFilter !== 'All') { filtered = filtered.filter(enr => enr.status === statusFilter); }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(enr => 
        enr.employeeName.toLowerCase().includes(lowerSearch) ||
        enr.employeeId.toLowerCase().includes(lowerSearch)
      );
    }
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (sortConfig.key === 'progress') {
            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        }
        if (String(valA).toLowerCase() < String(valB).toLowerCase()) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (String(valA).toLowerCase() > String(valB).toLowerCase()) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [enrolledInProgram, searchTerm, statusFilter, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') { direction = 'descending'; }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <i className="bi bi-arrow-down-up sort-icon ms-1"></i>;
    return sortConfig.direction === 'ascending' ? <i className="bi bi-sort-up sort-icon active ms-1"></i> : <i className="bi bi-sort-down sort-icon active ms-1"></i>;
  };
  
  const handleOpenStatusModal = (enrollment) => { setEditingEnrollment(enrollment); setShowStatusModal(true); };
  const handleCloseStatusModal = () => { setEditingEnrollment(null); setShowStatusModal(false); };
  const handleUpdateStatus = (enrollmentId, updatedData) => { handlers.updateEnrollmentStatus(enrollmentId, updatedData); handleCloseStatusModal(); };

  const handleGenerateReport = () => {
    generateReport(
        'training_program_summary',
        { programId: selectedProgram.id },
        { trainingPrograms, enrollments, employees }
    );
    setShowReportPreview(true);
  };

  const handleCloseReportPreview = () => {
    setShowReportPreview(false);
    if(pdfDataUri) URL.revokeObjectURL(pdfDataUri);
    setPdfDataUri('');
  };

  if (!selectedProgram) { return <div>Program Not Found</div>; }

  return (
    <div className="container-fluid p-0 page-module-container">
      <header className="program-detail-header">
        <Link to="/dashboard/training" className="btn btn-light me-3 back-button mb-3"><i className="bi bi-arrow-left"></i> Back to Programs</Link>
        <div className="d-flex justify-content-between align-items-center">
            <div>
                <h1 className="page-main-title mb-0">{selectedProgram.title}</h1>
                <p className="page-subtitle">{selectedProgram.provider}</p>
                <div className="program-meta">
                    <span className="meta-item"><i className="bi bi-clock-fill"></i>{selectedProgram.duration || 'N/A'}</span>
                    <span className="meta-item"><i className="bi bi-people-fill"></i>{enrolledInProgram.length} Enrolled</span>
                </div>
            </div>
            <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary" onClick={handleGenerateReport} disabled={displayedEnrollments.length === 0}>
                    <i className="bi bi-file-earmark-text-fill me-1"></i>Generate Report
                </button>
                <button className="btn btn-success" onClick={() => setShowEnrollModal(true)}>
                    <i className="bi bi-person-plus-fill me-2"></i>Enroll Employees
                </button>
            </div>
        </div>
      </header>

      <div className="card data-table-card shadow-sm">
        <div className="enrollment-table-controls">
            <div className="input-group"><span className="input-group-text"><i className="bi bi-search"></i></span><input type="text" className="form-control" placeholder="Search by name or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
            <div className="d-flex align-items-center">
                <label className="form-label me-2 mb-0">Status:</label>
                <select className="form-select form-select-sm" style={{width: '180px'}} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="All">All</option><option value="Completed">Completed</option><option value="In Progress">In Progress</option><option value="Not Started">Not Started</option>
                </select>
            </div>
        </div>
        <div className="table-responsive">
          <table className="table data-table mb-0">
            <thead>
                <tr>
                    <th className="sortable" style={{width: '15%'}} onClick={() => requestSort('employeeId')}>Emp ID {getSortIcon('employeeId')}</th>
                    <th className="sortable" onClick={() => requestSort('employeeName')}>Employee Name {getSortIcon('employeeName')}</th>
                    <th className="sortable" style={{width: '20%'}} onClick={() => requestSort('progress')}>Progress {getSortIcon('progress')}</th>
                    <th style={{width: '15%'}}>Status</th>
                    <th className="text-center" style={{width: '15%'}}>Action</th>
                </tr>
            </thead>
            <tbody>
              {displayedEnrollments.map(enr => (
                <tr key={enr.enrollmentId}>
                  <td>{enr.employeeId}</td>
                  <td>{enr.employeeName}</td>
                  <td><div className="progress-bar-cell"><div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${enr.progress || 0}%` }}></div></div><span className="progress-text">{enr.progress || 0}%</span></div></td>
                  <td><span className={`enrollment-status-badge status-${enr.status.replace(/\s+/g, '-').toLowerCase()}`}>{enr.status}</span></td>
                  <td className="text-center"><button className="btn btn-sm btn-outline-secondary" onClick={() => handleOpenStatusModal(enr)}>Update</button></td>
                </tr>
              ))}
              {displayedEnrollments.length === 0 && (<tr><td colSpan="5" className="text-center p-5">No enrollments match your criteria.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <EnrollEmployeeModal show={showEnrollModal} onClose={() => setShowEnrollModal(false)} onEnroll={handlers.enrollEmployees} program={selectedProgram} allEmployees={employees} existingEnrollments={enrolledInProgram} />
      {editingEnrollment && <UpdateEnrollmentStatusModal show={showStatusModal} onClose={handleCloseStatusModal} onSave={handleUpdateStatus} enrollmentData={editingEnrollment} />}
      
      {(isLoading || pdfDataUri) && (
        <ReportPreviewModal
            show={showReportPreview}
            onClose={handleCloseReportPreview}
            pdfDataUri={pdfDataUri}
            reportTitle={`Training Report - ${selectedProgram.title}`}
        />
      )}
    </div>
  );
};

export default ProgramDetailPage;