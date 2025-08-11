import React, { useState, useMemo, useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './AttendancePage.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ReportPreviewModal from '../../modals/ReportPreviewModal';
import EditAttendanceModal from '../../modals/EditAttendanceModal';
import logo from '../../../assets/logo.png';
import placeholderAvatar from '../../../assets/placeholder-profile.jpg';

const AttendancePage = ({ allSchedules, employees, positions, attendanceLogs, setAttendanceLogs }) => {
  const [activeView, setActiveView] = useState('daily');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [positionFilter, setPositionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');

  const [showReportModal, setShowReportModal] = useState(false);
  const [pdfDataUri, setPdfDataUri] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAttendanceRecord, setEditingAttendanceRecord] = useState(null);
  
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
          const shiftStartTime = schedule.shift ? schedule.shift.split(' - ')[0] : '00:00';
          status = attendance.signIn > shiftStartTime ? "Late" : "Present";
      }
      return {
        ...employeeDetails, scheduleId: schedule.scheduleId, position: positionTitle, shift: schedule.shift,
        signIn: attendance.signIn || null, breakOut: attendance.breakOut || null, breakIn: attendance.breakIn || null, signOut: attendance.signOut || null,
        workingHours: '0h 0m', status: status,
      };
    }).filter(Boolean);
  }, [currentDate, allSchedules, employees, positions, attendanceLogs]);

  const sortedAndFilteredList = useMemo(() => {
    let list = [...dailyAttendanceList];
    if (positionFilter) list = list.filter(item => item.position === positionFilter);
    if (statusFilter) list = list.filter(item => item.status === statusFilter);
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
          const shiftStartTime = schedule.shift ? schedule.shift.split(' - ')[0] : '00:00';
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
      
      const records = allSchedules
          .filter(s => s.empId === selectedEmployee.id)
          .map(schedule => {
              const log = (attendanceLogs || []).find(l => l.empId === schedule.empId && l.date === schedule.date);
              const scheduleDate = new Date(schedule.date);
              scheduleDate.setHours(0, 0, 0, 0);

              let status = "Scheduled";
              if (log && log.signIn) {
                  const shiftStartTime = schedule.shift ? schedule.shift.split(' - ')[0] : '00:00';
                  status = log.signIn > shiftStartTime ? "Late" : "Present";
              } else if (scheduleDate < today) {
                  status = "Absent";
              }
              return { ...schedule, ...log, status };
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      const stats = records.reduce((acc, rec) => {
          acc.totalScheduled++;
          if (rec.status === 'Late') acc.totalLate++;
          if (rec.status === 'Absent') acc.totalAbsent++;
          return acc;
      }, { totalScheduled: 0, totalLate: 0, totalAbsent: 0 });

      return { records, stats };
  }, [selectedEmployee, allSchedules, attendanceLogs]);
  
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
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const reportDate = new Date(currentDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.addImage(logo, 'PNG', 40, 20, 80, 26);
    doc.setFontSize(18); doc.setFont(undefined, 'bold');
    doc.text('Daily Attendance Report', pageWidth - 40, 40, { align: 'right' });
    doc.setFontSize(11); doc.setFont(undefined, 'normal');
    doc.text(`Date: ${reportDate}`, pageWidth - 40, 55, { align: 'right' });
    
    const totalScheduled = dailyAttendanceList.length;
    const presentCount = dailyAttendanceList.filter(e => e.status === 'Present').length;
    const lateCount = dailyAttendanceList.filter(e => e.status === 'Late').length;
    const absentCount = dailyAttendanceList.filter(e => e.status === 'Absent').length;
    
    let summaryY = 80;
    doc.setFontSize(12); doc.setFont(undefined, 'bold');
    doc.text('Summary', 40, summaryY);
    summaryY += 18;
    doc.setFontSize(10); doc.setFont(undefined, 'normal');
    doc.text(`- Total Scheduled: ${totalScheduled}`, 50, summaryY);
    doc.text(`- Present: ${presentCount}`, 200, summaryY);
    doc.text(`- Late: ${lateCount}`, 350, summaryY);
    doc.text(`- Absent: ${absentCount}`, 500, summaryY);
    summaryY += 25;
    
    const tableColumns = ["ID", "Name", "Position", "Shift", "Sign In", "Break Out", "Break In", "Sign Out", "Status"];
    const tableRows = sortedAndFilteredList.map(emp => [
      emp.id, emp.name, emp.position, emp.shift || '---', emp.signIn || '---',
      emp.breakOut || '---', emp.breakIn || '---', emp.signOut || '---', emp.status,
    ]);
    autoTable(doc, {
      head: [tableColumns], body: tableRows, startY: summaryY, theme: 'grid',
      headStyles: { fillColor: [25, 135, 84], fontSize: 9 }, bodyStyles: { fontSize: 8 },
      didDrawPage: (data) => {
        doc.setFontSize(9);
        doc.text('Page ' + doc.internal.getNumberOfPages(), data.settings.margin.left, pageHeight - 10);
      }
    });

    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    setPdfDataUri(url);
    setShowReportModal(true);
  };
  const handleOpenEditModal = (employeeData) => {
    const record = {
      id: employeeData.id,
      name: employeeData.name,
      schedule: { date: currentDate, shift: employeeData.shift },
      signIn: employeeData.signIn,
      signOut: employeeData.signOut,
      breakIn: employeeData.breakIn,
      breakOut: employeeData.breakOut,
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
      'Employee ID': emp.id, 'Name': emp.name, 'Position': emp.position, 'Shift': emp.shift,
      'Sign In': emp.signIn || '', 'Break Out': emp.breakOut || '', 'Break In': emp.breakIn || '',
      'Sign Out': emp.signOut || '', 'Status': emp.status,
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
              signIn: row['Sign In'] || null, signOut: row['Sign Out'] || null,
              breakIn: row['Break In'] || null, breakOut: row['Break Out'] || null,
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
  
  const uniquePositions = useMemo(() => ['All Positions', ...new Set(dailyAttendanceList.map(item => item.position))], [dailyAttendanceList]);
  
  const renderEmployeeView = () => {
    const positionMap = new Map(positions.map(pos => [pos.id, pos.title]));
    
    if (selectedEmployee) {
        return (
            <div>
                <button className="btn btn-light me-3 back-button mb-3" onClick={() => setSelectedEmployee(null)}>
                    <i className="bi bi-arrow-left"></i> Back to Employee List
                </button>
                <div className="employee-detail-header">
                    <img src={selectedEmployee.imageUrl || placeholderAvatar} alt={selectedEmployee.name} className="employee-detail-avatar" />
                    <div>
                        <h2 className="employee-detail-name">{selectedEmployee.name}</h2>
                        <p className="employee-detail-meta">{selectedEmployee.id} • {positionMap.get(selectedEmployee.positionId) || 'Unassigned'}</p>
                    </div>
                </div>
                <div className="employee-attendance-stats my-4">
                    <div className="stat-card scheduled"> <span className="stat-value">{selectedEmployeeRecords.stats.totalScheduled}</span> <span className="stat-label">Total Scheduled</span> </div>
                    <div className="stat-card present"> <span className="stat-value">{selectedEmployeeRecords.stats.totalScheduled - selectedEmployeeRecords.stats.totalAbsent}</span> <span className="stat-label">Days Present</span> </div>
                    <div className="stat-card late"> <span className="stat-value">{selectedEmployeeRecords.stats.totalLate}</span> <span className="stat-label">Total Lates</span> </div>
                    <div className="stat-card absent"> <span className="stat-value">{selectedEmployeeRecords.stats.totalAbsent}</span> <span className="stat-label">Total Absences</span> </div>
                </div>
                <div className="card data-table-card shadow-sm">
                    <div className="table-responsive">
                        <table className="table data-table mb-0">
                            <thead><tr><th>Date</th><th>Schedule</th><th>Sign In</th><th>Sign Out</th><th>Status</th></tr></thead>
                            <tbody>
                                {selectedEmployeeRecords.records.map(rec => (
                                    <tr key={rec.scheduleId || rec.date}>
                                        <td>{rec.date}</td><td>{rec.shift}</td><td>{rec.signIn || '---'}</td><td>{rec.signOut || '---'}</td>
                                        <td><span className={`status-badge status-${rec.status.toLowerCase()}`}>{rec.status}</span></td>
                                    </tr>
                                ))}
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
                    <div key={emp.id} className="employee-selection-card" onClick={() => setSelectedEmployee(emp)}>
                        <img src={emp.imageUrl || placeholderAvatar} alt={emp.name} className="employee-selection-avatar" />
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
              <div className="stat-cards-group">
                <div className={`stat-card scheduled ${!statusFilter ? 'active' : ''}`} onClick={() => handleStatusFilterClick('')}> <span className="stat-value">{dailyAttendanceList.length}</span> <span className="stat-label">Scheduled</span> </div>
                <div className={`stat-card present ${statusFilter === 'Present' ? 'active' : ''}`} onClick={() => handleStatusFilterClick('Present')}> <span className="stat-value">{dailyAttendanceList.filter(e => e.status === 'Present').length}</span> <span className="stat-label">Present</span> </div>
                <div className={`stat-card late ${statusFilter === 'Late' ? 'active' : ''}`} onClick={() => handleStatusFilterClick('Late')}> <span className="stat-value">{dailyAttendanceList.filter(e => e.status === 'Late').length}</span> <span className="stat-label">Late</span> </div>
                <div className={`stat-card absent ${statusFilter === 'Absent' ? 'active' : ''}`} onClick={() => handleStatusFilterClick('Absent')}> <span className="stat-value">{dailyAttendanceList.filter(e => e.status === 'Absent').length}</span> <span className="stat-label">Absent</span> </div>
              </div>
              <div className="filters-group"> <select className="form-select" value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}> {uniquePositions.map(pos => <option key={pos} value={pos === 'All Positions' ? '' : pos}>{pos}</option>)} </select> </div>
            </div>
            {sortedAndFilteredList.length > 0 ? (
                <div className="card data-table-card shadow-sm"><div className="table-responsive">
                  <table className="table data-table mb-0">
                      <thead><tr>
                          <th className="sortable" onClick={() => handleRequestSort('id')}>ID {getSortIcon('id')}</th>
                          <th className="sortable" onClick={() => handleRequestSort('name')}>Employee Name {getSortIcon('name')}</th>
                          <th>Position</th><th className="sortable" onClick={() => handleRequestSort('shift')}>Shift {getSortIcon('shift')}</th>
                          <th className="sortable" onClick={() => handleRequestSort('signIn')}>Sign In {getSortIcon('signIn')}</th>
                          <th className="sortable" onClick={() => handleRequestSort('breakOut')}>Break Out {getSortIcon('breakOut')}</th>
                          <th className="sortable" onClick={() => handleRequestSort('breakIn')}>Break In {getSortIcon('breakIn')}</th>
                          <th className="sortable" onClick={() => handleRequestSort('signOut')}>Sign Out {getSortIcon('signOut')}</th>
                          <th className="sortable" onClick={() => handleRequestSort('workingHours')}>Hours {getSortIcon('workingHours')}</th>
                          <th>Status</th><th>Actions</th>
                      </tr></thead>
                      <tbody>{sortedAndFilteredList.map((emp) => (
                          <tr key={emp.scheduleId}>
                              <td>{emp.id}</td><td>{emp.name}</td><td>{emp.position}</td><td>{emp.shift}</td>
                              <td>{emp.signIn || '---'}</td><td>{emp.breakOut || '---'}</td><td>{emp.breakIn || '---'}</td><td>{emp.signOut || '---'}</td><td>{emp.workingHours}</td>
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
                </div></div>
            ) : (
              <div className="text-center p-5 bg-light rounded d-flex flex-column justify-content-center" style={{minHeight: '300px'}}>
                  <i className="bi bi-calendar-check fs-1 text-muted mb-3 d-block"></i>
                  <h4 className="text-muted">{dailyAttendanceList.length > 0 && (positionFilter || statusFilter) ? 'No employees match filters.' : 'No Employees Scheduled'}</h4>
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
                {attendanceHistory.map(day => (
                  <div key={day.date} className="attendance-history-card" onClick={() => handleViewHistoryDetail(day.date)}>
                    <div className="card-header"><h5 className="card-title">{new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h5></div>
                    <div className="card-body"><div className="info-grid">
                        <div className="info-item scheduled"><span className="value">{day.total}</span><span className="label">Scheduled</span></div>
                        <div className="info-item present"><span className="value">{day.present - day.late}</span><span className="label">Present</span></div>
                        <div className="info-item late"><span className="value">{day.late}</span><span className="label">Late</span></div>
                        <div className="info-item absent"><span className="value">{day.absent}</span><span className="label">Absent</span></div>
                    </div></div>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted">No historical attendance data found.</p>}
          </>
        )}
      </div>
      <ReportPreviewModal show={showReportModal} onClose={() => setShowReportModal(false)} pdfDataUri={pdfDataUri} reportTitle={`Daily_Attendance_Report_${currentDate}`} />
      {showEditModal && ( <EditAttendanceModal show={showEditModal} onClose={handleCloseEditModal} onSave={handleSaveEditedTime} attendanceRecord={editingAttendanceRecord}/> )}
    </div>
  );
};

export default AttendancePage;