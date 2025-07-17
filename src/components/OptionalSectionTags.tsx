'use client';

import { useResumeStore } from '@/store/useResumeStore';
import type { SectionType } from '@/types/resume';

export const OptionalSectionTags: React.FC = () => {
  const { uiState, toggleSection } = useResumeStore();

  const optionalSections = uiState.activeSections.filter(section => section.isOptional);
  const hiddenSections = optionalSections.filter(section => !section.isVisible);

  const handleToggleSection = (sectionType: SectionType) => {
    toggleSection(sectionType);
  };

  if (hiddenSections.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <p className="text-sm text-gray-600 mb-3">Add optional sections:</p>
      <div className="flex flex-wrap gap-2">
        {hiddenSections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleToggleSection(section.type)}
            className="optional-section-tag"
          >
            + {section.title}
          </button>
        ))}
      </div>
    </div>
  );
}; 