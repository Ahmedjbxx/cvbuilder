import type { ResumeData } from '@/types/resume';
import { v4 as uuidv4 } from 'uuid';

/**
 * Downloads a file with the given content and filename
 */
export const downloadFile = (content: string, filename: string, type: string = 'application/json') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exports resume data as JSON file
 */
export const exportResumeAsJSON = (resumeData: ResumeData, filename?: string) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const defaultFilename = `resume-${timestamp}.json`;
  const jsonString = JSON.stringify(resumeData, null, 2);
  downloadFile(jsonString, filename || defaultFilename);
};

/**
 * Validates resume data structure
 */
const validateResumeData = (data: any): data is ResumeData => {
  if (!data || typeof data !== 'object') return false;
  
  // Check required top-level structure
  if (!data.personalDetails || typeof data.personalDetails !== 'object') return false;
  
  // Validate personal details
  const pd = data.personalDetails;
  if (!pd.firstName || !pd.lastName) return false;
  
  // Validate arrays exist (even if empty)
  const requiredArrays = ['education', 'employment', 'skills', 'languages', 'hobbies', 
                         'courses', 'internships', 'extracurricularActivities', 'references', 
                         'qualities', 'certificates', 'achievements'];
  
  for (const arr of requiredArrays) {
    if (!Array.isArray(data[arr])) return false;
  }
  
  // Validate profile and footer
  if (typeof data.profile !== 'string') return false;
  if (!data.footer || typeof data.footer.description !== 'string') return false;
  
  return true;
};

/**
 * Generates missing IDs for imported data
 */
const generateMissingIds = (resumeData: ResumeData): ResumeData => {
  // Ensure optionalFields exists and has proper structure
  const personalDetails = {
    ...resumeData.personalDetails,
    optionalFields: resumeData.personalDetails.optionalFields || {}
  };

  return {
    ...resumeData,
    personalDetails,
    education: resumeData.education.map(item => ({ ...item, id: item.id || uuidv4() })),
    employment: resumeData.employment.map(item => ({ ...item, id: item.id || uuidv4() })),
    skills: resumeData.skills.map(item => ({ ...item, id: item.id || uuidv4() })),
    languages: resumeData.languages.map(item => ({ ...item, id: item.id || uuidv4() })),
    courses: resumeData.courses.map(item => ({ ...item, id: item.id || uuidv4() })),
    internships: resumeData.internships.map(item => ({ ...item, id: item.id || uuidv4() })),
    extracurricularActivities: resumeData.extracurricularActivities.map(item => ({ ...item, id: item.id || uuidv4() })),
    references: resumeData.references.map(item => ({ ...item, id: item.id || uuidv4() })),
    qualities: resumeData.qualities.map(item => ({ ...item, id: item.id || uuidv4() })),
    certificates: resumeData.certificates.map(item => ({ ...item, id: item.id || uuidv4() })),
    achievements: resumeData.achievements.map(item => ({ ...item, id: item.id || uuidv4() }))
  };
};

/**
 * Imports resume data from JSON file with full validation and UI state restoration
 */
export const importResumeFromJSON = (): Promise<{ resumeData: ResumeData; hasOptionalSections: boolean }> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const rawData = JSON.parse(content);
          
          // Comprehensive validation
          if (!validateResumeData(rawData)) {
            throw new Error('Invalid resume data format. Please check the JSON structure.');
          }
          
          // Generate missing IDs for entries
          const resumeData = generateMissingIds(rawData as ResumeData);
          
          // Check if any optional sections have data
          const hasOptionalSections = resumeData.courses.length > 0 || 
                                     resumeData.internships.length > 0 ||
                                     resumeData.extracurricularActivities.length > 0 ||
                                     resumeData.references.length > 0 ||
                                     resumeData.qualities.length > 0 ||
                                     resumeData.certificates.length > 0 ||
                                     resumeData.achievements.length > 0 ||
                                     resumeData.footer.description.trim() !== '';
          
          resolve({ resumeData, hasOptionalSections });
        } catch (error) {
          if (error instanceof SyntaxError) {
            reject(new Error('Invalid JSON file format'));
          } else {
            reject(error);
          }
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  });
};

/**
 * Formats a date string for display
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  } catch {
    return dateString;
  }
};

/**
 * Generates a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Truncates text to a specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

/**
 * Strips HTML tags from text
 */
export const stripHtmlTags = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Converts text to title case
 */
export const toTitleCase = (text: string): string => {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}; 