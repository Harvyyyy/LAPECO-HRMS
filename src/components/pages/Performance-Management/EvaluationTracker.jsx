import React, { useState, useMemo } from 'react';
import { Accordion } from 'react-bootstrap';
import TeamEvaluationCard from './TeamEvaluationCard';
import ConfirmationModal from '../../modals/ConfirmationModal';
import './EvaluationTracker.css';

const EvaluationTracker = ({ teams, activePeriod, onViewEvaluation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [completionFilter, setCompletionFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'completion', direction: 'ascending' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const teamsWithCompletion = useMemo(() => {
    return teams.map(team => {
      const totalMembers = team.completedMembers.length + team.pendingMembers.length;
      const totalTasks = (team.teamLeader ? 1 : 0) + totalMembers + (team.teamLeader ? totalMembers : 0);
      const completedTasks = team.completedMembers.length + (team.leaderStatus?.isEvaluated ? 1 : 0) + (team.leaderStatus?.evalsOfLeaderByMembers || 0);
      const completion = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      const pendingCount = totalTasks - completedTasks;
      return { ...team, completion, pendingCount };
    });
  }, [teams]);

  const filteredAndSortedTeams = useMemo(() => {
    let results = [...teamsWithCompletion];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      results = results.filter(team => 
        team.positionTitle.toLowerCase().includes(lowerSearch) ||
        team.teamLeader?.name.toLowerCase().includes(lowerSearch)
      );
    }

    if (completionFilter !== 'all') {
      results = results.filter(team => {
        const isComplete = team.pendingCount === 0;
        return completionFilter === 'complete' ? isComplete : !isComplete;
      });
    }

    results.sort((a, b) => {
      const key = sortConfig.key;
      const direction = sortConfig.direction === 'ascending' ? 1 : -1;
      let valA = a[key];
      let valB = b[key];
      if (key === 'name') {
        valA = a.positionTitle;
        valB = b.positionTitle;
      }
      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });

    return results;
  }, [teamsWithCompletion, searchTerm, completionFilter, sortConfig]);
  
  const overallStats = useMemo(() => {
      const totalTeams = teamsWithCompletion.length;
      const completeTeams = teamsWithCompletion.filter(t => t.pendingCount === 0).length;
      const totalEvals = teamsWithCompletion.reduce((sum, t) => sum + (t.teamLeader ? 1 : 0) + (t.completedMembers.length + t.pendingMembers.length)*2, 0);
      const completedEvals = teamsWithCompletion.reduce((sum, t) => {
        const leaderEvals = t.teamLeader ? t.completedMembers.length + t.pendingMembers.length - t.leaderStatus.pendingMemberEvals.length : 0;
        return sum + t.completedMembers.length + (t.leaderStatus?.isEvaluated ? 1 : 0) + leaderEvals;
      }, 0);
      const overallCompletion = totalEvals > 0 ? (completedEvals / totalEvals) * 100 : 0;
      return {
          overallCompletion,
          pendingEvals: totalEvals - completedEvals,
          completeTeams,
          incompleteTeams: totalTeams - completeTeams,
      };
  }, [teamsWithCompletion]);

  const handleRemindAllPending = () => {
    alert(`Reminders sent to all ${overallStats.pendingEvals} pending individuals.`);
    setShowConfirmModal(false);
  };

  if (!activePeriod) {
    return (
      <div className="eval-tracker-placeholder">
        <i className="bi bi-pause-circle-fill"></i>
        <h6>No Active Evaluation Period</h6>
        <p>Set an active period to track evaluation status.</p>
      </div>
    );
  }

  return (
    <>
      <div className="evaluation-tracker-container">
          <div className="active-period-header">
            <i className="bi bi-broadcast-pin"></i>
            <span>Active Period: <strong>{activePeriod.name}</strong></span>
          </div>
          <div className="tracker-kpi-grid">
              <div className="tracker-kpi-card kpi-completion">
                  <div className="kpi-icon"><i className="bi bi-reception-4"></i></div>
                  <div className="kpi-info">
                    <div className="kpi-value">{overallStats.overallCompletion.toFixed(0)}%</div>
                    <div className="kpi-label">Overall Completion</div>
                  </div>
              </div>
              <div className="tracker-kpi-card kpi-pending">
                  <div className="kpi-icon"><i className="bi bi-hourglass-split"></i></div>
                  <div className="kpi-info">
                    <div className="kpi-value">{overallStats.pendingEvals}</div>
                    <div className="kpi-label">Total Pending</div>
                  </div>
              </div>
              <div className="tracker-kpi-card kpi-complete">
                  <div className="kpi-icon"><i className="bi bi-check2-circle"></i></div>
                  <div className="kpi-info">
                    <div className="kpi-value">{overallStats.completeTeams}</div>
                    <div className="kpi-label">Teams Complete</div>
                  </div>
              </div>
             <div className="tracker-kpi-card kpi-incomplete">
                <div className="kpi-icon"><i className="bi bi-exclamation-triangle"></i></div>
                <div className="kpi-info">
                  <div className="kpi-value">{overallStats.incompleteTeams}</div>
                  <div className="kpi-label">Teams Incomplete</div>
                </div>
              </div>
          </div>
          
          <div className="card shadow-sm tracker-controls-card">
            <div className="card-body">
              <div className="tracker-controls-bar">
                  <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-search"></i></span>
                  <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Search by team or leader name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  </div>
                  <div className="d-flex align-items-center gap-2">
                      <div className="btn-group">
                          <button className={`btn ${completionFilter === 'all' ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => setCompletionFilter('all')}>All</button>
                          <button className={`btn ${completionFilter === 'incomplete' ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => setCompletionFilter('incomplete')}>Incomplete</button>
                          <button className={`btn ${completionFilter === 'complete' ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => setCompletionFilter('complete')}>Complete</button>
                      </div>
                    <div className="dropdown">
                        <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Sort By
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setSortConfig({key: 'completion', direction: 'ascending'})}}>Completion (Low to High)</a></li>
                            <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setSortConfig({key: 'completion', direction: 'descending'})}}>Completion (High to Low)</a></li>
                            <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setSortConfig({key: 'pendingCount', direction: 'descending'})}}>Most Pending</a></li>
                            <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setSortConfig({key: 'name', direction: 'ascending'})}}>Team Name (A-Z)</a></li>
                        </ul>
                    </div>
                      <button 
                        className="btn btn-success" 
                        onClick={() => setShowConfirmModal(true)}
                        disabled={overallStats.pendingEvals === 0}
                      >
                        <i className="bi bi-bell-fill me-1"></i> Remind All
                      </button>
                  </div>
              </div>
            </div>
          </div>

          {filteredAndSortedTeams.length > 0 ? (
              <Accordion>
              {filteredAndSortedTeams.map((team, index) => (
                  <TeamEvaluationCard 
                  key={team.positionId}
                  team={team}
                  eventKey={index.toString()}
                  onViewEvaluation={onViewEvaluation}
                  />
              ))}
              </Accordion>
          ) : (
              <div className="eval-tracker-placeholder mt-4">
              <i className="bi bi-info-circle-fill"></i>
              <h6>No Teams Match Your Criteria</h6>
              <p>Try adjusting your search or filter settings.</p>
              </div>
          )}
      </div>
      <ConfirmationModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleRemindAllPending}
        title="Confirm Bulk Reminder"
        confirmText="Yes, Send Reminders"
        confirmVariant="primary"
      >
        <p>Are you sure you want to send an evaluation reminder to all <strong>{overallStats.pendingEvals}</strong> individuals with a pending status?</p>
      </ConfirmationModal>
    </>
  );
};

export default EvaluationTracker;