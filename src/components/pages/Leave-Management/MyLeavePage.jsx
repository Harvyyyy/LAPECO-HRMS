import React, { useState } from 'react';
import RequestLeaveModal from '../../modals/RequestLeaveModal';
import './LeaveManagementPage.css'; 

const MyLeavePage = ({ leaveRequests, createLeaveRequest }) => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  const myRequests = leaveRequests; 

  const handleSaveRequest = (leaveData) => {
    const mockEmployee = { empId: 'EMP002', name: 'Bob Smith', position: 'Project Manager' };
    createLeaveRequest({ ...leaveData, ...mockEmployee });
    setShowRequestModal(false);
  };

  return (
    <div className="container-fluid p-0 page-module-container">
      <header className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-main-title">My Leave Requests</h1>
        <button className="btn btn-success" onClick={() => setShowRequestModal(true)}>
          <i className="bi bi-plus-circle-fill me-2"></i>New Leave Request
        </button>
      </header>

      <div className="card data-table-card shadow-sm">
        <div className="table-responsive">
          <table className="table data-table mb-0">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.length > 0 ? (
                myRequests.map(req => (
                  <tr key={req.leaveId}>
                    <td>{req.leaveType}</td>
                    <td>{req.dateFrom}</td>
                    <td>{req.dateTo}</td>
                    <td className="text-center">{req.days}</td>
                    <td>
                      <span className={`status-badge status-${req.status?.toLowerCase()}`}>{req.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-5">You have not made any leave requests.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showRequestModal && (
        <RequestLeaveModal
          show={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          onSave={handleSaveRequest}
        />
      )}
    </div>
  );
};

export default MyLeavePage;