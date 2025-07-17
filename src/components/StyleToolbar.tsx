'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
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
  { value: '#1f2937', label: 'Dark Gray', color: '#1f2937' },
  { value: '#3b82f6', label: 'Blue', color: '#3b82f6' },
  { value: '#10b981', label: 'Emerald', color: '#10b981' },
  { value: '#8b5cf6', label: 'Violet', color: '#8b5cf6' },
  { value: '#f59e0b', label: 'Amber', color: '#f59e0b' },
  { value: '#ef4444', label: 'Red', color: '#ef4444' },
  { value: '#6366f1', label: 'Indigo', color: '#6366f1' },
  { value: '#14b8a6', label: 'Teal', color: '#14b8a6' },
  { value: '#f97316', label: 'Orange', color: '#f97316' }
];

interface DropdownProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
      >
        {children}
        <svg className="w-3 h-3 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[120px]">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 first:rounded-t-md last:rounded-b-md ${
                value === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface ColorDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const ColorDropdown: React.FC<ColorDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
        <svg className="w-3 h-3 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4 min-w-[140px]">
          <div className="grid grid-cols-3 gap-4">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => {
                  onChange(color.value);
                  setIsOpen(false);
                }}
                className={`w-8 h-8 rounded-full shadow-sm hover:scale-105 transition-transform ${
                  value === color.value ? 'ring-2 ring-gray-400 ring-offset-2' : ''
                }`}
                style={{ backgroundColor: color.color }}
                title={color.label}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const StyleToolbar: React.FC = () => {
  const { uiState, updateStyleSettings } = useResumeStore();
  const { styleSettings } = uiState;
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const templateDropdownRef = useRef<HTMLDivElement>(null);

  const handleStyleChange = (field: string, value: string | number) => {
    updateStyleSettings({ [field]: value });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (templateDropdownRef.current && !templateDropdownRef.current.contains(event.target as Node)) {
        setTemplateDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 no-print" style={{ left: '75%', transform: 'translateX(-50%)' }}>
      <div className="flex items-center px-4 py-2 space-x-4">
        {/* Template Selector */}
        <div className="relative" ref={templateDropdownRef}>
          <button
            onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)}
            className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <svg className="w-3 h-3 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {templateDropdownOpen && (
            <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[120px]">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    handleStyleChange('templateId', template.id);
                    setTemplateDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 first:rounded-t-md last:rounded-b-md ${
                    styleSettings.templateId === template.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {template.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Font Family */}
        <Dropdown
          options={fontOptions}
          value={styleSettings.fontFamily}
          onChange={(value) => handleStyleChange('fontFamily', value)}
        >
          <span className="font-serif text-base">Aa</span>
        </Dropdown>

        {/* Font Size */}
        <Dropdown
          options={fontSizeOptions}
          value={styleSettings.fontSize.toString()}
          onChange={(value) => handleStyleChange('fontSize', parseInt(value))}
        >
          <span className="font-bold text-sm">tT</span>
        </Dropdown>

        {/* Line Height */}
        <Dropdown
          options={lineHeightOptions}
          value={styleSettings.lineHeight.toString()}
          onChange={(value) => handleStyleChange('lineHeight', parseFloat(value))}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </Dropdown>

        {/* Color Picker */}
        <ColorDropdown
          value={styleSettings.primaryColor}
          onChange={(value) => handleStyleChange('primaryColor', value)}
        />

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Fullscreen Toggle */}
        <button className="flex items-center px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
    </div>
  );
};