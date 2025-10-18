import React, { useState, useMemo } from 'react';
import EmployeeCaseCard from './EmployeeCaseCard';
import EmployeeCaseDetailView from './EmployeeCaseDetailView';
import './MyCasesPage.css';

const MyCasesPage = ({ currentUser, cases = [] }) => {
    const [selectedCase, setSelectedCase] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');

    const myCases = useMemo(() => {
        return cases
            .filter(c => c.employeeId === currentUser.id)
            .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
    }, [currentUser, cases]);

    const stats = useMemo(() => {
        return myCases.reduce((acc, caseInfo) => {
            acc.All++;
            if (caseInfo.status === 'Ongoing') acc.Ongoing++;
            if (caseInfo.status === 'Closed') acc.Closed++;
            return acc;
        }, { All: 0, Ongoing: 0, Closed: 0 });
    }, [myCases]);

    const filteredCases = useMemo(() => {
        if (statusFilter === 'All') return myCases;
        return myCases.filter(c => c.status === statusFilter);
    }, [myCases, statusFilter]);

    if (selectedCase) {
        return (
            <EmployeeCaseDetailView
                caseInfo={selectedCase}
                onBack={() => setSelectedCase(null)}
            />
        );
    }

    return (
        <div className="container-fluid p-0 page-module-container">
            <header className="page-header mb-4">
                <h1 className="page-main-title">My Cases</h1>
                <p className="text-muted">A record of all disciplinary cases associated with your account.</p>
            </header>

            <div className="my-cases-stats-grid">
                <div className={`stat-card-my-cases all ${statusFilter === 'All' ? 'active' : ''}`} onClick={() => setStatusFilter('All')}>
                    <span className="stat-value">{stats.All}</span>
                    <span className="stat-label">All Cases</span>
                </div>
                <div className={`stat-card-my-cases ongoing ${statusFilter === 'Ongoing' ? 'active' : ''}`} onClick={() => setStatusFilter('Ongoing')}>
                    <span className="stat-value">{stats.Ongoing}</span>
                    <span className="stat-label">Ongoing</span>
                </div>
                <div className={`stat-card-my-cases closed ${statusFilter === 'Closed' ? 'active' : ''}`} onClick={() => setStatusFilter('Closed')}>
                    <span className="stat-value">{stats.Closed}</span>
                    <span className="stat-label">Closed</span>
                </div>
            </div>

            {filteredCases.length > 0 ? (
                <div className="case-card-grid">
                    {filteredCases.map(caseInfo => (
                        <EmployeeCaseCard
                            key={caseInfo.caseId}
                            caseInfo={caseInfo}
                            onView={() => setSelectedCase(caseInfo)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center p-5 bg-light rounded">
                    <i className="bi bi-patch-check-fill fs-1 text-success mb-3 d-block"></i>
                    <h4 className="text-muted">No Cases Found</h4>
                    <p className="text-muted">
                        {statusFilter === 'All'
                            ? "You have a clean record with no disciplinary cases."
                            : `You have no ${statusFilter.toLowerCase()} cases.`
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

export default MyCasesPage;