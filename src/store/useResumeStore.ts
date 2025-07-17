import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  ResumeData,
  UIState,
  SectionConfig,
  SectionType,
  StyleSettings,
  SectionFormState,
  PersonalDetails,
  Education,
  Employment,
  Skill,
  Language,
  Course,
  Internship,
  ExtracurricularActivity,
  Reference,
  Quality,
  Certificate,
  Achievement,
} from '@/types/resume';

// Default resume data
const defaultPersonalDetails: PersonalDetails = {
  firstName: '',
  lastName: '',
  headline: '',
  email: '',
  phone: '',
  address: '',
  postcode: '',
  city: '',
  optionalFields: {}
};

const defaultResumeData: ResumeData = {
  personalDetails: defaultPersonalDetails,
  profile: '',
  education: [],
  employment: [],
  skills: [],
  languages: [],
  hobbies: [],
  courses: [],
  internships: [],
  extracurricularActivities: [],
  references: [],
  qualities: [],
  certificates: [],
  achievements: [],
  footer: { description: '' }
};

// Default section configurations
const defaultSections: SectionConfig[] = [
  { id: 'personalDetails', title: 'Personal Details', type: 'personalDetails', isVisible: true, isOptional: false, canRename: false, hasPageBreak: false, order: 0 },
  { id: 'profile', title: 'Profile', type: 'profile', isVisible: true, isOptional: false, canRename: true, hasPageBreak: false, order: 1 },
  { id: 'education', title: 'Education', type: 'education', isVisible: true, isOptional: false, canRename: true, hasPageBreak: false, order: 2 },
  { id: 'employment', title: 'Employment', type: 'employment', isVisible: true, isOptional: false, canRename: true, hasPageBreak: false, order: 3 },
  { id: 'skills', title: 'Skills', type: 'skills', isVisible: true, isOptional: false, canRename: true, hasPageBreak: false, order: 4 },
  { id: 'languages', title: 'Languages', type: 'languages', isVisible: true, isOptional: false, canRename: true, hasPageBreak: false, order: 5 },
  { id: 'hobbies', title: 'Hobbies', type: 'hobbies', isVisible: true, isOptional: false, canRename: true, hasPageBreak: false, order: 6 },
  { id: 'courses', title: 'Courses', type: 'courses', isVisible: false, isOptional: true, canRename: true, hasPageBreak: false, order: 7 },
  { id: 'internships', title: 'Internships', type: 'internships', isVisible: false, isOptional: true, canRename: true, hasPageBreak: false, order: 8 },
  { id: 'extracurricularActivities', title: 'Extracurricular Activities', type: 'extracurricularActivities', isVisible: false, isOptional: true, canRename: true, hasPageBreak: false, order: 9 },
  { id: 'references', title: 'References', type: 'references', isVisible: false, isOptional: true, canRename: true, hasPageBreak: false, order: 10 },
  { id: 'qualities', title: 'Qualities', type: 'qualities', isVisible: false, isOptional: true, canRename: true, hasPageBreak: false, order: 11 },
  { id: 'certificates', title: 'Certificates', type: 'certificates', isVisible: false, isOptional: true, canRename: true, hasPageBreak: false, order: 12 },
  { id: 'achievements', title: 'Achievements', type: 'achievements', isVisible: false, isOptional: true, canRename: true, hasPageBreak: false, order: 13 },
  { id: 'footer', title: 'Footer', type: 'footer', isVisible: false, isOptional: true, canRename: true, hasPageBreak: false, order: 14 }
];

const defaultStyleSettings: StyleSettings = {
  templateId: 'modern',
  fontFamily: 'Inter',
  fontSize: 12,
  lineHeight: 1.5,
  primaryColor: '#2563eb'
};

const defaultUIState: UIState = {
  selectedTemplate: 'modern',
  styleSettings: defaultStyleSettings,
  activeSections: defaultSections,
  draggedSection: null,
  isPreviewMode: false,
  isDirty: false,
  lastSaved: null
};

const defaultFormState: SectionFormState = {
  activeSection: null,
  editingItemId: null,
  isAdding: false
};

interface ResumeStore {
  // State
  resumeData: ResumeData;
  uiState: UIState;
  formState: SectionFormState;

  // Personal Details Actions
  updatePersonalDetails: (data: Partial<PersonalDetails>) => void;

  // Profile Actions
  updateProfile: (profile: string) => void;

  // Education Actions
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  deleteEducation: (id: string) => void;

  // Employment Actions
  addEmployment: (employment: Omit<Employment, 'id'>) => void;
  updateEmployment: (id: string, employment: Partial<Employment>) => void;
  deleteEmployment: (id: string) => void;

  // Skills Actions
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;

  // Languages Actions
  addLanguage: (language: Omit<Language, 'id'>) => void;
  updateLanguage: (id: string, language: Partial<Language>) => void;
  deleteLanguage: (id: string) => void;

  // Hobbies Actions
  addHobby: (hobby: string) => void;
  updateHobby: (index: number, hobby: string) => void;
  deleteHobby: (index: number) => void;

  // Optional Sections Actions
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  addInternship: (internship: Omit<Internship, 'id'>) => void;
  updateInternship: (id: string, internship: Partial<Internship>) => void;
  deleteInternship: (id: string) => void;

  addExtracurricularActivity: (activity: Omit<ExtracurricularActivity, 'id'>) => void;
  updateExtracurricularActivity: (id: string, activity: Partial<ExtracurricularActivity>) => void;
  deleteExtracurricularActivity: (id: string) => void;

  addReference: (reference: Omit<Reference, 'id'>) => void;
  updateReference: (id: string, reference: Partial<Reference>) => void;
  deleteReference: (id: string) => void;

  addQuality: (quality: Omit<Quality, 'id'>) => void;
  updateQuality: (id: string, quality: Partial<Quality>) => void;
  deleteQuality: (id: string) => void;

  addCertificate: (certificate: Omit<Certificate, 'id'>) => void;
  updateCertificate: (id: string, certificate: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;

  addAchievement: (achievement: Omit<Achievement, 'id'>) => void;
  updateAchievement: (id: string, achievement: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;

  updateFooter: (description: string) => void;

  // Section Management Actions
  toggleSection: (sectionType: SectionType) => void;
  removeSection: (sectionType: SectionType) => void;
  reorderSections: (sections: SectionConfig[]) => void;
  renameSection: (sectionId: string, title: string) => void;
  togglePageBreak: (sectionId: string) => void;

  // Style Actions
  updateStyleSettings: (settings: Partial<StyleSettings>) => void;
  setTemplate: (templateId: string) => void;

  // UI Actions
  setPreviewMode: (isPreview: boolean) => void;
  setDraggedSection: (sectionId: string | null) => void;

  // Form State Actions
  setActiveSection: (section: SectionType | null) => void;
  setEditingItem: (itemId: string | null) => void;
  setIsAdding: (isAdding: boolean) => void;

  // Data Management Actions
  importResumeData: (data: ResumeData) => void;
  importResumeDataWithUIState: (data: ResumeData, hasOptionalSections: boolean) => void;
  exportResumeData: () => ResumeData;
  resetResume: () => void;
  markClean: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      resumeData: defaultResumeData,
      uiState: defaultUIState,
      formState: defaultFormState,

      // Personal Details Actions
      updatePersonalDetails: (data) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            personalDetails: { ...state.resumeData.personalDetails, ...data }
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      // Profile Actions
      updateProfile: (profile) =>
        set((state) => ({
          resumeData: { ...state.resumeData, profile },
          uiState: { ...state.uiState, isDirty: true }
        })),

      // Education Actions
      addEducation: (education) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: [...state.resumeData.education, { ...education, id: uuidv4() }]
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      updateEducation: (id, education) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: state.resumeData.education.map((item) =>
              item.id === id ? { ...item, ...education } : item
            )
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      deleteEducation: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: state.resumeData.education.filter((item) => item.id !== id)
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      // Employment Actions
      addEmployment: (employment) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            employment: [...state.resumeData.employment, { ...employment, id: uuidv4() }]
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      updateEmployment: (id, employment) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            employment: state.resumeData.employment.map((item) =>
              item.id === id ? { ...item, ...employment } : item
            )
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      deleteEmployment: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            employment: state.resumeData.employment.filter((item) => item.id !== id)
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      // Skills Actions
      addSkill: (skill) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: [...state.resumeData.skills, { ...skill, id: uuidv4() }]
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      updateSkill: (id, skill) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.map((item) =>
              item.id === id ? { ...item, ...skill } : item
            )
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      deleteSkill: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.filter((item) => item.id !== id)
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      // Languages Actions
      addLanguage: (language) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            languages: [...state.resumeData.languages, { ...language, id: uuidv4() }]
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      updateLanguage: (id, language) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            languages: state.resumeData.languages.map((item) =>
              item.id === id ? { ...item, ...language } : item
            )
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      deleteLanguage: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            languages: state.resumeData.languages.filter((item) => item.id !== id)
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      // Hobbies Actions
      addHobby: (hobby) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            hobbies: [...state.resumeData.hobbies, hobby]
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      updateHobby: (index, hobby) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            hobbies: state.resumeData.hobbies.map((item, i) => (i === index ? hobby : item))
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      deleteHobby: (index) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            hobbies: state.resumeData.hobbies.filter((_, i) => i !== index)
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      // Optional Sections Actions
      addCourse: (course) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            courses: [...state.resumeData.courses, { ...course, id: uuidv4() }]
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      updateCourse: (id, course) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            courses: state.resumeData.courses.map((item) =>
              item.id === id ? { ...item, ...course } : item
            )
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      deleteCourse: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            courses: state.resumeData.courses.filter((item) => item.id !== id)
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      addInternship: (internship) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            internships: [...state.resumeData.internships, { ...internship, id: uuidv4() }]
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      updateInternship: (id, internship) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            internships: state.resumeData.internships.map((item) =>
              item.id === id ? { ...item, ...internship } : item
            )
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      deleteInternship: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            internships: state.resumeData.internships.filter((item) => item.id !== id)
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      addExtracurricularActivity: (activity) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            extracurricularActivities: [
              ...state.resumeData.extracurricularActivities,
              { ...activity, id: uuidv4() }
            ]
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      updateExtracurricularActivity: (id, activity) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            extracurricularActivities: state.resumeData.extracurricularActivities.map((item) =>
              item.id === id ? { ...item, ...activity } : item
            )
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      deleteExtracurricularActivity: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            extracurricularActivities: state.resumeData.extracurricularActivities.filter(
              (item) => item.id !== id
            )
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      addReference: (reference) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            references: [...state.resumeData.references, { ...reference, id: uuidv4() }]
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      updateReference: (id, reference) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            references: state.resumeData.references.map((item) =>
              item.id === id ? { ...item, ...reference } : item
            )
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      deleteReference: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            references: state.resumeData.references.filter((item) => item.id !== id)
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      addQuality: (quality) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            qualities: [...state.resumeData.qualities, { ...quality, id: uuidv4() }]
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      updateQuality: (id, quality) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            qualities: state.resumeData.qualities.map((item) =>
              item.id === id ? { ...item, ...quality } : item
            )
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      deleteQuality: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            qualities: state.resumeData.qualities.filter((item) => item.id !== id)
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      addCertificate: (certificate) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            certificates: [...state.resumeData.certificates, { ...certificate, id: uuidv4() }]
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      updateCertificate: (id, certificate) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            certificates: state.resumeData.certificates.map((item) =>
              item.id === id ? { ...item, ...certificate } : item
            )
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      deleteCertificate: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            certificates: state.resumeData.certificates.filter((item) => item.id !== id)
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      addAchievement: (achievement) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            achievements: [...state.resumeData.achievements, { ...achievement, id: uuidv4() }]
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      updateAchievement: (id, achievement) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            achievements: state.resumeData.achievements.map((item) =>
              item.id === id ? { ...item, ...achievement } : item
            )
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      deleteAchievement: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            achievements: state.resumeData.achievements.filter((item) => item.id !== id)
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      updateFooter: (description) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            footer: { description }
          },
          uiState: { ...state.uiState, isDirty: true }
        })),

      // Section Management Actions
      toggleSection: (sectionType) =>
        set((state) => ({
          uiState: {
            ...state.uiState,
            activeSections: state.uiState.activeSections.map((section) =>
              section.type === sectionType
                ? { ...section, isVisible: !section.isVisible }
                : section
            ),
            isDirty: true
          }
        })),

      removeSection: (sectionType) =>
        set((state) => ({
          uiState: {
            ...state.uiState,
            activeSections: state.uiState.activeSections.map((section) =>
              section.type === sectionType
                ? { ...section, isVisible: false }
                : section
            ),
            isDirty: true
          }
        })),

      reorderSections: (sections) =>
        set((state) => ({
          uiState: {
            ...state.uiState,
            activeSections: sections.map((section, index) => ({ ...section, order: index })),
            isDirty: true
          }
        })),

      renameSection: (sectionId, title) =>
        set((state) => ({
          uiState: {
            ...state.uiState,
            activeSections: state.uiState.activeSections.map((section) =>
              section.id === sectionId ? { ...section, title } : section
            ),
            isDirty: true
          }
        })),

      togglePageBreak: (sectionId) =>
        set((state) => ({
          uiState: {
            ...state.uiState,
            activeSections: state.uiState.activeSections.map((section) =>
              section.id === sectionId
                ? { ...section, hasPageBreak: !section.hasPageBreak }
                : section
            ),
            isDirty: true
          }
        })),

      // Style Actions
      updateStyleSettings: (settings) =>
        set((state) => ({
          uiState: {
            ...state.uiState,
            styleSettings: { ...state.uiState.styleSettings, ...settings },
            isDirty: true
          }
        })),

      setTemplate: (templateId) =>
        set((state) => ({
          uiState: {
            ...state.uiState,
            selectedTemplate: templateId,
            styleSettings: { ...state.uiState.styleSettings, templateId },
            isDirty: true
          }
        })),

      // UI Actions
      setPreviewMode: (isPreview) =>
        set((state) => ({
          uiState: { ...state.uiState, isPreviewMode: isPreview }
        })),

      setDraggedSection: (sectionId) =>
        set((state) => ({
          uiState: { ...state.uiState, draggedSection: sectionId }
        })),

      // Form State Actions
      setActiveSection: (section) =>
        set((state) => ({
          formState: { ...state.formState, activeSection: section }
        })),

      setEditingItem: (itemId) =>
        set((state) => ({
          formState: { ...state.formState, editingItemId: itemId }
        })),

      setIsAdding: (isAdding) =>
        set((state) => ({
          formState: { ...state.formState, isAdding }
        })),

      // Data Management Actions
      importResumeData: (data) =>
        set(() => ({
          resumeData: data,
          uiState: { ...defaultUIState, isDirty: true }
        })),

      importResumeDataWithUIState: (data, hasOptionalSections) =>
        set((state) => {
          // Create a new sections array with proper visibility
          const newSections = defaultSections.map(section => {
            // Core sections remain visible
            if (!section.isOptional) {
              return { ...section, isVisible: true };
            }
            
            // Optional sections become visible if they have data
            let hasData = false;
            switch (section.type) {
              case 'courses':
                hasData = data.courses.length > 0;
                break;
              case 'internships':
                hasData = data.internships.length > 0;
                break;
              case 'extracurricularActivities':
                hasData = data.extracurricularActivities.length > 0;
                break;
              case 'references':
                hasData = data.references.length > 0;
                break;
              case 'qualities':
                hasData = data.qualities.length > 0;
                break;
              case 'certificates':
                hasData = data.certificates.length > 0;
                break;
              case 'achievements':
                hasData = data.achievements.length > 0;
                break;
              case 'footer':
                hasData = data.footer.description.trim() !== '';
                break;
              default:
                hasData = false;
            }
            
            return { ...section, isVisible: hasData };
          });

          return {
            resumeData: data,
            uiState: {
              ...defaultUIState,
              activeSections: newSections,
              isDirty: true
            }
          };
        }),

      exportResumeData: () => get().resumeData,

      resetResume: () =>
        set(() => ({
          resumeData: defaultResumeData,
          uiState: defaultUIState,
          formState: defaultFormState
        })),

      markClean: () =>
        set((state) => ({
          uiState: {
            ...state.uiState,
            isDirty: false,
            lastSaved: new Date()
          }
        }))
    }),
    {
      name: 'cv-builder-storage',
      partialize: (state) => ({
        resumeData: state.resumeData,
        uiState: {
          ...state.uiState,
          draggedSection: null, // Don't persist drag state
          isPreviewMode: false // Reset preview mode on load
        }
      })
    }
  )
); 