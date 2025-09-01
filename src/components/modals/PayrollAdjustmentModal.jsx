import React, { useState, useEffect, useMemo } from 'react';
import './PayrollAdjustmentModal.css';
import ReportPreviewModal from './ReportPreviewModal';
import useReportGenerator from '../../hooks/useReportGenerator';

const formatCurrency = (value) => Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const defaultEarnings = [
    { description: 'Regular Hours', hours: 0, amount: 0 },
    { description: 'Overtime Pay', hours: 0, amount: 0 },
    { description: 'Night Differential', hours: 0, amount: 0 },
    { description: 'Special Rate Pay Reg', hours: 0, amount: 0 },
    { description: 'Special Rate Pay OT', hours: 0, amount: 0 },
    { description: 'Holiday Pay Reg', hours: 0, amount: 0 },
    { description: 'Holiday Pay OT', hours: 0, amount: 0 },
    { description: 'Allowance', hours: '', amount: 0 },
    { description: 'Leave Credentials', hours: '', amount: 0 },
    { description: 'Pay Adjustment', hours: '', amount: 0 },
];

const defaultDeductions = [
    { description: 'SSS Loan', amount: 0 },
    { description: 'PAGIBIG Loan', amount: 0 },
];

const InfoField = ({ label, children }) => (
    <div className="form-group">
        <label className="info-label">{label}</label>
        {children}
    </div>
);

const EditableStatutoryField = ({ label, fieldKey, value, originalValue, onChange }) => (
    <div className="form-group">
        <label htmlFor={fieldKey}>{label}</label>
        <div className="input-group">
            <span className="input-group-text">₱</span>
            <input 
                type="number" 
                id={fieldKey} 
                name={fieldKey}
                className="form-control text-end" 
                value={value} 
                onChange={onChange}
            />
        </div>
        <small className="form-text text-muted">System Calculated: ₱{formatCurrency(originalValue)}</small>
    </div>
);


const PayrollAdjustmentModal = ({ show, onClose, onSave, onSaveEmployeeInfo, payrollData, employeeDetails, positions }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [status, setStatus] = useState('');
  const [earnings, setEarnings] = useState([]);
  const [otherDeductions, setOtherDeductions] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [editableEmployeeData, setEditableEmployeeData] = useState(null);
  const [statutoryDeductions, setStatutoryDeductions] = useState({});
  
  const [showPayslipPreview, setShowPayslipPreview] = useState(false);
  const { generateReport, pdfDataUri, isLoading, setPdfDataUri } = useReportGenerator();

  useEffect(() => {
    if (payrollData && show) {
      setStatus(payrollData.status || 'Pending');
      setActiveTab('summary');
      setEditableEmployeeData({ ...employeeDetails });
      setAbsences(payrollData.absences || []);
      setStatutoryDeductions(payrollData.deductions || {});
      
      const processedEarnings = defaultEarnings.map(item => ({...item}));
      if (payrollData.earnings && payrollData.earnings.length > 0) {
        payrollData.earnings.forEach(calculatedEarning => {
            let descriptionMatch = '';
            if (calculatedEarning.description.toLowerCase().includes('regular')) {
                descriptionMatch = 'Regular Hours';
            } else if (calculatedEarning.description.toLowerCase().includes('holiday')) {
                descriptionMatch = 'Holiday Pay Reg';
            }
            const defaultIndex = processedEarnings.findIndex(e => e.description === descriptionMatch);
            if (defaultIndex > -1) {
                processedEarnings[defaultIndex] = { ...processedEarnings[defaultIndex], ...calculatedEarning, description: descriptionMatch };
            } else {
                const existingItemIndex = processedEarnings.findIndex(e => e.description === calculatedEarning.description);
                if (existingItemIndex === -1) {
                  processedEarnings.push(calculatedEarning);
                }
            }
        });
      }
      setEarnings(processedEarnings);
      
      const initialDeductions = payrollData.otherDeductions && payrollData.otherDeductions.length > 0 
        ? payrollData.otherDeductions
        : defaultDeductions.map(item => ({...item}));
      setOtherDeductions(initialDeductions);
    }
  }, [payrollData, employeeDetails, show]);

  const totals = useMemo(() => {
    const totalGrossPay = earnings.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const statutoryDeductionsTotal = Object.values(statutoryDeductions).reduce((sum, val) => sum + Number(val), 0);
    const otherDeductionsTotal = otherDeductions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalDeductions = statutoryDeductionsTotal + otherDeductionsTotal;
    const netPay = totalGrossPay - totalDeductions;
    return { totalGrossPay, totalDeductions, netPay };
  }, [earnings, otherDeductions, statutoryDeductions]);
  
  const positionTitle = useMemo(() => {
      if (!editableEmployeeData || !positions) return 'N/A';
      return positions.find(p => p.id === editableEmployeeData.positionId)?.title || 'Unassigned';
  }, [editableEmployeeData, positions]);

  const handleItemChange = (index, field, value, type) => {
    let list;
    let setter;
    switch(type) {
        case 'earnings': list = [...earnings]; setter = setEarnings; break;
        case 'otherDeductions': list = [...otherDeductions]; setter = setOtherDeductions; break;
        case 'absences': list = [...absences]; setter = setAbsences; break;
        default: return;
    }
    list[index][field] = value;
    setter(list);
  };

  const addItem = (type) => {
    const setter = type === 'otherDeductions' ? setOtherDeductions : setEarnings;
    const newItem = type === 'otherDeductions' 
        ? { description: '', amount: 0 } 
        : { description: '', hours: '', amount: 0 };
    setter(prev => [...prev, newItem]);
  };
  
  const removeItem = (index, type) => {
    const setter = type === 'otherDeductions' ? setOtherDeductions : setEarnings;
    setter(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleEmployeeInfoChange = (e) => {
    const { name, value } = e.target;
    setEditableEmployeeData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStatutoryChange = (e) => {
      const { name, value } = e.target;
      setStatutoryDeductions(prev => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const handleSaveClick = () => {
    if (activeTab === 'info') {
      onSaveEmployeeInfo(editableEmployeeData.id, editableEmployeeData);
    } else {
      const finalEarnings = earnings.filter(e => e.description.trim() !== '' || Number(e.amount) !== 0);
      const finalDeductions = otherDeductions.filter(d => d.description.trim() !== '' || Number(d.amount) !== 0);
      
      onSave(payrollData.payrollId, { 
          status, 
          earnings: finalEarnings, 
          otherDeductions: finalDeductions, 
          absences: absences, 
          deductions: statutoryDeductions,
          netPay: totals.netPay 
      });
    }
    onClose();
  };
  
  const handleGeneratePayslip = async () => {
    const currentPayslipData = { ...payrollData, earnings, otherDeductions, absences, deductions: statutoryDeductions };
    await generateReport('payslip', {}, { payslipData: currentPayslipData, employeeDetails });
    setShowPayslipPreview(true);
  };

  const handleClosePreview = () => {
    setShowPayslipPreview(false);
    if (pdfDataUri) URL.revokeObjectURL(pdfDataUri);
    setPdfDataUri('');
  };

  if (!show || !editableEmployeeData) return null;

  return (
    <>
      <div className={`modal fade show d-block ${showPayslipPreview ? 'modal-behind' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <div className="modal-dialog modal-dialog-centered modal-xl payroll-adjustment-modal-dialog">
          <div className="modal-content payroll-adjustment-modal-content">
            <div className="modal-header">
              <h5 className="modal-title"><span className="employee-name">{payrollData.employeeName}</span><span className="period-text">({payrollData.cutOff})</span></h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <ul className="nav nav-tabs">
                <li className="nav-item"><button className={`nav-link ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>Summary</button></li>
                <li className="nav-item"><button className={`nav-link ${activeTab === 'earnings' ? 'active' : ''}`} onClick={() => setActiveTab('earnings')}>Earnings</button></li>
                <li className="nav-item"><button className={`nav-link ${activeTab === 'deductions' ? 'active' : ''}`} onClick={() => setActiveTab('deductions')}>Deductions</button></li>
                <li className="nav-item"><button className={`nav-link ${activeTab === 'absences' ? 'active' : ''}`} onClick={() => setActiveTab('absences')}>Absences</button></li>
                <li className="nav-item"><button className={`nav-link ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Employee Info</button></li>
              </ul>
              <div className="tab-content">
                {activeTab === 'summary' && <div className="summary-section">
                  <div className="summary-row"><span className="label">Total Gross Earnings</span><span className="value value-positive">₱{formatCurrency(totals.totalGrossPay)}</span></div>
                  <div className="summary-row"><span className="label">Total Deductions</span><span className="value value-negative">- ₱{formatCurrency(totals.totalDeductions)}</span></div>
                  <div className="summary-row net-pay"><span className="label">Net Pay</span><span className="value">₱{formatCurrency(totals.netPay)}</span></div>
                </div>}

                {activeTab === 'earnings' && <div>
                    <table className="table table-sm breakdown-table">
                        <thead><tr><th>Description</th><th>Hours</th><th>Amount (₱)</th><th></th></tr></thead>
                        <tbody>
                        {earnings.map((item, index) => (
                            <tr key={index}>
                                <td><input type="text" className="form-control form-control-inline" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value, 'earnings')} /></td>
                                <td><input type="number" className="form-control form-control-inline" value={item.hours} onChange={(e) => handleItemChange(index, 'hours', e.target.value, 'earnings')} placeholder="--" /></td>
                                <td><input type="number" className="form-control form-control-inline text-end" value={item.amount} onChange={(e) => handleItemChange(index, 'amount', e.target.value, 'earnings')} /></td>
                                <td><button className="btn btn-sm btn-remove-row" onClick={() => removeItem(index, 'earnings')} title="Remove Earning"><i className="bi bi-x"></i></button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button className="btn btn-sm btn-outline-secondary mt-2" onClick={() => addItem('earnings')}><i className="bi bi-plus-lg me-1"></i> Add Earning</button>
                </div>}

                {activeTab === 'deductions' && (
                  <div className="deductions-tab-grid">
                    <div className="deductions-column">
                      <h6 className="form-grid-title"><i className="bi bi-shield-check me-2"></i>Statutory Deductions</h6>
                      <p className="text-muted small">Override the system-calculated values if necessary. The original calculation is shown for reference.</p>
                      <div className="form-grid">
                        <EditableStatutoryField label="Withholding Tax" fieldKey="tax" value={statutoryDeductions.tax} originalValue={payrollData.deductions.tax} onChange={handleStatutoryChange} />
                        <EditableStatutoryField label="SSS Contribution" fieldKey="sss" value={statutoryDeductions.sss} originalValue={payrollData.deductions.sss} onChange={handleStatutoryChange} />
                        <EditableStatutoryField label="PhilHealth Contribution" fieldKey="philhealth" value={statutoryDeductions.philhealth} originalValue={payrollData.deductions.philhealth} onChange={handleStatutoryChange} />
                        <EditableStatutoryField label="Pag-IBIG Contribution" fieldKey="hdmf" value={statutoryDeductions.hdmf} originalValue={payrollData.deductions.hdmf} onChange={handleStatutoryChange} />
                      </div>
                    </div>
                    <div className="deductions-column">
                       <h6 className="form-grid-title"><i className="bi bi-wallet2 me-2"></i>Other Deductions / Repayments</h6>
                       <div className="deduction-list">
                         {otherDeductions.map((item, index) => (
                            <div key={index} className="deduction-item-row">
                                <input type="text" className="form-control form-control-sm" placeholder="Deduction Name" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value, 'otherDeductions')} />
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text">₱</span>
                                    <input type="number" className="form-control text-end" placeholder="0.00" value={item.amount} onChange={(e) => handleItemChange(index, 'amount', e.target.value, 'otherDeductions')} />
                                </div>
                                <button className="btn btn-sm btn-remove-row" onClick={() => removeItem(index, 'otherDeductions')} title="Remove Deduction"><i className="bi bi-x"></i></button>
                            </div>
                         ))}
                       </div>
                       <button className="btn btn-sm btn-outline-secondary mt-2" onClick={() => addItem('otherDeductions')}><i className="bi bi-plus-lg me-1"></i> Add Deduction</button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'absences' && (
                  <div className="p-2">
                    <p className="text-muted small">The following absences were automatically detected. You may change the description if an absence was excused (e.g., due to an approved leave).</p>
                    {absences.length > 0 ? (
                        <table className="table table-sm table-striped mt-3">
                            <thead><tr><th>Description</th><th>Date</th></tr></thead>
                            <tbody>
                                {absences.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                      <select className="form-select form-select-sm" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value, 'absences')}>
                                        <option value="Unexcused">Unexcused</option><option value="Excused">Excused</option>
                                      </select>
                                    </td>
                                    <td>{new Date(item.startDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="table-light"><th className="text-end fw-bold">Total Absences:</th><th className="fw-bold">{absences.reduce((acc, curr) => acc + (curr.totalDays || 0), 0)} Day(s)</th></tr>
                            </tfoot>
                        </table>
                    ) : (
                        <div className="text-center p-5 bg-light rounded mt-3">
                            <i className="bi bi-check-circle-fill fs-1 text-success mb-3 d-block"></i>
                            <h5 className="text-muted">No Absences Recorded</h5>
                            <p className="text-muted">The employee had perfect attendance for all scheduled workdays in this period.</p>
                        </div>
                    )}
                  </div>
                )}

                {activeTab === 'info' && (
                  <div className="p-3">
                    <p className="text-muted small mb-3">Changes made here will update the employee's master record permanently upon saving.</p>
                    <div className="form-grid">
                        <InfoField label="Employee Full Name"><input type="text" name="name" className="form-control" value={editableEmployeeData.name} onChange={handleEmployeeInfoChange} /></InfoField>
                        <InfoField label="Employee Number"><input type="text" className="form-control" value={editableEmployeeData.id} readOnly disabled /></InfoField>
                        <InfoField label="Tax Identification Number"><input type="text" name="tinNo" className="form-control" value={editableEmployeeData.tinNo} onChange={handleEmployeeInfoChange} /></InfoField>
                        <InfoField label="SSS Number"><input type="text" name="sssNo" className="form-control" value={editableEmployeeData.sssNo} onChange={handleEmployeeInfoChange} /></InfoField>
                        <InfoField label="PhilHealth Number"><input type="text" name="philhealthNo" className="form-control" value={editableEmployeeData.philhealthNo} onChange={handleEmployeeInfoChange} /></InfoField>
                        <InfoField label="HDMF (Pag-IBIG) Number"><input type="text" name="pagIbigNo" className="form-control" value={editableEmployeeData.pagIbigNo} onChange={handleEmployeeInfoChange} /></InfoField>
                        <InfoField label="Position"><select name="positionId" className="form-select" value={editableEmployeeData.positionId} onChange={handleEmployeeInfoChange}>{positions.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select></InfoField>
                        <InfoField label="Status"><select name="status" className="form-select" value={editableEmployeeData.status} onChange={handleEmployeeInfoChange}><option value="Active">Active</option><option value="Inactive">Inactive</option></select></InfoField>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <div className="footer-actions-left">
                <button type="button" className="btn btn-outline-primary" onClick={handleGeneratePayslip} disabled={isLoading}>
                  {isLoading ? 'Generating...' : <><i className="bi bi-file-earmark-text-fill me-2"></i>Preview Payslip</>}
                </button>
              </div>
              <div className="footer-actions-right">
                {activeTab !== 'info' && <div className="status-selector"><label htmlFor="payrollStatus" className="form-label mb-0">Status:</label><select id="payrollStatus" className="form-select form-select-sm" value={status} onChange={(e) => setStatus(e.target.value)}><option value="Pending">Pending</option><option value="Paid">Paid</option></select></div>}
                <button type="button" className="btn btn-success" onClick={handleSaveClick}><i className="bi bi-save-fill me-2"></i>{activeTab === 'info' ? 'Save Employee Info' : 'Save Payroll Changes'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {(isLoading || pdfDataUri) && (
        <ReportPreviewModal 
          show={showPayslipPreview} 
          onClose={handleClosePreview} 
          pdfDataUri={pdfDataUri} 
          reportTitle={`Payslip Preview - ${payrollData.employeeName}`} 
        />
      )}
    </>
  );
};

export default PayrollAdjustmentModal;