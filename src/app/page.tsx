'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FormPanel } from '@/components/FormPanel';
import { PreviewPanel } from '@/components/PreviewPanel';
import { useResumeStore } from '@/store/useResumeStore';
import { exportResumeAsJSON, importResumeFromJSON } from '@/lib/utils';
import { exportToPDF, exportToAdvancedPDF } from '@/lib/pdfExport';
import { useState } from 'react';

export default function HomePage() {
  const { resumeData, uiState, importResumeDataWithUIState, exportResumeData, markClean } = useResumeStore();
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleImport = async () => {
    try {
      setIsImporting(true);
      const { resumeData: importedData, hasOptionalSections } = await importResumeFromJSON();
      importResumeDataWithUIState(importedData, hasOptionalSections);
      markClean();
      
      // More informative success message
      const sectionsMessage = hasOptionalSections 
        ? ' Optional sections with data have been automatically enabled.'
        : '';
      alert(`Resume imported successfully!${sectionsMessage}`);
    } catch (error) {
      alert('Failed to import resume: ' + (error as Error).message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExportJSON = () => {
    try {
      setIsExporting(true);
      exportResumeAsJSON(resumeData);
      markClean();
    } catch (error) {
      alert('Failed to export resume: ' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExportingPDF(true);
      
      // Get visible sections in the correct order
      const visibleSections = uiState.activeSections
        .filter(section => section.isVisible)
        .sort((a, b) => a.order - b.order);
      
      await exportToPDF(resumeData, visibleSections, uiState.styleSettings);
      markClean();
    } catch (error) {
      alert('Failed to export PDF: ' + (error as Error).message);
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 no-print flex-shrink-0">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  CV Builder
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleImport}
                  disabled={isImporting}
                  className="btn-secondary text-sm"
                >
                  {isImporting ? 'Importing...' : 'Import'}
                </button>
                <button 
                  onClick={handleExportJSON}
                  disabled={isExporting}
                  className="btn-secondary text-sm"
                >
                  {isExporting ? 'Exporting...' : 'Export JSON'}
                </button>
                <button 
                  onClick={handleExportPDF}
                  disabled={isExportingPDF}
                  className="btn-primary text-sm"
                >
                  {isExportingPDF ? 'Generating PDF...' : 'Export PDF'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Form Panel */}
          <div className="w-1/2 border-r border-gray-200 bg-white overflow-hidden">
            <FormPanel />
          </div>

          {/* Preview Panel */}
          <div className="w-1/2 bg-gray-50 overflow-hidden">
            <PreviewPanel />
          </div>
        </div>
      </div>
    </DndProvider>
  );
} 