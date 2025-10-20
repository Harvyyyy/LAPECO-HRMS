import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

import Login from './components/Authentication/Login';
import Layout from './components/layout/Layout';

// Page Components
import Dashboard from './components/pages/Dashboard/Dashboard';
import EmployeeDataPage from './components/pages/Employee-Data/EmployeeDataPage';
import PositionsPage from './components/pages/Positions/PositionsPage';
import LeaveManagementPage from './components/pages/Leave-Management/LeaveManagementPage';
import MyLeavePage from './components/pages/My-Leave/MyLeavePage';
import ScheduleManagementPage from './components/pages/Schedule-Management/ScheduleManagementPage';
import ScheduleBuilderPage from './components/pages/Schedule-Management/ScheduleBuilderPage';
import HolidayManagementPage from './components/pages/Holiday-Management/HolidayManagementPage';
import TrainingPage from './components/pages/Training-And-Development/TrainingPage';
import ProgramDetailPage from './components/pages/Training-And-Development/ProgramDetailPage';
import RecruitmentPage from './components/pages/Recruitment/RecruitmentPage';
import ReportsPage from './components/pages/Reports/ReportsPage';
import PerformanceManagementPage from './components/pages/Performance-Management/PerformanceManagementPage';
import EvaluationFormPage from './components/pages/Performance-Management/EvaluationFormPage';
import MyTeamPage from './components/pages/My-Team/MyTeamPage';
import MyAttendancePage from './components/pages/My-Attendance/MyAttendancePage';
import AttendancePage from './components/pages/Attendance-Management/AttendancePage';
import PayrollPage from './components/pages/Payroll-Management/PayrollPage';
import PayrollGenerationPage from './components/pages/Payroll-Management/PayrollGenerationPage';
import PayrollHistoryPage from './components/pages/Payroll-Management/PayrollHistoryPage';
import ThirteenthMonthPage from './components/pages/Payroll-Management/ThirteenthMonthPage';
import MyPayrollLayout from './components/pages/My-Payroll/MyPayrollLayout';
import MyPayrollProjectionPage from './components/pages/My-Payroll/MyPayrollProjectionPage';
import MyPayrollHistoryPage from './components/pages/My-Payroll/MyPayrollHistoryPage';
import EvaluateTeamPage from './components/pages/Performance-Management/EvaluateTeamPage';
import EvaluateLeaderPage from './components/pages/Performance-Management/EvaluateLeaderPage';
import CaseManagementPage from './components/pages/Case-Management/CaseManagementPage';
import AccountsPage from './components/pages/Accounts/AccountsPage';
import MyProfilePage from './components/pages/My-Profile/MyProfilePage';
import AccountSettingsPage from './components/pages/Account-Settings/AccountSettingsPage';
import ContributionsManagementPage from './components/pages/Contributions-Management/ContributionsManagementPage';
import NotFoundPage from './components/pages/NotFound/NotFoundPage';
import PredictiveAnalyticsPage from './components/pages/Predictive-Analytics/PredictiveAnalyticsPage';
import LeaderboardsPage from './components/pages/Leaderboards/LeaderboardsPage';
import MyResignationPage from './components/pages/My-Resignation/MyResignationPage';
import ResignationManagementPage from './components/pages/Resignation-Management/ResignationManagementPage';
import MyCasesPage from './components/pages/My-Cases/MyCasesPage';
import SubmitReportPage from './components/pages/Submit-Report/SubmitReportPage';

// Constants & Assets
import { USER_ROLES } from './constants/roles';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import all mock data from centralized file
import * as mockData from './data/mockData';
import { doDateRangesOverlap } from './utils/dateUtils';

// Add evaluationDate to mock data
const initialEvaluationsData = mockData.initialEvaluationsData.map((ev, index) => {
    const periodEndDate = new Date(ev.periodEnd);
    const evaluationDate = new Date(periodEndDate.setDate(periodEndDate.getDate() + (index % 2 === 0 ? 5 : 8)));
    return {
        ...ev,
        evaluationDate: evaluationDate.toISOString().split('T')[0],
    };
});


const parseFullName = (fullName = '') => {
    const parts = fullName.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return { firstName: '', middleName: '', lastName: '' };
    if (parts.length === 1) return { firstName: parts[0], middleName: '', lastName: '' };
    
    const lastName = parts.pop();
    const firstName = parts.shift();
    const middleName = parts.join(' ');
    return { firstName, middleName, lastName };
};

function AppContent() {
  const [currentUserId, setCurrentUserId] = useState(() => localStorage.getItem('currentUserId') || null);
  const navigate = useNavigate();

  const [employees, setEmployees] = useState(mockData.initialEmployeesData);
  const [positions, setPositions] = useState(mockData.initialPositionsData);
  const [schedules, setSchedules] = useState(mockData.initialSchedulesData);
  const [templates, setTemplates] = useState(mockData.initialTemplatesData);
  const [leaveRequests, setLeaveRequests] = useState(mockData.initialLeaveRequests);
  const [holidays, setHolidays] = useState(mockData.initialHolidaysData);
  const [trainingPrograms, setTrainingPrograms] = useState(mockData.initialTrainingPrograms);
  const [enrollments, setEnrollments] = useState(mockData.initialEnrollments);
  const [jobOpenings, setJobOpenings] = useState(mockData.initialJobOpenings);
  const [applicants, setApplicants] = useState(mockData.initialApplicants);
  const [kras, setKras] = useState(mockData.initialKrasData);
  const [kpis, setKpis] = useState(mockData.initialKpisData);
  const [evaluationFactors, setEvaluationFactors] = useState(mockData.initialEvaluationFactors);
  const [evaluations, setEvaluations] = useState(initialEvaluationsData);
  const [notifications, setNotifications] = useState(mockData.initialNotificationsData);
  const [attendanceLogs, setAttendanceLogs] = useState(mockData.initialAttendanceLogs);
  const [payrolls, setPayrolls] = useState(mockData.initialPayrollsData);
  const [disciplinaryCases, setDisciplinaryCases] = useState(mockData.initialCasesData);
  const [userAccounts, setUserAccounts] = useState(mockData.initialUserAccounts);
  const [caseSubmissions, setCaseSubmissions] = useState(mockData.initialCaseSubmissions);
  const [resignations, setResignations] = useState(mockData.initialResignationsData);
  const [terminations, setTerminations] = useState(mockData.initialTerminationData);
  const [theme, setTheme] = useState('light');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const [evaluationPeriods, setEvaluationPeriods] = useState(mockData.initialEvaluationPeriods);

  const activeEvaluationPeriod = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
    return evaluationPeriods.find(period => {
        const start = new Date(period.activationStart);
        const end = new Date(period.activationEnd);
        return today >= start && today <= end;
    }) || null;
  }, [evaluationPeriods]);

  useEffect(() => {
    const todayISO = new Date().toISOString().split('T')[0];
    const employeeIdsToOffboard = new Set(
        resignations
            .filter(r => r.status === 'Approved' && r.effectiveDate <= todayISO)
            .map(r => r.employeeId)
    );
    if (employeeIdsToOffboard.size === 0) { return; }
    let needsUpdate = false;
    const updatedEmployees = employees.map(emp => {
        if (employeeIdsToOffboard.has(emp.id) && emp.status !== 'Resigned') {
            needsUpdate = true;
            return { ...emp, status: 'Resigned' };
        }
        return emp;
    });
    if (needsUpdate) {
        setEmployees(updatedEmployees);
        console.log(`Automatically offboarded ${Array.from(employeeIdsToOffboard).join(', ')}.`);
    }
  }, [resignations, employees]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };
  const clearToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };
  
  const handleLogout = () => {
    setCurrentUserId(null);
    localStorage.removeItem('currentUserId');
    navigate('/login');
  };

  const appLevelHandlers = {
    saveEvaluationPeriod: (formData, periodId) => {
        const otherPeriods = evaluationPeriods.filter(p => p.id !== periodId);
        const hasOverlap = otherPeriods.some(p => 
            doDateRangesOverlap(
                p.activationStart, p.activationEnd,
                formData.activationStart, formData.activationEnd
            )
        );

        if (hasOverlap) {
            showToast('Error: The activation window overlaps with an existing period. Please choose different dates.', 'error');
            return false;
        }

        if (periodId) {
            setEvaluationPeriods(prev => prev.map(p => p.id === periodId ? { ...p, ...formData } : p));
            showToast('Evaluation period updated successfully.');
        } else {
            const newPeriod = { id: Date.now(), ...formData };
            setEvaluationPeriods(prev => [...prev, newPeriod]);
            showToast('New evaluation period created.', 'success');
        }
        return true;
    },
    deleteEvaluationPeriod: (periodId) => {
        setEvaluationPeriods(prev => prev.filter(p => p.id !== periodId));
        showToast('Evaluation period deleted.', 'info');
    },
    savePosition: (formData, positionId) => {
        if (positionId) {
            setPositions(prev => prev.map(pos => pos.id === positionId ? { ...pos, ...formData } : pos));
        } else {
            const newPosition = { id: Date.now(), ...formData };
            setPositions(prev => [...prev, newPosition]);
        }
    },
    saveEmployee: (formData, existingEmployeeId) => {
      const fullName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ');
      const updatedFormData = { ...formData, name: fullName };
      if (existingEmployeeId) {
        setEmployees(prev => prev.map(emp => emp.id === existingEmployeeId ? { ...emp, ...updatedFormData } : emp));
        showToast('Employee details have been updated successfully.');
      } else {
        const newEmployee = { id: `EMP${Date.now().toString().slice(-4)}`, isTeamLeader: false, status: 'Active', ...updatedFormData };
        setEmployees(prev => [newEmployee, ...prev]);
        showToast('New employee has been added successfully.', 'success');
        return newEmployee;
      }
    },
    deleteEmployee: (employeeId) => { setEmployees(prev => prev.filter(emp => emp.id !== employeeId)); },
    deletePosition: (positionId) => {
      setPositions(prev => prev.filter(pos => pos.id !== positionId));
      setEmployees(prev => prev.map(emp => emp.positionId === positionId ? { ...emp, positionId: null } : emp));
    },
    assignEmployeeToPosition: (employeeId, positionId) => { setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, positionId: positionId } : emp)); },
    toggleTeamLeaderStatus: (employeeId) => { setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, isTeamLeader: !emp.isTeamLeader } : emp)); },
    createSchedules: (newScheduleEntries) => {
      const newlyCreatedSchedules = newScheduleEntries.map(entry => ({ ...entry, scheduleId: Date.now() + Math.random() }));
      setSchedules(prev => [...prev, ...newlyCreatedSchedules]);
      return true;
    },
    updateSchedule: (dateToUpdate, updatedEntries) => {
      const schedulesForOtherDays = schedules.filter(s => s.date !== dateToUpdate);
      const newSchedulesForDate = updatedEntries.map(entry => ({ ...entry, scheduleId: Date.now() + Math.random() }));
      setSchedules([...schedulesForOtherDays, ...newSchedulesForDate]);
    },
    deleteSchedule: (dateToDelete) => { setSchedules(prev => prev.filter(s => s.date !== dateToDelete)); },
    deleteAttendanceForDate: (dateToDelete) => {
        setSchedules(prev => prev.filter(s => s.date !== dateToDelete));
        setAttendanceLogs(prev => prev.filter(log => log.date !== dateToDelete));
    },
    createTemplate: (templateData, templateId) => {
      if (templateId) {
        setTemplates(prev => prev.map(t => t.id === templateId ? { ...t, ...templateData } : t));
      } else {
        const newTemplate = { id: `TPL${Date.now()}`, ...templateData };
        setTemplates(prev => [newTemplate, ...prev]);
      }
    },
    deleteTemplate: (templateId) => { setTemplates(prev => prev.filter(t => t.id !== templateId)); },
    updateLeaveRequest: (updatedLeaveData) => {
        const updatedRequest = { ...updatedLeaveData };
        if (updatedLeaveData.supportingDocument) {
            updatedRequest.documentName = updatedLeaveData.supportingDocument.name;
        }
        delete updatedRequest.supportingDocument;
        delete updatedRequest.medicalDocument;
        delete updatedRequest.soloParentDocument;
        delete updatedRequest.marriageCert;
        delete updatedRequest.birthCert;

        setLeaveRequests(prev => prev.map(req => 
            req.leaveId === updatedRequest.leaveId ? { ...req, ...updatedRequest } : req
        ));
        showToast("Leave request has been updated successfully.");
    },
    createLeaveRequest: (leaveData) => {
        const newRequest = { 
            ...leaveData, 
            leaveId: `LVE${Date.now().toString().slice(-4)}`, 
            status: 'Pending',
            documentName: leaveData.supportingDocument?.name || null 
        };
        delete newRequest.supportingDocument; 
        setLeaveRequests(prev => [newRequest, ...prev]);
    },
    updateLeaveStatus: (leaveId, newStatus) => { setLeaveRequests(prev => prev.map(req => req.leaveId === leaveId ? { ...req, status: newStatus } : req)); },
    deleteLeaveRequest: (leaveId) => { setLeaveRequests(prev => prev.filter(req => req.leaveId !== leaveId)); },
    requestMaternityExtension: (leaveId) => {
        setLeaveRequests(prev => prev.map(req => req.leaveId === leaveId ? { ...req, extensionStatus: 'Pending' } : req));
        showToast("Maternity leave extension has been requested successfully.");
    },
    updateMaternityExtensionStatus: (leaveId, newStatus) => {
        setLeaveRequests(prev => prev.map(req => {
            if (req.leaveId === leaveId) {
                if (newStatus === 'Approved') {
                    const originalEndDate = new Date(req.dateTo + 'T00:00:00');
                    originalEndDate.setDate(originalEndDate.getDate() + 30);
                    const newEndDate = originalEndDate.toISOString().split('T')[0];
                    return { ...req, extensionStatus: 'Approved', dateTo: newEndDate, days: req.days + 30 };
                }
                return { ...req, extensionStatus: newStatus };
            }
            return req;
        }));
        showToast(`Maternity leave extension has been ${newStatus.toLowerCase()}.`);
    },
    updateMaternityDetails: (leaveId, updatedDetails, newDays, newEndDate) => {
        setLeaveRequests(prev => prev.map(req => req.leaveId === leaveId ? { ...req, maternityDetails: updatedDetails, days: newDays, dateTo: newEndDate } : req));
        showToast("Maternity leave details have been updated successfully.");
    },
    updatePaternityDetails: (leaveId, updatedDetails) => {
        setLeaveRequests(prev => prev.map(req => req.leaveId === leaveId ? { ...req, paternityDetails: updatedDetails } : req));
        showToast("Paternity leave details have been updated successfully.");
    },
    updateLeaveCredits: (employeeId, newCredits) => {
      setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, leaveCredits: { ...emp.leaveCredits, ...newCredits } } : emp));
    },
    bulkAddLeaveCredits: (creditsToAdd) => {
        let updatedCount = 0;
        setEmployees(prev =>
            prev.map(emp => {
                if (emp.status === 'Active') {
                    updatedCount++;
                    const currentCredits = emp.leaveCredits || { vacation: 0, sick: 0, personal: 0, paternity: 0 };
                    const newCredits = {
                        vacation: (currentCredits.vacation || 0) + (creditsToAdd.vacation || 0),
                        sick: (currentCredits.sick || 0) + (creditsToAdd.sick || 0),
                        personal: (currentCredits.personal || 0) + (creditsToAdd.personal || 0),
                    };
                    if (emp.gender === 'Male' && creditsToAdd.paternity > 0) {
                        newCredits.paternity = (currentCredits.paternity || 0) + creditsToAdd.paternity;
                    }
                    return { ...emp, leaveCredits: { ...currentCredits, ...newCredits } };
                }
                return emp;
            })
        );
        showToast(`${updatedCount} active employees have had their leave credits updated.`);
    },
    saveHoliday: (formData, holidayId) => {
        if (holidayId) {
            setHolidays(prev => prev.map(h => h.id === holidayId ? { ...h, ...formData } : h));
        } else {
            const newHoliday = { id: Date.now(), ...formData };
            setHolidays(prev => [...prev, newHoliday]);
        }
    },
    deleteHoliday: (holidayId) => { setHolidays(prev => prev.filter(h => h.id !== holidayId)); },
    saveProgram: (formData, programId) => {
      if (programId) {
        setTrainingPrograms(prev => prev.map(p => p.id === programId ? { ...p, ...formData } : p));
      } else {
        const newProgram = { id: Date.now(), ...formData };
        setTrainingPrograms(prev => [...prev, newProgram]);
      }
    },
    enrollEmployees: (programId, employeeIds) => {
      const newEnrollments = employeeIds.map(empId => ({ enrollmentId: Date.now() + Math.random(), employeeId: empId, programId, status: 'Not Started', progress: 0 }));
      setEnrollments(prev => [...prev, ...newEnrollments]);
    },
    updateEnrollmentStatus: (enrollmentId, updatedData) => { setEnrollments(prev => prev.map(e => e.enrollmentId === enrollmentId ? { ...e, ...updatedData } : e)); },
    saveJobOpening: (formData, jobOpeningId) => {
        if (jobOpeningId) {
            setJobOpenings(prev => prev.map(job => job.id === jobOpeningId ? { ...job, ...formData } : job));
        } else {
            const newJob = { id: Date.now(), datePosted: new Date().toISOString().split('T')[0], ...formData };
            setJobOpenings(prev => [newJob, ...prev]);
        }
    },
    saveApplicant: (formData) => {
        const fullName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ');
        const newApplicant = { id: Date.now(), ...formData, name: fullName, status: 'New Applicant', applicationDate: new Date().toISOString().split('T')[0], lastStatusUpdate: new Date().toISOString(), resumeUrl: '#' };
        delete newApplicant.resumeFile;
        setApplicants(prev => [newApplicant, ...prev]);
    },
    deleteApplicant: (applicantId) => { setApplicants(prev => prev.filter(app => app.id !== applicantId)); },
    updateApplicantStatus: (applicantId, newStatus) => {
        setApplicants(prev => prev.map(app => app.id === applicantId ? { ...app, status: newStatus, lastStatusUpdate: new Date().toISOString() } : app));
    },
    scheduleInterview: (applicantId, interviewDate) => {
        setApplicants(prev => prev.map(app => app.id === applicantId ? { ...app, interviewDate, status: 'Interview', lastStatusUpdate: new Date().toISOString() } : app));
    },
    hireApplicant: (applicantId, hiringDetails) => {
        const applicantToHire = applicants.find(app => app.id === applicantId);
        if (!applicantToHire) return null;
        appLevelHandlers.updateApplicantStatus(applicantId, 'Hired');
        const { firstName, middleName, lastName } = parseFullName(applicantToHire.name);
        const newEmployee = { id: hiringDetails.employeeId, name: applicantToHire.name, firstName, middleName, lastName, email: applicantToHire.email, contactNumber: applicantToHire.phone, birthday: applicantToHire.birthday, gender: applicantToHire.gender, address: '', sssNo: applicantToHire.sssNo, tinNo: applicantToHire.tinNo, pagIbigNo: applicantToHire.pagIbigNo, philhealthNo: applicantToHire.philhealthNo, positionId: parseInt(hiringDetails.positionId, 10), joiningDate: hiringDetails.joiningDate, isTeamLeader: false, imageUrl: null, status: 'Active', leaveCredits: { sick: 10, vacation: 10, personal: 3 } };
        setEmployees(prev => [newEmployee, ...prev]);
        const username = `${firstName.toLowerCase()}_${hiringDetails.employeeId.slice(-4)}`;
        const password = Math.random().toString(36).slice(-8); 
        const newAccount = { employeeId: newEmployee.id, username, password, status: 'Active' };
        setUserAccounts(prev => [...prev, newAccount]);
        return newAccount;
    },
    resetPassword: (employeeId) => {
        const newPassword = Math.random().toString(36).slice(-8);
        setUserAccounts(prev => prev.map(acc => acc.employeeId === employeeId ? { ...acc, password: newPassword } : acc));
        alert(`Password for ${employeeId} has been reset to: ${newPassword}`);
    },
    toggleAccountStatus: (employeeId) => {
        setUserAccounts(prev => prev.map(acc => {
            if (acc.employeeId === employeeId) {
                const newStatus = acc.status === 'Active' ? 'Deactivated' : 'Active';
                return { ...acc, status: newStatus };
            }
            return acc;
        }));
    },
    updateMyProfile: (employeeId, updatedData) => { setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, ...updatedData } : emp)); },
    changeMyPassword: (employeeId, currentPassword, newPassword) => {
        const account = userAccounts.find(acc => acc.employeeId === employeeId);
        if (account && account.password === currentPassword) {
            setUserAccounts(prev => prev.map(acc => acc.employeeId === employeeId ? { ...acc, password: newPassword } : acc));
            return true;
        }
        return false;
    },
    updateMyResume: (employeeId, resumeFile) => {
        if (!resumeFile) return;
        const resumeUrl = URL.createObjectURL(resumeFile);
        setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, resumeUrl } : emp));
        alert("Resume updated successfully!");
    },
    toggleTheme: () => { setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light'); },
    saveEvaluation: (evaluationData, evalId) => {
      const today = new Date().toISOString().split('T')[0];
      if (evalId) {
        setEvaluations(prev => prev.map(e => e.id === evalId ? { ...e, ...evaluationData, evaluationDate: today } : e));
      } else {
        const newEval = { id: `EVAL${Date.now()}`, ...evaluationData, evaluationDate: today };
        setEvaluations(prev => [...prev, newEval]);
      }
    },
    markNotificationAsRead: (notificationId) => { setNotifications(prev => prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))); },
    markAllNotificationsAsRead: () => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); },
    clearAllNotifications: () => { setNotifications([]); },
    generatePayrollRun: (payrollRunData) => {
        const allRecords = payrollRunData.records.map(r => {
            const totalEarnings = (r.earnings || []).reduce((sum, earn) => sum + (earn.amount || 0), 0);
            const totalDeductions = Object.values(r.deductions).reduce((sum, val) => sum + val, 0);
            return { ...r, payrollId: `PAY-${Date.now()}-${r.empId}`, totalEarnings: totalEarnings, netPay: totalEarnings - totalDeductions };
        });
        const validRecords = allRecords.filter(r => r.totalEarnings > 0);
        const newRun = { runId: `RUN-${Date.now()}`, cutOff: payrollRunData.cutOff, records: validRecords };
        if (validRecords.length === 0) {
            showToast(`Payroll for ${newRun.cutOff} was not generated as no employees had workdays in this period.`, 'warning');
            return;
        }
        setPayrolls(prev => [newRun, ...prev]);
        showToast(`Payroll for ${newRun.cutOff} with ${validRecords.length} employees has been generated.`, 'success');
    },
    updatePayrollRecord: (payrollId, updatedData) => {
        setPayrolls(prev => prev.map(run => ({ ...run, records: run.records.map(rec => rec.payrollId === payrollId ? { ...rec, ...updatedData } : rec) })));
    },
    deletePayrollRun: (runId) => { setPayrolls(prev => prev.filter(run => run.runId !== runId)); },
    markRunAsPaid: (runId) => {
      let updatedCount = 0, runPeriod = '';
      setPayrolls(prev => prev.map(run => {
        if (run.runId === runId) {
          runPeriod = run.cutOff;
          const updatedRecords = run.records.map(rec => {
            if (rec.status !== 'Paid') { updatedCount++; return { ...rec, status: 'Paid' }; }
            return rec;
          });
          return { ...run, records: updatedRecords };
        }
        return run;
      }));
      if (updatedCount > 0) {
        showToast(`${updatedCount} record(s) for the period ${runPeriod} have been marked as paid.`, 'success');
      } else {
        showToast(`All records for the period ${runPeriod} were already paid.`, 'info');
      }
    },
    saveCase: (formData, caseId) => {
      if (caseId) {
        setDisciplinaryCases(prev => prev.map(c => c.caseId === caseId ? { ...c, ...formData } : c));
      } else {
        const newCase = { caseId: `CASE${String(Date.now()).slice(-4)}`, status: 'Ongoing', attachments: [], actionLog: [{ date: new Date().toISOString().split('T')[0], action: 'Case Created.' }], ...formData };
        setDisciplinaryCases(prev => [newCase, ...prev]);
      }
    },
    addCaseLogEntry: (caseId, newEntry) => { setDisciplinaryCases(prev => prev.map(c => c.caseId === caseId ? { ...c, actionLog: [newEntry, ...c.actionLog] } : c)); },
    deleteCase: (caseId) => { setDisciplinaryCases(prev => prev.filter(c => c.caseId !== caseId)); },
    submitCaseReport: (formData) => {
        const newSubmission = { id: `SUB${Date.now().toString().slice(-6)}`, status: 'Pending', attachments: formData.attachment ? [{ fileName: formData.attachment.name, url: '#' }] : [], ...formData };
        delete newSubmission.attachment;
        setCaseSubmissions(prev => [newSubmission, ...prev]);
        showToast('Case report has been submitted to HR for review.', 'success');
    },
    updateCaseSubmissionStatus: (submissionId, newStatus, comments) => {
        const submission = caseSubmissions.find(s => s.id === submissionId);
        if (!submission) return;
        if (newStatus === 'Approved') {
            const caseFormData = { employeeId: submission.employeeId, issueDate: submission.issueDate, actionType: 'Verbal Warning', reason: submission.reason, description: submission.description };
            appLevelHandlers.saveCase(caseFormData); 
        }
        setCaseSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: newStatus, hrComments: comments } : s));
        showToast(`Case submission has been ${newStatus.toLowerCase()}.`, 'info');
    },
    submitResignation: (formData) => {
        const submissionDate = new Date();
        const effectiveDate = new Date(submissionDate);
        effectiveDate.setDate(submissionDate.getDate() + 30);
        const newResignation = { id: `RES${Date.now().toString().slice(-4)}`, ...formData, submissionDate: submissionDate.toISOString().split('T')[0], effectiveDate: effectiveDate.toISOString().split('T')[0], status: 'Pending', hrComments: null };
        setResignations(prev => [newResignation, ...prev]);
        showToast("Your resignation has been submitted successfully.");
    },
    updateResignationStatus: (resignationId, newStatus, comments) => {
        let employeeIdToUpdate = null;
        setResignations(prev => prev.map(res => {
            if (res.id === resignationId) {
                if (newStatus === 'Approved') { employeeIdToUpdate = res.employeeId; }
                return { ...res, status: newStatus, hrComments: comments };
            }
            return res;
        }));
        if (employeeIdToUpdate) {
            setEmployees(prev => prev.map(emp => emp.id === employeeIdToUpdate ? { ...emp, status: 'Resigned' } : emp));
        }
        showToast(`Resignation has been ${newStatus.toLowerCase()}.`);
    },
    updateResignationEffectiveDate: (resignationId, newDate) => {
        setResignations(prev => prev.map(res => res.id === resignationId ? { ...res, effectiveDate: newDate } : res));
        showToast("Resignation effective date has been updated.");
    },
    terminateEmployee: (employeeId, details) => {
        const newTerminationRecord = { id: `TERM${Date.now().toString().slice(-4)}`, employeeId, ...details };
        setTerminations(prev => [newTerminationRecord, ...prev]);
        setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, status: 'Terminated' } : emp));
        setUserAccounts(prev => prev.map(acc => acc.employeeId === employeeId ? { ...acc, status: 'Deactivated' } : acc));
        showToast("Employee has been terminated and their account deactivated.", "info");
    },
    deleteResignationRequest: (resignationId) => {
        setResignations(prev => prev.filter(r => r.id !== resignationId));
        showToast("Resignation request has been deleted.", "info");
    },
    deleteAllResignedEmployees: () => {
        const resignedEmployeeIds = new Set(employees.filter(e => e.status === 'Resigned').map(e => e.id));
        if (resignedEmployeeIds.size === 0) return;
        setEmployees(prev => prev.filter(e => e.status !== 'Resigned'));
        setUserAccounts(prev => prev.filter(acc => !resignedEmployeeIds.has(acc.employeeId)));
        showToast(`${resignedEmployeeIds.size} resigned employee records have been permanently deleted.`, 'info');
    },
    rehireEmployee: (employeeId) => {
        const today = new Date().toISOString().split('T')[0];
        setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, status: 'Active', joiningDate: today } : emp));
        setUserAccounts(prev => prev.map(acc => acc.employeeId === employeeId ? { ...acc, status: 'Active' } : acc));
        showToast("Employee has been successfully rehired and their account reactivated.");
    },
    resetSelectedData: (resetConfig) => {
      if (resetConfig.employees) setEmployees(mockData.initialEmployeesData);
      if (resetConfig.positions) setPositions(mockData.initialPositionsData);
      if (resetConfig.schedules) {
        setSchedules(mockData.initialSchedulesData);
        setAttendanceLogs(mockData.initialAttendanceLogs);
      }
      if (resetConfig.leaveRequests) setLeaveRequests(mockData.initialLeaveRequests);
      if (resetConfig.resignations) setResignations(mockData.initialResignationsData);
      if (resetConfig.holidays) setHolidays(mockData.initialHolidaysData);
      if (resetConfig.training) {
        setTrainingPrograms(mockData.initialTrainingPrograms);
        setEnrollments(mockData.initialEnrollments);
      }
      if (resetConfig.applicants) {
        setJobOpenings(mockData.initialJobOpenings);
        setApplicants(mockData.initialApplicants);
      }
      if (resetConfig.performance) {
        setKras(mockData.initialKrasData);
        setKpis(mockData.initialKpisData);
        setEvaluationFactors(mockData.initialEvaluationFactors);
        setEvaluations(initialEvaluationsData);
        setEvaluationPeriods(mockData.initialEvaluationPeriods);
      }
      if (resetConfig.payrolls) setPayrolls(mockData.initialPayrollsData);
      if (resetConfig.disciplinaryCases) setDisciplinaryCases(mockData.initialCasesData);
      if (resetConfig.templates) setTemplates(mockData.initialTemplatesData);
      if (resetConfig.userAccounts) {
        setUserAccounts(mockData.initialUserAccounts);
        handleLogout();
      }
      showToast("Selected data has been reset successfully.", "info");
    },
  };

  const handleLoginSuccess = (userId) => {
    setCurrentUserId(userId);
    localStorage.setItem('currentUserId', userId);
    navigate('/dashboard');
  };
  
  const { currentUser, userRole } = useMemo(() => {
    if (!currentUserId) { return { currentUser: null, userRole: null }; }
    const user = employees.find(e => e.id === currentUserId);
    if (!user) { return { currentUser: null, userRole: null }; }
    let role = USER_ROLES.REGULAR_EMPLOYEE;
    if (user.positionId === 1) { role = USER_ROLES.HR_PERSONNEL; } 
    else if (user.isTeamLeader) { role = USER_ROLES.TEAM_LEADER; }
    return { currentUser: { ...user, role }, userRole: role };
  }, [currentUserId, employees]);

  useEffect(() => {
    if (currentUser && userRole) {
      if (window.location.pathname === '/login' || window.location.pathname === '/') {
        navigate('/dashboard', { replace: true });
      }
    } else {
      if (window.location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    }
  }, [currentUser, userRole, navigate]);
  
  const AppLayout = (
      <Layout 
          onLogout={handleLogout} 
          userRole={userRole} 
          currentUser={currentUser} 
          notifications={notifications}
          appLevelHandlers={appLevelHandlers}
          theme={theme}
          toast={toast}
          clearToast={clearToast}
      />
  );

  const evaluationFormPageElement = (
    <EvaluationFormPage
      currentUser={currentUser}
      employees={employees}
      positions={positions}
      evaluations={evaluations}
      evaluationFactors={evaluationFactors}
      handlers={appLevelHandlers}
    />
  );

  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} />
      <Route 
        path="/dashboard/*" 
        element={currentUser ? AppLayout : <Navigate to="/login" replace />}
      >
        <Route 
          index 
          element={<Dashboard 
            userRole={userRole} 
            currentUser={currentUser}
            employees={employees} 
            positions={positions} 
            leaveRequests={leaveRequests} 
            holidays={holidays}
            schedules={schedules}
            evaluations={evaluations}
            attendanceLogs={attendanceLogs}
          />} 
        />
        <Route path="my-profile" element={<MyProfilePage currentUser={currentUser} userRole={userRole} positions={positions} employees={employees} handlers={appLevelHandlers} />} />
        <Route path="account-settings" element={<AccountSettingsPage currentUser={currentUser} userRole={userRole} handlers={appLevelHandlers} theme={theme} />} />
        <Route path="my-cases" element={<MyCasesPage currentUser={currentUser} cases={disciplinaryCases} />} />
        <Route path="my-resignation" element={<MyResignationPage currentUser={currentUser} resignations={resignations} handlers={appLevelHandlers} />} />

        {/* HR PERSONNEL ROUTES */}
        {userRole === USER_ROLES.HR_PERSONNEL && (
          <>
            <Route path="leaderboards" element={<LeaderboardsPage employees={employees} positions={positions} schedules={schedules} attendanceLogs={attendanceLogs} leaveRequests={leaveRequests} evaluations={evaluations} />} />
            <Route path="employee-data" element={<EmployeeDataPage employees={employees} positions={positions} handlers={appLevelHandlers} />} />
            <Route path="positions" element={<PositionsPage employees={employees} positions={positions} handlers={appLevelHandlers} />} />
            <Route path="attendance-management" element={<AttendancePage allSchedules={schedules} employees={employees} positions={positions} attendanceLogs={attendanceLogs} setAttendanceLogs={setAttendanceLogs} handlers={appLevelHandlers} />} />
            <Route path="schedule-management/*" element={<ScheduleManagementPage employees={employees} positions={positions} schedules={schedules} templates={templates} handlers={appLevelHandlers} />} >
              <Route path="create" element={<ScheduleBuilderPage employees={employees} positions={positions} handlers={appLevelHandlers} />} />
            </Route>
            <Route path="leave-management" element={<LeaveManagementPage employees={employees} leaveRequests={leaveRequests} handlers={appLevelHandlers} />} />
            <Route path="payroll/*" element={<PayrollPage />}>
                <Route index element={<Navigate to="history" replace />} />
                <Route path="history" element={<PayrollHistoryPage payrolls={payrolls} employees={employees} positions={positions} handlers={appLevelHandlers} allLeaveRequests={leaveRequests} />} />
                <Route 
                  path="generate" 
                  element={<PayrollGenerationPage 
                    employees={employees} 
                    positions={positions} 
                    schedules={schedules} 
                    attendanceLogs={attendanceLogs} 
                    holidays={holidays} 
                    onGenerate={appLevelHandlers.generatePayrollRun} 
                    payrolls={payrolls}
                  />} 
                />
                <Route path="13th-month" element={<ThirteenthMonthPage employees={employees} payrolls={payrolls} />} />
            </Route>
            <Route path="holiday-management" element={<HolidayManagementPage holidays={holidays} handlers={appLevelHandlers} />} />
            <Route path="contributions-management" element={<ContributionsManagementPage employees={employees} positions={positions} payrolls={payrolls} theme={theme} />} />
            <Route path="performance" element={<PerformanceManagementPage kras={kras} kpis={kpis} positions={positions} employees={employees} evaluations={evaluations} handlers={appLevelHandlers} evaluationFactors={evaluationFactors} theme={theme} evaluationPeriods={evaluationPeriods} />} />
            <Route path="predictive-analytics" element={<PredictiveAnalyticsPage evaluations={evaluations} employees={employees} positions={positions} schedules={schedules} attendanceLogs={attendanceLogs} handlers={appLevelHandlers} trainingPrograms={trainingPrograms} enrollments={enrollments} />} />
            <Route path="performance/evaluate" element={evaluationFormPageElement} />
            <Route path="training/*" element={<TrainingPage trainingPrograms={trainingPrograms} enrollments={enrollments} handlers={appLevelHandlers} />} >
              <Route path=":programId" element={<ProgramDetailPage employees={employees} trainingPrograms={trainingPrograms} enrollments={enrollments} handlers={appLevelHandlers} />} />
            </Route>
            <Route path="case-management" element={<CaseManagementPage cases={disciplinaryCases} employees={employees} handlers={appLevelHandlers} caseSubmissions={caseSubmissions} />} />
            <Route path="resignation-management" element={<ResignationManagementPage resignations={resignations} terminations={terminations} employees={employees} positions={positions} handlers={appLevelHandlers} payrolls={payrolls} />} />
            <Route path="recruitment" element={<RecruitmentPage jobOpenings={jobOpenings} applicants={applicants} positions={positions} handlers={appLevelHandlers} />} />
            <Route path="accounts" element={<AccountsPage userAccounts={userAccounts} employees={employees} handlers={appLevelHandlers} />} />
            <Route path="reports" element={<ReportsPage employees={employees} positions={positions} schedules={schedules} attendanceLogs={attendanceLogs} leaveRequests={leaveRequests} evaluations={evaluations} trainingPrograms={trainingPrograms} enrollments={enrollments} payrolls={payrolls} cases={disciplinaryCases} applicants={applicants} jobOpenings={jobOpenings} />} />
          </>
        )}
        {/* TEAM LEADER ROUTES */}
        {userRole === USER_ROLES.TEAM_LEADER && (
          <>
            <Route path="my-attendance" element={<MyAttendancePage currentUser={currentUser} allSchedules={schedules} attendanceLogs={attendanceLogs} />} />
            <Route path="my-payroll/*" element={<MyPayrollLayout />}>
              <Route index element={<Navigate to="projection" replace />} />
              <Route path="projection" element={<MyPayrollProjectionPage currentUser={currentUser} positions={positions} schedules={schedules} attendanceLogs={attendanceLogs} holidays={holidays} />} />
              <Route path="history" element={<MyPayrollHistoryPage currentUser={currentUser} payrolls={payrolls} />} />
            </Route>
            <Route path="team-employees" element={<MyTeamPage currentUser={currentUser} employees={employees} positions={positions} handlers={appLevelHandlers} />} />
            <Route path="evaluate-team" element={<EvaluateTeamPage currentUser={currentUser} employees={employees} positions={positions} evaluations={evaluations} kras={kras} kpis={kpis} evaluationFactors={evaluationFactors} activeEvaluationPeriod={activeEvaluationPeriod} />} />
            <Route path="performance/evaluate" element={evaluationFormPageElement} />
            <Route path="my-leave" element={<MyLeavePage currentUser={currentUser} allLeaveRequests={leaveRequests} createLeaveRequest={(data) => appLevelHandlers.createLeaveRequest({...data, empId: currentUser.id, name: currentUser.name, position: positions.find(p => p.id === currentUser.positionId)?.title })} updateLeaveStatus={appLevelHandlers.updateLeaveStatus} handlers={appLevelHandlers} />} />
            <Route path="submit-report" element={<SubmitReportPage currentUser={currentUser} employees={employees} handlers={appLevelHandlers} userRole={userRole} />} />
          </>
        )}
        {/* REGULAR EMPLOYEE ROUTES */}
        {userRole === USER_ROLES.REGULAR_EMPLOYEE && (
          <>
            <Route path="my-attendance" element={<MyAttendancePage currentUser={currentUser} allSchedules={schedules} attendanceLogs={attendanceLogs} />} />
            <Route path="my-payroll/*" element={<MyPayrollLayout />}>
                <Route index element={<Navigate to="projection" replace />} />
                <Route path="projection" element={<MyPayrollProjectionPage currentUser={currentUser} positions={positions} schedules={schedules} attendanceLogs={attendanceLogs} holidays={holidays} />} />
                <Route path="history" element={<MyPayrollHistoryPage currentUser={currentUser} payrolls={payrolls} />} />
            </Route>
            <Route path="team-employees" element={<MyTeamPage currentUser={currentUser} employees={employees} positions={positions} />} />
            {/* --- THIS IS THE FIX --- */}
            <Route path="evaluate-leader" element={<EvaluateLeaderPage currentUser={currentUser} employees={employees} positions={positions} evaluations={evaluations} activeEvaluationPeriod={activeEvaluationPeriod} evaluationFactors={evaluationFactors} />} />
            <Route path="performance/evaluate" element={evaluationFormPageElement} />
             <Route path="my-leave" element={<MyLeavePage currentUser={currentUser} allLeaveRequests={leaveRequests} createLeaveRequest={(data) => appLevelHandlers.createLeaveRequest({...data, empId: currentUser.id, name: currentUser.name, position: positions.find(p => p.id === currentUser.positionId)?.title })} updateLeaveStatus={appLevelHandlers.updateLeaveStatus} handlers={appLevelHandlers} />} />
             <Route path="submit-report" element={<SubmitReportPage currentUser={currentUser} employees={employees} handlers={appLevelHandlers} userRole={userRole} />} />
          </>
        )}
        
        <Route path="*" element={<NotFoundPage currentUser={currentUser} />} />
      </Route>
      <Route path="/" element={currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage currentUser={null} />} />
    </Routes>
  );
}

const App = () => (
  <AppContent />
);

export default App;