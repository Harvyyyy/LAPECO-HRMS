import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StartEvaluationModal from '../../modals/StartEvaluationModal';
import ViewEvaluationModal from '../../modals/ViewEvaluationModal';
import EvaluationSelectorCard from './EvaluationSelectorCard';
import './EvaluationPages.css';

const EvaluateTeamPage = ({ currentUser, employees, positions, evaluations, kras, kpis, evaluationFactors }) => {
  const navigate = useNavigate();
  const positionMap = useMemo(() => new Map(positions.map(p => [p.id, p.title])), [positions]);
  const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);
  
  const [showStartModal, setShowStartModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewingEvaluation, setViewingEvaluation] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const teamMembersWithStatus = useMemo(() => {
    if (!currentUser?.isTeamLeader) return [];
    
    const team = employees.filter(emp => emp.positionId === currentUser.positionId && !emp.isTeamLeader);

    return team.map(member => {
      const memberEvals = evaluations
        .filter(ev => ev.employeeId === member.id)
        .sort((a, b) => new Date(b.periodEnd) - new Date(a.periodEnd));
      
      const lastEvaluation = memberEvals[0] || null;
      let status = 'Due';
      
      if(lastEvaluation) {
        const lastEvalDate = new Date(lastEvaluation.periodEnd);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        if (lastEvalDate > sixMonthsAgo) {
          status = 'Completed';
        }
      }
      return { ...member, lastEvaluation, evaluationStatus: status };
    });
  }, [currentUser, employees, evaluations]);

  const filteredTeamMembers = useMemo(() => {
    return teamMembersWithStatus.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || member.evaluationStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });
  }, [teamMembersWithStatus, searchTerm, statusFilter]);

  const summaryStats = useMemo(() => ({
    total: teamMembersWithStatus.length,
    due: teamMembersWithStatus.filter(m => m.evaluationStatus === 'Due').length,
    completed: teamMembersWithStatus.filter(m => m.evaluationStatus === 'Completed').length,
  }), [teamMembersWithStatus]);

  const handleAction = (action, data) => {
    if (action === 'start') {
      setSelectedEmployee(data);
      setShowStartModal(true);
    } else if (action === 'view') {
      setViewingEvaluation(data);
      setShowViewModal(true);
    }
  };

  const handleStartEvaluation = (startData) => {
    navigate('/dashboard/performance/evaluate', { state: startData });
    setShowStartModal(false);
  };

  const modalProps = useMemo(() => {
    if (!viewingEvaluation) return null;
    const employee = employeeMap.get(viewingEvaluation.employeeId);
    const position = employee ? positions.find(p => p.id === employee.positionId) : null;
    return { evaluation: viewingEvaluation, employee, position };
  }, [viewingEvaluation, employeeMap, positions]);

  return (
    <div className="container-fluid p-0 page-module-container">
      <header className="page-header mb-4">
        <h1 className="page-main-title">Evaluate Team</h1>
        <p className="page-subtitle text-muted">Manage and conduct performance evaluations for your team members.</p>
      </header>

      <div className="status-summary-bar">
        <div className={`summary-card interactive ${statusFilter === 'All' ? 'active' : ''}`} onClick={() => setStatusFilter('All')}>
            <div className="summary-icon icon-team"><i className="bi bi-people-fill"></i></div>
            <div className="summary-info">
                <span className="summary-value">{summaryStats.total}</span>
                <span className="summary-label"> Total Members</span>
            </div>
        </div>
        <div className={`summary-card interactive ${statusFilter === 'Due' ? 'active' : ''}`} onClick={() => setStatusFilter('Due')}>
            <div className="summary-icon icon-due"><i className="bi bi-hourglass-split"></i></div>
            <div className="summary-info">
                <span className="summary-value">{summaryStats.due}</span>
                <span className="summary-label"> Due for Review</span>
            </div>
        </div>
        <div className={`summary-card interactive ${statusFilter === 'Completed' ? 'active' : ''}`} onClick={() => setStatusFilter('Completed')}>
            <div className="summary-icon icon-completed"><i className="bi bi-check2-circle"></i></div>
            <div className="summary-info">
                <span className="summary-value">{summaryStats.completed}</span>
                <span className="summary-label"> Completed</span>
            </div>
        </div>
      </div>
      
      <div className="controls-bar page-controls-bar d-flex justify-content-between mb-4">
        <div className="input-group" style={{ maxWidth: '400px' }}>
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input type="text" className="form-control" placeholder="Search by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="evaluation-selector-grid">
        {filteredTeamMembers.length > 0 ? (
          filteredTeamMembers.map(member => (
            <EvaluationSelectorCard
              key={member.id}
              employee={member}
              positionTitle={positionMap.get(member.positionId) || 'Unassigned'}
              lastEvaluation={member.lastEvaluation}
              onAction={handleAction}
            />
          ))
        ) : (
          <div className="text-center p-5 bg-light rounded">
            <p>No team members match your current filters.</p>
          </div>
        )}
      </div>

      {showStartModal && selectedEmployee && (
        <StartEvaluationModal
          show={showStartModal}
          onClose={() => setShowStartModal(false)}
          onStart={handleStartEvaluation}
          employees={[selectedEmployee]} 
        />
      )}
      {modalProps && (
        <ViewEvaluationModal
          show={showViewModal}
          onClose={() => setShowViewModal(false)}
          evaluation={modalProps.evaluation}
          employee={modalProps.employee}
          position={modalProps.position}
          evaluationFactors={evaluationFactors}
        />
      )}
    </div>
  );
};

export default EvaluateTeamPage;