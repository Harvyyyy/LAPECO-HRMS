import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';

const ReportConfigurationModal = ({ show, onClose, onRunReport, reportConfig, trainingPrograms, payrolls }) => {
  const [params, setParams] = useState({});

  // (FIX) Moved useMemo to the top level before the early return.
  // This ensures it is called on every render, satisfying the Rules of Hooks.
  const payrollRunOptions = useMemo(() => 
    (payrolls || []).map(run => ({
      value: run.runId,
      label: `Pay Period: ${run.cutOff} (${run.records.length} employees)`
    })).sort((a,b) => {
      // Robust sorting for dates in "YYYY-MM-DD to YYYY-MM-DD" format
      const dateA = new Date(a.label.split(' to ')[1].split(' (')[0]);
      const dateB = new Date(b.label.split(' to ')[1].split(' (')[0]);
      return dateB - dateA;
    }),
  [payrolls]);

  useEffect(() => {
    if (show && reportConfig?.parameters) {
      const initialParams = reportConfig.parameters.reduce((acc, param) => {
        if (param.type === 'date-range') {
          acc.startDate = new Date().toISOString().split('T')[0];
          if (param.labels.end) {
            acc.endDate = new Date().toISOString().split('T')[0];
          }
        }
        if (param.type === 'program-selector') {
          acc.programId = null;
        }
        if (param.type === 'payroll-run-selector') {
          acc.runId = null;
        }
        return acc;
      }, {});
      setParams(initialParams);
    }
  }, [show, reportConfig]);

  // Early return is now safe because all hooks are declared above it.
  if (!show || !reportConfig) {
    return null;
  }

  const handleParamChange = (name, value) => {
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRunReport(reportConfig.id, params);
  };
  
  const programOptions = trainingPrograms?.map(p => ({ value: p.id, label: p.title })) || [];

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-header">
              <h5 className="modal-title">Configure Report: {reportConfig.title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <p className="text-muted">{reportConfig.description}</p>
              <hr />
              {reportConfig.parameters?.map(param => {
                switch (param.type) {
                  case 'date-range':
                    return (
                      <div key={param.id} className="row g-3">
                        <div className={param.labels.end ? "col-md-6" : "col-12"}>
                          <label htmlFor="startDate" className="form-label">{param.labels.start}</label>
                          <input
                            type="date"
                            id="startDate"
                            className="form-control"
                            value={params.startDate || ''}
                            onChange={(e) => handleParamChange('startDate', e.target.value)}
                            required
                          />
                        </div>
                        {param.labels.end && (
                            <div className="col-md-6">
                            <label htmlFor="endDate" className="form-label">{param.labels.end}</label>
                            <input
                                type="date"
                                id="endDate"
                                className="form-control"
                                value={params.endDate || ''}
                                onChange={(e) => handleParamChange('endDate', e.target.value)}
                                required
                            />
                            </div>
                        )}
                      </div>
                    );
                  case 'program-selector':
                    return (
                        <div key={param.id}>
                            <label htmlFor="programId" className="form-label">{param.label}</label>
                            <Select 
                                id="programId"
                                options={programOptions}
                                onChange={(option) => handleParamChange('programId', option ? option.value : null)}
                                isClearable
                                className="react-select-container"
                                classNamePrefix="react-select"
                                required
                            />
                        </div>
                    );
                  
                  case 'payroll-run-selector':
                    return (
                      <div key={param.id}>
                        <label htmlFor="runId" className="form-label">{param.label}</label>
                        <Select 
                          id="runId"
                          options={payrollRunOptions}
                          onChange={(option) => handleParamChange('runId', option ? option.value : null)}
                          isClearable
                          placeholder="Select a generated payroll run..."
                          className="react-select-container"
                          classNamePrefix="react-select"
                          required
                        />
                      </div>
                    );

                  default:
                    return null;
                }
              })}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-success">Run Report</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportConfigurationModal;