import React, { useState, useMemo } from 'react';
import './EnrollEmployeeModal.css';

const EnrollEmployeeModal = ({ show, onClose, onEnroll, program, allEmployees, existingEnrollments, employeeToEnroll }) => {
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  const isNominationMode = !!employeeToEnroll;

  const unassignedEmployees = useMemo(() => {
    if (isNominationMode) return [];
    const enrolledIds = new Set(existingEnrollments.map(e => e.employeeId));
    return allEmployees.filter(emp => !enrolledIds.has(emp.id));
  }, [allEmployees, existingEnrollments, isNominationMode]);

  const handleToggleEmployee = (empId) => {
    setSelectedEmployeeIds(prev =>
      prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
    );
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNominationMode) {
      onEnroll(program.id, [employeeToEnroll.id]);
    } else {
      if (selectedEmployeeIds.length > 0) {
        onEnroll(program.id, selectedEmployeeIds);
      } else {
        alert("Please select at least one employee to enroll.");
        return;
      }
    }
    onClose();
  };

  if (!show || !program) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {isNominationMode ? `Nominate ${employeeToEnroll.name}` : `Enroll in: ${program.title}`}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {isNominationMode ? (
                <p>Confirm nomination of <strong>{employeeToEnroll.name}</strong> for the training program: <strong>"{program.title}"</strong>?</p>
              ) : (
                <>
                  <p>Select employees to enroll in this program. Employees already enrolled are not shown.</p>
                  <div className="employee-enroll-list">
                    <ul className="list-group list-group-flush">
                      {unassignedEmployees.length > 0 ? unassignedEmployees.map(emp => (
                        <li key={emp.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <span>{emp.name} ({emp.id})</span>
                          <input className="form-check-input" type="checkbox" checked={selectedEmployeeIds.includes(emp.id)} onChange={() => handleToggleEmployee(emp.id)} />
                        </li>
                      )) : (
                        <li className="list-group-item text-muted">All employees are already enrolled.</li>
                      )}
                    </ul>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-success">
                {isNominationMode ? 'Confirm Nomination' : 'Enroll Selected'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnrollEmployeeModal;