import React, { useState } from 'react';
import ReportCard from './ReportCard';
import ReportConfigurationModal from '../../modals/ReportConfigurationModal';
import ReportPreviewModal from '../../modals/ReportPreviewModal';
import useReportGenerator from '../../../hooks/useReportGenerator';
import { reportsConfig, reportCategories } from '../../../config/reports.config';
import './ReportsPage.css';

const ReportsPage = (props) => {
  const [configModalState, setConfigModalState] = useState({ show: false, config: null });
  const [showPreview, setShowPreview] = useState(false);
  
  const { generateReport, pdfDataUri, isLoading, setPdfDataUri } = useReportGenerator();

  const handleOpenConfig = (reportConfig) => {
    if (reportConfig.parameters) {
      setConfigModalState({ show: true, config: reportConfig });
    } else {
      handleRunReport(reportConfig.id, {});
    }
  };

  const handleRunReport = (reportId, params) => {
    generateReport(reportId, params, props);
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

  const groupedReports = Object.values(reportCategories).map(category => ({
    category,
    reports: reportsConfig.filter(r => r.category === category)
  })).filter(group => group.reports.length > 0);

  return (
    <div className="container-fluid p-0 page-module-container">
      <header className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-main-title">Reports Center</h1>
      </header>
      
      {groupedReports.map(group => (
        <div key={group.category} className="mb-5">
            <h4 className="report-category-title">{group.category}</h4>
            <div className="reports-grid">
                {group.reports.map(config => (
                <ReportCard
                    key={config.id}
                    title={config.title}
                    description={config.description}
                    icon={config.icon}
                    onGenerate={() => handleOpenConfig(config)}
                />
                ))}
            </div>
        </div>
      ))}

      <ReportConfigurationModal
        show={configModalState.show}
        onClose={() => setConfigModalState({ show: false, config: null })}
        reportConfig={configModalState.config}
        onRunReport={handleRunReport}
        trainingPrograms={props.trainingPrograms}
      />

      {isLoading && (
         <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body text-center p-4">
                        <div className="spinner-border text-success mb-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h4>Generating Report...</h4>
                    </div>
                </div>
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