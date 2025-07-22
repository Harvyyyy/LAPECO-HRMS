import React, { useState, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import AddEditCaseModal from './AddEditCaseModal';
import CaseCard from './CaseCard';
import CaseDetailView from './CaseDetailView';
import './CaseManagement.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const CaseManagementPage = ({ cases, employees, handlers }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);

  const stats = useMemo(() => ({
    total: cases.length,
    ongoing: cases.filter(c => c.status === 'Ongoing').length,
    closed: cases.filter(c => c.status === 'Closed').length,
  }), [cases]);

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
            borderColor: '#fff',
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

  if (selectedCase) {
    return (
      <>
        <CaseDetailView 
            caseInfo={selectedCase}
            employee={employeeMap.get(selectedCase.employeeId)}
            onBack={() => setSelectedCase(null)}
            onSaveLog={handlers.addCaseLogEntry}
            onEdit={handleOpenModal}
        />
        <AddEditCaseModal 
          show={showModal}
          onClose={handleCloseModal}
          onSave={handlers.saveCase}
          caseData={editingCase}
          employees={employees}
        />
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
                <table className="table data-table mb-0">
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
        <div className="controls-bar d-flex justify-content-between mb-4">
            <div className="input-group" style={{ maxWidth: '400px' }}>
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input type="text" className="form-control" placeholder="Search by Case ID, Name, Reason..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="btn-group" role="group">
                <button type="button" className={`btn ${statusFilter === 'All' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setStatusFilter('All')}>All</button>
                <button type="button" className={`btn ${statusFilter === 'Ongoing' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setStatusFilter('Ongoing')}>Ongoing</button>
                <button type="button" className={`btn ${statusFilter === 'Closed' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setStatusFilter('Closed')}>Closed</button>
            </div>
        </div>
        <div className="case-card-grid">
            {filteredCases.map(c => 
              <CaseCard 
                key={c.caseId} 
                caseInfo={c} 
                employee={employeeMap.get(c.employeeId)}
                onView={handleViewDetails} 
              />
            )}
        </div>
        {filteredCases.length === 0 && <div className="text-center p-5 bg-light rounded"><p>No cases found for the selected filters.</p></div>}
    </>
  );

  return (
    <div className="container-fluid p-0 page-module-container">
      <header className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-main-title">Case Management</h1>
        <button className="btn btn-success" onClick={() => handleOpenModal()}><i className="bi bi-plus-circle-fill me-2"></i>Log New Case</button>
      </header>

      <ul className="nav nav-tabs case-management-tabs mb-4">
        <li className="nav-item"><button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button></li>
        <li className="nav-item"><button className={`nav-link ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>All Cases</button></li>
      </ul>

      {activeTab === 'dashboard' ? renderDashboard() : renderCaseList()}

      <AddEditCaseModal 
        show={showModal && !selectedCase}
        onClose={handleCloseModal}
        onSave={handlers.saveCase}
        caseData={editingCase}
        employees={employees}
      />
    </div>
  );
};

export default CaseManagementPage;