'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { Input, Button, Select } from '@/components/ui';
import { useState } from 'react';
import type { Skill } from '@/types/resume';

const proficiencyOptions = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Excellent', label: 'Excellent' }
];

export const SkillsSection: React.FC = () => {
  const { resumeData, addSkill, updateSkill, deleteSkill } = useResumeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', level: 'Intermediate' as Skill['level'] });

  const resetForm = () => {
    setFormData({ name: '', level: 'Intermediate' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.name) return;

    if (editingId) {
      updateSkill(editingId, formData);
    } else {
      addSkill(formData);
    }
    resetForm();
  };

  const handleEdit = (skill: Skill) => {
    setFormData({ name: skill.name, level: skill.level });
    setEditingId(skill.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-4">
      {/* Existing Skills */}
      <div className="grid grid-cols-1 gap-3">
        {resumeData.skills.map((skill) => (
          <div key={skill.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex-1">
              <span className="font-medium text-gray-900">{skill.name}</span>
              <span className="ml-2 text-sm text-gray-600">({skill.level})</span>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => handleEdit(skill)} className="btn-icon" title="Edit">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button onClick={() => deleteSkill(skill.id)} className="btn-icon text-red-600 hover:text-red-700" title="Delete">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="border border-primary-200 rounded-lg p-4 bg-primary-50">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Skill Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., JavaScript, Python, etc."
                required
              />
              <Select
                label="Proficiency Level"
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as Skill['level'] }))}
                options={proficiencyOptions}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSubmit} disabled={!formData.name}>
                {editingId ? 'Update' : 'Add'} Skill
              </Button>
              <Button variant="secondary" onClick={resetForm}>Cancel</Button>
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
          + Add Skill
        </button>
      )}
    </div>
  );
}; 