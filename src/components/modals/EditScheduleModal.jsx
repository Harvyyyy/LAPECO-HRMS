import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import AddColumnModal from './AddColumnModal';
import ConfirmationModal from './ConfirmationModal';
import '../pages/Schedule-Management/ScheduleManagementPage.css';

const EditScheduleModal = ({ show, onClose, onSave, scheduleDate, initialScheduleEntries, allEmployees, positions }) => {
  const [scheduleName, setScheduleName] = useState('');
  const [columns, setColumns] = useState([{ key: 'shift', name: 'Shift' }]);
  const [gridData, setGridData] = useState([]);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [editingHeaderKey, setEditingHeaderKey] = useState(null);

  const [confirmationModalState, setConfirmationModalState] = useState({
    isOpen: false,
    title: '',
    body: '',
    onConfirm: () => {},
  });

  const employeeOptions = useMemo(() => (allEmployees || []).map(e => ({ value: e.id, label: `${e.name} (${e.id})` })), [allEmployees]);
  const positionsMap = useMemo(() => new Map((positions || []).map(p => [p.id, p.title])), [positions]);
  
  useEffect(() => {
    if (show && initialScheduleEntries) {
      setScheduleName(initialScheduleEntries[0]?.name || `Schedule for ${scheduleDate}`);
      
      const existingColumns = new Set(['shift']);
      initialScheduleEntries.forEach(entry => { 
        Object.keys(entry).forEach(key => { 
          if(!['scheduleId', 'empId', 'date', 'name', 'shift', 'status'].includes(key)) { 
            existingColumns.add(key); 
          } 
        }); 
      });

      const dynamicColumns = Array.from(existingColumns).map(key => ({ 
        key, 
        name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ') 
      }));
      setColumns(dynamicColumns);
      
      const initialGrid = initialScheduleEntries.map(entry => {
        const row = { empId: entry.empId };
        dynamicColumns.forEach(col => { row[col.key] = entry[col.key] || ''; });
        return row;
      });
      setGridData(initialGrid);
    }
  }, [show, initialScheduleEntries, scheduleDate]);

  const addEmployeeRow = () => {
    const newRow = columns.reduce((acc, col) => ({ ...acc, [col.key]: '' }), { empId: '' });
    setGridData(prev => [...prev, newRow]);
  };

  const removeEmployeeRow = (rowIndex) => {
    const employeeName = employeeOptions.find(e => e.value === gridData[rowIndex].empId)?.label || `Row ${rowIndex + 1}`;
    setConfirmationModalState({
        isOpen: true,
        title: 'Remove Row',
        body: `Are you sure you want to remove ${employeeName} from this schedule?`,
        onConfirm: () => {
            setGridData(prev => prev.filter((_, index) => index !== rowIndex));
            closeConfirmationModal();
        }
    });
  };
  
  const handleAddColumn = (newColumn) => {
    if (columns.some(c => c.key === newColumn.key)) return;
    setColumns(prev => [...prev, newColumn]);
    setGridData(prevGrid => prevGrid.map(row => ({ ...row, [newColumn.key]: '' })));
  };

  const handleDeleteColumn = (keyToDelete) => {
    if (keyToDelete === 'shift') {
      alert('The "Shift" column cannot be deleted.');
      return;
    }
    const columnName = columns.find(c => c.key === keyToDelete)?.name;
    setConfirmationModalState({
        isOpen: true,
        title: 'Delete Column',
        body: `Are you sure you want to delete the "${columnName}" column? This will remove its data from this schedule.`,
        onConfirm: () => {
            setColumns(prev => prev.filter(col => col.key !== keyToDelete));
            setGridData(prevGrid => prevGrid.map(row => {
                const newRow = { ...row };
                delete newRow[keyToDelete];
                return newRow;
            }));
            closeConfirmationModal();
        }
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModalState({ isOpen: false, title: '', body: '', onConfirm: () => {} });
  };
  
  const handleColumnHeaderChange = (columnKey, newLabel) => {
    setColumns(currentColumns =>
      currentColumns.map(col =>
        col.key === columnKey ? { ...col, name: newLabel } : col
      )
    );
  };
  
  const handleHeaderClick = (key) => {
    if (key !== 'shift') {
      setEditingHeaderKey(key);
    }
  };
  
  const handleHeaderInputBlur = () => {
    setEditingHeaderKey(null);
  };
  
  const handleGridChange = (rowIndex, field, value) => {
    const newGrid = [...gridData];
    newGrid[rowIndex][field] = value;
    setGridData(newGrid);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedScheduleEntries = [];
    const uniqueEmpIds = new Set();
    let hasDuplicates = false;

    gridData.forEach(row => {
      if (row.empId) {
        if(uniqueEmpIds.has(row.empId)) { hasDuplicates = true; }
        uniqueEmpIds.add(row.empId);
        
        const entryData = columns.reduce((acc, col) => { if(row[col.key] && String(row[col.key]).trim() !== '') acc[col.key] = row[col.key]; return acc; }, {});
        if (Object.keys(entryData).length > 0 && entryData.shift && entryData.shift.trim() !== '' && entryData.shift.toUpperCase() !== 'OFF') {
          updatedScheduleEntries.push({ ...entryData, empId: row.empId, date: scheduleDate, name: scheduleName });
        }
      }
    });
    if (hasDuplicates) { alert("Error: Each employee can only be listed once per schedule."); return; }
    onSave(scheduleDate, updatedScheduleEntries);
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.6)'}}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Schedule for {scheduleDate}</h5>
              <div className="ms-auto"><button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowAddColumnModal(true)}><i className="bi bi-layout-three-columns me-1"></i> Add Column</button></div>
              <button type="button" className="btn-close ms-2" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3"><label className="form-label">Schedule Name (Optional)</label><input type="text" className="form-control" value={scheduleName} onChange={e => setScheduleName(e.target.value)} /></div>
              <div className="table-responsive schedule-builder-table">
                <table className="table table-bordered table-sm">
                  <thead>
                    <tr>
                      <th className="employee-id-column">Employee ID</th>
                      <th className="employee-name-column">Employee Name</th>
                      <th className="position-column">Position</th>
                      {columns.map(col => (
                        <th key={col.key} className={`text-center custom-column ${col.key !== 'shift' ? 'editable-header' : ''}`}>
                          {editingHeaderKey === col.key ? (
                            <input
                              type="text"
                              className="header-input"
                              value={col.name}
                              onChange={(e) => handleColumnHeaderChange(col.key, e.target.value)}
                              onBlur={handleHeaderInputBlur}
                              autoFocus
                            />
                          ) : (
                            <span className="header-label" onClick={() => handleHeaderClick(col.key)}>
                              {col.name}
                            </span>
                          )}
                          
                          {col.key !== 'shift' && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger p-0 delete-column-btn"
                              onClick={() => handleDeleteColumn(col.key)}
                              title={`Delete '${col.name}' column`}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          )}
                        </th>
                      ))}
                      <th className="action-column"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData.map((row, rowIndex) => {
                      const selectedEmployee = allEmployees.find(e => e.id === row.empId);
                      const positionTitle = selectedEmployee ? (positionsMap.get(selectedEmployee.positionId) || 'Unassigned') : '';
                      return (
                        <tr key={rowIndex}>
                          <td><input type="text" className="form-control form-control-sm readonly-input" value={selectedEmployee?.id || ''} readOnly disabled /></td>
                          <td>
                            <div className="react-select-container">
                              <Select options={employeeOptions} isClearable placeholder="Select..." value={employeeOptions.find(o => o.value === row.empId)} onChange={opt => handleGridChange(rowIndex, 'empId', opt ? opt.value : '')} menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} classNamePrefix="react-select" />
                            </div>
                          </td>
                          <td><input type="text" className="form-control form-control-sm readonly-input" value={positionTitle} readOnly disabled /></td>
                          {columns.map(col => (<td key={col.key}><input type="text" className="form-control form-control-sm shift-input" value={row[col.key] || ''} onChange={e => handleGridChange(rowIndex, col.key, e.target.value)} /></td>))}
                          <td><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeEmployeeRow(rowIndex)} title="Remove Row"><i className="bi bi-x-lg"></i></button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button type="button" className="btn btn-sm btn-outline-secondary mt-2" onClick={addEmployeeRow}><i className="bi bi-plus-lg"></i> Add Row</button>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary action-button-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
      <AddColumnModal show={showAddColumnModal} onClose={() => setShowAddColumnModal(false)} onAddColumn={handleAddColumn} />
      
      <ConfirmationModal
        show={confirmationModalState.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={confirmationModalState.onConfirm}
        title={confirmationModalState.title}
        confirmText="Yes, Delete"
        confirmVariant="danger"
      >
        <p>{confirmationModalState.body}</p>
      </ConfirmationModal>
    </div>
  );
};
export default EditScheduleModal;