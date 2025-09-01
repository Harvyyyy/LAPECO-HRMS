import jsPDF from 'jspdf';
import logo from '../assets/logo.png';

/**
 * Creates and configures a new jsPDF document instance.
 * @returns {object} An object containing the doc instance, pageWidth, and margin.
 */
export const createPdfDoc = () => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  return { doc, pageWidth, margin };
};

/**
 * Adds a standardized header to the PDF document.
 * @param {jsPDF} doc - The jsPDF instance.
 * @param {string} title - The title of the report.
 * @param {object} metadata - Contains pageWidth and margin.
 * @returns {number} The Y position after the header.
 */
export const addHeader = (doc, title, { pageWidth, margin }) => {
  const generationDate = new Date().toLocaleDateString();
  
  doc.addImage(logo, 'PNG', margin, 20, 80, 26);
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text(title, pageWidth - margin, 40, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Generated on: ${generationDate}`, pageWidth - margin, 55, { align: 'right' });
  doc.setLineWidth(1);
  doc.line(margin, 70, pageWidth - margin, 70);
  
  return 85; // Return the starting Y position for content
};