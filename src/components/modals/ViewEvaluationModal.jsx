import React, { useState, useMemo, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import ScoreDonutChart from '../pages/Performance-Management/ScoreDonutChart';
import StarRating from '../pages/Performance-Management/StarRating';
import ScoreIndicator from '../pages/Performance-Management/ScoreIndicator';
import Avatar from '../common/Avatar';
import './ViewEvaluationModal.css';

const ViewEvaluationModal = ({
    show,
    onClose,
    evaluationContext, 
    employeeHistoryContext,
    employees,
    positions,
    evaluations,
    evaluationFactors
}) => {
    const [view, setView] = useState('list'); // 'history', 'list', or 'detail'
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);

    const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);
    const positionMap = useMemo(() => new Map(positions.map(p => [p.id, p.title])), [positions]);
    
    // Determine the primary context and subject employee
    const primaryContext = useMemo(() => employeeHistoryContext || evaluationContext, [employeeHistoryContext, evaluationContext]);
    const subjectEmployee = useMemo(() => primaryContext ? employeeMap.get(primaryContext.employeeId) : null, [primaryContext, employeeMap]);

    // Initialize modal state based on the context provided
    useEffect(() => {
        if (show) {
            setView(employeeHistoryContext ? 'history' : 'list');
            setSelectedEvaluation(null);
        }
    }, [show, employeeHistoryContext]);

    // Derived data for the 'history' view
    const employeeHistory = useMemo(() => {
        if (!employeeHistoryContext) return null;
        
        const groupedByPeriod = employeeHistoryContext.history.reduce((acc, ev) => {
            const periodKey = `${ev.periodStart}_${ev.periodEnd}`;
            if (!acc[periodKey]) {
                acc[periodKey] = { periodStart: ev.periodStart, periodEnd: ev.periodEnd, evals: [] };
            }
            acc[periodKey].evals.push(ev);
            return acc;
        }, {});

        return Object.values(groupedByPeriod).sort((a,b) => new Date(b.periodStart) - new Date(a.periodStart));
    }, [employeeHistoryContext]);

    // Derived data for the 'list' view
    const { positionTitle, evaluatorList, currentPeriodContext } = useMemo(() => {
        const context = selectedEvaluation ? evaluations.find(e => e.id === selectedEvaluation.id) : evaluationContext;
        if (!context || !subjectEmployee) return { positionTitle: '', evaluatorList: [], currentPeriodContext: null };

        const title = positionMap.get(subjectEmployee.positionId) || 'Unassigned';

        const sourceEvals = employeeHistoryContext ? employeeHistoryContext.history : evaluations;

        const evaluationsForSubject = sourceEvals.filter(ev =>
            ev.employeeId === context.employeeId &&
            ev.periodStart === context.periodStart &&
            ev.periodEnd === context.periodEnd
        );

        const evaluators = evaluationsForSubject.map(ev => ({
            evaluator: employeeMap.get(ev.evaluatorId),
            evaluation: ev,
        })).filter(item => item.evaluator);

        return { positionTitle: title, evaluatorList: evaluators, currentPeriodContext: context };
    }, [selectedEvaluation, evaluationContext, employeeHistoryContext, evaluations, employeeMap, positionMap, subjectEmployee]);

    if (!show || !subjectEmployee) return null;

    const handleSelectPeriod = (period) => {
        // Find a representative eval from that period to set the context
        const representativeEval = evaluations.find(e => e.employeeId === subjectEmployee.id && e.periodStart === period.periodStart && e.periodEnd === period.periodEnd);
        if (representativeEval) {
            setSelectedEvaluation(representativeEval); // Use this to derive context for the list view
            setView('list');
        }
    };

    const handleViewDetails = (evaluation) => {
        setSelectedEvaluation(evaluation);
        setView('detail');
    };
    
    const handleBackToList = () => {
        setView(employeeHistoryContext ? 'history' : 'list');
        setSelectedEvaluation(null); // Clear detailed selection
    };
    
    const handleBackToHistory = () => {
        setView('history');
        setSelectedEvaluation(null);
    };

    // --- RENDER FUNCTIONS ---
    const renderHistoryView = () => (
        <>
            <div className="modal-header"><h5 className="modal-title">Evaluation History for {subjectEmployee.name}</h5></div>
            <div className="modal-body evaluator-list-body">
                <p className="text-muted">Showing all evaluation periods for this employee. Select a period to view the evaluators.</p>
                <div className="evaluator-list">
                    {employeeHistory.map(period => (
                        <div key={`${period.periodStart}-${period.periodEnd}`} className="evaluator-card period-card" onClick={() => handleSelectPeriod(period)}>
                            <div className="evaluator-info">
                                <i className="bi bi-calendar-range fs-4 text-primary"></i>
                                <div>
                                    <div className="evaluator-name">{period.periodStart} to {period.periodEnd}</div>
                                    <div className="evaluator-position">{period.evals.length} submission(s)</div>
                                </div>
                            </div>
                            <div className="evaluation-actions">
                                <button className="btn btn-sm btn-outline-primary">View</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    const renderListView = () => (
        <>
            <div className="modal-header">
                {employeeHistoryContext && <button className="btn btn-sm btn-light me-2 back-to-list-btn" onClick={handleBackToHistory}><i className="bi bi-arrow-left"></i></button>}
                <div className="header-info">
                    <h5 className="modal-title">Evaluations for {subjectEmployee.name}</h5>
                    <p className="text-muted mb-0">Period: {currentPeriodContext.periodStart} to {currentPeriodContext.periodEnd}</p>
                </div>
            </div>
            <div className="modal-body evaluator-list-body">
                {evaluatorList.map(({ evaluator, evaluation }) => (
                    <div key={evaluation.id} className="evaluator-card">
                        <div className="evaluator-info"><Avatar src={evaluator.imageUrl} alt={evaluator.name} size="md" /><div><div className="evaluator-name">{evaluator.name}</div><div className="evaluator-position">{positionMap.get(evaluator.positionId) || 'N/A'}</div></div></div>
                        <div className="evaluation-summary"><ScoreIndicator score={evaluation.overallScore} /></div>
                        <div className="evaluation-actions"><button className="btn btn-sm btn-outline-primary" onClick={() => handleViewDetails(evaluation)}>View Evaluation</button></div>
                    </div>
                ))}
            </div>
        </>
    );

    const renderDetailView = () => {
        const evaluator = employeeMap.get(selectedEvaluation.evaluatorId);
        const criteria = evaluationFactors.filter(f => f.type === 'criterion');
        const getFactorData = (factorId) => selectedEvaluation.factorScores[factorId] || {};

        return (
            <>
                <div className="modal-header">
                    <button className="btn btn-sm btn-light me-2 back-to-list-btn" onClick={handleBackToList}><i className="bi bi-arrow-left"></i></button>
                    <ScoreDonutChart score={selectedEvaluation.overallScore} />
                    <div className="header-info">
                        <h5 className="modal-title">{subjectEmployee.name}</h5>
                        <p className="text-muted mb-0">Period: {selectedEvaluation.periodStart} to {selectedEvaluation.periodEnd}</p>
                        {evaluator && <div className="evaluator-info">Evaluated by: <strong>{evaluator.name}</strong></div>}
                    </div>
                </div>
                <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                    {criteria.map(criterion => (
                        <div className="card mb-3" key={criterion.id}><div className="card-header fw-bold">{criterion.title}</div>
                            <ul className="list-group list-group-flush">
                                {criterion.items.map(item => {
                                    const data = getFactorData(item.id);
                                    return (
                                    <li key={item.id} className="list-group-item">
                                        <div className="evaluation-item">
                                            <div className="evaluation-item-info"><p className="name mb-0">{item.title}</p>{data.comments && <p className="comment mb-0">"{data.comments}"</p>}</div>
                                            <div className="evaluation-item-score"><StarRating score={data.score || 0} onRate={() => {}} /></div>
                                        </div>
                                    </li>
                                    )
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    const renderContent = () => {
        switch (view) {
            case 'history': return renderHistoryView();
            case 'list': return renderListView();
            case 'detail': return renderDetailView();
            default: return null;
        }
    };

    return (
        <div className="modal fade show d-block view-evaluation-modal" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    {renderContent()}
                    <div className="modal-footer"><button type="button" className="btn btn-outline-secondary" onClick={onClose}>Close</button></div>
                </div>
            </div>
        </div>
    );
};

export default ViewEvaluationModal;