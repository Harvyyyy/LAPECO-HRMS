import { format } from 'date-fns';

const generateBaseData = (employees, positions) => {
  return employees
    .filter(emp => emp.status === 'Active' && emp.positionId)
    .map(emp => {
      const position = positions.find(p => p.id === emp.positionId);
      const nameParts = emp.name.split(' ').filter(Boolean);
      
      const lastName = nameParts.length > 1 ? nameParts.pop() : emp.name;
      const firstName = nameParts.length > 0 ? nameParts.shift() : '';
      const middleName = nameParts.join(' ');
      const middleInitial = middleName ? middleName.charAt(0).toUpperCase() : '';

      return {
        ...emp,
        firstName,
        lastName,
        middleName,
        middleInitial,
        monthlySalary: position?.monthlySalary || 0,
      };
    })
    .sort((a, b) => a.lastName.localeCompare(b.lastName));
};

const getStandardColumns = (agencyName, agencyIdKey) => [
    { key: 'no', label: 'No.', editable: false, isPermanent: true },
    { key: 'lastName', label: 'Surname', editable: false, isPermanent: true },
    { key: 'firstName', label: 'First Name', editable: false, isPermanent: true },
    { key: 'middleName', label: 'Middle Name', editable: false, isPermanent: true },
    { key: agencyIdKey, label: `${agencyName} ID No.`, editable: true, isPermanent: true },
    { key: 'eeShare', label: 'EE Share', editable: true, isPermanent: false },
    { key: 'erShare', label: 'ER Share', editable: true, isPermanent: false },
    { key: 'total', label: 'Total', editable: false, isPermanent: true },
];


export const generatePagibigData = (employees, positions) => {
  const employeeData = generateBaseData(employees, positions);
  const columns = getStandardColumns('PAG-IBIG', 'pagIbigNo');

  const rows = employeeData.map((emp, index) => {
    // Pag-IBIG is typically a fixed amount for most employees
    const eeShare = 100.00;
    const erShare = 100.00;
    const total = eeShare + erShare;

    return {
        no: index + 1,
        lastName: emp.lastName.toUpperCase(),
        firstName: emp.firstName.toUpperCase(),
        middleName: emp.middleName.toUpperCase(),
        pagIbigNo: emp.pagIbigNo || '',
        eeShare: eeShare.toFixed(2),
        erShare: erShare.toFixed(2),
        total: total.toFixed(2),
    };
  });

  return { columns, rows, title: 'Pag-IBIG Contribution Report', headerData: { 'PERCOV': format(new Date(), 'yyyyMM') } };
};

export const generatePhilhealthData = (employees, positions) => {
    const employeeData = generateBaseData(employees, positions);
    const columns = getStandardColumns('PHILHEALTH', 'philhealthNo');
  
    const rows = employeeData.map((emp, index) => {
        // Simplified PhilHealth Calculation (e.g., 5% of salary, split 50/50)
        const premium = emp.monthlySalary * 0.05;
        const eeShare = premium / 2;
        const erShare = premium / 2;
        const total = premium;

        return {
            no: index + 1,
            lastName: emp.lastName.toUpperCase(),
            firstName: emp.firstName.toUpperCase(),
            middleName: emp.middleName.toUpperCase(),
            philhealthNo: emp.philhealthNo || '',
            eeShare: eeShare.toFixed(2),
            erShare: erShare.toFixed(2),
            total: total.toFixed(2),
        };
    });

    return { columns, rows, title: 'PhilHealth Contribution Report', headerData: { 'Applicable Month': format(new Date(), 'MMMM yyyy') } };
};

export const generateSssData = (employees, positions) => {
    const employeeData = generateBaseData(employees, positions);
    const columns = getStandardColumns('SSS', 'sssNo');

    const rows = employeeData.map((emp, index) => {
        // Simplified SSS Calculation (e.g., 14% of salary, 4.5% EE / 9.5% ER)
        const premium = emp.monthlySalary * 0.14;
        const eeShare = emp.monthlySalary * 0.045;
        const erShare = emp.monthlySalary * 0.095;
        
        return {
            no: index + 1,
            lastName: emp.lastName.toUpperCase(),
            firstName: emp.firstName.toUpperCase(),
            middleName: emp.middleName.toUpperCase(),
            sssNo: emp.sssNo || '',
            eeShare: eeShare.toFixed(2),
            erShare: erShare.toFixed(2),
            total: (eeShare + erShare).toFixed(2),
        };
    });

    return { columns, rows, title: 'SSS Contribution Report', headerData: {} };
};