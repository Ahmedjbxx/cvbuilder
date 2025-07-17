import { z } from 'zod';

// Personal Details validation
export const personalDetailsSchema = z.object({
  photo: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  headline: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  city: z.string().min(1, 'City is required'),
  optionalFields: z.object({
    dob: z.string().optional(),
    birthplace: z.string().optional(),
    gender: z.string().optional(),
    driverLicense: z.string().optional(),
    nationality: z.string().optional(),
    civilStatus: z.string().optional(),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    custom: z.object({
      label: z.string(),
      value: z.string()
    }).optional()
  })
});

// Education validation
export const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  school: z.string().min(1, 'School is required'),
  start: z.string().min(1, 'Start date is required'),
  end: z.string().optional(),
  ongoing: z.boolean(),
  description: z.string()
});

// Employment validation
export const employmentSchema = z.object({
  position: z.string().min(1, 'Position is required'),
  company: z.string().min(1, 'Company is required'),
  start: z.string().min(1, 'Start date is required'),
  end: z.string().optional(),
  ongoing: z.boolean(),
  description: z.string()
});

// Skill validation
export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Excellent'])
});

// Language validation
export const languageSchema = z.object({
  name: z.string().min(1, 'Language name is required'),
  level: z.enum(['Basic', 'Fluent', 'Native'])
});

// Course validation
export const courseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  startMonth: z.string().min(1, 'Start month is required'),
  startYear: z.string().min(1, 'Start year is required'),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
  ongoing: z.boolean(),
  description: z.string()
});

// Internship validation
export const internshipSchema = z.object({
  position: z.string().min(1, 'Position is required'),
  employer: z.string().min(1, 'Employer is required'),
  city: z.string().min(1, 'City is required'),
  startMonth: z.string().min(1, 'Start month is required'),
  startYear: z.string().min(1, 'Start year is required'),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
  ongoing: z.boolean(),
  description: z.string()
});

// Extracurricular Activity validation
export const extracurricularActivitySchema = z.object({
  position: z.string().min(1, 'Position is required'),
  employer: z.string().min(1, 'Employer is required'),
  city: z.string().min(1, 'City is required'),
  startMonth: z.string().min(1, 'Start month is required'),
  startYear: z.string().min(1, 'Start year is required'),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
  ongoing: z.boolean(),
  description: z.string()
});

// Reference validation
export const referenceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  organization: z.string().min(1, 'Organization is required'),
  city: z.string().min(1, 'City is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email address')
});

// Quality validation
export const qualitySchema = z.object({
  quality: z.string().min(1, 'Quality is required')
});

// Certificate validation
export const certificateSchema = z.object({
  name: z.string().min(1, 'Certificate name is required'),
  startMonth: z.string().min(1, 'Start month is required'),
  startYear: z.string().min(1, 'Start year is required'),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
  ongoing: z.boolean(),
  description: z.string()
});

// Achievement validation
export const achievementSchema = z.object({
  description: z.string().min(1, 'Achievement description is required')
});

// Footer validation
export const footerSchema = z.object({
  description: z.string()
});

// Complete resume data validation
export const resumeDataSchema = z.object({
  personalDetails: personalDetailsSchema,
  profile: z.string(),
  education: z.array(educationSchema),
  employment: z.array(employmentSchema),
  skills: z.array(skillSchema),
  languages: z.array(languageSchema),
  hobbies: z.array(z.string()),
  courses: z.array(courseSchema),
  internships: z.array(internshipSchema),
  extracurricularActivities: z.array(extracurricularActivitySchema),
  references: z.array(referenceSchema),
  qualities: z.array(qualitySchema),
  certificates: z.array(certificateSchema),
  achievements: z.array(achievementSchema),
  footer: footerSchema
});

// Style settings validation
export const styleSettingsSchema = z.object({
  templateId: z.string().min(1, 'Template is required'),
  fontFamily: z.string().min(1, 'Font family is required'),
  fontSize: z.number().min(8).max(24),
  lineHeight: z.number().min(1).max(3),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
});

// Export all validation schemas
export type PersonalDetailsFormData = z.infer<typeof personalDetailsSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type EmploymentFormData = z.infer<typeof employmentSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type LanguageFormData = z.infer<typeof languageSchema>;
export type CourseFormData = z.infer<typeof courseSchema>;
export type InternshipFormData = z.infer<typeof internshipSchema>;
export type ExtracurricularActivityFormData = z.infer<typeof extracurricularActivitySchema>;
export type ReferenceFormData = z.infer<typeof referenceSchema>;
export type QualityFormData = z.infer<typeof qualitySchema>;
export type CertificateFormData = z.infer<typeof certificateSchema>;
export type AchievementFormData = z.infer<typeof achievementSchema>;
export type FooterFormData = z.infer<typeof footerSchema>;
export type ResumeDataFormData = z.infer<typeof resumeDataSchema>;
export type StyleSettingsFormData = z.infer<typeof styleSettingsSchema>; 