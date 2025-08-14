import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './ScheduleManagementPage.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import CreateTemplateModal from '../../modals/CreateTemplateModal';
import EditScheduleModal from '../../modals/EditScheduleModal';
import SelectDateForScheduleModal from '../../modals/SelectDateForScheduleModal';

const ScheduleManagementPage = ({ employees, positions, schedules, templates, handlers }) => {
  const [activeView, setActiveView] = useState('daily');
  const [previewData, setPreviewData] = useState(null);

  // View-specific state
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailySortConfig, setDailySortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [positionFilter, setPositionFilter] = useState('');
  const [listSearchTerm, setListSearchTerm] = useState('');
  const [listSortConfig, setListSortConfig] = useState({ key: 'date', direction: 'descending' });
  const [templateSearchTerm, setTemplateSearchTerm] = useState('');
  
  // Modal State
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [editingScheduleDate, setEditingScheduleDate] = useState(null);
  const [showSelectDateModal, setShowSelectDateModal] = useState(false);
  const [creationSource, setCreationSource] = useState(null);
  
  const navigate = useNavigate();

  // --- MEMOIZED DATA & DERIVED STATE ---
  const employeeMap = useMemo(() => new Map((employees || []).map(e => [e.id, e])), [employees]);
  const positionMap = useMemo(() => new Map((positions || []).map(p => [p.id, p.title])), [positions]);
  
  const schedulesByDate = useMemo(() => {
    const grouped = (schedules || []).reduce((acc, sch) => {
      (acc[sch.date] = acc[sch.date] || []).push(sch);
      return acc;
    }, {});
    Object.keys(grouped).forEach(date => {
        const entries = grouped[date];
        const columns = new Set();
        entries.forEach(entry => Object.keys(entry).forEach(key => columns.add(key)));
        grouped[date].info = {
            name: entries[0]?.name || `Schedule for ${new Date(date + 'T00:00:00').toLocaleDateString()}`,
            date: date,
            employeeCount: entries.length,
            columns: Array.from(columns).filter(key => !['scheduleId', 'empId', 'date', 'name'].includes(key)),
        };
    });
    return grouped;
  }, [schedules]);
  
  const scheduledEmployeesForDate = useMemo(() => {
    return (schedulesByDate[currentDate] || []).map(schedule => {
        const employeeDetails = employeeMap.get(schedule.empId);
        if (!employeeDetails) return null;
        return { ...schedule, ...employeeDetails, position: positionMap.get(employeeDetails.positionId) || 'Unassigned' };
      }).filter(Boolean);
  }, [currentDate, schedulesByDate, employeeMap, positionMap]);
  
  const sortedAndFilteredDailyEmployees = useMemo(() => {
    let employeesToProcess = [...scheduledEmployeesForDate];
    if (positionFilter) {
      employeesToProcess = employeesToProcess.filter(emp => emp.position === positionFilter);
    }
    if (dailySortConfig.key) {
      employeesToProcess.sort((a, b) => {
        const valA = String(a[dailySortConfig.key] || '').toLowerCase();
        const valB = String(b[dailySortConfig.key] || '').toLowerCase();
        if (valA < valB) return dailySortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return dailySortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return employeesToProcess;
  }, [scheduledEmployeesForDate, positionFilter, dailySortConfig]);
  
  const sortedAndFilteredSchedules = useMemo(() => {
    let scheds = Object.values(schedulesByDate).map(s => s.info);
    if (listSearchTerm) {
      scheds = scheds.filter(s => s.name.toLowerCase().includes(listSearchTerm.toLowerCase()));
    }
    scheds.sort((a, b) => {
      let valA = a[listSortConfig.key];
      let valB = b[listSortConfig.key];
      if (listSortConfig.key === 'date') {
        valA = new Date(valA); valB = new Date(valB);
      } else {
        valA = String(valA).toLowerCase(); valB = String(valB).toLowerCase();
      }
      if (valA < valB) return listSortConfig.direction === 'ascending' ? -1 : 1;
      if (valA > valB) return listSortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
    return scheds;
  }, [schedulesByDate, listSearchTerm, listSortConfig]);
  
  const listSortLabel = useMemo(() => {
    const { key, direction } = listSortConfig;
    if (key === 'date' && direction === 'descending') return 'Date (Newest First)';
    if (key === 'date' && direction === 'ascending') return 'Date (Oldest First)';
    if (key === 'name' && direction === 'ascending') return 'Name (A-Z)';
    if (key === 'name' && direction === 'descending') return 'Name (Z-A)';
    return 'Sort by';
  }, [listSortConfig]);

  const filteredTemplates = useMemo(() => {
    if (!templateSearchTerm) return templates;
    return templates.filter(tpl => tpl.name.toLowerCase().includes(templateSearchTerm.toLowerCase()));
  }, [templates, templateSearchTerm]);

  const dailyViewColumns = useMemo(() => {
    if (!scheduledEmployeesForDate || scheduledEmployeesForDate.length === 0) return [];
    const columnKeys = new Set();
    const excludedKeys = new Set(['scheduleId', 'empId', 'date', 'name', 'position', 'id', 'positionId', 'isTeamLeader', 'email', 'joiningDate', 'birthday', 'gender', 'address', 'contactNumber', 'imageUrl', 'sssNo', 'tinNo', 'pagIbigNo', 'philhealthNo', 'resumeUrl', 'shift', 'status']);
    scheduledEmployeesForDate.forEach(schedule => Object.keys(schedule).forEach(key => !excludedKeys.has(key) && columnKeys.add(key)));
    return Array.from(columnKeys).map(key => ({ key, name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ') }));
  }, [scheduledEmployeesForDate]);
  
  const positionsOnDate = useMemo(() => {
    const positions = new Set(scheduledEmployeesForDate.map(e => e.position));
    return ['All Positions', ...Array.from(positions).sort()];
  }, [scheduledEmployeesForDate]);

  const existingScheduleDatesSet = useMemo(() => new Set(Object.keys(schedulesByDate)), [schedulesByDate]);

  // --- HANDLERS ---
  const handleOpenCreateTemplateModal = (template = null) => { setEditingTemplate(template); setShowCreateTemplateModal(true); };
  const handleCloseCreateTemplateModal = () => { setShowCreateTemplateModal(false); setEditingTemplate(null); };
  const handleSaveAndCloseTemplateModal = (formData, templateId) => {
    handlers.createTemplate(formData, templateId);
    handleCloseCreateTemplateModal();
  };

  const handleOpenEditScheduleModal = (date) => { setEditingScheduleDate(date); setShowEditScheduleModal(true); };
  const handleCloseEditScheduleModal = () => { setEditingScheduleDate(null); setShowEditScheduleModal(false); };
  const handleSaveAndCloseEditModal = (date, updatedEntries) => {
    handlers.updateSchedule(date, updatedEntries);
    handleCloseEditScheduleModal();
  };
  
  // --- MODIFIED: Simplified handler ---
  const handleStartCreationFlow = (source) => {
    setCreationSource(source);
    setShowSelectDateModal(true);
  };

  const handleProceedToBuilder = (selectedDate) => {
    navigate('/dashboard/schedule-management/create', {
        state: { date: selectedDate, method: creationSource.type, sourceData: creationSource.data }
    });
  };

  const getSortIcon = (key, config) => {
    if (config.key !== key) return <i className="bi bi-arrow-down-up sort-icon ms-1"></i>;
    return config.direction === 'ascending' ? <i className="bi bi-sort-up sort-icon active ms-1"></i> : <i className="bi bi-sort-down sort-icon active ms-1"></i>;
  };
  
  const requestDailySort = (key) => {
    let direction = 'ascending';
    if (dailySortConfig.key === key && dailySortConfig.direction === 'ascending') { direction = 'descending'; }
    setDailySortConfig({ key, direction });
  };

  // --- RENDER FUNCTIONS ---
  const renderPreviewScreen = () => {
    if (!previewData) return null;
    const isTemplate = previewData.type === 'template';
    const title = isTemplate ? previewData.name : previewData.info.name;
    const subtitle = isTemplate ? previewData.description : `Schedule for ${new Date(previewData.info.date + 'T00:00:00').toLocaleDateString()}`;
    const dataForTable = isTemplate ? [] : schedulesByDate[previewData.info.date].map(s => ({...s, ...employeeMap.get(s.empId)}));
    const columnsForTable = isTemplate ? previewData.columns : previewData.info.columns;
    return (
      <div className="schedule-preview-container">
          <div className="schedule-preview-header">
              <div>
                  <button className="btn btn-sm btn-outline-secondary mb-3" onClick={() => setPreviewData(null)}><i className="bi bi-arrow-left me-2"></i>Back</button>
                  <h2 className="preview-title">{title}</h2>
                  <p className="preview-subtitle">{subtitle}</p>
              </div>
              <div className="preview-actions">
                  <button className="btn btn-success" onClick={() => handleStartCreationFlow({ type: isTemplate ? 'template' : 'copy', data: isTemplate ? previewData : schedulesByDate[previewData.info.date] })}>
                      <i className="bi bi-calendar-plus-fill me-2"></i>Use this Structure
                  </button>
              </div>
          </div>
          {isTemplate ? (
              <>
                  <h5 className="mb-3">Template Structure</h5>
                  <div className="table-responsive">
                      <table className="table template-preview-table">
                          <thead><tr>{(columnsForTable || []).map(key => <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>)}</tr></thead>
                          <tbody><tr><td colSpan={(columnsForTable || []).length} className="text-center">This is a template. It defines columns but contains no employee data.</td></tr></tbody>
                      </table>
                  </div>
              </>
          ) : (
              <>
                  <p className="fw-bold">This schedule includes the following employees:</p>
                  <div className="table-responsive schedule-preview-table">
                      <table className="table table-sm table-striped">
                          <thead>
                              <tr>
                                  <th>Employee ID</th><th>Employee Name</th><th>Position</th>
                                  {(columnsForTable || []).map(key => <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</th>)}
                              </tr>
                          </thead>
                          <tbody>
                              {dataForTable.map(emp => (
                                  <tr key={emp.scheduleId}>
                                      <td>{emp.id}</td><td>{emp.name}</td><td>{positionMap.get(emp.positionId) || 'Unassigned'}</td>
                                      {(columnsForTable || []).map(key => <td key={key}>{emp[key] || '---'}</td>)}
                                  </tr>
                              ))}
                          </tbody>
                      </table>   
                  </div>
              </>
          )}
      </div>
    );
  };
  
  const renderMainContent = () => {
    switch(activeView) {
      case 'daily':
        return (
          <>
            <div className="daily-view-header">
              <h4 className="daily-view-title">Daily Schedule</h4>
              <div className="daily-view-controls">
                <input type="date" className="form-control form-control-lg" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} />
                <div className="dropdown position-filter-dropdown">
                  <button className="btn btn-lg btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <span className="filter-label">{positionFilter || 'Filter by Position'}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {positionsOnDate.map(pos => (
                      <li key={pos}><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setPositionFilter(pos === 'All Positions' ? '' : pos);}}>{pos}</a></li>
                    ))}
                  </ul>
                </div>
                {scheduledEmployeesForDate.length > 0 && (
                  <button className="btn btn-lg btn-outline-secondary" onClick={() => handleOpenEditScheduleModal(currentDate)} title="Edit Schedule">
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                )}
              </div>
            </div>
            {sortedAndFilteredDailyEmployees.length > 0 ? (
                <div className="card data-table-card shadow-sm"><div className="card-body p-0"><div className="table-responsive">
                    <table className="table data-table mb-0">
                        <thead>
                            <tr>
                                <th className="sortable" onClick={() => requestDailySort('id')}>ID {getSortIcon('id', dailySortConfig)}</th>
                                <th className="sortable" onClick={() => requestDailySort('name')}>Employee Name {getSortIcon('name', dailySortConfig)}</th>
                                <th>Position</th>
                                <th className="sortable" onClick={() => requestDailySort('shift')}>Shift {getSortIcon('shift', dailySortConfig)}</th>
                                {dailyViewColumns.map(col => <th key={col.key}>{col.name}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAndFilteredDailyEmployees.map(emp => (
                                <tr key={emp.scheduleId}>
                                    <td>{emp.id}</td><td>{emp.name}</td><td>{emp.position}</td>
                                    <td><span className="badge bg-info">{emp.shift || '---'}</span></td>
                                    {dailyViewColumns.map(col => <td key={col.key}>{emp[col.key] || '---'}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div></div></div>
            ) : (
                <div className="text-center p-5 bg-light rounded">
                    <i className="bi bi-calendar2-x fs-1 text-muted mb-3 d-block"></i>
                    <h4 className="text-muted">{scheduledEmployeesForDate.length > 0 && positionFilter ? 'No employees match the filter.' : `No schedule created for ${new Date(currentDate + 'T00:00:00').toLocaleDateString()}.`}</h4>
                </div>
            )}
          </>
        );
      case 'list':
        return (
          <div className="schedule-list-container">
            <div className="schedule-list-controls">
                <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-search"></i></span>
                    <input type="text" className="form-control" placeholder="Search by schedule name..." value={listSearchTerm} onChange={(e) => setListSearchTerm(e.target.value)} />
                </div>
                <div className="dropdown sort-dropdown">
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bi bi-funnel me-2"></i>{listSortLabel}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li><h6 className="dropdown-header">Sort by Date</h6></li>
                        <li><a className={`dropdown-item ${listSortConfig.key === 'date' && listSortConfig.direction === 'descending' ? 'active' : ''}`} href="#" onClick={(e) => {e.preventDefault(); setListSortConfig({ key: 'date', direction: 'descending' });}}>Newest First</a></li>
                        <li><a className={`dropdown-item ${listSortConfig.key === 'date' && listSortConfig.direction === 'ascending' ? 'active' : ''}`} href="#" onClick={(e) => {e.preventDefault(); setListSortConfig({ key: 'date', direction: 'ascending' });}}>Oldest First</a></li>
                        <li><hr className="dropdown-divider"/></li>
                        <li><h6 className="dropdown-header">Sort by Name</h6></li>
                        <li><a className={`dropdown-item ${listSortConfig.key === 'name' && listSortConfig.direction === 'ascending' ? 'active' : ''}`} href="#" onClick={(e) => {e.preventDefault(); setListSortConfig({ key: 'name', direction: 'ascending' });}}>A to Z</a></li>
                        <li><a className={`dropdown-item ${listSortConfig.key === 'name' && listSortConfig.direction === 'descending' ? 'active' : ''}`} href="#" onClick={(e) => {e.preventDefault(); setListSortConfig({ key: 'name', direction: 'descending' });}}>Z to A</a></li>
                    </ul>
                </div>
            </div>
            <div className="schedule-card-grid mt-3">
                {sortedAndFilteredSchedules.length > 0 ? sortedAndFilteredSchedules.map(scheduleInfo => (
                    <div key={scheduleInfo.date} className="schedule-item-card type-schedule">
                        <div className="card-header"><h5 className="card-title">{scheduleInfo.name}</h5></div>
                        <div className="card-body">
                            <div className="info-row"><span className="info-label">Date:</span><span className="info-value">{new Date(scheduleInfo.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                            <div className="info-row"><span className="info-label">Employees Scheduled:</span><span className="info-value">{scheduleInfo.employeeCount}</span></div>
                        </div>
                        <div className="card-footer">
                            {/* --- MODIFIED: Added Use Schedule button --- */}
                            <button className="btn btn-sm btn-success" onClick={() => handleStartCreationFlow({ type: 'copy', data: schedulesByDate[scheduleInfo.date] })}>Use Schedule</button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => handleOpenEditScheduleModal(scheduleInfo.date)}>Edit</button>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => setPreviewData({ info: scheduleInfo, type: 'schedule' })}>View</button>
                        </div>
                    </div>
                )) : <div className="w-100"><p className="text-muted text-center mt-4">No schedules match your search.</p></div>}
            </div>
          </div>
        );
      case 'templates':
        return (
          <div className="templates-container">
            <div className="schedule-list-controls">
                <div className="input-group" style={{maxWidth: '400px'}}>
                    <span className="input-group-text"><i className="bi bi-search"></i></span>
                    <input type="text" className="form-control" placeholder="Search by template name..." value={templateSearchTerm} onChange={(e) => setTemplateSearchTerm(e.target.value)} />
                </div>
            </div>
            <div className="schedule-card-grid mt-3">
                <div className="schedule-item-card" style={{borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', minHeight: '220px', cursor: 'pointer'}} onClick={() => handleOpenCreateTemplateModal()}>
                    <div className="text-center text-muted"><i className="bi bi-plus-square-dotted fs-2"></i><p className="mt-2 mb-0 fw-bold">Create New Template</p></div>
                </div>
                {filteredTemplates.length > 0 ? filteredTemplates.map(tpl => (
                    <div key={tpl.id} className="schedule-item-card type-template">
                        <div className="card-header"><h5 className="card-title">{tpl.name}</h5></div>
                        <div className="card-body">
                            <dl className="mb-0">
                                <div className="template-info-section"><dt>Columns</dt><dd>{(tpl.columns || []).map(c => <span key={c} className="badge bg-secondary">{c.charAt(0).toUpperCase() + c.slice(1)}</span>)}</dd></div>
                                <div className="template-info-section"><dt>Applies to Positions</dt><dd>{(tpl.applicablePositions || []).map(p => <span key={p} className="badge bg-dark">{p}</span>)}</dd></div>
                            </dl>
                        </div>
                        <div className="card-footer">
                            {/* --- MODIFIED: Added Use Template button --- */}
                            <button className="btn btn-sm btn-success" onClick={() => handleStartCreationFlow({ type: 'template', data: tpl })}>Use Template</button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => handleOpenCreateTemplateModal(tpl)}>Edit</button>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => setPreviewData({ ...tpl, type: 'template' })}>View</button>
                        </div>
                    </div>
                )) : <div className="w-100"><p className="text-muted text-center mt-4">No templates match your search.</p></div>}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="container-fluid page-module-container p-lg-4 p-md-3 p-2">
      {previewData ? renderPreviewScreen() : (
        <>
            <header className="page-header d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
                <h1 className="page-main-title mb-3 mb-md-0">Schedule Management</h1>
                <div className="header-actions">
                    <button className="btn btn-success action-button-primary" onClick={() => handleStartCreationFlow({ type: 'scratch' })}>
                        <i className="bi bi-plus-circle-fill"></i> New Schedule
                    </button>
                </div>
            </header>

            <div className="schedule-view-controls">
                <button className={`btn ${activeView === 'daily' ? 'active' : ''}`} onClick={() => setActiveView('daily')}><i className="bi bi-calendar-day me-2"></i>Daily View</button>
                <button className={`btn ${activeView === 'list' ? 'active' : ''}`} onClick={() => setActiveView('list')}><i className="bi bi-calendar-range me-2"></i>Schedule List</button>
                <button className={`btn ${activeView === 'templates' ? 'active' : ''}`} onClick={() => setActiveView('templates')}><i className="bi bi-file-earmark-spreadsheet me-2"></i>Templates</button>
            </div>
            
            <div className="mt-4">
                {renderMainContent()}
            </div>
        </>
      )}

      {showCreateTemplateModal && ( <CreateTemplateModal show={showCreateTemplateModal} onClose={handleCloseCreateTemplateModal} onSave={handleSaveAndCloseTemplateModal} positions={positions} templateData={editingTemplate} /> )}
      {showEditScheduleModal && editingScheduleDate && ( <EditScheduleModal show={showEditScheduleModal} onClose={handleCloseEditScheduleModal} onSave={handleSaveAndCloseEditModal} scheduleDate={editingScheduleDate} initialScheduleEntries={schedules.filter(s => s.date === editingScheduleDate)} allEmployees={employees} positions={positions} /> )}
      {showSelectDateModal && ( <SelectDateForScheduleModal show={showSelectDateModal} onClose={() => setShowSelectDateModal(false)} onProceed={handleProceedToBuilder} existingScheduleDates={existingScheduleDatesSet} />)}
    </div>
  );
};

export default ScheduleManagementPage;