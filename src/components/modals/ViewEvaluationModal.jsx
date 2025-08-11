import React, { useMemo } from 'react';
import ScoreDonutChart from '../pages/Performance-Management/ScoreDonutChart';
import StarRating from '../pages/Performance-Management/StarRating';
import './ViewEvaluationModal.css';

const EvaluationItem = ({ name, comment, score }) => (
  <div className="evaluation-item">
    <div className="evaluation-item-info">
      <p className="name mb-0">{name}</p>
      {comment && <p className="comment mb-0">"{comment}"</p>}
    </div>
    <div className="evaluation-item-score">
      <StarRating score={score || 0} onRate={() => {}} />
    </div>
  </div>
);

const getIconForFactorType = (factorType) => {
  switch (factorType) {
    case 'kpi_section':
      return 'bi bi-bullseye';
    case 'rating_scale':
      return 'bi bi-check2-circle';
    case 'textarea':
      return 'bi bi-chat-left-text-fill';
    default:
      return 'bi bi-file-earmark-text';
  }
};

const ViewEvaluationModal = ({ show, onClose, evaluation, employee, position, kpis, evaluationFactors }) => {
  if (!show || !evaluation || !evaluationFactors) return null;

  const getFactorData = (factorId) => evaluation.factorScores[factorId] || {};

  const managerSummaryFactor = evaluationFactors.find(f => f.id === 'factor_manager_summary');
  const otherTextareaFactors = evaluationFactors.filter(f => f.type === 'textarea' && f.id !== 'factor_manager_summary');

  const sectionAverages = useMemo(() => {
    const averages = {};
    evaluationFactors.forEach(factor => {
      if (factor.type === 'rating_scale') {
        let totalScore = 0;
        let count = 0;
        factor.items.forEach(item => {
          totalScore += getFactorData(item.id).score || 0;
          count++;
        });
        averages[factor.id] = count > 0 ? (totalScore / count).toFixed(1) : 'N/A';
      }
    });
    
    const relevantKpis = kpis.filter(kpi => kpi.appliesToPositionIds?.includes(position?.id));
    if(relevantKpis.length > 0) {
        let totalKpiScore = 0;
        relevantKpis.forEach(kpi => {
            totalKpiScore += getFactorData(kpi.id).score || 0;
        });
        averages['factor_kpis'] = (totalKpiScore / relevantKpis.length).toFixed(1);
    }
    
    return averages;
  }, [evaluation, evaluationFactors, kpis, position]);

  return (
    <div className="modal fade show d-block view-evaluation-modal" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <ScoreDonutChart score={evaluation.overallScore} />
            <div className="header-info">
              <h5 className="modal-title">{employee?.name}</h5>
              <p className="text-muted mb-0">
                {position?.title} | Period: {evaluation.periodStart} to {evaluation.periodEnd}
              </p>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {managerSummaryFactor && (
              <div className="card featured-summary-card mb-3">
                <div className="card-header"><i className="bi bi-chat-left-quote-fill me-2"></i>{managerSummaryFactor.title}</div>
                <div className="card-body">
                  <p className="text-muted fst-italic mb-0">
                    {getFactorData(managerSummaryFactor.id).value || "No summary provided."}
                  </p>
                </div>
              </div>
            )}
            
            <div className="accordion evaluation-accordion" id="evaluationDetailsAccordion">
              {evaluationFactors.map((factor) => {
                const collapseId = `collapse-${factor.id}`;
                const avgScore = sectionAverages[factor.id];
                const iconClass = getIconForFactorType(factor.type); 

                if (factor.type === 'kpi_section') {
                  const relevantKpis = kpis.filter(kpi => kpi.appliesToPositionIds?.includes(position?.id));
                  if (relevantKpis.length === 0) return null;
                  return (
                    <div className="accordion-item" key={factor.id}>
                      <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#${collapseId}`}>
                          <span className="d-flex align-items-center"><i className={`${iconClass} me-2`}></i>{factor.title}</span> {/* MODIFIED: Added Icon */}
                          <span className="section-avg-score">Avg: {avgScore} / 5.0</span>
                        </button>
                      </h2>
                      <div id={collapseId} className="accordion-collapse collapse" data-bs-parent="#evaluationDetailsAccordion">
                        <div className="accordion-body">
                          {relevantKpis.map(kpi => (
                            <EvaluationItem
                              key={kpi.id}
                              name={`${kpi.title} (${kpi.weight}%)`}
                              score={getFactorData(kpi.id).score}
                              comment={getFactorData(kpi.id).comments}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (factor.type === 'rating_scale') {
                  return (
                    <div className="accordion-item" key={factor.id}>
                      <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#${collapseId}`}>
                           <span className="d-flex align-items-center"><i className={`${iconClass} me-2`}></i>{factor.title}</span> {/* MODIFIED: Added Icon */}
                           <span className="section-avg-score">Avg: {avgScore} / 5.0</span>
                        </button>
                      </h2>
                      <div id={collapseId} className="accordion-collapse collapse" data-bs-parent="#evaluationDetailsAccordion">
                        <div className="accordion-body">
                          {factor.items.map(item => (
                             <EvaluationItem
                                key={item.id}
                                name={item.name}
                                score={getFactorData(item.id).score}
                                comment={getFactorData(item.id).comments}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (otherTextareaFactors.some(f => f.id === factor.id)) {
                  return (
                     <div className="accordion-item" key={factor.id}>
                        <h2 className="accordion-header">
                           <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#${collapseId}`}>
                              <span className="d-flex align-items-center"><i className={`${iconClass} me-2`}></i>{factor.title}</span> {/* MODIFIED: Added Icon */}
                           </button>
                        </h2>
                        <div id={collapseId} className="accordion-collapse collapse" data-bs-parent="#evaluationDetailsAccordion">
                           <div className="accordion-body p-3">
                               <p className="text-muted fst-italic mb-0">{getFactorData(factor.id).value || "N/A"}</p>
                           </div>
                        </div>
                     </div>
                  )
                }

                return null;
              })}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEvaluationModal;