import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './ScheduleManagementPage.css';
import AddColumnModal from '../../modals/AddColumnModal';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ScheduleBuilderPage = ({ employees, positions, handlers }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { date: initialDate, method, sourceData } = location.state || {};

  const [scheduleDate] = useState(initialDate);
  const [scheduleName, setScheduleName] = useState('');
  const [columns, setColumns] = useState([{ key: 'shift', name: 'Shift' }]);
  const [gridData, setGridData] = useState([]);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);

  const employeeOptions = useMemo(() => (employees || []).map(e => ({ value: e.id, label: `${e.name} (${e.id})` })), [employees]);
  const positionsMap = useMemo(() => new Map((positions || []).map(p => [p.id, p.title])), [positions]);

  useEffect(() => {
    if (!initialDate) {
      navigate('/dashboard/schedule-management');
      return;
    }

    let initialGrid = [];
    let initialName = `Schedule for ${initialDate}`;
    let initialColumns = [{ key: 'shift', name: 'Shift' }];

    if (method === 'copy' && sourceData && Array.isArray(sourceData)) {
      initialName = `Copy of ${sourceData[0]?.name || `Schedule for ${sourceData[0]?.date}`}`;
      const sourceColumns = new Set(['shift']);
      sourceData.forEach(entry => {
        Object.keys(entry).forEach(key => {
          if (!['scheduleId', 'empId', 'date', 'name', 'shift'].includes(key)) {
            sourceColumns.add(key);
          }
        });
      });
      initialColumns = Array.from(sourceColumns).map(key => ({ key, name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ') }));
      initialGrid = sourceData.map(sch => {
        const row = { empId: sch.empId };
        initialColumns.forEach(col => {
          row[col.key] = sch[col.key] || '';
        });
        return row;
      });
    } else if (method === 'template' && sourceData) {
      initialName = `${sourceData.name} for ${initialDate}`;
      const templateColumnKeys = sourceData.columns && sourceData.columns.length > 0 ? sourceData.columns : ['shift'];
      initialColumns = templateColumnKeys.map(key => ({
        key,
        name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
      }));
      const applicableEmp = employees.filter(emp => sourceData.applicablePositions.includes(positionsMap.get(emp.positionId)));
      const emptyRow = initialColumns.reduce((acc, col) => ({ ...acc, [col.key]: '' }), {});
      initialGrid = applicableEmp.map(emp => ({ ...emptyRow, empId: emp.id }));
    } else {
      initialGrid = [{ empId: '', shift: '' }];
    }

    setScheduleName(initialName);
    setColumns(initialColumns);
    setGridData(initialGrid);
  }, [initialDate, method, sourceData, navigate, employees, positions, positionsMap]);

  const addEmployeeRow = () => {
    const newRow = columns.reduce((acc, col) => ({ ...acc, [col.key]: '' }), { empId: '' });
    setGridData(prev => [...prev, newRow]);
  };

  const removeEmployeeRow = (rowIndex) => {
    setGridData(prev => prev.filter((_, index) => index !== rowIndex));
  };

  const handleAddColumn = (newColumn) => {
    if (columns.some(c => c.key === newColumn.key) || ['empId', 'name', 'position'].includes(newColumn.key)) {
      alert(`Column "${newColumn.name}" or its key already exists.`);
      return;
    }
    setColumns(prev => [...prev, newColumn]);
    setGridData(prevGrid => prevGrid.map(row => ({ ...row, [newColumn.key]: '' })));
  };

  const handleEmployeeSelect = (rowIndex, selectedOption) => {
    const newGrid = [...gridData];
    newGrid[rowIndex].empId = selectedOption ? selectedOption.value : '';
    setGridData(newGrid);
  };

  const handleGridInputChange = (rowIndex, fieldKey, value) => {
    const newGrid = [...gridData];
    newGrid[rowIndex][fieldKey] = value;
    setGridData(newGrid);
  };

  const handleSaveSchedule = () => {
    if (!scheduleName.trim()) {
      alert("Please provide a name for the schedule.");
      return;
    }

    const newScheduleEntries = [];
    const uniqueEmpIds = new Set();
    let hasDuplicates = false;

    gridData.forEach(row => {
      if (row.empId) {
        if (uniqueEmpIds.has(row.empId)) {
          hasDuplicates = true;
        }
        uniqueEmpIds.add(row.empId);

        const entryData = columns.reduce((acc, col) => {
          if (row[col.key] && String(row[col.key]).trim() !== '') acc[col.key] = row[col.key];
          return acc;
        }, {});

        if (Object.keys(entryData).length > 0 && entryData.shift && entryData.shift.trim() !== '' && entryData.shift.toUpperCase() !== 'OFF') {
          newScheduleEntries.push({ empId: row.empId, date: scheduleDate, name: scheduleName, ...entryData });
        }
      }
    });

    if (hasDuplicates) {
      alert("Error: Each employee can only be listed once per schedule.");
      return;
    }
    if (newScheduleEntries.length === 0) {
      alert("Please add at least one employee and assign a valid shift.");
      return;
    }

    const success = handlers.createSchedules(newScheduleEntries);
    if (success) {
      navigate('/dashboard/schedule-management');
    }
  };

  return (
    <div className="container-fluid page-module-container p-lg-4 p-md-3 p-2">
      <header className="page-header d-flex align-items-center mb-4 detail-view-header">
        <button className="btn btn-light me-3 back-button" onClick={() => navigate('/dashboard/schedule-management')}><i className="bi bi-arrow-left"></i></button>
        <div className="flex-grow-1">
          <h1 className="page-main-title mb-0">Schedule Builder</h1>
          <p className="page-subtitle text-muted mb-0">Building schedule for <strong>{scheduleDate}</strong></p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline-secondary action-button-secondary" onClick={() => setShowAddColumnModal(true)}><i className="bi bi-layout-three-columns"></i> Add Column</button>
        </div>
      </header>
      <div className="mb-3 schedule-name-input-container">
        <label htmlFor="scheduleName" className="form-label fw-bold">Schedule Name*</label>
        <input type="text" className="form-control form-control-lg" id="scheduleName" placeholder="e.g., Weekday Production Team" value={scheduleName} onChange={e => setScheduleName(e.target.value)} required />
      </div>

      <div className="card data-table-card">
        <div className="card-body">
          <div className="table-responsive schedule-builder-table">
            <table className="table table-bordered table-sm">
              <thead>
                <tr>
                  <th className="employee-id-column">Employee ID</th>
                  <th className="employee-name-column">Employee Name</th>
                  <th className="position-column">Position</th>
                  {columns.map(col => <th key={col.key} className="text-center custom-column">{col.name}</th>)}
                  <th className="action-column"></th>
                </tr>
              </thead>
              <tbody>
                {gridData.map((row, rowIndex) => {
                  const selectedEmployee = employees.find(e => e.id === row.empId);
                  const positionTitle = selectedEmployee ? (positionsMap.get(selectedEmployee.positionId) || 'Unassigned') : '';
                  return (
                    <tr key={rowIndex}>
                      <td>
                        <input type="text" className="form-control form-control-sm readonly-input" value={selectedEmployee?.id || ''} readOnly disabled />
                      </td>
                      <td>
                        <div className="react-select-container">
                          <Select
                            options={employeeOptions}
                            isClearable
                            placeholder="Search & Select..."
                            value={employeeOptions.find(o => o.value === row.empId)}
                            onChange={(selectedOption) => handleEmployeeSelect(rowIndex, selectedOption)}
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                          />
                        </div>
                      </td>
                      <td>
                        <input type="text" className="form-control form-control-sm readonly-input" value={positionTitle} readOnly disabled />
                      </td>
                      {columns.map(col => (
                        <td key={col.key}>
                          <input type="text" className="form-control form-control-sm shift-input" value={row[col.key] || ''} onChange={e => handleGridInputChange(rowIndex, col.key, e.target.value)} />
                        </td>
                      ))}
                      <td>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeEmployeeRow(rowIndex)} title="Remove Row">
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button type="button" className="btn btn-sm btn-outline-secondary mt-2" onClick={addEmployeeRow}><i className="bi bi-plus-lg"></i> Add Row</button>
        </div>
      </div>

      <div className="d-flex justify-content-end mt-3 gap-2">
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/dashboard/schedule-management')}>Cancel</button>
        <button type="button" className="btn btn-success action-button-primary" onClick={handleSaveSchedule}>Save Schedule</button>
      </div>

      <AddColumnModal
        show={showAddColumnModal}
        onClose={() => setShowAddColumnModal(false)}
        onAddColumn={handleAddColumn}
      />
    </div>
  );
};

export default ScheduleBuilderPage;