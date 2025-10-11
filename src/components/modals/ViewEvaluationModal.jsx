import React from 'react';
import ScoreDonutChart from '../pages/Performance-Management/ScoreDonutChart';
import StarRating from '../pages/Performance-Management/StarRating';
import './ViewEvaluationModal.css';

const ViewEvaluationModal = ({ show, onClose, evaluation, employee, position, evaluationFactors }) => {
  if (!show || !evaluation || !evaluationFactors || !employee) return null;

  const getFactorData = (factorId) => evaluation.factorScores[factorId] || {};

  const criteria = evaluationFactors.filter(f => f.type === 'criterion');
  const summaryFactor = evaluationFactors.find(f => f.id === 'factor_evaluator_summary');
  const developmentFactor = evaluationFactors.find(f => f.id === 'factor_development_areas');

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
            
            <div className="row">
              <div className="col-lg-6 mb-3">
                {summaryFactor && (
                  <div className="card h-100">
                    <div className="card-header">{summaryFactor.title}</div>
                    <div className="card-body">
                      <p className="text-muted fst-italic mb-0">
                        {getFactorData(summaryFactor.id).value || "No summary provided."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-lg-6 mb-3">
                {developmentFactor && (
                  <div className="card h-100">
                    <div className="card-header">{developmentFactor.title}</div>
                    <div className="card-body">
                      <p className="text-muted fst-italic mb-0">
                        {getFactorData(developmentFactor.id).value || "No details provided."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {criteria.map(criterion => (
              <div className="card mb-3" key={criterion.id}>
                <div className="card-header fw-bold">{criterion.title}</div>
                <ul className="list-group list-group-flush">
                  {criterion.items.map(item => {
                    const data = getFactorData(item.id);
                    return (
                      <li key={item.id} className="list-group-item">
                        <div className="evaluation-item">
                          <div className="evaluation-item-info">
                            <p className="name mb-0">{item.title}</p>
                            {data.comments && <p className="comment mb-0">"{data.comments}"</p>}
                          </div>
                          <div className="evaluation-item-score">
                            <StarRating score={data.score || 0} onRate={() => {}} />
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
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