'use client';

import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useResumeStore } from '@/store/useResumeStore';
import { Input, Button, RichTextEditor } from '@/components/ui';
import type { Employment } from '@/types/resume';

interface EmploymentFormData {
  position: string;
  company: string;
  start: string;
  end: string;
  ongoing: boolean;
  description: string;
}

interface DragItem {
  type: string;
  id: string;
  index: number;
}

interface DraggableEmploymentItemProps {
  employment: Employment;
  index: number;
  moveEmployment: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (employment: Employment) => void;
  onDelete: (id: string) => void;
}

const DraggableEmploymentItem: React.FC<DraggableEmploymentItemProps> = ({
  employment,
  index,
  moveEmployment,
  onEdit,
  onDelete,
}) => {
  const dragRef = React.useRef<HTMLDivElement>(null);
  const dropRef = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'employment',
    item: { type: 'employment', id: employment.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'employment',
    hover: (item: DragItem) => {
      if (!item) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveEmployment(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  drag(dragRef);
  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className={`border border-gray-200 rounded-lg p-4 bg-gray-50 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start space-x-3 flex-1">
          <div
            ref={dragRef}
            className="cursor-move text-gray-400 hover:text-gray-600 mt-1"
            title="Drag to reorder"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{employment.position}</h4>
            <p className="text-sm text-gray-600">{employment.company}</p>
            <p className="text-xs text-gray-500">
              {employment.start} - {employment.ongoing ? 'Present' : employment.end}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(employment)}
            className="btn-icon"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(employment.id)}
            className="btn-icon text-red-600 hover:text-red-700"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      {employment.description && (
        <div 
          className="text-sm text-gray-700 mt-2" 
          dangerouslySetInnerHTML={{ __html: employment.description }}
        />
      )}
    </div>
  );
};

export const EmploymentSection: React.FC = () => {
  const { resumeData, addEmployment, updateEmployment, deleteEmployment, reorderEmployment } = useResumeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EmploymentFormData>({
    position: '',
    company: '',
    start: '',
    end: '',
    ongoing: false,
    description: ''
  });

  const resetForm = () => {
    setFormData({
      position: '',
      company: '',
      start: '',
      end: '',
      ongoing: false,
      description: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.position || !formData.company || !formData.start) return;

    if (editingId) {
      updateEmployment(editingId, formData);
    } else {
      addEmployment(formData);
    }
    resetForm();
  };

  const handleEdit = (employment: Employment) => {
    setFormData({
      position: employment.position,
      company: employment.company,
      start: employment.start,
      end: employment.end,
      ongoing: employment.ongoing,
      description: employment.description
    });
    setEditingId(employment.id);
    setIsAdding(true);
  };

  const moveEmployment = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = resumeData.employment[dragIndex];
    const newEmployment = [...resumeData.employment];
    newEmployment.splice(dragIndex, 1);
    newEmployment.splice(hoverIndex, 0, draggedItem);
    reorderEmployment(newEmployment);
  };

  const handleDelete = (id: string) => {
    deleteEmployment(id);
  };

  const handleFieldChange = (field: keyof EmploymentFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      {/* Existing Employment Entries */}
      {resumeData.employment.map((employment, index) => (
        <DraggableEmploymentItem
          key={employment.id}
          employment={employment}
          index={index}
          moveEmployment={moveEmployment}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="border border-primary-200 rounded-lg p-4 bg-primary-50">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Position"
                value={formData.position}
                onChange={(e) => handleFieldChange('position', e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                required
              />
              <Input
                label="Company"
                value={formData.company}
                onChange={(e) => handleFieldChange('company', e.target.value)}
                placeholder="e.g., Google Inc."
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
                  <span className="ml-2 text-sm text-gray-700">Currently employed</span>
                </label>
              </div>
            </div>

            <RichTextEditor
              label="Description"
              value={formData.description}
              onChange={(value) => handleFieldChange('description', value)}
              placeholder="Describe your responsibilities, achievements, and key contributions..."
              minHeight={100}
            />

            <div className="flex space-x-2">
              <Button onClick={handleSubmit} disabled={!formData.position || !formData.company || !formData.start}>
                {editingId ? 'Update' : 'Add'} Employment
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
          + Add Employment
        </button>
      )}
    </div>
  );
};