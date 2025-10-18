import React, { useState, useMemo } from 'react';
import EditLeaveCreditsModal from '../../modals/EditLeaveCreditsModal';
import LeaveHistoryModal from '../../modals/LeaveHistoryModal';
import BulkAddLeaveCreditsModal from '../../modals/BulkAddLeaveCreditsModal';

const LeaveCreditsTab = ({ employees, leaveRequests, handlers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const activeEmployees = useMemo(() => employees.filter(emp => emp.status === 'Active'), [employees]);

  const employeeLeaveData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    
    const calculatedData = activeEmployees.map(emp => {
        const totalCredits = emp.leaveCredits || { sick: 0, vacation: 0, personal: 0, paternity: 0 };
        const usedCredits = leaveRequests
          .filter(req => 
            req.empId === emp.id && 
            req.status === 'Approved' &&
            new Date(req.dateFrom).getFullYear() === currentYear
          )
          .reduce((acc, req) => {
            const rawType = req.leaveType.toLowerCase();
            let type = rawType.replace(' leave', '');
            if (acc.hasOwnProperty(type)) {
              acc[type] = (acc[type] || 0) + req.days;
            }
            return acc;
          }, { vacation: 0, sick: 0, unpaid: 0, emergency: 0, paternity: 0 });
        
        const individualHistory = leaveRequests.filter(req => req.empId === emp.id);

        return {
          ...emp,
          totalCredits,
          usedCredits,
          leaveHistory: individualHistory,
          remainingBalance: {
            vacation: (totalCredits.vacation || 0) - (usedCredits.vacation || 0),
            sick: (totalCredits.sick || 0) - (usedCredits.sick || 0),
            paternity: (totalCredits.paternity || 0) - (usedCredits.paternity || 0),
          }
        };
      });

    const filteredData = calculatedData.filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return [...filteredData].sort((a, b) => {
      let valA, valB;
      if (['vacation', 'sick', 'paternity', 'unpaid', 'emergency'].includes(sortConfig.key)) {
        if (sortConfig.key === 'unpaid' || sortConfig.key === 'emergency') {
          valA = a.usedCredits[sortConfig.key] || 0;
          valB = b.usedCredits[sortConfig.key] || 0;
        } else {
          valA = a.remainingBalance[sortConfig.key];
          valB = b.remainingBalance[sortConfig.key];
        }
      } else {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      }
      
      if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });

  }, [activeEmployees, leaveRequests, searchTerm, sortConfig]);
  
  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };
  
  const handleHistoryClick = (employee) => {
    setSelectedEmployee(employee);
    setShowHistoryModal(true);
  };
  
  const handleSave = (employeeId, newCredits) => {
    handlers.updateLeaveCredits(employeeId, newCredits);
    setShowEditModal(false);
  };

  const handleBulkAdd = (creditsToAdd) => {
    handlers.bulkAddLeaveCredits(creditsToAdd);
    setShowBulkAddModal(false);
  };
  
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
  
  const getProgressBarVariant = (percentage) => {
    if (percentage > 50) return 'bg-success';
    if (percentage > 20) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="input-group" style={{ maxWidth: '400px' }}>
          <span className="input-group-text"><i className="bi bi-search"></i></span>
          <input type="text" className="form-control" placeholder="Search by employee name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
        </div>
        <button className="btn btn-primary" onClick={() => setShowBulkAddModal(true)}>
          <i className="bi bi-plus-circle-dotted me-2"></i>Add Credits to All
        </button>
      </div>
      <div className="card data-table-card shadow-sm">
        <div className="table-responsive">
          <table className="table data-table mb-0 align-middle">
            <thead>
              <tr>
                <th className="sortable" onClick={() => requestSort('name')}>Employee Name {getSortIcon('name')}</th>
                <th className="sortable" onClick={() => requestSort('vacation')}>Vacation {getSortIcon('vacation')}</th>
                <th className="sortable" onClick={() => requestSort('sick')}>Sick {getSortIcon('sick')}</th>
                <th className="sortable" onClick={() => requestSort('paternity')}>Paternity {getSortIcon('paternity')}</th>
                <th className="sortable text-center" onClick={() => requestSort('emergency')}>Emergency {getSortIcon('emergency')}</th>
                <th className="sortable text-center" onClick={() => requestSort('unpaid')}>Unpaid {getSortIcon('unpaid')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employeeLeaveData.map(emp => {
                const vacationRemaining = emp.remainingBalance.vacation;
                const vacationTotal = emp.totalCredits.vacation;
                const vacationPercentage = vacationTotal > 0 ? (vacationRemaining / vacationTotal) * 100 : 0;
                
                return (
                  <tr key={emp.id}>
                    <td><div>{emp.name}</div><small className="text-muted">{emp.id}</small></td>
                    <td style={{minWidth: '200px'}}>
                      <div className="balance-summary">{emp.usedCredits.vacation} of {vacationTotal} used</div>
                      <div className="progress" style={{height: '8px'}}><div className={`progress-bar ${getProgressBarVariant(vacationPercentage)}`} style={{width: `${vacationPercentage}%`}}></div></div>
                    </td>
                    <td className="text-center">{emp.remainingBalance.sick} / {emp.totalCredits.sick}</td>
                    <td className="text-center">{emp.gender === 'Male' ? `${emp.remainingBalance.paternity} / ${emp.totalCredits.paternity}` : 'N/A'}</td>
                    <td className="text-center fw-bold">{emp.usedCredits.emergency || 0}</td>
                    <td className="text-center fw-bold">{emp.usedCredits.unpaid || 0}</td>
                    <td>
                        <div className="dropdown">
                            <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">Actions</button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleHistoryClick(emp); }}>View History</a></li>
                                <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleEditClick(emp); }}>Edit Credits</a></li>
                            </ul>
                        </div>
                    </td>
                  </tr>
                );
              })}
              {employeeLeaveData.length === 0 && (
                <tr><td colSpan="7" className="text-center p-4">No active employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {showEditModal && selectedEmployee && (
        <EditLeaveCreditsModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
          employeeData={selectedEmployee}
        />
      )}
      
      {showHistoryModal && selectedEmployee && (
        <LeaveHistoryModal
          show={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          employeeName={selectedEmployee.name}
          leaveHistory={selectedEmployee.leaveHistory}
        />
      )}

      <BulkAddLeaveCreditsModal
        show={showBulkAddModal}
        onClose={() => setShowBulkAddModal(false)}
        onConfirm={handleBulkAdd}
        activeEmployeeCount={activeEmployees.length}
      />
    </>
  );
};

export default LeaveCreditsTab;