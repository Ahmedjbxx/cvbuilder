// Core resume data types
export interface PersonalDetails {
  photo?: string;
  firstName: string;
  lastName: string;
  headline?: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  city: string;
  optionalFields: {
    dob?: string;
    birthplace?: string;
    gender?: string;
    driverLicense?: string;
    nationality?: string;
    civilStatus?: string;
    website?: string;
    linkedin?: string;
    custom?: { label: string; value: string };
  };
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  start: string;
  end: string;
  ongoing: boolean;
  description: string;
}

export interface Employment {
  id: string;
  position: string;
  company: string;
  start: string;
  end: string;
  ongoing: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Excellent';
}

export interface Language {
  id: string;
  name: string;
  level: 'Basic' | 'Fluent' | 'Native';
}

export interface Course {
  id: string;
  name: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  ongoing: boolean;
  description: string;
}

export interface Internship {
  id: string;
  position: string;
  employer: string;
  city: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  ongoing: boolean;
  description: string;
}

export interface ExtracurricularActivity {
  id: string;
  position: string;
  employer: string;
  city: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  ongoing: boolean;
  description: string;
}

export interface Reference {
  id: string;
  name: string;
  organization: string;
  city: string;
  phone: string;
  email: string;
}

export interface Quality {
  id: string;
  quality: string;
}

export interface Certificate {
  id: string;
  name: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  ongoing: boolean;
  description: string;
}

export interface Achievement {
  id: string;
  description: string;
}

export interface Footer {
  description: string;
}

// Main resume data structure
export interface ResumeData {
  personalDetails: PersonalDetails;
  profile: string;
  education: Education[];
  employment: Employment[];
  skills: Skill[];
  languages: Language[];
  hobbies: string[];
  courses: Course[];
  internships: Internship[];
  extracurricularActivities: ExtracurricularActivity[];
  references: Reference[];
  qualities: Quality[];
  certificates: Certificate[];
  achievements: Achievement[];
  footer: Footer;
}

// Section configuration for drag and drop
export interface SectionConfig {
  id: string;
  title: string;
  type: SectionType;
  isVisible: boolean;
  isOptional: boolean;
  canRename: boolean;
  hasPageBreak: boolean;
  order: number;
}

export type SectionType = 
  | 'personalDetails'
  | 'profile'
  | 'education'
  | 'employment'
  | 'skills'
  | 'languages'
  | 'hobbies'
  | 'courses'
  | 'internships'
  | 'extracurricularActivities'
  | 'references'
  | 'qualities'
  | 'certificates'
  | 'achievements'
  | 'footer';

// Template and styling types
export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  htmlTemplate: string;
  cssStyles: string;
}

export interface StyleSettings {
  templateId: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  primaryColor: string;
}

// UI State types
export interface UIState {
  selectedTemplate: string;
  styleSettings: StyleSettings;
  activeSections: SectionConfig[];
  draggedSection: string | null;
  isPreviewMode: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
}

// Form state for editing sections
export interface SectionFormState {
  activeSection: SectionType | null;
  editingItemId: string | null;
  isAdding: boolean;
}

// Export types for Zod validation
export type CreateEducation = Omit<Education, 'id'>;
export type CreateEmployment = Omit<Employment, 'id'>;
export type CreateSkill = Omit<Skill, 'id'>;
export type CreateLanguage = Omit<Language, 'id'>;
export type CreateCourse = Omit<Course, 'id'>;
export type CreateInternship = Omit<Internship, 'id'>;
export type CreateExtracurricularActivity = Omit<ExtracurricularActivity, 'id'>;
export type CreateReference = Omit<Reference, 'id'>;
export type CreateQuality = Omit<Quality, 'id'>;
export type CreateCertificate = Omit<Certificate, 'id'>;
export type CreateAchievement = Omit<Achievement, 'id'>; 