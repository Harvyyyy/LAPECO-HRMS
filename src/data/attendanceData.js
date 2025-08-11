const createPastDate = (daysAgo) => new Date(Date.now() - (86400000 * daysAgo)).toISOString().split('T')[0];

export const initialAttendanceLogs = [
  { empId: 'EMP001', date: createPastDate(0), signIn: '09:02', breakOut: '12:05', breakIn: '13:01', signOut: null },
  { empId: 'EMP002', date: createPastDate(0), signIn: '08:58', breakOut: null, breakIn: null, signOut: null },
  { empId: 'EMP001', date: createPastDate(1), signIn: '09:00', breakOut: '12:00', breakIn: '13:00', signOut: '18:00' },
  { empId: 'EMP002', date: createPastDate(1), signIn: '08:55', breakOut: '12:10', breakIn: '13:05', signOut: '17:58' },
  { empId: 'EMP003', date: createPastDate(1), signIn: '09:15', breakOut: '12:30', breakIn: '13:30', signOut: '18:10' },
  { empId: 'EMP001', date: createPastDate(2), signIn: '09:05', breakOut: '12:01', breakIn: '12:59', signOut: '18:05' },
  { empId: 'EMP003', date: createPastDate(2), signIn: '09:00', breakOut: '12:00', breakIn: '13:00', signOut: '18:00' },
  { empId: 'EMP001', date: createPastDate(3), signIn: '08:58', breakOut: '11:55', breakIn: '12:55', signOut: '17:50' },
  { empId: 'EMP002', date: createPastDate(3), signIn: '09:03', breakOut: '12:05', breakIn: '13:05', signOut: '18:01' },
  { empId: 'EMP003', date: createPastDate(3), signIn: '09:01', breakOut: '12:02', breakIn: '13:01', signOut: '18:03' },
  { empId: 'EMP004', date: createPastDate(3), signIn: '09:05', breakOut: '12:00', breakIn: '13:00', signOut: '18:02' },
  { empId: 'EMP002', date: createPastDate(4), signIn: '08:45', breakOut: '12:00', breakIn: '13:00', signOut: '17:45' },
  { empId: 'EMP004', date: createPastDate(4), signIn: '09:10', breakOut: '12:15', breakIn: '13:10', signOut: '18:15' },
];