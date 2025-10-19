import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import IncomeBreakdownModal from '../../modals/IncomeBreakdownModal';
import { calculateSssContribution, calculatePhilhealthContribution, calculatePagibigContribution, calculateTin } from '../../../hooks/contributionUtils';
import { calculateLatenessDeductions } from '../../../hooks/payrollUtils';

const formatCurrency = (value) => value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const getYears = () => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear - 1];
};

const MONTHS = [
    { value: 0, label: 'January' }, { value: 1, label: 'February' }, { value: 2, label: 'March' },
    { value: 3, label: 'April' }, { value: 4, label: 'May' }, { value: 5, label: 'June' },
    { value: 6, label: 'July' }, { value: 7, label: 'August' }, { value: 8, label: 'September' },
    { value: 9, label: 'October' }, { value: 10, label: 'November' }, { value: 11, label: 'December' },
];

const PERIODS = [
    { value: '1', label: '1st Half (26th - 10th)' },
    { value: '2', label: '2nd Half (11th - 25th)' },
];

const PayrollGenerationPage = ({ employees, positions, schedules, attendanceLogs, holidays, onGenerate, payrolls }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const day = new Date().getDate();
    return day >= 11 && day <= 25 ? '2' : '1';
  });

  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);
  const navigate = useNavigate();

  const positionMap = useMemo(() => new Map(positions.map(p => [p.id, p])), [positions]);
  const holidayMap = useMemo(() => new Map(holidays.map(h => [h.date, h])), [holidays]);
  const scheduleMap = useMemo(() => new Map(schedules.map(s => [`${s.empId}-${s.date}`, s])), [schedules]);
  const attendanceMap = useMemo(() => new Map(attendanceLogs.map(a => [`${a.empId}-${a.date}`, a])), [attendanceLogs]);

  const { startDate, endDate, cutOffString } = useMemo(() => {
    const year = selectedYear;
    const month = selectedMonth;

    if (selectedPeriod === '1') {
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevMonthYear = month === 0 ? year - 1 : year;
        const start = new Date(Date.UTC(prevMonthYear, prevMonth, 26)).toISOString().split('T')[0];
        const end = new Date(Date.UTC(year, month, 10)).toISOString().split('T')[0];
        return { startDate: start, endDate: end, cutOffString: `${start} to ${end}` };
    } else { // 2nd Half
        const start = new Date(Date.UTC(year, month, 11)).toISOString().split('T')[0];
        const end = new Date(Date.UTC(year, month, 25)).toISOString().split('T')[0];
        return { startDate: start, endDate: end, cutOffString: `${start} to ${end}` };
    }
  }, [selectedYear, selectedMonth, selectedPeriod]);

  const isPeriodGenerated = useMemo(() => {
    return (payrolls || []).some(p => p.cutOff === cutOffString);
  }, [payrolls, cutOffString]);
  
  const calculatedData = useMemo(() => {
    if (!startDate || !endDate || new Date(endDate) < new Date(startDate)) return [];
    
    const periodSchedules = schedules.filter(s => s.date >= startDate && s.date <= endDate);
    const periodLogs = attendanceLogs.filter(a => a.date >= startDate && a.date <= endDate);

    return employees.map(emp => {
      const position = positionMap.get(emp.positionId);
      if (!position) return null;

      const dailyRate = position.monthlySalary / 22;
      let totalGross = 0, totalHolidayPay = 0, workdays = 0, totalHours = 0;
      const breakdown = [], absences = [];

      const empSchedulesInPeriod = periodSchedules.filter(s => s.empId === emp.id);
      const empLogsMap = new Map(periodLogs.filter(l => l.empId === emp.id).map(l => [l.date, l]));

      for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const dayOfWeek = new Date(dateStr + 'T00:00:00').getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;
        const schedule = empSchedulesInPeriod.find(s => s.date === dateStr);
        if (!schedule) continue;

        const attendance = empLogsMap.get(dateStr);
        const holiday = holidayMap.get(dateStr);
        let dailyPay = 0;
        let dayStatus = 'Absent';

        if (attendance && attendance.signIn) {
            workdays++; totalHours += 8; dailyPay = dailyRate; dayStatus = 'Present';
            if (holiday) {
                if (holiday.type === 'Regular Holiday') { dailyPay *= 2; totalHolidayPay += dailyRate; }
                if (holiday.type === 'Special Non-Working Day') { dailyPay *= 1.3; totalHolidayPay += dailyRate * 0.3; }
                dayStatus = `Worked Holiday (${holiday.name})`;
            }
        } else {
            dayStatus = 'Absent';
            absences.push({ description: 'Unexcused', startDate: dateStr, endDate: dateStr, totalDays: 1 });
        }
        totalGross += dailyPay;
        breakdown.push({ date: dateStr, status: dayStatus, pay: dailyPay });
      }
      
      const basePay = totalGross - totalHolidayPay;
      const earnings = [];
      if (basePay > 0) earnings.push({ description: 'Regular Pay', hours: totalHours, amount: parseFloat(basePay.toFixed(2)) });
      if (totalHolidayPay > 0) earnings.push({ description: 'Holiday Pay', hours: 0, amount: parseFloat(totalHolidayPay.toFixed(2)) });
      const isHr = position.id === 1;
      const latenessDeduction = calculateLatenessDeductions({ employee: emp, position, periodSchedules, periodLogs, isHr });
      const otherDeductions = [];
      if (latenessDeduction > 0) {
          otherDeductions.push({ description: 'Late Deduction', amount: parseFloat(latenessDeduction.toFixed(2)), isSystemGenerated: true });
      }
      return { emp, totalGross, breakdown, workdays, earnings, absences, otherDeductions };
    }).filter(Boolean).filter(item => item.workdays > 0);
  }, [startDate, endDate, employees, positions, schedules, attendanceLogs, holidays, positionMap, holidayMap]);

  const summary = useMemo(() => ({
    totalGross: calculatedData.reduce((acc, curr) => acc + curr.totalGross, 0),
    employeeCount: calculatedData.length
  }), [calculatedData]);

  const handleGeneratePayroll = () => {
    const payrollRun = {
      cutOff: cutOffString,
      records: calculatedData.map(item => {
        const position = positionMap.get(item.emp.positionId);
        const monthlySalary = position?.monthlySalary || 0;

        const sss = calculateSssContribution(monthlySalary);
        const philhealth = calculatePhilhealthContribution(monthlySalary);
        const pagibig = calculatePagibigContribution(monthlySalary);
        
        const sssSemi = parseFloat((sss.employeeShare / 2).toFixed(2));
        const philhealthSemi = parseFloat((philhealth.employeeShare / 2).toFixed(2));
        const pagibigSemi = parseFloat((pagibig.employeeShare / 2).toFixed(2));

        const taxableIncome = item.totalGross - (sssSemi + philhealthSemi + pagibigSemi);
        const { taxWithheld } = calculateTin(taxableIncome);

        return {
            empId: item.emp.id,
            employeeName: item.emp.name,
            earnings: item.earnings,
            deductions: {
                tax: parseFloat(taxWithheld.toFixed(2)),
                sss: sssSemi,
                philhealth: philhealthSemi,
                hdmf: pagibigSemi,
            },
            otherDeductions: item.otherDeductions,
            absences: item.absences,
            status: 'Pending',
        };
      })
    };
    onGenerate(payrollRun);
    navigate('/dashboard/payroll/history');
  };
  
  const handleViewBreakdown = (data) => { setSelectedEmployeeData(data); setShowBreakdownModal(true); };

  return (
    <div className="payroll-generation-container">
      <div className="card shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="card-title payroll-projection-title">Step 1: Select Pay Period</h5>
          <p className="card-text text-muted">Select a year, month, and period to calculate payroll.</p>
          <div className="row g-3 align-items-end">
            <div className="col-md-3"><label htmlFor="year" className="form-label fw-bold">Year</label><select id="year" className="form-select" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>{getYears().map(y => <option key={y} value={y}>{y}</option>)}</select></div>
            <div className="col-md-4"><label htmlFor="month" className="form-label fw-bold">Month</label><select id="month" className="form-select" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>{MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}</select></div>
            <div className="col-md-5"><label htmlFor="period" className="form-label fw-bold">Period</label><select id="period" className="form-select" value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)}>{PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></div>
          </div>
          {isPeriodGenerated && <div className="alert alert-warning mt-3">A payroll run for this period (<strong>{cutOffString}</strong>) already exists.</div>}
        </div>
      </div>

      {cutOffString && !isPeriodGenerated && (
        <>
            <h5 className="mb-3 payroll-projection-title">Step 2: Review and Generate</h5>
            <div className="payroll-generation-summary mb-4">
                <div className="row">
                    <div className="col-md-6 summary-item border-end"><div className="summary-label">Employees Included</div><div className="summary-value">{summary.employeeCount}</div></div>
                    <div className="col-md-6 summary-item"><div className="summary-label">Total Projected Gross Pay</div><div className="summary-value text-success">₱{formatCurrency(summary.totalGross)}</div></div>
                </div>
            </div>
            <div className="card shadow-sm">
            <div className="table-responsive">
                <table className="table data-table mb-0">
                  <thead><tr><th>Emp ID</th><th>Employee</th><th>Workdays</th><th>Calculated Gross</th><th>Action</th></tr></thead>
                  <tbody>
                    {calculatedData.map(item => (
                      <tr key={item.emp.id}>
                        <td>{item.emp.id}</td><td>{item.emp.name}</td><td>{item.workdays}</td>
                        <td className="fw-bold">₱{formatCurrency(item.totalGross)}</td>
                        <td><button className="btn btn-sm btn-outline-secondary" onClick={() => handleViewBreakdown(item)}>View Breakdown</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
            <div className="card-footer text-end p-3">
                <button className="btn btn-success" onClick={handleGeneratePayroll} disabled={calculatedData.length === 0}>
                    <i className="bi bi-check2-circle me-2"></i>Generate Payroll Run
                </button>
            </div>
            </div>
        </>
      )}
      {selectedEmployeeData && <IncomeBreakdownModal show={showBreakdownModal} onClose={() => setShowBreakdownModal(false)} data={selectedEmployeeData}/>}
    </div>
  );
};

export default PayrollGenerationPage;