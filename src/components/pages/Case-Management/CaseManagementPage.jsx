import React, { useState, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import AddEditCaseModal from './AddEditCaseModal';
import CaseCard from './CaseCard';
import CaseDetailView from './CaseDetailView';
import CaseSummaryByEmployee from './CaseSummaryByEmployee';
import ReportConfigurationModal from '../../modals/ReportConfigurationModal';
import ReportPreviewModal from '../../modals/ReportPreviewModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import ActionCaseSubmissionModal from './ActionCaseSubmissionModal';
import ViewReasonModal from '../../modals/ViewReasonModal';
import ActionsDropdown from '../../common/ActionsDropdown';
import useReportGenerator from '../../../hooks/useReportGenerator';
import { reportsConfig } from '../../../config/reports.config'; 
import './CaseManagement.css';
import '../My-Cases/MyCasesPage.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const CaseManagementPage = ({ cases, employees, handlers, caseSubmissions = [] }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [caseToDelete, setCaseToDelete] = useState(null);

  const [submissionToAction, setSubmissionToAction] = useState(null);
  const [submissionActionType, setSubmissionActionType] = useState('');
  const [viewingSubmission, setViewingSubmission] = useState(null);

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const { generateReport, pdfDataUri, isLoading, setPdfDataUri } = useReportGenerator();

  const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);

  const stats = useMemo(() => ({
    total: cases.length,
    ongoing: cases.filter(c => c.status === 'Ongoing').length,
    closed: cases.filter(c => c.status === 'Closed').length,
    pendingSubmissions: (caseSubmissions || []).filter(s => s.status === 'Pending').length,
  }), [cases, caseSubmissions]);

  const chartData = useMemo(() => {
    const counts = cases.reduce((acc, c) => {
        acc[c.actionType] = (acc[c.actionType] || 0) + 1;
        return acc;
    }, {});
    return {
        labels: Object.keys(counts),
        datasets: [{
            data: Object.values(counts),
            backgroundColor: ['#ffc107', '#fd7e14', '#dc3545', '#6c757d', '#0dcaf0'],
            borderColor: 'var(--bg-primary)',
            borderWidth: 2,
        }],
    };
  }, [cases]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right',
            labels: {
                color: 'var(--text-secondary)'
            }
        }
    }
  };

  const filteredCases = useMemo(() => {
    return cases
      .filter(c => {
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        if (!matchesStatus) return false;

        if (searchTerm) {
          const lowerSearch = searchTerm.toLowerCase();
          const employeeName = employeeMap.get(c.employeeId)?.name.toLowerCase() || '';
          return (
            c.caseId.toLowerCase().includes(lowerSearch) ||
            employeeName.includes(lowerSearch) ||
            c.actionType.toLowerCase().includes(lowerSearch) ||
            c.reason.toLowerCase().includes(lowerSearch)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
  }, [cases, searchTerm, statusFilter, employeeMap]);
  
  const pendingSubmissions = useMemo(() => {
      return (caseSubmissions || [])
        .filter(s => s.status === 'Pending')
        .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
  }, [caseSubmissions]);


  const handleOpenModal = (caseData = null) => {
    setEditingCase(caseData);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setEditingCase(null);
    setShowModal(false);
  };

  const handleViewDetails = (caseData) => {
    setSelectedCase(caseData);
  };
  
  const handleConfirmDelete = () => {
    if (caseToDelete) {
      handlers.deleteCase(caseToDelete.caseId);
      setCaseToDelete(null);
      setSelectedCase(null);
    }
  };

  const handleOpenSubmissionActionModal = (submission, action) => {
    setSubmissionToAction(submission);
    setSubmissionActionType(action);
  };

  const handleCloseSubmissionActionModal = () => {
    setSubmissionToAction(null);
    setSubmissionActionType('');
  };

  const handleConfirmSubmissionAction = (submissionId, status, comments) => {
    handlers.updateCaseSubmissionStatus(submissionId, status, comments);
    handleCloseSubmissionActionModal();
  };

  const caseReportConfig = reportsConfig.find(r => r.id === 'disciplinary_cases');

  const handleGenerateReportClick = () => {
    if (caseReportConfig) {
      setShowConfigModal(true);
    } else {
      alert("Report configuration not found.");
    }
  };

  const handleRunReport = (reportId, params) => {
    generateReport(reportId, params, { cases, employees });
    setShowConfigModal(false);
    setShowReportPreview(true);
  };

  const handleClosePreview = () => {
    setShowReportPreview(false);
    if (pdfDataUri) {
      URL.revokeObjectURL(pdfDataUri);
    }
    setPdfDataUri('');
  };

  const handleViewEmployeeCases = (employee) => {
    setSearchTerm(employee.name);
    setActiveTab('list');
  };

  if (selectedCase) {
    return (
      <>
        <CaseDetailView 
            caseInfo={selectedCase}
            employee={employeeMap.get(selectedCase.employeeId)}
            onBack={() => setSelectedCase(null)}
            onSaveLog={handlers.addCaseLogEntry}
            onEdit={handleOpenModal}
            onDelete={() => setCaseToDelete(selectedCase)}
        />
        <AddEditCaseModal 
          show={showModal}
          onClose={handleCloseModal}
          onSave={handlers.saveCase}
          caseData={editingCase}
          employees={employees}
        />
         <ConfirmationModal
            show={!!caseToDelete}
            onClose={() => setCaseToDelete(null)}
            onConfirm={handleConfirmDelete}
            title="Confirm Case Deletion"
            confirmText="Yes, Delete Case"
            confirmVariant="danger"
        >
            {caseToDelete && (
                <p>Are you sure you want to permanently delete the case "<strong>{caseToDelete.reason}</strong>" for <strong>{employeeMap.get(caseToDelete.employeeId)?.name}</strong>?</p>
            )}
            <p className="text-danger">This action cannot be undone.</p>
        </ConfirmationModal>
      </>
    );
  }

  const renderDashboard = () => (
    <>
      <div className="case-dashboard-grid">
        <div className="stat-card-revised">
          <div className="stat-icon icon-total"><i className="bi bi-briefcase-fill"></i></div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Cases</div>
          </div>
        </div>
        <div className="stat-card-revised">
          <div className="stat-icon icon-ongoing"><i className="bi bi-hourglass-split"></i></div>
          <div className="stat-info">
            <div className="stat-value text-warning">{stats.ongoing}</div>
            <div className="stat-label">Ongoing Cases</div>
          </div>
        </div>
        <div className="stat-card-revised">
          <div className="stat-icon icon-closed"><i className="bi bi-check2-circle"></i></div>
          <div className="stat-info">
            <div className="stat-value text-secondary">{stats.closed}</div>
            <div className="stat-label">Closed Cases</div>
          </div>
        </div>
      </div>
      <div className="dashboard-grid-main">
          <div className="card">
              <div className="card-header"><h6><i className="bi bi-clock-history me-2"></i>Recently Updated Cases</h6></div>
              <div className="table-responsive">
                <table className="table data-table mb-0 table-hover">
                    <tbody>
                        {cases.slice(0,5).map(c => (
                            <tr key={c.caseId} onClick={() => handleViewDetails(c)} style={{cursor:'pointer'}}>
                                <td>
                                    <strong>{c.reason}</strong>
                                    <br/>
                                    <small className="text-muted">{employeeMap.get(c.employeeId)?.name}</small>
                                </td>
                                <td className="text-end">
                                    <span className={`status-badge status-${c.status.toLowerCase()}`}>{c.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
          </div>
          <div className="card">
              <div className="card-header"><h6><i className="bi bi-pie-chart-fill me-2"></i>Cases by Type</h6></div>
              <div className="card-body d-flex justify-content-center align-items-center" style={{height: '250px'}}>
                  <Doughnut data={chartData} options={chartOptions} />
              </div>
          </div>
      </div>
    </>
  );

  const renderCaseList = () => (
    <>
        <div className="my-cases-stats-grid">
            <div className={`stat-card-my-cases all ${statusFilter === 'All' ? 'active' : ''}`} onClick={() => setStatusFilter('All')}>
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">All Cases</span>
            </div>
            <div className={`stat-card-my-cases ongoing ${statusFilter === 'Ongoing' ? 'active' : ''}`} onClick={() => setStatusFilter('Ongoing')}>
                <span className="stat-value">{stats.ongoing}</span>
                <span className="stat-label">Ongoing</span>
            </div>
            <div className={`stat-card-my-cases closed ${statusFilter === 'Closed' ? 'active' : ''}`} onClick={() => setStatusFilter('Closed')}>
                <span className="stat-value">{stats.closed}</span>
                <span className="stat-label">Closed</span>
            </div>
        </div>
        <div className="controls-bar d-flex justify-content-between mb-4">
            <div className="input-group" style={{ maxWidth: '400px' }}>
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input type="text" className="form-control" placeholder="Search by Case ID, Name, Reason..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
        </div>
        <div className="case-card-grid">
            {filteredCases.map(c => 
              <CaseCard 
                key={c.caseId} 
                caseInfo={c} 
                employee={employeeMap.get(c.employeeId)}
                onView={handleViewDetails}
                onDelete={() => setCaseToDelete(c)}
              />
            )}
        </div>
        {filteredCases.length === 0 && <div className="text-center p-5 bg-light rounded"><p>No cases found for the selected filters.</p></div>}
    </>
  );
  
  const renderCaseReports = () => (
    <div className="card data-table-card shadow-sm">
      <div className="card-header">
        <h6 className="mb-0">Pending Case Report Submissions ({pendingSubmissions.length})</h6>
      </div>
      <div className="table-responsive">
        <table className="table data-table mb-0 align-middle">
          <thead>
            <tr>
              <th>Submitted By</th>
              <th>Regarding</th>
              <th>Date of Incident</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingSubmissions.length > 0 ? pendingSubmissions.map(sub => {
              const submittedByName = employeeMap.get(sub.submittedBy)?.name || sub.submittedBy;
              const employeeName = employeeMap.get(sub.employeeId)?.name || sub.employeeId;
              return (
                <tr key={sub.id}>
                  <td>{submittedByName}</td>
                  <td>{employeeName}</td>
                  <td>{sub.issueDate}</td>
                  <td className="text-center">
                    <ActionsDropdown>
                        <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setViewingSubmission(sub); }}>
                            <i className="bi bi-info-circle me-2"></i> View Reason
                        </a>
                        <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()} disabled>
                            <i className="bi bi-paperclip me-2"></i> View Attachments
                        </a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item text-success" href="#" onClick={(e) => { e.preventDefault(); handleOpenSubmissionActionModal(sub, 'Approved'); }}>
                            <i className="bi bi-check-circle-fill me-2"></i> Approve
                        </a>
                        <a className="dropdown-item text-danger" href="#" onClick={(e) => { e.preventDefault(); handleOpenSubmissionActionModal(sub, 'Declined'); }}>
                            <i className="bi bi-x-circle-fill me-2"></i> Decline
                        </a>
                    </ActionsDropdown>
                  </td>
                </tr>
              )
            }) : (
              <tr><td colSpan="4" className="text-center p-4 text-muted">There are no pending case reports for review.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container-fluid p-0 page-module-container">
      <header className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-main-title">Case Management</h1>
        <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={handleGenerateReportClick}>
                <i className="bi bi-file-earmark-pdf-fill me-2"></i>Generate Report
            </button>
            <button className="btn btn-success" onClick={() => handleOpenModal()}>
                <i className="bi bi-plus-circle-fill me-2"></i>Log New Case
            </button>
        </div>
      </header>

      <ul className="nav nav-tabs case-management-tabs mb-4">
        <li className="nav-item"><button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button></li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            Case Reports
            {stats.pendingSubmissions > 0 && <span className="badge rounded-pill bg-warning text-dark ms-2">{stats.pendingSubmissions}</span>}
          </button>
        </li>
        <li className="nav-item"><button className={`nav-link ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>All Cases</button></li>
        <li className="nav-item"><button className={`nav-link ${activeTab === 'byEmployee' ? 'active' : ''}`} onClick={() => setActiveTab('byEmployee')}>By Employee</button></li>
      </ul>

      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'reports' && renderCaseReports()}
      {activeTab === 'list' && renderCaseList()}
      {activeTab === 'byEmployee' && (
        <CaseSummaryByEmployee 
          employees={employees}
          cases={cases}
          onViewEmployeeCases={handleViewEmployeeCases}
        />
      )}

      <AddEditCaseModal 
        show={showModal && !selectedCase}
        onClose={handleCloseModal}
        onSave={handlers.saveCase}
        caseData={editingCase}
        employees={employees}
      />

      <ActionCaseSubmissionModal
        show={!!submissionToAction}
        onClose={handleCloseSubmissionActionModal}
        onConfirm={handleConfirmSubmissionAction}
        submissionData={{ submission: submissionToAction, action: submissionActionType }}
      />
      
      <ReportConfigurationModal
        show={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        reportConfig={caseReportConfig}
        onRunReport={handleRunReport}
      />

      {(isLoading || pdfDataUri) && (
        <ReportPreviewModal
          show={showReportPreview}
          onClose={handleClosePreview}
          pdfDataUri={pdfDataUri}
          reportTitle="Disciplinary Cases Report"
        />
      )}

      <ConfirmationModal
          show={!!caseToDelete}
          onClose={() => setCaseToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Confirm Case Deletion"
          confirmText="Yes, Delete Case"
          confirmVariant="danger"
      >
          {caseToDelete && (
              <p>Are you sure you want to permanently delete the case "<strong>{caseToDelete.reason}</strong>" for <strong>{employeeMap.get(caseToDelete.employeeId)?.name}</strong>?</p>
          )}
          <p className="text-danger">This action cannot be undone.</p>
      </ConfirmationModal>
      
      <ViewReasonModal
        show={!!viewingSubmission}
        onClose={() => setViewingSubmission(null)}
        title="Case Report Details"
        request={viewingSubmission ? {
            name: employeeMap.get(viewingSubmission.employeeId)?.name || 'N/A',
            empId: `Submitted by: ${employeeMap.get(viewingSubmission.submittedBy)?.name || 'N/A'}`,
            leaveType: viewingSubmission.reason,
            reason: viewingSubmission.description,
        } : null}
      />
    </div>
  );
};

export default CaseManagementPage;