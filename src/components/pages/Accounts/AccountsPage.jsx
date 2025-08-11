import React, { useMemo, useState } from 'react';
import ConfirmationModal from '../../modals/ConfirmationModal';
import './AccountsPage.css';

const AccountsPage = ({ userAccounts, employees, handlers }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [confirmationModalState, setConfirmationModalState] = useState({
        isOpen: false,
        title: '',
        body: '',
        confirmText: '',
        confirmVariant: 'danger',
        onConfirm: () => {},
    });

    const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e.name])), [employees]);

    const filteredAccounts = useMemo(() => {
        return userAccounts.filter(acc => {
            if (statusFilter !== 'All' && acc.status !== statusFilter) {
                return false;
            }
            const employeeName = employeeMap.get(acc.employeeId) || '';
            return (
                employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                acc.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                acc.username.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [userAccounts, searchTerm, statusFilter, employeeMap]);

    const handleCopyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text).then(() => {
            alert(`${type} copied to clipboard!`);
        });
    };

    const handleCloseConfirmation = () => {
        setConfirmationModalState({ isOpen: false });
    };

    const handleResetPassword = (account) => {
        setConfirmationModalState({
            isOpen: true,
            title: 'Reset Password',
            body: `Are you sure you want to reset the password for ${employeeMap.get(account.employeeId) || account.employeeId}? A new random password will be generated.`,
            confirmText: 'Yes, Reset',
            confirmVariant: 'warning',
            onConfirm: () => {
                handlers.resetPassword(account.employeeId);
                handleCloseConfirmation();
            }
        });
    };

    const handleToggleStatus = (account) => {
        const isActivating = account.status === 'Deactivated';
        setConfirmationModalState({
            isOpen: true,
            title: `${isActivating ? 'Activate' : 'Deactivate'} Account`,
            body: `Are you sure you want to ${isActivating ? 'activate' : 'deactivate'} the account for ${employeeMap.get(account.employeeId) || account.employeeId}?`,
            confirmText: `Yes, ${isActivating ? 'Activate' : 'Deactivate'}`,
            confirmVariant: isActivating ? 'success' : 'danger',
            onConfirm: () => {
                handlers.toggleAccountStatus(account.employeeId);
                handleCloseConfirmation();
            }
        });
    };

    return (
        <div className="container-fluid p-0 page-module-container">
            <header className="page-header d-flex justify-content-between align-items-center mb-4">
                <h1 className="page-main-title">Accounts Management</h1>
            </header>
            
            <div className="card data-table-card shadow-sm">
                <div className="card-header accounts-card-header">
                    <div className="input-group" style={{ maxWidth: '400px' }}>
                        <span className="input-group-text"><i className="bi bi-search"></i></span>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Search by name, ID, or username..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="btn-group view-toggle" role="group">
                        <button type="button" className={`btn ${statusFilter === 'All' ? 'active' : ''}`} onClick={() => setStatusFilter('All')}>All</button>
                        <button type="button" className={`btn ${statusFilter === 'Active' ? 'active' : ''}`} onClick={() => setStatusFilter('Active')}>Active</button>
                        <button type="button" className={`btn ${statusFilter === 'Deactivated' ? 'active' : ''}`} onClick={() => setStatusFilter('Deactivated')}>Deactivated</button>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table data-table mb-0 align-middle">
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Employee Name</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccounts.map(account => (
                                <tr key={account.employeeId}>
                                    <td><strong>{account.employeeId}</strong></td>
                                    <td>{employeeMap.get(account.employeeId) || 'N/A'}</td>
                                    <td>{account.username}</td>
                                    <td>
                                        <div className="password-cell">
                                            <span>••••••••</span>
                                            <button 
                                                className="btn btn-sm btn-light copy-btn" 
                                                title="Copy Password"
                                                onClick={() => handleCopyToClipboard(account.password, 'Password')}
                                            >
                                                <i className="bi bi-clipboard"></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge-employee status-badge-${account.status.toLowerCase()}`}>
                                            {account.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                Manage
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleResetPassword(account); }}>Reset Password</a></li>
                                                <li>
                                                    <a className={`dropdown-item ${account.status === 'Active' ? 'text-danger' : 'text-success'}`} href="#" onClick={(e) => { e.preventDefault(); handleToggleStatus(account); }}>
                                                        {account.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                show={confirmationModalState.isOpen}
                onClose={handleCloseConfirmation}
                onConfirm={confirmationModalState.onConfirm}
                title={confirmationModalState.title}
                confirmText={confirmationModalState.confirmText}
                confirmVariant={confirmationModalState.confirmVariant}
            >
                <p>{confirmationModalState.body}</p>
            </ConfirmationModal>
        </div>
    );
};

export default AccountsPage;