import type { ResumeData, SectionConfig, StyleSettings } from '@/types/resume';

/**
 * Exports the resume as PDF using Puppeteer server-side generation
 */
export const exportToPDF = async (
  resumeData: ResumeData,
  sections: SectionConfig[],
  styleSettings: StyleSettings
) => {
  try {
    // Show loading state (you might want to update this with a proper loading indicator)
    console.log('Generating PDF...');

    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeData,
        sections,
        styleSettings
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate PDF');
    }

    // Get the PDF blob
    const pdfBlob = await response.blob();

    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('PDF generated successfully!');
  } catch (error) {
    console.error('PDF export failed:', error);
    alert('Failed to export PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
    
    // Fallback to browser print dialog
    exportToPDFLegacy();
  }
};

/**
 * Fallback method: Opens the browser's print dialog to save the resume as PDF
 */
export const exportToPDFLegacy = () => {
  // Hide elements that shouldn't appear in print
  const elementsToHide = document.querySelectorAll('.no-print');
  const originalDisplay: string[] = [];
  
  elementsToHide.forEach((element, index) => {
    originalDisplay[index] = (element as HTMLElement).style.display;
    (element as HTMLElement).style.display = 'none';
  });

  // Set up print styles
  const originalTitle = document.title;
  document.title = 'Resume - ' + new Date().toISOString().split('T')[0];

  // Trigger print dialog
  window.print();

  // Restore original state
  setTimeout(() => {
    elementsToHide.forEach((element, index) => {
      (element as HTMLElement).style.display = originalDisplay[index];
    });
    document.title = originalTitle;
  }, 100);
};

/**
 * Creates a downloadable PDF using html2canvas and jsPDF (fallback method)
 */
export const exportToAdvancedPDF = async (resumeData: ResumeData) => {
  try {
    // Dynamic import to avoid SSR issues
    const html2canvas = (await import('html2canvas')).default;
    
    const previewElement = document.querySelector('.a4-preview') as HTMLElement;
    if (!previewElement) {
      throw new Error('Resume preview not found');
    }

    // Generate canvas from the preview
    const canvas = await html2canvas(previewElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 816, // A4 width at 96 DPI
      height: 1056, // A4 height at 96 DPI
      allowTaint: true
    });

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `resume-${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');

  } catch (error) {
    console.error('Advanced PDF export failed:', error);
    // Fallback to print dialog
    exportToPDF();
  }
};

/**
 * Prepares the resume for PDF export by optimizing the layout
 */
export const prepareForPDFExport = () => {
  const previewElement = document.querySelector('.a4-preview') as HTMLElement;
  if (previewElement) {
    // Add print-specific classes
    previewElement.classList.add('pdf-export-mode');
    
    // Optimize for print
    previewElement.style.transform = 'none';
    previewElement.style.margin = '0';
    previewElement.style.boxShadow = 'none';
  }
};

/**
 * Cleans up after PDF export
 */
export const cleanupAfterPDFExport = () => {
  const previewElement = document.querySelector('.a4-preview') as HTMLElement;
  if (previewElement) {
    previewElement.classList.remove('pdf-export-mode');
    previewElement.style.transform = '';
    previewElement.style.margin = '';
    previewElement.style.boxShadow = '';
  }
};

/**
 * Server-side PDF generation (placeholder for future implementation)
 */
export const generateServerSidePDF = async (resumeData: ResumeData): Promise<Blob> => {
  // This would be implemented with a server-side endpoint using Puppeteer
  // For now, we'll throw an error to indicate it's not implemented
  throw new Error('Server-side PDF generation not yet implemented');
  
  // Future implementation would look like:
  // const response = await fetch('/api/generate-pdf', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(resumeData)
  // });
  // 
  // if (!response.ok) {
  //   throw new Error('Failed to generate PDF');
  // }
  // 
  // return response.blob();
}; 