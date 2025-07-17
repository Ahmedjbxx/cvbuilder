'use client';

import React from 'react';
import type { ResumeData, SectionConfig, Course } from '@/types/resume';

// Helper function to format course date range
const formatCourseDate = (course: Course): string => {
  const monthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const startDate = `${monthOptions.find(m => m.value === course.startMonth)?.label || ''} ${course.startYear}`;
  if (course.ongoing) {
    return `${startDate} - Present`;
  }
  const endDate = course.endMonth && course.endYear 
    ? `${monthOptions.find(m => m.value === course.endMonth)?.label || ''} ${course.endYear}`
    : '';
  return endDate ? `${startDate} - ${endDate}` : startDate;
};

interface TemplateProps {
  data: ResumeData;
  sections: SectionConfig[];
  styleSettings: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    primaryColor: string;
  };
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, sections, styleSettings }) => {
  const visibleSections = sections
    .filter(section => section.isVisible)
    .sort((a, b) => a.order - b.order);

  const renderPersonalDetails = () => (
    <div className="mb-8">
      <style jsx>{`
        .classic-header {
          text-align: center;
          border-bottom: 3px double #6b7280;
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
        }
        .classic-header h1 {
          font-size: 2.2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
          font-family: 'Times New Roman', 'Georgia', serif;
        }
        .classic-header .subtitle {
          font-size: 1.1rem;
          color: #374151;
          font-style: italic;
          margin-bottom: 1rem;
        }
        .contact-info {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.9rem;
          color: #374151;
        }
        .contact-info div {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
      `}</style>
      
      <div className="classic-header">
        <h1>{data.personalDetails.firstName} {data.personalDetails.lastName}</h1>
        {data.personalDetails.headline && (
          <p className="subtitle">{data.personalDetails.headline}</p>
        )}
        <div className="contact-info">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            {data.personalDetails.email}
          </div>
          <div>•</div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            {data.personalDetails.phone}
          </div>
          <div>•</div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            {data.personalDetails.address}, {data.personalDetails.postcode} {data.personalDetails.city}
          </div>
        </div>
        
        {/* Photo positioned separately in classic layout */}
        {data.personalDetails.photo && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <img
              src={data.personalDetails.photo}
              alt="Profile"
              style={{ 
                width: '120px', 
                height: '120px', 
                objectFit: 'cover', 
                border: '2px solid #6b7280',
                display: 'inline-block'
              }}
            />
          </div>
        )}
        
        {/* Optional Fields */}
        <div className="optional-fields mt-3">
          {Object.entries(data.personalDetails.optionalFields).map(([key, value]) => {
            if (!value) return null;
            
            const getFieldIcon = (fieldKey: string) => {
              switch (fieldKey) {
                case 'dob':
                  return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  );
                case 'birthplace':
                  return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  );
                case 'driverLicense':
                  return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                  );
                case 'gender':
                  return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  );
                case 'nationality':
                  return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  );
                case 'civilStatus':
                  return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  );
                case 'website':
                  return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                    </svg>
                  );
                case 'linkedin':
                  return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  );
                default:
                  return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  );
              }
            };

            if (key === 'custom' && typeof value === 'object') {
              return (
                <div key={key} className="text-sm text-gray-700 mt-1 text-center flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                  {value.label}: {value.value}
                </div>
              );
            }

            return (
              <div key={key} className="text-sm text-gray-700 mt-1 text-center flex items-center justify-center gap-1">
                {getFieldIcon(key)}
                {value as string}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSection = (sectionType: string) => {
    const sectionStyles = `
      .classic-section {
        margin-bottom: 1.5rem;
        font-family: 'Times New Roman', 'Georgia', serif;
      }
      .classic-section h2 {
        font-size: 1.1rem;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #374151;
        border-bottom: 1px solid #d1d5db;
        padding-bottom: 0.25rem;
        margin-bottom: 1rem;
      }
      .classic-section h3 {
        font-weight: bold;
        color: #1f2937;
        margin-bottom: 0.25rem;
      }
      .classic-section .entry {
        margin-bottom: 1.25rem;
        line-height: 1.6;
      }
      .classic-section .entry-header {
        margin-bottom: 0.5rem;
      }
      .classic-section .entry-date {
        font-size: 0.9rem;
        color: #6b7280;
        font-style: italic;
        float: right;
      }
      .classic-section .company {
        color: #374151;
        font-weight: 500;
      }
      .classic-section .skills-list {
        display: block;
        margin: 0;
        padding: 0;
      }
      .classic-section .skill-item {
        display: inline;
        margin-right: 1rem;
        color: #374151;
      }
      .classic-section .skill-item:after {
        content: " • ";
        color: #9ca3af;
      }
      .classic-section .skill-item:last-child:after {
        content: "";
      }
    `;

    switch (sectionType) {
      case 'personalDetails':
        return renderPersonalDetails();
      
      case 'profile':
        return data.profile ? (
          <div className="classic-section">
            <style jsx>{sectionStyles}</style>
            <h2>Professional Summary</h2>
            <div dangerouslySetInnerHTML={{ __html: data.profile }} />
          </div>
        ) : null;
      
      case 'education':
        return data.education.length > 0 ? (
          <div className="classic-section">
            <style jsx>{sectionStyles}</style>
            <h2>Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="entry">
                <div className="entry-header">
                  <span className="entry-date">
                    {edu.start} - {edu.ongoing ? 'Present' : edu.end}
                  </span>
                  <h3>{edu.degree}</h3>
                  <p className="company">{edu.school}</p>
                </div>
                {edu.description && (
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: edu.description }} />
                )}
              </div>
            ))}
          </div>
        ) : null;
      
      case 'employment':
        return data.employment.length > 0 ? (
          <div className="classic-section">
            <style jsx>{sectionStyles}</style>
            <h2>Professional Experience</h2>
            {data.employment.map((emp) => (
              <div key={emp.id} className="entry">
                <div className="entry-header">
                  <span className="entry-date">
                    {emp.start} - {emp.ongoing ? 'Present' : emp.end}
                  </span>
                  <h3>{emp.position}</h3>
                  <p className="company">{emp.company}</p>
                </div>
                {emp.description && (
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: emp.description }} />
                )}
              </div>
            ))}
          </div>
        ) : null;
      
      case 'skills':
        return data.skills.length > 0 ? (
          <div className="classic-section">
            <style jsx>{sectionStyles}</style>
            <h2>Skills & Competencies</h2>
            <div className="skills-list">
              {data.skills.map((skill) => (
                <span key={skill.id} className="skill-item">
                  {skill.name} ({skill.level})
                </span>
              ))}
            </div>
          </div>
        ) : null;
      
      case 'languages':
        return data.languages.length > 0 ? (
          <div className="classic-section">
            <style jsx>{sectionStyles}</style>
            <h2>Languages</h2>
            <div className="skills-list">
              {data.languages.map((language) => (
                <span key={language.id} className="skill-item">
                  {language.name} ({language.level})
                </span>
              ))}
            </div>
          </div>
        ) : null;
      
      case 'hobbies':
        return data.hobbies.length > 0 ? (
          <div className="classic-section">
            <style jsx>{sectionStyles}</style>
            <h2>Personal Interests</h2>
            <div className="skills-list">
              {data.hobbies.map((hobby, index) => (
                <span key={index} className="skill-item">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        ) : null;

      case 'achievements':
        return data.achievements.length > 0 ? (
          <div className="classic-section">
            <style jsx>{sectionStyles}</style>
            <h2>Achievements</h2>
            {data.achievements.map((achievement) => (
              <div key={achievement.id} className="entry">
                <div dangerouslySetInnerHTML={{ __html: achievement.description }} />
              </div>
            ))}
          </div>
        ) : null;

      case 'certificates':
        return data.certificates.length > 0 ? (
          <div className="classic-section">
            <style jsx>{sectionStyles}</style>
            <h2>Certifications</h2>
            {data.certificates.map((cert) => (
              <div key={cert.id} className="entry">
                <div className="entry-header">
                  <span className="entry-date">{cert.date}</span>
                  <h3>{cert.name}</h3>
                  <p className="company">{cert.issuer}</p>
                </div>
                {cert.description && (
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: cert.description }} />
                )}
              </div>
            ))}
          </div>
        ) : null;

      case 'courses':
        return data.courses.length > 0 ? (
          <div className="classic-section">
            <style jsx>{sectionStyles}</style>
            <h2>Courses</h2>
            {data.courses.map((course) => (
              <div key={course.id} className="entry">
                <div className="entry-header">
                  <span className="entry-date">{formatCourseDate(course)}</span>
                  <h3>{course.name}</h3>
                  <p className="company">{course.institution}</p>
                </div>
                {course.description && (
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: course.description }} />
                )}
              </div>
            ))}
          </div>
        ) : null;

      case 'internships':
        return data.internships.length > 0 ? (
          <div className="classic-section">
            <style jsx>{sectionStyles}</style>
            <h2>Internships</h2>
            {data.internships.map((internship) => (
              <div key={internship.id} className="entry">
                <div className="entry-header">
                  <span className="entry-date">
                    {internship.start} - {internship.ongoing ? 'Present' : internship.end}
                  </span>
                  <h3>{internship.position}</h3>
                  <p className="company">{internship.company}</p>
                </div>
                {internship.description && (
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: internship.description }} />
                )}
              </div>
            ))}
          </div>
        ) : null;

      case 'qualities':
        return data.qualities.length > 0 ? (
          <div className="classic-section">
            <style jsx>{sectionStyles}</style>
            <h2>Personal Qualities</h2>
            <div className="skills-list">
              {data.qualities.map((quality) => (
                <span key={quality.id} className="skill-item">
                  {quality.quality}
                </span>
              ))}
            </div>
          </div>
        ) : null;

      case 'references':
        return data.references.length > 0 ? (
          <div className="classic-section">
            <style jsx>{sectionStyles}</style>
            <h2>References</h2>
            {data.references.map((reference) => (
              <div key={reference.id} className="entry">
                <h3>{reference.name}</h3>
                <p className="company">{reference.company}</p>
                <p className="text-sm text-gray-600">{reference.position}</p>
                <div className="text-sm mt-1">
                  <div>Email: {reference.email}</div>
                  <div>Phone: {reference.phone}</div>
                </div>
              </div>
            ))}
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div 
      style={{
        fontFamily: "'Times New Roman', 'Georgia', serif",
        fontSize: `${styleSettings.fontSize}px`,
        lineHeight: styleSettings.lineHeight,
      }}
    >
      {visibleSections.map((section) => (
        <div key={section.id}>
          {renderSection(section.type)}
          {section.hasPageBreak && (
            <div style={{ pageBreakBefore: 'always', height: '1px' }} />
          )}
        </div>
      ))}
    </div>
  );
};