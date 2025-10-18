import React, { useState, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './AttendancePage.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ReportPreviewModal from '../../modals/ReportPreviewModal';
import EditAttendanceModal from '../../modals/EditAttendanceModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import useReportGenerator from '../../../hooks/useReportGenerator';
import StatDonutChart from '../../common/StatDonutChart';
import Avatar from '../../common/Avatar';

const calculateHoursWorked = (signIn, signOut, breakOut, breakIn) => {
  if (!signIn || !signOut) return '0h 0m';

  const signInTime = new Date(`1970-01-01T${signIn}:00`);
  const signOutTime = new Date(`1970-01-01T${signOut}:00`);
  
  let totalMillis = signOutTime - signInTime;

  if (breakOut && breakIn) {
    const breakOutTime = new Date(`1970-01-01T${breakOut}:00`);
    const breakInTime = new Date(`1970-01-01T${breakIn}:00`);
    const breakMillis = breakInTime - breakOutTime;
    if (breakMillis > 0) {
      totalMillis -= breakMillis;
    }
  }

  if (totalMillis < 0) totalMillis = 0;
  
  const hours = Math.floor(totalMillis / 3600000);
  const minutes = Math.floor((totalMillis % 3600000) / 60000);

  return `${hours}h ${minutes}m`;
};

const AttendancePage = ({ allSchedules, employees, positions, attendanceLogs, setAttendanceLogs, handlers }) => {
  const [activeView, setActiveView] = useState('daily');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [positionFilter, setPositionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [employeeDateFilter, setEmployeeDateFilter] = useState({ start: '', end: '' });
  const [employeeHistoryFilter, setEmployeeHistoryFilter] = useState('');

  const [showReportPreview, setShowReportPreview] = useState(false);
  const { generateReport, pdfDataUri, isLoading, setPdfDataUri } = useReportGenerator();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAttendanceRecord, setEditingAttendanceRecord] = useState(null);
  const [dateToDelete, setDateToDelete] = useState(null);
  
  const fileInputRef = useRef(null);

  const dailyAttendanceList = useMemo(() => {
    if (!allSchedules || !employees || !positions) return [];
    const schedulesForDate = allSchedules.filter(s => s.date === currentDate);
    if (schedulesForDate.length === 0) return [];
    const employeeMap = new Map(employees.map(emp => [emp.id, emp]));
    const positionMap = new Map(positions.map(pos => [pos.id, pos.title]));
    const logMap = new Map((attendanceLogs || []).filter(att => att.date === currentDate).map(att => [att.empId, att]));
    return schedulesForDate.map(schedule => {
      const employeeDetails = employeeMap.get(schedule.empId);
      if (!employeeDetails) return null;
      const attendance = logMap.get(schedule.empId) || {};
      const positionTitle = positionMap.get(employeeDetails.positionId) || 'Unassigned';
      let status = "Absent";
      if (attendance.signIn) {
          const shiftStartTime = schedule.start_time || '00:00';
          status = attendance.signIn > shiftStartTime ? "Late" : "Present";
      }
      return {
        ...employeeDetails, ...schedule, position: positionTitle,
        signIn: attendance.signIn || null, breakOut: attendance.breakOut || null, breakIn: attendance.breakIn || null, signOut: attendance.signOut || null,
        workingHours: calculateHoursWorked(attendance.signIn, attendance.signOut, attendance.breakOut, attendance.breakIn),
        overtime_hours: attendance.overtime_hours || 0,
        status: status,
      };
    }).filter(Boolean);
  }, [currentDate, allSchedules, employees, positions, attendanceLogs]);

  const dailyStats = useMemo(() => {
    const total = dailyAttendanceList.length;
    const late = dailyAttendanceList.filter(e => e.status === 'Late').length;
    const absent = dailyAttendanceList.filter(e => e.status === 'Absent').length;
    const present = total - absent; // On-time + Late
    
    return {
      total, late, absent, present,
      presentPercentage: total > 0 ? (present / total) * 100 : 0,
      latePercentage: total > 0 ? (late / total) * 100 : 0,
      absentPercentage: total > 0 ? (absent / total) * 100 : 0,
    };
  }, [dailyAttendanceList]);

  const sortedAndFilteredList = useMemo(() => {
    let list = [...dailyAttendanceList];
    if (positionFilter) list = list.filter(item => item.position === positionFilter);
    if (statusFilter) {
      if(statusFilter === 'Present') {
        list = list.filter(item => item.status === 'Present' || item.status === 'Late');
      } else {
        list = list.filter(item => item.status === statusFilter);
      }
    }
    if (sortConfig.key) {
      list.sort((a, b) => {
        const valA = String(a[sortConfig.key] || 'z').toLowerCase();
        const valB = String(b[sortConfig.key] || 'z').toLowerCase();
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return list;
  }, [dailyAttendanceList, positionFilter, statusFilter, sortConfig]);

  const attendanceHistory = useMemo(() => {
    const history = {};
    const today = new Date().toISOString().split('T')[0];
    const schedulesMap = new Map(allSchedules.map(s => [`${s.date}-${s.empId}`, s]));
    allSchedules.forEach(s => {
      if (s.date < today) {
        if (!history[s.date]) {
          history[s.date] = { scheduled: 0, present: 0, late: 0 };
        }
        history[s.date].scheduled++;
      }
    });
    (attendanceLogs || []).forEach(log => {
      if (history[log.date]) {
        const scheduleKey = `${log.date}-${log.empId}`;
        const schedule = schedulesMap.get(scheduleKey);
        if (schedule && log.signIn) {
          history[log.date].present++;
          const shiftStartTime = schedule.start_time || '00:00';
          if (log.signIn > shiftStartTime) {
            history[log.date].late++;
          }
        }
      }
    });
    return Object.entries(history).map(([date, counts]) => ({
      date,
      present: counts.present,
      late: counts.late,
      absent: counts.scheduled - counts.present,
      total: counts.scheduled,
    })).sort((a,b) => new Date(b.date) - new Date(a.date));
  }, [attendanceLogs, allSchedules]);

  const filteredEmployeesForSelection = useMemo(() => 
      employees.filter(emp => 
          emp.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) || 
          emp.id.toLowerCase().includes(employeeSearchTerm.toLowerCase())
      )
  , [employees, employeeSearchTerm]);
    
  const selectedEmployeeRecords = useMemo(() => {
      if (!selectedEmployee) return { records: [], stats: {} };
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const hasDateFilter = employeeDateFilter.start && employeeDateFilter.end;
      const filterStartDate = hasDateFilter ? new Date(employeeDateFilter.start) : null;
      const filterEndDate = hasDateFilter ? new Date(employeeDateFilter.end) : null;
      if (filterStartDate) filterStartDate.setHours(0, 0, 0, 0);
      if (filterEndDate) filterEndDate.setHours(23, 59, 59, 999);
      
      const records = allSchedules
          .filter(s => {
              if (s.empId !== selectedEmployee.id) return false;
              if (hasDateFilter) {
                  const scheduleDate = new Date(s.date);
                  return scheduleDate >= filterStartDate && scheduleDate <= filterEndDate;
              }
              return true;
          })
          .map(schedule => {
              const log = (attendanceLogs || []).find(l => l.empId === schedule.empId && l.date === schedule.date);
              const scheduleDate = new Date(schedule.date);
              scheduleDate.setHours(0, 0, 0, 0);

              let status = "Scheduled";
              if (log && log.signIn) {
                  const shiftStartTime = schedule.start_time || '00:00';
                  status = log.signIn > shiftStartTime ? "Late" : "Present";
              } else if (scheduleDate < today) {
                  status = "Absent";
              }
              return { ...schedule, ...log, status };
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      const stats = records.reduce((acc, rec) => {
          const recordDate = new Date(rec.date);
          recordDate.setHours(0,0,0,0);
          
          if (recordDate < today) {
            acc.totalScheduled++;
            if (rec.status === 'Late') acc.totalLate++;
            if (rec.status === 'Absent') acc.totalAbsent++;
          }
          return acc;
      }, { totalScheduled: 0, totalLate: 0, totalAbsent: 0 });
      
      const totalPresent = stats.totalScheduled - stats.totalAbsent;
      const totalOnTime = totalPresent - stats.totalLate;
      
      stats.presentPercentage = stats.totalScheduled > 0 ? (totalPresent / stats.totalScheduled) * 100 : 0;
      stats.latePercentage = stats.totalScheduled > 0 ? (stats.totalLate / stats.totalScheduled) * 100 : 0;
      stats.absentPercentage = stats.totalScheduled > 0 ? (stats.totalAbsent / stats.totalScheduled) * 100 : 0;
      stats.totalPresent = totalPresent;
      stats.totalOnTime = totalOnTime;

      let filteredRecords = records;
      if (employeeHistoryFilter) {
          if (employeeHistoryFilter === 'Present') {
              filteredRecords = records.filter(r => r.status === 'Present');
          } else {
              filteredRecords = records.filter(r => r.status === employeeHistoryFilter);
          }
      }

      return { records: filteredRecords, stats };
  }, [selectedEmployee, allSchedules, attendanceLogs, employeeDateFilter, employeeHistoryFilter]);
  
  const handleSelectEmployee = (emp) => {
    setSelectedEmployee(emp);
    setEmployeeDateFilter({ start: '', end: '' });
    setEmployeeHistoryFilter('');
  };

  const handleStatusFilterClick = (newStatus) => {
    setStatusFilter(prevStatus => prevStatus === newStatus ? '' : newStatus);
  };
  const handleRequestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') { direction = 'descending'; }
    setSortConfig({ key, direction });
  };
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <i className="bi bi-arrow-down-up sort-icon ms-1"></i>;
    return sortConfig.direction === 'ascending' ? <i className="bi bi-sort-up sort-icon active ms-1"></i> : <i className="bi bi-sort-down sort-icon active ms-1"></i>;
  };
  const handleViewHistoryDetail = (date) => {
    setCurrentDate(date);
    setActiveView('historyDetail');
  };
  
  const handleGenerateReport = () => {
    if (!dailyAttendanceList || dailyAttendanceList.length === 0) {
      alert("No attendance data to generate a report for the selected day.");
      return;
    }
    generateReport(
        'attendance_summary', 
        { startDate: currentDate }, 
        { employees, schedules: allSchedules, attendanceLogs, positions }
    );
    setShowReportPreview(true);
  };

  const handleCloseReportPreview = () => {
    setShowReportPreview(false);
    if(pdfDataUri) URL.revokeObjectURL(pdfDataUri);
    setPdfDataUri('');
  };

  const handleOpenEditModal = (employeeData) => {
    const record = {
      id: employeeData.id,
      name: employeeData.name,
      schedule: { date: currentDate, start_time: employeeData.start_time, end_time: employeeData.end_time },
      signIn: employeeData.signIn,
      signOut: employeeData.signOut,
      breakIn: employeeData.breakIn,
      breakOut: employeeData.breakOut,
      overtime_hours: employeeData.overtime_hours,
    };
    setEditingAttendanceRecord(record);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingAttendanceRecord(null);
  };
  const handleSaveEditedTime = (empId, date, updatedTimes) => {
    setAttendanceLogs(prevLogs => {
      const existingLogIndex = prevLogs.findIndex(log => log.empId === empId && log.date === date);
      const newLogData = {
        empId, date,
        signIn: updatedTimes.signIn || null,
        signOut: updatedTimes.signOut || null,
        breakIn: updatedTimes.breakIn || null,
        breakOut: updatedTimes.breakOut || null,
        overtime_hours: updatedTimes.overtime_hours || 0,
      };
      if (existingLogIndex > -1) {
        const updatedLogs = [...prevLogs];
        updatedLogs[existingLogIndex] = newLogData;
        return updatedLogs;
      }
      return [...prevLogs, newLogData];
    });
    handleCloseEditModal();
  };
  const handleExport = () => {
    if (!sortedAndFilteredList || sortedAndFilteredList.length === 0) {
      alert("No data to export.");
      return;
    }
    const dataToExport = sortedAndFilteredList.map(emp => ({
      'Employee ID': emp.id, 'Name': emp.name, 'Position': emp.position, 'Start Time': emp.start_time, 'End Time': emp.end_time,
      'Time In': emp.signIn || '', 'Break Out': emp.breakOut || '', 'Break In': emp.breakIn || '',
      'Time Out': emp.signOut || '', 'Overtime (hrs)': emp.overtime_hours || 0, 'Status': emp.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, `Attendance_${currentDate}.xlsx`);
  };
  const handleImportClick = () => { fileInputRef.current.click(); };
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const importedData = XLSX.utils.sheet_to_json(worksheet);
          const newLogs = [...attendanceLogs];
          let updatedCount = 0;
          importedData.forEach(row => {
            const empId = row['Employee ID']?.toString();
            if (!empId) return;
            const isScheduled = dailyAttendanceList.some(emp => emp.id === empId);
            if (!isScheduled) return;
            const existingLogIndex = newLogs.findIndex(log => log.empId === empId && log.date === currentDate);
            const logUpdate = {
              signIn: row['Time In'] || row['Sign In'] || null, 
              signOut: row['Time Out'] || row['Sign Out'] || null,
              breakIn: row['Break In'] || null, breakOut: row['Break Out'] || null,
              overtime_hours: row['Overtime (hrs)'] || 0,
            };
            if (existingLogIndex > -1) { newLogs[existingLogIndex] = { ...newLogs[existingLogIndex], ...logUpdate };
            } else { newLogs.push({ empId, date: currentDate, ...logUpdate }); }
            updatedCount++;
          });
          setAttendanceLogs(newLogs);
          alert(`${updatedCount} records were updated/imported for ${currentDate}.`);
        } catch (error) {
          console.error("Error processing Excel file:", error);
          alert("Failed to process the Excel file. Please ensure it is a valid format.");
        }
      };
      reader.readAsArrayBuffer(file);
    }
    event.target.value = null;
  };

  const handleOpenDeleteConfirm = (e, date) => {
    e.stopPropagation();
    setDateToDelete(date);
  };
  
  const confirmDelete = () => {
    handlers.deleteAttendanceForDate(dateToDelete);
    setDateToDelete(null);
  };
  
  const uniquePositions = useMemo(() => ['All Positions', ...new Set(dailyAttendanceList.map(item => item.position))], [dailyAttendanceList]);
  
  const renderEmployeeView = () => {
    const positionMap = new Map(positions.map(pos => [pos.id, pos.title]));
    
    if (selectedEmployee) {
        const { records, stats } = selectedEmployeeRecords;
        return (
            <div>
                <button className="btn btn-light me-3 back-button mb-3" onClick={() => setSelectedEmployee(null)}>
                    <i className="bi bi-arrow-left"></i> Back to Employee List
                </button>
                <div className="employee-detail-header">
                    <Avatar src={selectedEmployee.imageUrl} alt={selectedEmployee.name} size="lg" className="employee-detail-avatar" />
                    <div>
                        <h2 className="employee-detail-name">{selectedEmployee.name}</h2>
                        <p className="employee-detail-meta">{selectedEmployee.id} • {positionMap.get(selectedEmployee.positionId) || 'Unassigned'}</p>
                    </div>
                </div>

                <div className="card my-4">
                    <div className="card-body employee-date-filter-bar">
                        <div className="filter-group">
                            <label htmlFor="employeeStartDate" className="form-label">Start Date</label>
                            <input
                                type="date"
                                id="employeeStartDate"
                                className="form-control"
                                value={employeeDateFilter.start}
                                onChange={(e) => setEmployeeDateFilter(prev => ({ ...prev, start: e.target.value }))}
                            />
                        </div>
                        <div className="filter-group">
                            <label htmlFor="employeeEndDate" className="form-label">End Date</label>
                            <input
                                type="date"
                                id="employeeEndDate"
                                className="form-control"
                                value={employeeDateFilter.end}
                                onChange={(e) => setEmployeeDateFilter(prev => ({ ...prev, end: e.target.value }))}
                                min={employeeDateFilter.start}
                            />
                        </div>
                        <button 
                            className="btn btn-outline-secondary align-self-end" 
                            onClick={() => setEmployeeDateFilter({ start: '', end: '' })}
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <div className="employee-attendance-stats my-4">
                  <button 
                    className={`btn btn-light view-all-btn ${!employeeHistoryFilter ? 'active' : ''}`}
                    onClick={() => setEmployeeHistoryFilter('')}
                  >
                    View All ({records.length})
                  </button>
                  <StatDonutChart 
                    label={`On Time (${stats.totalOnTime}/${stats.totalScheduled})`} 
                    percentage={stats.totalScheduled > 0 ? (stats.totalOnTime / stats.totalScheduled) * 100 : 0} 
                    color="var(--app-success-color)"
                    onClick={() => setEmployeeHistoryFilter(prev => prev === 'Present' ? '' : 'Present')}
                    isActive={employeeHistoryFilter === 'Present'}
                  />
                  <StatDonutChart 
                    label={`Late (${stats.totalLate}/${stats.totalScheduled})`} 
                    percentage={stats.latePercentage}
                    color="var(--warning-color)"
                    onClick={() => setEmployeeHistoryFilter(prev => prev === 'Late' ? '' : 'Late')}
                    isActive={employeeHistoryFilter === 'Late'}
                  />
                  <StatDonutChart 
                    label={`Absent (${stats.totalAbsent}/${stats.totalScheduled})`} 
                    percentage={stats.absentPercentage}
                    color="var(--danger-color)"
                    onClick={() => setEmployeeHistoryFilter(prev => prev === 'Absent' ? '' : 'Absent')}
                    isActive={employeeHistoryFilter === 'Absent'}
                  />
                </div>
                <div className="card data-table-card shadow-sm">
                    <div className="card-header"><h6 className="mb-0">Filtered Attendance History</h6></div>
                    <div className="table-responsive" style={{maxHeight: '40vh'}}>
                        <table className="table data-table mb-0">
                            <thead><tr><th>Date</th><th>Start Time</th><th>End Time</th><th>Time In</th><th>Time Out</th><th>Status</th></tr></thead>
                            <tbody>
                                {records.length > 0 ? records.map(rec => (
                                    <tr key={rec.scheduleId || rec.date}>
                                        <td>{rec.date}</td><td>{rec.start_time || 'N/A'}</td><td>{rec.end_time || 'N/A'}</td><td>{rec.signIn || '---'}</td><td>{rec.signOut || '---'}</td>
                                        <td><span className={`status-badge status-${rec.status.toLowerCase().replace(' ', '-')}`}>{rec.status}</span></td>
                                    </tr>
                                )) : (
                                  <tr><td colSpan="6" className="text-center p-4 text-muted">No attendance history found for the selected filters.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="input-group mb-4" style={{maxWidth: '500px'}}>
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input type="text" className="form-control" placeholder="Search by employee name or ID..." value={employeeSearchTerm} onChange={e => setEmployeeSearchTerm(e.target.value)} />
            </div>
            <div className="employee-selection-grid">
                {filteredEmployeesForSelection.map(emp => (
                    <div key={emp.id} className="employee-selection-card" onClick={() => handleSelectEmployee(emp)}>
                        <Avatar src={emp.imageUrl} alt={emp.name} size="md" className="employee-selection-avatar" />
                        <div className="employee-selection-info">
                            <div className="employee-selection-name">{emp.name}</div>
                            <div className="employee-selection-id text-muted">{emp.id}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  }
  
  return (
    <div className="container-fluid p-0 page-module-container">
      <header className="page-header attendance-page-header d-flex justify-content-between align-items-md-center p-3">
        <h1 className="page-main-title m-0">Attendance Management</h1>
        <div className="d-flex align-items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleImport} className="d-none" accept=".xlsx, .xls, .csv" />
            <button className="btn btn-outline-secondary" onClick={handleImportClick}><i className="bi bi-upload me-2"></i>Import</button>
            <button className="btn btn-outline-secondary" onClick={handleExport} disabled={activeView !== 'daily' || !sortedAndFilteredList || sortedAndFilteredList.length === 0}><i className="bi bi-download me-2"></i>Export</button>
            <button className="btn btn-outline-secondary" onClick={handleGenerateReport} disabled={activeView !== 'daily' || !sortedAndFilteredList || sortedAndFilteredList.length === 0}>
                <i className="bi bi-file-earmark-text-fill me-2"></i>Generate Report
            </button>
            <div className="attendance-view-controls">
                <button className={`btn ${activeView === 'daily' ? 'active' : ''}`} onClick={() => { setActiveView('daily'); setCurrentDate(new Date().toISOString().split('T')[0]); }}>
                    <i className="bi bi-calendar-day me-2"></i>Daily
                </button>
                <button className={`btn ${activeView.startsWith('history') ? 'active' : ''}`} onClick={() => setActiveView('historyList')}>
                    <i className="bi bi-clock-history me-2"></i>History
                </button>
                <button className={`btn ${activeView === 'employee' ? 'active' : ''}`} onClick={() => { setActiveView('employee'); setSelectedEmployee(null); }}>
                    <i className="bi bi-person-lines-fill me-2"></i>By Employee
                </button>
            </div>
        </div>
      </header>
      
      <div className="attendance-page-content p-3">
        {activeView === 'employee' && renderEmployeeView()}
        {(activeView === 'daily' || activeView === 'historyDetail') && (
          <>
            <div className="daily-view-header-bar">
              <div className="date-picker-group">
                {activeView === 'historyDetail' ? (
                  <button className="btn btn-outline-secondary" onClick={() => setActiveView('historyList')}>
                    <i className="bi bi-arrow-left"></i> Back to History
                  </button>
                ) : (
                  <div>
                    <label htmlFor="daily-date-picker" className="date-label">VIEWING DATE</label>
                    <input id="daily-date-picker" type="date" className="form-control" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} />
                  </div>
                )}
              </div>
              <div className="daily-stats-charts">
                  <div className={`stat-card ${!statusFilter ? 'active' : ''}`} onClick={() => handleStatusFilterClick('')}>
                    <span className="stat-value">{dailyStats.total}</span>
                    <span className="stat-label">Scheduled</span>
                  </div>
                  <StatDonutChart 
                    label={`Present (${dailyStats.present}/${dailyStats.total})`} 
                    percentage={dailyStats.presentPercentage} 
                    color="var(--app-success-color)"
                    onClick={() => handleStatusFilterClick('Present')}
                    isActive={statusFilter === 'Present'}
                  />
                  <StatDonutChart 
                    label={`Late (${dailyStats.late}/${dailyStats.total})`} 
                    percentage={dailyStats.latePercentage} 
                    color="var(--warning-color)"
                    onClick={() => handleStatusFilterClick('Late')}
                    isActive={statusFilter === 'Late'}
                  />
                  <StatDonutChart 
                    label={`Absent (${dailyStats.absent}/${dailyStats.total})`} 
                    percentage={dailyStats.absentPercentage} 
                    color="var(--danger-color)"
                    onClick={() => handleStatusFilterClick('Absent')}
                    isActive={statusFilter === 'Absent'}
                  />
              </div>
              <div className="filters-group"> <select className="form-select" value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}> {uniquePositions.map(pos => <option key={pos} value={pos === 'All Positions' ? '' : pos}>{pos}</option>)} </select> </div>
            </div>
            {sortedAndFilteredList.length > 0 ? (
                <div className="card data-table-card shadow-sm"><div className="card-body p-0"><div className="table-responsive">
                    <table className="table data-table mb-0">
                      <thead><tr>
                          <th className="sortable" onClick={() => handleRequestSort('id')}>ID {getSortIcon('id')}</th>
                          <th className="sortable" onClick={() => handleRequestSort('name')}>Employee Name {getSortIcon('name')}</th>
                          <th>Position</th>
                          <th className="sortable" onClick={() => handleRequestSort('signIn')}>Time In {getSortIcon('signIn')}</th>
                          <th className="sortable" onClick={() => handleRequestSort('breakOut')}>Break Out {getSortIcon('breakOut')}</th>
                          <th className="sortable" onClick={() => handleRequestSort('breakIn')}>Break In {getSortIcon('breakIn')}</th>
                          <th className="sortable" onClick={() => handleRequestSort('signOut')}>Time Out {getSortIcon('signOut')}</th>
                          <th className="sortable" onClick={() => handleRequestSort('workingHours')}>Hours {getSortIcon('workingHours')}</th>
                          <th className="sortable" onClick={() => handleRequestSort('overtime_hours')}>OT (hrs) {getSortIcon('overtime_hours')}</th>
                          <th>Status</th><th>Actions</th>
                      </tr></thead>
                      <tbody>{sortedAndFilteredList.map((emp) => (
                          <tr key={emp.scheduleId}>
                              <td>{emp.id}</td><td>{emp.name}</td><td>{emp.position}</td>
                              <td>{emp.signIn || '---'}</td><td>{emp.breakOut || '---'}</td><td>{emp.breakIn || '---'}</td><td>{emp.signOut || '---'}</td><td>{emp.workingHours}</td>
                              <td>{emp.overtime_hours || '0'}</td>
                              <td><span className={`status-badge status-${emp.status.toLowerCase()}`}>{emp.status}</span></td>
                              <td>
                              <div className="dropdown">
                                  <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">Actions</button>
                                  <ul className="dropdown-menu dropdown-menu-end">
                                      <li>
                                        <a 
                                          className="dropdown-item" 
                                          href="#" 
                                          onClick={(e) => {e.preventDefault(); handleOpenEditModal(emp)}}
                                        >
                                          <i className="bi bi-pencil-fill me-2"></i>Edit / Log Times
                                        </a>
                                      </li>
                                  </ul>
                              </div>
                              </td>
                          </tr>
                      ))}</tbody>
                  </table>
                </div></div></div>
            ) : (
              <div className="text-center p-5 bg-light rounded d-flex flex-column justify-content-center" style={{minHeight: '300px'}}>
                  <i className="bi bi-calendar-check fs-1 text-muted mb-3 d-block"></i>
                  <h4 className="text-muted">{dailyAttendanceList.length > 0 && (positionFilter || statusFilter) ? 'No employees match filters.' : `No Employees Scheduled`}</h4>
                  <p className="text-muted">{dailyAttendanceList.length > 0 && (positionFilter || statusFilter) ? 'Try adjusting your filters.' : 'There is no schedule created for this day.'}</p>
              </div>
            )}
          </>
        )}
        {activeView === 'historyList' && (
          <>
            <h4 className="mb-3">Attendance History</h4>
            {attendanceHistory.length > 0 ? (
              <div className="attendance-history-grid">
                {attendanceHistory.map(day => {
                    const totalPresent = day.present;
                    const presentPercent = day.total > 0 ? (totalPresent / day.total) * 100 : 0;
                    const latePercent = day.total > 0 ? (day.late / day.total) * 100 : 0;
                    const absentPercent = day.total > 0 ? (day.absent / day.total) * 100 : 0;

                    return (
                      <div key={day.date} className="attendance-history-card" onClick={() => handleViewHistoryDetail(day.date)}>
                        <div className="card-header">
                            <h5 className="card-title">{new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h5>
                            <button className="btn btn-sm btn-outline-danger delete-history-btn" onClick={(e) => handleOpenDeleteConfirm(e, day.date)} title="Delete this day's records">
                                <i className="bi bi-trash-fill"></i>
                            </button>
                        </div>
                        <div className="card-body">
                          <div className="history-card-charts">
                            <StatDonutChart size={80} strokeWidth={8} label={`Present (${totalPresent}/${day.total})`} percentage={presentPercent} color="var(--app-success-color)" />
                            <StatDonutChart size={80} strokeWidth={8} label={`Late (${day.late}/${day.total})`} percentage={latePercent} color="var(--warning-color)" />
                            <StatDonutChart size={80} strokeWidth={8} label={`Absent (${day.absent}/${day.total})`} percentage={absentPercent} color="var(--danger-color)" />
                          </div>
                        </div>
                      </div>
                    )
                })}
              </div>
            ) : <p className="text-muted">No historical attendance data found.</p>}
          </>
        )}
      </div>

      {(isLoading || pdfDataUri) && (
        <ReportPreviewModal 
            show={showReportPreview} 
            onClose={handleCloseReportPreview} 
            pdfDataUri={pdfDataUri} 
            reportTitle={`Daily Attendance - ${currentDate}`} 
        />
      )}

      {showEditModal && ( <EditAttendanceModal show={showEditModal} onClose={handleCloseEditModal} onSave={handleSaveEditedTime} attendanceRecord={editingAttendanceRecord}/> )}
      
      <ConfirmationModal
        show={!!dateToDelete}
        onClose={() => setDateToDelete(null)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        confirmText="Yes, Delete All"
        confirmVariant="danger"
      >
        <p>Are you sure you want to delete all schedules and attendance logs for <strong>{dateToDelete}</strong>?</p>
        <p className="text-danger">This action cannot be undone and will affect all employees scheduled on this day.</p>
      </ConfirmationModal>
    </div>
  );
};

export default AttendancePage;