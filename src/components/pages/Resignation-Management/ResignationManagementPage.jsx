import React, { useState, useMemo } from 'react';
import { differenceInDays, parseISO, isPast, isToday } from 'date-fns';
import ResignationRequestRow from './ResignationRequestRow';
import ConfirmationModal from '../../modals/ConfirmationModal';
import EditEffectiveDateModal from '../../modals/EditEffectiveDateModal';
import ViewReasonModal from '../../modals/ViewReasonModal';
import OffboardedEmployeesTab from './OffboardedEmployeesTab';
import AddEditEmployeeModal from '../../modals/AddEditEmployeeModal';
import FinalPayModal from '../../modals/FinalPayModal';
import TerminatedEmployeesTab from './TerminatedEmployeesTab';
import { calculateFinalPay } from '../../../hooks/payrollUtils';
import './ResignationManagementPage.css';

const STATUS_ORDER = { 'Pending': 1, 'Approved': 2, 'Declined': 3 };

const ResignationManagementPage = ({ resignations, terminations, employees, positions, handlers, payrolls }) => {
    const [activeTab, setActiveTab] = useState('open');
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'status', direction: 'ascending' });
    
    // Modal states
    const [requestToAction, setRequestToAction] = useState(null);
    const [action, setAction] = useState({ type: '', comments: '' });
    const [editingRequest, setEditingRequest] = useState(null);
    const [viewingRequest, setViewingRequest] = useState(null);
    const [employeeToRehire, setEmployeeToRehire] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
    const [viewingEmployee, setViewingEmployee] = useState(null);
    const [finalPayDetails, setFinalPayDetails] = useState(null);

    const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);
    const positionMap = useMemo(() => new Map(positions.map(p => [p.id, p.title])), [positions]);

    const activeResignations = useMemo(() => {
        return resignations.filter(req => {
            if (!req || !req.id) return false; // Filter out any invalid records
            
            // Hide if the request is 'Approved' and its effective date is in the past
            if (req.status === 'Approved' && req.effectiveDate && isPast(parseISO(req.effectiveDate)) && !isToday(parseISO(req.effectiveDate))) {
                return false;
            }
            return true;
        });
    }, [resignations]);

    const stats = useMemo(() => {
        return activeResignations.reduce((acc, req) => {
            acc.All = (acc.All || 0) + 1;
            if (req.status === 'Pending') acc.Pending = (acc.Pending || 0) + 1;
            if (req.status === 'Approved') acc.Approved = (acc.Approved || 0) + 1;
            if (req.status === 'Declined') acc.Declined = (acc.Declined || 0) + 1;
            return acc;
        }, { All: 0, Pending: 0, Approved: 0, Declined: 0 });
    }, [activeResignations]);

    const filteredAndSortedResignations = useMemo(() => {
        let filtered = activeResignations.filter(req => {
            if (statusFilter !== 'All' && req.status !== statusFilter) return false;
            if (searchTerm && !req.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            return true;
        }).filter(Boolean);
        
        return [...filtered].sort((a, b) => {
            const today = new Date();
            const key = sortConfig.key;
            const direction = sortConfig.direction === 'ascending' ? 1 : -1;

            let valA, valB;
            
            if (key === 'noticePeriod') {
                valA = a.effectiveDate && a.submissionDate ? differenceInDays(parseISO(a.effectiveDate), parseISO(a.submissionDate)) : -1;
                valB = b.effectiveDate && b.submissionDate ? differenceInDays(parseISO(b.effectiveDate), parseISO(b.submissionDate)) : -1;
            } else if (key === 'daysRemaining') {
                valA = a.status === 'Approved' && a.effectiveDate ? differenceInDays(parseISO(a.effectiveDate), today) : -Infinity;
                valB = b.status === 'Approved' && b.effectiveDate ? differenceInDays(parseISO(b.effectiveDate), today) : -Infinity;
            } else if (key === 'status') {
                return (STATUS_ORDER[a[key]] - STATUS_ORDER[b[key]]) * direction;
            } else {
                valA = a[key] || '';
                valB = b[key] || '';
            }

            if (valA < valB) return -1 * direction;
            if (valA > valB) return 1 * direction;
            return 0;
        });
    }, [activeResignations, statusFilter, searchTerm, sortConfig]);

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

    const handleOpenActionModal = (request, type) => {
        setRequestToAction(request);
        setAction({ type, comments: '' });
    };

    const handleConfirmAction = () => {
        if (requestToAction) {
            handlers.updateResignationStatus(requestToAction.id, action.type, action.comments);
            setRequestToAction(null);
            setAction({ type: '', comments: '' });
        }
    };

    const handleSaveEffectiveDate = (resignationId, newDate) => {
        handlers.updateResignationEffectiveDate(resignationId, newDate);
        setEditingRequest(null);
    };

    const handleConfirmRehire = () => {
        if (employeeToRehire) {
            handlers.rehireEmployee(employeeToRehire.id);
            setEmployeeToRehire(null);
        }
    };

    const handleConfirmDelete = () => {
        if (!itemToDelete) return;
        if (itemToDelete.type === 'request') {
            handlers.deleteResignationRequest(itemToDelete.item.id);
        } else if (itemToDelete.type === 'employee') {
            handlers.deleteEmployee(itemToDelete.item.id);
        }
        setItemToDelete(null);
    };

    const handleConfirmDeleteAll = () => {
        handlers.deleteAllResignedEmployees();
        setShowDeleteAllModal(false);
    };

    const handleViewProfile = (employee) => {
        setViewingEmployee(employee);
    };

    const handleViewFinalPay = (employee) => {
        const resignationRecord = resignations.find(r => r.employeeId === employee.id);
        const lastPositionTitle = resignationRecord?.position || positionMap.get(employee.positionId);
        const position = positions.find(p => p.title === lastPositionTitle);
        const calculation = calculateFinalPay(employee, position, payrolls);
        setFinalPayDetails({ ...calculation, employeeName: employee.name });
    };

    const handleViewResignationReason = (employee) => {
        const resignationRecord = resignations.find(r => r.employeeId === employee.id);
        if (resignationRecord) {
            setViewingRequest({
                name: employee.name,
                empId: employee.id,
                leaveType: 'Resignation',
                reason: resignationRecord.reason
            });
        }
    };

    return (
        <div className="container-fluid p-0 page-module-container">
            <header className="page-header mb-4">
                <h1 className="page-main-title">Resignation Management</h1>
            </header>

            <ul className="nav nav-tabs resignation-tabs">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'open' ? 'active' : ''}`} onClick={() => setActiveTab('open')}>Open Requests</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'resigned' ? 'active' : ''}`} onClick={() => setActiveTab('resigned')}>Resigned Employees</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'terminated' ? 'active' : ''}`} onClick={() => setActiveTab('terminated')}>Terminated Employees</button>
                </li>
            </ul>

            <div className="resignation-tab-content">
                {activeTab === 'open' && (
                    <>
                        <div className="resignation-stats-grid">
                            <div className={`stat-card-resignation all ${statusFilter === 'All' ? 'active' : ''}`} onClick={() => setStatusFilter('All')}>
                                <span className="stat-value">{stats.All}</span><span className="stat-label">Total Requests</span>
                            </div>
                            <div className={`stat-card-resignation pending ${statusFilter === 'Pending' ? 'active' : ''}`} onClick={() => setStatusFilter('Pending')}>
                                <span className="stat-value">{stats.Pending}</span><span className="stat-label">Pending Review</span>
                            </div>
                            <div className={`stat-card-resignation approved ${statusFilter === 'Approved' ? 'active' : ''}`} onClick={() => setStatusFilter('Approved')}>
                                <span className="stat-value">{stats.Approved}</span><span className="stat-label">Approved</span>
                            </div>
                            <div className={`stat-card-resignation declined ${statusFilter === 'Declined' ? 'active' : ''}`} onClick={() => setStatusFilter('Declined')}>
                                <span className="stat-value">{stats.Declined}</span><span className="stat-label">Declined</span>
                            </div>
                        </div>
                        <div className="card data-table-card shadow-sm">
                            <div className="resignation-controls">
                                <div className="input-group">
                                    <span className="input-group-text"><i className="bi bi-search"></i></span>
                                    <input type="text" className="form-control" placeholder="Search by employee name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table data-table mb-0 align-middle">
                                    <thead>
                                        <tr>
                                            <th className="sortable" onClick={() => requestSort('employeeId')}>ID {getSortIcon('employeeId')}</th>
                                            <th className="sortable" onClick={() => requestSort('employeeName')}>Employee {getSortIcon('employeeName')}</th>
                                            <th>Position</th>
                                            <th className="sortable" onClick={() => requestSort('submissionDate')}>Submission Date {getSortIcon('submissionDate')}</th>
                                            <th className="sortable" onClick={() => requestSort('effectiveDate')}>Effective Date {getSortIcon('effectiveDate')}</th>
                                            <th className="text-center sortable" onClick={() => requestSort('noticePeriod')}>Notice Period {getSortIcon('noticePeriod')}</th>
                                            <th className="text-center sortable" onClick={() => requestSort('daysRemaining')}>Days Remaining {getSortIcon('daysRemaining')}</th>
                                            <th className="text-center sortable" onClick={() => requestSort('status')}>Status {getSortIcon('status')}</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAndSortedResignations.length > 0 ? filteredAndSortedResignations.map(req => {
                                            const employee = employeeMap.get(req.employeeId);
                                            return (
                                                <ResignationRequestRow 
                                                    key={req.id}
                                                    request={req}
                                                    employee={employee}
                                                    onApprove={() => handleOpenActionModal(req, 'Approved')}
                                                    onDecline={() => handleOpenActionModal(req, 'Declined')}
                                                    onEditDate={() => setEditingRequest(req)}
                                                    onViewReason={() => setViewingRequest(req)}
                                                    onDelete={() => setItemToDelete({ item: req, type: 'request' })}
                                                    onViewProfile={() => handleViewProfile(employee)}
                                                />
                                            );
                                        }) : (
                                            <tr><td colSpan="9" className="text-center p-4 text-muted">No open resignation requests match your criteria.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'resigned' && (
                    <OffboardedEmployeesTab 
                        employees={employees} 
                        resignations={resignations}
                        positions={positions}
                        positionMap={positionMap}
                        payrolls={payrolls}
                        onRehire={setEmployeeToRehire}
                        onDelete={(emp) => setItemToDelete({ item: emp, type: 'employee' })}
                        onDeleteAll={() => setShowDeleteAllModal(true)}
                        onViewProfile={handleViewProfile}
                        onViewFinalPay={handleViewFinalPay}
                        onViewReason={handleViewResignationReason}
                    />
                )}

                {activeTab === 'terminated' && (
                    <TerminatedEmployeesTab
                        employees={employees}
                        terminations={terminations}
                        positions={positions}
                        positionMap={positionMap}
                        payrolls={payrolls}
                        onRehire={setEmployeeToRehire}
                        onDelete={(emp) => setItemToDelete({ item: emp, type: 'employee' })}
                        onViewProfile={handleViewProfile}
                        onViewFinalPay={handleViewFinalPay}
                    />
                )}
            </div>

            {/* Modals */}
            {requestToAction && (
                <ConfirmationModal
                    show={!!requestToAction}
                    onClose={() => setRequestToAction(null)}
                    onConfirm={handleConfirmAction}
                    title={`${action.type} Resignation`}
                    confirmText={`Yes, ${action.type}`}
                    confirmVariant={action.type === 'Approved' ? 'success' : 'danger'}
                >
                    <p>Are you sure you want to <strong>{action.type.toLowerCase()}</strong> the resignation request for <strong>{requestToAction.employeeName}</strong>?</p>
                    {action.type === 'Approved' && <p className="small text-muted">Approving will change the employee's status to "Resigned" and they will appear in the Resigned Employees tab.</p>}
                    <label htmlFor="hrComments" className="form-label">Comments (Optional)</label>
                    <textarea id="hrComments" className="form-control" rows="2" value={action.comments} onChange={(e) => setAction({...action, comments: e.target.value})}></textarea>
                </ConfirmationModal>
            )}

            {editingRequest && (
                <EditEffectiveDateModal
                    show={!!editingRequest}
                    onClose={() => setEditingRequest(null)}
                    onSave={handleSaveEffectiveDate}
                    request={editingRequest}
                />
            )}
            
            <ViewReasonModal 
                show={!!viewingRequest}
                onClose={() => setViewingRequest(null)}
                title="Resignation Reason"
                request={viewingRequest ? { name: viewingRequest.employeeName || viewingRequest.name, empId: viewingRequest.employeeId || viewingRequest.empId, leaveType: 'Resignation', reason: viewingRequest.reason } : null}
            />

            {employeeToRehire && (
                <ConfirmationModal
                    show={!!employeeToRehire}
                    onClose={() => setEmployeeToRehire(null)}
                    onConfirm={handleConfirmRehire}
                    title="Confirm Rehire"
                    confirmText="Yes, Rehire"
                    confirmVariant="success"
                >
                    <p>Are you sure you want to rehire <strong>{employeeToRehire.name}</strong>?</p>
                    <p className="text-muted small">This will change their status to "Active", update their joining date to today, and reactivate their system account.</p>
                </ConfirmationModal>
            )}

            {itemToDelete && (
                <ConfirmationModal
                    show={!!itemToDelete}
                    onClose={() => setItemToDelete(null)}
                    onConfirm={handleConfirmDelete}
                    title={`Confirm Deletion`}
                    confirmText="Yes, Permanently Delete"
                    confirmVariant="danger"
                >
                    {itemToDelete.type === 'request' && (
                        <p>Are you sure you want to delete the resignation request for <strong>{itemToDelete.item.employeeName}</strong>?</p>
                    )}
                    {itemToDelete.type === 'employee' && (
                        <>
                            <p>Are you sure you want to permanently delete the record for <strong>{itemToDelete.item.name}</strong>?</p>
                            <div className="alert alert-danger mt-3">
                                <strong>Warning:</strong> This action is irreversible and will remove all data associated with this employee, including payroll history. In a real system, you should archive records, not delete them.
                            </div>
                        </>
                    )}
                </ConfirmationModal>
            )}

            {showDeleteAllModal && (
                <ConfirmationModal
                    show={showDeleteAllModal}
                    onClose={() => setShowDeleteAllModal(false)}
                    onConfirm={handleConfirmDeleteAll}
                    title="Delete All Resigned Employee Records"
                    confirmText="Yes, Permanently Delete All"
                    confirmVariant="danger"
                >
                    <p>Are you sure you want to permanently delete all records for resigned employees?</p>
                    <div className="alert alert-danger mt-3">
                        <strong>Warning:</strong> This is a highly destructive and irreversible action. It will remove all associated data for these employees.
                    </div>
                </ConfirmationModal>
            )}

            {viewingEmployee && (
                <AddEditEmployeeModal
                    show={!!viewingEmployee}
                    onClose={() => setViewingEmployee(null)}
                    employeeData={viewingEmployee}
                    positions={positions}
                    viewOnly={true}
                    onSave={() => {}}
                    onSwitchToEdit={() => {}}
                />
            )}
            
            {finalPayDetails && (
                <FinalPayModal
                    show={!!finalPayDetails}
                    onClose={() => setFinalPayDetails(null)}
                    data={finalPayDetails}
                />
            )}
        </div>
    );
};

export default ResignationManagementPage;