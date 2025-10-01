import React, { useState, useMemo } from 'react';
import { startOfDay, endOfDay, subDays } from 'date-fns';
import ReportCard from './ReportCard';
import ReportConfigurationModal from '../../modals/ReportConfigurationModal';
import ReportPreviewModal from '../../modals/ReportPreviewModal';
import useReportGenerator from '../../../hooks/useReportGenerator';
import { reportsConfig, reportCategories } from '../../../config/reports.config';
import './ReportsPage.css';

const ReportsPage = (props) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [configModalState, setConfigModalState] = useState({ show: false, config: null });
  const [showPreview, setShowPreview] = useState(false);
  
  const { generateReport, pdfDataUri, isLoading, setPdfDataUri } = useReportGenerator();

  const reportCounts = useMemo(() => {
    const counts = reportsConfig.reduce((acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1;
      return acc;
    }, {});
    counts.All = reportsConfig.length;
    return counts;
  }, []);

  const filteredReports = useMemo(() => {
    let reports = [...reportsConfig];
    if (activeCategory !== 'All') {
      reports = reports.filter(r => r.category === activeCategory);
    }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      reports = reports.filter(
        r => r.title.toLowerCase().includes(lowerSearch) || r.description.toLowerCase().includes(lowerSearch)
      );
    }
    return reports;
  }, [activeCategory, searchTerm]);

  const handleOpenConfig = (reportConfig) => {
    if (reportConfig.parameters) {
      setConfigModalState({ show: true, config: reportConfig });
    } else {
      handleRunReport(reportConfig.id, {});
    }
  };

  const handleRunReport = (reportId, params) => {
    let dataSources = { ...props };
    let finalParams = { ...params };

    if (reportId === 'predictive_analytics_summary') {
        const { evaluations = [], employees = [], positions = [], schedules = [], attendanceLogs = [] } = props;
        const asOf = params.asOfDate ? endOfDay(new Date(params.asOfDate)) : endOfDay(new Date());
        
        // Data Processing Logic for Predictive Analytics
        const RISK_WEIGHTS = { performance: 0.7, attendance: 0.3 };
        const HIGH_PERFORMANCE_THRESHOLD = 90;
        const LOW_PERFORMANCE_THRESHOLD = 50;
        const GOOD_ATTENDANCE_MONTHLY_AVG = 1;
        const BAD_ATTENDANCE_MONTHLY_AVG = 5;
        const calculatePerformanceRisk = (latestScore) => Math.max(0, 100 - latestScore);
        const calculateAttendanceRisk = (lates, absences) => Math.min((absences * 5) + (lates * 2), 100);
        
        const ninetyDaysBeforeAsOf = subDays(asOf, 90);
        const relevantEvaluations = evaluations.filter(ev => new Date(ev.periodEnd) <= asOf);
        const relevantAttendanceLogs = attendanceLogs.filter(log => {
            const logDate = new Date(log.date);
            return logDate >= ninetyDaysBeforeAsOf && logDate <= asOf;
        });
        const relevantSchedules = schedules.filter(sch => {
            const schDate = new Date(sch.date);
            return schDate >= ninetyDaysBeforeAsOf && schDate <= asOf;
        });
        const evaluationsByEmployee = relevantEvaluations.reduce((acc, ev) => {
            (acc[ev.employeeId] = acc[ev.employeeId] || []).push(ev);
            return acc;
        }, {});
        const attendanceByEmployee = employees.reduce((acc, emp) => {
            const mySchedules = relevantSchedules.filter(s => s.empId === emp.id);
            const myLogs = new Map(relevantAttendanceLogs.filter(l => l.empId === emp.id).map(l => [l.date, l]));
            let lates = 0, absences = 0;
            mySchedules.forEach(sch => {
                const log = myLogs.get(sch.date);
                if (log && log.signIn) { if (log.signIn > (sch.shift?.split(' - ')[0] || '00:00')) lates++; } else { absences++; }
            });
            acc[emp.id] = { lates, absences, monthlyAbsenceAvg: absences / 3 };
            return acc;
        }, {});
    
        const employeeData = employees.map(employee => {
          const position = positions.find(p => p.id === employee.positionId);
          if (!position) return null;
          const empEvals = evaluationsByEmployee[employee.id];
          const attendance = attendanceByEmployee[employee.id] || { lates: 0, absences: 0, monthlyAbsenceAvg: 0 };
          let latestScore = null, trend = 'N/A', isHighPotential = false, isTurnoverRisk = false;
          let riskScore;
          if (empEvals && empEvals.length > 0) {
            const sortedEvals = [...empEvals].sort((a, b) => new Date(a.periodEnd) - new Date(b.periodEnd));
            const latestEval = sortedEvals[sortedEvals.length - 1];
            const previousEval = sortedEvals[sortedEvals.length - 2];
            latestScore = latestEval.overallScore;
            trend = 'Stable';
            if (previousEval) {
              if (latestEval.overallScore > previousEval.overallScore + 2) trend = 'Improving';
              if (latestEval.overallScore < previousEval.overallScore - 2) trend = 'Declining';
            }
            const performanceRisk = calculatePerformanceRisk(latestScore);
            const attendanceRisk = calculateAttendanceRisk(attendance.lates, attendance.absences);
            riskScore = performanceRisk * RISK_WEIGHTS.performance + attendanceRisk * RISK_WEIGHTS.attendance;
            isHighPotential = latestScore >= HIGH_PERFORMANCE_THRESHOLD && attendance.monthlyAbsenceAvg <= GOOD_ATTENDANCE_MONTHLY_AVG;
            isTurnoverRisk = latestScore < LOW_PERFORMANCE_THRESHOLD || attendance.monthlyAbsenceAvg > BAD_ATTENDANCE_MONTHLY_AVG || riskScore >= 60;
          } else {
            return null;
          }
          return { ...employee, positionTitle: position.title, latestScore, trend, riskScore, isHighPotential, isTurnoverRisk };
        }).filter(Boolean);
        
        dataSources.employeeData = employeeData;
    }

    generateReport(reportId, finalParams, dataSources);
    setConfigModalState({ show: false, config: null });
    setShowPreview(true);
  };
  
  const handleClosePreview = () => {
    setShowPreview(false);
    if (pdfDataUri) {
        URL.revokeObjectURL(pdfDataUri);
    }
    setPdfDataUri('');
  };

  const categories = ['All', ...Object.values(reportCategories)];

  return (
    <div className="container-fluid p-0 page-module-container">
      <header className="page-header mb-4">
        <h1 className="page-main-title">Reports Center</h1>
        <p className="text-muted">Select a category and generate a report.</p>
      </header>
      
      <div className="reports-category-filter">
        {categories.map(category => (
          (reportCounts[category] > 0 || category === 'All') && (
            <button
              key={category}
              className={`category-filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              <span>{category}</span>
              <span className="badge rounded-pill">{reportCounts[category]}</span>
            </button>
          )
        ))}
      </div>

      <div className="reports-content-area">
        <div className="input-group search-bar">
          <span className="input-group-text"><i className="bi bi-search"></i></span>
          <input
            type="text"
            className="form-control"
            placeholder={`Search all reports...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="reports-grid-v2">
          {filteredReports.map(config => (
            <ReportCard
              key={config.id}
              title={config.title}
              description={config.description}
              icon={config.icon}
              onGenerate={() => handleOpenConfig(config)}
            />
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center p-5 bg-light rounded">
              <h5>No Reports Found</h5>
              <p className="text-muted">Try adjusting your category selection or search term.</p>
          </div>
        )}
      </div>

      <ReportConfigurationModal
        show={configModalState.show}
        onClose={() => setConfigModalState({ show: false, config: null })}
        reportConfig={configModalState.config}
        onRunReport={handleRunReport}
        trainingPrograms={props.trainingPrograms}
        payrolls={props.payrolls} 
      />

      {isLoading && (
         <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content"><div className="modal-body text-center p-4">
                    <div className="spinner-border text-success mb-3" role="status"><span className="visually-hidden">Loading...</span></div>
                    <h4>Generating Report...</h4>
                </div></div>
            </div>
        </div>
      )}

      {pdfDataUri && (
         <ReportPreviewModal
            show={showPreview}
            onClose={handleClosePreview}
            pdfDataUri={pdfDataUri}
            reportTitle={configModalState.config?.title || 'Report Preview'}
        />
      )}
    </div>
  );
};

export default ReportsPage;