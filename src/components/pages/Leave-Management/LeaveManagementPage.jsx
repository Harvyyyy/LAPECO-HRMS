import React, { useState, useEffect, useMemo } from 'react';
import './LeaveManagementPage.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ReportPreviewModal from '../../modals/ReportPreviewModal';
import ViewReasonModal from '../../modals/ViewReasonModal';
import ReportConfigurationModal from '../../modals/ReportConfigurationModal';
import useReportGenerator from '../../../hooks/useReportGenerator';
import { reportsConfig } from '../../../config/reports.config'; 

const LeaveManagementPage = ({ leaveRequests, handlers }) => {
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'dateFrom', direction: 'ascending' });

  const [editingLeaveId, setEditingLeaveId] = useState(null);
  const [tempStatus, setTempStatus] = useState('');

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const { generateReport, pdfDataUri, isLoading, setPdfDataUri } = useReportGenerator();

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [viewingRequest, setViewingRequest] = useState(null);

  const uniqueLeaveTypes = useMemo(() => ['All', ...new Set(leaveRequests.map(req => req.leaveType))], [leaveRequests]);
  
  const leaveStats = useMemo(() => {
    return {
        All: leaveRequests.length,
        Pending: leaveRequests.filter(r => r.status === 'Pending').length,
        Approved: leaveRequests.filter(r => r.status === 'Approved').length,
        Declined: leaveRequests.filter(r => r.status === 'Declined').length,
        Canceled: leaveRequests.filter(r => r.status === 'Canceled').length
    };
  }, [leaveRequests]);

  const employeesOnLeaveToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return leaveRequests.filter(req => {
        if (req.status !== 'Approved') return false;
        const startDate = new Date(req.dateFrom);
        const endDate = new Date(req.dateTo);
        startDate.setHours(0,0,0,0);
        endDate.setHours(0,0,0,0);
        return today >= startDate && today <= endDate;
    }).length;
  }, [leaveRequests]);

  useEffect(() => {
    let records = [...leaveRequests];
    if (statusFilter && statusFilter !== 'All') {
      records = records.filter(req => req.status === statusFilter);
    }
    if (leaveTypeFilter && leaveTypeFilter !== 'All') {
      records = records.filter(req => req.leaveType === leaveTypeFilter);
    }
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      records = records.filter(req =>
        req.name?.toLowerCase().includes(lowerSearchTerm) ||
        req.empId?.toLowerCase().includes(lowerSearchTerm) ||
        req.position?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    if (sortConfig.key) {
      records.sort((a, b) => {
        let valA = a[sortConfig.key]; let valB = b[sortConfig.key];
        if (sortConfig.key === 'days') { valA = Number(valA) || 0; valB = Number(valB) || 0; } 
        else if (sortConfig.key === 'dateFrom') { valA = new Date(valA).getTime() || 0; valB = new Date(valB).getTime() || 0; } 
        else { valA = String(valA || '').toLowerCase(); valB = String(valB || '').toLowerCase(); }
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    setFilteredRequests(records);
  }, [searchTerm, statusFilter, leaveTypeFilter, leaveRequests, sortConfig]);

  const handleEditClick = (request) => {
    setEditingLeaveId(request.leaveId);
    setTempStatus(request.status);
  };
  
  const handleCancelEdit = () => {
    setEditingLeaveId(null);
    setTempStatus('');
  };

  const handleSaveStatus = (leaveId) => {
    handlers.updateLeaveStatus(leaveId, tempStatus);
    setEditingLeaveId(null);
    setTempStatus('');
  };

  const handleViewReason = (request) => {
    setViewingRequest(request);
    setShowReasonModal(true);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') { direction = 'descending'; }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <i className="bi bi-arrow-down-up sort-icon inactive-sort-icon ms-1"></i>;
    return sortConfig.direction === 'ascending' ? <i className="bi bi-sort-up-alt sort-icon active-sort-icon ms-1"></i> : <i className="bi bi-sort-down-alt sort-icon active-sort-icon ms-1"></i>;
  };

  const handleRunReport = (reportId, params) => {
    generateReport(reportId, params, { leaveRequests });
    setShowConfigModal(false);
    setShowReportPreview(true);
  };

  const handleClosePreview = () => {
    setShowReportPreview(false);
    if(pdfDataUri) URL.revokeObjectURL(pdfDataUri);
    setPdfDataUri('');
  };

  const leaveReportConfig = reportsConfig.find(r => r.id === 'leave_requests_report');

  return (
    <div className="container-fluid p-0 page-module-container">
      <header className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-main-title">Leave Management</h1>
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => setShowConfigModal(true)} 
          disabled={leaveRequests.length === 0}
        >
            <i className="bi bi-file-earmark-text-fill me-2"></i>Generate Report
        </button>
      </header>
      
      <div className="leave-status-bar">
        {Object.entries(leaveStats).map(([status, count]) => (
            <div 
                key={status}
                className={`status-filter-card filter-${status.toLowerCase()} ${statusFilter === status ? 'active' : ''}`} 
                onClick={() => setStatusFilter(status)}
            >
                <span className="stat-value">{count}</span>
                <span className="stat-label">{status === 'All' ? 'Total Requests' : status}</span>
            </div>
        ))}
      </div>
      
      <div className="controls-bar leave-controls-bar mb-4">
        <div className="filters-group">
            <div className="input-group">
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input type="text" className="form-control" placeholder="Search by name, ID, or position..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="dropdown">
                <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {leaveTypeFilter || 'Filter by Leave Type'}
                </button>
                <ul className="dropdown-menu">
                    {uniqueLeaveTypes.map(type => (
                        <li key={type}><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setLeaveTypeFilter(type === 'All' ? '' : type); }}>{type}</a></li>
                    ))}
                </ul>
            </div>
        </div>
        <div className="leave-stat-item">
            <span className="stat-value">{employeesOnLeaveToday}</span>
            <span className="stat-label">On Leave Today</span>
        </div>
      </div>

      <div className="card data-table-card shadow-sm leave-table-container">
          <table className="table data-table mb-0 leave-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => requestSort('empId')}>ID {getSortIcon('empId')}</th>
                <th className="sortable" onClick={() => requestSort('name')}>Name {getSortIcon('name')}</th>
                <th className="sortable" onClick={() => requestSort('position')}>Position {getSortIcon('position')}</th>
                <th>Leave Type</th>
                <th className="sortable" onClick={() => requestSort('dateFrom')}>Date Range {getSortIcon('dateFrom')}</th>
                <th className="sortable text-center" onClick={() => requestSort('days')}>Days {getSortIcon('days')}</th>
                <th className="status-col">Status</th>
                <th className="action-col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => {
                  const isEditing = editingLeaveId === req.leaveId;
                  return (
                    <tr key={req.leaveId}>
                      <td>{req.empId}</td><td>{req.name}</td><td>{req.position}</td><td>{req.leaveType}</td>
                      <td>{req.dateFrom} to {req.dateTo}</td><td className="text-center">{req.days}</td>
                      <td className="status-col">
                        {isEditing ? (
                          <select className={`form-select form-select-sm status-select status-${tempStatus.toLowerCase()}`} value={tempStatus} onChange={(e) => setTempStatus(e.target.value)}>
                            <option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Declined">Declined</option><option value="Canceled">Canceled</option>
                          </select>
                        ) : (<span className={`status-badge status-${req.status?.toLowerCase()}`}>{req.status}</span>)}
                      </td>
                      <td className="action-col">
                        <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-secondary" title="View Reason" onClick={() => handleViewReason(req)}><i className="bi bi-info-circle"></i></button>
                            {isEditing ? (
                                <><button className="btn btn-sm btn-success" onClick={() => handleSaveStatus(req.leaveId)}>Save</button><button className="btn btn-sm btn-light" onClick={handleCancelEdit}>Cancel</button></>
                            ) : (<button className="btn btn-sm btn-primary" title="Edit Status" onClick={() => handleEditClick(req)}><i className="bi bi-pencil-fill"></i></button>)}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (<tr><td colSpan="8" className="text-center p-5">No leave requests found for the selected filters.</td></tr>)}
            </tbody>
          </table>
      </div>

      <ReportConfigurationModal
        show={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        reportConfig={leaveReportConfig}
        onRunReport={handleRunReport}
      />

      {(isLoading || pdfDataUri) && (
        <ReportPreviewModal
            show={showReportPreview}
            onClose={handleClosePreview}
            pdfDataUri={pdfDataUri}
            reportTitle="Leave Requests Report"
        />
      )}

      <ViewReasonModal show={showReasonModal} onClose={() => setShowReasonModal(false)} request={viewingRequest}/>
    </div>
  );
};

export default LeaveManagementPage;