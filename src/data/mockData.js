// src/data/mockData.js

// Mock Data for Lapeco HRMS
// This file contains all the initial mock data used throughout the application

// Utility function for creating past dates
const createPastDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Utility function for creating schedule entries
const createScheduleEntry = (id, empId, date, shift = '08:00 - 17:00') => ({
  scheduleId: id, 
  empId, 
  date: createPastDate(date), 
  shift
});

// ============================================================================
// EMPLOYEE DATA
// ============================================================================

export const initialEmployeesData = [
  { 
    id: 'EMP003', 
    firstName: 'Carol', 
    middleName: '', 
    lastName: 'White', 
    name: 'Carol White', 
    positionId: 2, 
    isTeamLeader: true, 
    email: 'carol.w@example.com', 
    joiningDate: '2023-01-10', 
    gender: 'Female', 
    birthday: '1996-12-01', 
    sssNo: '34-123', 
    tinNo: '123-456', 
    pagIbigNo: '1210-5865-0865', 
    philhealthNo: '0802-6579-1208', 
    status: 'Active', 
    contactNumber: '9123456789', 
    address: '123 Main St, Anytown, USA', 
    resumeUrl: null,
    leaveCredits: { sick: 15, vacation: 15, personal: 5 }
  },
  { 
    id: 'EMP001', 
    firstName: 'Alice', 
    middleName: '', 
    lastName: 'Johnson', 
    name: 'Alice Johnson', 
    positionId: 2, 
    isTeamLeader: false, 
    email: 'alice.j@example.com', 
    joiningDate: '2022-03-15', 
    gender: 'Female', 
    birthday: '1993-02-18', 
    sssNo: '34-456', 
    tinNo: '321-654', 
    pagIbigNo: '1213-1695-8596', 
    philhealthNo: '1120-2485-8688', 
    status: 'Active', 
    contactNumber: '9123456789', 
    address: '123 Main St, Anytown, USA', 
    resumeUrl: null,
    leaveCredits: { sick: 15, vacation: 15, personal: 5 }
  },
  { 
    id: 'EMP009', 
    firstName: 'Ivy', 
    middleName: '', 
    lastName: 'Lee', 
    name: 'Ivy Lee', 
    positionId: 2, 
    isTeamLeader: false, 
    email: 'ivy.l@example.com', 
    joiningDate: '2023-08-12', 
    gender: 'Female', 
    birthday: '2000-10-10', 
    sssNo: '34-999',
    tinNo: '111-222', 
    pagIbigNo: '1210-8451-2548', 
    philhealthNo: '0902-5184-4185', 
    status: 'Active', 
    contactNumber: '9123456789', 
    address: '123 Main St, Anytown, USA', 
    resumeUrl: null,
    leaveCredits: { sick: 10, vacation: 10, personal: 3 }
  },
  { 
    id: 'EMP002', 
    firstName: 'Bob', 
    middleName: '', 
    lastName: 'Smith', 
    name: 'Bob Smith', 
    positionId: 3, 
    isTeamLeader: true, 
    email: 'bob.s@example.com', 
    joiningDate: '2021-07-01', 
    gender: 'Male', 
    birthday: '1989-08-25', 
    sssNo: '34-789', 
    tinNo: '987-654', 
    pagIbigNo: '1210-6385-5854', 
    philhealthNo: '0825-3830-9814', 
    status: 'Active', 
    contactNumber: '9123456789', 
    address: '123 Main St, Anytown, USA', 
    resumeUrl: null,
    leaveCredits: { sick: 15, vacation: 15, personal: 5 }
  },
  { 
    id: 'EMP004', 
    firstName: 'David', 
    middleName: '', 
    lastName: 'Green', 
    name: 'David Green', 
    positionId: 3, 
    isTeamLeader: false, 
    email: 'david.g@example.com', 
    joiningDate: '2023-05-20', 
    gender: 'Male', 
    birthday: '1999-04-30', 
    sssNo: '34-101', 
    tinNo: '777-888',
    pagIbigNo: '1215-1312-7883',
    philhealthNo: '0805-1312-7883', 
    status: 'Active', 
    contactNumber: '9123456789', 
    address: '123 Main St, Anytown, USA', 
    resumeUrl: null,
    leaveCredits: { sick: 12, vacation: 12, personal: 4 }
  },
  { 
    id: 'EMP005', 
    firstName: 'Grace', 
    middleName: '', 
    lastName: 'Field', 
    name: 'Grace Field', 
    positionId: 1, 
    isTeamLeader: false, 
    email: 'grace.f@example.com', 
    joiningDate: '2020-11-20', 
    gender: 'Female', 
    birthday: '1995-07-19', 
    sssNo: '34-202', 
    tinNo: '222-333', 
    pagIbigNo: '1211-9050-5943', 
    philhealthNo: '1908-9634-9159', 
    status: 'Active', 
    contactNumber: '9123456789', 
    address: '123 Main St, Anytown, USA', 
    resumeUrl: null,
    leaveCredits: { sick: 15, vacation: 20, personal: 5 }
  },
  { 
    id: 'EMP010', 
    firstName: 'Frank', 
    middleName: '', 
    lastName: 'Black', 
    name: 'Frank Black', 
    positionId: null, 
    isTeamLeader: false, 
    email: 'frank.b@example.com', 
    joiningDate: '2023-09-01', 
    gender: 'Male', 
    birthday: '1998-05-15', 
    sssNo: '34-303', 
    tinNo: '444-555', 
    pagIbigNo: '1212-7582-7302', 
    philhealthNo: '0820-1209-8037', 
    status: 'Inactive', 
    contactNumber: '9123456789', 
    address: '123 Main St, Anytown, USA', 
    resumeUrl: null,
    leaveCredits: { sick: 0, vacation: 0, personal: 0 }
  },
];

// ============================================================================
// POSITIONS DATA
// ============================================================================

export const initialPositionsData = [
  { 
    id: 1, 
    title: 'HR Personnel', 
    description: 'Handles recruitment, payroll, and employee relations.', 
    monthlySalary: 35000,
    hourlyRate: 198.86,
    overtimeRate: 248.58,
    nightDiffRate: 19.89,
    lateDeductionPerMin: 3.31,
  },
  { 
    id: 2, 
    title: 'Packer', 
    description: 'Prepares and packs finished products for shipment.', 
    monthlySalary: 18000,
    hourlyRate: 102.27,
    overtimeRate: 127.84,
    nightDiffRate: 10.23,
    lateDeductionPerMin: 1.70,
  },
  { 
    id: 3, 
    title: 'Lifter', 
    description: 'Operates lifting equipment to move heavy materials.', 
    monthlySalary: 22000,
    hourlyRate: 125.00,
    overtimeRate: 156.25,
    nightDiffRate: 12.50,
    lateDeductionPerMin: 2.08,
  },
  { 
    id: 4, 
    title: 'Picker', 
    description: 'Selects items from inventory to fulfill orders.', 
    monthlySalary: 18500,
    hourlyRate: 105.11,
    overtimeRate: 131.39,
    nightDiffRate: 10.51,
    lateDeductionPerMin: 1.75,
  },
  { 
    id: 5, 
    title: 'Mover', 
    description: 'Transports materials and goods within the facility.', 
    monthlySalary: 19000,
    hourlyRate: 107.95,
    overtimeRate: 134.94,
    nightDiffRate: 10.80,
    lateDeductionPerMin: 1.80,
  },
];

// ============================================================================
// SCHEDULES DATA
// ============================================================================

export const initialSchedulesData = [
  // Today's Schedule
  createScheduleEntry(1, 'EMP001', 0),
  createScheduleEntry(2, 'EMP002', 0, '09:00 - 18:00'),
  createScheduleEntry(3, 'EMP003', 0, '09:00 - 18:00'),
  createScheduleEntry(4, 'EMP004', 0),

  // Yesterday's Schedule
  createScheduleEntry(5, 'EMP001', 1),
  createScheduleEntry(6, 'EMP002', 1, '09:00 - 18:00'),
  createScheduleEntry(7, 'EMP003', 1, '09:00 - 18:00'),
  createScheduleEntry(8, 'EMP004', 1),
  createScheduleEntry(9, 'EMP009', 1),

  // 2 Days Ago
  createScheduleEntry(10, 'EMP001', 2),
  createScheduleEntry(11, 'EMP002', 2, '09:00 - 18:00'), // Absent
  createScheduleEntry(12, 'EMP003', 2, '09:00 - 18:00'),
  createScheduleEntry(13, 'EMP004', 2),
  createScheduleEntry(14, 'EMP009', 2),

  // 3 Days Ago
  createScheduleEntry(15, 'EMP001', 3),
  createScheduleEntry(16, 'EMP002', 3, '09:00 - 18:00'),
  createScheduleEntry(17, 'EMP003', 3, '08:00 - 17:00'),
  createScheduleEntry(18, 'EMP004', 3),

  // 4 Days Ago
  createScheduleEntry(19, 'EMP002', 4, '09:00 - 18:00'),
  createScheduleEntry(20, 'EMP004', 4),
  createScheduleEntry(21, 'EMP009', 4, '09:00 - 18:00'),

  // 5 Days Ago
  createScheduleEntry(22, 'EMP001', 5),
  createScheduleEntry(23, 'EMP002', 5, '09:00 - 18:00'),
  createScheduleEntry(24, 'EMP003', 5),
  createScheduleEntry(25, 'EMP004', 5), // Absent
  createScheduleEntry(26, 'EMP009', 5),
];

// ============================================================================
// ATTENDANCE DATA
// ============================================================================

export const initialAttendanceLogs = [
  // --- Today's Logs (In Progress) ---
  { empId: 'EMP001', date: createPastDate(0), signIn: '08:02', breakOut: '12:05', breakIn: '13:01', signOut: null }, // Present
  { empId: 'EMP002', date: createPastDate(0), signIn: '08:58', breakOut: null, breakIn: null, signOut: null },      // Present
  { empId: 'EMP003', date: createPastDate(0), signIn: '09:18', breakOut: '12:30', breakIn: null, signOut: null },       // Late
  // EMP004 is scheduled but absent today

  // --- Yesterday's Logs ---
  { empId: 'EMP001', date: createPastDate(1), signIn: '08:00', breakOut: '12:00', breakIn: '13:00', signOut: '17:00' },
  { empId: 'EMP002', date: createPastDate(1), signIn: '08:55', breakOut: '12:10', breakIn: '13:05', signOut: '17:58' },
  { empId: 'EMP003', date: createPastDate(1), signIn: '09:15', breakOut: '12:30', breakIn: '13:30', signOut: '18:10' }, // Late
  { empId: 'EMP004', date: createPastDate(1), signIn: '08:05', breakOut: '12:00', breakIn: '13:00', signOut: '17:02' },
  { empId: 'EMP009', date: createPastDate(1), signIn: '08:10', breakOut: '12:15', breakIn: '13:10', signOut: '17:15' },

  // --- 2 Days Ago ---
  { empId: 'EMP001', date: createPastDate(2), signIn: '08:05', breakOut: '12:01', breakIn: '12:59', signOut: '17:05' },
  { empId: 'EMP003', date: createPastDate(2), signIn: '08:00', breakOut: '12:00', breakIn: '13:00', signOut: '17:00' },
  // EMP002 was absent 2 days ago
  { empId: 'EMP004', date: createPastDate(2), signIn: '09:30', breakOut: '12:30', breakIn: '13:30', signOut: '18:30' }, // Late
  { empId: 'EMP009', date: createPastDate(2), signIn: '08:00', breakOut: '12:00', breakIn: '13:00', signOut: '17:03' },
  
  // --- 3 Days Ago ---
  { empId: 'EMP001', date: createPastDate(3), signIn: '07:58', breakOut: '11:55', breakIn: '12:55', signOut: '16:50' },
  { empId: 'EMP002', date: createPastDate(3), signIn: '09:03', breakOut: '12:05', breakIn: '13:05', signOut: '18:01' }, // Late
  { empId: 'EMP003', date: createPastDate(3), signIn: '08:01', breakOut: '12:02', breakIn: '13:01', signOut: '17:03' },
  { empId: 'EMP004', date: createPastDate(3), signIn: '08:05', breakOut: '12:00', breakIn: '13:00', signOut: '17:02' },

  // --- 4 Days Ago ---
  { empId: 'EMP002', date: createPastDate(4), signIn: '08:45', breakOut: '12:00', breakIn: '13:00', signOut: '17:45' },
  { empId: 'EMP004', date: createPastDate(4), signIn: '08:10', breakOut: '12:15', breakIn: '13:10', signOut: '17:15' },
  { empId: 'EMP009', date: createPastDate(4), signIn: '09:05', breakOut: '12:00', breakIn: '13:00', signOut: '18:00' }, // Late

  // --- 5 Days Ago ---
  { empId: 'EMP001', date: createPastDate(5), signIn: '08:00', breakOut: '12:00', breakIn: '13:00', signOut: '17:00' },
  { empId: 'EMP002', date: createPastDate(5), signIn: '08:59', breakOut: '12:00', breakIn: '13:00', signOut: '17:59' },
  { empId: 'EMP003', date: createPastDate(5), signIn: '08:03', breakOut: '12:00', breakIn: '13:00', signOut: '17:00' },
  // EMP004 was absent 5 days ago
  { empId: 'EMP009', date: createPastDate(5), signIn: '08:00', breakOut: '12:00', breakIn: '13:00', signOut: '17:00' },
];

// ============================================================================
// LEAVE MANAGEMENT DATA
// ============================================================================

export const initialLeaveRequests = [
  // --- PENDING REQUESTS ---
  { leaveId: 'LVE003', leaveType: 'Vacation', empId: 'EMP001', name: 'Alice Johnson', position: 'Packer', days: 5, dateFrom: '2025-09-15', dateTo: '2025-09-19', reason: 'Annual trip with family.', status: 'Pending' },
  { leaveId: 'LVE004', leaveType: 'Personal Leave', empId: 'EMP004', name: 'David Green', position: 'Lifter', days: 1, dateFrom: '2025-08-22', dateTo: '2025-08-22', reason: 'Appointment at a government office.', status: 'Pending' },
  { leaveId: 'LVE005', leaveType: 'Unpaid Leave', empId: 'EMP009', name: 'Ivy Lee', position: 'Packer', days: 3, dateFrom: '2025-10-01', dateTo: '2025-10-03', reason: 'Personal matters.', status: 'Pending' },

  // --- APPROVED REQUESTS ---
  { leaveId: 'LVE001', leaveType: 'Vacation', empId: 'EMP002', name: 'Bob Smith', position: 'Lifter', days: 5, dateFrom: '2025-04-21', dateTo: '2025-04-25', reason: 'Family vacation to Palawan.', status: 'Approved' },
  { leaveId: 'LVE002', leaveType: 'Sick Leave', empId: 'EMP003', name: 'Carol White', position: 'Picker', days: 2, dateFrom: '2025-05-05', dateTo: '2025-05-06', reason: 'Flu.', status: 'Approved' },
  { leaveId: 'LVE006', leaveType: 'Vacation', empId: 'EMP003', name: 'Carol White', position: 'Picker', days: 3, dateFrom: '2025-08-11', dateTo: '2025-08-13', reason: 'Short break.', status: 'Approved' }, 
  { leaveId: 'LVE007', leaveType: 'Sick Leave', empId: 'EMP002', name: 'Bob Smith', position: 'Lifter', days: 1, dateFrom: '2025-07-21', dateTo: '2025-07-21', reason: 'Fever and headache.', status: 'Approved' },
  { leaveId: 'LVE008', leaveType: 'Sick Leave', empId: 'EMP001', name: 'Alice Johnson', position: 'Packer', days: 3, dateFrom: '2025-06-02', dateTo: '2025-06-04', reason: 'Stomach flu, doctor advised rest.', status: 'Approved' },
  { leaveId: 'LVE009', leaveType: 'Vacation', empId: 'EMP004', name: 'David Green', position: 'Lifter', days: 10, dateFrom: '2025-01-20', dateTo: '2025-01-29', reason: 'Hometown festival.', status: 'Approved' },
  // NEW APPROVED LEAVES FOR TESTING
  { leaveId: 'LVE014', leaveType: 'Personal Leave', empId: 'EMP004', name: 'David Green', position: 'Lifter', days: 1, dateFrom: '2023-09-20', dateTo: '2023-09-20', reason: 'Family emergency.', status: 'Approved' },
  { leaveId: 'LVE015', leaveType: 'Sick Leave', empId: 'EMP009', name: 'Ivy Lee', position: 'Packer', days: 2, dateFrom: '2023-09-25', dateTo: '2023-09-26', reason: 'Migraine.', status: 'Approved' },
  
  // --- DECLINED REQUESTS ---
  { leaveId: 'LVE010', leaveType: 'Vacation', empId: 'EMP009', name: 'Ivy Lee', position: 'Packer', days: 2, dateFrom: '2025-08-18', dateTo: '2025-08-19', reason: 'Sudden plan with friends.', status: 'Declined' },
  { leaveId: 'LVE011', leaveType: 'Personal Leave', empId: 'EMP002', name: 'Bob Smith', position: 'Lifter', days: 1, dateFrom: '2025-07-30', dateTo: '2025-07-30', reason: 'Need to process bank documents.', status: 'Declined' },

  // --- CANCELLED REQUESTS ---
  { leaveId: 'LVE012', leaveType: 'Vacation', empId: 'EMP001', name: 'Alice Johnson', position: 'Packer', days: 2, dateFrom: '2025-08-18', dateTo: '2025-08-19', reason: 'Sudden plan with friends.', status: 'Canceled' },
  { leaveId: 'LVE013', leaveType: 'Personal Leave', empId: 'EMP002', name: 'Bob Smith', position: 'Lifter', days: 1, dateFrom: '2025-07-30', dateTo: '2025-07-30', reason: 'Need to process bank documents.', status: 'Canceled' },
];

// ============================================================================
// HOLIDAYS DATA
// ============================================================================

export const initialHolidaysData = [
  { id: 1, name: "New Year's Day", date: '2025-01-01', type: 'Regular Holiday' },
  { id: 2, name: 'Araw ng Kagitingan', date: '2025-04-09', type: 'Regular Holiday' },
  { id: 3, name: 'Maundy Thursday', date: '2025-04-17', type: 'Regular Holiday' },
  { id: 4, name: 'Good Friday', date: '2025-04-18', type: 'Regular Holiday' },
  { id: 5, name: 'Labor Day', date: '2025-05-01', type: 'Regular Holiday' },
  { id: 6, name: 'Independence Day', date: '2025-06-12', type: 'Regular Holiday' },
  { id: 7, name: 'National Heroes Day', date: '2025-08-25', type: 'Regular Holiday' },
  { id: 8, name: 'Bonifacio Day', date: '2025-11-30', type: 'Regular Holiday' },
  { id: 9, name: 'Christmas Day', date: '2025-12-25', type: 'Regular Holiday' },
  { id: 10, name: 'Rizal Day', date: '2025-12-30', type: 'Regular Holiday' },
  { id: 11, name: 'Chinese New Year', date: '2025-01-29', type: 'Special Non-Working Day' },
  { id: 12, name: 'EDSA People Power Revolution Anniversary', date: '2025-02-25', type: 'Special Non-Working Day' },
  { id: 13, name: 'Black Saturday', date: '2025-04-19', type: 'Special Non-Working Day' },
  { id: 14, name: 'Ninoy Aquino Day', date: '2025-08-21', type: 'Special Non-Working Day' },
  { id: 15, name: "All Saints' Day", date: '2025-11-01', type: 'Special Non-Working Day' },
  { id: 16, name: 'Feast of the Immaculate Conception of Mary', date: '2025-12-08', type: 'Special Non-Working Day' },
  { id: 17, name: 'Last Day of the Year', date: '2025-12-31', type: 'Special Non-Working Day' },
];

// ============================================================================
// SCHEDULE TEMPLATES DATA
// ============================================================================

export const initialTemplatesData = [
  { id: 'TPL01', name: 'Warehouse Day Shift', description: 'Standard 8-5 shift for warehouse personnel.', columns: ['shift', 'area_assignment'], applicablePositions: ['Packer', 'Picker', 'Mover'] },
  { id: 'TPL02', name: 'Lifter Operations', description: 'Schedule for equipment operators.', columns: ['shift', 'equipment_id'], applicablePositions: ['Lifter'] },
  { id: 'TPL03', name: 'Office Staff Schedule', description: 'Standard office hours.', columns: ['shift'], applicablePositions: ['HR Personnel'] },
];

// ============================================================================
// TRAINING & DEVELOPMENT DATA
// ============================================================================

export const initialTrainingPrograms = [
  { id: 1, title: 'Leadership Training 101', description: 'Basic leadership skills for new managers and team leaders.', provider: 'Internal HR', duration: '4 Weeks' },
  { id: 2, title: 'Forklift Operation Certification', description: 'Safety and operation training for lift equipment.', provider: 'TESDA Accredited Center', duration: '40 Hours' },
  { id: 3, title: 'Workplace Safety & First Aid', description: 'Standard safety protocols and first aid certification.', provider: 'Red Cross', duration: '8 Hours' },
];

export const initialEnrollments = [
  { enrollmentId: 1, employeeId: 'EMP002', programId: 1, status: 'Completed', progress: 100 },
  { enrollmentId: 2, employeeId: 'EMP003', programId: 1, status: 'In Progress', progress: 75 },
  { enrollmentId: 3, employeeId: 'EMP001', programId: 3, status: 'In Progress', progress: 50 },
  { enrollmentId: 4, employeeId: 'EMP004', programId: 3, status: 'Not Started', progress: 0 },
  { enrollmentId: 5, employeeId: 'EMP002', programId: 2, status: 'Completed', progress: 100 },
];

// ============================================================================
// RECRUITMENT DATA
// ============================================================================

export const initialJobOpenings = [
  { id: 1, title: 'Warehouse Packer', department: 'Operations', status: 'Open', datePosted: '2023-10-01' },
  { id: 2, title: 'HR Assistant', department: 'Human Resources', status: 'Open', datePosted: '2023-09-15' },
  { id: 3, title: 'Forklift Operator', department: 'Operations', status: 'Closed', datePosted: '2023-08-01' },
];

export const initialApplicants = [
  { id: 1, name: 'John Doe', email: 'john.d@email.com', phone: '123-456-7890', jobOpeningId: 1, status: 'Interview', applicationDate: '2023-10-10', resumeUrl: '#', birthday: '1995-05-20', gender: 'Male', sssNo: '34-1234567-8', tinNo: '123-456-789-000', pagIbigNo: '123456789012', philhealthNo: '010123456789', interviewDate: '2023-10-15T10:00', lastStatusUpdate: '2023-10-12T14:30:00Z' },
  { id: 2, name: 'Jane Smith', email: 'jane.s@email.com', phone: '234-567-8901', jobOpeningId: 2, status: 'Screening', applicationDate: '2023-10-08', resumeUrl: '#', birthday: '1998-11-10', gender: 'Female', sssNo: '34-8765432-1', tinNo: '321-654-987-000', pagIbigNo: '210987654321', philhealthNo: '020987654321', interviewDate: null, lastStatusUpdate: '2023-10-09T11:00:00Z' },
];

// ============================================================================
// PERFORMANCE MANAGEMENT DATA
// ============================================================================

export const initialKrasData = [
  { id: 'KRA01', title: 'Warehouse Efficiency', description: 'Measures the speed and accuracy of warehouse tasks.' },
  { id: 'KRA02', title: 'Safety & Compliance', description: 'Adherence to safety protocols and proper equipment handling.' },
  { id: 'KRA03', title: 'HR Process Management', description: 'Effectiveness in managing HR-related tasks and documentation.' },
];

export const initialKpisData = [
  { id: 'KPI01', kraId: 'KRA01', title: 'Picking Accuracy', description: 'Percentage of orders picked without errors.', weight: 50, appliesToPositionIds: [4] },
  { id: 'KPI02', kraId: 'KRA01', title: 'Packing Speed', description: 'Average number of packages prepared per hour.', weight: 50, appliesToPositionIds: [2] },
  { id: 'KPI07', kraId: 'KRA01', title: 'Movement Time', description: 'Average time to transport goods between zones.', weight: 100, appliesToPositionIds: [5] },
  { id: 'KPI03', kraId: 'KRA02', title: 'Safety Incident Rate', description: 'Number of reported safety incidents.', weight: 70, appliesToPositionIds: [3, 5] },
  { id: 'KPI04', kraId: 'KRA02', title: 'Equipment Maintenance Checks', description: 'Completion of pre-shift equipment checks.', weight: 30, appliesToPositionIds: [3] },
  { id: 'KPI05', kraId: 'KRA03', title: 'Recruitment Time-to-Fill', description: 'Average time taken to fill open positions.', weight: 60, appliesToPositionIds: [1] },
  { id: 'KPI06', kraId: 'KRA03', title: 'Payroll Accuracy', description: 'Percentage of payroll runs with zero errors.', weight: 40, appliesToPositionIds: [1] },
];

export const initialEvaluationFactors = [
  { 
    id: 'factor_behavior', 
    title: 'Behavioral Competencies', 
    type: 'rating_scale', 
    items: [
      { 
        id: 'bhv_teamwork', 
        name: 'Teamwork & Collaboration', 
        description: 'Works effectively with others to achieve common goals; shares information and supports team members.',
        b_a_r_s: {
          1: "Consistently works in isolation, negatively impacts team morale, and is unwilling to help others.",
          2: "Rarely offers assistance, participates only when prompted, and sometimes withholds information.",
          3: "Reliably participates in team tasks, shares necessary information, and is a dependable team member.",
          4: "Frequently and proactively offers help to teammates and actively fosters a positive environment.",
          5: "Acts as a role model for collaboration, proactively mentors teammates, and takes initiative to improve team processes."
        }
      },
      { 
        id: 'bhv_communication', 
        name: 'Communication', 
        description: 'Clearly and effectively conveys information and ideas to individuals or groups in a timely manner.' 
      },
      { 
        id: 'bhv_professionalism', 
        name: 'Professionalism & Integrity', 
        description: 'Demonstrates a high standard of professional conduct, ethics, accountability, and aligns with company values.' 
      },
    ]
  },
  { 
    id: 'factor_work_quality', 
    title: 'Work Quality', 
    type: 'rating_scale',
    items: [
      { id: 'wq_accuracy', name: 'Accuracy & Attention to Detail', description: 'Completes tasks with a high degree of precision, minimizing errors and rework.' },
      { id: 'wq_efficiency', name: 'Efficiency & Time Management', description: 'Effectively manages time and resources to meet deadlines and complete tasks efficiently.' },
    ]
  },
  {
    id: 'factor_potential',
    title: 'Potential & Growth',
    type: 'rating_scale',
    description: 'This section assesses forward-looking indicators of an employee\'s potential for growth within the company.',
    items: [
      { id: 'pot_learning_agility', name: 'Learning Agility', description: 'Demonstrates the ability to learn quickly, adapt to new situations, and apply feedback effectively.' },
      { id: 'pot_ambition_drive', name: 'Ambition & Drive', description: 'Shows initiative, seeks out new challenges, and expresses a desire for career progression.' },
      { id: 'pot_leadership', name: 'Leadership Capability', description: 'Exhibits potential to lead others, either formally or informally, by inspiring and mentoring.' },
    ]
  },
  {
    id: 'factor_engagement',
    title: 'Engagement & Alignment',
    type: 'rating_scale',
    description: 'This section measures factors directly related to job satisfaction and an employee\'s alignment with the team and company.',
    items: [
      { id: 'eng_role_satisfaction', name: 'Role Satisfaction', description: 'Appears energized and fulfilled by their day-to-day responsibilities.' },
      { id: 'eng_growth_opportunity', name: 'Career Growth Opportunities', description: 'Sees a clear and viable path for advancement and skill development within the company.' },
    ]
  },
  {
    id: 'factor_kpis',
    title: 'Key Performance Indicators (KPIs)',
    type: 'kpi_section',
  },
  {
    id: 'factor_evaluator_summary',
    title: "Evaluator's Overall Summary",
    type: 'textarea',
    description: "Provide a holistic summary of the individual's performance, highlighting key achievements and overall contributions during this review period."
  },
  {
    id: 'factor_development_areas',
    title: "Key Strengths & Development Areas",
    type: 'textarea',
    description: "Identify 1-2 key strengths to leverage and 1-2 areas for focused development for the next review period."
  }
];

export const initialEvaluationsData = [
  {
    id: 'EVAL01',
    employeeId: 'EMP001',
    evaluatorId: 'EMP003',
    periodStart: '2025-01-01',
    periodEnd: '2025-06-30',
    status: 'Completed',
    factorScores: {
      'bhv_teamwork': { score: 5, comments: 'Always willing to help others in the warehouse. A true team player.' },
      'bhv_communication': { score: 4, comments: 'Communicates clearly with the team leader about order status.' },
      'bhv_professionalism': { score: 5, comments: '' },
      'wq_accuracy': { score: 5, comments: 'Consistently double-checks work, resulting in zero return rates for her packages.' },
      'wq_efficiency': { score: 4, comments: 'Meets packing speed targets consistently.' },
      'pot_learning_agility': { score: 4, comments: 'Quickly learned the new scanning system.' },
      'pot_ambition_drive': { score: 4, comments: '' },
      'pot_leadership': { score: 3, comments: 'Informally helps guide new packers.' },
      'eng_role_satisfaction': { score: 5, comments: '' },
      'eng_growth_opportunity': { score: 4, comments: '' },
      'KPI02': { score: 4, comments: 'Meets the target of packages per hour.' },
      'factor_evaluator_summary': { value: 'Alice is a top performer and a key asset to the warehouse team. Her efficiency and attention to detail are outstanding.' },
      'factor_development_areas': { value: 'Continue to lead by example in packing efficiency and mentor new packers. Explore cross-training as a Picker.' },
    },
    overallScore: 92.50,
  },
  {
    id: 'EVAL02',
    employeeId: 'EMP009',
    evaluatorId: 'EMP003',
    periodStart: '2025-01-01',
    periodEnd: '2025-06-30',
    status: 'Completed',
    factorScores: {
      'bhv_teamwork': { score: 3, comments: 'Works well independently, can be more proactive in helping teammates.' },
      'bhv_communication': { score: 4, comments: '' },
      'bhv_professionalism': { score: 4, comments: '' },
      'wq_accuracy': { score: 3, comments: 'A few minor errors in packing lists were noted this period. Improvement needed in double-checking.' },
      'wq_efficiency': { score: 3, comments: 'Packing speed is just below the team average. Can improve with more focus.' },
      'pot_learning_agility': { score: 3, comments: '' },
      'pot_ambition_drive': { score: 3, comments: '' },
      'pot_leadership': { score: 2, comments: '' },
      'eng_role_satisfaction': { score: 3, comments: '' },
      'eng_growth_opportunity': { score: 3, comments: '' },
      'KPI02': { score: 3, comments: 'Slightly below target on average packages per hour.' },
      'factor_evaluator_summary': { value: 'Ivy is a reliable team member who follows instructions well. Focus for the next period should be on improving speed and accuracy to meet team standards.' },
      'factor_development_areas': { value: 'Strengths: Diligent and follows rules. Development Areas: 1. Shadow Alice for one shift to learn efficiency techniques. 2. Implement a personal double-check system before sealing packages.' },
    },
    overallScore: 78.00,
  },
  {
    id: 'EVAL03',
    employeeId: 'EMP004',
    evaluatorId: 'EMP002',
    periodStart: '2025-01-01',
    periodEnd: '2025-06-30',
    status: 'Completed',
    factorScores: {
      'bhv_teamwork': { score: 4, comments: 'Coordinates well with pickers and movers.' },
      'bhv_communication': { score: 4, comments: 'Uses hand signals and radio effectively.' },
      'bhv_professionalism': { score: 5, comments: '' },
      'wq_accuracy': { score: 4, comments: '' },
      'wq_efficiency': { score: 5, comments: 'Very efficient in moving pallets, minimizes downtime.' },
      'pot_learning_agility': { score: 4, comments: '' },
      'pot_ambition_drive': { score: 4, comments: '' },
      'pot_leadership': { score: 3, comments: '' },
      'eng_role_satisfaction': { score: 4, comments: '' },
      'eng_growth_opportunity': { score: 3, comments: '' },
      'KPI03': { score: 5, comments: 'Zero safety incidents reported for David this period.' },
      'KPI04': { score: 4, comments: 'Completes pre-shift checks consistently.' },
      'factor_evaluator_summary': { value: 'David is a highly efficient operator. His primary area for improvement is maintaining 100% adherence to all safety protocols, especially during busy periods.' },
      'factor_development_areas': { value: 'Strengths: Highly efficient and reliable. Development Areas: Attend the advanced forklift safety refresher course. Aim for zero safety protocol deviations in the next 6 months.' },
    },
    overallScore: 88.75,
  },
  {
    id: 'EVAL04',
    employeeId: 'EMP001',
    evaluatorId: 'EMP003',
    periodStart: '2024-07-01',
    periodEnd: '2024-12-31',
    status: 'Completed',
    factorScores: { /* ... abbreviated for brevity ... */ },
    overallScore: 90.00,
  },
    // --- NEW DATA POINT FOR DAVID GREEN (EMP004) ---
  {
    id: 'EVAL05', employeeId: 'EMP004', evaluatorId: 'EMP002', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed',
    factorScores: {
      'bhv_teamwork': { score: 2, comments: 'Has been working in isolation and is sometimes reluctant to assist others when asked.' },
      'wq_efficiency': { score: 2, comments: 'Noticeable decrease in the speed of pallet movements. Often seems disengaged.' },
      'KPI03': { score: 2, comments: 'Involved in one minor, non-injury incident due to rushing.' },
      'KPI04': { score: 3, comments: 'Checks are completed, but sometimes hastily.' },
    },
    overallScore: 46.80,
  },
  // --- NEW DATA ---
  {
    id: 'EVAL06', employeeId: 'EMP002', evaluatorId: 'EMP005', periodStart: '2024-07-01', periodEnd: '2024-12-31', status: 'Completed',
    factorScores: { 'bhv_teamwork': { score: 4 }, 'wq_efficiency': { score: 4 }, 'KPI03': { score: 4 }, 'KPI04': { score: 4 } },
    overallScore: 85.00,
  },
  {
    id: 'EVAL07', employeeId: 'EMP002', evaluatorId: 'EMP005', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed',
    factorScores: { 'bhv_teamwork': { score: 4 }, 'wq_efficiency': { score: 5 }, 'KPI03': { score: 4 }, 'KPI04': { score: 5 } },
    overallScore: 88.00,
  },
  {
    id: 'EVAL08', employeeId: 'EMP003', evaluatorId: 'EMP005', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed',
    factorScores: { 'bhv_teamwork': { score: 5 }, 'wq_accuracy': { score: 5 }, 'KPI02': { score: 5 } },
    overallScore: 91.00,
  },
  {
    id: 'EVAL09', employeeId: 'EMP001', evaluatorId: 'EMP003', periodStart: '2024-01-01', periodEnd: '2024-06-30', status: 'Completed',
    factorScores: { 'bhv_teamwork': { score: 4 }, 'wq_accuracy': { score: 4 }, 'KPI02': { score: 5 } },
    overallScore: 88.50,
  },
  {
    id: 'EVAL10', employeeId: 'EMP009', evaluatorId: 'EMP003', periodStart: '2024-07-01', periodEnd: '2024-12-31', status: 'Completed',
    factorScores: { 'bhv_teamwork': { score: 4 }, 'wq_accuracy': { score: 4 }, 'KPI02': { score: 3 } },
    overallScore: 82.00,
  }
];

// ============================================================================
// NOTIFICATIONS DATA
// ============================================================================

export const initialNotificationsData = [
  { id: 1, type: 'leave_request', message: 'Bob Smith has requested a new vacation leave.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
  { id: 2, type: 'performance_review', message: 'Your performance evaluation for H2 2023 is due next week.', timestamp: new Date(Date.now() - 86400000).toISOString(), read: false },
  { id: 3, type: 'recruitment', message: 'A new applicant, Jane Smith, has applied for the HR Assistant role.', timestamp: new Date(Date.now() - 172800000).toISOString(), read: false },
  { id: 4, type: 'system_update', message: 'The payroll module has been updated with new tax regulations.', timestamp: new Date(Date.now() - 259200000).toISOString(), read: true },
  { id: 5, type: 'training', message: 'You have been enrolled in "Workplace Safety & First Aid".', timestamp: new Date(Date.now() - 604800000).toISOString(), read: true },
];

// ============================================================================
// PAYROLL DATA
// ============================================================================

// src/data/mockData.js (partial - only the updated array is shown)

export const initialPayrollsData = [
  {
    runId: 'RUN-2023-10-31',
    cutOff: '2023-10-16 to 2023-10-31',
    payrollType: 'Semi-monthly',
    records: [
      { 
        payrollId: 'PAY003', 
        empId: 'EMP001', 
        employeeName: 'Alice Johnson',
        period: 'Oct 16-31, 2023',
        paymentDate: '2023-11-05',
        payStartDate: '2023-10-16',
        payEndDate: '2023-10-31',
        earnings: [
          { description: 'Regular Pay', hours: 88, amount: 9000.00 },
          { description: 'Overtime Pay', hours: 5.5, amount: 511.36 }
        ],
        deductions: { tax: 351.36, sss: 405, philhealth: 200, hdmf: 100 },
        otherDeductions: [
          { description: 'Company Loan', loanAmount: 5000.00, amount: 1000.00, outstandingBalance: 4000.00 }
        ],
        absences: [],
        leaveBalances: { vacation: 12.5, sick: 8, personal: 5 },
        status: 'Paid'
      },
      { 
        payrollId: 'PAY004', 
        empId: 'EMP003', 
        employeeName: 'Carol White',
        period: 'Oct 16-31, 2023',
        paymentDate: '2023-11-05',
        payStartDate: '2023-10-16',
        payEndDate: '2023-10-31',
        earnings: [
          { description: 'Regular Pay', hours: 88, amount: 9000.00 },
        ],
        deductions: { tax: 351.36, sss: 405, philhealth: 200, hdmf: 100 },
        otherDeductions: [],
        absences: [],
        leaveBalances: { vacation: 10, sick: 5, personal: 5 },
        status: 'Pending'
      },
    ]
  },
  {
    runId: 'RUN-2023-10-15',
    cutOff: '2023-10-01 to 2023-10-15',
    payrollType: 'Semi-monthly',
    records: [
      { 
        payrollId: 'PAY001', 
        empId: 'EMP001', 
        employeeName: 'Alice Johnson',
        period: 'Oct 1-15, 2023',
        paymentDate: '2023-10-20',
        payStartDate: '2023-10-01',
        payEndDate: '2023-10-15',
        earnings: [
          { description: 'Regular Pay', hours: 80, amount: 8181.82 },
          { description: 'Holiday Pay', hours: 8, amount: 950.00 },
          { description: 'Leave Pay', hours: 8, amount: 818.18 }
        ],
        deductions: { tax: 452.27, sss: 405, philhealth: 200, hdmf: 100 },
        otherDeductions: [],
        absences: [{ description: 'Excused', startDate: '2023-10-10', endDate: '2023-10-10', totalDays: 1 }],
        leaveBalances: { vacation: 13, sick: 8, personal: 5 },
        status: 'Paid' 
      },
      { 
        payrollId: 'PAY002', 
        empId: 'EMP002', 
        employeeName: 'Bob Smith',
        period: 'Oct 1-15, 2023',
        paymentDate: '2023-10-20',
        payStartDate: '2023-10-01',
        payEndDate: '2023-10-15',
        earnings: [
          { description: 'Regular Pay', hours: 80, amount: 10000.00 },
          { description: 'Allowance', hours: null, amount: 1000.00 },
        ],
        deductions: { tax: 650, sss: 495, philhealth: 275, hdmf: 100 },
        otherDeductions: [
          { description: 'Pag-IBIG Loan', loanAmount: 20000.00, amount: 1500.00, outstandingBalance: 18500.00 }
        ],
        absences: [],
        leaveBalances: { vacation: 5, sick: 3, personal: 5 },
        status: 'Paid' 
      },
    ]
  },
  {
    runId: 'RUN-2023-09-30',
    cutOff: '2023-09-16 to 2023-09-30',
    payrollType: 'Semi-monthly',
    records: [
      { 
        payrollId: 'PAY005', 
        empId: 'EMP002', 
        employeeName: 'Bob Smith',
        period: 'Sep 16-30, 2023',
        paymentDate: '2023-10-05',
        payStartDate: '2023-09-16',
        payEndDate: '2023-09-30',
        earnings: [
          { description: 'Regular Pay', hours: 88, amount: 11000.00 }
        ],
        deductions: { tax: 650, sss: 495, philhealth: 275, hdmf: 100 },
        otherDeductions: [
            { description: 'Pag-IBIG Loan', loanAmount: 20000.00, amount: 1500.00, outstandingBalance: 17000.00 }
        ],
        absences: [],
        leaveBalances: { vacation: 5.5, sick: 3.5, personal: 4 },
        status: 'Paid'
      },
      { 
        payrollId: 'PAY006', 
        empId: 'EMP004', 
        employeeName: 'David Green',
        period: 'Sep 16-30, 2023',
        paymentDate: '2023-10-05',
        payStartDate: '2023-09-16',
        payEndDate: '2023-09-30',
        earnings: [
          { description: 'Regular Pay', hours: 80, amount: 9090.91 },
          { description: 'Bonus', hours: null, amount: 2500.00 },
          { description: 'Leave Pay', hours: 8, amount: 909.09 }
        ],
        deductions: { tax: 980.50, sss: 495, philhealth: 275, hdmf: 100 },
        otherDsuctions: [],
        absences: [{ description: 'Excused', startDate: '2023-09-20', endDate: '2023-09-20', totalDays: 1 }],
        leaveBalances: { vacation: 8, sick: 7, personal: 4 },
        status: 'Paid'
      },
    ]
  },
  {
    runId: 'RUN-2023-09-15',
    cutOff: '2023-09-01 to 2023-09-15',
    payrollType: 'Semi-monthly',
    records: [
      { 
        payrollId: 'PAY007', 
        empId: 'EMP001', 
        employeeName: 'Alice Johnson',
        period: 'Sep 1-15, 2023',
        paymentDate: '2023-09-20',
        payStartDate: '2023-09-01',
        payEndDate: '2023-09-15',
        earnings: [
          { description: 'Regular Pay', hours: 80, amount: 8181.82 },
          { description: 'Leave Pay', hours: 8, amount: 818.18 }
        ],
        deductions: { tax: 351.36, sss: 405, philhealth: 200, hdmf: 100 },
        otherDeductions: [
          { description: 'Company Loan', loanAmount: 5000.00, amount: 1000.00, outstandingBalance: 3000.00 }
        ],
        absences: [{ description: 'Excused', startDate: '2023-09-05', endDate: '2023-09-05', totalDays: 1 }],
        leaveBalances: { vacation: 13.5, sick: 8, personal: 5 },
        status: 'Paid' 
      },
      { 
        payrollId: 'PAY008', 
        empId: 'EMP009', 
        employeeName: 'Ivy Lee',
        period: 'Sep 1-15, 2023',
        paymentDate: '2023-09-20',
        payStartDate: '2023-09-01',
        payEndDate: '2023-09-15',
        earnings: [
          { description: 'Regular Pay', hours: 88, amount: 9000.00 },
        ],
        deductions: { tax: 351.36, sss: 405, philhealth: 200, hdmf: 100 },
        otherDeductions: [],
        absences: [],
        leaveBalances: { vacation: 10, sick: 10, personal: 3 },
        status: 'Paid' 
      },
    ]
  }
];

// ============================================================================
// CASE MANAGEMENT DATA
// ============================================================================

export const initialCasesData = [
  {
    caseId: 'CASE001',
    employeeId: 'EMP004',
    issueDate: '2025-06-15',
    actionType: 'Verbal Warning',
    reason: 'Tardiness',
    description: 'Employee was 25 minutes late on 2025-06-14 without prior notification.',
    status: 'Ongoing',
    attachments: [],
    nextSteps: 'Monitor attendance for the next 30 days.',
    actionLog: [
      { date: '2025-06-15', action: 'Case Created. Verbal warning issued by HR Manager Grace Field.' },
      { date: '2025-06-16', action: 'Follow-up discussion held with employee and their team leader, Carol White.' }
    ]
  },
  {
    caseId: 'CASE002',
    employeeId: 'EMP009',
    issueDate: '2025-05-20',
    actionType: 'Written Warning',
    reason: 'Safety Violation',
    description: 'Observed operating machinery without required safety goggles, despite previous verbal reminders.',
    status: 'Closed',
    attachments: ['safety_report_q2.pdf'],
    nextSteps: 'Additional safety training completed on 2025-05-28.',
    actionLog: [
      { date: '2025-05-20', action: 'Case Created. Written warning issued and signed by employee.' },
      { date: '2025-05-28', action: 'Safety training course completed. Certificate attached.' },
      { date: '2025-06-20', action: 'Case reviewed and closed by HR Manager.' }
    ]
  },
];

// ============================================================================
// USER ACCOUNTS DATA
// ============================================================================

export const initialUserAccounts = [
  { employeeId: 'EMP005', username: 'hr_user', password: 'password123', status: 'Active' },
  { employeeId: 'EMP003', username: 'leader_carol', password: 'password123', status: 'Active' },
  { employeeId: 'EMP002', username: 'leader_bob', password: 'password123', status: 'Active' },
  { employeeId: 'EMP001', username: 'employee_alice', password: 'password123', status: 'Active' },
  { employeeId: 'EMP010', username: 'frank_black', password: 'disabledpassword', status: 'Deactivated' },
];

// ============================================================================
// ARCHIVED CONTRIBUTIONS DATA
// ============================================================================

export const initialArchivedContributions = [
  {
    id: 'ARCHIVE-SSS-1',
    type: 'SSS',
    payPeriod: '2023-10-01 to 2023-10-15',
    generationDate: '2023-10-20T10:00:00Z',
    generatedBy: 'Grace Field',
    columns: [
      { key: 'no', label: 'No.', editable: false, isPermanent: true },
      { key: 'sssNo', label: 'SSS Number', editable: false, isPermanent: true },
      { key: 'lastName', label: 'Last Name', editable: false, isPermanent: true },
      { key: 'firstName', label: 'First Name', editable: false, isPermanent: true },
      { key: 'middleName', label: 'Middle Name', editable: false, isPermanent: true },
      { key: 'employeeContribution', label: 'EE Share', editable: true, isPermanent: false },
      { key: 'employerContribution', label: 'ER Share', editable: true, isPermanent: false },
      { key: 'totalContribution', label: 'Total', editable: true, isPermanent: false },
    ],
    rows: [
      { no: 1, sssNo: '34-456', lastName: 'Johnson', firstName: 'Alice', middleName: '', employeeContribution: 290.65, employerContribution: 290.65, totalContribution: 581.30 },
      { no: 2, sssNo: '34-789', lastName: 'Smith', firstName: 'Bob', middleName: '', employeeContribution: 450, employerContribution: 450, totalContribution: 900.00 },
    ],
    headerData: { 'Employer ID Number': '03-9-1234567-8', 'Employer Name': 'Lapeco Group of Companies', 'Contribution Month': 'October 2023' }
  },
  {
    id: 'ARCHIVE-PH-1',
    type: 'PhilHealth',
    payPeriod: '2023-10-01 to 2023-10-15',
    generationDate: '2023-10-20T10:05:00Z',
    generatedBy: 'Grace Field',
    columns: [
        { key: 'no', label: 'No.', editable: false, isPermanent: true },
        { key: 'philhealthNo', label: 'PhilHealth Number', editable: false, isPermanent: true },
        { key: 'lastName', label: 'Last Name', editable: false, isPermanent: true },
        { key: 'firstName', label: 'First Name', editable: false, isPermanent: true },
        { key: 'middleName', label: 'Middle Name', editable: false, isPermanent: true },
        { key: 'employeeContribution', label: 'EE Share', editable: true, isPermanent: false },
        { key: 'employerContribution', label: 'ER Share', editable: true, isPermanent: false },
        { key: 'totalContribution', label: 'Total', editable: true, isPermanent: false },
    ],
    rows: [
      { no: 1, philhealthNo: '1120-2485-8688', lastName: 'Johnson', firstName: 'Alice', middleName: '', employeeContribution: 200, employerContribution: 200, totalContribution: 400 },
      { no: 2, philhealthNo: '0825-3830-9814', lastName: 'Smith', firstName: 'Bob', middleName: '', employeeContribution: 220, employerContribution: 220, totalContribution: 440 },
    ],
    headerData: { 'Employer Name': 'Lapeco Group of Companies', 'Contribution Month': 'October 2023' }
  }
];