import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const KpiRow = ({ kpi, positions, index, onKpiChange, onDelete }) => {
  const positionOptions = (positions || []).map(p => ({ value: p.id, label: p.title }));

  const selectedPositionOptions = positionOptions.filter(opt =>
    (kpi.appliesToPositionIds || []).includes(opt.value)
  );

  const handlePositionChange = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
    onKpiChange(index, 'appliesToPositionIds', selectedIds);
  };

  return (
    <div className="kpi-row">
      <div className="kpi-row-main">
        <div className="kpi-row-field kpi-row-title">
          <label className="form-label">KPI Title*</label>
          <input
            type="text"
            className="form-control"
            value={kpi.title || ''}
            onChange={(e) => onKpiChange(index, 'title', e.target.value)}
          />
        </div>
        <div className="kpi-row-field kpi-row-weight">
          <label className="form-label">Weight*</label>
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              value={kpi.weight || 0}
              onChange={(e) => onKpiChange(index, 'weight', parseInt(e.target.value, 10) || 0)}
            />
            <span className="input-group-text">%</span>
          </div>
        </div>
      </div>
      <div className="kpi-row-field kpi-row-description-editor">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          rows="2"
          placeholder="Describe how this KPI is measured..."
          value={kpi.description || ''}
          onChange={(e) => onKpiChange(index, 'description', e.target.value)}
        ></textarea>
      </div>
      <div className="kpi-row-field kpi-row-positions">
        <label className="form-label">Applies to Positions*</label>
        <Select
          isMulti
          options={positionOptions}
          value={selectedPositionOptions}
          onChange={handlePositionChange}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>
      <div className="kpi-row-actions">
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => onDelete(index)}
        >
          <i className="bi bi-trash-fill"></i>
        </button>
      </div>
    </div>
  );
};

export default KpiRow;