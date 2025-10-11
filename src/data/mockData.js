const createPastDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Utility function for creating schedule entries
const createScheduleEntry = (id, empId, date, startTime = '08:00', endTime = '17:00') => ({
  scheduleId: id, 
  empId, 
  date: createPastDate(date), 
  start_time: startTime,
  end_time: endTime
});

export const initialEmployeesData = [
  { 
    id: 'EMP001', firstName: 'Alice', middleName: 'Marie', lastName: 'Johnson', name: 'Alice Marie Johnson', positionId: 2, isTeamLeader: false, email: 'alice.j@example.com', joiningDate: '2022-03-15', gender: 'Female', birthday: '1993-02-18', sssNo: '34-456', tinNo: '321-654', pagIbigNo: '1213-1695-8596', philhealthNo: '1120-2485-8688', status: 'Active', contactNumber: '9123456789', address: '123 Main St, Anytown, USA', resumeUrl: null, leaveCredits: { sick: 15, vacation: 15, personal: 5 }
  },
  { 
    id: 'EMP002', firstName: 'Bob', middleName: '', lastName: 'Smith', name: 'Bob Smith', positionId: 3, isTeamLeader: true, email: 'bob.s@example.com', joiningDate: '2021-07-01', gender: 'Male', birthday: '1989-08-25', sssNo: '34-789', tinNo: '987-654', pagIbigNo: '1210-6385-5854', philhealthNo: '0825-3830-9814', status: 'Active', contactNumber: '9123456789', address: '123 Main St, Anytown, USA', resumeUrl: null, leaveCredits: { sick: 15, vacation: 15, personal: 5, paternity: 4 }
  },
  { 
    id: 'EMP003', firstName: 'Carol', middleName: '', lastName: 'White', name: 'Carol White', positionId: 2, isTeamLeader: true, email: 'carol.w@example.com', joiningDate: '2023-01-10', gender: 'Female', birthday: '1996-12-01', sssNo: '34-123', tinNo: '123-456', pagIbigNo: '1210-5865-0865', philhealthNo: '0802-6579-1208', status: 'Active', contactNumber: '9123456789', address: '123 Main St, Anytown, USA', resumeUrl: null, leaveCredits: { sick: 15, vacation: 15, personal: 5 }
  },
  { 
    id: 'EMP004', firstName: 'David', middleName: '', lastName: 'Green', name: 'David Green', positionId: 3, isTeamLeader: false, email: 'david.g@example.com', joiningDate: '2023-05-20', gender: 'Male', birthday: '1999-04-30', sssNo: '34-101', tinNo: '777-888', pagIbigNo: '1215-1312-7883', philhealthNo: '0805-1312-7883', status: 'Active', contactNumber: '9123456789', address: '123 Main St, Anytown, USA', resumeUrl: null, leaveCredits: { sick: 12, vacation: 12, personal: 4, paternity: 4 }
  },
  { 
    id: 'EMP005', firstName: 'Grace', middleName: 'Anne', lastName: 'Field', name: 'Grace Anne Field', positionId: 1, isTeamLeader: false, email: 'grace.f@example.com', joiningDate: '2020-11-20', gender: 'Female', birthday: '1995-07-19', sssNo: '34-202', tinNo: '222-333', pagIbigNo: '1211-9050-5943', philhealthNo: '1908-9634-9159', status: 'Active', contactNumber: '9123456789', address: '123 Main St, Anytown, USA', resumeUrl: null, leaveCredits: { sick: 15, vacation: 20, personal: 5 }
  },
{ 
    id: 'EMP006', firstName: 'Ethan', middleName: '', lastName: 'Hunt', name: 'Ethan Hunt', positionId: null, isTeamLeader: false, email: 'ethan.h@example.com', joiningDate: '2022-01-15', gender: 'Male', birthday: '1994-08-11', sssNo: '34-606', tinNo: '666-777', pagIbigNo: '1213-8482-9191', philhealthNo: '0808-1234-5678', status: 'Resigned', contactNumber: '9123456789', address: '456 Side St, Sometown, USA', resumeUrl: null, leaveCredits: { sick: 5, vacation: 8, personal: 2, paternity: 7 }
  },
  {
    id: 'EMP007', firstName: 'Jack', middleName: '', lastName: 'Reacher', name: 'Jack Reacher', 
    positionId: 5, 
    isTeamLeader: false, email: 'jack.r@example.com', joiningDate: '2021-05-10', gender: 'Male', birthday: '1985-10-29', sssNo: '34-707', tinNo: '777-000', pagIbigNo: '1214-1234-1234', philhealthNo: '0809-9876-5432', status: 'Terminated', contactNumber: '9129876543', address: 'Unknown', resumeUrl: null, 
    leaveCredits: { sick: 0, vacation: 3, personal: 0, paternity: 0 }
  },
  { 
    id: 'EMP009', firstName: 'Ivy', middleName: '', lastName: 'Lee', name: 'Ivy Lee', positionId: 2, isTeamLeader: false, email: 'ivy.l@example.com', joiningDate: '2023-08-12', gender: 'Female', birthday: '2000-10-10', sssNo: '34-999', tinNo: '111-222', pagIbigNo: '1210-8451-2548', philhealthNo: '0902-5184-4185', status: 'Active', contactNumber: '9123456789', address: '123 Main St, Anytown, USA', resumeUrl: null, leaveCredits: { sick: 10, vacation: 10, personal: 3 }
  },
  { 
    id: 'EMP010', firstName: 'Frank', middleName: '', lastName: 'Black', name: 'Frank Black', positionId: null, isTeamLeader: false, email: 'frank.b@example.com', joiningDate: '2023-09-01', gender: 'Male', birthday: '1998-05-15', sssNo: '34-303', tinNo: '444-555', pagIbigNo: '1212-7582-7302', philhealthNo: '0820-1209-8037', status: 'Resigned', contactNumber: '9123456789', address: '123 Main St, Anytown, USA', resumeUrl: null, 
    leaveCredits: { sick: 2, vacation: 5, personal: 1, paternity: 0 }
  },
  { id: 'EMP101', firstName: 'Henry', middleName: '', lastName: 'Miller', name: 'Henry Miller', positionId: 4, isTeamLeader: true, email: 'henry.m@example.com', joiningDate: '2022-08-20', gender: 'Male', birthday: '1991-06-15', sssNo: '34-111', tinNo: '123-111', pagIbigNo: '1111-2222-3333', philhealthNo: '4444-5555-6666', status: 'Active', contactNumber: '9876543210', address: '456 Oak Ave, Sometown, USA', resumeUrl: null, leaveCredits: { sick: 10, vacation: 12, personal: 3, paternity: 4 }},
  { id: 'EMP102', firstName: 'Jack', middleName: 'Robert', lastName: 'Davis', name: 'Jack Robert Davis', positionId: 4, isTeamLeader: false, email: 'jack.d@example.com', joiningDate: '2023-02-18', gender: 'Male', birthday: '1998-09-22', sssNo: '34-222', tinNo: '123-222', pagIbigNo: '2222-3333-4444', philhealthNo: '5555-6666-7777', status: 'Active', contactNumber: '9876543211', address: '789 Pine St, Anothertown, USA', resumeUrl: null, leaveCredits: { sick: 8, vacation: 10, personal: 2, paternity: 4 }},
  { id: 'EMP103', firstName: 'Karen', middleName: '', lastName: 'Wilson', name: 'Karen Wilson', positionId: 5, isTeamLeader: false, email: 'karen.w@example.com', joiningDate: '2021-11-05', gender: 'Female', birthday: '1994-03-12', sssNo: '34-333', tinNo: '123-333', pagIbigNo: '3333-4444-5555', philhealthNo: '6666-7777-8888', status: 'Active', contactNumber: '9876543212', address: '101 Maple Rd, Yourtown, USA', resumeUrl: null, leaveCredits: { sick: 12, vacation: 15, personal: 5 }},
  { id: 'EMP104', firstName: 'Liam', middleName: '', lastName: 'Moore', name: 'Liam Moore', positionId: 5, isTeamLeader: false, email: 'liam.m@example.com', joiningDate: '2023-07-30', gender: 'Male', birthday: '2001-01-01', sssNo: '34-444', tinNo: '123-444', pagIbigNo: '4444-5555-6666', philhealthNo: '7777-8888-9999', status: 'Active', contactNumber: '9876543213', address: '212 Birch Ln, Mytown, USA', resumeUrl: null, leaveCredits: { sick: 10, vacation: 10, personal: 3, paternity: 4 }},
  { id: 'EMP105', firstName: 'Mia', middleName: 'Chloe', lastName: 'Taylor', name: 'Mia Chloe Taylor', positionId: 2, isTeamLeader: false, email: 'mia.t@example.com', joiningDate: '2022-09-14', gender: 'Female', birthday: '1997-11-30', sssNo: '34-555', tinNo: '123-555', pagIbigNo: '5555-6666-7777', philhealthNo: '8888-9999-0000', status: 'Active', contactNumber: '9876543214', address: '333 Cedar Dr, Ourtown, USA', resumeUrl: null, leaveCredits: { sick: 9, vacation: 11, personal: 4 }},
  { id: 'EMP106', firstName: 'Noah', middleName: '', lastName: 'Anderson', name: 'Noah Anderson', positionId: 3, isTeamLeader: false, email: 'noah.a@example.com', joiningDate: '2023-01-25', gender: 'Male', birthday: '1999-07-07', sssNo: '34-666', tinNo: '123-666', pagIbigNo: '6666-7777-8888', philhealthNo: '9999-0000-1111', status: 'Active', contactNumber: '9876543215', address: '444 Spruce Ct, Theirtown, USA', resumeUrl: null, leaveCredits: { sick: 10, vacation: 10, personal: 3, paternity: 4 }},
  { id: 'EMP107', firstName: 'Olivia', middleName: '', lastName: 'Thomas', name: 'Olivia Thomas', positionId: 4, isTeamLeader: false, email: 'olivia.t@example.com', joiningDate: '2020-05-19', gender: 'Female', birthday: '1990-04-19', sssNo: '34-777', tinNo: '123-777', pagIbigNo: '7777-8888-9999', philhealthNo: '0000-1111-2222', status: 'Active', contactNumber: '9876543216', address: '555 Willow Way, Downtown, USA', resumeUrl: null, leaveCredits: { sick: 15, vacation: 18, personal: 5 }},
  { id: 'EMP108', firstName: 'Peter', middleName: '', lastName: 'Jackson', name: 'Peter Jackson', positionId: 1, isTeamLeader: false, email: 'peter.j@example.com', joiningDate: '2023-06-01', gender: 'Male', birthday: '1996-08-14', sssNo: '34-888', tinNo: '123-888', pagIbigNo: '8888-9999-0000', philhealthNo: '1111-2222-3333', status: 'Active', contactNumber: '9876543217', address: '666 Elm Pl, Uptown, USA', resumeUrl: null, leaveCredits: { sick: 10, vacation: 10, personal: 3, paternity: 4 }},
  { id: 'EMP109', firstName: 'Quinn', middleName: '', lastName: 'Harris', name: 'Quinn Harris', positionId: 2, isTeamLeader: false, email: 'quinn.h@example.com', joiningDate: '2022-12-10', gender: 'Female', birthday: '1995-02-28', sssNo: '34-990', tinNo: '123-990', pagIbigNo: '9999-0000-1111', philhealthNo: '2222-3333-4444', status: 'Inactive', contactNumber: '9876543218', address: '777 Redwood Ave, Midtown, USA', resumeUrl: null, leaveCredits: { sick: 0, vacation: 0, personal: 0 }},
  { id: 'EMP110', firstName: 'Rachel', middleName: 'Grace', lastName: 'Martin', name: 'Rachel Grace Martin', positionId: 3, isTeamLeader: false, email: 'rachel.m@example.com', joiningDate: '2023-03-03', gender: 'Female', birthday: '2000-12-25', sssNo: '34-100', tinNo: '123-100', pagIbigNo: '0000-1111-2222', philhealthNo: '3333-4444-5555', status: 'Active', contactNumber: '9876543219', address: '888 Aspen Cir, Outoftown, USA', resumeUrl: null, leaveCredits: { sick: 10, vacation: 10, personal: 3 }},
  { id: 'EMP111', firstName: 'Sam', middleName: '', lastName: 'Garcia', name: 'Sam Garcia', positionId: 5, isTeamLeader: true, email: 'sam.g@example.com', joiningDate: '2021-04-11', gender: 'Male', birthday: '1988-10-05', sssNo: '35-111', tinNo: '124-111', pagIbigNo: '1111-2222-4444', philhealthNo: '4444-5555-7777', status: 'Active', contactNumber: '9112223330', address: '111 Main St, Sometown, USA', resumeUrl: null, leaveCredits: { sick: 15, vacation: 15, personal: 5, paternity: 4 }},
  { id: 'EMP112', firstName: 'Tina', middleName: 'Fey', lastName: 'Rodriguez', name: 'Tina Fey Rodriguez', positionId: 5, isTeamLeader: false, email: 'tina.r@example.com', joiningDate: '2023-04-20', gender: 'Female', birthday: '1999-05-18', sssNo: '35-222', tinNo: '124-222', pagIbigNo: '2222-3333-5555', philhealthNo: '5555-6666-8888', status: 'Active', contactNumber: '9112223331', address: '222 Oak Ave, Mytown, USA', resumeUrl: null, leaveCredits: { sick: 10, vacation: 10, personal: 3 }},
  { id: 'EMP113', firstName: 'Uma', middleName: '', lastName: 'Lee', name: 'Uma Lee', positionId: 4, isTeamLeader: false, email: 'uma.l@example.com', joiningDate: '2022-06-22', gender: 'Female', birthday: '1996-01-20', sssNo: '35-333', tinNo: '124-333', pagIbigNo: '3333-4444-6666', philhealthNo: '6666-7777-9999', status: 'Active', contactNumber: '9112223332', address: '333 Pine St, Yourtown, USA', resumeUrl: null, leaveCredits: { sick: 11, vacation: 13, personal: 4 }},
  { id: 'EMP114', firstName: 'Victor', middleName: '', lastName: 'Walker', name: 'Victor Walker', positionId: 2, isTeamLeader: false, email: 'victor.w@example.com', joiningDate: '2023-08-01', gender: 'Male', birthday: '2000-08-08', sssNo: '35-444', tinNo: '124-444', pagIbigNo: '4444-5555-7777', philhealthNo: '7777-8888-0000', status: 'Active', contactNumber: '9112223333', address: '444 Maple Rd, Anothertown, USA', resumeUrl: null, leaveCredits: { sick: 10, vacation: 10, personal: 3, paternity: 4 }},
  { id: 'EMP115', firstName: 'Wendy', middleName: '', lastName: 'Hall', name: 'Wendy Hall', positionId: 3, isTeamLeader: false, email: 'wendy.h@example.com', joiningDate: '2021-09-15', gender: 'Female', birthday: '1992-09-15', sssNo: '35-555', tinNo: '124-555', pagIbigNo: '5555-6666-8888', philhealthNo: '8888-9999-1111', status: 'Active', contactNumber: '9112223334', address: '555 Birch Ln, Theirtown, USA', resumeUrl: null, leaveCredits: { sick: 14, vacation: 16, personal: 5 }},
  { id: 'EMP116', firstName: 'Xavier', middleName: '', lastName: 'Allen', name: 'Xavier Allen', positionId: 1, isTeamLeader: false, email: 'xavier.a@example.com', joiningDate: '2023-10-01', gender: 'Male', birthday: '1998-03-23', sssNo: '35-666', tinNo: '124-666', pagIbigNo: '6666-7777-9999', philhealthNo: '9999-0000-2222', status: 'Active', contactNumber: '9112223335', address: '666 Cedar Dr, Ourtown, USA', resumeUrl: null, leaveCredits: { sick: 10, vacation: 10, personal: 3, paternity: 4 }},
  { id: 'EMP117', firstName: 'Yara', middleName: 'Sofia', lastName: 'Young', name: 'Yara Sofia Young', positionId: 4, isTeamLeader: false, email: 'yara.y@example.com', joiningDate: '2022-01-10', gender: 'Female', birthday: '1997-07-17', sssNo: '35-777', tinNo: '124-777', pagIbigNo: '7777-8888-0000', philhealthNo: '0000-1111-3333', status: 'Inactive', contactNumber: '9112223336', address: '777 Spruce Ct, Downtown, USA', resumeUrl: null, leaveCredits: { sick: 0, vacation: 0, personal: 0 }},
  { id: 'EMP118', firstName: 'Zane', middleName: '', lastName: 'King', name: 'Zane King', positionId: 5, isTeamLeader: false, email: 'zane.k@example.com', joiningDate: '2023-11-20', gender: 'Male', birthday: '1999-11-11', sssNo: '35-888', tinNo: '124-888', pagIbigNo: '8888-9999-1111', philhealthNo: '1111-2222-4444', status: 'Active', contactNumber: '9112223337', address: '888 Willow Way, Uptown, USA', resumeUrl: null, leaveCredits: { sick: 10, vacation: 10, personal: 3, paternity: 4 }},
  { id: 'EMP119', firstName: 'Ava', middleName: '', lastName: 'Wright', name: 'Ava Wright', positionId: 2, isTeamLeader: false, email: 'ava.w@example.com', joiningDate: '2022-02-02', gender: 'Female', birthday: '1993-02-02', sssNo: '35-999', tinNo: '124-999', pagIbigNo: '9999-0000-2222', philhealthNo: '2222-3333-5555', status: 'Active', contactNumber: '9112223338', address: '999 Elm Pl, Midtown, USA', resumeUrl: null, leaveCredits: { sick: 12, vacation: 14, personal: 4 }},
  { id: 'EMP120', firstName: 'Ben', middleName: 'Carter', lastName: 'Hill', name: 'Ben Carter Hill', positionId: 3, isTeamLeader: false, email: 'ben.h@example.com', joiningDate: '2023-12-25', gender: 'Male', birthday: '2001-01-25', sssNo: '35-100', tinNo: '124-100', pagIbigNo: '0000-1111-3333', philhealthNo: '3333-4444-6666', status: 'Active', contactNumber: '9112223339', address: '121 Redwood Ave, Outoftown, USA', resumeUrl: null, leaveCredits: { sick: 10, vacation: 10, personal: 3, paternity: 4 }},
];


// ============================================================================
// POSITIONS DATA
// ============================================================================

export const initialPositionsData = [
  { 
    id: 1, title: 'HR Personnel', description: 'Handles recruitment, payroll, and employee relations.', monthlySalary: 35000, hourlyRate: 198.86, overtimeRate: 248.58, nightDiffRate: 19.89, lateDeductionPerMin: 3.31,
  },
  { 
    id: 2, title: 'Packer', description: 'Prepares and packs finished products for shipment.', monthlySalary: 18000, hourlyRate: 102.27, overtimeRate: 127.84, nightDiffRate: 10.23, lateDeductionPerMin: 1.70,
  },
  { 
    id: 3, title: 'Lifter', description: 'Operates lifting equipment to move heavy materials.', monthlySalary: 22000, hourlyRate: 125.00, overtimeRate: 156.25, nightDiffRate: 12.50, lateDeductionPerMin: 2.08,
  },
  { 
    id: 4, title: 'Picker', description: 'Selects items from inventory to fulfill orders.', monthlySalary: 18500, hourlyRate: 105.11, overtimeRate: 131.39, nightDiffRate: 10.51, lateDeductionPerMin: 1.75,
  },
  { 
    id: 5, title: 'Mover', description: 'Transports materials and goods within the facility.', monthlySalary: 19000, hourlyRate: 107.95, overtimeRate: 134.94, nightDiffRate: 10.80, lateDeductionPerMin: 1.80,
  },
];

// ============================================================================
// SCHEDULES DATA
// ============================================================================

export const initialSchedulesData = [
  createScheduleEntry(1, 'EMP001', 0),
  createScheduleEntry(2, 'EMP002', 0, '09:00', '18:00'),
  createScheduleEntry(3, 'EMP003', 0, '09:00', '18:00'),
  createScheduleEntry(4, 'EMP004', 0),
  createScheduleEntry(5, 'EMP001', 1),
  createScheduleEntry(6, 'EMP002', 1, '09:00', '18:00'),
  createScheduleEntry(7, 'EMP003', 1, '09:00', '18:00'),
  createScheduleEntry(8, 'EMP004', 1),
  createScheduleEntry(9, 'EMP009', 1),
  createScheduleEntry(10, 'EMP001', 2),
  createScheduleEntry(11, 'EMP002', 2, '09:00', '18:00'), 
  createScheduleEntry(12, 'EMP003', 2, '09:00', '18:00'),
  createScheduleEntry(13, 'EMP004', 2),
  createScheduleEntry(14, 'EMP009', 2),
  createScheduleEntry(15, 'EMP001', 3),
  createScheduleEntry(16, 'EMP002', 3, '09:00', '18:00'),
  createScheduleEntry(17, 'EMP003', 3, '08:00', '17:00'),
  createScheduleEntry(18, 'EMP004', 3),
  createScheduleEntry(19, 'EMP002', 4, '09:00', '18:00'),
  createScheduleEntry(20, 'EMP004', 4),
  createScheduleEntry(21, 'EMP009', 4, '09:00', '18:00'),
  createScheduleEntry(22, 'EMP001', 5),
  createScheduleEntry(23, 'EMP002', 5, '09:00', '18:00'),
  createScheduleEntry(24, 'EMP003', 5),
  createScheduleEntry(25, 'EMP004', 5),
  createScheduleEntry(26, 'EMP009', 5),
  ...['EMP101', 'EMP102', 'EMP103', 'EMP104', 'EMP105', 'EMP106', 'EMP107', 'EMP108', 'EMP110', 'EMP111', 'EMP112', 'EMP113', 'EMP114', 'EMP115', 'EMP116', 'EMP118', 'EMP119', 'EMP120'].flatMap((empId, index) => [
    createScheduleEntry(100 + index * 5, empId, 0),
    createScheduleEntry(101 + index * 5, empId, 1),
    createScheduleEntry(102 + index * 5, empId, 2),
    createScheduleEntry(103 + index * 5, empId, 3),
    createScheduleEntry(104 + index * 5, empId, 4),
  ]),
];

// ============================================================================
// ATTENDANCE DATA
// ============================================================================

export const initialAttendanceLogs = [
  // --- Today's Logs (Day 0) ---
  { empId: 'EMP001', date: createPastDate(0), signIn: '08:12', breakOut: '12:05', breakIn: null, signOut: null, overtimeHours: 0 }, // Late, on break
  { empId: 'EMP002', date: createPastDate(0), signIn: '08:58', breakOut: null, breakIn: null, signOut: null, overtimeHours: 0 }, // On time
  { empId: 'EMP003', date: createPastDate(0), signIn: '09:18', breakOut: '12:30', breakIn: '13:05', signOut: null, overtimeHours: 0 }, // Late, finished break
  { empId: 'EMP103', date: createPastDate(0), signIn: '08:15', signOut: null, overtimeHours: 0 }, // Late today
  { empId: 'EMP110', date: createPastDate(0), signIn: '08:00', signOut: null, overtimeHours: 0 }, // On time

  // --- Yesterday's Logs (Day 1) ---
  { empId: 'EMP001', date: createPastDate(1), signIn: '08:00', breakOut: '12:00', breakIn: '13:00', signOut: '17:00', overtimeHours: 0 }, // Perfect
  { empId: 'EMP002', date: createPastDate(1), signIn: '09:05', breakOut: '12:10', breakIn: '13:05', signOut: '18:02', overtimeHours: 0 }, // Late, stayed late
  { empId: 'EMP003', date: createPastDate(1), signIn: '09:01', breakOut: '12:30', breakIn: '13:30', signOut: '16:55', overtimeHours: 0 }, // On time, undertime
  { empId: 'EMP004', date: createPastDate(1), signIn: '08:05', breakOut: '12:00', breakIn: '13:00', signOut: '18:05', overtimeHours: 1 }, // Late, manual overtime
  { empId: 'EMP009', date: createPastDate(1), signIn: '08:10', breakOut: '12:15', breakIn: '13:10', signOut: null, overtimeHours: 0 }, // Late, forgot to sign out
  { empId: 'EMP101', date: createPastDate(1), signIn: '08:01', signOut: '17:01', overtimeHours: 0 },
  { empId: 'EMP102', date: createPastDate(1), signIn: '08:00', signOut: '17:00', overtimeHours: 0 },
  { empId: 'EMP103', date: createPastDate(1), signIn: '08:00', signOut: '17:00', overtimeHours: 0 },
  { empId: 'EMP104', date: createPastDate(1), signIn: '08:00', breakOut: '12:00', breakIn: '13:00', signOut: '16:30', overtimeHours: 0 }, // Undertime
  { empId: 'EMP106', date: createPastDate(1), signIn: '08:05', signOut: '17:10', overtimeHours: 0 }, // Late
  { empId: 'EMP107', date: createPastDate(1), signIn: '07:59', signOut: '17:00', overtimeHours: 0 },
  { empId: 'EMP108', date: createPastDate(1), signIn: '08:20', signOut: '17:20', overtimeHours: 0 }, // Late
  { empId: 'EMP110', date: createPastDate(1), signIn: '08:01', signOut: '17:00', overtimeHours: 0 },
  { empId: 'EMP111', date: createPastDate(1), signIn: '08:00', signOut: '17:05', overtimeHours: 0 },
  { empId: 'EMP112', date: createPastDate(1), signIn: '08:03', signOut: '17:01', overtimeHours: 0 },
  { empId: 'EMP113', date: createPastDate(1), signIn: '08:00', signOut: '17:00', overtimeHours: 0 },
  { empId: 'EMP114', date: createPastDate(1), signIn: '08:30', signOut: '17:30', overtimeHours: 0 }, // Late
  { empId: 'EMP115', date: createPastDate(1), signIn: '07:58', signOut: '17:00', overtimeHours: 0 },
  { empId: 'EMP116', date: createPastDate(1), signIn: '08:00', signOut: '17:00', overtimeHours: 0 },
  { empId: 'EMP118', date: createPastDate(1), signIn: '08:01', signOut: '17:02', overtimeHours: 0 },
  { empId: 'EMP119', date: createPastDate(1), signIn: '07:57', signOut: '17:00', overtimeHours: 0 },
  { empId: 'EMP120', date: createPastDate(1), signIn: '08:00', signOut: '17:00', overtimeHours: 0 },

  // --- Day 2 Logs ---
  { empId: 'EMP001', date: createPastDate(2), signIn: '08:05', breakOut: '12:01', breakIn: '12:59', signOut: '17:05', overtimeHours: 0 }, // Late
  { empId: 'EMP003', date: createPastDate(2), signIn: '09:00', breakOut: '12:00', breakIn: '13:00', signOut: '18:00', overtimeHours: 0 },
  { empId: 'EMP004', date: createPastDate(2), signIn: '09:30', signOut: '18:30', overtimeHours: 0 }, // Late, no break
  { empId: 'EMP009', date: createPastDate(2), signIn: '08:00', breakOut: '12:00', breakIn: '13:00', signOut: '17:03', overtimeHours: 0 },
  { empId: 'EMP101', date: createPastDate(2), signIn: '08:10', signOut: '17:05', overtimeHours: 0 }, // Late
  { empId: 'EMP105', date: createPastDate(2), signIn: '08:02', signOut: '18:00', overtimeHours: 1 }, // Manual overtime
  { empId: 'EMP104', date: createPastDate(2), signIn: '07:58', signOut: '17:03', overtimeHours: 0 },

  // --- Day 3 Logs ---
  { empId: 'EMP001', date: createPastDate(3), signIn: '07:58', breakOut: '11:55', breakIn: '12:55', signOut: '16:50', overtimeHours: 0 },
  { empId: 'EMP002', date: createPastDate(3), signIn: '09:03', breakOut: '12:05', breakIn: '13:05', signOut: '18:01', overtimeHours: 0 },
  { empId: 'EMP003', date: createPastDate(3), signIn: '08:01', breakOut: '12:02', breakIn: '13:01', signOut: '17:03', overtimeHours: 0 },
  { empId: 'EMP004', date: createPastDate(3), signIn: '08:05', signOut: '17:02', overtimeHours: 0 }, // No break
  { empId: 'EMP102', date: createPastDate(3), signIn: '07:55', signOut: '17:02', overtimeHours: 0 },

  // --- Day 4 Logs ---
  { empId: 'EMP002', date: createPastDate(4), signIn: '08:45', breakOut: '12:00', breakIn: '13:00', signOut: '17:45', overtimeHours: 0 }, // Very early
  { empId: 'EMP004', date: createPastDate(4), signIn: '08:10', breakOut: '12:15', breakIn: '13:10', signOut: '17:15', overtimeHours: 0 },
  { empId: 'EMP009', date: createPastDate(4), signIn: '09:05', breakOut: '12:00', breakIn: '13:00', signOut: '18:00', overtimeHours: 0 },

  // --- Day 5 Logs ---
  { empId: 'EMP001', date: createPastDate(5), signIn: '08:00', breakOut: '12:00', breakIn: '13:00', signOut: '17:00', overtimeHours: 0 },
  { empId: 'EMP002', date: createPastDate(5), signIn: '08:59', signOut: '17:59', overtimeHours: 0 }, // No break
  { empId: 'EMP003', date: createPastDate(5), signIn: '08:03', breakOut: '12:00', breakIn: '13:00', signOut: '17:00', overtimeHours: 0 },
  { empId: 'EMP009', date: createPastDate(5), signIn: '08:00', signOut: '17:00', overtimeHours: 0 },
];


// ============================================================================
// LEAVE MANAGEMENT DATA
// ============================================================================

export const initialLeaveRequests = [
  { 
    leaveId: 'LVE-PATERNITY-01', 
    leaveType: 'Paternity Leave', 
    empId: 'EMP102', 
    name: 'Jack Davis', 
    position: 'Picker', 
    days: 7, 
    dateFrom: '2025-07-10', 
    dateTo: '2025-07-16', 
    reason: 'Birth of my child.', 
    status: 'Approved',
    paternityDetails: {
      childsDob: '2025-07-08',
      isEligiblePaternity: true,
      marriageCertName: 'marriage_cert_jd.pdf',
      birthCertName: 'birth_cert_jd_child1.pdf',
    }
  },

  // --- NEW: Maternity Leave with No Extension ---
  {
    leaveId: 'LVE-MATERNITY-02',
    leaveType: 'Maternity Leave',
    empId: 'EMP103',
    name: 'Karen Wilson',
    position: 'Mover',
    days: 105,
    dateFrom: '2025-03-01',
    dateTo: '2025-06-13',
    reason: 'Standard maternity leave.',
    status: 'Approved',
    maternityDetails: {
      type: 'normal',
      isSoloParent: false,
      expectedDeliveryDate: '2025-03-10',
      allocationDays: 0,
      medicalDocumentName: 'medical_cert_kw.pdf',
    }
  },

  // --- UPDATED MATERNITY LEAVE STRUCTURE ---
  { 
    leaveId: 'LVE-MATERNITY-01', 
    leaveType: 'Maternity Leave', 
    empId: 'EMP001', 
    name: 'Alice Johnson', 
    position: 'Packer', 
    days: 113, 
    dateFrom: '2025-11-01', 
    dateTo: '2026-02-21',
    reason: 'Scheduled maternity leave for upcoming delivery.', 
    status: 'Approved',
    maternityDetails: {
      type: 'normal',
      isSoloParent: true,
      expectedDeliveryDate: '2025-11-10',
      allocationDays: 7,
      medicalDocumentName: 'medical_cert_alice.pdf',
      soloParentDocumentName: 'solo_parent_id_alice.pdf'
    },
    extensionStatus: 'Pending',
  },

  // --- PENDING REQUESTS ---
  { leaveId: 'LVE003', leaveType: 'Vacation', empId: 'EMP001', name: 'Alice Johnson', position: 'Packer', days: 5, dateFrom: '2025-09-15', dateTo: '2025-09-19', reason: 'Annual trip with family.', status: 'Pending' },
  { leaveId: 'LVE004', leaveType: 'Personal Leave', empId: 'EMP004', name: 'David Green', position: 'Lifter', days: 1, dateFrom: '2025-08-22', dateTo: '2025-08-22', reason: 'Appointment at a government office.', status: 'Pending' },
  { leaveId: 'LVE005', leaveType: 'Unpaid Leave', empId: 'EMP009', name: 'Ivy Lee', position: 'Packer', days: 3, dateFrom: '2025-10-01', dateTo: '2025-10-03', reason: 'Personal matters.', status: 'Pending' },
  { leaveId: 'LVE101', leaveType: 'Vacation', empId: 'EMP102', name: 'Jack Davis', position: 'Picker', days: 2, dateFrom: '2025-10-10', dateTo: '2025-10-11', reason: 'Family event.', status: 'Pending' },

  // --- APPROVED REQUESTS ---
  { leaveId: 'LVE001', leaveType: 'Vacation', empId: 'EMP002', name: 'Bob Smith', position: 'Lifter', days: 5, dateFrom: '2025-04-21', dateTo: '2025-04-25', reason: 'Family vacation to Palawan.', status: 'Approved' },
  { leaveId: 'LVE002', leaveType: 'Sick Leave', empId: 'EMP003', name: 'Carol White', position: 'Picker', days: 2, dateFrom: '2025-05-05', dateTo: '2025-05-06', reason: 'Flu.', status: 'Approved' },
  { leaveId: 'LVE006', leaveType: 'Vacation', empId: 'EMP003', name: 'Carol White', position: 'Picker', days: 3, dateFrom: '2025-08-11', dateTo: '2025-08-13', reason: 'Short break.', status: 'Approved' }, 
  { leaveId: 'LVE007', leaveType: 'Sick Leave', empId: 'EMP002', name: 'Bob Smith', position: 'Lifter', days: 1, dateFrom: '2025-07-21', dateTo: '2025-07-21', reason: 'Fever and headache.', status: 'Approved' },
  { leaveId: 'LVE008', leaveType: 'Sick Leave', empId: 'EMP001', name: 'Alice Johnson', position: 'Packer', days: 3, dateFrom: '2025-06-02', dateTo: '2025-06-04', reason: 'Stomach flu, doctor advised rest.', status: 'Approved' },
  { leaveId: 'LVE009', leaveType: 'Vacation', empId: 'EMP004', name: 'David Green', position: 'Lifter', days: 10, dateFrom: '2025-01-20', dateTo: '2025-01-29', reason: 'Hometown festival.', status: 'Approved' },
  { leaveId: 'LVE014', leaveType: 'Personal Leave', empId: 'EMP004', name: 'David Green', position: 'Lifter', days: 1, dateFrom: '2023-09-20', dateTo: '2023-09-20', reason: 'Family emergency.', status: 'Approved' },
  { leaveId: 'LVE015', leaveType: 'Sick Leave', empId: 'EMP009', name: 'Ivy Lee', position: 'Packer', days: 2, dateFrom: '2023-09-25', dateTo: '2023-09-26', reason: 'Migraine.', status: 'Approved' },
  { leaveId: 'LVE102', leaveType: 'Sick Leave', empId: 'EMP115', name: 'Wendy Hall', position: 'Lifter', days: 1, dateFrom: '2025-09-01', dateTo: '2025-09-01', reason: 'Dental appointment.', status: 'Approved' },

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
  { id: 'TPL01', name: 'Warehouse Day Shift', description: 'Standard 8-5 shift for warehouse personnel.', columns: ['start_time', 'end_time', 'ot_hours', 'area_assignment'], applicablePositions: ['Packer', 'Picker', 'Mover'] },
  { id: 'TPL02', name: 'Lifter Operations', description: 'Schedule for equipment operators.', columns: ['start_time', 'end_time', 'ot_hours', 'equipment_id'], applicablePositions: ['Lifter'] },
  { id: 'TPL03', name: 'Office Staff Schedule', description: 'Standard office hours.', columns: ['start_time', 'end_time', 'ot_hours'], applicablePositions: ['HR Personnel'] },
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
  { enrollmentId: 6, employeeId: 'EMP101', programId: 1, status: 'In Progress', progress: 25 },
  { enrollmentId: 7, employeeId: 'EMP111', programId: 1, status: 'Completed', progress: 100 },
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
  { id: 'factor_behavior', title: 'Behavioral Competencies', type: 'rating_scale', items: [
      { id: 'bhv_teamwork', name: 'Teamwork & Collaboration', description: 'Works effectively with others to achieve common goals; shares information and supports team members.', b_a_r_s: { 1: "Consistently works in isolation...", 2: "Rarely offers assistance...", 3: "Reliably participates...", 4: "Frequently and proactively offers help...", 5: "Acts as a role model..." }},
      { id: 'bhv_communication', name: 'Communication', description: 'Clearly and effectively conveys information...' },
      { id: 'bhv_professionalism', name: 'Professionalism & Integrity', description: 'Demonstrates a high standard of professional conduct...' }]},
  { id: 'factor_work_quality', title: 'Work Quality', type: 'rating_scale', items: [
      { id: 'wq_accuracy', name: 'Accuracy & Attention to Detail', description: 'Completes tasks with a high degree of precision...' },
      { id: 'wq_efficiency', name: 'Efficiency & Time Management', description: 'Effectively manages time and resources...' }]},
  { id: 'factor_potential', title: 'Potential & Growth', type: 'rating_scale', description: 'Forward-looking indicators of an employee\'s potential...', items: [
      { id: 'pot_learning_agility', name: 'Learning Agility', description: 'Demonstrates the ability to learn quickly...' },
      { id: 'pot_ambition_drive', name: 'Ambition & Drive', description: 'Shows initiative, seeks out new challenges...' },
      { id: 'pot_leadership', name: 'Leadership Capability', description: 'Exhibits potential to lead others...' }]},
  { id: 'factor_engagement', title: 'Engagement & Alignment', type: 'rating_scale', description: 'Measures job satisfaction and alignment...', items: [
      { id: 'eng_role_satisfaction', name: 'Role Satisfaction', description: 'Appears energized and fulfilled by their day-to-day responsibilities.' },
      { id: 'eng_growth_opportunity', name: 'Career Growth Opportunities', description: 'Sees a clear and viable path for advancement...' }]},
  { id: 'factor_kpis', title: 'Key Performance Indicators (KPIs)', type: 'kpi_section' },
  { id: 'factor_evaluator_summary', title: "Evaluator's Overall Summary", type: 'textarea', description: "Provide a holistic summary..." },
  { id: 'factor_development_areas', title: "Key Strengths & Development Areas", type: 'textarea', description: "Identify 1-2 key strengths and development areas..." }
];

export const initialEvaluationsData = [
  { id: 'EVAL01', employeeId: 'EMP001', evaluatorId: 'EMP003', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', factorScores: { /* ... */ }, overallScore: 92.50 },
  { id: 'EVAL02', employeeId: 'EMP009', evaluatorId: 'EMP003', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', factorScores: { /* ... */ }, overallScore: 78.00 },
  { id: 'EVAL03', employeeId: 'EMP004', evaluatorId: 'EMP002', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', factorScores: { /* ... */ }, overallScore: 88.75 },
  { id: 'EVAL04', employeeId: 'EMP001', evaluatorId: 'EMP003', periodStart: '2024-07-01', periodEnd: '2024-12-31', status: 'Completed', factorScores: { /* ... */ }, overallScore: 90.00 },
  { id: 'EVAL05', employeeId: 'EMP004', evaluatorId: 'EMP002', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', factorScores: { /* ... */ }, overallScore: 46.80 },
  { id: 'EVAL06', employeeId: 'EMP002', evaluatorId: 'EMP005', periodStart: '2024-07-01', periodEnd: '2024-12-31', status: 'Completed', factorScores: { /* ... */ }, overallScore: 85.00 },
  { id: 'EVAL07', employeeId: 'EMP002', evaluatorId: 'EMP005', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', factorScores: { /* ... */ }, overallScore: 88.00 },
  { id: 'EVAL08', employeeId: 'EMP003', evaluatorId: 'EMP005', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', factorScores: { /* ... */ }, overallScore: 91.00 },
  { id: 'EVAL09', employeeId: 'EMP001', evaluatorId: 'EMP003', periodStart: '2024-01-01', periodEnd: '2024-06-30', status: 'Completed', factorScores: { /* ... */ }, overallScore: 88.50 },
  { id: 'EVAL10', employeeId: 'EMP009', evaluatorId: 'EMP003', periodStart: '2024-07-01', periodEnd: '2024-12-31', status: 'Completed', factorScores: { /* ... */ }, overallScore: 82.00 },
  { id: 'EVAL101', employeeId: 'EMP101', evaluatorId: 'EMP005', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 85.50, factorScores: {}},
  { id: 'EVAL102', employeeId: 'EMP102', evaluatorId: 'EMP101', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 91.20, factorScores: {}},
  { id: 'EVAL103', employeeId: 'EMP103', evaluatorId: 'EMP111', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 79.80, factorScores: {}},
  { id: 'EVAL104', employeeId: 'EMP104', evaluatorId: 'EMP111', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 88.00, factorScores: {}},
  { id: 'EVAL105', employeeId: 'EMP105', evaluatorId: 'EMP003', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 94.10, factorScores: {}},
  { id: 'EVAL106', employeeId: 'EMP106', evaluatorId: 'EMP002', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 68.50, factorScores: {}},
  { id: 'EVAL107', employeeId: 'EMP107', evaluatorId: 'EMP101', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 90.00, factorScores: {}},
  { id: 'EVAL108', employeeId: 'EMP108', evaluatorId: 'EMP005', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 82.30, factorScores: {}},
  { id: 'EVAL110', employeeId: 'EMP110', evaluatorId: 'EMP002', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 75.00, factorScores: {}},
  { id: 'EVAL111', employeeId: 'EMP111', evaluatorId: 'EMP005', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 95.00, factorScores: {}},
  { id: 'EVAL112', employeeId: 'EMP112', evaluatorId: 'EMP111', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 86.50, factorScores: {}},
  { id: 'EVAL113', employeeId: 'EMP113', evaluatorId: 'EMP101', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 78.90, factorScores: {}},
  { id: 'EVAL114', employeeId: 'EMP114', evaluatorId: 'EMP003', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 81.00, factorScores: {}},
  { id: 'EVAL115', employeeId: 'EMP115', evaluatorId: 'EMP002', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 89.60, factorScores: {}},
  { id: 'EVAL116', employeeId: 'EMP116', evaluatorId: 'EMP005', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 92.00, factorScores: {}},
  { id: 'EVAL118', employeeId: 'EMP118', evaluatorId: 'EMP111', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 77.40, factorScores: {}},
  { id: 'EVAL119', employeeId: 'EMP119', evaluatorId: 'EMP003', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 93.30, factorScores: {}},
  { id: 'EVAL120', employeeId: 'EMP120', evaluatorId: 'EMP002', periodStart: '2025-01-01', periodEnd: '2025-06-30', status: 'Completed', overallScore: 84.80, factorScores: {}},
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

export const initialPayrollsData = [
  // --- NEW PAYROLL DATA FOR 2023 ---
  {
    runId: 'RUN-2023-09-30',
    cutOff: '2023-09-16 to 2023-09-30',
    records: [
      { empId: 'EMP001', employeeName: 'Alice Johnson', earnings: [{ description: 'Regular Pay', amount: 9000.00 }], deductions: { tax: 350, sss: 405, philhealth: 200, hdmf: 100 }, status: 'Paid' },
      { empId: 'EMP002', employeeName: 'Bob Smith', earnings: [{ description: 'Regular Pay', amount: 11000.00 }], deductions: { tax: 650, sss: 495, philhealth: 275, hdmf: 100 }, status: 'Paid' },
      { empId: 'EMP003', employeeName: 'Carol White', earnings: [{ description: 'Regular Pay', amount: 9000.00 }], deductions: { tax: 350, sss: 405, philhealth: 200, hdmf: 100 }, status: 'Paid' },
      { empId: 'EMP004', employeeName: 'David Green', earnings: [{ description: 'Regular Pay', amount: 11000.00 }], deductions: { tax: 650, sss: 495, philhealth: 275, hdmf: 100 }, status: 'Paid' },
    ]
  },
  {
    runId: 'RUN-2023-09-15',
    cutOff: '2023-09-01 to 2023-09-15',
    records: [
      { empId: 'EMP001', employeeName: 'Alice Johnson', earnings: [{ description: 'Regular Pay', amount: 8950.00 }], deductions: { tax: 340, sss: 405, philhealth: 200, hdmf: 100 }, status: 'Paid' },
      { empId: 'EMP002', employeeName: 'Bob Smith', earnings: [{ description: 'Regular Pay', amount: 11000.00 }], deductions: { tax: 650, sss: 495, philhealth: 275, hdmf: 100 }, status: 'Paid' },
      { empId: 'EMP003', employeeName: 'Carol White', earnings: [{ description: 'Regular Pay', amount: 9000.00 }], deductions: { tax: 350, sss: 405, philhealth: 200, hdmf: 100 }, status: 'Paid' },
    ]
  },
  // --- EXISTING DATA (for reference and backward compatibility) ---
  {
    runId: 'RUN-2023-11-15',
    cutOff: '2023-11-01 to 2023-11-15',
    payrollType: 'Semi-monthly',
    records: [
      { 
        payrollId: 'PAY005', empId: 'EMP001', employeeName: 'Alice Johnson', earnings: [{ description: 'Regular Pay', amount: 9000.00 }], deductions: { tax: 351, sss: 405, philhealth: 200, hdmf: 100 }, status: 'Paid'
      },
      { 
        payrollId: 'PAY006', empId: 'EMP006', employeeName: 'Ethan Hunt', earnings: [{ description: 'Regular Pay', amount: 9250.00 }], deductions: { tax: 400, sss: 416.25, philhealth: 205, hdmf: 100 }, status: 'Paid'
      }
    ]
  },
  {
    runId: 'RUN-2023-10-31',
    cutOff: '2023-10-16 to 2023-10-31',
    payrollType: 'Semi-monthly',
    records: [
      { 
        payrollId: 'PAY003', empId: 'EMP001', employeeName: 'Alice Johnson', period: 'Oct 16-31, 2023', paymentDate: '2023-11-05', payStartDate: '2023-10-16', payEndDate: '2023-10-31', earnings: [ { description: 'Regular Pay', hours: 88, amount: 9000.00 }, { description: 'Overtime Pay', hours: 5.5, amount: 511.36 } ], deductions: { tax: 351.36, sss: 405, philhealth: 200, hdmf: 100 }, otherDeductions: [ { description: 'Company Loan', loanAmount: 5000.00, amount: 1000.00, outstandingBalance: 4000.00 } ], absences: [], leaveBalances: { vacation: 12.5, sick: 8, personal: 5 }, status: 'Paid'
      },
      { 
        payrollId: 'PAY004', empId: 'EMP003', employeeName: 'Carol White', period: 'Oct 16-31, 2023', paymentDate: '2023-11-05', payStartDate: '2023-10-16', payEndDate: '2023-10-31', earnings: [ { description: 'Regular Pay', hours: 88, amount: 9000.00 }, ], deductions: { tax: 351.36, sss: 405, philhealth: 200, hdmf: 100 }, otherDeductions: [], absences: [], leaveBalances: { vacation: 10, sick: 5, personal: 5 }, status: 'Pending'
      },
      // --- DATA FIX: Added missing description property ---
      { payrollId: 'PAY101', empId: 'EMP101', employeeName: 'Henry Miller', earnings: [{ description: 'Regular Pay', amount: 9250 }], deductions: {tax: 400}, status: 'Paid' },
      { payrollId: 'PAY102', empId: 'EMP102', employeeName: 'Jack Davis', earnings: [{ description: 'Regular Pay', amount: 9000 }], deductions: {tax: 380}, status: 'Paid' },
      { 
        payrollId: 'PAY010', empId: 'EMP010', employeeName: 'Frank Black', period: 'Oct 16-31, 2023', paymentDate: '2023-11-05', payStartDate: '2023-10-16', payEndDate: '2023-10-31', earnings: [ { description: 'Regular Pay', hours: 88, amount: 9000.00 } ], deductions: { tax: 351.36, sss: 405, philhealth: 200, hdmf: 100 }, otherDeductions: [], absences: [], leaveBalances: { vacation: 5, sick: 2, personal: 1 }, status: 'Paid'
      },
    ]
  },
  {
    runId: 'RUN-2023-10-15',
    cutOff: '2023-10-01 to 2023-10-15',
    payrollType: 'Semi-monthly',
    records: [
      { 
        payrollId: 'PAY001', empId: 'EMP001', employeeName: 'Alice Johnson', period: 'Oct 1-15, 2023', paymentDate: '2023-10-20', payStartDate: '2023-10-01', payEndDate: '2023-10-15', earnings: [ { description: 'Regular Pay', hours: 80, amount: 8181.82 }, { description: 'Holiday Pay', hours: 8, amount: 950.00 }, { description: 'Leave Pay', hours: 8, amount: 818.18 } ], deductions: { tax: 452.27, sss: 405, philhealth: 200, hdmf: 100 }, otherDeductions: [], absences: [{ description: 'Excused', startDate: '2023-10-10', endDate: '2023-10-10', totalDays: 1 }], leaveBalances: { vacation: 13, sick: 8, personal: 5 }, status: 'Paid' 
      },
      { 
        payrollId: 'PAY002', empId: 'EMP002', employeeName: 'Bob Smith', period: 'Oct 1-15, 2023', paymentDate: '2023-10-20', payStartDate: '2023-10-01', payEndDate: '2023-10-15', earnings: [ { description: 'Regular Pay', hours: 80, amount: 10000.00 }, { description: 'Allowance', hours: null, amount: 1000.00 }, ], deductions: { tax: 650, sss: 495, philhealth: 275, hdmf: 100 }, otherDeductions: [ { description: 'Pag-IBIG Loan', loanAmount: 20000.00, amount: 1500.00, outstandingBalance: 18500.00 } ], absences: [], leaveBalances: { vacation: 5, sick: 3, personal: 5 }, status: 'Paid' 
      },
    ]
  },
];


// ============================================================================
// CASE MANAGEMENT DATA
// ============================================================================

export const initialCasesData = [
  {
    caseId: 'CASE001', employeeId: 'EMP004', issueDate: '2025-06-15', actionType: 'Verbal Warning', reason: 'Tardiness', description: 'Employee was 25 minutes late on 2025-06-14 without prior notification.', status: 'Ongoing', attachments: [], nextSteps: 'Monitor attendance for the next 30 days.', actionLog: [ { date: '2025-06-15', action: 'Case Created. Verbal warning issued by HR Manager Grace Field.' }, { date: '2025-06-16', action: 'Follow-up discussion held with employee and their team leader, Carol White.' } ]
  },
  {
    caseId: 'CASE002', employeeId: 'EMP009', issueDate: '2025-05-20', actionType: 'Written Warning', reason: 'Safety Violation', description: 'Observed operating machinery without required safety goggles, despite previous verbal reminders.', status: 'Closed', attachments: ['safety_report_q2.pdf'], nextSteps: 'Additional safety training completed on 2025-05-28.', actionLog: [ { date: '2025-05-20', action: 'Case Created. Written warning issued and signed by employee.' }, { date: '2025-05-28', action: 'Safety training course completed. Certificate attached.' }, { date: '2025-06-20', action: 'Case reviewed and closed by HR Manager.' } ]
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
  { employeeId: 'EMP101', username: 'henry_p101', password: 'password123', status: 'Active' },
  { employeeId: 'EMP102', username: 'jack_p102', password: 'password123', status: 'Active' },
  { employeeId: 'EMP103', username: 'karen_p103', password: 'password123', status: 'Active' },
  { employeeId: 'EMP104', username: 'liam_p104', password: 'password123', status: 'Active' },
  { employeeId: 'EMP105', username: 'mia_p105', password: 'password123', status: 'Active' },
  { employeeId: 'EMP106', username: 'noah_p106', password: 'password123', status: 'Active' },
  { employeeId: 'EMP107', username: 'olivia_p107', password: 'password123', status: 'Active' },
  { employeeId: 'EMP108', username: 'peter_p108', password: 'password123', status: 'Active' },
  { employeeId: 'EMP109', username: 'quinn_p109', password: 'password123', status: 'Deactivated' },
  { employeeId: 'EMP110', username: 'rachel_p110', password: 'password123', status: 'Active' },
  { employeeId: 'EMP111', username: 'sam_p111', password: 'password123', status: 'Active' },
  { employeeId: 'EMP112', username: 'tina_p112', password: 'password123', status: 'Active' },
  { employeeId: 'EMP113', username: 'uma_p113', password: 'password123', status: 'Active' },
  { employeeId: 'EMP114', username: 'victor_p114', password: 'password123', status: 'Active' },
  { employeeId: 'EMP115', username: 'wendy_p115', password: 'password123', status: 'Active' },
  { employeeId: 'EMP116', username: 'xavier_p116', password: 'password123', status: 'Active' },
  { employeeId: 'EMP117', username: 'yara_p117', password: 'password123', status: 'Deactivated' },
  { employeeId: 'EMP118', username: 'zane_p118', password: 'password123', status: 'Active' },
  { employeeId: 'EMP119', username: 'ava_p119', password: 'password123', status: 'Active' },
  { employeeId: 'EMP120', username: 'ben_p120', password: 'password123', status: 'Active' },
];

// ============================================================================
// ARCHIVED CONTRIBUTIONS DATA
// ============================================================================

export const initialArchivedContributions = [
  {
    id: 'ARCHIVE-SSS-1', type: 'SSS', payPeriod: '2023-10-01 to 2023-10-15', generationDate: '2023-10-20T10:00:00Z', generatedBy: 'Grace Field',
    columns: [ { key: 'no', label: 'No.'}, { key: 'sssNo', label: 'SSS Number'}, { key: 'lastName', label: 'Last Name'}, { key: 'firstName', label: 'First Name'}, { key: 'middleName', label: 'Middle Name'}, { key: 'employeeContribution', label: 'EE Share'}, { key: 'employerContribution', label: 'ER Share'}, { key: 'totalContribution', label: 'Total'} ],
    rows: [ { no: 1, sssNo: '34-456', lastName: 'Johnson', firstName: 'Alice', middleName: '', employeeContribution: 290.65, employerContribution: 290.65, totalContribution: 581.30 }, { no: 2, sssNo: '34-789', lastName: 'Smith', firstName: 'Bob', middleName: '', employeeContribution: 450, employerContribution: 450, totalContribution: 900.00 } ],
    headerData: { 'Employer ID Number': '03-9-1234567-8', 'Employer Name': 'Lapeco Group of Companies', 'Contribution Month': 'October 2023' }
  },
  {
    id: 'ARCHIVE-PH-1', type: 'PhilHealth', payPeriod: '2023-10-01 to 2023-10-15', generationDate: '2023-10-20T10:05:00Z', generatedBy: 'Grace Field',
    columns: [ { key: 'no', label: 'No.' }, { key: 'philhealthNo', label: 'PhilHealth Number' }, { key: 'lastName', label: 'Last Name' }, { key: 'firstName', label: 'First Name' }, { key: 'middleName', label: 'Middle Name' }, { key: 'employeeContribution', label: 'EE Share' }, { key: 'employerContribution', label: 'ER Share' }, { key: 'totalContribution', label: 'Total' } ],
    rows: [ { no: 1, philhealthNo: '1120-2485-8688', lastName: 'Johnson', firstName: 'Alice', middleName: '', employeeContribution: 200, employerContribution: 200, totalContribution: 400 }, { no: 2, philhealthNo: '0825-3830-9814', lastName: 'Smith', firstName: 'Bob', middleName: '', employeeContribution: 220, employerContribution: 220, totalContribution: 440 } ],
    headerData: { 'Employer Name': 'Lapeco Group of Companies', 'Contribution Month': 'October 2023' }
  }
];

// ============================================================================
// RESIGNATION DATA (NEW)
// ============================================================================

export const initialResignationsData = [
  {
    id: 'RES001',
    employeeId: 'EMP004',
    employeeName: 'David Green',
    position: 'Lifter',
    submissionDate: createPastDate(10),
    lastDayOfWork: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString().split('T')[0],
    effectiveDate: new Date(new Date(createPastDate(10)).setDate(new Date(createPastDate(10)).getDate() + 30)).toISOString().split('T')[0],
    reason: 'I have received an offer for a position that I believe will further my career goals. Thank you for the opportunity.',
    status: 'Pending',
    hrComments: null,
  },
  {
    id: 'RES002',
    employeeId: 'EMP107',
    employeeName: 'Olivia Thomas',
    position: 'Picker',
    submissionDate: createPastDate(45),
    lastDayOfWork: createPastDate(15),
    effectiveDate: createPastDate(15), 
    reason: 'I am resigning due to personal reasons that require me to relocate. It has been a pleasure working here.',
    status: 'Approved',
    hrComments: 'Offboarding process initiated.',
  },
  {
    id: 'RES003',
    employeeId: 'EMP005',
    employeeName: 'Grace Field',
    position: 'HR Personnel',
    submissionDate: createPastDate(2), // Submitted 2 days ago
    lastDayOfWork: new Date(new Date().setDate(new Date().getDate() + 28)).toISOString().split('T')[0],
    effectiveDate: new Date(new Date().setDate(new Date().getDate() + 28)).toISOString().split('T')[0],
    reason: 'Moving to another country for family reasons. It has been a wonderful experience working with the team.',
    status: 'Pending',
    hrComments: null,
  },
  {
    id: 'RES004',
    employeeId: 'EMP006',
    employeeName: 'Ethan Hunt',
    position: 'Picker',
    submissionDate: createPastDate(50),
    lastDayOfWork: createPastDate(20),
    effectiveDate: createPastDate(20),
    reason: 'Resigning to pursue further education.',
    status: 'Approved',
    hrComments: 'Cleared for final pay processing.',
  },
  {
    id: 'RES005',
    employeeId: 'EMP009',
    employeeName: 'Ivy Lee',
    position: 'Packer',
    submissionDate: createPastDate(5), // Submitted 5 days ago
    lastDayOfWork: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
    effectiveDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0], // Effective in 15 days
    reason: 'Found a new opportunity closer to my home. Thank you for everything.',
    status: 'Approved',
    hrComments: 'Approved. Offboarding process will begin shortly.',
  },

  {
    id: 'RES006',
    employeeId: 'EMP010',
    employeeName: 'Frank Black',
    position: 'Packer',
    submissionDate: createPastDate(60),
    lastDayOfWork: createPastDate(30),
    effectiveDate: createPastDate(30),
    reason: 'Voluntary resignation to explore other opportunities.',
    status: 'Approved',
    hrComments: 'Employee has been cleared.',
  },
];

export const initialTerminationData = [
  {
    id: 'TERM001',
    employeeId: 'EMP007',
    date: '2023-08-30',
    reason: 'Job Abandonment',
    comments: 'Employee did not report for work for 5 consecutive days without any official leave or notification.'
  }
];