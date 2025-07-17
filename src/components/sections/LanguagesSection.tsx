'use client';

import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useResumeStore } from '@/store/useResumeStore';
import { Input, Button, Select } from '@/components/ui';
import type { Language } from '@/types/resume';

const proficiencyOptions = [
  { value: 'Basic', label: 'Basic' },
  { value: 'Fluent', label: 'Fluent' },
  { value: 'Native', label: 'Native' }
];

interface DragItem {
  type: string;
  id: string;
  index: number;
}

interface DraggableLanguageItemProps {
  language: Language;
  index: number;
  moveLanguage: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (language: Language) => void;
  onDelete: (id: string) => void;
}

const DraggableLanguageItem: React.FC<DraggableLanguageItemProps> = ({
  language,
  index,
  moveLanguage,
  onEdit,
  onDelete,
}) => {
  const dragRef = React.useRef<HTMLDivElement>(null);
  const dropRef = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'language',
    item: { type: 'language', id: language.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'language',
    hover: (item: DragItem) => {
      if (!item) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveLanguage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  drag(dragRef);
  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className={`flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center space-x-3 flex-1">
        <div
          ref={dragRef}
          className="cursor-move text-gray-400 hover:text-gray-600"
          title="Drag to reorder"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </div>
        <div className="flex-1">
          <span className="font-medium text-gray-900">{language.name}</span>
          <span className="ml-2 text-sm text-gray-600">({language.level})</span>
        </div>
      </div>
      <div className="flex space-x-2">
        <button onClick={() => onEdit(language)} className="btn-icon" title="Edit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button onClick={() => onDelete(language.id)} className="btn-icon text-red-600 hover:text-red-700" title="Delete">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const LanguagesSection: React.FC = () => {
  const { resumeData, addLanguage, updateLanguage, deleteLanguage, reorderLanguages } = useResumeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', level: 'Fluent' as Language['level'] });

  const resetForm = () => {
    setFormData({ name: '', level: 'Fluent' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.name) return;

    if (editingId) {
      updateLanguage(editingId, formData);
    } else {
      addLanguage(formData);
    }
    resetForm();
  };

  const handleEdit = (language: Language) => {
    setFormData({ name: language.name, level: language.level });
    setEditingId(language.id);
    setIsAdding(true);
  };

  const moveLanguage = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = resumeData.languages[dragIndex];
    const newLanguages = [...resumeData.languages];
    newLanguages.splice(dragIndex, 1);
    newLanguages.splice(hoverIndex, 0, draggedItem);
    reorderLanguages(newLanguages);
  };

  return (
    <div className="space-y-4">
      {/* Existing Languages */}
      <div className="grid grid-cols-1 gap-3">
        {resumeData.languages.map((language, index) => (
          <DraggableLanguageItem
            key={language.id}
            language={language}
            index={index}
            moveLanguage={moveLanguage}
            onEdit={handleEdit}
            onDelete={deleteLanguage}
          />
        ))}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="border border-primary-200 rounded-lg p-4 bg-primary-50">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Language"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., English, Spanish, etc."
                required
              />
              <Select
                label="Proficiency Level"
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as Language['level'] }))}
                options={proficiencyOptions}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSubmit} disabled={!formData.name}>
                {editingId ? 'Update' : 'Add'} Language
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
          + Add Language
        </button>
      )}
    </div>
  );
};