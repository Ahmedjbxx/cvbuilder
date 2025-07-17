'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { Select } from '@/components/ui';
import { templates } from '@/lib/templates';

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Helvetica', label: 'Helvetica' }
];

const fontSizeOptions = [
  { value: '10', label: '10px' },
  { value: '11', label: '11px' },
  { value: '12', label: '12px' },
  { value: '13', label: '13px' },
  { value: '14', label: '14px' },
  { value: '16', label: '16px' },
  { value: '18', label: '18px' }
];

const lineHeightOptions = [
  { value: '1.2', label: '1.2' },
  { value: '1.4', label: '1.4' },
  { value: '1.5', label: '1.5' },
  { value: '1.6', label: '1.6' },
  { value: '1.8', label: '1.8' },
  { value: '2.0', label: '2.0' }
];

const colorOptions = [
  { value: '#2563eb', label: 'Blue', color: '#2563eb' },
  { value: '#dc2626', label: 'Red', color: '#dc2626' },
  { value: '#059669', label: 'Green', color: '#059669' },
  { value: '#7c3aed', label: 'Purple', color: '#7c3aed' },
  { value: '#ea580c', label: 'Orange', color: '#ea580c' },
  { value: '#374151', label: 'Gray', color: '#374151' }
];

export const StyleToolbar: React.FC = () => {
  const { uiState, updateStyleSettings } = useResumeStore();
  const { styleSettings } = uiState;

  const handleStyleChange = (field: string, value: string | number) => {
    updateStyleSettings({ [field]: value });
  };

  return (
    <div className="bg-white border-t border-gray-200 shadow-lg no-print">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Template Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Template:</label>
              <div className="flex space-x-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleStyleChange('templateId', template.id)}
                    className={`px-3 py-2 text-xs rounded border ${
                      styleSettings.templateId === template.id
                        ? 'bg-primary-100 border-primary-300 text-primary-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    title={template.description}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Controls */}
            <div className="flex items-center space-x-4">
              <div className="w-32">
                <Select
                  value={styleSettings.fontFamily}
                  onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                  options={fontOptions}
                />
              </div>
              
              <div className="w-20">
                <Select
                  value={styleSettings.fontSize.toString()}
                  onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
                  options={fontSizeOptions}
                />
              </div>
              
              <div className="w-20">
                <Select
                  value={styleSettings.lineHeight.toString()}
                  onChange={(e) => handleStyleChange('lineHeight', parseFloat(e.target.value))}
                  options={lineHeightOptions}
                />
              </div>
            </div>

            {/* Color Picker */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Color:</label>
              <div className="flex space-x-1">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleStyleChange('primaryColor', color.value)}
                    className={`w-8 h-8 rounded border-2 ${
                      styleSettings.primaryColor === color.value
                        ? 'border-gray-900'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Preview Toggle */}
          <div className="flex items-center space-x-4">
            <button className="btn-secondary text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </button>
            
            <div className="text-sm text-gray-500">
              {uiState.isDirty ? 'Unsaved changes' : 'All changes saved'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 