import React, { useState, useMemo, useEffect } from 'react';
import RequestLeaveModal from '../../modals/RequestLeaveModal';
import LeaveHistoryModal from '../../modals/LeaveHistoryModal';
import LeaveRequestCard from './LeaveRequestCard';
import ConfirmationModal from '../../modals/ConfirmationModal';
import './MyLeavePage.css'; 

const MyLeavePage = ({ currentUser, allLeaveRequests, createLeaveRequest, updateLeaveStatus, handlers }) => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState(null);
  const [requestToExtend, setRequestToExtend] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null); // State for the request being edited
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userLeaveRequests = useMemo(() => {
    return allLeaveRequests.filter(req => req.empId === currentUser.id);
  }, [allLeaveRequests, currentUser.id]);

  const leaveBalances = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const totalCredits = currentUser.leaveCredits || { vacation: 0, sick: 0, personal: 0 };
    const usedCredits = userLeaveRequests
      .filter(req => req.status === 'Approved' && new Date(req.dateFrom).getFullYear() === currentYear)
      .reduce((acc, req) => {
        const type = req.leaveType.toLowerCase().replace(' leave', '');
        if (acc.hasOwnProperty(type)) acc[type] += req.days;
        return acc;
      }, { vacation: 0, sick: 0, personal: 0 });
    return {
      vacation: totalCredits.vacation - usedCredits.vacation,
      sick: totalCredits.sick - usedCredits.sick,
      personal: totalCredits.personal - usedCredits.personal,
    };
  }, [currentUser.leaveCredits, userLeaveRequests]);

  const upcomingLeave = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return userLeaveRequests
      .filter(req => req.status === 'Approved' && new Date(req.dateFrom) >= today)
      .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom))[0];
  }, [userLeaveRequests]);

  const filteredRequests = useMemo(() => {
    const sortedRequests = [...userLeaveRequests].sort((a, b) => new Date(b.dateFrom) - new Date(a.dateFrom));
    if (statusFilter === 'All') return sortedRequests;
    return sortedRequests.filter(req => req.status === statusFilter);
  }, [userLeaveRequests, statusFilter]);

  const handleConfirmCancel = () => {
    if (requestToCancel) {
      updateLeaveStatus(requestToCancel.leaveId, 'Canceled');
      setRequestToCancel(null);
    }
  };
  
  const handleConfirmExtension = () => {
    if (requestToExtend) {
        handlers.requestMaternityExtension(requestToExtend.leaveId);
        setRequestToExtend(null);
    }
  };

  const handleOpenEditModal = (request) => {
    setEditingRequest(request);
    setShowRequestModal(true);
  };
  
  const handleCloseRequestModal = () => {
    setEditingRequest(null);
    setShowRequestModal(false);
  };

  const handleSaveRequest = (formData, isEditing) => {
    if (isEditing) {
      handlers.updateLeaveRequest(formData);
    } else {
      createLeaveRequest(formData);
    }
    handleCloseRequestModal();
  };
  
  const renderFilters = () => {
    const statuses = ['Pending', 'Approved', 'Declined', 'Canceled', 'All'];
    if (isMobileView) {
      return (
        <div className="dropdown w-100">
          <button className="btn btn-outline-dark dropdown-toggle w-100" type="button" data-bs-toggle="dropdown">
            Filter by: {statusFilter}
          </button>
          <ul className="dropdown-menu w-100">
            {statuses.map(status => (
              <li key={status}><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setStatusFilter(status); }}>{status}</a></li>
            ))}
          </ul>
        </div>
      );
    }
    return (
      <div className="leave-filters btn-group w-100" role="group">
        {statuses.map(status => (
          <button key={status} type="button" className={`btn ${statusFilter === status ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setStatusFilter(status)}>{status}</button>
        ))}
      </div>
    );
  };

  return (
    <div className="container-fluid p-0 page-module-container">
      <header className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-main-title">My Leave</h1>
        <div className="d-flex gap-2 header-actions">
            <button className="btn btn-outline-secondary" onClick={() => setShowHistoryModal(true)}><i className="bi bi-clock-history me-2"></i>View History</button>
            <button className="btn btn-success" onClick={() => setShowRequestModal(true)}><i className="bi bi-plus-circle-fill me-2"></i>New Leave Request</button>
        </div>
      </header>

      <div className="my-leave-dashboard">
        <div className="leave-balances">
            <div className="balance-card"><div className="balance-icon icon-vacation"><i className="bi bi-sun-fill"></i></div><div className="balance-info"><span className="balance-value">{leaveBalances.vacation}</span><span className="balance-label"> Vacation Days Left</span></div></div>
            <div className="balance-card"><div className="balance-icon icon-sick"><i className="bi bi-heart-pulse-fill"></i></div><div className="balance-info"><span className="balance-value">{leaveBalances.sick}</span><span className="balance-label"> Sick Days Left</span></div></div>
        </div>
        <div className="upcoming-leave-card">
            <h6><i className="bi bi-calendar-check-fill text-success me-2"></i>Upcoming Leave</h6>
            {upcomingLeave ? (<div><p className="upcoming-type">{upcomingLeave.leaveType}</p><p className="upcoming-dates">{upcomingLeave.dateFrom} to {upcomingLeave.dateTo}</p></div>) 
                         : (<p className="text-muted no-upcoming">No upcoming approved leave.</p>)}
        </div>
      </div>
      
      <div className="card shadow-sm">
        <div className="card-header"><h5 className="mb-0">My Requests</h5></div>
        <div className="card-body">
            {renderFilters()}
            <div className="leave-requests-list mt-4">
                {filteredRequests.length > 0 ? (
                    filteredRequests.map(req => <LeaveRequestCard key={req.leaveId} request={req} onCancel={setRequestToCancel} onExtensionRequest={setRequestToExtend} onEdit={handleOpenEditModal} />)
                ) : (<div className="text-center p-5 bg-light rounded"><i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i><h5 className="text-muted">No Requests Found</h5><p className="text-muted">You have no {statusFilter !== 'All' ? statusFilter.toLowerCase() : ''} leave requests.</p></div>)}
            </div>
        </div>
      </div>

      <RequestLeaveModal show={showRequestModal} onClose={handleCloseRequestModal} onSave={handleSaveRequest} userGender={currentUser.gender} editingRequest={editingRequest}/>
      <LeaveHistoryModal show={showHistoryModal} onClose={() => setShowHistoryModal(false)} leaveHistory={userLeaveRequests} />
      <ConfirmationModal show={!!requestToCancel} onClose={() => setRequestToCancel(null)} onConfirm={handleConfirmCancel} title="Cancel Leave Request" confirmText="Yes, Cancel Request" confirmVariant="danger"><p>Are you sure you want to cancel this leave request?</p><p className="text-muted">This action cannot be undone.</p></ConfirmationModal>
      <ConfirmationModal show={!!requestToExtend} onClose={() => setRequestToExtend(null)} onConfirm={handleConfirmExtension} title="Request Leave Extension" confirmText="Yes, Submit Request" confirmVariant="primary"><p>Are you sure you want to request an additional <strong>30 days of unpaid leave</strong> to extend your maternity leave?</p><p className="text-muted">This will be sent to HR for approval and must be formally communicated.</p></ConfirmationModal>
    </div>
  );
};

export default MyLeavePage;