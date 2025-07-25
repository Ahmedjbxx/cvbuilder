'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { Input, Button, RichTextEditor } from '@/components/ui';
import { useState } from 'react';
import type { Education } from '@/types/resume';

interface EducationFormData {
  degree: string;
  school: string;
  start: string;
  end: string;
  ongoing: boolean;
  description: string;
}

export const EducationSection: React.FC = () => {
  const { resumeData, addEducation, updateEducation, deleteEducation } = useResumeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EducationFormData>({
    degree: '',
    school: '',
    start: '',
    end: '',
    ongoing: false,
    description: ''
  });

  const resetForm = () => {
    setFormData({
      degree: '',
      school: '',
      start: '',
      end: '',
      ongoing: false,
      description: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.degree || !formData.school || !formData.start) return;

    if (editingId) {
      updateEducation(editingId, formData);
    } else {
      addEducation(formData);
    }
    resetForm();
  };

  const handleEdit = (education: Education) => {
    setFormData({
      degree: education.degree,
      school: education.school,
      start: education.start,
      end: education.end,
      ongoing: education.ongoing,
      description: education.description
    });
    setEditingId(education.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    deleteEducation(id);
  };

  const handleFieldChange = (field: keyof EducationFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      {/* Existing Education Entries */}
      {resumeData.education.map((edu) => (
        <div key={edu.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{edu.degree}</h4>
              <p className="text-sm text-gray-600">{edu.school}</p>
              <p className="text-xs text-gray-500">
                {edu.start} - {edu.ongoing ? 'Present' : edu.end}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(edu)}
                className="btn-icon"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(edu.id)}
                className="btn-icon text-red-600 hover:text-red-700"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          {edu.description && (
            <div 
              className="text-sm text-gray-700 mt-2" 
              dangerouslySetInnerHTML={{ __html: edu.description }}
            />
          )}
        </div>
      ))}

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="border border-primary-200 rounded-lg p-4 bg-primary-50">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Degree"
                value={formData.degree}
                onChange={(e) => handleFieldChange('degree', e.target.value)}
                placeholder="e.g., Bachelor of Science"
                required
              />
              <Input
                label="School/University"
                value={formData.school}
                onChange={(e) => handleFieldChange('school', e.target.value)}
                placeholder="e.g., University of California"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="month"
                value={formData.start}
                onChange={(e) => handleFieldChange('start', e.target.value)}
                required
              />
              <div className="space-y-2">
                <Input
                  label="End Date"
                  type="month"
                  value={formData.end}
                  onChange={(e) => handleFieldChange('end', e.target.value)}
                  disabled={formData.ongoing}
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.ongoing}
                    onChange={(e) => handleFieldChange('ongoing', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Currently studying</span>
                </label>
              </div>
            </div>

            <RichTextEditor
              label="Description"
              value={formData.description}
              onChange={(value) => handleFieldChange('description', value)}
              placeholder="Describe relevant coursework, achievements, or activities..."
              minHeight={100}
            />

            <div className="flex space-x-2">
              <Button onClick={handleSubmit} disabled={!formData.degree || !formData.school || !formData.start}>
                {editingId ? 'Update' : 'Add'} Education
              </Button>
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
        >
          + Add Education
        </button>
      )}
    </div>
  );
}; 