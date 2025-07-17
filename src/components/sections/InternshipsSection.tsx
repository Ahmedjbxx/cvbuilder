'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { Input, Button, Select, RichTextEditor } from '@/components/ui';
import { useState } from 'react';
import type { Internship } from '@/types/resume';

interface InternshipFormData {
  position: string;
  employer: string;
  city: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  ongoing: boolean;
  description: string;
}

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

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 50 }, (_, i) => {
  const year = currentYear - i + 10;
  return { value: year.toString(), label: year.toString() };
});

export const InternshipsSection: React.FC = () => {
  const { resumeData, addInternship, updateInternship, deleteInternship } = useResumeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<InternshipFormData>({
    position: '',
    employer: '',
    city: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    ongoing: false,
    description: ''
  });

  const resetForm = () => {
    setFormData({
      position: '',
      employer: '',
      city: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      ongoing: false,
      description: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.position || !formData.employer || !formData.startMonth || !formData.startYear) return;

    if (editingId) {
      updateInternship(editingId, formData);
    } else {
      addInternship(formData);
    }
    resetForm();
  };

  const handleEdit = (internship: Internship) => {
    setFormData({
      position: internship.position,
      employer: internship.employer,
      city: internship.city,
      startMonth: internship.startMonth,
      startYear: internship.startYear,
      endMonth: internship.endMonth,
      endYear: internship.endYear,
      ongoing: internship.ongoing,
      description: internship.description
    });
    setEditingId(internship.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    deleteInternship(id);
  };

  const handleFieldChange = (field: keyof InternshipFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDateRange = (internship: Internship) => {
    const startDate = `${monthOptions.find(m => m.value === internship.startMonth)?.label} ${internship.startYear}`;
    if (internship.ongoing) {
      return `${startDate} - Present`;
    }
    const endDate = internship.endMonth && internship.endYear 
      ? `${monthOptions.find(m => m.value === internship.endMonth)?.label} ${internship.endYear}`
      : '';
    return endDate ? `${startDate} - ${endDate}` : startDate;
  };

  return (
    <div className="space-y-4">
      {/* Existing Internship Entries */}
      {resumeData.internships.map((internship) => (
        <div key={internship.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{internship.position}</h4>
              <p className="text-sm text-gray-600">{internship.employer} • {internship.city}</p>
              <p className="text-xs text-gray-500">{formatDateRange(internship)}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(internship)}
                className="btn-icon"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(internship.id)}
                className="btn-icon text-red-600 hover:text-red-700"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          {internship.description && (
            <div 
              className="text-sm text-gray-700 mt-2" 
              dangerouslySetInnerHTML={{ __html: internship.description }}
            />
          )}
        </div>
      ))}

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="border border-primary-200 rounded-lg p-4 bg-primary-50">
          <div className="space-y-4">
            <Input
              label="Position"
              value={formData.position}
              onChange={(e) => handleFieldChange('position', e.target.value)}
              placeholder="e.g., Software Engineering Intern"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Employer"
                value={formData.employer}
                onChange={(e) => handleFieldChange('employer', e.target.value)}
                placeholder="e.g., Google Inc."
                required
              />
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                placeholder="e.g., San Francisco, CA"
                required
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <Select
                label="Start Month"
                value={formData.startMonth}
                onChange={(e) => handleFieldChange('startMonth', e.target.value)}
                options={monthOptions}
                placeholder="Month"
                required
              />
              <Select
                label="Start Year"
                value={formData.startYear}
                onChange={(e) => handleFieldChange('startYear', e.target.value)}
                options={yearOptions}
                placeholder="Year"
                required
              />
              <Select
                label="End Month"
                value={formData.endMonth}
                onChange={(e) => handleFieldChange('endMonth', e.target.value)}
                options={monthOptions}
                placeholder="Month"
                disabled={formData.ongoing}
              />
              <Select
                label="End Year"
                value={formData.endYear}
                onChange={(e) => handleFieldChange('endYear', e.target.value)}
                options={yearOptions}
                placeholder="Year"
                disabled={formData.ongoing}
              />
            </div>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.ongoing}
                onChange={(e) => handleFieldChange('ongoing', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Currently working as an intern</span>
            </label>

            <RichTextEditor
              label="Description"
              value={formData.description}
              onChange={(value) => handleFieldChange('description', value)}
              placeholder="Describe your responsibilities, projects, and achievements during the internship..."
              minHeight={100}
            />

            <div className="flex space-x-2">
              <Button onClick={handleSubmit} disabled={!formData.position || !formData.employer || !formData.startMonth || !formData.startYear}>
                {editingId ? 'Update' : 'Add'} Internship
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
          + Add Internship
        </button>
      )}
    </div>
  );
}; 