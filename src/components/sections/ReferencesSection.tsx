'use client';

import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useResumeStore } from '@/store/useResumeStore';
import { Input, Button } from '@/components/ui';
import type { Reference } from '@/types/resume';

interface DragItem {
  type: string;
  id: string;
  index: number;
}

interface DraggableReferenceItemProps {
  reference: Reference;
  index: number;
  moveReference: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (reference: Reference) => void;
  onDelete: (id: string) => void;
}

const DraggableReferenceItem: React.FC<DraggableReferenceItemProps> = ({
  reference,
  index,
  moveReference,
  onEdit,
  onDelete,
}) => {
  const dragRef = React.useRef<HTMLDivElement>(null);
  const dropRef = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'reference',
    item: { type: 'reference', id: reference.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'reference',
    hover: (item: DragItem) => {
      if (!item) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveReference(dragIndex, hoverIndex);
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
            <h4 className="font-medium text-gray-900">{reference.name}</h4>
            <p className="text-sm text-gray-600">{reference.organization} • {reference.city}</p>
            <div className="text-xs text-gray-500 mt-1">
              {reference.phone && <span>Phone: {reference.phone}</span>}
              {reference.phone && reference.email && <span> • </span>}
              {reference.email && <span>Email: {reference.email}</span>}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => onEdit(reference)} className="btn-icon" title="Edit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button onClick={() => onDelete(reference.id)} className="btn-icon text-red-600 hover:text-red-700" title="Delete">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export const ReferencesSection: React.FC = () => {
  const { resumeData, addReference, updateReference, deleteReference, reorderReferences } = useResumeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    organization: '',
    position: '',
    city: '',
    phone: '',
    email: ''
  });

  const resetForm = () => {
    setFormData({ name: '', company: '', organization: '', position: '', city: '', phone: '', email: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.organization) return;

    if (editingId) {
      updateReference(editingId, formData);
    } else {
      addReference(formData);
    }
    resetForm();
  };

  const handleEdit = (reference: Reference) => {
    setFormData({
      name: reference.name,
      company: reference.company,
      organization: reference.organization,
      position: reference.position,
      city: reference.city,
      phone: reference.phone,
      email: reference.email
    });
    setEditingId(reference.id);
    setIsAdding(true);
  };

  const moveReference = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = resumeData.references[dragIndex];
    const newReferences = [...resumeData.references];
    newReferences.splice(dragIndex, 1);
    newReferences.splice(hoverIndex, 0, draggedItem);
    reorderReferences(newReferences);
  };

  return (
    <div className="space-y-4">
      {/* Existing References */}
      {resumeData.references.map((reference, index) => (
        <DraggableReferenceItem
          key={reference.id}
          reference={reference}
          index={index}
          moveReference={moveReference}
          onEdit={handleEdit}
          onDelete={deleteReference}
        />
      ))}

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="border border-primary-200 rounded-lg p-4 bg-primary-50">
          <div className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., John Smith"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="e.g., ABC Company"
                required
              />
              <Input
                label="Position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="e.g., Senior Manager"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Organization"
                value={formData.organization}
                onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                placeholder="e.g., ABC Company"
                required
              />
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="e.g., New York, NY"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="e.g., +1 (555) 123-4567"
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="e.g., john@company.com"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSubmit} disabled={!formData.name || !formData.company || !formData.position || !formData.organization}>
                {editingId ? 'Update' : 'Add'} Reference
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
          + Add Reference
        </button>
      )}
    </div>
  );
};