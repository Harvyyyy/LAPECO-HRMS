const createPastDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

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