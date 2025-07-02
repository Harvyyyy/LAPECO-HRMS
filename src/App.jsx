import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';
import './App.css';

import Login from './components/Authentication/Login';
import Layout from './components/layout/Layout';

// Page Components
import Dashboard from './components/pages/Dashboard/Dashboard';
import EmployeeDataPage from './components/pages/Employee-Data/EmployeeDataPage';
import PositionsPage from './components/pages/Positions/PositionsPage';
import AttendancePage from './components/pages/Attendance-Management/AttendancePage';
import LeaveManagementPage from './components/pages/Leave-Management/LeaveManagementPage';
import MyLeavePage from './components/pages/Leave-Management/MyLeavePage';
import PayrollPage from './components/pages/Payroll-Management/PayrollPage';
import ScheduleManagementPage from './components/pages/Schedule-Management/ScheduleManagementPage';
import ScheduleBuilderPage from './components/pages/Schedule-Management/ScheduleBuilderPage';
import HolidayManagementPage from './components/pages/Holiday-Management/HolidayManagementPage';
import TrainingPage from './components/pages/Training-And-Development/TrainingPage';
import ProgramDetailPage from './components/pages/Training-And-Development/ProgramDetailPage';
import RecruitmentPage from './components/pages/Recruitment/RecruitmentPage';
import ReportsPage from './components/pages/Reports/ReportsPage';
import PerformanceManagementPage from './components/pages/Performance-Management/PerformanceManagementPage';
import EvaluationFormPage from './components/pages/Performance-Management/EvaluationFormPage';


// Placeholder Components
const CaseManagementPage = () => <div className="container-fluid p-4"><h1 className="page-main-title">Case Management</h1><p>Content coming soon...</p></div>;
const MyAttendancePage = () => <div className="container-fluid p-4"><h1 className="page-main-title">My Attendance</h1><p>Content coming soon...</p></div>;
const MyPayrollPage = () => <div className="container-fluid p-4"><h1 className="page-main-title">My Payroll</h1><p>Content coming soon...</p></div>;
const MyTeamPage = () => <div className="container-fluid p-4"><h1 className="page-main-title">My Team</h1><p>Content coming soon...</p></div>;
const EvaluateTeamPage = () => <div className="container-fluid p-4"><h1 className="page-main-title">Evaluate Team</h1><p>Content coming soon...</p></div>;
const MyEvaluationsPage = () => <div className="container-fluid p-4"><h1 className="page-main-title">My Evaluations</h1><p>Content coming soon...</p></div>;
const ContributionsManagementPage = () => <div className="container-fluid p-4"><h1 className="page-main-title">Contributions Management</h1><p>Content coming soon...</p></div>;

// Constants & Assets
import { USER_ROLES } from './constants/roles';
import 'bootstrap-icons/font/bootstrap-icons.css';

// --- INITIAL MOCK DATA ---
const initialPositionsData = [
  { id: 1, title: 'HR Personnel', description: 'Handles recruitment, payroll, and employee relations.', monthlySalary: 35000 },
  { id: 2, title: 'Packer', description: 'Prepares and packs finished products for shipment.', monthlySalary: 18000 },
  { id: 3, title: 'Lifter', description: 'Operates lifting equipment to move heavy materials.', monthlySalary: 22000 },
  { id: 4, title: 'Picker', description: 'Selects items from inventory to fulfill orders.', monthlySalary: 18500 },
  { id: 5, title: 'Mover', description: 'Transports materials and goods within the facility.', monthlySalary: 19000 },
];

const initialEmployeesData = [
    { id: 'EMP001', name: 'Alice Johnson', positionId: 2, isTeamLeader: false, email: 'alice.j@example.com', joiningDate: '2022-03-15', gender: 'Female', birthday: '1993-02-18' },
    { id: 'EMP002', name: 'Bob Smith', positionId: 3, isTeamLeader: true, email: 'bob.s@example.com', joiningDate: '2021-07-01', gender: 'Male', birthday: '1989-08-25' },
    { id: 'EMP003', name: 'Carol White', positionId: 4, isTeamLeader: true, email: 'carol.w@example.com', joiningDate: '2023-01-10', gender: 'Female', birthday: '1996-12-01' },
    { id: 'EMP004', name: 'David Green', positionId: 5, isTeamLeader: false, email: 'david.g@example.com', joiningDate: '2023-05-20', gender: 'Male', birthday: '1999-04-30' },
    { id: 'EMP005', name: 'Grace Field', positionId: 1, isTeamLeader: false, email: 'grace.f@example.com', joiningDate: '2020-11-20', gender: 'Female', birthday: '1995-07-19' },
    { id: 'EMP009', name: 'Ivy Lee', positionId: null, isTeamLeader: false, email: 'ivy.l@example.com', joiningDate: '2023-08-12', gender: 'Female', birthday: '2000-10-10' },
];

const initialSchedulesData = [
  { scheduleId: 1, empId: 'EMP001', date: new Date().toISOString().split('T')[0], shift: '08:00 - 17:00', name: `Daily Schedule` },
  { scheduleId: 2, empId: 'EMP002', date: new Date().toISOString().split('T')[0], shift: '08:00 - 17:00', name: `Daily Schedule` },
];

const initialTemplatesData = [
  { id: 'TPL01', name: 'Warehouse Day Shift', description: 'Standard 8-5 shift for warehouse personnel.', columns: ['shift', 'area_assignment'], applicablePositions: ['Packer', 'Picker', 'Mover'] },
  { id: 'TPL02', name: 'Lifter Operations', description: 'Schedule for equipment operators.', columns: ['shift', 'equipment_id'], applicablePositions: ['Lifter'] },
  { id: 'TPL03', name: 'Office Staff Schedule', description: 'Standard office hours.', columns: ['shift'], applicablePositions: ['HR Personnel'] },
];

const initialLeaveRequests = [
  { leaveId: 'LVE001', leaveType: 'Vacation', empId: 'EMP002', name: 'Bob Smith', position: 'Lifter', days: 5, dateFrom: '2025-04-21', dateTo: '2025-04-25', reason: 'Family vacation.', status: 'Approved' },
  { leaveId: 'LVE002', leaveType: 'Sick Leave', empId: 'EMP003', name: 'Carol White', position: 'Picker', days: 2, dateFrom: '2025-05-05', dateTo: '2025-05-06', reason: 'Flu.', status: 'Approved' },
];

const initialHolidaysData = [
    { id: 1, name: "New Year's Day", date: '2025-01-01', type: 'Regular Holiday' }, { id: 2, name: 'Araw ng Kagitingan', date: '2025-04-09', type: 'Regular Holiday' }, { id: 3, name: 'Maundy Thursday', date: '2025-04-17', type: 'Regular Holiday' }, { id: 4, name: 'Good Friday', date: '2025-04-18', type: 'Regular Holiday' }, { id: 5, name: 'Labor Day', date: '2025-05-01', type: 'Regular Holiday' }, { id: 6, name: 'Independence Day', date: '2025-06-12', type: 'Regular Holiday' }, { id: 7, name: 'National Heroes Day', date: '2025-08-25', type: 'Regular Holiday' }, { id: 8, name: 'Bonifacio Day', date: '2025-11-30', type: 'Regular Holiday' }, { id: 9, name: 'Christmas Day', date: '2025-12-25', type: 'Regular Holiday' }, { id: 10, name: 'Rizal Day', date: '2025-12-30', type: 'Regular Holiday' }, { id: 11, name: 'Chinese New Year', date: '2025-01-29', type: 'Special Non-Working Day' }, { id: 12, name: 'EDSA People Power Revolution Anniversary', date: '2025-02-25', type: 'Special Non-Working Day' }, { id: 13, name: 'Black Saturday', date: '2025-04-19', type: 'Special Non-Working Day' }, { id: 14, name: 'Ninoy Aquino Day', date: '2025-08-21', type: 'Special Non-Working Day' }, { id: 15, name: "All Saints' Day", date: '2025-11-01', type: 'Special Non-Working Day' }, { id: 16, name: 'Feast of the Immaculate Conception of Mary', date: '2025-12-08', type: 'Special Non-Working Day' }, { id: 17, name: 'Last Day of the Year', date: '2025-12-31', type: 'Special Non-Working Day' },
];

const initialTrainingPrograms = [
  { id: 1, title: 'Leadership Training 101', description: 'Basic leadership skills for new managers and team leaders.', provider: 'Internal HR', duration: '4 Weeks' },
  { id: 2, title: 'Forklift Operation Certification', description: 'Safety and operation training for lift equipment.', provider: 'TESDA Accredited Center', duration: '40 Hours' },
  { id: 3, title: 'Workplace Safety & First Aid', description: 'Standard safety protocols and first aid certification.', provider: 'Red Cross', duration: '8 Hours' },
];

const initialEnrollments = [
  { enrollmentId: 1, employeeId: 'EMP002', programId: 1, status: 'Completed', progress: 100 },
  { enrollmentId: 2, employeeId: 'EMP003', programId: 1, status: 'In Progress', progress: 75 },
  { enrollmentId: 3, employeeId: 'EMP001', programId: 3, status: 'In Progress', progress: 50 },
  { enrollmentId: 4, employeeId: 'EMP004', programId: 3, status: 'Not Started', progress: 0 },
  { enrollmentId: 5, employeeId: 'EMP002', programId: 2, status: 'Completed', progress: 100 },
];

const initialJobOpenings = [
    { id: 1, title: 'Warehouse Packer', department: 'Operations', status: 'Open', datePosted: '2023-10-01' },
    { id: 2, title: 'HR Assistant', department: 'Human Resources', status: 'Open', datePosted: '2023-09-15' },
    { id: 3, title: 'Forklift Operator', department: 'Operations', status: 'Closed', datePosted: '2023-08-01' },
];

const initialApplicants = [
    { id: 1, name: 'John Doe', email: 'john.d@email.com', phone: '123-456-7890', jobOpeningId: 1, status: 'Interview', applicationDate: '2023-10-10', resumeUrl: '#', birthday: '1995-05-20', gender: 'Male', sssNo: '34-1234567-8', tinNo: '123-456-789-000', pagIbigNo: '123456789012', philhealthNo: '010123456789', interviewDate: '2023-10-15T10:00', lastStatusUpdate: '2023-10-12T14:30:00Z' },
    { id: 2, name: 'Jane Smith', email: 'jane.s@email.com', phone: '234-567-8901', jobOpeningId: 2, status: 'Screening', applicationDate: '2023-10-08', resumeUrl: '#', birthday: '1998-11-10', gender: 'Female', sssNo: '34-8765432-1', tinNo: '321-654-987-000', pagIbigNo: '210987654321', philhealthNo: '020987654321', interviewDate: null, lastStatusUpdate: '2023-10-09T11:00:00Z' },
];

const initialKrasData = [
  { id: 'KRA01', title: 'Warehouse Efficiency', description: 'Measures the speed and accuracy of warehouse tasks.' },
  { id: 'KRA02', title: 'Safety & Compliance', description: 'Adherence to safety protocols and proper equipment handling.' },
  { id: 'KRA03', title: 'HR Process Management', description: 'Effectiveness in managing HR-related tasks and documentation.' },
];

const initialKpisData = [
  { id: 'KPI01', kraId: 'KRA01', title: 'Picking Accuracy', description: 'Percentage of orders picked without errors.', weight: 50, appliesToPositionIds: [4] },
  { id: 'KPI02', kraId: 'KRA01', title: 'Packing Speed', description: 'Average number of packages prepared per hour.', weight: 50, appliesToPositionIds: [2] },
  { id: 'KPI07', kraId: 'KRA01', title: 'Movement Time', description: 'Average time to transport goods between zones.', weight: 100, appliesToPositionIds: [5] },
  { id: 'KPI03', kraId: 'KRA02', title: 'Safety Incident Rate', description: 'Number of reported safety incidents.', weight: 70, appliesToPositionIds: [3, 5] },
  { id: 'KPI04', kraId: 'KRA02', title: 'Equipment Maintenance Checks', description: 'Completion of pre-shift equipment checks.', weight: 30, appliesToPositionIds: [3] },
  { id: 'KPI05', kraId: 'KRA03', title: 'Recruitment Time-to-Fill', description: 'Average time taken to fill open positions.', weight: 60, appliesToPositionIds: [1] },
  { id: 'KPI06', kraId: 'KRA03', title: 'Payroll Accuracy', description: 'Percentage of payroll runs with zero errors.', weight: 40, appliesToPositionIds: [1] },
];

const initialEvaluationFactors = [
  { 
    id: 'factor_behavior', 
    title: 'Behavioral Competencies', 
    type: 'rating_scale', 
    items: [
      { id: 'bhv_teamwork', name: 'Teamwork & Collaboration', description: 'Works effectively with others to achieve common goals; shares information and supports team members.' },
      { id: 'bhv_communication', name: 'Communication', description: 'Clearly and effectively conveys information and ideas to individuals or groups.' },
      { id: 'bhv_professionalism', name: 'Professionalism & Integrity', description: 'Demonstrates a high standard of professional conduct, ethics, and accountability.' },
    ]
  },
  { 
    id: 'factor_work_quality', 
    title: 'Work Quality', 
    type: 'rating_scale',
    items: [
      { id: 'wq_accuracy', name: 'Accuracy & Attention to Detail', description: 'Completes tasks with a high degree of accuracy and minimizes errors.' },
      { id: 'wq_efficiency', name: 'Efficiency & Time Management', description: 'Effectively manages time and resources to meet deadlines and complete tasks efficiently.' },
    ]
  },
  { 
    id: 'factor_company_values', 
    title: 'Company Values Alignment', 
    type: 'rating_scale',
    items: [
      { id: 'val_safety', name: 'Commitment to Safety', description: 'Prioritizes and adheres to all safety protocols and procedures.' },
      { id: 'val_integrity', name: 'Integrity', description: 'Acts with honesty and transparency in all dealings.' },
    ]
  },
  {
    id: 'factor_kpis',
    title: 'Key Performance Indicators (KPIs)',
    type: 'kpi_section',
  },
  {
    id: 'factor_manager_summary',
    title: "Manager's Overall Summary",
    type: 'textarea',
    description: "Provide a holistic summary of the employee's performance, strengths, and areas for improvement during this review period."
  },
  {
    id: 'factor_employee_feedback',
    title: "Employee's Comments",
    type: 'textarea',
    description: "The employee can provide feedback on their performance, achievements, or challenges during this review period."
  },
  {
    id: 'factor_development_plan',
    title: 'Goals & Development Plan',
    type: 'textarea',
    description: "Outline specific, measurable, achievable, relevant, and time-bound (SMART) goals for the next review period."
  }
];

const initialEvaluationsData = [
  {
    id: 'EVAL01',
    employeeId: 'EMP001',
    evaluatorId: 'EMP002',
    periodStart: '2023-01-01',
    periodEnd: '2023-06-30',
    status: 'Completed',
    factorScores: {
      'bhv_teamwork': { score: 5, comments: 'Always willing to help others in the warehouse.' },
      'bhv_communication': { score: 4, comments: 'Communicates clearly with the team leader.' },
      'bhv_professionalism': { score: 5, comments: '' },
      'wq_accuracy': { score: 4, comments: 'Double-checks work, resulting in low return rates.' },
      'wq_efficiency': { score: 5, comments: '' },
      'val_safety': { score: 5, comments: 'Always wears required PPE.' },
      'val_integrity': { score: 5, comments: '' },
      'KPI02': { score: 5, comments: 'Consistently exceeds packing speed targets.' },
      'factor_manager_summary': { value: 'Alice is a top performer and a key asset to the warehouse team. Her efficiency is outstanding.' },
      'factor_employee_feedback': { value: 'I enjoyed the last period and look forward to taking on more responsibility.' },
      'factor_development_plan': { value: 'Continue to lead by example in packing efficiency.' },
    },
    overallScore: 95.00,
  }
];

const initialNotificationsData = [
  { id: 1, type: 'leave_request', message: 'Bob Smith has requested a new vacation leave.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
  { id: 2, type: 'performance_review', message: 'Your performance evaluation for H2 2023 is due next week.', timestamp: new Date(Date.now() - 86400000).toISOString(), read: false },
  { id: 3, type: 'recruitment', message: 'A new applicant, Jane Smith, has applied for the HR Assistant role.', timestamp: new Date(Date.now() - 172800000).toISOString(), read: false },
  { id: 4, type: 'system_update', message: 'The payroll module has been updated with new tax regulations.', timestamp: new Date(Date.now() - 259200000).toISOString(), read: true },
  { id: 5, type: 'training', message: 'You have been enrolled in "Workplace Safety & First Aid".', timestamp: new Date(Date.now() - 604800000).toISOString(), read: true },
];


function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || null);
  const navigate = useNavigate();

  const [employees, setEmployees] = useState(initialEmployeesData);
  const [positions, setPositions] = useState(initialPositionsData);
  const [schedules, setSchedules] = useState(initialSchedulesData);
  const [templates, setTemplates] = useState(initialTemplatesData);
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const [holidays, setHolidays] = useState(initialHolidaysData);
  const [trainingPrograms, setTrainingPrograms] = useState(initialTrainingPrograms);
  const [enrollments, setEnrollments] = useState(initialEnrollments);
  const [jobOpenings, setJobOpenings] = useState(initialJobOpenings);
  const [applicants, setApplicants] = useState(initialApplicants);
  const [kras, setKras] = useState(initialKrasData);
  const [kpis, setKpis] = useState(initialKpisData);
  const [evaluationFactors, setEvaluationFactors] = useState(initialEvaluationFactors);
  const [evaluations, setEvaluations] = useState(initialEvaluationsData);
  const [notifications, setNotifications] = useState(initialNotificationsData);


  const appLevelHandlers = {
    saveEmployee: (formData, existingEmployeeId) => {
      if (existingEmployeeId) {
        setEmployees(prev => prev.map(emp => emp.id === existingEmployeeId ? { ...emp, ...formData } : emp));
      } else {
        const newEmployee = { id: `EMP${Date.now().toString().slice(-4)}`, isTeamLeader: false, ...formData };
        setEmployees(prev => [newEmployee, ...prev]);
      }
    },
    deleteEmployee: (employeeId) => {
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    },
    savePosition: (formData, positionId) => {
      if (positionId) {
        setPositions(prev => prev.map(pos => pos.id === positionId ? { ...pos, ...formData } : pos));
      } else {
        const newPosition = { id: Date.now(), ...formData };
        setPositions(prev => [newPosition, ...prev]);
      }
    },
    deletePosition: (positionId) => {
      setPositions(prev => prev.filter(pos => pos.id !== positionId));
      setEmployees(prev => prev.map(emp => emp.positionId === positionId ? { ...emp, positionId: null } : emp));
    },
    assignEmployeeToPosition: (employeeId, positionId) => {
      setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, positionId: positionId } : emp));
    },
    toggleTeamLeaderStatus: (employeeId) => {
      setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, isTeamLeader: !emp.isTeamLeader } : emp));
    },
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
    deleteSchedule: (dateToDelete) => {
      setSchedules(prev => prev.filter(s => s.date !== dateToDelete));
    },
    createTemplate: (templateData, templateId) => {
      if (templateId) {
        setTemplates(prev => prev.map(t => t.id === templateId ? { ...t, ...templateData } : t));
      } else {
        const newTemplate = { id: `TPL${Date.now()}`, ...templateData };
        setTemplates(prev => [newTemplate, ...prev]);
      }
    },
    createLeaveRequest: (leaveData) => {
        const newRequest = { ...leaveData, leaveId: `LVE${Date.now().toString().slice(-4)}`, status: 'Pending' };
        setLeaveRequests(prev => [newRequest, ...prev]);
    },
    updateLeaveStatus: (leaveId, newStatus) => {
        setLeaveRequests(prev => prev.map(req => req.leaveId === leaveId ? { ...req, status: newStatus } : req));
    },
    saveHoliday: (formData, holidayId) => {
        if (holidayId) {
            setHolidays(prev => prev.map(h => h.id === holidayId ? { ...h, ...formData } : h));
        } else {
            const newHoliday = { id: Date.now(), ...formData };
            setHolidays(prev => [...prev, newHoliday]);
        }
    },
    deleteHoliday: (holidayId) => {
        setHolidays(prev => prev.filter(h => h.id !== holidayId));
    },
    saveProgram: (formData, programId) => {
      if (programId) {
        setTrainingPrograms(prev => prev.map(p => p.id === programId ? { ...p, ...formData } : p));
      } else {
        const newProgram = { id: Date.now(), ...formData };
        setTrainingPrograms(prev => [...prev, newProgram]);
      }
    },
    enrollEmployees: (programId, employeeIds) => {
      const newEnrollments = employeeIds.map(empId => ({
        enrollmentId: Date.now() + Math.random(), employeeId: empId, programId, status: 'Not Started', progress: 0,
      }));
      setEnrollments(prev => [...prev, ...newEnrollments]);
    },
    updateEnrollmentStatus: (enrollmentId, updatedData) => {
      setEnrollments(prev => prev.map(e => e.enrollmentId === enrollmentId ? { ...e, ...updatedData } : e));
    },
    saveJobOpening: (formData, jobOpeningId) => {
        if (jobOpeningId) {
            setJobOpenings(prev => prev.map(job => job.id === jobOpeningId ? { ...job, ...formData } : job));
        } else {
            const newJob = { id: Date.now(), datePosted: new Date().toISOString().split('T')[0], ...formData };
            setJobOpenings(prev => [newJob, ...prev]);
        }
    },
    saveApplicant: (formData) => {
        const newApplicant = {
            id: Date.now(), ...formData, status: 'New Applicant', applicationDate: new Date().toISOString().split('T')[0],
            lastStatusUpdate: new Date().toISOString(), resumeUrl: '#'
        };
        delete newApplicant.resumeFile;
        setApplicants(prev => [newApplicant, ...prev]);
    },
    updateApplicantStatus: (applicantId, newStatus) => {
        setApplicants(prev => prev.map(app => 
            app.id === applicantId ? { ...app, status: newStatus, lastStatusUpdate: new Date().toISOString() } : app
        ));
    },
    scheduleInterview: (applicantId, interviewDate) => {
        setApplicants(prev => prev.map(app =>
            app.id === applicantId ? { ...app, interviewDate, status: 'Interview', lastStatusUpdate: new Date().toISOString() } : app
        ));
    },
    hireApplicant: (applicantId, hiringDetails) => {
        const applicantToHire = applicants.find(app => app.id === applicantId);
        if (!applicantToHire) return;
        appLevelHandlers.updateApplicantStatus(applicantId, 'Hired');
        const newEmployee = {
            id: hiringDetails.employeeId, name: applicantToHire.name, email: applicantToHire.email,
            contactNumber: applicantToHire.phone, birthday: applicantToHire.birthday, gender: applicantToHire.gender,
            address: '', sssNo: applicantToHire.sssNo, tinNo: applicantToHire.tinNo, pagIbigNo: applicantToHire.pagIbigNo,
            philhealthNo: applicantToHire.philhealthNo, positionId: parseInt(hiringDetails.positionId, 10),
            joiningDate: hiringDetails.joiningDate, isTeamLeader: false, imageUrl: null,
        };
        setEmployees(prev => [newEmployee, ...prev]);
        alert(`${newEmployee.name} has been successfully hired and added to the employee list!`);
    },
    saveKraAndKpis: (kraData, kpiList) => {
      let savedKraId = kraData.id;
      if (savedKraId) {
        setKras(prev => prev.map(k => k.id === savedKraId ? { ...k, ...kraData } : k));
      } else {
        const newKra = { ...kraData, id: `KRA${Date.now()}` };
        savedKraId = newKra.id;
        setKras(prev => [...prev, newKra]);
      }
      const modalKpiIds = new Set(kpiList.map(k => k.id).filter(Boolean));
      const updatedKpis = kpis.filter(kpi => kpi.kraId !== savedKraId || modalKpiIds.has(kpi.id));
      kpiList.forEach(kpi => {
        const existingKpiIndex = updatedKpis.findIndex(uk => uk.id === kpi.id);
        const kpiToSave = { ...kpi, kraId: savedKraId };
        if (existingKpiIndex > -1) {
          updatedKpis[existingKpiIndex] = kpiToSave;
        } else {
          updatedKpis.push({ ...kpiToSave, id: `KPI${Date.now()}${Math.random()}` });
        }
      });
      setKpis(updatedKpis);
    },
    deleteKra: (kraId) => {
      setKras(prev => prev.filter(k => k.id !== kraId));
      setKpis(prev => prev.filter(kpi => kpi.kraId !== kraId));
    },
    saveEvaluation: (evaluationData, evalId) => {
      if (evalId) {
        setEvaluations(prev => prev.map(e => e.id === evalId ? { ...e, ...evaluationData } : e));
      } else {
        const newEval = { id: `EVAL${Date.now()}`, ...evaluationData };
        setEvaluations(prev => [...prev, newEval]);
      }
    },
    markNotificationAsRead: (notificationId) => {
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
    },
    markAllNotificationsAsRead: () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    },
    clearAllNotifications: () => {
      setNotifications([]);
    },
  };

  const handleLoginSuccess = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };
  
  useEffect(() => {
    if (isLoggedIn && userRole) {
      if (window.location.pathname === '/login' || window.location.pathname === '/') {
        navigate('/dashboard', { replace: true });
      }
    } else {
      if (window.location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    }
  }, [isLoggedIn, userRole, navigate]);

  const currentUser = {
    name: 'Harvy P. Estor',
    employeeId: 'EMP005',
    role: userRole,
    avatarUrl: null
  };

  return (
    <Routes>
      <Route path="/login" element={isLoggedIn && userRole ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} />
      <Route 
        path="/dashboard/*" 
        element={
          isLoggedIn && userRole ? (
            <Layout 
              onLogout={handleLogout} 
              userRole={userRole} 
              currentUser={currentUser} 
              notifications={notifications}
              appLevelHandlers={appLevelHandlers}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      >
        <Route 
          index 
          element={<Dashboard 
            userRole={userRole} 
            currentUser={currentUser}
            employees={employees} 
            positions={positions} 
            leaveRequests={leaveRequests} 
            jobOpenings={jobOpenings}
            holidays={holidays}
            schedules={schedules}
          />} 
        />
        {userRole === USER_ROLES.HR_PERSONNEL && (
          <>
            <Route path="employee-data" element={<EmployeeDataPage employees={employees} positions={positions} handlers={appLevelHandlers} />} />
            <Route path="positions" element={<PositionsPage employees={employees} positions={positions} handlers={appLevelHandlers} />} />
            <Route path="attendance-management" element={<AttendancePage allSchedules={schedules} employees={employees} positions={positions} />} />
            <Route path="schedule-management">
              <Route index element={<ScheduleManagementPage employees={employees} positions={positions} schedules={schedules} templates={templates} handlers={appLevelHandlers} />} />
              <Route path="create" element={<ScheduleBuilderPage employees={employees} positions={positions} handlers={appLevelHandlers} />} />
            </Route>
            <Route path="leave-management" element={<LeaveManagementPage leaveRequests={leaveRequests} handlers={appLevelHandlers} />} />
            <Route path="payroll" element={<PayrollPage />} />
            <Route path="holiday-management" element={<HolidayManagementPage holidays={holidays} leaveRequests={leaveRequests} handlers={appLevelHandlers} />} />
            <Route path="contributions-management" element={<ContributionsManagementPage />} />
            <Route path="performance" element={<PerformanceManagementPage kras={kras} kpis={kpis} positions={positions} employees={employees} evaluations={evaluations} handlers={appLevelHandlers} />} />
            <Route path="performance/evaluate" element={<EvaluationFormPage employees={employees} positions={positions} kras={kras} kpis={kpis} evaluationFactors={evaluationFactors} handlers={appLevelHandlers} />} />
            <Route path="training">
              <Route index element={<TrainingPage trainingPrograms={trainingPrograms} enrollments={enrollments} handlers={appLevelHandlers} />} />
              <Route path=":programId" element={<ProgramDetailPage employees={employees} trainingPrograms={trainingPrograms} enrollments={enrollments} handlers={appLevelHandlers} />} />
            </Route>
            <Route path="case-management" element={<CaseManagementPage />} />
            <Route path="recruitment" element={<RecruitmentPage jobOpenings={jobOpenings} applicants={applicants} positions={positions} handlers={appLevelHandlers} />} />
            <Route path="reports" element={<ReportsPage employees={employees} positions={positions} />} />
          </>
        )}
        {userRole === USER_ROLES.TEAM_LEADER && (
          <>
            <Route path="my-attendance" element={<MyAttendancePage />} />
            <Route path="my-payroll" element={<MyPayrollPage />} />
            <Route path="team-employees" element={<MyTeamPage />} />
            <Route path="evaluate-team" element={<EvaluateTeamPage />} />
            <Route path="my-leave" element={<MyLeavePage leaveRequests={leaveRequests} createLeaveRequest={appLevelHandlers.createLeaveRequest} />} />
          </>
        )}
        {userRole === USER_ROLES.REGULAR_EMPLOYEE && (
          <>
            <Route path="my-attendance" element={<MyAttendancePage />} />
            <Route path="my-payroll" element={<MyPayrollPage />} />
            <Route path="evaluate-self" element={<MyEvaluationsPage />} />
            <Route path="my-leave" element={<MyLeavePage leaveRequests={leaveRequests} createLeaveRequest={appLevelHandlers.createLeaveRequest} />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="/" element={isLoggedIn && userRole ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="*" element={ <div style={{ textAlign: 'center', marginTop: '50px' }}><h2>404 - Page Not Found</h2></div> } />
    </Routes>
  );
}

function App() {
  return ( <Router><AppContent /></Router> );
}
export default App;