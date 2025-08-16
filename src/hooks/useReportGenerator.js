import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart } from 'chart.js/auto';
import logo from '../assets/logo.png';

const generateChartAsImage = async (chartConfig) => {
  const canvas = document.createElement('canvas');
  canvas.width = 600; 
  canvas.height = 300;
  
  const ctx = canvas.getContext('2d');

  return new Promise((resolve, reject) => {
    try {
      new Chart(ctx, {
        ...chartConfig,
        options: { ...chartConfig.options, animation: false, responsive: false },
        plugins: [{
          id: 'custom_canvas_background',
          beforeDraw: (chart) => {
            const chartCtx = chart.canvas.getContext('2d');
            chartCtx.save();
            chartCtx.globalCompositeOperation = 'destination-over';
            chartCtx.fillStyle = 'white'; 
            chartCtx.fillRect(0, 0, chart.width, chart.height);
            chartCtx.restore();
          }
        }, {
          id: 'resolve_chart_rendering',
          afterRender: (chart) => { resolve(chart.toBase64Image('image/png')); }
        }]
      });
    } catch (error) { reject(error); }
  });
};

const useReportGenerator = () => {
  const [pdfDataUri, setPdfDataUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = async (reportId, params, dataSources) => {
    setIsLoading(true);
    setError(null);
    setPdfDataUri('');

    const { employees, positions, schedules, attendanceLogs, evaluations, trainingPrograms, enrollments, leaveRequests, payslipData, payrolls, cases, applicants, jobOpenings } = dataSources;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const generationDate = new Date().toLocaleDateString();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let finalY = 0; 

    const addHeader = (title) => {
      doc.addImage(logo, 'PNG', margin, 20, 80, 26);
      doc.setFontSize(18); doc.setFont(undefined, 'bold');
      doc.text(title, pageWidth - margin, 40, { align: 'right' });
      doc.setFontSize(10); doc.setFont(undefined, 'normal');
      doc.text(`Generated on: ${generationDate}`, pageWidth - margin, 55, { align: 'right' });
      doc.setLineWidth(1);
      doc.line(margin, 70, pageWidth - margin, 70);
      finalY = 85;
    };

    const addChartAndTitle = async (title, chartConfig) => {
        const chartImage = await generateChartAsImage(chartConfig);
        const chartHeight = 150;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(title, margin, finalY);
        finalY += 15;
        doc.addImage(chartImage, 'PNG', margin, finalY, pageWidth - (margin * 2), chartHeight);
        finalY += chartHeight + 20;
    };

    try {
      switch (reportId) {
        case 'employee_masterlist': {
            addHeader("Employee Masterlist");
            const positionMap = new Map(positions.map(p => [p.id, p.title]));
            const counts = positions.reduce((acc, pos) => ({ ...acc, [pos.title]: 0 }), {});
            employees.forEach(emp => {
                const positionTitle = positionMap.get(emp.positionId);
                if (positionTitle && counts.hasOwnProperty(positionTitle)) counts[positionTitle]++;
            });
            const chartConfig = { type: 'bar', data: { labels: Object.keys(counts), datasets: [{ label: 'Employees', data: Object.values(counts), backgroundColor: 'rgba(25, 135, 84, 0.6)' }] }, options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } } };
            await addChartAndTitle("Employee Distribution by Position", chartConfig);
            const tableColumns = ['ID', 'Name', 'Position', 'Email', 'Joining Date'];
            const tableRows = employees.map(emp => [emp.id, emp.name, positionMap.get(emp.positionId) || 'Unassigned', emp.email, emp.joiningDate]);
            autoTable(doc, { head: [tableColumns], body: tableRows, startY: finalY, theme: 'striped', headStyles: { fillColor: [25, 135, 84] } });
            break;
        }

        case 'positions_report': {
            addHeader("Company Positions Report");
            const employeeCounts = positions.reduce((acc, pos) => {
                acc[pos.title] = employees.filter(emp => emp.positionId === pos.id).length;
                return acc;
            }, {});
            const countChartConfig = { type: 'bar', data: { labels: Object.keys(employeeCounts), datasets: [{ label: 'Number of Employees', data: Object.values(employeeCounts), backgroundColor: 'rgba(25, 135, 84, 0.6)' }] }, options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } } };
            await addChartAndTitle("Employee Count by Position", countChartConfig);
            const sortedPositionsBySalary = [...positions].sort((a, b) => a.monthlySalary - b.monthlySalary);
            const salaryChartConfig = { type: 'bar', data: { labels: sortedPositionsBySalary.map(p => p.title), datasets: [{ label: 'Monthly Salary (₱)', data: sortedPositionsBySalary.map(p => p.monthlySalary), backgroundColor: 'rgba(13, 202, 240, 0.6)' }] }, options: { indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { ticks: { callback: value => `₱${(value/1000)}k` } } } } };
            await addChartAndTitle("Monthly Salary Comparison", salaryChartConfig);
            doc.addPage();
            finalY = 85;
            const tableColumns = ['Position Title', 'Employee Count', 'Monthly Salary (₱)', 'Description'];
            const tableRows = positions.map(pos => [ pos.title, employeeCounts[pos.title] || 0, pos.monthlySalary.toLocaleString(), pos.description ]);
            autoTable(doc, { head: [tableColumns], body: tableRows, startY: finalY, theme: 'grid', headStyles: { fillColor: [25, 135, 84] } });
            break;
        }

        case 'attendance_summary': {
            addHeader("Daily Attendance Report");
            const date = params.startDate;
            const schedulesForDate = schedules.filter(s => s.date === date);
            const attendanceForDate = attendanceLogs.filter(log => log.date === date);
            const stats = { Present: 0, Late: 0, Absent: 0 };
            schedulesForDate.forEach(sch => {
                const log = attendanceForDate.find(l => l.empId === sch.empId);
                if (!log || !log.signIn) stats.Absent++;
                else {
                    if (sch.shift) {
                        const shiftStart = sch.shift.split(' - ')[0];
                        if (log.signIn > shiftStart) stats.Late++;
                        else stats.Present++;
                    } else { stats.Present++; }
                }
            });
            const chartConfig = { type: 'doughnut', data: { labels: Object.keys(stats), datasets: [{ data: Object.values(stats), backgroundColor: ['#198754', '#ffc107', '#dc3545'] }] }, options: { plugins: { legend: { position: 'right' } } } };
            await addChartAndTitle(`Attendance Overview for ${date}`, chartConfig);
            const employeeMap = new Map(employees.map(e => [e.id, e]));
            const tableColumns = ['ID', 'Name', 'Shift', 'Sign In', 'Sign Out', 'Status'];
            const tableRows = schedulesForDate.map(sch => {
                const log = attendanceForDate.find(l => l.empId === sch.empId);
                const emp = employeeMap.get(sch.empId);
                let status = "Absent";
                if(log && log.signIn) {
                    if (sch.shift) {
                        const shiftStart = sch.shift.split(' - ')[0];
                        status = log.signIn > shiftStart ? 'Late' : 'Present';
                    } else { status = 'Present'; }
                }
                return [sch.empId, emp?.name || 'N/A', sch.shift || 'N/A', log?.signIn || '---', log?.signOut || '---', status];
            });
            autoTable(doc, { head: [tableColumns], body: tableRows, startY: finalY, theme: 'striped', headStyles: { fillColor: [25, 135, 84] } });
            break;
        }

        case 'leave_requests_report': {
            addHeader("Leave Requests Report");
            const filteredRequests = (leaveRequests || []).filter(req => {
                const reqDate = new Date(req.dateFrom);
                return reqDate >= new Date(params.startDate) && reqDate <= new Date(params.endDate);
            });
            if (filteredRequests.length === 0) {
                doc.text("No leave requests found for the selected period.", margin, finalY);
                break;
            }
            const leaveTypeCounts = filteredRequests.reduce((acc, req) => {
                acc[req.leaveType] = (acc[req.leaveType] || 0) + 1;
                return acc;
            }, {});
            const chartConfig = { type: 'pie', data: { labels: Object.keys(leaveTypeCounts), datasets: [{ data: Object.values(leaveTypeCounts), backgroundColor: ['#0d6efd', '#dc3545', '#ffc107', '#0dcaf0', '#6c757d'] }] }, options: { plugins: { legend: { position: 'right' } } } };
            await addChartAndTitle(`Leave Breakdown (${params.startDate} to ${params.endDate})`, chartConfig);
            const tableColumns = ["ID", "Name", "Position", "Leave Type", "Date Range", "Days", "Status"];
            const tableRows = filteredRequests.map(req => [ req.empId, req.name, req.position, req.leaveType, `${req.dateFrom} to ${req.dateTo}`, req.days, req.status ]);
            autoTable(doc, { head: [tableColumns], body: tableRows, startY: finalY, theme: 'striped', headStyles: { fillColor: [25, 135, 84] } });
            break;
        }

        case 'performance_summary': {
            addHeader("Performance Summary Report");
            const filteredEvals = evaluations.filter(ev => new Date(ev.periodEnd) >= new Date(params.startDate) && new Date(ev.periodEnd) <= new Date(params.endDate));
            const brackets = { 'Needs Improvement (<70%)': 0, 'Meets Expectations (70-90%)': 0, 'Outstanding (>90%)': 0 };
            filteredEvals.forEach(ev => {
                if (ev.overallScore < 70) brackets['Needs Improvement (<70%)']++;
                else if (ev.overallScore < 90) brackets['Meets Expectations (70-90%)']++;
                else brackets['Outstanding (>90%)']++;
            });
            const chartConfig = { type: 'bar', data: { labels: Object.keys(brackets), datasets: [{ label: 'Employees', data: Object.values(brackets), backgroundColor: ['#dc3545', '#ffc107', '#198754'] }] }, options: { plugins: { legend: { display: false } } } };
            await addChartAndTitle(`Performance Distribution (${params.startDate} to ${params.endDate})`, chartConfig);
            const employeeMap = new Map(employees.map(e => [e.id, e]));
            const positionMap = new Map(positions.map(p => [p.id, p.title]));
            const tableColumns = ['Employee', 'Position', 'Evaluator', 'Date', 'Score'];
            const tableRows = filteredEvals.map(ev => {
                const emp = employeeMap.get(ev.employeeId);
                const evaluator = employeeMap.get(ev.evaluatorId);
                return [emp?.name || ev.employeeId, positionMap.get(emp?.positionId) || 'N/A', evaluator?.name || ev.evaluatorId, ev.periodEnd, `${ev.overallScore.toFixed(2)}%`];
            });
            autoTable(doc, { head: [tableColumns], body: tableRows, startY: finalY, theme: 'striped', headStyles: { fillColor: [25, 135, 84] } });
            break;
        }

        case 'training_program_summary': {
            const program = trainingPrograms.find(p => p.id.toString() === params.programId.toString());
            addHeader("Training Program Report");
            const programEnrollments = enrollments.filter(e => e.programId.toString() === params.programId.toString());
            const stats = { 'Completed': 0, 'In Progress': 0, 'Not Started': 0 };
            programEnrollments.forEach(e => { stats[e.status]++; });
            const chartConfig = { type: 'pie', data: { labels: Object.keys(stats), datasets: [{ data: Object.values(stats), backgroundColor: ['#198754', '#0dcaf0', '#6c757d'] }] }, options: { plugins: { legend: { position: 'right' } } } };
            await addChartAndTitle(`Enrollment Status for "${program.title}"`, chartConfig);
            const employeeMap = new Map(employees.map(e => [e.id, e.name]));
            const tableColumns = ['Employee ID', 'Employee Name', 'Progress', 'Status'];
            const tableRows = programEnrollments.map(enr => [enr.employeeId, employeeMap.get(enr.employeeId) || 'N/A', `${enr.progress || 0}%`, enr.status]);
            autoTable(doc, { head: [tableColumns], body: tableRows, startY: finalY, theme: 'striped', headStyles: { fillColor: [25, 135, 84] } });
            break;
        }
        
        case 'disciplinary_cases': {
            addHeader("Disciplinary Cases Report");
            const filteredCases = (cases || []).filter(c => {
                const caseDate = new Date(c.issueDate);
                return caseDate >= new Date(params.startDate) && caseDate <= new Date(params.endDate);
            });
            if (filteredCases.length === 0) {
                doc.text("No disciplinary cases found for the selected period.", margin, finalY);
                break;
            }
            const actionTypeCounts = filteredCases.reduce((acc, c) => {
                acc[c.actionType] = (acc[c.actionType] || 0) + 1;
                return acc;
            }, {});
            const chartConfig = {
                type: 'pie',
                data: {
                    labels: Object.keys(actionTypeCounts),
                    datasets: [{
                        data: Object.values(actionTypeCounts),
                        backgroundColor: ['#ffc107', '#fd7e14', '#dc3545', '#6f42c1', '#0dcaf0', '#6c757d'],
                        borderColor: '#fff',
                        borderWidth: 2,
                    }]
                },
                options: {
                    plugins: { legend: { position: 'right' } }
                }
            };
            await addChartAndTitle(`Cases by Action Type (${params.startDate} to ${params.endDate})`, chartConfig);
            doc.setFontSize(10);
            doc.text(`Period: ${params.startDate} to ${params.endDate}`, margin, finalY);
            finalY += 20;
            const employeeMap = new Map(employees.map(e => [e.id, e.name]));
            const tableColumns = ["Case ID", "Employee Name", "Reason / Infraction", "Action Type", "Issue Date", "Status"];
            const tableRows = filteredCases.map(c => [ c.caseId, employeeMap.get(c.employeeId) || c.employeeId, c.reason, c.actionType, c.issueDate, c.status ]);
            autoTable(doc, { head: [tableColumns], body: tableRows, startY: finalY, theme: 'striped', headStyles: { fillColor: [25, 135, 84] } });
            break;
        }
        
        case 'recruitment_activity': {
            addHeader("Recruitment Activity Report");
            const jobOpeningsMap = new Map((jobOpenings || []).map(j => [j.id, j.title]));
            const filteredApps = (applicants || []).filter(app => {
                const appDate = new Date(app.applicationDate);
                return appDate >= new Date(params.startDate) && appDate <= new Date(params.endDate);
            });
            if (filteredApps.length === 0) {
                doc.text("No recruitment activity found for the selected period.", margin, finalY);
                break;
            }
            const statusCounts = filteredApps.reduce((acc, app) => {
                acc[app.status] = (acc[app.status] || 0) + 1;
                return acc;
            }, {});
            const chartConfig = {
                type: 'bar',
                data: {
                    labels: Object.keys(statusCounts),
                    datasets: [{
                        label: 'Applicants',
                        data: Object.values(statusCounts),
                        backgroundColor: ['#0d6efd', '#6c757d', '#0dcaf0', '#ffc107', '#198754', '#dc3545']
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                }
            };
            await addChartAndTitle(`Applicant Status Distribution (${params.startDate} to ${params.endDate})`, chartConfig);
            const tableColumns = ["Applicant Name", "Applied For", "Application Date", "Status"];
            const tableRows = filteredApps.map(app => [ app.name, jobOpeningsMap.get(app.jobOpeningId) || 'N/A', app.applicationDate, app.status ]);
            autoTable(doc, { head: [tableColumns], body: tableRows, startY: finalY, theme: 'striped', headStyles: { fillColor: [25, 135, 84] } });
            break;
        }

        case 'payroll_run_summary': {
            addHeader("Payroll Summary Report");
            const run = (payrolls || []).find(p => p.runId === params.runId);
            if (!run) {
                doc.text("Selected payroll run could not be found.", margin, finalY);
                break;
            }
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            doc.text(`Pay Period:`, margin, finalY);
            doc.setFont(undefined, 'normal');
            doc.text(run.cutOff, margin + 60, finalY);
            const runTotals = run.records.reduce((acc, rec) => {
                const totalDeductions = Object.values(rec.deductions).reduce((s,v) => s + v, 0);
                acc.gross += rec.grossPay;
                acc.deductions += totalDeductions;
                acc.net += rec.netPay;
                return acc;
            }, { gross: 0, deductions: 0, net: 0 });
            doc.setFont(undefined, 'bold');
            doc.text(`Total Net Payout:`, pageWidth / 2, finalY);
            doc.setFont(undefined, 'normal');
            doc.text(`₱ ${runTotals.net.toLocaleString('en-US', {minimumFractionDigits: 2})}`, pageWidth / 2 + 85, finalY);
            finalY += 20;
            const tableColumns = ['ID', 'Employee Name', 'Gross Pay (₱)', 'Deductions (₱)', 'Net Pay (₱)', 'Status'];
            const tableRows = run.records.map(rec => {
                const totalDeductions = Object.values(rec.deductions).reduce((sum, val) => sum + val, 0);
                return [
                    rec.empId, rec.employeeName,
                    rec.grossPay.toLocaleString('en-US', {minimumFractionDigits: 2}),
                    totalDeductions.toLocaleString('en-US', {minimumFractionDigits: 2}),
                    rec.netPay.toLocaleString('en-US', {minimumFractionDigits: 2}),
                    rec.status
                ];
            });
            autoTable(doc, { head: [tableColumns], body: tableRows, startY: finalY, theme: 'striped', headStyles: { fillColor: [25, 135, 84] }, columnStyles: { 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' }} });
            break;
        }

        case 'payslip': {
            const totalEarnings = Object.values(payslipData.earnings).reduce((s, v) => s + v, 0) + (payslipData.adjustments?.allowances || 0) + (payslipData.adjustments?.bonuses || 0);
            const totalDeductions = Object.values(payslipData.deductions).reduce((s, v) => s + v, 0);
            const chartConfig = { type: 'doughnut', data: { labels: ['Net Pay', 'Deductions'], datasets: [{ data: [totalEarnings - totalDeductions, totalDeductions], backgroundColor: ['#198754', '#dc3545'] }] }, options: { plugins: { legend: { position: 'right' } } } };
            const chartImage = await generateChartAsImage(chartConfig);
            doc.deletePage(1);
            doc.addPage('letter', 'p');
            addHeader('Payslip');
            doc.setFontSize(10);
            doc.text(`Employee:`, margin, finalY);
            doc.text(`Pay Period:`, pageWidth / 2, finalY);
            doc.setFont(undefined, 'bold');
            doc.text(`${payslipData.employeeName} (${payslipData.empId})`, margin + 45, finalY);
            doc.text(payslipData.cutOff, pageWidth / 2 + 50, finalY);
            finalY += 15;
            const earningsBody = Object.entries(payslipData.earnings).map(([key, val]) => [key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), val.toFixed(2)]);
            if(payslipData.adjustments?.allowances) earningsBody.push(['Allowances', payslipData.adjustments.allowances.toFixed(2)]);
            if(payslipData.adjustments?.bonuses) earningsBody.push(['Bonuses', payslipData.adjustments.bonuses.toFixed(2)]);
            const deductionsBody = Object.entries(payslipData.deductions).map(([key, val]) => [key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), val.toFixed(2)]);
            autoTable(doc, { head: [['Earnings', 'Amount (₱)']], body: earningsBody, startY: finalY, theme: 'grid', headStyles: { fillColor: '#198754' }, columnStyles: { 1: { halign: 'right' } } });
            finalY = doc.lastAutoTable.finalY + 10;
            autoTable(doc, { head: [['Deductions', 'Amount (₱)']], body: deductionsBody, startY: finalY, theme: 'grid', headStyles: { fillColor: '#dc3545' }, columnStyles: { 1: { halign: 'right' } } });
            finalY = doc.lastAutoTable.finalY + 15;
            doc.setFontSize(10); doc.setFont(undefined, 'normal');
            doc.text('Gross Pay:', pageWidth - 80, finalY, { align: 'right' }); doc.text(totalEarnings.toFixed(2), pageWidth - margin, finalY, { align: 'right' });
            doc.text('Total Deductions:', pageWidth - 80, finalY + 15, { align: 'right' }); doc.text(`- ${totalDeductions.toFixed(2)}`, pageWidth - margin, finalY + 15, { align: 'right' });
            doc.setLineWidth(0.2); doc.line(pageWidth - 80, finalY + 20, pageWidth - margin, finalY + 20);
            doc.setFontSize(12); doc.setFont(undefined, 'bold');
            doc.text('Net Pay:', pageWidth - 80, finalY + 30, { align: 'right' }); doc.setTextColor('#198754'); doc.text(`₱ ${(totalEarnings - totalDeductions).toFixed(2)}`, pageWidth - margin, finalY + 30, { align: 'right' });
            finalY += 50;
            doc.addImage(chartImage, 'PNG', margin, finalY, pageWidth - (margin * 2), 150);
            break;
        }

        default:
          throw new Error('Unknown report type requested.');
      }
      
      const pdfBlob = doc.output('blob');
      setPdfDataUri(URL.createObjectURL(pdfBlob));

    } catch (e) {
      console.error("Error generating report:", e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { generateReport, pdfDataUri, isLoading, error, setPdfDataUri };
};

export default useReportGenerator;  