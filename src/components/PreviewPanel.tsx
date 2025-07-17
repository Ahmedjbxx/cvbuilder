'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { getTemplate } from '@/lib/templates';
import { StyleToolbar } from '@/components/StyleToolbar';
import { useMemo } from 'react';

export const PreviewPanel: React.FC = () => {
  const { resumeData, uiState } = useResumeStore();

  const visibleSections = useMemo(() => {
    return uiState.activeSections
      .filter(section => section.isVisible)
      .sort((a, b) => a.order - b.order);
  }, [uiState.activeSections]);

  const selectedTemplate = getTemplate(uiState.styleSettings.templateId);

  if (!selectedTemplate) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-gray-100 relative">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Template not found</h3>
            <p className="text-gray-600">The selected template could not be loaded.</p>
          </div>
          <StyleToolbar />
        </div>
      </div>
    );
  }

  const TemplateComponent = selectedTemplate.component;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto bg-gray-100 p-6 relative">
        <div className="flex justify-center">
          <div className="a4-preview p-a4-margin">
            <TemplateComponent
              data={resumeData}
              sections={visibleSections}
              styleSettings={uiState.styleSettings}
            />
          </div>
        </div>
        <StyleToolbar />
      </div>
    </div>
  );
}; 