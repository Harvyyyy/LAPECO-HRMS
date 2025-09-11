import React, { useState } from 'react';
import LeaveRequestTable from './LeaveRequestTable';
import LeaveCreditsTab from './LeaveCreditsTab';
import LeaveReportModal from '../../modals/LeaveReportModal';
import ReportPreviewModal from '../../modals/ReportPreviewModal';
import useReportGenerator from '../../../hooks/useReportGenerator';
import './LeaveManagementPage.css';

const LeaveManagementPage = ({ employees, leaveRequests, handlers }) => {
  const [activeTab, setActiveTab] = useState('requests');
  const [showReportModal, setShowReportModal] = useState(false);
  
  const { generateReport, pdfDataUri, isLoading, setPdfDataUri } = useReportGenerator();
  const [showReportPreview, setShowReportPreview] = useState(false);
  
  const handleGenerateReport = (params) => {
    setShowReportModal(false);
    generateReport(
        'leave_requests_report', 
        { startDate: params.startDate, endDate: params.endDate }, 
        { leaveRequests }
    );
    setShowReportPreview(true);
  };

  const handleCloseReportPreview = () => {
    setShowReportPreview(false);
    if(pdfDataUri) URL.revokeObjectURL(pdfDataUri);
    setPdfDataUri('');
  };

  return (
    <>
      <div className="container-fluid p-0 page-module-container">
        <header className="page-header mb-4">
          <h1 className="page-main-title">Leave Management</h1>
        </header>
        
        <div className="d-flex justify-content-between align-items-center border-bottom">
          <ul className="nav nav-tabs leave-management-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'requests' ? 'active' : ''}`}
                onClick={() => setActiveTab('requests')}
              >
                <i className="bi bi-card-list me-2"></i>Leave Requests
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'credits' ? 'active' : ''}`}
                onClick={() => setActiveTab('credits')}
              >
                <i className="bi bi-coin me-2"></i>Leave Credits
              </button>
            </li>
          </ul>
          <button className="btn btn-outline-secondary me-2" onClick={() => setShowReportModal(true)}>
            <i className="bi bi-file-earmark-pdf-fill me-2"></i>Generate Report
          </button>
        </div>

        <div className="leave-tab-content">
          {activeTab === 'requests' && (
            <LeaveRequestTable 
              leaveRequests={leaveRequests} 
              handlers={handlers}
            />
          )}
          {activeTab === 'credits' && (
            <LeaveCreditsTab 
              employees={employees}
              leaveRequests={leaveRequests}
              onSaveCredits={handlers.updateLeaveCredits}
            />
          )}
        </div>
      </div>

      <LeaveReportModal 
        show={showReportModal}
        onClose={() => setShowReportModal(false)}
        onGenerate={handleGenerateReport}
      />

      {(isLoading || pdfDataUri) && (
        <ReportPreviewModal 
          show={showReportPreview}
          onClose={handleCloseReportPreview}
          pdfDataUri={pdfDataUri}
          reportTitle="Leave Requests Report"
        />
      )}
    </>
  );
};

export default LeaveManagementPage;