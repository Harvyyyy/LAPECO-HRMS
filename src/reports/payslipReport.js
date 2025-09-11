import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/logo.png';
import { format } from 'date-fns';

// --- HELPERS & CONFIG ---
const FONT_REGULAR = 'Helvetica';
const FONT_BOLD = 'Helvetica-Bold';
const COLOR_PRIMARY = '#212529';
const COLOR_SECONDARY = '#6c757d';
const COLOR_BORDER = '#dee2e6';
const COLOR_HEADER_BG = [248, 249, 250];
const PAGE_MARGIN = 40;
const SECTION_HEADER_HEIGHT = 18;
const LINE_HEIGHT = 13;

const COLOR_BRAND = [25, 135, 84];
const COLOR_WHITE = [255, 255, 255];

const formatCurrency = (val) => (val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatDateString = (dateStr) => dateStr ? format(new Date(dateStr + 'T00:00:00'), 'MMMM dd, yyyy') : 'N/A';

const addFooterAndConcernSlip = (doc, y, pageWidth, employeeDetails, payrollId) => {
    doc.setFont(FONT_BOLD); doc.setFontSize(8); doc.setTextColor(COLOR_SECONDARY);
    doc.text('THIS IS A COMPUTER GENERATED PAYSLIP', pageWidth / 2, y, { align: 'center' });
    y += 12;
    doc.setFont(FONT_REGULAR); doc.setFontSize(7);
    doc.text('For concerns regarding your payslip, please get in touch with the office and we will gladly assist you. Please fill-up form below for your concerns.', pageWidth / 2, y, { align: 'center' });
    y += 15;

    const concernStartY = y;
    const concernLine = (label, lineY, value = '') => {
        doc.setFontSize(8); doc.setTextColor(COLOR_SECONDARY); doc.text(label, PAGE_MARGIN, lineY);
        doc.setDrawColor(COLOR_SECONDARY); doc.line(PAGE_MARGIN + 90, lineY, pageWidth / 2 + 80, lineY);
        if (value) {
            doc.setFont(FONT_BOLD); doc.setTextColor(COLOR_PRIMARY); doc.text(value, PAGE_MARGIN + 95, lineY - 2);
        }
    };
    
    concernLine('Employee Full Name', concernStartY, employeeDetails.name.toUpperCase());
    concernLine('Employee Number', concernStartY + 15, employeeDetails.id);
    concernLine('Payroll Number in Concern', concernStartY + 30, payrollId);
    concernLine('Concern dates:', concernStartY + 45);
    concernLine('Over/Underpaid Amount', concernStartY + 60);
    concernLine('Loan/Deduction Amount', concernStartY + 75);
    concernLine('Other Concerns', concernStartY + 90);

    const guideX = pageWidth / 2 + 100;
    const guideY = concernStartY;
    doc.setDrawColor(COLOR_BORDER); doc.setFillColor(...COLOR_HEADER_BG);
    doc.roundedRect(guideX, guideY, 150, 45, 3, 3, 'FD');
    doc.setFont(FONT_BOLD); doc.setTextColor(COLOR_PRIMARY);
    doc.text('Payslip Guide', guideX + 10, guideY + 10);
    doc.setFont(FONT_REGULAR); doc.setFontSize(6.5); doc.setTextColor(COLOR_SECONDARY);
    const guideItems = [
        { label: 'Gross Pay', formula: '= Total Amount of Earnings' },
        { label: 'Statutory Ded', formula: '= SSS + PHIC + HDMF' },
        { label: 'Other Ded', formula: '= Canteen + Cash Advance + Others + Loans' },
        { label: 'Net Pay', formula: '= Gross - Statutory Deductions - Other Ded' },
    ];
    const labelWidths = guideItems.map(item => doc.getTextWidth(item.label));
    const maxLabelWidth = Math.max(...labelWidths);
    const formulaX = guideX + 10 + maxLabelWidth + 5;
    let currentGuideY = guideY + 20;
    guideItems.forEach(item => {
        doc.text(item.label, guideX + 10, currentGuideY);
        doc.text(item.formula, formulaX, currentGuideY);
        currentGuideY += 9;
    });

    y = concernStartY + 120;
    doc.line(PAGE_MARGIN, y, PAGE_MARGIN + 200, y);
    doc.text('Printed Name over Signature of Employee', PAGE_MARGIN, y + 8);
    doc.line(pageWidth - PAGE_MARGIN - 200, y, pageWidth - PAGE_MARGIN, y);
    doc.text('Received and Noted by:', pageWidth - PAGE_MARGIN - 200, y + 8);
};

// --- MAIN GENERATOR FUNCTION ---
export const generatePayslipReport = async (doc, params, dataSources) => {
  const { payslipData, employeeDetails } = dataSources;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = PAGE_MARGIN;

  const addHeader = () => {
    doc.addImage(logo, 'PNG', pageWidth / 2 - 40, 25, 80, 26);
    doc.setFont(FONT_BOLD);
    doc.setFontSize(18);
    doc.setTextColor(...COLOR_BRAND);
    doc.text('Payslip', pageWidth / 2, 70, { align: 'center' });
    doc.setFont(FONT_REGULAR);
    doc.setFontSize(8);
    doc.setTextColor(COLOR_SECONDARY);
    doc.text(`Generated: ${format(new Date(), 'hh:mm a zzz, MMM dd, yyyy')}`, pageWidth / 2, 82, { align: 'center' });
    y = 95;
  };

  const addInfoSection = (title, data) => {
    doc.setFont(FONT_BOLD); doc.setFontSize(10); doc.setTextColor(...COLOR_BRAND);
    doc.text(title, PAGE_MARGIN, y);
    doc.setDrawColor(COLOR_BORDER); doc.line(PAGE_MARGIN, y + 4, pageWidth - PAGE_MARGIN, y + 4);
    y += 15;
    doc.setFont(FONT_REGULAR); doc.setFontSize(9);
    const col1LabelX = PAGE_MARGIN + 5, col1ColonX = col1LabelX + 80, col1ValueX = col1ColonX + 5;
    const col2LabelX = pageWidth / 2 + 15, col2ColonX = col2LabelX + 80, col2ValueX = col2ColonX + 5;
    const numRows = Math.ceil(data.length / 2);
    for (let i = 0; i < numRows; i++) {
        const currentY = y + (i * LINE_HEIGHT);
        const item1 = data[i], item2 = data[i + numRows];
        if (item1) {
            doc.setTextColor(COLOR_SECONDARY); doc.text(item1.label, col1LabelX, currentY);
            doc.text(':', col1ColonX, currentY); doc.setTextColor(COLOR_PRIMARY); doc.text(item1.value, col1ValueX, currentY);
        }
        if (item2) {
            doc.setTextColor(COLOR_SECONDARY); doc.text(item2.label, col2LabelX, currentY);
            doc.text(':', col2ColonX, currentY); doc.setTextColor(COLOR_PRIMARY); doc.text(item2.value, col2ValueX, currentY);
        }
    }
    y += numRows * LINE_HEIGHT;
  };

  const addSectionHeader = (x, currentY, width, title) => {
    doc.setFillColor(...COLOR_BRAND);
    doc.rect(x, currentY, width, SECTION_HEADER_HEIGHT, 'F');
    doc.setFont(FONT_BOLD); doc.setFontSize(9); doc.setTextColor(...COLOR_WHITE);
    doc.text(title, x + 5, currentY + SECTION_HEADER_HEIGHT / 2, { verticalAlign: 'middle' });
  };

  const pageBreakCheck = (data) => {
    if (data.pageNumber > 1) {
      y = PAGE_MARGIN;
    }
  };

  addHeader();
  const employeeData = [
      { label: 'Full Name', value: employeeDetails.name || 'N/A' }, { label: 'Tax ID', value: employeeDetails.tinNo || 'N/A' },
      { label: 'PHIC No.', value: employeeDetails.philhealthNo || 'N/A' }, { label: 'PY Account', value: employeeDetails.pyAccount || '000001' },
      { label: 'Location', value: employeeDetails.location || 'Manila Warehouse' }, { label: 'Status', value: employeeDetails.status || 'N/A' },
      { label: 'Employee No.', value: employeeDetails.id || 'N/A' }, { label: 'SSS No.', value: employeeDetails.sssNo || 'N/A' },
      { label: 'HDMF No.', value: employeeDetails.pagIbigNo || 'N/A' }, { label: 'Position', value: employeeDetails.positionTitle || 'N/A' },
      { label: 'Schedule', value: employeeDetails.schedule || 'Rotating Shift' },
  ];
  addInfoSection('Employee Details', employeeData);
  y += 5;
  const periodData = [
      { label: 'Payroll Type', value: payslipData.payrollType || 'Semi-monthly' }, { label: 'Payment Date', value: formatDateString(payslipData.paymentDate) },
      { label: 'Pay End Date', value: formatDateString(payslipData.payEndDate) }, { label: 'Period', value: payslipData.period || 'N/A' },
      { label: 'Pay Start Date', value: formatDateString(payslipData.payStartDate) },
  ];
  addInfoSection('Payroll Period', periodData);
  y += 10;
  
  doc.setFont(FONT_BOLD); doc.setFontSize(10); doc.setTextColor(...COLOR_BRAND);
  doc.text('Pay Summary', PAGE_MARGIN, y);
  doc.setDrawColor(COLOR_BORDER); doc.line(PAGE_MARGIN, y + 4, pageWidth - PAGE_MARGIN, y + 4);
  y += 15;
  
  const totalGross = (payslipData.earnings || []).reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalStatutory = Object.values(payslipData.deductions || {}).reduce((sum, val) => sum + val, 0);
  const totalOther = (payslipData.otherDeductions || []).reduce((sum, item) => sum + (item.amount || 0), 0);
  const netPay = totalGross - totalStatutory - totalOther;
  
  autoTable(doc, {
      startY: y, theme: 'grid', styles: { fontSize: 8, cellPadding: 3, lineColor: COLOR_BORDER, lineWidth: 0.5 },
      headStyles: { fillColor: COLOR_BRAND, textColor: COLOR_WHITE, fontStyle: 'bold', lineColor: COLOR_BORDER },
      head: [['Category', 'Gross', 'Statutory Deductions', 'Taxes', 'Other Deductions', 'Net Pay']],
      body: [[ 'Current', formatCurrency(totalGross), formatCurrency(totalStatutory), formatCurrency(payslipData.deductions?.tax || 0), formatCurrency(totalOther), formatCurrency(netPay) ]],
      columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right', fontStyle: 'bold' } },
      didDrawCell: (data) => { if (data.section === 'body' && data.column.index === 5) { doc.setTextColor(...COLOR_BRAND); } },
      didDrawPage: pageBreakCheck,
  });
  y = doc.lastAutoTable.finalY + 8;
  
  const midPoint = pageWidth / 2;
  const tableWidth = midPoint - PAGE_MARGIN - 2.5;
  addSectionHeader(doc, PAGE_MARGIN, y, tableWidth, 'Hours and Earnings');
  addSectionHeader(doc, midPoint + 2.5, y, tableWidth, 'Statutory Deductions');
  let tableStartY = y + SECTION_HEADER_HEIGHT;

  autoTable(doc, {
      startY: tableStartY, head: [['Description', 'Hours', 'Amount']], body: (payslipData.earnings || []).map(e => [e.description, e.hours, formatCurrency(e.amount)]),
      theme: 'grid', tableWidth: tableWidth, margin: { left: PAGE_MARGIN }, styles: { fontSize: 8, cellPadding: 3, lineColor: COLOR_BORDER, lineWidth: 0.5 },
      headStyles: { fillColor: COLOR_HEADER_BG, textColor: COLOR_SECONDARY, fontStyle: 'bold', lineColor: COLOR_BORDER }, didDrawPage: pageBreakCheck,
  });
  const leftTableY1 = doc.lastAutoTable.finalY;

  autoTable(doc, {
      startY: tableStartY, head: [['Description', 'Amount']], body: [['SSS', formatCurrency(payslipData.deductions?.sss)], ['PHIC', formatCurrency(payslipData.deductions?.philhealth)], ['HDMF', formatCurrency(payslipData.deductions?.hdmf)]],
      theme: 'grid', tableWidth: tableWidth, margin: { left: midPoint + 2.5 }, styles: { fontSize: 8, cellPadding: 3, lineColor: COLOR_BORDER, lineWidth: 0.5 },
      headStyles: { fillColor: COLOR_HEADER_BG, textColor: COLOR_SECONDARY, fontStyle: 'bold', lineColor: COLOR_BORDER }, didDrawPage: pageBreakCheck,
  });
  y = Math.max(leftTableY1, doc.lastAutoTable.finalY) + 8;

  addSectionHeader(doc, PAGE_MARGIN, y, tableWidth, 'Leave Balances');
  addSectionHeader(doc, midPoint + 2.5, y, tableWidth, 'Absences');
  tableStartY = y + SECTION_HEADER_HEIGHT;
  
  autoTable(doc, {
      startY: tableStartY, head: [['Description', 'Unused Leave (hrs)', 'Claimed (hrs)']], body: [['Vacation', formatCurrency((payslipData.leaveBalances?.vacation || 0) * 8), '0.00'], ['Sick', formatCurrency((payslipData.leaveBalances?.sick || 0) * 8), '0.00']],
      theme: 'grid', tableWidth: tableWidth, margin: { left: PAGE_MARGIN }, styles: { fontSize: 8, cellPadding: 3, lineColor: COLOR_BORDER, lineWidth: 0.5 },
      headStyles: { fillColor: COLOR_HEADER_BG, textColor: COLOR_SECONDARY, fontStyle: 'bold', lineColor: COLOR_BORDER }, didDrawPage: pageBreakCheck,
  });
  const leftTableY2 = doc.lastAutoTable.finalY;

  autoTable(doc, {
      startY: tableStartY, head: [['Description', 'Start Date', 'End Date', 'Total Day/s']], body: (payslipData.absences || []).length > 0 ? payslipData.absences.map(a => [a.description, a.startDate, a.endDate, a.totalDays]) : [['-', '-', '-', '0.00']],
      theme: 'grid', tableWidth: tableWidth, margin: { left: midPoint + 2.5 }, styles: { fontSize: 8, cellPadding: 3, lineColor: COLOR_BORDER, lineWidth: 0.5 },
      headStyles: { fillColor: COLOR_HEADER_BG, textColor: COLOR_SECONDARY, fontStyle: 'bold', lineColor: COLOR_BORDER }, didDrawPage: pageBreakCheck,
  });
  y = Math.max(leftTableY2, doc.lastAutoTable.finalY) + 8;
  
  addSectionHeader(doc, PAGE_MARGIN, y, pageWidth - (PAGE_MARGIN * 2), 'Other Deductions Information');
  tableStartY = y + SECTION_HEADER_HEIGHT;

  autoTable(doc, {
      startY: tableStartY, head: [['Description', 'Loan Amount', 'Amount Deduction', 'Outstanding Balance']],
      body: (payslipData.otherDeductions || []).map(d => [d.description, formatCurrency(d.loanAmount), formatCurrency(d.amount), formatCurrency(d.outstandingBalance)]),
      theme: 'grid', margin: { left: PAGE_MARGIN }, styles: { fontSize: 8, cellPadding: 3, lineColor: COLOR_BORDER, lineWidth: 0.5 },
      headStyles: { fillColor: COLOR_HEADER_BG, textColor: COLOR_SECONDARY, fontStyle: 'bold', lineColor: COLOR_BORDER },
      didDrawPage: (data) => {
          pageBreakCheck(data);
          let finalY = doc.lastAutoTable.finalY || y;
          if (pageHeight - finalY < 180) {
              doc.addPage();
              finalY = PAGE_MARGIN;
          }
          addFooterAndConcernSlip(doc, finalY + 15, pageWidth, employeeDetails, payslipData.payrollId);
      },
  });
  
  return doc;
};