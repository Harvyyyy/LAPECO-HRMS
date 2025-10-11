import React from 'react';
import { differenceInDays, parseISO, startOfToday } from 'date-fns';
import ActionsDropdown from '../../common/ActionsDropdown';
import placeholderAvatar from '../../../assets/placeholder-profile.jpg';

const ResignationRequestRow = ({ request, employee, onApprove, onDecline, onEditDate, onViewReason, onDelete, onViewProfile }) => {
    if (!request || !request.id) {
        return null;
    }

    const statusClass = (request.status || 'pending').toLowerCase();

    const hasDates = request.effectiveDate && request.submissionDate;

    const noticeInDays = hasDates ? differenceInDays(parseISO(request.effectiveDate), parseISO(request.submissionDate)) : null;
    let noticeBadgeClass = 'notice-standard';
    if (noticeInDays !== null) {
        if (noticeInDays < 30) noticeBadgeClass = 'notice-short';
        if (noticeInDays > 30) noticeBadgeClass = 'notice-long';
    }

    const today = startOfToday();
    const effectiveDate = request.effectiveDate ? parseISO(request.effectiveDate) : null;
    const daysRemaining = effectiveDate ? differenceInDays(effectiveDate, today) : null;
    let daysRemainingBadgeClass = 'neutral';
    let daysRemainingText = 'N/A';

    if (daysRemaining !== null && request.status === 'Approved') {
        daysRemainingText = `${daysRemaining} days`;
        if (daysRemaining > 0) {
            daysRemainingBadgeClass = 'positive';
        } else if (daysRemaining === 0) {
            daysRemainingText = 'Today';
        } else {
            daysRemainingBadgeClass = 'negative';
            daysRemainingText = `Overdue`;
        }
    }

    return (
        <tr>
            <td>{request.employeeId}</td>
            <td>
                <div className="fw-bold">{request.employeeName}</div>
            </td>
            <td>{request.position}</td>
            <td>{request.submissionDate || 'N/A'}</td>
            <td><strong>{request.effectiveDate || 'N/A'}</strong></td>
            <td className="text-center">
                {noticeInDays !== null ? (
                    <span className={`notice-badge ${noticeBadgeClass}`}>{noticeInDays} days</span>
                ) : (
                    <span className="notice-badge notice-standard">N/A</span>
                )}
            </td>
            <td className="text-center">
                <span className={`days-remaining-badge ${daysRemainingBadgeClass}`}>{daysRemainingText}</span>
            </td>
            <td className="text-center">
                <span className={`status-badge status-${statusClass}`}>{request.status}</span>
            </td>
            <td className="text-center">
                <ActionsDropdown>
                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); onViewProfile(); }}>
                        <i className="bi bi-person-lines-fill me-2"></i>View Profile
                    </a>
                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); onViewReason(); }}>
                        <i className="bi bi-info-circle me-2"></i>View Reason
                    </a>
                    {request.status === 'Pending' && (
                        <>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item text-success" href="#" onClick={(e) => { e.preventDefault(); onApprove(); }}>
                                <i className="bi bi-check-circle-fill me-2"></i>Approve
                            </a>
                            <a className="dropdown-item text-danger" href="#" onClick={(e) => { e.preventDefault(); onDecline(); }}>
                                <i className="bi bi-x-circle-fill me-2"></i>Decline
                            </a>
                        </>
                    )}
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); onEditDate(); }}>
                        <i className="bi bi-calendar-event me-2"></i>Edit Effective Date
                    </a>
                    <a className="dropdown-item text-danger" href="#" onClick={(e) => { e.preventDefault(); onDelete(); }}>
                        <i className="bi bi-trash-fill me-2"></i>Delete Request
                    </a>
                </ActionsDropdown>
            </td>
        </tr>
    );
};

export default ResignationRequestRow;