'use client';

import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useResumeStore } from '@/store/useResumeStore';
import { Input, Button } from '@/components/ui';

interface DragItem {
  type: string;
  index: number;
}

interface DraggableHobbyItemProps {
  hobby: string;
  index: number;
  moveHobby: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (index: number, hobby: string) => void;
  onDelete: (index: number) => void;
}

const DraggableHobbyItem: React.FC<DraggableHobbyItemProps> = ({
  hobby,
  index,
  moveHobby,
  onEdit,
  onDelete,
}) => {
  const dragRef = React.useRef<HTMLDivElement>(null);
  const dropRef = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'hobby',
    item: { type: 'hobby', index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'hobby',
    hover: (item: DragItem) => {
      if (!item) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveHobby(dragIndex, hoverIndex);
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
        <span className="font-medium text-gray-900 flex-1">{hobby}</span>
      </div>
      <div className="flex space-x-2">
        <button onClick={() => onEdit(index, hobby)} className="btn-icon" title="Edit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button onClick={() => onDelete(index)} className="btn-icon text-red-600 hover:text-red-700" title="Delete">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const HobbiesSection: React.FC = () => {
  const { resumeData, addHobby, updateHobby, deleteHobby, reorderHobbies } = useResumeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hobbyText, setHobbyText] = useState('');

  const resetForm = () => {
    setHobbyText('');
    setIsAdding(false);
    setEditingIndex(null);
  };

  const handleSubmit = () => {
    if (!hobbyText.trim()) return;

    if (editingIndex !== null) {
      updateHobby(editingIndex, hobbyText.trim());
    } else {
      addHobby(hobbyText.trim());
    }
    resetForm();
  };

  const handleEdit = (index: number, hobby: string) => {
    setHobbyText(hobby);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const moveHobby = (dragIndex: number, hoverIndex: number) => {
    const newHobbies = [...resumeData.hobbies];
    const draggedItem = newHobbies[dragIndex];
    newHobbies.splice(dragIndex, 1);
    newHobbies.splice(hoverIndex, 0, draggedItem);
    reorderHobbies(newHobbies);
  };

  return (
    <div className="space-y-4">
      {/* Existing Hobbies */}
      <div className="grid grid-cols-1 gap-3">
        {resumeData.hobbies.map((hobby, index) => (
          <DraggableHobbyItem
            key={index}
            hobby={hobby}
            index={index}
            moveHobby={moveHobby}
            onEdit={handleEdit}
            onDelete={deleteHobby}
          />
        ))}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="border border-primary-200 rounded-lg p-4 bg-primary-50">
          <div className="space-y-4">
            <Input
              label="Hobby"
              value={hobbyText}
              onChange={(e) => setHobbyText(e.target.value)}
              placeholder="e.g., Reading, Photography, Hiking..."
              required
            />
            <div className="flex space-x-2">
              <Button onClick={handleSubmit} disabled={!hobbyText.trim()}>
                {editingIndex !== null ? 'Update' : 'Add'} Hobby
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
          + Add Hobby
        </button>
      )}
    </div>
  );
};