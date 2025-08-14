import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { generatePagibigData, generatePhilhealthData, generateSssData } from '../../../hooks/contributionUtils';
import PagibigTab from './PagibigTab';
import PhilhealthTab from './PhilhealthTab';
import SssTab from './SssTab';
import AddColumnModal from './AddColumnModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import './ContributionsManagement.css';

const ContributionsManagementPage = ({ employees, positions }) => {
  const [activeTab, setActiveTab] = useState('pagibig');
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [reportTitle, setReportTitle] = useState('');
  const [headerData, setHeaderData] = useState({});
  const [editingHeaderKey, setEditingHeaderKey] = useState(null);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [confirmationModalState, setConfirmationModalState] = useState({
    isOpen: false,
    title: '',
    body: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    let data;
    if (activeTab === 'pagibig') {
      data = generatePagibigData(employees, positions);
    } else if (activeTab === 'philhealth') {
      data = generatePhilhealthData(employees, positions);
    } else if (activeTab === 'sss') {
      data = generateSssData(employees, positions);
    }
    setColumns(data.columns);
    setRows(data.rows);
    setReportTitle(data.title);
    setHeaderData(data.headerData);
  }, [activeTab, employees, positions]);

  const handleCellChange = (rowIndex, columnKey, value) => {
    const newRows = [...rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [columnKey]: value };
    setRows(newRows);
  };
  
  const handleAddColumn = (columnName) => {
    const newColumnKey = columnName.trim().toLowerCase().replace(/\s+/g, '_') + `_${Date.now()}`;
    if (columns.some(c => c.key === newColumnKey)) {
        alert('A column with this name already exists.');
        return;
    }
    setColumns([...columns, { key: newColumnKey, label: columnName, editable: true, isPermanent: false }]);
    setRows(rows.map(row => ({ ...row, [newColumnKey]: '' })));
  };

  const handleDeleteColumn = (keyToDelete) => {
    setConfirmationModalState({
        isOpen: true,
        title: 'Delete Column',
        body: `Are you sure you want to permanently delete the "${columns.find(c => c.key === keyToDelete)?.label}" column and all of its data?`,
        onConfirm: () => {
            setColumns(prev => prev.filter(col => col.key !== keyToDelete));
            setRows(prevRows => prevRows.map(row => {
                const newRow = { ...row };
                delete newRow[keyToDelete];
                return newRow;
            }));
            closeConfirmationModal();
        }
    });
  };

  const handleAddRow = () => {
    const newRow = columns.reduce((acc, col) => {
      acc[col.key] = '';
      return acc;
    }, {});
    setRows([...rows, newRow]);
  };
  
  const handleDeleteRow = (rowIndex) => {
    const rowToDelete = rows[rowIndex];
    const employeeName = `${rowToDelete.firstName} ${rowToDelete.lastName}`.trim() || `Row ${rowIndex + 1}`;
    setConfirmationModalState({
        isOpen: true,
        title: 'Delete Row',
        body: `Are you sure you want to permanently delete the row for ${employeeName}?`,
        onConfirm: () => {
            setRows(prev => prev.filter((_, index) => index !== rowIndex));
            closeConfirmationModal();
        }
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModalState({ isOpen: false, title: '', body: '', onConfirm: () => {} });
  };

  const handleHeaderClick = (key) => {
    setEditingHeaderKey(key);
  };
  
  const handleColumnHeaderChange = (columnKey, newLabel) => {
    setColumns(currentColumns =>
      currentColumns.map(col =>
        col.key === columnKey ? { ...col, label: newLabel } : col
      )
    );
  };

  const handleExport = () => {
    const dataForExport = rows.map(row => {
      const newRow = {};
      columns.forEach(col => {
        newRow[col.label] = row[col.key];
      });
      return newRow;
    });
    const ws = XLSX.utils.json_to_sheet([]);
    const headerRows = Object.entries(headerData).map(([key, value]) => [key, value]);
    if (headerRows.length > 0) {
      XLSX.utils.sheet_add_aoa(ws, headerRows, { origin: 'A1' });
    }
    const tableOrigin = headerRows.length > 0 ? headerRows.length + 2 : 0;
    XLSX.utils.sheet_add_json(ws, dataForExport, { origin: `A${tableOrigin}` });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, reportTitle);
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, `${reportTitle.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM')}.xlsx`);
  };

  const renderTabContent = () => {
    const commonProps = {
      columns,
      rows,
      reportTitle,
      editingHeaderKey,
      onCellChange: handleCellChange,
      onAddColumn: () => setShowAddColumnModal(true),
      onDeleteColumn: handleDeleteColumn,
      onExport: handleExport,
      onAddRow: handleAddRow,
      onDeleteRow: handleDeleteRow,
      onHeaderChange: handleColumnHeaderChange,
      onHeaderClick: handleHeaderClick,
    };
    switch (activeTab) {
      case 'pagibig': return <PagibigTab {...commonProps} />;
      case 'philhealth': return <PhilhealthTab {...commonProps} />;
      case 'sss': return <SssTab {...commonProps} />;
      default: return null;
    }
  };

  return (
    <div className="container-fluid p-0 page-module-container">
      <header className="page-header mb-4">
        <h1 className="page-main-title">Contributions Management</h1>
        <p className="text-muted">Generate and export monthly contribution reports for government agencies.</p>
      </header>

      <div className="card">
        <div className="card-header contributions-nav-tabs-container">
          <ul className="nav nav-tabs card-header-tabs contributions-nav-tabs">
            <li className="nav-item"><button className={`nav-link ${activeTab === 'pagibig' ? 'active' : ''}`} onClick={() => setActiveTab('pagibig')}>Pag-IBIG</button></li>
            <li className="nav-item"><button className={`nav-link ${activeTab === 'philhealth' ? 'active' : ''}`} onClick={() => setActiveTab('philhealth')}>PhilHealth</button></li>
            <li className="nav-item"><button className={`nav-link ${activeTab === 'sss' ? 'active' : ''}`} onClick={() => setActiveTab('sss')}>SSS</button></li>
          </ul>
        </div>
        <div className="card-body">
          {renderTabContent()}
        </div>
      </div>
      
      <AddColumnModal 
        show={showAddColumnModal}
        onClose={() => setShowAddColumnModal(false)}
        onAdd={handleAddColumn}
      />

      <ConfirmationModal
        show={confirmationModalState.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={confirmationModalState.onConfirm}
        title={confirmationModalState.title}
        confirmText="Yes, Delete"
        confirmVariant="danger"
      >
        <p>{confirmationModalState.body}</p>
      </ConfirmationModal>
    </div>
  );
};

export default ContributionsManagementPage;