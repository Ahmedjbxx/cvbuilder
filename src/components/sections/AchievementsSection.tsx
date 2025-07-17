'use client';

import React, { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useResumeStore } from '@/store/useResumeStore';
import { Button, RichTextEditor } from '@/components/ui';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';

interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface DraggableAchievementItemProps {
  achievement: any;
  index: number;
  onEdit: (id: string, description: string) => void;
  onDelete: (id: string) => void;
  moveAchievement: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableAchievementItem: React.FC<DraggableAchievementItemProps> = ({
  achievement,
  index,
  onEdit,
  onDelete,
  moveAchievement
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
    accept: 'achievement',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveAchievement(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'achievement',
    item: () => {
      return { id: achievement.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start space-x-3 flex-1">
          <div className="cursor-move text-gray-400 hover:text-gray-600 mt-1">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div 
              className="text-sm text-gray-700" 
              dangerouslySetInnerHTML={{ __html: achievement.description }}
            />
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button onClick={() => onEdit(achievement.id, achievement.description)} className="btn-icon" title="Edit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button onClick={() => onDelete(achievement.id)} className="btn-icon text-red-600 hover:text-red-700" title="Delete">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export const AchievementsSection: React.FC = () => {
  const { resumeData, addAchievement, updateAchievement, deleteAchievement, reorderAchievements } = useResumeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [achievementText, setAchievementText] = useState('');

  const resetForm = () => {
    setAchievementText('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!achievementText.trim()) return;

    if (editingId) {
      updateAchievement(editingId, { description: achievementText.trim() });
    } else {
      addAchievement({ description: achievementText.trim() });
    }
    resetForm();
  };

  const handleEdit = (id: string, description: string) => {
    setAchievementText(description);
    setEditingId(id);
    setIsAdding(true);
  };

  const moveAchievement = (dragIndex: number, hoverIndex: number) => {
    const draggedAchievement = resumeData.achievements[dragIndex];
    const newAchievements = [...resumeData.achievements];
    newAchievements.splice(dragIndex, 1);
    newAchievements.splice(hoverIndex, 0, draggedAchievement);
    reorderAchievements(newAchievements);
  };

  return (
    <div className="space-y-4">
      {/* Existing Achievements */}
      <div className="space-y-3">
        {resumeData.achievements.map((achievement, index) => (
          <DraggableAchievementItem
            key={achievement.id}
            achievement={achievement}
            index={index}
            onEdit={handleEdit}
            onDelete={deleteAchievement}
            moveAchievement={moveAchievement}
          />
        ))}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="border border-primary-200 rounded-lg p-4 bg-primary-50">
          <div className="space-y-4">
            <RichTextEditor
              label="Achievement Description"
              value={achievementText}
              onChange={setAchievementText}
              placeholder="Describe a significant achievement, award, or recognition..."
              minHeight={120}
            />
            <div className="flex space-x-2">
              <Button onClick={handleSubmit} disabled={!achievementText.trim()}>
                {editingId ? 'Update' : 'Add'} Achievement
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
          + Add Achievement
        </button>
      )}
    </div>
  );
};