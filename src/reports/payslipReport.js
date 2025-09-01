import autoTable from 'jspdf-autotable';
import logo from '../assets/logo.png';

const formatCurrency = (value) => {
    if (typeof value !== 'number') return '₱ 0.00';
    return `₱ ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const addSectionTitle = (doc, title, y, { pageWidth, margin }) => {
  doc.setFillColor(25, 135, 84); 
  doc.setDrawColor(25, 135, 84);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 24, 3, 3, 'FD');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text(title, margin + 10, y + 16);
  return y + 30;
};

export const generatePayslipReport = async (doc, params, dataSources) => {
  const { payslipData, employeeDetails } = dataSources;
  const { pageWidth, margin } = params;
  let finalY = margin;

  const headerHeight = 90;
  doc.setFillColor(248, 249, 250);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');
  doc.setDrawColor(233, 236, 239);
  doc.setLineWidth(1);
  doc.line(0, headerHeight, pageWidth, headerHeight);
  
  const logoWidth = 80;
  const logoHeight = 26;
  const logoY = (headerHeight - logoHeight) / 2; 
  doc.addImage(logo, 'PNG', margin, logoY, logoWidth, logoHeight);
  
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(25, 135, 84);
  doc.text('OFFICIAL PAYSLIP', pageWidth - margin, logoY + 10, { align: 'right' });
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(108, 117, 125);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin, logoY + 25, { align: 'right' });
  
  if (employeeDetails.companyName) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(33, 37, 41);
    doc.text(employeeDetails.companyName, margin, logoY + logoHeight + 15);
  }
  
  finalY = headerHeight + 10;

  finalY = addSectionTitle(doc, 'EMPLOYEE & PAYROLL INFORMATION', finalY, { pageWidth, margin });
  
  const halfPageWidth = (pageWidth - margin * 2) / 2;
  const columnGap = 20;
  const boxHeight = 140;
  
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(233, 236, 239);
  doc.roundedRect(margin, finalY, halfPageWidth - columnGap/2, boxHeight, 3, 3, 'FD');
  
  doc.setTextColor(33, 37, 41);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(employeeDetails.name, margin + 15, finalY + 25);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(employeeDetails.positionTitle || 'N/A', margin + 15, finalY + 45);
  
  doc.setFontSize(9);
  doc.setTextColor(108, 117, 125);
  
  const leftLabelX = margin + 15;
  const leftValueX = margin + 85;
  const rightLabelX = margin + halfPageWidth/2 - 10;
  const rightValueX = margin + halfPageWidth/2 + 60;
  
  doc.text('Employee ID:', leftLabelX, finalY + 70);
  doc.text('Employment Status:', leftLabelX, finalY + 85);
  doc.text('TIN:', leftLabelX, finalY + 100);
  
  doc.text('SSS No:', rightLabelX, finalY + 70);
  doc.text('PhilHealth No:', rightLabelX, finalY + 85);
  doc.text('HDMF No:', rightLabelX, finalY + 100);
  
  doc.setTextColor(33, 37, 41);
  doc.setFont(undefined, 'bold');
  
  doc.text(employeeDetails.id || 'N/A', leftValueX, finalY + 70);
  doc.text(employeeDetails.status || 'N/A', leftValueX, finalY + 85);
  doc.text(employeeDetails.tinNo || 'N/A', leftValueX, finalY + 100);
  
  doc.text(employeeDetails.sssNo || 'N/A', rightValueX, finalY + 70);
  doc.text(employeeDetails.philhealthNo || 'N/A', rightValueX, finalY + 85);
  doc.text(employeeDetails.pagIbigNo || 'N/A', rightValueX, finalY + 100);
  
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin + halfPageWidth + columnGap/2, finalY, halfPageWidth - columnGap/2, boxHeight, 3, 3, 'FD');
  
  doc.setTextColor(33, 37, 41);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('PAYROLL PERIOD', margin + halfPageWidth + columnGap/2 + 15, finalY + 25);
  
  const rightBoxLabelX = margin + halfPageWidth + columnGap/2 + 15;
  const rightBoxValueX = margin + halfPageWidth + columnGap/2 + 75;
  
  doc.setFontSize(9);
  doc.setTextColor(108, 117, 125);
  doc.setFont(undefined, 'normal');
  doc.text('Period:', rightBoxLabelX, finalY + 50);
  doc.text('Start Date:', rightBoxLabelX, finalY + 70);
  doc.text('End Date:', rightBoxLabelX, finalY + 90);
  doc.text('Pay Date:', rightBoxLabelX, finalY + 110);
  
  doc.setTextColor(33, 37, 41);
  doc.setFont(undefined, 'bold');
  doc.text(payslipData.period || 'N/A', rightBoxValueX, finalY + 50);
  doc.text(payslipData.cutOffStart || 'N/A', rightBoxValueX, finalY + 70);
  doc.text(payslipData.cutOffEnd || 'N/A', rightBoxValueX, finalY + 90);
  doc.text(payslipData.payDate || new Date().toLocaleDateString(), rightBoxValueX, finalY + 110);
  
  finalY += boxHeight + 15;

  finalY = addSectionTitle(doc, 'EARNINGS', finalY, { pageWidth, margin });
  
  const totalEarnings = (payslipData.earnings || []).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  
  const earningsData = payslipData.earnings || [];
  
  if (earningsData.length === 0) {
    earningsData.push({
      description: 'No earnings data available',
      hours: '--',
      amount: 0
    });
  }
  
  autoTable(doc, {
    body: [
      [{ content: 'Description', styles: { fontStyle: 'bold', fillColor: [248, 249, 250] } }, 
       { content: 'Hours', styles: { fontStyle: 'bold', fillColor: [248, 249, 250] } }, 
       { content: 'Amount', styles: { fontStyle: 'bold', halign: 'right', fillColor: [248, 249, 250] } }],
      ...earningsData.map(e => [e.description, e.hours || '--', formatCurrency(e.amount)])
    ],
    foot: [[
      { content: 'Total Earnings', styles: { fontStyle: 'bold', fillColor: [233, 236, 239] } }, 
      { content: '', styles: { fillColor: [233, 236, 239] } }, 
      { content: formatCurrency(totalEarnings), styles: { fontStyle: 'bold', halign: 'right', fillColor: [233, 236, 239] } }
    ]],
    startY: finalY,
    theme: 'grid',
    tableWidth: pageWidth - margin * 2,
    styles: { fontSize: 9, cellPadding: 6 },
    columnStyles: { 
      0: { cellWidth: 'auto' },
      1: { cellWidth: 80 },
      2: { cellWidth: 100, halign: 'right' } 
    },
    headStyles: { fillColor: [248, 249, 250] },
    footStyles: { fillColor: [233, 236, 239] },
    margin: { top: 10 }
  });
  
  finalY = doc.lastAutoTable.finalY + 25;
  
  finalY = addSectionTitle(doc, 'DEDUCTIONS', finalY, { pageWidth, margin });
  
  const deductions = payslipData.deductions || { sss: 0, philhealth: 0, hdmf: 0, tax: 0 };
  
  const statutoryDeductions = [
    ['SSS Contribution', formatCurrency(deductions.sss || 0)],
    ['PhilHealth Contribution', formatCurrency(deductions.philhealth || 0)],
    ['Pag-IBIG Contribution', formatCurrency(deductions.hdmf || 0)],
    ['Withholding Tax', formatCurrency(deductions.tax || 0)],
  ];
  
  const totalStatutory = Object.values(deductions).reduce((sum, val) => sum + (Number(val) || 0), 0);
  
  autoTable(doc, {
    body: [
      [{ content: 'Statutory Deductions', styles: { fontStyle: 'bold', fontSize: 10, fillColor: [248, 249, 250] } }, 
       { content: '', styles: { fillColor: [248, 249, 250] } }],
      ...statutoryDeductions,
      [{ content: 'Subtotal - Statutory Deductions', styles: { fontStyle: 'bold' } }, 
       { content: formatCurrency(totalStatutory), styles: { fontStyle: 'bold', halign: 'right' } }]
    ],
    startY: finalY,
    theme: 'grid',
    tableWidth: pageWidth - margin * 2,
    styles: { fontSize: 9, cellPadding: 6 },
    columnStyles: { 
      0: { cellWidth: 'auto' },
      1: { cellWidth: 100, halign: 'right' } 
    },
    margin: { top: 10 }
  });
  
  let deductionsTableEndY = doc.lastAutoTable.finalY + 15;
  
  let totalOtherDeductions = 0;
  
  if (payslipData.otherDeductions && payslipData.otherDeductions.length > 0) {
    totalOtherDeductions = payslipData.otherDeductions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    
    const otherDeductionsData = [...payslipData.otherDeductions];
    
    autoTable(doc, {
      body: [
        [{ content: 'Other Deductions', styles: { fontStyle: 'bold', fontSize: 10, fillColor: [248, 249, 250] } }, 
         { content: '', styles: { fillColor: [248, 249, 250] } }],
        ...otherDeductionsData.map(d => [d.description, formatCurrency(d.amount || 0)]),
        [{ content: 'Subtotal - Other Deductions', styles: { fontStyle: 'bold' } }, 
         { content: formatCurrency(totalOtherDeductions), styles: { fontStyle: 'bold', halign: 'right' } }]
      ],
      startY: deductionsTableEndY,
      theme: 'grid',
      tableWidth: pageWidth - margin * 2,
      styles: { fontSize: 9, cellPadding: 6 },
      columnStyles: { 
        0: { cellWidth: 'auto' },
        1: { cellWidth: 100, halign: 'right' } 
      },
      margin: { top: 5 }
    });
    
    deductionsTableEndY = doc.lastAutoTable.finalY;
  } else {
    autoTable(doc, {
      body: [
        [{ content: 'Other Deductions', styles: { fontStyle: 'bold', fontSize: 10, fillColor: [248, 249, 250] } }, 
         { content: '', styles: { fillColor: [248, 249, 250] } }],
        ['No other deductions', formatCurrency(0)],
        [{ content: 'Subtotal - Other Deductions', styles: { fontStyle: 'bold' } }, 
         { content: formatCurrency(0), styles: { fontStyle: 'bold', halign: 'right' } }]
      ],
      startY: deductionsTableEndY,
      theme: 'grid',
      tableWidth: pageWidth - margin * 2,
      styles: { fontSize: 9, cellPadding: 6 },
      columnStyles: { 
        0: { cellWidth: 'auto' },
        1: { cellWidth: 100, halign: 'right' } 
      },
      margin: { top: 5 }
    });
    
    deductionsTableEndY = doc.lastAutoTable.finalY;
  }
  
  finalY = deductionsTableEndY + 25;

  const hasAbsences = payslipData.absences && payslipData.absences.length > 0;
  const hasLeaveBalances = payslipData.leaveBalances && Object.keys(payslipData.leaveBalances).length > 0;
  
  if (hasAbsences || hasLeaveBalances) {
    finalY = addSectionTitle(doc, 'ADDITIONAL INFORMATION', finalY, { pageWidth, margin });
  }
  
  if (hasAbsences) {
    const absencesData = [...payslipData.absences];
    
    autoTable(doc, {
      body: [
        [{ content: 'Absences / Unpaid Leave', styles: { fontStyle: 'bold', fontSize: 10, fillColor: [248, 249, 250], colSpan: 3 } }],
        [{ content: 'Description', styles: { fontStyle: 'bold', fillColor: [248, 249, 250] } }, 
         { content: 'Date Range', styles: { fontStyle: 'bold', fillColor: [248, 249, 250] } }, 
         { content: 'Days', styles: { fontStyle: 'bold', halign: 'center', fillColor: [248, 249, 250] } }],
        ...absencesData.map(a => [a.description, `${a.startDate || 'N/A'} to ${a.endDate || 'N/A'}`, { content: a.totalDays || 0, styles: { halign: 'center' } }])
      ],
      startY: finalY,
      theme: 'grid',
      tableWidth: pageWidth - margin * 2,
      styles: { fontSize: 9, cellPadding: 6 },
      columnStyles: { 
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 80, halign: 'center' } 
      },
      margin: { top: 10 }
    });
    finalY = doc.lastAutoTable.finalY + 15;
  }

  if (hasLeaveBalances) {
    const leaveBalances = {
      vacation: payslipData.leaveBalances.vacation || 0,
      sick: payslipData.leaveBalances.sick || 0,
      ...payslipData.leaveBalances
    };
    
    const leaveTypes = Object.entries(leaveBalances)
      .filter(([key]) => key !== '__typename')
      .map(([key, value]) => [
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1') + (key.toLowerCase().includes('leave') ? '' : ' Leave'),
        { content: value, styles: { halign: 'right' } }
      ]);
    
    autoTable(doc, {
      body: [
        [{ content: 'Leave Balances', styles: { fontStyle: 'bold', fontSize: 10, fillColor: [248, 249, 250], colSpan: 2 } }],
        [{ content: 'Leave Type', styles: { fontStyle: 'bold', fillColor: [248, 249, 250] } }, 
         { content: 'Days Remaining', styles: { fontStyle: 'bold', halign: 'right', fillColor: [248, 249, 250] } }],
        ...leaveTypes
      ],
      startY: finalY,
      theme: 'grid',
      tableWidth: pageWidth - margin * 2,
      styles: { fontSize: 9, cellPadding: 6 },
      columnStyles: { 
        0: { cellWidth: 'auto' },
        1: { cellWidth: 100, halign: 'right' } 
      },
      margin: { top: 10 }
    });
    finalY = doc.lastAutoTable.finalY + 20;
  }
  
  if (hasAbsences || hasLeaveBalances) {
    finalY += 5;
  }

  finalY = addSectionTitle(doc, 'PAYMENT SUMMARY', finalY, { pageWidth, margin });
  
  const totalDeductions = totalStatutory + totalOtherDeductions;
  const netPay = totalEarnings - totalDeductions;
  
  const summaryBoxHeight = 120;
  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(233, 236, 239);
  doc.roundedRect(margin, finalY, pageWidth - margin * 2, summaryBoxHeight, 3, 3, 'FD');
  
  const summaryStartX = margin + 20;
  const valueStartX = pageWidth - margin - 150;
  
  finalY += 30;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(33, 37, 41);
  doc.text('Total Gross Pay', summaryStartX, finalY);
  
  doc.setFont(undefined, 'bold');
  doc.text(formatCurrency(totalEarnings), valueStartX, finalY);
  
  finalY += 25;
  doc.setFont(undefined, 'normal');
  doc.text('Less: Total Deductions', summaryStartX, finalY);
  
  doc.setFont(undefined, 'bold');
  doc.setTextColor(220, 53, 69);
  doc.text(`(${formatCurrency(totalDeductions)})`, valueStartX, finalY);
  
  finalY += 15;
  doc.setDrawColor(233, 236, 239);
  doc.setLineWidth(0.5);
  doc.line(valueStartX - 20, finalY, pageWidth - margin - 20, finalY);
  
  finalY += 25;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(25, 135, 84);
  doc.text('NET PAY', summaryStartX, finalY);
  doc.text(formatCurrency(netPay), valueStartX, finalY);
  
  const minFooterSpacing = 40;
  const footerY = Math.max(finalY + minFooterSpacing, doc.internal.pageSize.getHeight() - 70);
  
  doc.setDrawColor(108, 117, 125);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, margin + 200, footerY);
  
  const signatureTextY = footerY + 15;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(108, 117, 125);
  doc.text('Employee Signature', margin, signatureTextY);
  
  doc.setFontSize(8);
  doc.text('This is an official document. Any unauthorized alterations will be considered void.', 
           pageWidth - margin, signatureTextY, { align: 'right' });
           
  const pageNumberY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setTextColor(108, 117, 125);
  doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth / 2, pageNumberY, { align: 'center' });
  
  return doc;
};