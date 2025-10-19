import React from 'react';
import EditableContributionTable from './EditableContributionTable';

const SssTab = (props) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 contribution-report-title">{props.reportTitle}</h4>
      </div>
      <p className="text-muted">This report will generate the SSS contribution summary. Click cells to edit, headers to rename, or use the controls to add/remove rows and columns.</p>
      <EditableContributionTable {...props} />
    </div>
  );
};

export default SssTab;