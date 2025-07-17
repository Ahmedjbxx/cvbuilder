'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { Input, Button, Select, RichTextEditor } from '@/components/ui';
import { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Course } from '@/types/resume';

interface CourseFormData {
  name: string;
  institution: string;
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

interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface DraggableCourseItemProps {
  course: Course;
  index: number;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  moveCourse: (dragIndex: number, hoverIndex: number) => void;
  formatDateRange: (course: Course) => string;
}

const DraggableCourseItem: React.FC<DraggableCourseItemProps> = ({
  course,
  index,
  onEdit,
  onDelete,
  moveCourse,
  formatDateRange
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
    accept: 'course',
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

      moveCourse(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'course',
    item: () => {
      return { id: course.id, index };
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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{course.name}</h4>
            <p className="text-sm text-gray-600">{course.institution}</p>
            <p className="text-xs text-gray-500">{formatDateRange(course)}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(course)}
            className="btn-icon"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(course.id)}
            className="btn-icon text-red-600 hover:text-red-700"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      {course.description && (
        <div 
          className="text-sm text-gray-700 mt-2" 
          dangerouslySetInnerHTML={{ __html: course.description }}
        />
      )}
    </div>
  );
};

export const CoursesSection: React.FC = () => {
  const { resumeData, addCourse, updateCourse, deleteCourse, reorderCourses } = useResumeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    institution: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    ongoing: false,
    description: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      institution: '',
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
    if (!formData.name || !formData.institution || !formData.startMonth || !formData.startYear) return;

    if (editingId) {
      updateCourse(editingId, formData);
    } else {
      addCourse(formData);
    }
    resetForm();
  };

  const handleEdit = (course: Course) => {
    setFormData({
      name: course.name,
      institution: course.institution,
      startMonth: course.startMonth,
      startYear: course.startYear,
      endMonth: course.endMonth,
      endYear: course.endYear,
      ongoing: course.ongoing,
      description: course.description
    });
    setEditingId(course.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    deleteCourse(id);
  };

  const moveCourse = (dragIndex: number, hoverIndex: number) => {
    const draggedCourse = resumeData.courses[dragIndex];
    const newCourses = [...resumeData.courses];
    newCourses.splice(dragIndex, 1);
    newCourses.splice(hoverIndex, 0, draggedCourse);
    reorderCourses(newCourses);
  };

  const handleFieldChange = (field: keyof CourseFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDateRange = (course: Course) => {
    const startDate = `${monthOptions.find(m => m.value === course.startMonth)?.label} ${course.startYear}`;
    if (course.ongoing) {
      return `${startDate} - Present`;
    }
    const endDate = course.endMonth && course.endYear 
      ? `${monthOptions.find(m => m.value === course.endMonth)?.label} ${course.endYear}`
      : '';
    return endDate ? `${startDate} - ${endDate}` : startDate;
  };

  return (
    <div className="space-y-4">
      {/* Existing Course Entries */}
      {resumeData.courses.map((course, index) => (
        <DraggableCourseItem
          key={course.id}
          course={course}
          index={index}
          onEdit={handleEdit}
          onDelete={handleDelete}
          moveCourse={moveCourse}
          formatDateRange={formatDateRange}
        />
      ))}

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="border border-primary-200 rounded-lg p-4 bg-primary-50">
          <div className="space-y-4">
            <Input
              label="Course Name"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="e.g., Advanced JavaScript Development"
              required
            />

            <Input
              label="Institution"
              value={formData.institution}
              onChange={(e) => handleFieldChange('institution', e.target.value)}
              placeholder="e.g., Coursera, Udemy, University Name"
              required
            />

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
              <span className="ml-2 text-sm text-gray-700">Currently taking this course</span>
            </label>

            <RichTextEditor
              label="Description"
              value={formData.description}
              onChange={(value) => handleFieldChange('description', value)}
              placeholder="Describe the course content, skills learned, or achievements..."
              minHeight={100}
            />

            <div className="flex space-x-2">
              <Button onClick={handleSubmit} disabled={!formData.name || !formData.institution || !formData.startMonth || !formData.startYear}>
                {editingId ? 'Update' : 'Add'} Course
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
          + Add Course
        </button>
      )}
    </div>
  );
};