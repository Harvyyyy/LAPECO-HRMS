import React, { useState, useMemo } from 'react';
import { saveAs } from 'file-saver';
import PayrollAdjustmentModal from '../../modals/PayrollAdjustmentModal';

const formatCurrency = (value) => Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PayrollHistoryPage = ({ payrolls, onUpdateRecord }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const processedPayrolls = useMemo(() => {
    return payrolls.map(run => {
      const { totalGross, totalDeductions, totalNet } = run.records.reduce((acc, rec) => {
          const gross = rec.earnings.basePay + rec.earnings.overtimePay + rec.earnings.holidayPay + (rec.adjustments?.allowances || 0) + (rec.adjustments?.bonuses || 0) + (rec.adjustments?.otherEarnings || 0);
          const deductions = Object.values(rec.deductions).reduce((s, v) => s + v, 0) + (rec.adjustments?.loanRepayments || 0) + (rec.adjustments?.cashAdvances || 0);
          acc.totalGross += gross;
          acc.totalDeductions += deductions;
          acc.totalNet += gross - deductions;
          return acc;
      }, { totalGross: 0, totalDeductions: 0, totalNet: 0 });

      const isPaid = run.records.every(r => r.status === 'Paid');
      return { ...run, totalGross, totalDeductions, totalNet, isPaid };
    }).sort((a,b) => new Date(b.cutOff.split(' to ')[0]) - new Date(a.cutOff.split(' to ')[0]));
  }, [payrolls]);

  const filteredPayrolls = useMemo(() => {
    let results = [...processedPayrolls];
    if (statusFilter !== 'All') {
        results = results.filter(p => statusFilter === 'Paid' ? p.isPaid : !p.isPaid);
    }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      results = results.filter(p => 
        p.cutOff.toLowerCase().includes(lowerSearch) ||
        p.records.some(r => r.employeeName.toLowerCase().includes(lowerSearch) || r.empId.toLowerCase().includes(lowerSearch))
      );
    }
    return results;
  }, [processedPayrolls, searchTerm, statusFilter]);

  const handleOpenAdjustmentModal = (record, run) => {
    const fullRecord = run.records.find(r => r.payrollId === record.payrollId);
    setSelectedRecord({ ...fullRecord, cutOff: run.cutOff });
    setShowAdjustmentModal(true);
  };
  
  const handleSaveAdjustments = (payrollId, updatedData) => {
    onUpdateRecord(payrollId, updatedData);
    setShowAdjustmentModal(false);
  };
  
  const handleMarkRunAsPaid = (run) => {
    if(window.confirm(`Mark all ${run.records.length} pending records in this run as 'Paid'?`)) {
        run.records.forEach(rec => {
            if(rec.status !== 'Paid') {
                onUpdateRecord(rec.payrollId, { ...rec, status: 'Paid' });
            }
        });
    }
  };

  const handleExportRun = (run) => {
    const headers = ["Employee ID", "Employee Name", "Base Pay", "Overtime Pay", "Holiday Pay", "Allowances", "Bonuses", "Gross Pay", "Tax", "SSS", "PhilHealth", "PagIBIG", "Loans", "Cash Advances", "Total Deductions", "Net Pay", "Status"];
    
    const csvData = run.records.map(rec => {
        const gross = rec.earnings.basePay + rec.earnings.overtimePay + rec.earnings.holidayPay + (rec.adjustments?.allowances || 0) + (rec.adjustments?.bonuses || 0);
        const deductions = Object.values(rec.deductions).reduce((s, v) => s + v, 0) + (rec.adjustments?.loanRepayments || 0) + (rec.adjustments?.cashAdvances || 0);
        return [
            rec.empId, rec.employeeName, rec.earnings.basePay, rec.earnings.overtimePay, rec.earnings.holidayPay,
            rec.adjustments?.allowances || 0, rec.adjustments?.bonuses || 0, gross,
            rec.deductions.tax, rec.deductions.sss, rec.deductions.philhealth, rec.deductions.hdmf,
            rec.adjustments?.loanRepayments || 0, rec.adjustments?.cashAdvances || 0, deductions,
            gross - deductions, rec.status
        ].join(',');
    });

    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `Payroll_${run.cutOff}.csv`);
  };

  return (
    <div className="payroll-history-container">
      <div className="payroll-history-controls mb-4">
        <div className="input-group"><span className="input-group-text"><i className="bi bi-search"></i></span><input type="text" className="form-control" placeholder="Search by pay period or name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
        <div className="btn-group" role="group"><button type="button" className={`btn ${statusFilter === 'All' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setStatusFilter('All')}>All</button><button type="button" className={`btn ${statusFilter === 'Pending' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setStatusFilter('Pending')}>Pending</button><button type="button" className={`btn ${statusFilter === 'Paid' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setStatusFilter('Paid')}>Paid</button></div>
      </div>
      
      <div className="accordion payroll-history-accordion" id="payrollHistoryAccordion">
        {filteredPayrolls.map((run) => (
          <div className="accordion-item mb-3" key={run.runId}>
            <h2 className="accordion-header">
                <div className="accordion-header-grid" data-bs-toggle="collapse" data-bs-target={`#collapse-${run.runId}`}>
                    <div className="header-main-info">
                        <div className="period-title">{run.cutOff}</div>
                        <div className="period-meta">{run.records.length} Employees • Total Budget: ₱{formatCurrency(run.totalNet)}</div>
                    </div>
                    <div className="header-stats">
                        <div className="accordion-stat"><span className="stat-label">Status</span><span className={`stat-value ${run.isPaid ? 'text-success' : 'text-warning'}`}>{run.isPaid ? 'Paid' : 'Pending'}</span></div>
                        <div className="accordion-stat"><span className="stat-label">Total Gross</span><span className="stat-value">₱{formatCurrency(run.totalGross)}</span></div>
                    </div>
                </div>
            </h2>
            <div id={`collapse-${run.runId}`} className="accordion-collapse collapse" data-bs-parent="#payrollHistoryAccordion">
              <div className="accordion-body">
                <table className="table data-table table-hover mb-0">
                  <thead><tr><th className="col-id">Emp ID</th><th className="col-name">Employee</th><th className="col-amount">Net Pay</th><th className="col-status">Status</th><th className="col-action">Action</th></tr></thead>
                  <tbody>
                    {run.records.map(record => (
                      <tr key={record.payrollId}>
                        <td className="col-id">{record.empId}</td>
                        <td className="col-name">{record.employeeName}</td>
                        <td className="col-amount fw-bold">₱{formatCurrency(record.netPay)}</td>
                        <td className="col-status"><span className={`status-badge status-${record.status.toLowerCase()}`}>{record.status}</span></td>
                        <td className="col-action"><button className="btn btn-sm btn-outline-primary" onClick={() => handleOpenAdjustmentModal(record, run)}>View & Adjust</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="accordion-body-footer d-flex justify-content-end gap-2">
                {!run.isPaid && <button className="btn btn-sm btn-success" onClick={() => handleMarkRunAsPaid(run)}><i className="bi bi-check-all me-1"></i>Mark All as Paid</button>}
                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleExportRun(run)}><i className="bi bi-download me-1"></i>Export CSV</button>
              </div>
            </div>
          </div>
        ))}
        {filteredPayrolls.length === 0 && <p className="text-center text-muted mt-4">No payroll history matches your criteria.</p>}
      </div>

      {selectedRecord && <PayrollAdjustmentModal show={showAdjustmentModal} onClose={() => setShowAdjustmentModal(false)} onSave={handleSaveAdjustments} payrollData={selectedRecord} />}
    </div>
  );
};

export default PayrollHistoryPage;