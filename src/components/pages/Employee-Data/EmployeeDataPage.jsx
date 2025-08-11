import React, { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './EmployeeDataPage.css';
import AddEditEmployeeModal from '../../modals/AddEditEmployeeModal';
import ReportPreviewModal from '../../modals/ReportPreviewModal';
import RequirementsChecklist from './RequirementsChecklist';
import 'bootstrap-icons/font/bootstrap-icons.css';
import placeholderImage from '../../../assets/placeholder-profile.jpg';
import logo from '../../../assets/logo.png';

const EmployeeDataPage = ({ employees, positions, handlers }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [statusFilter, setStatusFilter] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isViewOnlyMode, setIsViewOnlyMode] = useState(false);
  
  const [showReportPreviewModal, setShowReportPreviewModal] = useState(false);
  const [pdfDataUri, setPdfDataUri] = useState('');
  const [reportTitle, setReportTitle] = useState('');

  const positionMap = useMemo(() => new Map(positions.map(p => [p.id, p.title])), [positions]);
  const uniquePositions = useMemo(() => ['All Positions', ...new Set(positions.map(p => p.title).sort())], [positions]);
  
  const filteredAndSortedEmployees = useMemo(() => {
    let records = employees.map(emp => ({
        ...emp,
        positionTitle: positionMap.get(emp.positionId) || 'Unassigned',
    }));

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      records = records.filter(emp => 
        emp.name.toLowerCase().includes(lowerSearchTerm) || 
        emp.id.toLowerCase().includes(lowerSearchTerm) ||
        emp.positionTitle.toLowerCase().includes(lowerSearchTerm)
      );
    }
    if (positionFilter) { records = records.filter(emp => emp.positionTitle === positionFilter); }
    if (statusFilter) { records = records.filter(emp => emp.status === statusFilter); }
    
    if (sortConfig.key) {
      records.sort((a, b) => {
        const valA = String(a[sortConfig.key] || '').toLowerCase();
        const valB = String(b[sortConfig.key] || '').toLowerCase();
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return records;
  }, [searchTerm, positionFilter, statusFilter, sortConfig, employees, positionMap]);
  
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <i className="bi bi-arrow-down-up sort-icon ms-1"></i>;
    return sortConfig.direction === 'ascending' ? <i className="bi bi-sort-up sort-icon active ms-1"></i> : <i className="bi bi-sort-down sort-icon active ms-1"></i>;
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const handleOpenViewModal = (employee) => {
    setSelectedEmployee(employee);
    setIsViewOnlyMode(true);
    setShowModal(true);
  };
  
  const handleOpenAddModal = () => {
    setSelectedEmployee(null);
    setIsViewOnlyMode(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (e, employee) => {
    e.stopPropagation();
    setSelectedEmployee(employee);
    setIsViewOnlyMode(false);
    setShowModal(true);
  };
  
  const handleDeleteEmployee = (e, employeeId) => { 
    e.stopPropagation(); 
    if (window.confirm(`Are you sure you want to delete employee ${employeeId}?`)) { 
      handlers.deleteEmployee(employeeId); 
    } 
  };
  
  const handleCloseReportPreview = () => { 
    setShowReportPreviewModal(false); 
    setPdfDataUri(''); 
  };

  const handleSwitchToEditMode = () => {
    setIsViewOnlyMode(false);
  };
  
  const generateEmployeeReportPdf = () => {
    if (!filteredAndSortedEmployees || filteredAndSortedEmployees.length === 0) {
        alert("No employee data to generate a report for the current filter.");
        return;
    }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageTitle = "Employee Data Report";
    const generationDate = new Date().toLocaleDateString();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    
    doc.addImage(logo, 'PNG', margin, 20, 80, 26);
    doc.setFontSize(18); doc.setFont(undefined, 'bold');
    doc.text(pageTitle, pageWidth - margin, 40, { align: 'right' });
    doc.setFontSize(10); doc.setFont(undefined, 'normal');
    doc.text(`Generated on: ${generationDate}`, pageWidth - margin, 55, { align: 'right' });
    doc.setLineWidth(1);
    doc.line(margin, 70, pageWidth - margin, 70);

    const tableColumns = ['ID', 'Name', 'Position', 'Email', 'Status', 'Joining Date'];
    const tableRows = filteredAndSortedEmployees.map(emp => [
        emp.id, emp.name, emp.positionTitle, emp.email, emp.status, emp.joiningDate,
    ]);

    autoTable(doc, {
      head: [tableColumns], body: tableRows, startY: 95, theme: 'striped',
      headStyles: { fillColor: [25, 135, 84] },
    });

    setReportTitle(pageTitle);
    const pdfBlob = doc.output('blob');
    setPdfDataUri(URL.createObjectURL(pdfBlob));
    setShowReportPreviewModal(true);
  };
  
  const renderCardView = () => (
    <div className="employee-grid-container">
      {filteredAndSortedEmployees.map(emp => (
        <div 
          key={emp.id} 
          className={`employee-card-v2 ${emp.status === 'Inactive' ? 'inactive' : ''}`} 
          onClick={() => handleOpenViewModal(emp)}
        >
          <div className="employee-card-header-v2">
            <span className="employee-id">{emp.id}</span>
            <div className="dropdown">
              <button className="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown" onClick={e => e.stopPropagation()} aria-label="Employee Actions">
                  <i className="bi bi-three-dots-vertical"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><a className="dropdown-item" href="#" onClick={(e) => handleOpenEditModal(e, emp)}>Edit</a></li>
                <li><a className="dropdown-item text-danger" href="#" onClick={(e) => handleDeleteEmployee(e, emp.id)}>Delete</a></li>
              </ul>
            </div>
          </div>
          <div className="employee-card-body-v2">
            <img src={emp.imageUrl || placeholderImage} alt={emp.name} className="employee-avatar-v2" onError={(e) => { e.target.src = placeholderImage; }} />
            <h5 className="employee-name-v2">{emp.name}</h5>
            <p className="employee-position-v2">{emp.positionTitle}</p>
            <span className={`status-badge-employee status-badge-${emp.status.toLowerCase()}`}>{emp.status}</span>
          </div>
          <div className="employee-details-v2">
              <div className="detail-item">
                  <i className="bi bi-envelope-fill"></i>
                  <a href={`mailto:${emp.email}`} onClick={e => e.stopPropagation()}>{emp.email}</a>
              </div>
              <div className="detail-item">
                  <i className="bi bi-calendar-event-fill"></i>
                  <span>Joined on {emp.joiningDate}</span>
              </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="card data-table-card shadow-sm">
      <div className="table-responsive">
        <table className="table data-table mb-0 align-middle">
          <thead>
            <tr>
              <th className="sortable" onClick={() => requestSort('id')}>Employee ID {getSortIcon('id')}</th>
              <th className="sortable" onClick={() => requestSort('name')}>Name {getSortIcon('name')}</th>
              <th>Position</th>
              <th>Joining Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{filteredAndSortedEmployees.map((emp) => (
            <tr key={emp.id}>
              <td><strong>{emp.id}</strong></td>
              <td>
                <div className="d-flex align-items-center">
                    <img src={emp.imageUrl || placeholderImage} alt={emp.name} className="employee-avatar-table me-2" onError={(e) => { e.target.src = placeholderImage; }} />
                    {emp.name}
                </div>
              </td>
              <td>{emp.positionTitle}</td>
              <td>{emp.joiningDate}</td>
              <td><span className={`status-badge-employee status-badge-${emp.status.toLowerCase()}`}>{emp.status}</span></td>
              <td>
                <div className="dropdown">
                  <button className="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    Actions
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleOpenViewModal(emp);}}><i className="bi bi-eye-fill me-2"></i>View Details</a></li>
                    <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleOpenEditModal(e, emp);}}><i className="bi bi-pencil-fill me-2"></i>Edit</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item text-danger" href="#" onClick={(e) => { e.preventDefault(); handleDeleteEmployee(e, emp.id);}}><i className="bi bi-trash-fill me-2"></i>Delete</a></li>
                  </ul>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container-fluid p-0 page-module-container">
      <header className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-main-title">Employee Data</h1>
        <div className="header-actions d-flex align-items-center gap-2">
            <button className="btn btn-outline-secondary" onClick={generateEmployeeReportPdf}><i className="bi bi-file-earmark-text-fill"></i> Generate Report</button>
            <button className="btn btn-success" onClick={handleOpenAddModal}><i className="bi bi-person-plus-fill"></i> Add New Employee</button>
        </div>
      </header>
      
      <ul className="nav nav-tabs employee-data-tabs mb-4">
        <li className="nav-item">
            <button className={`nav-link ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Employees</button>
        </li>
        <li className="nav-item">
            <button className={`nav-link ${activeTab === 'requirements' ? 'active' : ''}`} onClick={() => setActiveTab('requirements')}>Government Requirements</button>
        </li>
      </ul>

      {activeTab === 'all' && (
        <>
          <div className="page-controls-bar mb-4">
            <div className="filters-group">
                <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-search"></i></span>
                    <input type="text" className="form-control" placeholder="Search by name, ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="form-select" value={positionFilter} onChange={e => setPositionFilter(e.target.value)}>{uniquePositions.map(pos => <option key={pos} value={pos === 'All Positions' ? '' : pos}>{pos}</option>)}</select>
                <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
            <div className="actions-group">
                <div className="view-toggle-buttons btn-group">
                    <button className={`btn btn-sm ${viewMode === 'card' ? 'active' : 'btn-outline-secondary'}`} onClick={() => setViewMode('card')} title="Card View"><i className="bi bi-grid-3x3-gap-fill"></i></button>
                    <button className={`btn btn-sm ${viewMode === 'table' ? 'active' : 'btn-outline-secondary'}`} onClick={() => setViewMode('table')} title="List View"><i className="bi bi-list-task"></i></button>
                </div>
            </div>
          </div>
          {filteredAndSortedEmployees.length > 0 ? (viewMode === 'card' ? renderCardView() : renderTableView()) : (<div className="text-center p-5 bg-light rounded"><i className="bi bi-people-fill fs-1 text-muted mb-3 d-block"></i><h4 className="text-muted">{employees.length === 0 ? "No employees in the system." : "No employees match criteria."}</h4></div>)}
        </>
      )}

      {activeTab === 'requirements' && (
        <RequirementsChecklist employees={employees} />
      )}
      
      {showModal && ( 
        <AddEditEmployeeModal 
          show={showModal} 
          onClose={handleCloseModal} 
          onSave={handlers.saveEmployee} 
          employeeData={selectedEmployee} 
          positions={positions}
          viewOnly={isViewOnlyMode}
          onSwitchToEdit={handleSwitchToEditMode}
        /> 
      )}

      {showReportPreviewModal && ( <ReportPreviewModal show={showReportPreviewModal} onClose={handleCloseReportPreview} pdfDataUri={pdfDataUri} reportTitle={reportTitle} /> )}
    </div>
  );
};

export default EmployeeDataPage;