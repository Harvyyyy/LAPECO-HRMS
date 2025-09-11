import React from 'react';
import KpiScoringRow from './KpiScoringRow';

const KraEvaluationSection = ({ kra, kpis, scores, onScoreChange }) => {
  return (
    <div className="card mb-4 kra-evaluation-section">
      <div className="card-header">
        <h5 className="mb-0">{kra.title}</h5>
      </div>
      <div className="card-body p-0">
        {kpis.map(kpi => (
          <div key={kpi.id} className="kpi-scoring-container">
            <div className="kpi-info">
              <p className="kpi-title">{kpi.title} ({kpi.weight}%)</p>
              <p className="kpi-description">{kpi.description}</p>
            </div>
            <div className="kpi-scoring">
              <KpiScoringRow
                kpiId={kpi.id}
                scoreData={scores[kpi.id]}
                onScoreChange={onScoreChange}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KraEvaluationSection;