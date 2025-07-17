'use client';

import React, { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { PersonalDetailsSection } from '@/components/sections/PersonalDetailsSection';
import { ProfileSection } from '@/components/sections/ProfileSection';
import { EducationSection } from '@/components/sections/EducationSection';
import { EmploymentSection } from '@/components/sections/EmploymentSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { LanguagesSection } from '@/components/sections/LanguagesSection';
import { HobbiesSection } from '@/components/sections/HobbiesSection';
import { CoursesSection } from '@/components/sections/CoursesSection';
import { InternshipsSection } from '@/components/sections/InternshipsSection';
import { ReferencesSection } from '@/components/sections/ReferencesSection';
import { QualitiesSection } from '@/components/sections/QualitiesSection';
import { CertificatesSection } from '@/components/sections/CertificatesSection';
import { AchievementsSection } from '@/components/sections/AchievementsSection';
import { FooterSection } from '@/components/sections/FooterSection';
import type { SectionType } from '@/types/resume';

export const FormPanel: React.FC = () => {
  const {
    uiState,
    reorderSections,
    togglePageBreak,
    toggleSection,
    removeSection,
  } = useResumeStore();
  
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.section-menu')) {
        setOpenMenus(new Set());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSectionExpanded = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
        // Close menu when collapsing section
        setOpenMenus(prevMenus => {
          const newMenus = new Set(prevMenus);
          newMenus.delete(sectionId);
          return newMenus;
        });
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const toggleMenu = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSectionId(sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropSectionId: string) => {
    e.preventDefault();
    
    if (!draggedSectionId || draggedSectionId === dropSectionId) {
      setDraggedSectionId(null);
      return;
    }

    const sections = [...visibleSections];
    const draggedIndex = sections.findIndex(s => s.id === draggedSectionId);
    const dropIndex = sections.findIndex(s => s.id === dropSectionId);
    
    if (draggedIndex !== -1 && dropIndex !== -1) {
      // Remove dragged section and insert at new position
      const [draggedSection] = sections.splice(draggedIndex, 1);
      sections.splice(dropIndex, 0, draggedSection);
      
      // Update order and reorder
      const reorderedSections = sections.map((section, index) => ({
        ...section,
        order: index
      }));
      
      reorderSections([...uiState.activeSections.filter(s => !s.isVisible), ...reorderedSections]);
    }
    
    setDraggedSectionId(null);
  };

  const handleDragEnd = () => {
    setDraggedSectionId(null);
  };

  const handleRemoveSection = (sectionType: SectionType, e: React.MouseEvent) => {
    e.stopPropagation();
    removeSection(sectionType);
    setOpenMenus(prev => {
      const newSet = new Set(prev);
      // Remove menu for the section being removed
      const section = uiState.activeSections.find(s => s.type === sectionType);
      if (section) {
        newSet.delete(section.id);
      }
      return newSet;
    });
  };

  const renderSection = (sectionType: SectionType) => {
    switch (sectionType) {
      case 'personalDetails':
        return <PersonalDetailsSection />;
      case 'profile':
        return <ProfileSection />;
      case 'education':
        return <EducationSection />;
      case 'employment':
        return <EmploymentSection />;
      case 'skills':
        return <SkillsSection />;
      case 'languages':
        return <LanguagesSection />;
      case 'hobbies':
        return <HobbiesSection />;
      case 'courses':
        return <CoursesSection />;
      case 'internships':
        return <InternshipsSection />;
      case 'extracurricularActivities':
        return <div>Extracurricular Activities Section (Coming Soon)</div>;
      case 'references':
        return <ReferencesSection />;
      case 'qualities':
        return <QualitiesSection />;
      case 'certificates':
        return <CertificatesSection />;
      case 'achievements':
        return <AchievementsSection />;
      case 'footer':
        return <FooterSection />;
      default:
        return null;
    }
  };

  const visibleSections = uiState.activeSections
    .filter(section => section.isVisible)
    .sort((a, b) => a.order - b.order);

  const optionalSections = uiState.activeSections.filter(section => section.isOptional);
  const hiddenSections = optionalSections.filter(section => !section.isVisible);

  const handleToggleOptionalSection = (sectionType: SectionType) => {
    toggleSection(sectionType);
  };

  // Core sections that cannot be deleted
  const coreSections = ['personalDetails', 'profile', 'education', 'employment', 'skills', 'languages', 'hobbies'];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-0">
        {/* Sections */}
        <div className="space-y-0">
          {visibleSections.map((section) => (
            <div 
              key={section.id} 
              className={`border-b border-gray-200 ${draggedSectionId === section.id ? 'opacity-50' : ''}`}
              draggable={section.type !== 'personalDetails'}
              onDragStart={(e) => handleDragStart(e, section.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, section.id)}
              onDragEnd={handleDragEnd}
            >
              {/* Section Header */}
              <div 
                className="flex items-center justify-between px-6 py-4 bg-white hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleSectionExpanded(section.id)}
              >
                <div className="flex items-center">
                  {section.type !== 'personalDetails' && (
                    <div className="drag-handle mr-3 cursor-grab active:cursor-grabbing" onClick={(e) => e.stopPropagation()}>
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 3a1 1 0 110 2 1 1 0 010-2zM6 7a1 1 0 110 2 1 1 0 010-2zM6 11a1 1 0 110 2 1 1 0 010-2zM14 3a1 1 0 110 2 1 1 0 010-2zM14 7a1 1 0 110 2 1 1 0 010-2zM14 11a1 1 0 110 2 1 1 0 010-2z" />
                      </svg>
                    </div>
                  )}
                  <h3 className="text-base font-medium text-gray-900">
                    {section.title}
                  </h3>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Show three-dot menu only when expanded */}
                  {expandedSections.has(section.id) && (
                    <div className="relative section-menu">
                      <button 
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Section options"
                        onClick={(e) => toggleMenu(section.id, e)}
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      
                      {/* Dropdown Menu */}
                      {openMenus.has(section.id) && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            {section.canRename && (
                              <button 
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenus(prev => {
                                    const newSet = new Set(prev);
                                    newSet.delete(section.id);
                                    return newSet;
                                  });
                                  // TODO: Implement rename functionality
                                }}
                              >
                                <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Renommer la rubrique
                              </button>
                            )}
                            <button 
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePageBreak(section.id);
                                setOpenMenus(prev => {
                                  const newSet = new Set(prev);
                                  newSet.delete(section.id);
                                  return newSet;
                                });
                              }}
                            >
                              <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Insérer un saut de page
                            </button>
                            {section.isOptional && !coreSections.includes(section.type) && (
                              <button 
                                className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                                onClick={(e) => handleRemoveSection(section.type, e)}
                              >
                                <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Supprimer la rubrique
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Expand/Collapse Button - Always visible */}
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <svg 
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedSections.has(section.id) ? 'rotate-45' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Section Content */}
              {expandedSections.has(section.id) && (
                <div className="px-6 pb-6">
                  {renderSection(section.type)}
                  
                  {/* Page Break Indicator */}
                  {section.hasPageBreak && (
                    <div className="mt-4 flex items-center justify-between py-2 px-3 bg-gray-50 rounded border">
                      <span className="text-sm text-gray-600">Page break</span>
                      <button
                        className="p-1 hover:bg-gray-200 rounded text-gray-500"
                        title="Remove page break"
                        onClick={() => togglePageBreak(section.id)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Optional Sections at Bottom */}
        {hiddenSections.length > 0 && (
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {hiddenSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleToggleOptionalSection(section.type)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 