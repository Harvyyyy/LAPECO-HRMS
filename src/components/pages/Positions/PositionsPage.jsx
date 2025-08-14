import React, { useState, useMemo } from 'react';
import './PositionsPage.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AddEditPositionModal from '../../modals/AddEditPositionModal';
import AddEmployeeToPositionModal from '../../modals/AddEmployeeToPositionModal';
import ReportPreviewModal from '../../modals/ReportPreviewModal';
import useReportGenerator from '../../../hooks/useReportGenerator';

const PositionsPage = ({ employees, positions, handlers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [positionEmployeeSearchTerm, setPositionEmployeeSearchTerm] = useState('');
  
  // Modal States
  const [showAddEditPositionModal, setShowAddEditPositionModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  
  // Report States using our hook
  const [showReportPreview, setShowReportPreview] = useState(false);
  const { generateReport, pdfDataUri, isLoading, setPdfDataUri } = useReportGenerator();


  const employeeCounts = useMemo(() => {
    return positions.reduce((acc, pos) => {
      acc[pos.id] = employees.filter(emp => emp.positionId === pos.id).length;
      return acc;
    }, {});
  }, [employees, positions]);

  const filteredPositions = useMemo(() => {
    if (!searchTerm) return positions;
    return positions.filter(pos =>
      pos.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pos.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, positions]);

  const employeesInPosition = useMemo(() => 
    (employees || []).filter(emp => emp.positionId === selectedPosition?.id), 
    [employees, selectedPosition]
  );

  const displayedEmployeesInPosition = useMemo(() => {
    if (!positionEmployeeSearchTerm) return employeesInPosition;
    return employeesInPosition.filter(emp => emp.name.toLowerCase().includes(positionEmployeeSearchTerm.toLowerCase()));
  }, [positionEmployeeSearchTerm, employeesInPosition]);

  // --- Handlers ---
  const handleSavePosition = (formData, positionId) => {
    handlers.savePosition(formData, positionId);
    setShowAddEditPositionModal(false);
  };
  
  const handleDeletePosition = (e, positionId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this position? This will unassign all employees.')) {
        handlers.deletePosition(positionId);
    }
  };

  const handleSaveEmployeeToPosition = (employeeId, positionId) => {
    handlers.assignEmployeeToPosition(employeeId, positionId);
    setShowAddEmployeeModal(false);
  };

  const handleRemoveFromPosition = (employeeId) => {
    if(window.confirm(`Are you sure you want to remove this employee from the position?`)){
        handlers.assignEmployeeToPosition(employeeId, null);
    }
  };

  const handleToggleLeader = (employeeId) => { handlers.toggleTeamLeaderStatus(employeeId); };
  const handleViewPositionDetails = (position) => setSelectedPosition(position);
  const handleBackToPositionsList = () => { setSelectedPosition(null); setPositionEmployeeSearchTerm(''); };
  const handleOpenAddPositionModal = () => { setEditingPosition(null); setShowAddEditPositionModal(true); };
  const handleOpenEditPositionModal = (e, position) => { e.stopPropagation(); setEditingPosition(position); setShowAddEditPositionModal(true); };
  const handleCloseAddEditPositionModal = () => setShowAddEditPositionModal(false);
  const handleOpenAddEmployeeModal = () => setShowAddEmployeeModal(true);
  const handleCloseAddEmployeeModal = () => setShowAddEmployeeModal(false);

  const handleGenerateReport = () => {
    if (!positions || positions.length === 0) {
      alert("No positions available to generate a report.");
      return;
    }
    generateReport('positions_report', {}, { employees, positions });
    setShowReportPreview(true);
  };

  const handleCloseReportPreview = () => {
    setShowReportPreview(false);
    if(pdfDataUri) URL.revokeObjectURL(pdfDataUri);
    setPdfDataUri('');
  };


  if (selectedPosition) {
    return (
      <div className="container-fluid p-0 page-module-container">
        <header className="page-header detail-view-header">
          <button className="btn btn-light me-3 back-button" onClick={handleBackToPositionsList}>
            <i className="bi bi-arrow-left"></i> Back to Positions List
          </button>
        </header>

        <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1 className="page-main-title mb-0">{selectedPosition.title}</h1>
                <p className="page-subtitle text-muted mb-0">{employeesInPosition.length} Employee(s)</p>
            </div>
            <button className="btn btn-success" onClick={handleOpenAddEmployeeModal}><i className="bi bi-person-plus-fill me-2"></i> Add Employee</button>
        </div>

        <div className="controls-bar d-flex justify-content-start mb-4">
            <div className="input-group detail-view-search">
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input type="text" className="form-control" placeholder="Search employees in this position..." value={positionEmployeeSearchTerm} onChange={(e) => setPositionEmployeeSearchTerm(e.target.value)} />
            </div>
        </div>

        <div className="card data-table-card shadow-sm">
          <div className="table-responsive">
            <table className="table data-table mb-0">
              <thead><tr><th>Employee ID</th><th>Name</th><th>Role</th><th>Action</th></tr></thead>
              <tbody>
                {displayedEmployeesInPosition.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td><td>{emp.name}</td>
                    <td>{emp.isTeamLeader ? <span className="badge bg-success">Team Leader</span> : 'Member'}</td>
                    <td>
                      <div className="dropdown"><button className="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="dropdown">Manage <i className="bi bi-caret-down-fill"></i></button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleToggleLeader(emp.id); }}>{emp.isTeamLeader ? 'Unset as Leader' : 'Set as Leader'}</a></li>
                          <li><hr className="dropdown-divider" /></li>
                          <li><a className="dropdown-item text-danger" href="#" onClick={(e) => { e.preventDefault(); handleRemoveFromPosition(emp.id); }}>Remove from Position</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
                {displayedEmployeesInPosition.length === 0 && (
                  <tr><td colSpan="4" className="text-center p-5">No employees match your search in this position.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {showAddEmployeeModal && (
          <AddEmployeeToPositionModal
            show={showAddEmployeeModal} onClose={handleCloseAddEmployeeModal}
            onSave={handleSaveEmployeeToPosition} currentPosition={selectedPosition}
            allEmployees={employees} allPositions={positions}
          />
        )}
      </div>
    );
  }

  return (
    <div className="container-fluid p-0 page-module-container">
      <header className="page-header d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
            <h1 className="page-main-title me-3">Positions</h1>
            <span className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill">
                {positions.length} total positions
            </span>
        </div>
        <div className="header-actions d-flex align-items-center gap-2">
            <button className="btn btn-outline-secondary" onClick={handleGenerateReport} disabled={!positions || positions.length === 0}>
                <i className="bi bi-file-earmark-text-fill"></i> Generate Report
            </button>
            <button className="btn btn-success" onClick={handleOpenAddPositionModal}>
                <i className="bi bi-plus-circle-fill me-2"></i> Add New Position
            </button>
        </div>
      </header>
      
      <div className="controls-bar d-flex justify-content-start mb-4">
        <div className="input-group">
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input type="text" className="form-control" placeholder="Search positions by title or description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="positions-grid-container">
        {filteredPositions.length > 0 ? (
            filteredPositions.map(pos => (
            <div key={pos.id} className="position-card">
                <div className="position-card-header">
                    <h5 className="position-title">{pos.title}</h5>
                    <div className="dropdown">
                    <button className="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="bi bi-three-dots-vertical"></i></button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li><a className="dropdown-item" href="#" onClick={(e) => handleOpenEditPositionModal(e, pos)}>Edit</a></li>
                        <li><a className="dropdown-item text-danger" href="#" onClick={(e) => handleDeletePosition(e, pos.id)}>Delete</a></li>
                    </ul>
                    </div>
                </div>
                <div className="card-body">
                    <p className="position-description">{pos.description}</p>
                    <div className="info-row">
                        <span className="label">Employee Count:</span>
                        <span className="value">{employeeCounts[pos.id] || 0}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Monthly Salary:</span>
                        <span className="value salary">₱ {pos.monthlySalary.toLocaleString()}</span>
                    </div>
                </div>
                <div className="position-card-footer">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handleViewPositionDetails(pos)}>View Details</button>
                </div>
            </div>
            ))
        ) : (
            <div className="w-100 text-center p-5 bg-light rounded">
                <i className="bi bi-diagram-3-fill fs-1 text-muted mb-3 d-block"></i>
                <h4 className="text-muted">{positions.length > 0 ? "No positions match your search." : "No positions have been created yet."}</h4>
            </div>
        )}
      </div>

      {showAddEditPositionModal && (
        <AddEditPositionModal show={showAddEditPositionModal} onClose={handleCloseAddEditPositionModal} onSave={handleSavePosition} positionData={editingPosition} />
      )}
      
      {(isLoading || pdfDataUri) && (
        <ReportPreviewModal 
            show={showReportPreview}
            onClose={handleCloseReportPreview}
            pdfDataUri={pdfDataUri}
            reportTitle="Company Positions Report"
        />
      )}
    </div>
  );
};

export default PositionsPage;