import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const toKey = (str) => str.trim().toLowerCase().replace(/\s+/g, '_');

const CreateTemplateModal = ({ show, onClose, onSave, positions, templateData }) => {
  const initialFormState = {
    name: '',
    description: '',
    columns: [
      { key: 'start_time', name: 'Start Time' },
      { key: 'end_time', name: 'End Time' },
      { key: 'ot_hours', name: 'OT (Hours)' }
    ], 
    applicablePositions: [],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [newColumnName, setNewColumnName] = useState('');

  const isEditMode = Boolean(templateData && templateData.id);

  const positionOptions = (positions || []).map(pos => ({
    value: pos.title,
    label: pos.title
  }));

  useEffect(() => {
    if (show) {
      if (isEditMode && templateData) {
        setFormData({
          name: templateData.name || '',
          description: templateData.description || '',
          columns: (templateData.columns || ['start_time', 'end_time']).map(colKey => ({
            key: colKey,
            name: colKey.charAt(0).toUpperCase() + colKey.slice(1).replace(/_/g, ' ')
          })),
          applicablePositions: (templateData.applicablePositions || []).map(title => ({
            value: title,
            label: title,
          })),
        });
      } else {
        setFormData(initialFormState);
      }
      setErrors({});
      setNewColumnName('');
    }
  }, [templateData, isEditMode, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePositionSelectChange = (selectedOptions) => {
    setFormData(prev => ({ ...prev, applicablePositions: selectedOptions || [] }));
  };

  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    const key = toKey(newColumnName);
    if (formData.columns.some(c => c.key === key)) {
      alert(`A column with the name "${newColumnName}" already exists.`);
      return;
    }
    setFormData(prev => ({
      ...prev,
      columns: [...prev.columns, { key, name: newColumnName.trim() }]
    }));
    setNewColumnName('');
  };

  const handleRemoveColumn = (keyToRemove) => {
    const permanentCols = ['start_time', 'end_time', 'ot_hours'];
    if (permanentCols.includes(keyToRemove)) {
        const colName = formData.columns.find(c => c.key === keyToRemove)?.name || keyToRemove;
        alert(`The '${colName}' column is required and cannot be removed.`);
        return;
    }
    setFormData(prev => ({
      ...prev,
      columns: prev.columns.filter(c => c.key !== keyToRemove)
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Template name is required.';
    if (formData.applicablePositions.length === 0) {
      newErrors.applicablePositions = 'Please select at least one applicable position.';
    }
    if (formData.columns.length === 0) {
      newErrors.columns = 'A template must have at least one column.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const dataToSave = {
        ...formData,
        columns: formData.columns.map(c => c.key),
        applicablePositions: formData.applicablePositions.map(opt => opt.value),
      };
      onSave(dataToSave, templateData?.id);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-header">
              <h5 className="modal-title">{isEditMode ? 'Edit Schedule Template' : 'Create New Schedule Template'}</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p className="text-muted small">Templates define the structure (columns) for a new schedule.</p>
              <div className="mb-3">
                <label htmlFor="templateName" className="form-label">Template Name*</label>
                <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} id="templateName" name="name" value={formData.name} onChange={handleChange} required />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="templateDescription" className="form-label">Description</label>
                <textarea className="form-control" id="templateDescription" name="description" rows="2" value={formData.description} onChange={handleChange}></textarea>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Template Columns*</label>
                <div className="input-group mb-2">
                  <input type="text" className="form-control" placeholder="Add new column name (e.g. Notes)" value={newColumnName} onChange={(e) => setNewColumnName(e.target.value)} />
                  <button className="btn btn-outline-secondary" type="button" onClick={handleAddColumn}>Add</button>
                </div>
                <div className="d-flex flex-wrap gap-2 border rounded p-2" style={{ minHeight: '40px' }}>
                  <span className="badge d-flex align-items-center bg-light text-dark border">Employee ID</span>
                  <span className="badge d-flex align-items-center bg-light text-dark border">Employee Name</span>
                  <span className="badge d-flex align-items-center bg-light text-dark border">Position</span>

                  {formData.columns.map(col => (
                    <span key={col.key} className="badge d-flex align-items-center bg-secondary">
                      {col.name}
                      {!['start_time', 'end_time', 'ot_hours'].includes(col.key) && (
                        <button type="button" className="btn-close btn-close-white ms-2" style={{fontSize: '0.6em'}} onClick={() => handleRemoveColumn(col.key)}></button>
                      )}
                    </span>
                  ))}
                </div>
                {errors.columns && <div className="invalid-feedback d-block">{errors.columns}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="applicablePositions" className="form-label">Applicable Positions*</label>
                <Select id="applicablePositions" isMulti options={positionOptions} value={formData.applicablePositions} onChange={handlePositionSelectChange} className={`react-select-container ${errors.applicablePositions ? 'is-invalid' : ''}`} classNamePrefix="react-select" />
                 {errors.applicablePositions && <div className="invalid-feedback d-block">{errors.applicablePositions}</div>}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary action-button-primary">{isEditMode ? 'Save Template' : 'Create Template'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplateModal;