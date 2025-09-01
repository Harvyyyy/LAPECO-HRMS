import autoTable from 'jspdf-autotable';

/**
 * Generates the Company Positions Report.
 * @param {jsPDF} doc - The jsPDF instance.
 * @param {object} params - Report parameters (not used in this report, but part of the signature).
 * @param {object} dataSources - Contains all mock data (employees, positions).
 * @param {function} addChartAndTitle - Helper function to add a chart to the PDF.
 * @returns {jsPDF} The modified jsPDF document.
 */
export const generatePositionsReport = async (doc, params, dataSources, addChartAndTitle) => {
  const { employees, positions } = dataSources;
  const { margin } = params;

  if (!positions || positions.length === 0) {
    doc.text("No position data found to generate a report.", margin, params.startY);
    return doc;
  }

  // 1. Calculate employee count for each position
  const employeeCounts = positions.reduce((acc, pos) => {
    acc[pos.title] = employees.filter(emp => emp.positionId === pos.id).length;
    return acc;
  }, {});

  // 2. Configure and add the Employee Count chart
  const countChartConfig = {
    type: 'bar',
    data: {
      labels: Object.keys(employeeCounts),
      datasets: [{
        label: 'Number of Employees',
        data: Object.values(employeeCounts),
        backgroundColor: 'rgba(25, 135, 84, 0.6)'
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      }
    }
  };
  let finalY = await addChartAndTitle("Employee Count by Position", countChartConfig);

  // 3. Configure and add the Salary Comparison chart
  const sortedPositionsBySalary = [...positions].sort((a, b) => a.monthlySalary - b.monthlySalary);
  const salaryChartConfig = {
    type: 'bar',
    data: {
      labels: sortedPositionsBySalary.map(p => p.title),
      datasets: [{
        label: 'Monthly Salary (₱)',
        data: sortedPositionsBySalary.map(p => p.monthlySalary),
        backgroundColor: 'rgba(13, 202, 240, 0.6)'
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: {
            callback: value => `₱${(value / 1000)}k`
          }
        }
      }
    }
  };
  finalY = await addChartAndTitle("Monthly Salary Comparison", salaryChartConfig);

  // 4. Add a new page for the detailed table if needed
  if (finalY > doc.internal.pageSize.getHeight() - 200) { // Check if there's enough space
    doc.addPage();
    finalY = params.startY; // Reset Y position on the new page
  }

  // 5. Prepare data for and add the detailed table
  const tableColumns = ['Position Title', 'Employee Count', 'Monthly Salary (₱)', 'Description'];
  const tableRows = positions.map(pos => [
    pos.title,
    employeeCounts[pos.title] || 0,
    pos.monthlySalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    pos.description
  ]);
  
  autoTable(doc, {
    head: [tableColumns],
    body: tableRows,
    startY: finalY,
    theme: 'grid',
    headStyles: { fillColor: [25, 135, 84] }
  });

  return doc;
};