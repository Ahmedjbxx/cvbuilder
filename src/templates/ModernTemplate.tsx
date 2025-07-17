'use client';

import React from 'react';
import type { ResumeData, SectionConfig } from '@/types/resume';

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

export const ModernTemplate: React.FC<TemplateProps> = ({ data, sections, styleSettings }) => {
  const visibleSections = sections
    .filter(section => section.isVisible)
    .sort((a, b) => a.order - b.order);

  const renderPersonalDetails = () => (
    <div className="mb-8">
      <style jsx>{`
        .modern-header h1 {
          font-size: 2rem;
          font-weight: bold;
          color: ${styleSettings.primaryColor};
          margin-bottom: 0.5rem;
        }
        .modern-header .subtitle {
          font-size: 1.1rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #374151;
        }
        .contact-grid svg {
          color: ${styleSettings.primaryColor};
        }
        .optional-fields svg {
          color: ${styleSettings.primaryColor};
        }
      `}</style>
      
      <div className="modern-header flex items-start gap-6">
        {data.personalDetails.photo && (
          <img
            src={data.personalDetails.photo}
            alt="Profile"
            className="w-24 h-24 object-cover rounded-lg shadow-md"
          />
        )}
        <div className="flex-1">
          <h1>{data.personalDetails.firstName} {data.personalDetails.lastName}</h1>
          {data.personalDetails.headline && (
            <p className="subtitle">{data.personalDetails.headline}</p>
          )}
          <div className="contact-grid">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {data.personalDetails.email}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {data.personalDetails.phone}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {data.personalDetails.address}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {data.personalDetails.postcode} {data.personalDetails.city}
            </div>
          </div>
          
          {/* Optional Fields */}
          <div className="optional-fields grid grid-cols-2 gap-1 mt-2 text-sm text-gray-700">
            {Object.entries(data.personalDetails.optionalFields).map(([key, value]) => {
              if (!value) return null;
              
              const getFieldIcon = (fieldKey: string) => {
                switch (fieldKey) {
                  case 'dob':
                    return (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    );
                  case 'birthplace':
                    return (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    );
                  case 'driverLicense':
                    return (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 8l-4 4-4-4m4-4v12M3 15a9 9 0 1118 0" />
                      </svg>
                    );
                  case 'gender':
                    return (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    );
                  case 'nationality':
                    return (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                    );
                  case 'civilStatus':
                    return (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    );
                  case 'website':
                    return (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    );
                  case 'linkedin':
                    return (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V8a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2z" />
                      </svg>
                    );
                  default:
                    return (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    );
                }
              };

              if (key === 'custom' && typeof value === 'object') {
                return (
                  <div key={key} className="col-span-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {value.label}: {value.value}
                  </div>
                );
              }

              return (
                <div key={key} className="flex items-center gap-2">
                  {getFieldIcon(key)}
                  {value as string}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = (sectionType: string) => {
    const sectionStyles = `
      .modern-section h2 {
        font-size: 1.25rem;
        font-weight: 600;
        color: ${styleSettings.primaryColor};
        border-bottom: 2px solid ${styleSettings.primaryColor};
        padding-bottom: 0.25rem;
        margin-bottom: 1rem;
      }
      .modern-section h3 {
        font-weight: 600;
        color: #1f2937;
      }
      .modern-section .entry {
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid #f3f4f6;
      }
      .modern-section .entry:last-child {
        border-bottom: none;
      }
      .modern-section .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 0.5rem;
      }
      .modern-section .entry-date {
        font-size: 0.875rem;
        color: #6b7280;
      }
      .modern-section .tag {
        display: inline-block;
        background: ${styleSettings.primaryColor};
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.875rem;
        margin: 0.125rem;
      }
    `;

    switch (sectionType) {
      case 'personalDetails':
        return renderPersonalDetails();
      
      case 'profile':
        return data.profile ? (
          <div className="modern-section mb-6">
            <style jsx>{sectionStyles}</style>
            <h2>Profile</h2>
            <div dangerouslySetInnerHTML={{ __html: data.profile }} />
          </div>
        ) : null;
      
      case 'education':
        return data.education.length > 0 ? (
          <div className="modern-section mb-6">
            <style jsx>{sectionStyles}</style>
            <h2>Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="entry">
                <div className="entry-header">
                  <div>
                    <h3>{edu.degree}</h3>
                    <p className="text-gray-700">{edu.school}</p>
                  </div>
                  <span className="entry-date">
                    {edu.start} - {edu.ongoing ? 'Present' : edu.end}
                  </span>
                </div>
                {edu.description && (
                  <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: edu.description }} />
                )}
              </div>
            ))}
          </div>
        ) : null;
      
      case 'employment':
        return data.employment.length > 0 ? (
          <div className="modern-section mb-6">
            <style jsx>{sectionStyles}</style>
            <h2>Experience</h2>
            {data.employment.map((emp) => (
              <div key={emp.id} className="entry">
                <div className="entry-header">
                  <div>
                    <h3>{emp.position}</h3>
                    <p className="text-gray-700">{emp.company}</p>
                  </div>
                  <span className="entry-date">
                    {emp.start} - {emp.ongoing ? 'Present' : emp.end}
                  </span>
                </div>
                {emp.description && (
                  <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: emp.description }} />
                )}
              </div>
            ))}
          </div>
        ) : null;
      
      case 'skills':
        return data.skills.length > 0 ? (
          <div className="modern-section mb-6">
            <style jsx>{sectionStyles}</style>
            <h2>Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span key={skill.id} className="tag">
                  {skill.name} • {skill.level}
                </span>
              ))}
            </div>
          </div>
        ) : null;
      
      case 'languages':
        return data.languages.length > 0 ? (
          <div className="modern-section mb-6">
            <style jsx>{sectionStyles}</style>
            <h2>Languages</h2>
            <div className="flex flex-wrap gap-2">
              {data.languages.map((language) => (
                <span key={language.id} className="tag">
                  {language.name} • {language.level}
                </span>
              ))}
            </div>
          </div>
        ) : null;
      
      case 'hobbies':
        return data.hobbies.length > 0 ? (
          <div className="modern-section mb-6">
            <style jsx>{sectionStyles}</style>
            <h2>Hobbies</h2>
            <div className="flex flex-wrap gap-2">
              {data.hobbies.map((hobby, index) => (
                <span key={index} className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        ) : null;

      // Add other sections as needed...
      default:
        return null;
    }
  };

  return (
    <div 
      style={{
        fontFamily: styleSettings.fontFamily,
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