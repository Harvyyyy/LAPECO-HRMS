export const reportCategories = {
  EMPLOYEE_DATA: 'Employee Data',
  ATTENDANCE: 'Attendance & Schedules',
  PERFORMANCE: 'Performance Management',
  LEAVE: 'Leave Management',
  TRAINING: 'Training & Development',
  RECRUITMENT: 'Recruitment',
  PAYROLL: 'Payroll & Compensation',
};

export const reportsConfig = [
  {
    id: 'employee_masterlist',
    title: 'Employee Masterlist',
    description: 'Generates a complete list of all active employees with their key details and a distribution chart.',
    icon: 'bi-people-fill',
    category: reportCategories.EMPLOYEE_DATA,
    parameters: null,
  },
  {
    id: 'positions_report',
    title: 'Company Positions Report',
    description: 'A list of all defined positions, including salary comparisons and employee counts.',
    icon: 'bi-diagram-3-fill',
    category: reportCategories.EMPLOYEE_DATA,
    parameters: null,
  },
  {
    id: 'attendance_summary',
    title: 'Daily Attendance Report',
    description: 'A summary and detailed log of employee attendance for a specific day.',
    icon: 'bi-calendar-check-fill',
    category: reportCategories.ATTENDANCE,
    parameters: [
      { id: 'date_range_1', type: 'date-range', labels: { start: 'Select Date', end: null } },
    ],
  },
  {
    id: 'leave_requests_report',
    title: 'Leave Requests Report',
    description: 'Generates a detailed list of all leave requests within a specified date range, with a type breakdown chart.',
    icon: 'bi-calendar-event-fill',
    category: reportCategories.LEAVE,
    parameters: [
      { id: 'date_range_4', type: 'date-range', labels: { start: 'Start Date', end: 'End Date' } },
    ],
  },
  {
    id: 'performance_summary',
    title: 'Performance Summary Report',
    description: 'Summarizes all evaluations completed within a specified period, with performance distribution charts.',
    icon: 'bi-graph-up-arrow',
    category: reportCategories.PERFORMANCE,
    parameters: [
      { id: 'date_range_2', type: 'date-range', labels: { start: 'Start Date', end: 'End Date' } },
    ],
  },
  {
    id: 'training_program_summary',
    title: 'Training Program Report',
    description: 'Generates a report on a specific training program and its participants, including a status chart.',
    icon: 'bi-mortarboard-fill',
    category: reportCategories.TRAINING,
    parameters: [
      { id: 'program_selector', type: 'program-selector', label: 'Select Program' }
    ],
  },
  {
    id: 'recruitment_activity',
    title: 'Recruitment Activity Report',
    description: 'Summarizes recruitment activities for a given period. (Coming Soon)',
    icon: 'bi-person-plus-fill',
    category: reportCategories.RECRUITMENT,
    parameters: [
      { id: 'date_range_3', type: 'date-range', labels: { start: 'Start Date', end: 'End Date' } },
    ],
  },
];