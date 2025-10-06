import React, { useState, useCallback, useMemo } from 'react';
import { subDays, startOfYear } from 'date-fns';
import { useLeaderboardAnalytics } from '../../../hooks/useLeaderboardAnalytics';
import AnalyticsStatCard from './AnalyticsStatCard';
import LeaderboardCard from './LeaderboardCard';
import './LeaderboardsPage.css';

const LeaderboardsPage = (props) => {
  // Filter state
  const [startDate, setStartDate] = useState(subDays(new Date(), 89).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [positionFilter, setPositionFilter] = useState('');
  const [activePreset, setActivePreset] = useState('90d');
  const [displayLimit, setDisplayLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Sort direction state
  const [overallSort, setOverallSort] = useState('highest');
  const [teamLeaderSort, setTeamLeaderSort] = useState('highest');
  const [presenceSort, setPresenceSort] = useState('most');
  const [tardinessSort, setTardinessSort] = useState('most');
  const [overtimeSort, setOvertimeSort] = useState('most');
  const [leaveSort, setLeaveSort] = useState('most');

  // Note: searchTerm is NOT passed to the hook anymore.
  const {
    sortedByOverallScore,
    sortedByTeamScore,
    sortedByPresence,
    sortedByLates,
    sortedByLeaveDays,
    sortedByOvertime,
    summaryStats,
    isLoading,
  } = useLeaderboardAnalytics(props, { startDate, endDate, positionFilter });

  // --- Client-side search and slicing logic ---
  const processLeaderboardData = useCallback((fullData, sortDirection) => {
    // 1. Determine sort order based on the toggle state
    const sortedData = (sortDirection === 'highest' || sortDirection === 'most')
      ? fullData
      : [...fullData].reverse();

    // 2. If there's a search term, find the single matching employee
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const foundIndex = sortedData.findIndex(item => item.name.toLowerCase().includes(lowerSearchTerm));
      
      if (foundIndex !== -1) {
        // Return an array with just the found item, but add its original rank
        const foundItem = { ...sortedData[foundIndex], rank_override: foundIndex + 1 };
        return [foundItem];
      }
      return []; // Return empty array if no match is found
    }

    // 3. If not searching, just slice the list according to the display limit
    return sortedData.slice(0, displayLimit === Infinity ? sortedData.length : displayLimit);
  }, [searchTerm, displayLimit]);

  const overallLeaderboardData = useMemo(() => processLeaderboardData(sortedByOverallScore, overallSort), [processLeaderboardData, sortedByOverallScore, overallSort]);
  const teamLeaderLeaderboardData = useMemo(() => processLeaderboardData(sortedByTeamScore, teamLeaderSort), [processLeaderboardData, sortedByTeamScore, teamLeaderSort]);
  const presenceData = useMemo(() => processLeaderboardData(sortedByPresence, presenceSort), [processLeaderboardData, sortedByPresence, presenceSort]);
  const tardinessData = useMemo(() => processLeaderboardData(sortedByLates, tardinessSort), [processLeaderboardData, sortedByLates, tardinessSort]);
  const overtimeData = useMemo(() => processLeaderboardData(sortedByOvertime, overtimeSort), [processLeaderboardData, sortedByOvertime, overtimeSort]);
  const leaveData = useMemo(() => processLeaderboardData(sortedByLeaveDays, leaveSort), [processLeaderboardData, sortedByLeaveDays, leaveSort]);

  const uniquePositions = ['All Positions', ...new Set(props.positions.map(p => p.title).sort())];

  // --- Handlers ---
  const handleDateChange = useCallback((date, type) => {
    setActivePreset(null);
    if (type === 'start') setStartDate(date);
    if (type === 'end') setEndDate(date);
  }, []);

  const handlePositionChange = useCallback((e) => {
    setPositionFilter(e.target.value);
  }, []);

  const handlePresetChange = useCallback((preset) => {
    setActivePreset(preset);
    const today = new Date();
    let start;
    switch(preset) {
        case '30d': start = subDays(today, 29); break;
        case 'thisYear': start = startOfYear(today); break;
        case '90d': default: start = subDays(today, 89); break;
    }
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);
  
  const handleClearFilters = useCallback(() => {
    handlePresetChange('90d');
    setPositionFilter('');
    setDisplayLimit(5);
    setSearchTerm('');
  }, [handlePresetChange]);

  const handleDisplayLimitChange = useCallback((limitValue) => {
    const limit = limitValue === 'all' ? Infinity : Number(limitValue);
    setDisplayLimit(limit);
  }, []);

  if (isLoading) {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
  }

  return (
    <div className="container-fluid p-0 page-module-container">
      <header className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-main-title">Leaderboards</h1>
      </header>
      
      <div className="leaderboard-grid">
        <div className="leaderboard-grid-span-4">
          <div className="card leaderboard-controls-card shadow-sm">
            <div className="input-group global-search-bar">
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search employee name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="performance-controls-bar">
                <div className="filter-group">
                    <label>Date Range</label>
                    <div className="input-group">
                        <input type="date" className="form-control" value={startDate || ''} onChange={(e) => handleDateChange(e.target.value, 'start')} />
                        <span className="input-group-text">to</span>
                        <input type="date" className="form-control" value={endDate || ''} onChange={(e) => handleDateChange(e.target.value, 'end')} />
                    </div>
                </div>
                <div className="filter-group">
                    <label>Quick Presets</label>
                    <div className="btn-group w-100">
                        <button className={`btn btn-sm ${activePreset === '30d' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => handlePresetChange('30d')}>30 Days</button>
                        <button className={`btn btn-sm ${activePreset === '90d' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => handlePresetChange('90d')}>90 Days</button>
                        <button className={`btn btn-sm ${activePreset === 'thisYear' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => handlePresetChange('thisYear')}>This Year</button>
                    </div>
                </div>
                <div className="filter-group">
                    <label>Position</label>
                    <select className="form-select" value={positionFilter} onChange={handlePositionChange}>
                        {uniquePositions.map(pos => <option key={pos} value={pos === 'All Positions' ? '' : pos}>{pos}</option>)}
                    </select>
                </div>
                <div className="filter-group show-filter-group">
                    <label>Show</label>
                    <select 
                        className="form-select" 
                        value={displayLimit === Infinity ? 'all' : displayLimit}
                        onChange={(e) => handleDisplayLimitChange(e.target.value)}
                        disabled={!!searchTerm}
                    >
                        <option value="5">Top 5</option>
                        <option value="10">Top 10</option>
                        <option value="15">Top 15</option>
                        <option value="20">Top 20</option>
                        <option value="all">All</option>
                    </select>
                </div>
                <button className="btn btn-light" onClick={handleClearFilters}>Clear</button>
            </div>
          </div>
        </div>

        <div className="leaderboard-grid-span-4">
            <div className="dashboard-stats-container">
                <AnalyticsStatCard title="Total Present Days" value={summaryStats.totalPresentDays} unit="days" icon="bi-calendar-check" iconClass="icon-present" />
                <AnalyticsStatCard title="Total Absences" value={summaryStats.totalAbsences} unit="days" icon="bi-calendar-x" iconClass="icon-pending" />
                <AnalyticsStatCard title="Total Tardiness" value={summaryStats.totalLates} unit="incidents" icon="bi-alarm" iconClass="icon-pending" />
                <AnalyticsStatCard title="Total Leave Days" value={summaryStats.totalLeaveDays} unit="days" icon="bi-person-walking" iconClass="icon-on-leave" />
                <AnalyticsStatCard title="Total Overtime" value={summaryStats.totalOvertime.toFixed(1)} unit="hrs" icon="bi-clock-history" iconClass="icon-on-leave" />
            </div>
        </div>
        
        <div className="leaderboard-grid-span-4">
            <LeaderboardCard
                title="Overall Employee Leaderboard"
                icon={overallSort === 'highest' ? "bi-trophy-fill" : "bi-graph-down-arrow"}
                data={overallLeaderboardData}
                valueKey="overallScore"
                valueFormatter={(score) => `${score.toFixed(1)}%`}
                rankOneLabel={overallSort === 'highest' ? "Best Employee" : "Lowest Score"}
                isNegativeMetric={overallSort === 'lowest'}
                actions={( <a href="#" className="leaderboard-sort-toggle" onClick={(e) => { e.preventDefault(); setOverallSort(prev => prev === 'highest' ? 'lowest' : 'highest'); }}> Sort by {overallSort === 'highest' ? 'Lowest Score' : 'Highest Score'} <i className="bi bi-arrow-repeat"></i></a> )}
            />
        </div>

        <div className="leaderboard-grid-span-4">
            <LeaderboardCard
                title="Team Leader Leaderboard"
                icon={teamLeaderSort === 'highest' ? "bi-person-workspace" : "bi-people-fill"}
                data={teamLeaderLeaderboardData}
                valueKey="averageTeamScore"
                valueFormatter={(score) => `${score.toFixed(1)}%`}
                rankOneLabel={teamLeaderSort === 'highest' ? "Best Leader" : "Lowest Team Leader Score"}
                isNegativeMetric={teamLeaderSort === 'lowest'}
                actions={( <a href="#" className="leaderboard-sort-toggle" onClick={(e) => { e.preventDefault(); setTeamLeaderSort(prev => prev === 'highest' ? 'lowest' : 'highest'); }}> Sort by {teamLeaderSort === 'highest' ? 'Lowest Score' : 'Highest Score'} <i className="bi bi-arrow-repeat"></i></a> )}
            />
        </div>
        
        <div className="leaderboard-grid-span-2">
            <LeaderboardCard
                title="Presence & Absences"
                icon="bi-calendar-check-fill"
                data={presenceData}
                valueKey={presenceSort === 'most' ? 'presentDays' : 'absences'}
                valueFormatter={(val) => `${val} days`}
                valueBar={false}
                rankOneLabel={presenceSort === 'most' ? 'Most Present' : 'Most Absences'}
                isNegativeMetric={presenceSort === 'least'}
                actions={( <a href="#" className="leaderboard-sort-toggle" onClick={(e) => { e.preventDefault(); setPresenceSort(prev => prev === 'most' ? 'least' : 'most'); }}> Sort by {presenceSort === 'most' ? 'Most Absences' : 'Most Present'} <i className="bi bi-arrow-repeat"></i></a> )}
            />
        </div>

        <div className="leaderboard-grid-span-2">
            <LeaderboardCard
                title="Punctuality & Tardiness"
                icon="bi-alarm-fill"
                data={tardinessData}
                valueKey="lates"
                valueFormatter={(val) => `${val} incidents`}
                valueBar={false}
                rankOneLabel={tardinessSort === 'most' ? 'Highest Tardiness' : 'Most Punctual'}
                isNegativeMetric={tardinessSort === 'most'}
                actions={( <a href="#" className="leaderboard-sort-toggle" onClick={(e) => { e.preventDefault(); setTardinessSort(prev => prev === 'most' ? 'least' : 'most'); }}> Sort by {tardinessSort === 'most' ? 'Most Punctual' : 'Highest Tardiness'} <i className="bi bi-arrow-repeat"></i></a> )}
            />
        </div>
        
        <div className="leaderboard-grid-span-2">
            <LeaderboardCard
                title="Overtime"
                icon="bi-stopwatch-fill"
                data={overtimeData}
                valueKey="overtimeHours"
                valueFormatter={(val) => `${val.toFixed(2)} hrs`}
                valueBar={false}
                rankOneLabel={overtimeSort === 'most' ? 'Most Overtime' : 'Least Overtime'}
                isNegativeMetric={overtimeSort === 'least'}
                actions={( <a href="#" className="leaderboard-sort-toggle" onClick={(e) => { e.preventDefault(); setOvertimeSort(prev => prev === 'most' ? 'least' : 'most'); }}> Sort by {overtimeSort === 'most' ? 'Least' : 'Most'} Hours <i className="bi bi-arrow-repeat"></i></a> )}
            />
        </div>
        
        <div className="leaderboard-grid-span-2">
             <LeaderboardCard
                title="Leave Utilization"
                icon="bi-calendar-event-fill"
                data={leaveData}
                valueKey="leaveDays"
                valueFormatter={(val) => `${val} days`}
                valueBar={false}
                rankOneLabel={leaveSort === 'most' ? 'Most Leaves' : 'Least Leaves'}
                isNegativeMetric={leaveSort === 'most'}
                actions={( <a href="#" className="leaderboard-sort-toggle" onClick={(e) => { e.preventDefault(); setLeaveSort(prev => prev === 'most' ? 'least' : 'most'); }}> Sort by {leaveSort === 'most' ? 'Least' : 'Most'} Leaves <i className="bi bi-arrow-repeat"></i></a> )}
            />
        </div>

      </div>
    </div>
  );
};

export default LeaderboardsPage;