'use client';

import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useResumeStore } from '@/store/useResumeStore';
import { Input, Button } from '@/components/ui';
import type { Quality } from '@/types/resume';

interface DragItem {
  type: string;
  id: string;
  index: number;
}

interface DraggableQualityItemProps {
  quality: Quality;
  index: number;
  moveQuality: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (id: string, quality: string) => void;
  onDelete: (id: string) => void;
}

const DraggableQualityItem: React.FC<DraggableQualityItemProps> = ({
  quality,
  index,
  moveQuality,
  onEdit,
  onDelete,
}) => {
  const dragRef = React.useRef<HTMLDivElement>(null);
  const dropRef = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'quality',
    item: { type: 'quality', id: quality.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'quality',
    hover: (item: DragItem) => {
      if (!item) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveQuality(dragIndex, hoverIndex);
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
        <span className="font-medium text-gray-900">{quality.quality}</span>
      </div>
      <div className="flex space-x-2">
        <button onClick={() => onEdit(quality.id, quality.quality)} className="btn-icon" title="Edit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button onClick={() => onDelete(quality.id)} className="btn-icon text-red-600 hover:text-red-700" title="Delete">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const QualitiesSection: React.FC = () => {
  const { resumeData, addQuality, updateQuality, deleteQuality, reorderQualities } = useResumeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [qualityText, setQualityText] = useState('');

  const resetForm = () => {
    setQualityText('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!qualityText.trim()) return;

    if (editingId) {
      updateQuality(editingId, { quality: qualityText.trim() });
    } else {
      addQuality({ quality: qualityText.trim() });
    }
    resetForm();
  };

  const handleEdit = (id: string, quality: string) => {
    setQualityText(quality);
    setEditingId(id);
    setIsAdding(true);
  };

  const moveQuality = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = resumeData.qualities[dragIndex];
    const newQualities = [...resumeData.qualities];
    newQualities.splice(dragIndex, 1);
    newQualities.splice(hoverIndex, 0, draggedItem);
    reorderQualities(newQualities);
  };

  return (
    <div className="space-y-4">
      {/* Existing Qualities */}
      <div className="grid grid-cols-1 gap-3">
        {resumeData.qualities.map((quality, index) => (
          <DraggableQualityItem
            key={quality.id}
            quality={quality}
            index={index}
            moveQuality={moveQuality}
            onEdit={handleEdit}
            onDelete={deleteQuality}
          />
        ))}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="border border-primary-200 rounded-lg p-4 bg-primary-50">
          <div className="space-y-4">
            <Input
              label="Quality"
              value={qualityText}
              onChange={(e) => setQualityText(e.target.value)}
              placeholder="e.g., Leadership, Problem-solving, Creativity..."
              required
            />
            <div className="flex space-x-2">
              <Button onClick={handleSubmit} disabled={!qualityText.trim()}>
                {editingId ? 'Update' : 'Add'} Quality
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
          + Add Quality
        </button>
      )}
    </div>
  );
};